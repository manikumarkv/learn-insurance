// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { loadRedirects } from './src/content/redirects.ts';
import { termLastModified } from './src/content/lastModified.ts';

// Pages kept out of search engines (they also have a noindex meta tag).
const NOT_IN_SITEMAP = ['/search', '/design', '/404', '/sign-in', '/sign-up', '/account', '/403'];
const lastModified = termLastModified();

// Keystatic saves to local files (default) or, with KEYSTATIC_STORAGE=github, commits to GitHub.
// The editor (/keystatic) runs on the dev server, and in production only in GitHub mode.
// Setup: docs/keystatic-github-mode.md
const isDev = process.argv.includes('dev');
const keystaticStorage = process.env.KEYSTATIC_STORAGE === 'github' ? 'github' : 'local';
const withKeystatic = isDev || keystaticStorage === 'github';

// Clerk runs only when its publishable key is set (Vercel, or .env locally). Without it (CI, a fresh
// clone) the build swaps in stand-ins from src/features/account/clerk-off/: "Sign in" shows, and the
// sign-in page says sign-in isn't set up. Otherwise Clerk's script would fail on every page.
try {
  process.loadEnvFile(); // .env for local builds; Vercel sets real environment variables.
} catch {
  // No .env file.
}
// Clerk's Vercel integration names the key NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY; Astro reads PUBLIC_*.
process.env.PUBLIC_CLERK_PUBLISHABLE_KEY ||=
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY || '';
const withClerk = Boolean(process.env.PUBLIC_CLERK_PUBLISHABLE_KEY);
const clerkOff = (/** @type {string} */ file) =>
  new URL(`./src/features/account/clerk-off/${file}`, import.meta.url).pathname;

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
    // Sign-in (story 6.1). Keys: PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.
    ...(withClerk
      ? [
          clerk({
            signInUrl: '/sign-in',
            signUpUrl: '/sign-up',
            // Match the Clear Blue design (src/styles/tokens.css).
            appearance: {
              variables: {
                colorPrimary: '#1f5eff',
                fontFamily: 'Figtree, "Helvetica Neue", Arial, sans-serif',
                borderRadius: '12px',
              },
            },
          }),
        ]
      : []),
    react(),
    sitemap({
      // Learn cards repeat the term pages, so only the term pages are listed.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        return !NOT_IN_SITEMAP.includes(path) && !path.includes('/learn/');
      },
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
    resolve: {
      alias: withClerk
        ? {}
        : {
            '@clerk/astro/components': clerkOff('components.ts'),
            '@clerk/astro/client': clerkOff('client.ts'),
            '@clerk/astro/server': clerkOff('server.ts'),
          },
    },
    // keystatic.config.ts runs in the browser too, so pass the mode in at build time.
    define: { 'import.meta.env.KEYSTATIC_STORAGE': JSON.stringify(keystaticStorage) },
  },
});
