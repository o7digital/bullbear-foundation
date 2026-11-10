import fs from 'node:fs';import path from 'node:path';
const manifest=JSON.parse(fs.readFileSync('migration/media-manifest.json'));
const files=fs.readdirSync('dist/_astro');const sourceBase=url=>url.replace(/-\d+x\d+(?=\.[^.]+$)/,'');
const destinations=new Map();
for(const m of manifest.filter(m=>m.downloaded)){const name=path.basename(m.local_file),prefix=name.split('-')[0]+'-';const candidates=files.filter(f=>f.startsWith(prefix));const target=candidates.find(f=>f.endsWith('.webp'))||candidates[0];if(target)destinations.set(m.source_url,'/_astro/'+target);}
for(const m of manifest.filter(m=>m.downloaded&&!destinations.has(m.source_url))){const equivalent=manifest.find(x=>sourceBase(x.source_url)===sourceBase(m.source_url)&&destinations.has(x.source_url));if(equivalent)destinations.set(m.source_url,destinations.get(equivalent.source_url));else{fs.mkdirSync('dist/medios',{recursive:true});const name=path.basename(m.local_file);fs.copyFileSync(m.local_file,'dist/medios/'+name);destinations.set(m.source_url,'/medios/'+name);}}
const mappings=Object.fromEntries([...destinations].map(([url,destination])=>[new URL(url).pathname,destination]));
fs.writeFileSync('src/data/legacy-media.json',JSON.stringify(mappings,null,2)+'\n');
console.log('Mapped',Object.keys(mappings).length,'legacy media URLs to existing local build assets');
