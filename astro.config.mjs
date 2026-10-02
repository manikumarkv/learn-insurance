// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://docs.astro.build/en/reference/configuration-reference/
// Pages are static by default. A page that needs per-request data (sign-in, admin)
// opts out with `export const prerender = false` and runs as a Vercel function.
export default defineConfig({
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every build (e.g. learn-insurance.vercel.app).
  site: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
