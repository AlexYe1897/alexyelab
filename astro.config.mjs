// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownMath } from './src/utils/markdown-math.mjs';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexyelab.com',

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    syntaxHighlight: 'shiki',
    processor: satteri({
      features: { math: true },
      mdastPlugins: [markdownMath],
    }),
  },
});
