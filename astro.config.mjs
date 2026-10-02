// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { loadRedirects } from './src/content/redirects.ts';

// The Keystatic editor (/keystatic) is only added to the dev server for now, so production
// has no editor. TODO(story 2.5): also add it in production when KEYSTATIC_STORAGE=github.
const isDev = process.argv.includes('dev');

// https://docs.astro.build/en/reference/configuration-reference/
// Pages are static by default. A page that needs per-request data (sign-in, admin)
// opts out with `export const prerender = false` and runs as a Vercel function.
export default defineConfig({
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every build (e.g. learn-insurance.vercel.app).
  site: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321',
  adapter: vercel(),
  // Old IDs and /terms/<abbreviation> → term pages (301). See src/content/redirects.ts.
  redirects: loadRedirects(),
  integrations: [react(), ...(isDev ? [keystatic()] : [])],
  vite: {
    plugins: [tailwindcss()],
  },
});
