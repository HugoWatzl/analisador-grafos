const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.join(__dirname, "dist"),
  port = Number(process.env.PORT || 3000);
http
  .createServer((req, res) => {
    let name;
    try {
      name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (name === "/") name = "/index.html";
    const file = path.resolve(root, "." + name);
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end("Não encontrado");
        return;
      }
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html; charset=utf-8",
          ".js": "text/javascript; charset=utf-8",
          ".css": "text/css; charset=utf-8",
          ".zip": "application/zip",
        }[path.extname(file)] || "application/octet-stream",
      );
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Analisador: http://localhost:" + port),
  );
