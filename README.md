# ganiev.pro

Personal site of Stas Ganiev: Senior 1C developer, author of two courses for 1C developers, conference speaker.

The site is being rebuilt. This branch holds the new version in progress. The previous version is kept under the git tag `v2-legacy` and stays online until the release.

## Stack

- [Astro](https://astro.build) with TypeScript, static output: every language gets its own HTML page.
- Plain CSS with design tokens. No Tailwind, no UI framework.
- Fonts are served from the site itself (Onest, Playfair Display, JetBrains Mono). No requests to Google Fonts.
- Content lives in YAML files and is checked against a schema at build time.

## Commands

Node 22.12 or newer is required.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local preview at `http://localhost:4321` with live reload |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type check `.astro` and `.ts` files |

## Languages

| Language | Address |
|---|---|
| English (default) | `/` |
| Russian | `/ru/` |
| Serbian, Latin script | `/sr/` |

Interface strings live in `src/i18n/en.json`, `ru.json` and `sr.json`. The Russian file is the master: the build stops with a list of problems if another language misses a key, has an extra key or an empty value.

The language switcher is a set of plain links. It leads to the same page in another language and keeps the section the visitor was reading.

## Structure

```
public/               favicons and the web manifest, copied to the site as is
scripts/              helper scripts (photo processing)
src/
  assets/             brand mark and photos
  components/         Header, Footer, shared blocks, home page sections in home/
  data/               site content in YAML, index.ts loads and checks it
  i18n/               interface dictionaries and language helpers
  layouts/            Base.astro: <head>, header, footer
  lib/                shared code: section list, YAML loader, text helpers
  pages/              home and speaker pages (one file serves all three languages), 404
  styles/             fonts.css, tokens.css, base.css, components.css
  texts/              page texts in three languages, index.ts loads and checks them
```

## Content rules

- Every number on the site comes from `src/data/facts.yaml`. Numbers are not typed into texts by hand: a text refers to a number by name, for example `{graduates}`, and the build stops on an unknown name.
- The build stops if a data file breaks its schema, or if the talk and article counters in `facts.yaml` differ from the number of entries in `talks.yaml` and `articles.yaml`.
- A text change goes into all three languages in one commit. Russian is the master text; a missing translation stops the build.
- Talks, articles and courses are in Russian: their titles stay in the original, with a translation shown first on the English and Serbian pages.

## Deployment

The site is hosted on GitHub Pages. The workflow `.github/workflows/deploy.yml` starts by hand only, so a push to `main` does not change the live site. Until the release it publishes the previous version from the commit under `v2-legacy`.
