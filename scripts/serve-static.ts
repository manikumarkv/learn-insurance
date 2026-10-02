/*
 * Serves the built static site (dist/client/) for browser tests and local previews.
 * `astro preview` can't run with the Vercel adapter once a page is rendered on request
 * (/account), so this serves the static pages and the 404 page like Vercel does.
 * Pages rendered on request need `pnpm dev`.
 */
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import sirv from 'sirv';

const port = Number(process.env.PORT ?? 4321);
const notFound = readFileSync('dist/client/404.html');
const assets = sirv('dist/client', { extensions: ['html'], dev: false });

createServer((req, res) => {
  assets(req, res, () => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(notFound);
  });
}).listen(port, () => {
  console.log(`Serving dist/client/ at http://localhost:${port}`);
});
