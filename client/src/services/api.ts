import type { Inquiry, Project, Service, Settings } from '../types';
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${base}${path}`, { headers: { 'Content-Type': 'application/json' }, ...init }); if (!response.ok) { let msg = 'Request failed'; try { const json = await response.json(); if (json.message) msg = json.message; } catch {} throw new Error(msg); } return response.json() as Promise<T>; }
export const getSettings = () => request<Settings>('/settings');
export const getServices = () => request<Service[]>('/services');
export const getFeaturedProjects = () => request<Project[]>('/projects/featured');
export const submitContact = (data: Inquiry) => request<{ message: string }>('/contact', { method: 'POST', body: JSON.stringify(data) });
