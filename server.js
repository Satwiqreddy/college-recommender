const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';

// Azure IISNode passes a named pipe path to process.env.PORT on Windows App Services
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error: ' + err.message);
    }
  })
    .once('error', (err) => {
      console.error('SERVER FATAL ERROR:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on Azure IISNode port/pipe: ${port}`);
    });
}).catch((err) => {
  console.error('NEXT.JS PREPARE ERROR:', err);
  process.exit(1);
});
