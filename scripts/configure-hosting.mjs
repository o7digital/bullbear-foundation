import fs from 'node:fs';
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
const config={framework:'astro',buildCommand:'npm run build',outputDirectory:'dist',trailingSlash:true,redirects:mappings.map(([source,destination])=>({source,destination,statusCode:301})),rewrites:[{source:'/wp-content/uploads/:year/:month/:file',destination:'/api/legacy-media?path=:year/:month/:file'}],headers:[{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},...(!live?[{key:'X-Robots-Tag',value:'noindex, nofollow'}]:[])]},{source:'/_astro/(.*)',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]}]};
fs.writeFileSync('vercel.json',JSON.stringify(config,null,2)+'\n');fs.writeFileSync('migration/redirect-map.json',JSON.stringify(mappings.map(([source,destination,reason])=>({source:source+'/',destination,status:301,reason})),null,2));
