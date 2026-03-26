# My Portfolio

A personal portfolio website built with Next.js.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Sanity Studio (CMS)

## Project Structure

- `src/app/` - Pages and layouts
- `src/components/` - Reusable components
- `src/data/` - JSON fallback content (local backup)
- `src/lib/sanity/` - Sanity client, queries, types, fallback mapping
- `sanity/` - Sanity schema and Studio structure
- `scripts/seed-sanity.mjs` - One-time migration script from JSON to Sanity
- `public/` - Static assets

## Sanity CMS Setup

1. Create a Sanity account and project from https://www.sanity.io/manage.
2. Create dataset (usually `production`).
3. Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_STUDIO_PROJECT_ID`
   - `SANITY_STUDIO_DATASET`
   - `SANITY_STUDIO_HOST` (optional but recommended for stable hosted Studio URL)
   - `SANITY_API_WRITE_TOKEN` (needed for seed script)
4. Seed existing JSON data into Sanity:
   - `npm run sanity:seed`
5. Deploy Studio (Sanity hosted):
   - `npm run sanity:deploy`
   - choose a `*.sanity.studio` hostname when prompted (or set `SANITY_STUDIO_HOST`)
6. Open your Sanity-hosted dashboard at `https://<your-host>.sanity.studio`
7. Use that dashboard to edit data, upload resume PDF, and change logos/images.

## Build-Time Generation + Redeploy Flow

This project keeps build-time generation. Content updates are done in Sanity, and publish events should trigger Vercel rebuild.

1. In Vercel project settings, create a **Deploy Hook** for your production branch.
2. In Sanity Manage → API → Webhooks, create webhook:
   - URL: your Vercel Deploy Hook URL
   - Method: `POST`
   - Trigger on: create, update, delete
   - Filter: `_type in ["profile","socials","project","experience"]`
   - Drafts disabled (publish-only triggers)
3. Save and publish content in Sanity-hosted Studio.
4. Vercel rebuilds, and new content appears in the generated site.

## Credentials / Secrets You Need

- **Sanity project ID**
- **Sanity dataset name**
- **Sanity API write token** (for migration script)
- **Optional Sanity read token** (if dataset is private)
- **Vercel Deploy Hook URL** (treat as secret)
