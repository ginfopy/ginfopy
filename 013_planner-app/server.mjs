import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const db = new DatabaseSync(path.join(__dirname, "planner.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  event_date_ymd TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS steps (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  task TEXT NOT NULL,
  date_ymd TEXT NOT NULL,
  dependency TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
);
`);

const createEventStmt = db.prepare(`
  INSERT INTO events (id, type, event_date_ymd, created_at)
  VALUES (?, ?, ?, ?)
`);
const createStepStmt = db.prepare(`
  INSERT INTO steps (id, event_id, task, date_ymd, dependency, done)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const listEventsStmt = db.prepare(`
  SELECT id, type, event_date_ymd AS eventDateYmd, created_at AS createdAt
  FROM events
  ORDER BY event_date_ymd DESC, created_at DESC
`);
const listStepsByEventStmt = db.prepare(`
  SELECT id, task, date_ymd AS dateYmd, dependency, done
  FROM steps
  WHERE event_id = ?
  ORDER BY date_ymd DESC, task ASC
`);
const deleteEventStmt = db.prepare(`DELETE FROM events WHERE id = ?`);
const setStepDoneStmt = db.prepare(`UPDATE steps SET done = ? WHERE id = ?`);

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload demasiado grande"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON inválido"));
      }
    });
    req.on("error", reject);
  });
}

function listEventsWithSteps() {
  const events = listEventsStmt.all();
  return events.map((event) => ({
    ...event,
    steps: listStepsByEventStmt.all(event.id).map((s) => ({
      ...s,
      done: Boolean(s.done)
    }))
  }));
}

function serveStatic(req, res) {
  const requestedPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(__dirname, safePath);
  if (!filePath.startsWith(__dirname)) {
    sendJson(res, 403, { error: "Acceso denegado" });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { error: "No encontrado" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".html"
        ? "text/html; charset=utf-8"
        : ext === ".css"
          ? "text/css; charset=utf-8"
          : ext === ".js"
            ? "application/javascript; charset=utf-8"
            : "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/events" && req.method === "GET") {
    sendJson(res, 200, listEventsWithSteps());
    return;
  }

  if (req.url === "/api/events" && req.method === "POST") {
    try {
      const payload = await readJsonBody(req);
      if (!payload?.id || !payload?.type || !payload?.eventDateYmd || !Array.isArray(payload?.steps)) {
        sendJson(res, 400, { error: "Datos de evento incompletos" });
        return;
      }

      const tx = db.transaction(() => {
        createEventStmt.run(payload.id, payload.type, payload.eventDateYmd, payload.createdAt);
        for (const step of payload.steps) {
          createStepStmt.run(
            step.id,
            payload.id,
            step.task,
            step.dateYmd,
            step.dependency,
            step.done ? 1 : 0
          );
        }
      });

      tx();
      sendJson(res, 201, { ok: true });
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Error al crear evento" });
    }
    return;
  }

  if (req.url?.startsWith("/api/events/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    deleteEventStmt.run(id);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url?.startsWith("/api/steps/") && req.method === "PATCH") {
    try {
      const id = req.url.split("/").pop();
      const payload = await readJsonBody(req);
      setStepDoneStmt.run(payload.done ? 1 : 0, id);
      sendJson(res, 200, { ok: true });
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Error al actualizar tarea" });
    }
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
