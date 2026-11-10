import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {homeStories,homePrograms,participationPhoto} from '../src/data/home.ts';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const stable=v=>'bbf-'+createHash('sha256').update(v).digest('hex').slice(0,28);
const records=[];const base={status:'published',sort:0,version:1};
const text=(id,section,title,body)=>records.push({...base,id,kind:'text',section,title,body});
text('home-introduction','inicio','Presentación de la fundación','Acompañamos a niñas, niños, jóvenes y personas mayores en situación de vulnerabilidad. Lo hacemos con apoyo social, talleres y tiempo compartido.');
text('home-programmes','inicio','Apoyo social. Aprendizaje y compañía.','Trabajamos con casas hogar, residencias y otras instituciones para atender necesidades concretas y crear espacios de encuentro.');
text('home-activities','inicio','Lectura, creatividad y convivencia.','');
text('home-documents','inicio','Documentos para conocer nuestra labor.','Constancias, reconocimientos e información institucional, con las fechas que les corresponden.');
text('home-participation','participar','Participa como voluntario o apoya una actividad.','¿Te gustaría acompañar una actividad, compartir una habilidad o colaborar desde tu empresa? Cuéntanos qué puedes aportar y coordinemos el siguiente paso.');
text('home-contact','contacto','Hablemos de cómo ayudar.','');
records.push({...base,id:'site-hero',kind:'hero',section:'inicio',title:'Una cultura universal',body:'una ayúda mutua',image:'853a574a8c-primer-plano-diversas-personas-uniendo-sus-manos.jpg',alt:'Un grupo de personas une sus manos en un gesto de ayuda mutua',position:'50% 50%',button_label:'¿Deseas ayudar?',button_url:'/contacto/',payload:{note:'Hero de manos documentado en WordPress. La referencia del hero con jóvenes sigue pendiente.'}});
records.push({...base,id:'participation-photo',kind:'photo',section:'participar',title:participationPhoto.caption,image:participationPhoto.image,alt:participationPhoto.alt,position:'50% 12%',payload:{placement:'participation'}});
for(const item of await read('src/content/activities.json')){const cover=homeStories.find(s=>s.href==='/'+item.id+'/');records.push({...base,id:item.id,kind:'activity',section:'actividades',title:item.title,summary:item.summary,body:item.paragraphs.join('\n\n'),date:item.date,category:item.category,image:cover?.image||'',alt:cover?.alt||item.alt,position:cover?.position||'50% 0%',images:item.images,payload:item});}
for(const item of await read('src/content/programs.json')){const home=homePrograms.find(p=>p.id===item.id);records.push({...base,id:'program-'+item.id,kind:'program',section:'programas',title:item.title,summary:home?.text||item.summary,body:item.body,image:home?.image||item.image,alt:home?.alt||item.title,position:home?.position||'50% 0%',sort:Number(item.number),payload:item});}
for(const item of await read('src/content/documents.json'))records.push({...base,id:'document-'+item.id,kind:'document',section:'transparencia',title:item.title,summary:item.dateLabel,body:item.description,url:item.file,image:item.file,alt:item.title,payload:item});
records.push(...await read('cms/editable-text.json'));
const manifest=(await read('migration/media-manifest.json')).filter(m=>m.downloaded&&m.local_file?.startsWith('src/assets/source/'));
const byFile=new Map(manifest.map(m=>[m.local_file.split('/').pop(),m]));
const referenced=new Map();for(const a of records.filter(r=>r.kind==='activity'))for(const f of a.images||[])if(!referenced.has(f))referenced.set(f,a);
for(const[f,a]of referenced){const m=byFile.get(f);if(!m)continue;records.push({...base,id:stable('photo:'+f),kind:'photo',section:'galeria',title:a.title,image:f,alt:a.alt||a.title,status:'published',payload:{imported:true,activityId:a.id,sourceImage:f},sort:records.length});}
await rm('cms/studio/public/library',{recursive:true,force:true});await mkdir('cms/studio/public/library',{recursive:true});const library=[];
for(const[file,m]of byFile){await sharp(m.local_file).resize({width:480,height:360,fit:'inside',withoutEnlargement:true}).webp({quality:76}).toFile('cms/studio/public/library/'+file+'.webp');library.push({file,width:Number(m.width),height:Number(m.height),title:referenced.get(file)?.title||file,source:m.source_url});}
for(const d of records.filter(r=>r.kind==='document'))await sharp('public'+d.url).resize({width:480,height:600,fit:'inside',withoutEnlargement:true}).webp({quality:76}).toFile('cms/studio/public/library/'+d.url.split('/').pop()+'.webp');
await writeFile('cms/studio/public/library.json',JSON.stringify(library));await writeFile('cms/source-content.json',JSON.stringify(records,null,2));console.log('Foundation seed:',records.length,'records;',library.length,'original photographs.');
