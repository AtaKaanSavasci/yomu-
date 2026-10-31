import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
for(const directory of ['../dist/src/','../worker/','./']){
 const base=new URL(directory,import.meta.url);
 for(const entry of await readdir(base)){if(!/\.m?js$/.test(entry))continue;const path=fileURLToPath(new URL(entry,base));const result=spawnSync(process.execPath,['--check',path],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
}
console.log('All application and server JavaScript syntax checks passed.');
