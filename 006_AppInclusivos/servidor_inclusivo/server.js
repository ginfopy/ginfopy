/**
 * Servidor — Sistema de Educación Inclusiva
 * Colegio Presbiteriano Cerritos
 *
 * Stack: Node.js + Express + better-sqlite3
 * Deploy: Railway (railway.app)
 */

const express  = require('express');
const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Clave de acceso (se configura en Railway como variable de entorno) ──────
const APP_PASSWORD = process.env.APP_PASSWORD || 'cerritos2026';

// ── Base de datos SQLite ─────────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'datos.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS datos (
    clave      TEXT PRIMARY KEY,
    valor      TEXT NOT NULL,
    actualizado TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS historial (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    clave      TEXT NOT NULL,
    operacion  TEXT NOT NULL,
    detalle    TEXT,
    usuario    TEXT,
    fecha      TEXT NOT NULL
  );
`);

// Inicializar secciones vacías si es la primera vez
['alumnos','familias','documentos','seguimiento','calendario'].forEach(sec => {
  const existe = db.prepare('SELECT 1 FROM datos WHERE clave=?').get(sec);
  if (!existe) {
    db.prepare('INSERT INTO datos(clave,valor,actualizado) VALUES(?,?,?)').run(sec, '[]', new Date().toISOString());
  }
});

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticación: clave en header x-app-password
function auth(req, res, next) {
  const clave = req.headers['x-app-password'];
  if (!clave || clave !== APP_PASSWORD) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }
  next();
}

// ── Rutas API ────────────────────────────────────────────────────────────────

// GET /api/data — devuelve todos los datos
app.get('/api/data', auth, (req, res) => {
  try {
    const rows = db.prepare('SELECT clave, valor FROM datos').all();
    const result = {};
    rows.forEach(r => {
      try { result[r.clave] = JSON.parse(r.valor); }
      catch { result[r.clave] = []; }
    });
    res.json({ ok: true, data: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer datos' });
  }
});

// POST /api/data — guarda todos los datos
app.post('/api/data', auth, (req, res) => {
  try {
    const payload = req.body;
    const ahora   = new Date().toISOString();
    const secciones = ['alumnos','familias','documentos','seguimiento','calendario'];

    const stmt = db.prepare('INSERT OR REPLACE INTO datos(clave,valor,actualizado) VALUES(?,?,?)');
    const tx   = db.transaction(() => {
      secciones.forEach(sec => {
        if (payload[sec] !== undefined) {
          stmt.run(sec, JSON.stringify(payload[sec]), ahora);
        }
      });
    });
    tx();
    res.json({ ok: true, guardado: ahora });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
});

// GET /api/status — estado del servidor (sin auth, para health check)
app.get('/api/status', (req, res) => {
  const rows = db.prepare('SELECT clave, actualizado FROM datos').all();
  const conteos = {};
  rows.forEach(r => {
    try { conteos[r.clave] = JSON.parse(db.prepare('SELECT valor FROM datos WHERE clave=?').get(r.clave)?.valor || '[]').length; }
    catch { conteos[r.clave] = 0; }
  });
  res.json({ ok: true, version: '1.0', conteos });
});

// POST /api/backup — descarga el JSON completo (para respaldo manual)
app.get('/api/backup', auth, (req, res) => {
  const rows = db.prepare('SELECT clave, valor FROM datos').all();
  const result = { _backup: new Date().toISOString() };
  rows.forEach(r => {
    try { result[r.clave] = JSON.parse(r.valor); } catch { result[r.clave] = []; }
  });
  res.setHeader('Content-Disposition', `attachment; filename="backup_inclusivo_${new Date().toISOString().slice(0,10)}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result, null, 2));
});

// ── Inicio ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor Inclusivo Cerritos corriendo en puerto ${PORT}`);
  console.log(`📁 Base de datos: ${DB_PATH}`);
  console.log(`🔑 Clave de acceso configurada: ${APP_PASSWORD !== 'cerritos2026' ? 'SÍ (personalizada)' : 'predeterminada (cambiala en Railway)'}`);
});
