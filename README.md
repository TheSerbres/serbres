# SERBRES

Personal brand site for Sammie Robinson. One creator, many properties, one mark.

Built with Next.js (static export), React, and Tailwind CSS. Dark theme by default with a light toggle; the electric-teal accent is reserved for actions.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Edit content

All copy and links live in [`src/lib/site.ts`](src/lib/site.ts) — name, greeting, roles, tagline, About paragraphs, properties, CTA, and social links. No component edits needed.

## Build

```bash
npm run build    # static export to ./out
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages. The site is served from a project subpath (`/serbres`), configured via `basePath` in `next.config.ts`.
