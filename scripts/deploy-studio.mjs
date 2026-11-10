import {readFile,cp,rm,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const deployment=JSON.parse(await readFile('cms/deployment.json','utf8'));
if(JSON.parse(await readFile('package.json','utf8')).name!=='bullbear-foundation')throw Error('Run this command from the Foundation repository.');
function run(command,args){const result=spawnSync(command,args,{stdio:'inherit'});if(result.status!==0)throw Error(command+' did not complete.');}
run(process.execPath,['cms/seed.mjs']);
const staging='artifacts/studio-deploy';await rm(staging,{recursive:true,force:true});await mkdir(staging+'/cms',{recursive:true});
await cp('cms/studio',staging+'/cms/studio',{recursive:true,filter:path=>!path.split('/').includes('node_modules')});
run('railway',['up',staging,'--path-as-root','--no-gitignore','--service',deployment.services.studio,'--project',deployment.project_id,'--environment',deployment.environment_id,'--detach','--json']);
console.log('Studio deployment requested. Verify the Railway deployment status before treating it as published.');
