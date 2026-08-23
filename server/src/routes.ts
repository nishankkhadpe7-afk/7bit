import { Router } from 'express';
import { z } from 'zod';

// Static Data definitions
const staticProjects = [
  {
    id: 'b74e73d3bc165782c2f42a33',
    _id: 'b74e73d3bc165782c2f42a33',
    title: 'Quantum Finance Dashboard',
    name: 'Quantum Finance Dashboard',
    slug: 'quantum-finance',
    category: 'Finance',
    description: 'A sleek cinematic visualization of live market data analytics and financial trends.',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-financial-graphics-40409-large.mp4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-financial-graphics-40409-large.mp4',
    mediaType: 'video',
    mimeType: 'video/mp4',
    platform: 'external',
    featured: true,
    order: 1
  },
  {
    id: 'a8c067b3fc09180f1a3bab4c',
    _id: 'a8c067b3fc09180f1a3bab4c',
    title: 'The Creative Corner Podcast',
    name: 'The Creative Corner Podcast',
    slug: 'creative-corner-podcast',
    category: 'Podcast',
    description: 'A high-energy vertical edit capturing behind-the-scenes recording sessions.',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-vertically-in-front-of-a-computer-screen-40742-large.mp4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-vertically-in-front-of-a-computer-screen-40742-large.mp4',
    mediaType: 'video',
    mimeType: 'video/mp4',
    platform: 'external',
    featured: true,
    order: 2
  },
  {
    id: '35ca99cf081f9f392a2ae722',
    _id: '35ca99cf081f9f392a2ae722',
    title: 'Modernist Villa Tour',
    name: 'Modernist Villa Tour',
    slug: 'modernist-villa',
    category: 'Real Estate',
    description: 'Cinematic interior design walkthrough highlighting architectural lines and morning light.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-inside-of-a-modern-living-room-with-a-view-42171-large.mp4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-inside-of-a-modern-living-room-with-a-view-42171-large.mp4',
    mediaType: 'video',
    mimeType: 'video/mp4',
    platform: 'external',
    featured: true,
    order: 3
  },
  {
    id: '8c9d2f4e5a6b7c8d9e0f1a2b',
    _id: '8c9d2f4e5a6b7c8d9e0f1a2b',
    title: 'SaaS Workflow Optimization',
    name: 'SaaS Workflow Optimization',
    slug: 'saas-workflow',
    category: 'SaaS',
    description: 'A kinetic portrait-format user experience story demonstrating productivity apps.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scrolling-through-a-financial-app-on-a-smartphone-40767-large.mp4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scrolling-through-a-financial-app-on-a-smartphone-40767-large.mp4',
    mediaType: 'video',
    mimeType: 'video/mp4',
    platform: 'external',
    featured: true,
    order: 4
  },
  {
    id: '9d0e1f2a3b4c5d6e7f8a9b0c',
    _id: '9d0e1f2a3b4c5d6e7f8a9b0c',
    title: 'Storytelling with Motion',
    name: 'Storytelling with Motion',
    slug: 'storytelling-motion',
    category: 'Talking Head',
    description: 'A crisp, clean dialogue cut showing studio lighting and high production design.',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-filming-herself-with-a-smartphone-41005-large.mp4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-filming-herself-with-a-smartphone-41005-large.mp4',
    mediaType: 'video',
    mimeType: 'video/mp4',
    platform: 'external',
    featured: true,
    order: 5
  }
];

const staticServices = [
  { id: '1', _id: '1', title: 'Corporate Videos', description: 'Polished films that turn your company story into clear, compelling communication.', icon: 'Frame', order: 1, active: true },
  { id: '2', _id: '2', title: 'Social Media Content', description: 'Fast-moving, native edits designed to stop the scroll and build attention.', icon: 'Sparkles', order: 2, active: true },
  { id: '3', _id: '3', title: 'Promotional Videos', description: 'Campaign-ready storytelling with impact, rhythm and a distinctive finish.', icon: 'Clapperboard', order: 3, active: true },
  { id: '4', _id: '4', title: 'Color Grading', description: 'Cinematic color pipelines that give every frame mood, depth and consistency.', icon: 'Palette', order: 4, active: true }
];

