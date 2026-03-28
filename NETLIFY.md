Netlify deploy settings for this repo:

- Build command: `npm run build`
- Publish directory: `out`
- Node version: `20`
- Functions directory: `netlify/functions`

This site is configured as a static Next export:

- `next.config.mjs` uses `output: "export"`
- `netlify.toml` publishes `out`
- Netlify functions handle lesson-request email delivery

Lesson requests:

- The lessons page posts to `/.netlify/functions/lesson-request`
- That function sends mail through Resend
- Required Netlify environment variables:
  - `RESEND_API_KEY`
  - `LESSON_REQUEST_FROM`
  - `LESSON_REQUEST_TO`
- Recommended sender: `lessons@jeffberlinmusicgroup.com`
- `LESSON_REQUEST_FROM` must use the exact domain you verify in Resend
- `LESSON_REQUEST_TO` should be `actualjeffberlin@gmail.com`

Important:

- Do not add `@netlify/plugin-nextjs` back to this project unless the site is moved away from static export.
- Do not set the publish directory to the repo root.
