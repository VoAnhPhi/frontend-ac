import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Local static server used by `npm start` to preview the HTML/CSS project.
// It only returns files from this project: there is no API, database or form storage here.
const publicRoot = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const filename = path.resolve(publicRoot, `.${pathname === '/' ? '/index.html' : pathname}`);
    const relative = path.relative(publicRoot, filename);

    // Reject paths that try to escape the project or access hidden files/directories.
    if (
      relative.startsWith('..') ||
      path.isAbsolute(relative) ||
      relative.split(path.sep).some((part) => part.startsWith('.'))
    ) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (!(await stat(filename)).isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filename)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(await readFile(filename));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Appscyclone: http://127.0.0.1:${port}`));
