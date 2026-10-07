import { defineConfig } from 'astro/config';

// Статическая сборка: у каждого языка своя готовая HTML-страница.
export default defineConfig({
  site: 'https://ganiev.pro',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
