import {normalizeVideoInput} from './public/media.js';
export const sections=[['inicio','Inicio','/'],['fundacion','La fundación','/quienes-somos/'],['actividades','Actividades','/actividades-bb-foundation/'],['programas','Programas','/programas/'],['galeria','Fotos y galería','/galeria/'],['videos','Vídeos','/videos/'],['transparencia','Transparencia','/transparencia/'],['participar','Participación','/voluntariado/'],['contacto','Contacto','/contacto/']];
export const kinds=['text','activity','program','document','photo','video','hero'];
export const statuses=['draft','published','archived'];
export const uuid=/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i;
export const localFile=/^[^/\\\x00-\x1f]+\.(?:jpe?g|png|webp|avif)$/iu;
const allowed=['kind','section','title','summary','body','status','sort','image','images','video','url','date','category','place','alt','position','button_label','button_url','payload','version','slug'];
export function safeLink(value){if(/^\/(?!\/)[\w\-/#.?=&%]*$/.test(value))return true;try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
export function validateRecord(input,current){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Contenido inválido.');
 if(Object.keys(input).some(key=>!allowed.includes(key)))throw Error('Campo no permitido.');
 const row={...current,...input};
 if(!kinds.includes(row.kind)||!sections.some(s=>s[0]===row.section)||!statuses.includes(row.status||'draft'))throw Error('Tipo, sección o estado inválido.');
 if(current&&input.kind&&input.kind!==current.kind)throw Error('El tipo de contenido no puede cambiar.');
 if(current&&['text','hero'].includes(current.kind)&&row.status!=='published')throw Error('Este campo forma parte de la página. Conserva su estado publicado y edita su contenido.');
 if(current&&input.payload)throw Error('Los datos originales se conservan automáticamente.');
 for(const key of allowed.filter(k=>!['sort','version','images','payload'].includes(k)))if(row[key]!=null&&(typeof row[key]!=='string'||row[key].length>(key==='body'?50000:3000)))throw Error('Campo inválido: '+key);
 if(!row.title?.trim())throw Error('Escribe un título.');
 if(!Number.isInteger(Number(row.sort||0))||Math.abs(Number(row.sort||0))>100000)throw Error('Orden inválido.');
 row.sort=Number(row.sort||0);row.status=row.status||'draft';
 if(row.slug&&(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)||row.slug.length>160))throw Error('Usa una dirección con letras minúsculas, números y guiones.');
 if(row.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||new Date(row.date+'T00:00:00Z').toISOString().slice(0,10)!==row.date))throw Error('Fecha inválida.');
 for(const f of ['url','button_url'])if(row[f]&&!safeLink(row[f]))throw Error('Usa una ruta del sitio o un enlace HTTPS sin credenciales.');
 if(row.image&&!uuid.test(row.image)&&!localFile.test(row.image)&&!/^\/documentos\/[\w.-]+$/.test(row.image))throw Error('Selecciona una foto de la biblioteca.');
 if(row.images&&(!Array.isArray(row.images)||row.images.length>100||row.images.some(f=>typeof f!=='string'||!uuid.test(f)&&!localFile.test(f))))throw Error('Galería inválida.');
 if(row.video){if(uuid.test(row.video))throw Error('Pega un enlace web para el vídeo.');row.video=normalizeVideoInput(row.video);}
 if(row.kind==='video'&&!row.video)throw Error('Pega el enlace de tu vídeo.');
 if(row.kind==='hero'&&!row.image)throw Error('Selecciona la fotografía del hero.');
 if(row.position&&!/^\d{1,3}% \d{1,3}%$/.test(row.position)||row.position?.split(' ').some(v=>parseInt(v)>100))throw Error('Encuadre inválido.');
 if(row.status==='published'&&['photo','hero'].includes(row.kind)&&!row.alt?.trim())throw Error('Describe la foto antes de publicarla.');
 return Object.fromEntries([...allowed,'id','date_updated'].filter(k=>row[k]!==undefined).map(k=>[k,row[k]]));
}
