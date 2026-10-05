// Frontend-only data layer — no backend server needed.
// - Settings & services are static (src/data.ts).
// - Projects are listed straight from a PUBLIC Google Drive folder using a
//   browser-safe, referrer-restricted API key (never a service-account key).
// - Contact form posts straight to the Google Apps Script web app.
import type { Inquiry, Project, Service, Settings } from '../types';
import { fallbackProjects, fallbackServices, fallbackSettings } from '../data';

const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY as string | undefined;
const DRIVE_FOLDER_ID = (import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID as string | undefined) || '1rpdCfYYysaHdke9UaJg07tCjWyRQomBG';
const SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string | undefined;

export const getSettings = async (): Promise<Settings> => fallbackSettings;
export const getServices = async (): Promise<Service[]> => fallbackServices.filter(s => s.active);

/** Direct, range-request-capable stream URL for a public Drive file. */
export const driveStreamUrl = (fileId: string) =>
  `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${DRIVE_API_KEY}`;
/** Drive's own embedded player — used as a fallback if direct streaming fails. */
export const drivePreviewUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;

type DriveFile = { id?: string; name?: string; mimeType?: string };

async function listDrive(q: string): Promise<DriveFile[]> {
  const params = new URLSearchParams({ q, fields: 'files(id,name,mimeType)', orderBy: 'name', pageSize: '200', key: DRIVE_API_KEY! });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) throw new Error(`Drive list failed (${res.status})`);
  return ((await res.json()).files || []) as DriveFile[];
}

const thumbnails = [
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85'
];

let cache: Promise<Project[]> | null = null;

async function fetchProjectsFromDrive(): Promise<Project[]> {
  if (!DRIVE_API_KEY) throw new Error('VITE_GOOGLE_DRIVE_API_KEY is not set');
  const folders = await listDrive(`'${DRIVE_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  // Fetch every category folder in parallel (the old server did this one by one).
  const perFolder = await Promise.all(folders.filter(f => f.id && f.name).map(async f => ({
    category: f.name!,
    files: await listDrive(`'${f.id}' in parents and mimeType contains 'video/' and trashed = false`)
  })));
  const projects: Project[] = [];
  let index = 1;
  for (const { category, files } of perFolder) {
    for (const file of files) {
      if (!file.id || !file.name) continue;
      const rawName = file.name.lastIndexOf('.') > 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
      const title = rawName.replace(/[_-]/g, ' ').trim();
      const url = driveStreamUrl(file.id);
      projects.push({
        id: file.id, _id: file.id, title, name: title,
        slug: rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category,
        description: `Cinematic ${category.toLowerCase()} video edit showcasing premium post-production.`,
        thumbnail: thumbnails[(index - 1) % thumbnails.length],
        mediaUrl: url, videoUrl: url, mediaType: 'video', mimeType: file.mimeType, fileId: file.id,
        platform: 'drive', featured: true, order: index++
      });
    }
  }
  if (!projects.length) throw new Error('No videos found in Drive folder');
  return projects;
}

export const getProjects = (): Promise<Project[]> => {
  cache ??= fetchProjectsFromDrive().catch(err => {
    console.warn('Google Drive fetch failed, using fallback projects:', err);
    return fallbackProjects;
  });
  return cache;
};
export const getFeaturedProjects = async () => (await getProjects()).filter(p => p.featured);

// ---- Contact form ---------------------------------------------------------
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(d: Inquiry): Inquiry {
  const t = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const data: Inquiry = { name: t(d.name), email: t(d.email), company: t(d.company) || undefined, projectType: t(d.projectType) || undefined, message: t(d.message) };
  if (data.name.length < 2 || data.name.length > 100) throw new Error('Please enter your name (2–100 characters).');
  if (!emailRe.test(data.email) || data.email.length > 254) throw new Error('Please enter a valid email address.');
  if ((data.company?.length ?? 0) > 100) throw new Error('Company name is too long.');
  if (data.message.length < 10 || data.message.length > 3000) throw new Error('Message must be 10–3000 characters.');
  return data;
}

let lastSubmit = 0;
export async function submitContact(raw: Inquiry & { website?: string }): Promise<{ message: string }> {
  // Honeypot: real users never fill the hidden "website" field. Pretend success for bots.
  if (raw.website) return { message: 'Inquiry received' };
  // Light client-side throttle (the Apps Script should also guard against spam).
  if (Date.now() - lastSubmit < 30_000) throw new Error('Please wait a moment before sending another message.');
  const data = validate(raw);
  if (!SHEETS_WEBHOOK_URL) throw new Error('Contact form is not configured.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    // text/plain = "simple" request, so no CORS preflight (Apps Script can't answer one).
    // The body is still JSON; the script reads it via JSON.parse(e.postData.contents).
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      signal: controller.signal,
      redirect: 'follow'
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw new Error('Couldn’t submit right now. Please try again shortly.');
  } finally {
    clearTimeout(timeout);
  }
  lastSubmit = Date.now();
  return { message: 'Inquiry received' };
}
