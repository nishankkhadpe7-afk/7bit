export type MediaType = 'image' | 'video' | 'youtube' | 'vimeo';
export interface Project { _id?: string; title: string; slug: string; category: string; description: string; thumbnail: string; mediaUrl: string; mediaType: MediaType; platform: string; externalUrl?: string; featured: boolean; order: number; }
export interface Service { _id?: string; title: string; description: string; icon: string; order: number; active: boolean; }
export interface Settings { companyName: string; tagline: string; hero: { eyebrow: string; heading: string; copy: string; mediaUrl: string; poster: string; mediaType: MediaType }; contact: { email: string; phone?: string; location?: string }; socialLinks: Record<string, string>; statistics: { value: number; suffix: string; label: string }[]; seo: { title: string; description: string }; }
export interface Inquiry { name: string; email: string; company?: string; projectType?: string; message: string; }
