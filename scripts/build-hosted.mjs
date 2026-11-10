import {readFile,mkdir,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {build} from 'esbuild';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(resolve(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json; charset=utf-8'};
const assets={};
const hash=body=>createHash('sha256').update(body).digest('hex').slice(0,16);
function addAsset(url,body,immutable=false){
 const compressed=gzipSync(body,{level:9});
 assets[url]={type:mime[extname(url)],etag:`W/"${hash(body)}"`,immutable,...(compressed.length<Buffer.byteLength(body)?{gzip:compressed.toString('base64')}:{body})};
}
let html=await read('dist/index.html');
const styleLinks=[...html.matchAll(/<link rel="stylesheet" href="\.\/([^"\n]+)">/g)];
if(!styleLinks.length||!html.includes('<script type="module" src="./src/app.js"></script>'))throw Error('Browser entry points changed');
const [js,css]=await Promise.all([
 build({absWorkingDir:root,entryPoints:['dist/src/app.js'],bundle:true,minify:true,format:'esm',target:'es2022',charset:'utf8',write:false,metafile:true}),
 build({stdin:{contents:styleLinks.map(([,name])=>`@import "./${name}";`).join('\n'),resolveDir:resolve(root,'dist'),loader:'css'},bundle:true,minify:true,target:['chrome100','safari15.4','firefox100'],charset:'utf8',write:false})
]);
const scriptBody=js.outputFiles[0].text,styleBody=css.outputFiles[0].text;
const scriptUrl=`/assets/app.${hash(scriptBody)}.js`,styleUrl=`/assets/app.${hash(styleBody)}.css`;
html=html.replace(styleLinks[0][0],`<link rel="stylesheet" href="${styleUrl}">`);
for(const [link] of styleLinks.slice(1))html=html.replace(link,'');
html=html.replace('./src/app.js',scriptUrl);
addAsset('/index.html',html);addAsset(scriptUrl,scriptBody,true);addAsset(styleUrl,styleBody,true);
for(const item of await readdir(resolve(root,'dist'),{withFileTypes:true})){
 if(!item.isFile()||!['.js','.svg','.webmanifest'].includes(extname(item.name)))continue;
 addAsset('/'+item.name,await read('dist/'+item.name));
}
const core=await read('dist/src/translation-core.js');if(/^import\s/m.test(core))throw Error('Translation core must remain self-contained');
const source=await read('worker/index.js'),importLine="import {translate,TranslationError} from '../scripts/translation-core.mjs';",marker='/* YOMU_BUNDLED_ASSETS */{}';
if(!source.includes(importLine)||!source.includes(marker))throw Error('Hosted entry point markers changed');
const manifest=JSON.parse(await read('.openai/hosting.json'));if(!manifest.project_id||manifest.static)throw Error('Use the registered Worker hosting manifest');
const examSchema=await read('dist/src/exam-schema.js');
const schema=(await read('dist/src/backup-schema.js')).replace("import {isExamSession} from './exam-schema.js';",()=>examSchema.replace(/^export /gm,'')),sync=await read('worker/sync.js');
const syncModule=`const {syncRequest}=(()=>{const {validateBackup,SYNC_BYTES}=(()=>{${schema.replace(/^export /gm,'')}\nreturn {validateBackup,SYNC_BYTES};})();\n${sync.replace(/^import .*;\r?\n/,'').replace(/^export /gm,'')}\nreturn {syncRequest};})();`;
const output=source.replace(importLine,core.replace(/^export /gm,'')).replace("import {syncRequest} from './sync.js';",()=>syncModule).replace(marker,()=>JSON.stringify(assets));
await mkdir(resolve(root,'dist/server'),{recursive:true});await mkdir(resolve(root,'dist/.openai'),{recursive:true});
await writeFile(resolve(root,'dist/server/index.js'),output);await writeFile(resolve(root,'dist/.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
const built=await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
if(typeof built.default?.fetch!=='function')throw Error('Hosted artifact must export default.fetch');
for(const path of ['/',scriptUrl,styleUrl,'/manifest.webmanifest']){const response=await built.default.fetch(new Request('https://yomu.invalid'+path));if(response.status!==200)throw Error(`Missing hosted asset ${path}`);}
const startup=['/index.html',scriptUrl,styleUrl];
const report={sourceRequests:1+styleLinks.length+Object.keys(js.metafile.inputs).length,startupRequests:startup.length,sourceBytes:Buffer.byteLength(await read('dist/index.html'))+Object.values(js.metafile.inputs).reduce((sum,input)=>sum+input.bytes,0)+(await Promise.all(styleLinks.map(async([,name])=>Buffer.byteLength(await read('dist/'+name))))).reduce((a,b)=>a+b,0),minifiedBytes:[html,scriptBody,styleBody].reduce((sum,body)=>sum+Buffer.byteLength(body),0),gzipBytes:startup.reduce((sum,path)=>sum+(assets[path].gzip?Buffer.from(assets[path].gzip,'base64').length:Buffer.byteLength(assets[path].body)),0),scriptUrl,styleUrl};
await writeFile(resolve(root,'dist/server/build-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`Hosted Worker built: ${Object.keys(assets).length} browser assets, ${Buffer.byteLength(output)} bytes; entry point and assets verified.`);
console.log(`Startup: ${report.sourceRequests} → ${report.startupRequests} requests; ${report.sourceBytes} source bytes → ${report.gzipBytes} gzip bytes (${Math.round(100*(1-report.gzipBytes/report.sourceBytes))}% smaller).`);
