import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const root = path.resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
http
  .createServer(async (req, res) => {
    try {
      let file = path.resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      const ext = path.extname(file);
      res.setHeader("Content-Type", types[ext] || "application/octet-stream");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      if (![".html", ".txt"].includes(ext))
        res.setHeader("Cache-Control", "public, max-age=86400");
      const body = await readFile(file);
      if (
        /gzip/.test(req.headers["accept-encoding"] || "") &&
        [".html", ".css", ".js", ".json", ".txt", ".svg"].includes(ext)
      ) {
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Vary", "Accept-Encoding");
        res.end(gzipSync(body));
      } else res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html" });
      try {
        res.end(await readFile(path.join(root, "404.html")));
      } catch {
        res.end("Not found");
      }
    }
  })
  .listen(Number(process.env.PORT) || 3000, "127.0.0.1", () =>
    console.log("Barkat preview http://localhost:3000"),
  );
