import type { Project, Service, Settings } from './types';
export const fallbackSettings: Settings = { companyName: '7bit Media', tagline: 'We Edit. You Inspire.', hero: { eyebrow: 'PROFESSIONAL VIDEO EDITING', heading: 'We Edit.\nYou Inspire.', copy: '7bit Media delivers cinematic video editing that elevates your brand and tells your story with impact.', mediaUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1800&q=85', poster: '', mediaType: 'image' }, contact: { email: '7bit.media.co@gmail.com', location: 'Working globally' }, socialLinks: { Instagram: 'https://www.instagram.com/7bit.media', YouTube: '#', LinkedIn: '#', Discord: 'https://discord.gg/6FbzjEtcjQ' }, statistics: [{ value: 100, suffix: '+', label: 'Projects Completed' }, { value: 10, suffix: '+', label: 'Happy Clients' }, { value: 1, suffix: '+', label: 'Years of Experience' }], seo: { title: '7bit Media — Professional Video Editing', description: 'Cinematic video editing and post-production for brands, businesses and creators.' } };
delete fallbackSettings.socialLinks.Vimeo;

export const fallbackServices: Service[] = [
    { title: 'Corporate Videos', description: 'Polished films that turn your company story into clear, compelling communication.', icon: 'Frame', order: 1, active: true },
    { title: 'Social Media Content', description: 'Fast-moving, native edits designed to stop the scroll and build attention.', icon: 'Sparkles', order: 2, active: true },
    { title: 'Promotional Videos', description: 'Campaign-ready storytelling with impact, rhythm and a distinctive finish.', icon: 'Clapperboard', order: 3, active: true },
    { title: 'Color Grading', description: 'Cinematic color pipelines that give every frame mood, depth and consistency.', icon: 'Palette', order: 4, active: true }
];
export const fallbackProjects: Project[] = [
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
