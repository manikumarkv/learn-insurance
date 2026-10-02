// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { loadRedirects } from './src/content/redirects.ts';
import { termLastModified } from './src/content/lastModified.ts';

// Pages kept out of search engines (they also have a noindex meta tag).
const NOT_IN_SITEMAP = ['/search', '/design', '/404'];
const lastModified = termLastModified();

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
  integrations: [
    react(),
    sitemap({
      filter: (page) => !NOT_IN_SITEMAP.includes(new URL(page).pathname.replace(/\/$/, '')),
      // Same URL form as the canonical links: no trailing slash (except the home page).
      serialize: (item) => {
        const url = new URL(item.url);
        url.pathname = url.pathname.replace(/(.)\/$/, '$1');
        const updated = lastModified.get(url.pathname);
        return { ...item, url: url.toString(), ...(updated ? { lastmod: updated } : {}) };
      },
    }),
    ...(withKeystatic ? [keystatic()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
    // keystatic.config.ts runs in the browser too, so pass the mode in at build time.
    define: { 'import.meta.env.KEYSTATIC_STORAGE': JSON.stringify(keystaticStorage) },
  },
});
