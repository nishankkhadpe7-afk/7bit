import { Router } from 'express';
import { z } from 'zod';

// Static Data definitions
const staticProjects = [
  {
    id: 'b74e73d3bc165782c2f42a33',
    _id: 'b74e73d3bc165782c2f42a33',
    title: 'The Shape of Motion',
    slug: 'shape-of-motion',
    category: 'Brand Film',
    description: 'A textured campaign film built around movement and material.',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=90',
    mediaType: 'image',
    platform: 'external',
    featured: true,
    order: 1
  },
  {
    id: 'a8c067b3fc09180f1a3bab4c',
    _id: 'a8c067b3fc09180f1a3bab4c',
    title: 'After Hours',
    slug: 'after-hours',
    category: 'Social Campaign',
    description: 'A kinetic social series for a city that never pauses.',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=90',
    mediaType: 'image',
    platform: 'external',
    featured: true,
    order: 2
  },
  {
    id: '35ca99cf081f9f392a2ae722',
    _id: '35ca99cf081f9f392a2ae722',
    title: 'In the Cut',
    slug: 'in-the-cut',
    category: 'Product Story',
    description: 'A precise visual language for an ambitious product launch.',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=90',
    mediaType: 'image',
    platform: 'external',
    featured: true,
    order: 3
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
    LinkedIn: '#'
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

// Route structures
export const projects = Router();
projects.get('/', (_, res) => {
  res.json(staticProjects);
});
projects.get('/featured', (_, res) => {
  res.json(staticProjects.filter(p => p.featured));
});
projects.get('/:slug', (req, res) => {
  const project = staticProjects.find(p => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
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