const staticSettings = {
  id: 'a41cffb8a5cb7f774c23cae6',
  _id: 'a41cffb8a5cb7f774c23cae6',
  companyName: '7bit Media',
  tagline: 'We Edit. You Inspire.',
  hero: {
    eyebrow: 'PROFESSIONAL VIDEO EDITING',
    heading: 'We Edit.\nYou Inspire.',
    copy: '7bit Media delivers cinematic video editing that elevates your brand and tells your story with impact.',
    mediaUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1800&q=85',
    poster: '',
    mediaType: 'image'
  },
  contact: {
    email: '7bit.media.co@gmail.com',
    location: 'Working globally'
  },
  socialLinks: {
    Instagram: 'https://www.instagram.com/7bit.media',
    YouTube: '#',
    LinkedIn: '#',
    Discord: 'https://discord.gg/7bitmedia'
  },
  statistics: [
    { value: 300, suffix: '+', label: 'Projects Completed' },
    { value: 100, suffix: '+', label: 'Happy Clients' },
    { value: 5, suffix: '+', label: 'Years of Experience' }
  ],
  seo: {
    title: '7bit Media — Professional Video Editing',
    description: 'Cinematic video editing and post-production for brands, businesses and creators.'
  }
};

import { google } from 'googleapis';
import fs from 'fs';

