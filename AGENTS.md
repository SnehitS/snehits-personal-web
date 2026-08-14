# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static personal portfolio website** deployed on Vercel. There is no build system, no `package.json`, no tests, and no lint config. The site is just:

- `index.html` — the single page (all sections are anchor links within it)
- `styles.css` — styling
- `Headshots-133.jpg` — profile image
- `vercel.json` — Vercel config (`cleanUrls: true`)

### Running it (development)

There are no dependencies to install. Serve the repo root with any static file server, e.g.:

```
python3 -m http.server 3000
```

Then open `http://localhost:3000/`. Everything (HTML/CSS/image) is served from the repo root, matching how Vercel serves it in production.

### Notes / gotchas

- No lint / test / build steps exist. "Building and running" == serving the static files.
- `python3 -m http.server` does not honor `vercel.json`'s `cleanUrls`, but that setting is irrelevant here since there is only a single `index.html` at the root.
- To match Vercel behavior more closely you could use `npx vercel dev`, but that pulls in the Vercel CLI and is unnecessary for local viewing of this static site.
