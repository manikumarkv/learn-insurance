# Keystatic GitHub mode

Keystatic has two save modes, switched with the `KEYSTATIC_STORAGE` environment variable:

| Mode | `KEYSTATIC_STORAGE` | Where the editor runs | What "Save" does |
|---|---|---|---|
| Local (default) | `local` or unset | `pnpm dev` only, at http://localhost:4321/keystatic | Writes the file on disk. You commit it like code. |
| GitHub | `github` | Also on the live site, at `/keystatic` | Commits the change to the repo. |

In GitHub mode, anyone who opens `/keystatic` must sign in with GitHub and needs write access to `manikumarkv/learn-insurance`. Everyone else can't edit.

GitHub mode commits through a GitHub App, so the edit goes through the same branch, CI and Vercel deploy as any other change.

## One-time setup

You need a GitHub App that lets Keystatic sign people in and commit. Keystatic can create it for you.

1. **Run Keystatic locally in GitHub mode.** In your local `.env`, set:
   ```
   KEYSTATIC_STORAGE=github
   ```
   Then run `pnpm dev` and open http://localhost:4321/keystatic.
2. **Create the GitHub App.** Keystatic shows a "Create GitHub App" form.
   - Pick the repo owner (`manikumarkv`) and a name, e.g. `learninsurance-keystatic`.
   - Submit. GitHub creates the app, and Keystatic writes four values into your `.env`:
     - `KEYSTATIC_GITHUB_CLIENT_ID`
     - `KEYSTATIC_GITHUB_CLIENT_SECRET`
     - `KEYSTATIC_SECRET`
     - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
3. **Install the app on the repo.** In GitHub, open *Settings → Applications → (the new app) → Install*. Choose only `learn-insurance`.
4. **Add the callback URL for the live site.** In the app's settings, under *Callback URL*, add:
   ```
   https://<your production domain>/api/keystatic/github/oauth/callback
   ```
   Keep the localhost one for local use.
5. **Set the variables in Vercel.**
   - Go to *Project → Settings → Environment Variables*.
   - Add the four values from your `.env`, plus `KEYSTATIC_STORAGE=github`, for **Production**.
   - Leave Preview on `local`, so preview deploys have no editor.
6. **Redeploy.** `/keystatic` on the live site now asks for GitHub sign-in.

Never commit `.env`. It's gitignored.

## Switching back

Remove `KEYSTATIC_STORAGE` (or set it to `local`) in Vercel and redeploy. The live site then has no editor.
