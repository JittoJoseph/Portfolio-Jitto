# Portfolio

[![Live Demo](https://img.shields.io/badge/Live_Demo-jittojoseph.xyz-007acc)](https://www.jittojoseph.xyz/)

[![Frontend Build](https://img.shields.io/github/checks-status/JittoJoseph/Portfolio-Jitto/master?label=frontend)](https://github.com/JittoJoseph/Portfolio-Jitto/deployments)

A personal portfolio website built with Next.js and Sanity CMS. Showcases projects, experience, and provides an easy way to manage content through a headless CMS.

## Features

- Responsive design with modern UI
- Project showcase with live links
- Experience timeline
- Social media integration
- Content managed via Sanity Studio
- On-demand ISR updates from Sanity without redeploying

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity

## Sanity Content Updates

Set `SANITY_WEBHOOK_SECRET` in Vercel, then point the Sanity publish webhook to:

```text
https://<your-domain>/api/revalidate?secret=<SANITY_WEBHOOK_SECRET>
```

Use `POST` requests. The route invalidates the cached portfolio data and the
affected pages (`/` and `/projects`), so the next request regenerates fresh
server-rendered HTML without a Vercel rebuild.
