import {readFile,mkdir,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(resolve(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json; charset=utf-8'};
const assets={};
for(const dir of ['dist','dist/src'])for(const item of await readdir(resolve(root,dir),{withFileTypes:true})){
 if(!item.isFile()||!mime[extname(item.name)])continue;
 const path=`${dir}/${item.name}`,url='/'+path.slice(5);assets[url]={type:mime[extname(item.name)],body:await read(path)};
}
if(!assets['/index.html']||!assets['/src/app.js'])throw Error('Browser application source is missing');
const core=await read('scripts/translation-core.mjs');if(/^import\s/m.test(core))throw Error('Translation core must remain self-contained');
const source=await read('worker/index.js'),importLine="import {translate,TranslationError} from '../scripts/translation-core.mjs';",marker='/* YOMU_BUNDLED_ASSETS */{}';
if(!source.includes(importLine)||!source.includes(marker))throw Error('Hosted entry point markers changed');
const manifest=JSON.parse(await read('.openai/hosting.json'));if(!manifest.project_id||manifest.static)throw Error('Use the registered Worker hosting manifest');
const output=source.replace(importLine,core.replace(/^export /gm,'')).replace(marker,()=>JSON.stringify(assets));
await mkdir(resolve(root,'dist/server'),{recursive:true});await mkdir(resolve(root,'dist/.openai'),{recursive:true});
await writeFile(resolve(root,'dist/server/index.js'),output);await writeFile(resolve(root,'dist/.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
const built=await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
if(typeof built.default?.fetch!=='function')throw Error('Hosted artifact must export default.fetch');
for(const path of ['/','/src/app.js','/manifest.webmanifest']){const response=await built.default.fetch(new Request('https://yomu.invalid'+path));if(response.status!==200)throw Error(`Missing hosted asset ${path}`);}
console.log(`Hosted Worker built: ${Object.keys(assets).length} browser assets, ${Buffer.byteLength(output)} bytes; entry point and assets verified.`);
