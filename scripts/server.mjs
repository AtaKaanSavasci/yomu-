import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import {handleTranslation} from './translation.mjs';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest':'application/manifest+json; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if(url.pathname==='/api/translate'){await handleTranslation(req,res);return;}
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(403).end(); return; }
    const file = await readFile(path);
    res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(file);
  } catch { res.writeHead(404).end('Not found'); }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Close the existing server or set PORT to another port.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Yomu Local: ${url}`);
  if (process.argv.includes('--open') && process.platform === 'win32') {
    const opener = spawn('explorer.exe', [url], { windowsHide: true, stdio: 'ignore' });
    opener.on('error', () => console.log(`Open in your browser: ${url}`));
  }
});
