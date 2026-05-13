# game of life.

A local-first personal productivity app. Track goals and subgoals, log daily tasks and reflections, monitor a cutting deficit, and watch your rank tick up the longer you stay consistent. All data lives in `localStorage` — no backend, no account.

## Stack

- Vite 5 + React 18 (no TypeScript)
- `react-router-dom` for navigation
- `vite-plugin-pwa` for installable PWA support
- Plain CSS, design tokens in `src/index.css`

## Run locally

```bash
npm install
npm run dev
```

Then open the printed URL (typically http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

`build` produces a static bundle in `dist/`. `preview` serves that build locally.

## Deploy to Netlify

The repo includes a [`netlify.toml`](./netlify.toml) configured with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback redirect: `/*` → `/index.html`

To deploy:

1. Push this repo to GitHub.
2. In Netlify, click **Add new site → Import an existing project** and pick the repo.
3. Netlify reads `netlify.toml` and provisions the site. Future pushes to `main` auto-deploy.

## Wrap as a Mac app with Nativefier

To install the deployed site as a standalone macOS app:

```bash
npm install -g nativefier
nativefier --name "Game of Life" https://your-netlify-url.netlify.app
```

This produces a `Game of Life-darwin-*` folder containing `Game of Life.app`. Drag it into `/Applications` and you have a native-feeling shell around the live site.

## Project layout

```
src/
  main.jsx                React entry + router
  App.jsx                 Sidebar shell + rank/streak footer
  index.css               Tokens, layout, components
  screens/                Today, Dashboard, Goals, Fitness
  components/             Cards, rings, modals, forms
  lib/
    storage.js            localStorage wrapper
    dates.js              today(), formatDate(), startOfWeek()
    calculations.js       Goal/subgoal/fitness/rank math
  hooks/
    useAppState.jsx       Context + reducer, debounced persistence
    useDashboardRings.js  Derived ring data for Dashboard
```
