import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {loadEnvFile} from 'node:process';
import {uuid,validateRecord} from './studio/content.mjs';
import {normalizeVideoInput} from './studio/public/media.js';
try{loadEnvFile('.env.local');}catch(e){if(e.code!=='ENOENT')throw e;}
const base=process.env.DIRECTUS_URL,token=process.env.DIRECTUS_READ_TOKEN;
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const snapshot={records:[],studio:process.env.PUBLIC_STUDIO_URL||'',generated_at:new Date().toISOString(),mediaAlts:{}};
let records=[];const mediaFiles=new Map();
if(base){if(!base.startsWith('https://')||!token)throw Error('The CMS requires HTTPS and a private read token.');
 async function get(path){const r=await fetch(base.replace(/\/$/,'')+path,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error('Foundation CMS unavailable ('+r.status+'). The existing deployment is preserved.');return r;}
 records=(await(await get('/items/foundation_content?limit=-1&sort=sort,id')).json()).data;if(!Array.isArray(records)||!records.some(r=>r.id==='site-hero'))throw Error('Foundation CMS returned incomplete content.');
 for(const row of records.filter(r=>r.status==='published'))validateRecord(Object.fromEntries(Object.entries(row).filter(([k])=>!['id','payload','date_updated'].includes(k))),row);
 await rm('src/assets/cms',{recursive:true,force:true});await mkdir('src/assets/cms',{recursive:true});
 const needed=new Set(records.filter(r=>r.status==='published').flatMap(r=>[r.image,...(r.images||[])]).filter(f=>uuid.test(f||'')));
 for(const id of needed){const meta=(await(await get('/files/'+id+'?fields=type,filesize,width,height')).json()).data;if(!/^image\/(jpeg|png|webp|avif)$/.test(meta.type)||Number(meta.filesize)>26*1024*1024)throw Error('Unsupported Foundation image.');const buffer=Buffer.from(await(await get('/assets/'+id)).arrayBuffer());if(buffer.length!==Number(meta.filesize))throw Error('Incomplete Foundation photo download.');const file='cms-'+id+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'}[meta.type]);await writeFile('src/assets/cms/'+file,buffer);mediaFiles.set(id,file);}
 for(const row of records){if(mediaFiles.has(row.image))row.image=mediaFiles.get(row.image);if(row.images)row.images=row.images.map(f=>mediaFiles.get(f)||f);if(row.video)row.video=normalizeVideoInput(row.video);}
 console.log('Foundation CMS synchronized:',records.filter(r=>r.status==='published').length,'published records,',needed.size,'uploaded photos.');
}else console.log('Foundation CMS not configured: preserving local content.');
const dateLabel=date=>date?new Intl.DateTimeFormat('es-MX',{dateStyle:'long',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z')):'Fecha no registrada';
for(const[collection,kind]of [['activities','activity'],['programs','program'],['documents','document']]){const originals=await read('src/content/'+collection+'.json'),items=new Map(originals.map(i=>[i.id,i]));
 for(const row of records.filter(r=>r.kind===kind)){const original=row.payload||{},id=original.id||row.id;
 if(row.status!=='published'){items.delete(id);continue;}
 const common={...original,id,title:row.title,sourceUrl:original.sourceUrl||'https://www.bullandbear-foundation.com/'+id+'/',publishedAt:original.publishedAt||null,modifiedAt:row.date_updated||original.modifiedAt||null,validation:original.validation||'editorial'};
 if(kind==='activity'){items.set(id,{...common,summary:row.summary||'',paragraphs:(row.body||'').split(/\n\s*\n/).filter(Boolean),date:row.date||null,dateLabel:row.date===original.date?original.dateLabel:dateLabel(row.date),year:row.date?.slice(0,4)||'sin-fecha',category:row.category||'Encuentros comunitarios',images:row.images||[],alt:row.alt||row.title,cover:row.image||'',coverAlt:row.alt||row.title,position:row.position||'50% 0%',place:row.place||'',videos:records.filter(v=>v.kind==='video'&&v.status==='published'&&v.section==='actividades').filter(v=>v.payload?.activityId===row.id).map(v=>({title:v.title,video:v.video,summary:v.summary||v.body||''}))});}
 if(kind==='program')items.set(id,{...common,summary:row.summary||'',body:row.body||'',image:row.image||original.image,number:original.number||String(row.sort||items.size+1).padStart(2,'0')});
 if(kind==='document'){let file=row.url||original.file;if(row.image&&row.image!==original.file&&mediaFiles.has([...mediaFiles].find(([,f])=>f===row.image)?.[0])){await mkdir('public/_foundation/documents',{recursive:true});const bytes=await readFile('src/assets/cms/'+row.image);await writeFile('public/_foundation/documents/'+row.image,bytes);file='/_foundation/documents/'+row.image;}items.set(id,{...common,file:file||original.file,dateLabel:row.date?dateLabel(row.date):original.dateLabel||'',description:row.body||''});}
 }
 await writeFile('src/data/cms-'+collection+'.generated.json',JSON.stringify([...items.values()]));
}
// Imported photo records keep their original place in reports. Explicit archival removes their source from those galleries.
const activitiesPath='src/data/cms-activities.generated.json',activities=await read(activitiesPath);
for(const row of records.filter(r=>r.kind==='photo'&&r.payload?.imported)){const source=row.payload.sourceImage||row.image;for(const a of activities){if(row.status!=='published')a.images=a.images.filter(f=>f!==source);else{a.images=a.images.map(f=>f===source?row.image:f);if(row.alt)snapshot.mediaAlts[row.image]=row.alt;}}}
await writeFile(activitiesPath,JSON.stringify(activities));
snapshot.records=records.filter(r=>r.status==='published').map(({payload,version,date_updated,...row})=>({...row,edited:Number(version)>1,...(payload?.imported?{imported:true}:{}),...(payload?.placement?{placement:payload.placement}:{})}));
await writeFile('src/data/cms.generated.json',JSON.stringify(snapshot));await mkdir('public/_foundation',{recursive:true});await writeFile('public/_foundation/status.json',JSON.stringify({generated_at:snapshot.generated_at}));
