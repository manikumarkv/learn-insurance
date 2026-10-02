// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { loadRedirects } from './src/content/redirects.ts';

// Keystatic saves to local files (default) or, with KEYSTATIC_STORAGE=github, commits to GitHub.
// The editor (/keystatic) runs on the dev server, and in production only in GitHub mode.
// Setup: docs/keystatic-github-mode.md
const isDev = process.argv.includes('dev');
const keystaticStorage = process.env.KEYSTATIC_STORAGE === 'github' ? 'github' : 'local';
const withKeystatic = isDev || keystaticStorage === 'github';

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
  integrations: [react(), ...(withKeystatic ? [keystatic()] : [])],
  vite: {
    plugins: [tailwindcss()],
    // keystatic.config.ts runs in the browser too, so pass the mode in at build time.
    define: { 'import.meta.env.KEYSTATIC_STORAGE': JSON.stringify(keystaticStorage) },
  },
});
