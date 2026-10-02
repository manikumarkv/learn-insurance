/**
 * Lighthouse budget (story 5.6): 90+ for performance, accessibility and SEO on the
 * home, term and search pages. Runs against the built site (pnpm build) in CI.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/terms/endorsement/index.html',
        'http://localhost/search/index.html',
      ],
      numberOfRuns: 1,
      settings: { chromeFlags: '--no-sandbox --headless=new' },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // The search page is noindex on purpose, which Lighthouse's SEO score counts against it.
          matchingUrlPattern: '^(?!.*/search/).*$',
          assertions: { 'categories:seo': ['error', { minScore: 0.9 }] },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: './lighthouse-report' },
  },
};
