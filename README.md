# Goch Website

React/Vite portfolio with a Vercel serverless admin backend.

## Backend Setup

Create a Neon database, then add these values to a local `.env` file and to
your Vercel project settings:

```bash
DATABASE_URL="postgres://..."
ADMIN_TOKEN="a-long-random-token-used-to-log-in"
SESSION_SECRET="a-long-random-secret-for-signing-admin-cookies"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

`ADMIN_TOKEN` is what you enter at `/admin`. `SESSION_SECRET` should be a
different long random value.

Run the repo-managed migrations against Neon:

```bash
npm run migrate:up
```

Useful migration commands:

```bash
npm run migrate:down
npm run migrate:redo
npm run migrate:create -- add-new-field
```

Migrations live in `database/migrations`. They are applied through
`node-pg-migrate`, which reads `DATABASE_URL` from `.env` or your shell.

## Content Flow

- Public pages read projects from `GET /api/projects`.
- Public profile text reads from `GET /api/profile`.
- `/admin` manages projects and profile content after token login.
- Project logos upload to Vercel Blob.
- Neon stores the image URL and Blob key, not the image file itself.
- The profile portrait is a static bundled asset at `src/assets/gorazd-profile.png`.
- If database content cannot be loaded, the UI shows an error message.
