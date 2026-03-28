Netlify deploy settings for this repo:

- Build command: `npm run build`
- Publish directory: leave blank
- Functions directory: leave blank
- Node version: `20`

This repo already includes:

- `@netlify/plugin-nextjs`
- `netlify.toml`
- `.nvmrc`
- `package.json` engines for Node 20

Important:

- Do not set the publish directory to the repo root.
- Do not set the publish directory to `.next`.
- Let `@netlify/plugin-nextjs` manage the output.

If Netlify still shows a 404 page after deploy:

1. Confirm the deploy log shows `@netlify/plugin-nextjs` running.
2. Confirm the deployed commit SHA matches the latest pushed commit.
3. Clear the Netlify deploy cache and redeploy.
4. Check that the Netlify UI has not overridden the publish directory.
