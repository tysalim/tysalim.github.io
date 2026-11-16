import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const path = resolve(root, requested);
    // Serve only website assets; never expose Git metadata, scripts, or source CVs.
    if (requested.split('/').some(segment => segment.startsWith('.')) || !types[extname(path)] || !(path.startsWith(root + sep))) { res.writeHead(404); res.end('Not found'); return; }
    const actual = await realpath(path);
    if (!actual.startsWith(root + sep)) { res.writeHead(404); res.end('Not found'); return; }
    const body = await readFile(actual);
    res.writeHead(200, { 'Content-Type': types[extname(path)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is busy. Run PORT=4174 npm run dev to choose another.` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://localhost:${port}`));
