#!/usr/bin/env node
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const target = new URL(process.env.API_TARGET || process.argv[2] || "http://localhost:5556");
const port = Number(process.env.PORT || process.argv[3] || 8000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function readRequestBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolveBody(Buffer.concat(chunks)));
    req.on("error", rejectBody);
  });
}

function safeStaticPath(pathname) {
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(root, "." + decodeURIComponent(relativePath));
  return filePath === root || filePath.startsWith(root + sep) ? filePath : null;
}

async function proxyApi(req, res, requestUrl) {
  const upstreamUrl = new URL(requestUrl.pathname + requestUrl.search, target);
  const headers = { ...req.headers, host: target.host };
  delete headers.origin;
  delete headers.referer;

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await readRequestBody(req);
  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = Object.fromEntries(upstream.headers);
  res.writeHead(upstream.status, responseHeaders);

  if (req.method === "HEAD" || !upstream.body) {
    res.end();
    return;
  }

  Readable.fromWeb(upstream.body).pipe(res);
}

async function serveStatic(req, res, requestUrl) {
  const filePath = safeStaticPath(requestUrl.pathname);
  if (!filePath) {
    send(res, 403, "Forbidden\n", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");

    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Content-Length": info.size,
    });
    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 404, "Not found\n", { "Content-Type": "text/plain; charset=utf-8" });
  }
}

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", "http://localhost");
    if (requestUrl.pathname === "/api" || requestUrl.pathname.startsWith("/api/")) {
      await proxyApi(req, res, requestUrl);
      return;
    }

    await serveStatic(req, res, requestUrl);
  } catch (error) {
    send(res, 502, `Proxy error: ${error.message}\n`, { "Content-Type": "text/plain; charset=utf-8" });
  }
});

server.listen(port, () => {
  console.log(`Frontend: http://localhost:${port}`);
  console.log(`Proxying /api/* to ${target.origin}`);
});
