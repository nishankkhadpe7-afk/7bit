import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Only these exact variables are exposed to the browser bundle (they're public by design).
// Never add secrets (e.g. service-account keys) to this list.
const PUBLIC_VARS = ['GOOGLE_DRIVE_API_KEY', 'GOOGLE_DRIVE_FOLDER_ID', 'GOOGLE_SHEETS_WEBHOOK_URL'];

export default defineConfig(({ mode }) => {
  // Reads client/.env locally, and Vercel's Environment Variables (process.env) on deploy.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const define = Object.fromEntries(
    PUBLIC_VARS.map(name => [`import.meta.env.${name}`, JSON.stringify(env[name] ?? '')])
  );
  return { plugins: [react(), tailwindcss()], define };
});
