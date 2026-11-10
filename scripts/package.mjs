import fs from 'node:fs';import {execFileSync} from 'node:child_process';
fs.mkdirSync('artifacts',{recursive:true});
const file='artifacts/Bull_Bear_Foundation_Astro_React.zip';
execFileSync('git',['archive','--format=zip','--prefix=Bull_Bear_Foundation/','--output='+file,'HEAD']);
console.log(file);
