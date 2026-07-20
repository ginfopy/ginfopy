"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "datos.json");
const PORT = Number(process.env.PORT) || 3780;

const DEFAULT_PREGUNTAS = [
  "un trabajo en grupo para la asignatura",
  "una presentación oral",
  "un proyecto de investigación",
  "actividades extraescolares o deporte",
  "estudio o preparación de exámenes",
];

const DEFAULT_STORE = {
  version: 2,
  cursoActivoId: null,
  cursos: [],
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

/** Evita pérdidas si muchos alumnos envían a la vez. */
let storeLock = Promise.resolve();

function withStoreLock(fn) {
  const run = storeLock.then(() => {
    const store = readDataFile();
    const result = fn(store);
    writeDataFile(store);
    return result;
  });
  storeLock = run.catch(() => {});
  return run;
}

function readDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeDataFile({ ...DEFAULT_STORE });
      return { ...DEFAULT_STORE };
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return { ...DEFAULT_STORE };
    if (!Array.isArray(data.cursos)) data.cursos = [];
    if (data.version == null) data.version = 2;
    return data;
  } catch (err) {
    console.error("Error leyendo datos.json:", err.message);
    return { ...DEFAULT_STORE };
  }
}

function writeDataFile(data) {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 5 * 1024 * 1024) {
        reject(new Error("Cuerpo demasiado grande"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function normalizePreferences(prefs, alumnos, alumnoName) {
  const out = {};
  for (let i = 0; i < 5; i++) out[i] = [];
  if (!prefs || typeof prefs !== "object") return out;
  for (let i = 0; i < 5; i++) {
    const list = prefs[String(i)] ?? prefs[i];
    if (!Array.isArray(list)) continue;
    const seen = new Set();
    for (const p of list) {
      const name = String(p).trim();
      if (
        !name ||
        name === alumnoName ||
        !alumnos.includes(name) ||
        seen.has(name)
      ) {
        continue;
      }
      seen.add(name);
      out[i].push(name);
    }
  }
  return out;
}

function getEncuestaCatalog(store) {
  return {
    cursos: store.cursos.map((c) => ({
      id: c.id,
      nombre: String(c.nombre || "Sin nombre"),
      alumnos: Array.isArray(c.alumnos) ? [...c.alumnos] : [],
      preguntas:
        Array.isArray(c.preguntas) && c.preguntas.length === 5
          ? c.preguntas.map((p) => String(p))
          : [...DEFAULT_PREGUNTAS],
    })),
  };
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/api/datos") {
    sendJson(res, 200, readDataFile());
    return;
  }

  if (req.method === "PUT" && pathname === "/api/datos") {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object" || !Array.isArray(data.cursos)) {
        sendJson(res, 400, { error: "Formato inválido: se espera { cursos: [] }" });
        return;
      }
      writeDataFile(data);
      sendJson(res, 200, { ok: true });
    } catch (err) {
      sendJson(res, 400, { error: err.message || "JSON inválido" });
    }
    return;
  }

  if (req.method === "GET" && pathname === "/api/encuesta") {
    sendJson(res, 200, getEncuestaCatalog(readDataFile()));
    return;
  }

  if (req.method === "GET" && pathname === "/api/encuesta/preferencias") {
    const cursoId = url.searchParams.get("cursoId") || "";
    const alumno = (url.searchParams.get("alumno") || "").trim();
    const store = readDataFile();
    const curso = store.cursos.find((c) => c.id === cursoId);
    if (!curso) {
      sendJson(res, 404, { error: "Curso no encontrado" });
      return;
    }
    if (!alumno || !curso.alumnos.includes(alumno)) {
      sendJson(res, 400, { error: "Alumno no válido para este curso" });
      return;
    }
    const prefs = curso.preferences?.[alumno] || null;
    sendJson(res, 200, {
      preferences: prefs
        ? normalizePreferences(prefs, curso.alumnos, alumno)
        : null,
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/encuesta/preferencias") {
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw);
      const cursoId = body.cursoId;
      const alumno = String(body.alumno || "").trim();
      if (!cursoId || !alumno) {
        sendJson(res, 400, { error: "Faltan cursoId o alumno" });
        return;
      }
      await withStoreLock((store) => {
        const curso = store.cursos.find((c) => c.id === cursoId);
        if (!curso) {
          const err = new Error("Curso no encontrado");
          err.status = 404;
          throw err;
        }
        if (!curso.alumnos.includes(alumno)) {
          const err = new Error("Tu nombre no está en la lista de este curso");
          err.status = 400;
          throw err;
        }
        if (!curso.preferences) curso.preferences = {};
        curso.preferences[alumno] = normalizePreferences(
          body.preferences,
          curso.alumnos,
          alumno
        );
        if (!curso.envios) curso.envios = {};
        curso.envios[alumno] = new Date().toISOString();
        return { ok: true };
      });
      sendJson(res, 200, { ok: true });
    } catch (err) {
      sendJson(res, err.status || 400, { error: err.message || "Error al guardar" });
    }
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Profesor:  http://localhost:${PORT}/`);
  console.log(`Alumnos:   http://localhost:${PORT}/encuesta.html`);
  console.log(`Datos:     ${DATA_FILE}`);
});