let driveCache: any[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Google JWT Auth Setup Helper
function getGoogleAuth() {
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !privateKey) {
    try {
      const keyPath = 'C:\\7bit-drive-test\\service-account.json';
      if (fs.existsSync(keyPath)) {
        const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        email = keys.client_email;
        privateKey = keys.private_key;
      }
    } catch (err) {
      console.error('Failed to load local service account credentials:', err);
    }
  }

  if (!email || !privateKey) {
    throw new Error('Google Drive service account credentials are not configured');
  }

  const formattedKey = privateKey.replace(/\\n/g, '\n');

  return new google.auth.JWT({
    email,
    key: formattedKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
}

async function fetchProjectsFromDrive() {
  const now = Date.now();
  if (driveCache && (now - cacheTime < CACHE_DURATION)) {
    return driveCache;
  }

  const auth = getGoogleAuth();
  const drive = google.drive({ version: 'v3', auth });
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1rpdCfYYysaHdke9UaJg07tCjWyRQomBG';

  // 1. Get Category Folders
  const foldersResponse = await drive.files.list({
    q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name'
  });

  const categories = foldersResponse.data.files || [];
  const allProjects: any[] = [];
  let index = 1;

  // 2. Discover files in each folder
  for (const catFolder of categories) {
    const categoryName = catFolder.name;
    if (!categoryName || !catFolder.id) continue;

    const filesResponse = await drive.files.list({
      q: `'${catFolder.id}' in parents and mimeType contains 'video/' and trashed = false`,
      fields: 'files(id, name, mimeType)',
      orderBy: 'name'
    });

    const files = filesResponse.data.files || [];
    for (const file of files) {
      if (!file.id || !file.name) continue;

      const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const cleanName = rawName.replace(/[_-]/g, ' ').trim();
      const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Assign default unsplash placeholder based on category index
      const thumbnails = [
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85'
      ];
      const thumbnail = thumbnails[(index - 1) % thumbnails.length];

      allProjects.push({
        id: file.id,
        _id: file.id,
        title: cleanName,
        name: cleanName,
        slug: slug,
        category: categoryName,
        description: `Cinematic ${categoryName.toLowerCase()} video edit showcasing premium post-production.`,
        thumbnail: thumbnail,
        mediaUrl: `/api/projects/stream/${file.id}`,
        videoUrl: `/api/projects/stream/${file.id}`,
        mediaType: 'video',
        mimeType: file.mimeType,
        fileId: file.id,
        platform: 'external',
        featured: true,
        order: index++
      });
    }
  }

  driveCache = allProjects;
  cacheTime = now;
  return allProjects;
}

// Route structures
export const projects = Router();

projects.get('/', async (_, res, next) => {
  try {
    const list = await fetchProjectsFromDrive();
    res.json(list);
  } catch (e: any) {
    console.error('Google Drive Fetch Error, serving staticProjects fallback:', e.message || e);
    res.json(staticProjects);
  }
});

projects.get('/featured', async (_, res, next) => {
  try {
    const list = await fetchProjectsFromDrive();
    res.json(list.filter(p => p.featured));
  } catch (e: any) {
    console.error('Google Drive Fetch Error, serving staticProjects fallback:', e.message || e);
    res.json(staticProjects.filter(p => p.featured));
  }
});

// Stream proxy with Range request support for Safari/iOS compatibility
projects.get('/stream/:fileId', async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const range = req.headers.range;

    const auth = getGoogleAuth();
    const tokenResponse = await auth.getAccessToken();
    const accessToken = tokenResponse.token;

    if (!accessToken) {
      throw new Error('Failed to retrieve Google Drive access token');
    }

    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const requestHeaders: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`
    };
    if (range) {
      requestHeaders['Range'] = range;
    }

    const driveRes = await fetch(url, { headers: requestHeaders });

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      console.error(`Google Drive Stream Error [Status ${driveRes.status}]:`, errText);
      return res.status(driveRes.status).send(errText);
    }

    // Forward headers from Google Drive
    res.status(driveRes.status);
    
    const contentRange = driveRes.headers.get('content-range');
    if (contentRange) res.setHeader('Content-Range', contentRange);
    
    const acceptRanges = driveRes.headers.get('accept-ranges');
    if (acceptRanges) res.setHeader('Accept-Ranges', acceptRanges);
    
    const contentType = driveRes.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'video/mp4');
    
    const contentLength = driveRes.headers.get('content-length');
    if (contentLength) res.setHeader('Content-Length', contentLength);

    if (driveRes.body) {
      const { Readable } = require('stream');
      const nodeReadable = Readable.fromWeb(driveRes.body as any);
      nodeReadable.pipe(res);
    } else {
      res.end();
    }
  } catch (e) {
    next(e);
  }
});

projects.get('/:slug', async (req, res, next) => {
  try {
    const list = await fetchProjectsFromDrive();
    const item = list.find(p => p.slug === req.params.slug);
    if (!item) return res.status(404).json({ message: 'Project not found' });
    res.json(item);
  } catch (e) {
    const item = staticProjects.find(p => p.slug === req.params.slug);
    if (!item) return res.status(404).json({ message: 'Project not found' });
    res.json(item);
  }
});

export const services = Router();
services.get('/', (_, res) => {
  res.json(staticServices.filter(s => s.active));
});

export const settings = Router();
settings.get('/', (_, res) => {
  res.json(staticSettings);
});

// Contact route
const contactBody = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(100).optional(),
  projectType: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10).max(3000)
});

export const contacts = Router();
contacts.post('/', async (req, res, next) => {
  try {
    const validatedData = contactBody.parse(req.body);

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('GOOGLE_SHEETS_WEBHOOK_URL environment variable is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    if (webhookUrl.includes('mock_url')) {
      console.log('Mock Webhook received inquiry:', validatedData);
      return res.status(201).json({ message: 'Inquiry received' });
    }

    // Call Google Apps Script Web App with a timeout of 10s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Google Apps Script returned status: ${response.status}`);
      }

      const result = (await response.json()) as { success: boolean; error?: string };
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit to Google Sheet');
      }
    } catch (webhookErr: any) {
      clearTimeout(timeoutId);
      console.error('Failed to submit form to Google Sheet webhook:', webhookErr.message || webhookErr);
      return res.status(502).json({ message: 'Failed to record inquiry in database' });
    }

    res.status(201).json({ message: 'Inquiry received' });
  } catch (e) {
    next(e);
  }
});
