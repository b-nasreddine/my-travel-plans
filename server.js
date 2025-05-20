const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filepath, contentType) {
  fs.readFile(filepath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

function handleAPI(req, res) {
  if (req.method === 'GET' && req.url === '/api/destinations') {
    const items = readData();
    sendJSON(res, 200, items);
  } else if (req.method === 'POST' && req.url === '/api/destinations') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { name } = JSON.parse(body);
        if (name) {
          const items = readData();
          items.push(name);
          writeData(items);
          sendJSON(res, 201, items);
        } else {
          sendJSON(res, 400, { error: 'Name required' });
        }
      } catch (e) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleAPI(req, res);
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const map = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript'
  };
  const type = map[ext] || 'text/plain';
  serveFile(res, filePath, type);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
