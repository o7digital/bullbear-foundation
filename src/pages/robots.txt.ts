import type {APIRoute} from 'astro';
export const GET:APIRoute=()=>new Response(__SITE_LIVE__?'User-agent: *\nAllow: /\nSitemap: https://www.bullandbear-foundation.com/sitemap-index.xml\n':'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
