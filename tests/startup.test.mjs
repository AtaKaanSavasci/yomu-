import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';

const root=new URL('../',import.meta.url);
execFileSync(process.execPath,['scripts/build-hosted.mjs'],{cwd:root,stdio:'pipe'});
const app=(await import('../dist/server/index.js')).default;
const report=JSON.parse(await readFile(new URL('../dist/server/build-report.json',import.meta.url),'utf8'));
const request=(path,headers={})=>app.fetch(new Request('https://yomu.invalid'+path,{headers}));
test('production starts with one bundled script and stylesheet within the compressed byte budget',async()=>{
 const html=await (await request('/')).text();
 assert.equal([...html.matchAll(/<script\b/g)].length,1);
 assert.equal([...html.matchAll(/rel="stylesheet"/g)].length,1);
 assert.ok(html.includes(report.scriptUrl));assert.ok(html.includes(report.styleUrl));
 assert.equal(report.startupRequests,3);assert.ok(report.sourceRequests>45);
 assert.ok(report.gzipBytes<220_000,`Startup grew to ${report.gzipBytes} bytes`);
 assert.ok(report.gzipBytes<report.sourceBytes*0.3);
 for(const path of [report.scriptUrl,report.styleUrl]){
  assert.match(path,/^\/assets\/app\.[a-f0-9]{16}\.(js|css)$/);
  const identity=await (await request(path)).text(),response=await request(path,{'Accept-Encoding':'gzip'});
  assert.equal(gunzipSync(Buffer.from(await response.arrayBuffer())).toString(),identity);
  assert.match(response.headers.get('Cache-Control'),/private,.*immutable/);
  if(path.endsWith('.js'))assert.doesNotMatch(identity,/from\s*["']\.\//);
 }
});
test('bundle URLs are content-addressed and build output is deterministic',async()=>{
 const {createHash}=await import('node:crypto');
 for(const path of [report.scriptUrl,report.styleUrl]){
  const body=await (await request(path)).text();
  assert.ok(path.includes(createHash('sha256').update(body).digest('hex').slice(0,16)));
 }
 const before=await readFile(new URL('../dist/server/index.js',import.meta.url));
 execFileSync(process.execPath,['scripts/build-hosted.mjs'],{cwd:root,stdio:'pipe'});
 assert.deepEqual(await readFile(new URL('../dist/server/index.js',import.meta.url)),before);
 for(const path of ['/src/app.js','/server/index.js','/server/build-report.json'])assert.equal((await request(path)).status,404);
});
