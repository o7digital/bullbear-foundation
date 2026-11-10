import fs from 'node:fs';
import path from 'node:path';
const localePrefixes=['en','fr','de','it','ru','pt','zh','ja'];
const live=process.env.SITE_LIVE==='true';
const mappings=[
 ['/actividades','/actividades-bb-foundation/','Consolidación del índice duplicado'],['/haleria','/galeria/','Corrección del nombre de la galería'],['/voluntareado','/voluntariado/','Corrección ortográfica'],
 ['/enterate','/transparencia/','Los documentos y reconocimientos se integran en transparencia'],
 ['/orientacion','/programas/#orientacion','Programa integrado en ejes de acción'],
 ['/comida-infantil','/programas/#asistencia-social','Consolidación del programa; contenido de demostración excluido'],
 ['/ayuda-y-esperanza','/programas/#asistencia-social','Consolidación de asistencia social'],
 ['/pagina-en-construccion','/actividades-bb-foundation/','Elimina destino provisional del enlace de actividades'],
 ['/pruebas/contacto','/contacto/','Limpieza de rutas de pruebas'],['/pruebas/quienes-somos','/quienes-somos/','Limpieza de rutas de pruebas'],
 ['/pruebas/ayuda-y-esperanza','/programas/#asistencia-social','Limpieza de rutas de pruebas'],['/pruebas/voluntareado','/voluntariado/','Limpieza de rutas de pruebas'],
];
const contentRoutes=[...JSON.parse(fs.readFileSync('src/content/activities.json')).map(a=>a.id),...JSON.parse(fs.readFileSync('src/data/archive-indexes.json')).map(a=>a.id),...fs.readdirSync('src/pages').filter(f=>f.endsWith('.astro')&&!f.startsWith('[')&&!['index.astro','404.astro'].includes(f)).map(f=>path.basename(f,'.astro'))];
const pageRedirects=mappings.flatMap(([source,destination])=>[source,source+'/'].map(route=>({source:route,destination,statusCode:301})));
const translatedLegacyRedirects=localePrefixes.flatMap(locale=>pageRedirects.map(r=>({...r,source:'/'+locale+r.source,destination:'/'+locale+r.destination})));
const languageRootRedirects=[{source:'/es',destination:'/',statusCode:308},{source:'/es/',destination:'/',statusCode:308}];
const canonicalRedirects=[...new Set(contentRoutes)].filter(id=>!mappings.some(m=>m[0]==='/'+id)).map(id=>({source:'/'+id,destination:'/'+id+'/',statusCode:308}));
const config={framework:'astro',buildCommand:'npm run build',outputDirectory:'dist',redirects:[...((process.env.PUBLIC_STUDIO_URL||'').startsWith('https://')?[{source:'/studio',destination:process.env.PUBLIC_STUDIO_URL,statusCode:307},{source:'/studio/',destination:process.env.PUBLIC_STUDIO_URL,statusCode:307}]:[]),...languageRootRedirects,...pageRedirects,...translatedLegacyRedirects,...canonicalRedirects],rewrites:[{source:'/wp-content/uploads/:year/:month/:file',destination:'/api/legacy-media?path=:year/:month/:file'}],headers:[{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},...(!live?[{key:'X-Robots-Tag',value:'noindex, nofollow'}]:[])]},{source:'/_astro/(.*)',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]}]};
fs.writeFileSync('vercel.json',JSON.stringify(config,null,2)+'\n');fs.writeFileSync('migration/redirect-map.json',JSON.stringify(mappings.map(([source,destination,reason])=>({source:source+'/',destination,status:301,reason})),null,2));
