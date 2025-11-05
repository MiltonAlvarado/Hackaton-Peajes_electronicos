
const http = require('http');
const fs = require('fs');
const path = require('path');

// Leer y parsear el archivo de datos.
const dataPath = path.join(__dirname, '../data/data.json');
let users = [];
try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  users = JSON.parse(rawData);
} catch (err) {
  console.error('No se pudo cargar el archivo de datos:', err);
}

// Eliminando espacios y guiones.
function normalizeIdentity(identity) {
  return identity
    .toString()
    .trim()
    .replace(/[^0-9]/g, '');
}

// Buscar un usuario por su identidad.
function findUserByIdentity(identity) {
  const normalized = normalizeIdentity(identity);
  return users.find((user) => normalizeIdentity(user.id) === normalized);
}

// Archivos estáticos de la carpeta public.
function serveStaticFile(req, res) {
  let filePath = path.join(__dirname, '../public', req.url);
  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, '../public/index.html');
  }
  if (!filePath.startsWith(path.join(__dirname, '../public'))) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Archivo no encontrado');
    }
    // Determinar el tipo de contenido según la extensión.
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Manejar solicitudes POST para /api/login
function handleLogin(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    let credentials;
    try {
      credentials = JSON.parse(body);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Formato JSON no válido' }));
    }
    const identity = credentials && credentials.identity;
    if (!identity) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Se requiere identidad' }));
    }
    const user = findUserByIdentity(identity);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Identidad no encontrada' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ user }));
  });
}

// Crear servidor y enrutar solicitudes
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'POST' && url.pathname === '/api/login') {
    return handleLogin(req, res);
  }
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  }
  serveStaticFile(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});