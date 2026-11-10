import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
const live = process.env.SITE_LIVE === 'true';
export default defineConfig({
 site: 'https://www.bullandbear-foundation.com',
 integrations: [react(), sitemap({filter: page => !page.includes('/404/')})],
 output: 'static', trailingSlash: 'always',
 vite: { define: { __SITE_LIVE__: JSON.stringify(live) } },
});
