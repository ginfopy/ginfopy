/**
 * Servidor — Sistema de Educación Inclusiva v2
 * Colegio Presbiteriano Cerritos
 *
 * Stack: Node.js + Express + better-sqlite3
 * Deploy: Railway (railway.app)
 */

const express  = require('express');
const Database = require('better-sqlite3');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

const APP_PASSWORD = process.env.APP_PASSWORD || 'cerritos2026';
const SECCIONES    = ['alumnos', 'familias', 'documentos', 'seguimiento', 'calendario'];

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'datos.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS datos (
    clave       TEXT PRIMARY KEY,
    valor       TEXT NOT NULL,
    actualizado TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS historial (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    clave     TEXT NOT NULL,
    operacion TEXT NOT NULL,
    detalle   TEXT,
    usuario   TEXT,
    fecha     TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial(fecha DESC);
`);

SECCIONES.forEach(sec => {
  const existe = db.prepare('SELECT 1 FROM datos WHERE clave=?').get(sec);
  if (!existe) {
    db.prepare('INSERT INTO datos(clave,valor,actualizado) VALUES(?,?,?)').run(sec, '[]', new Date().toISOString());
  }
});

const stmtGetAll    = db.prepare('SELECT clave, valor, actualizado FROM datos');
const stmtGetOne    = db.prepare('SELECT valor FROM datos WHERE clave=?');
const stmtSave      = db.prepare('INSERT OR REPLACE INTO datos(clave,valor,actualizado) VALUES(?,?,?)');
const stmtHistorial = db.prepare('INSERT INTO historial(clave,operacion,detalle,usuario,fecha) VALUES(?,?,?,?,?)');

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseJsonArray(raw) {
  try { return JSON.parse(raw || '[]'); }
  catch { return []; }
}

function getAllData() {
  const rows = stmtGetAll.all();
  const data = {};
  let ultimaActualizacion = null;
  rows.forEach(r => {
    data[r.clave] = parseJsonArray(r.valor);
    if (!ultimaActualizacion || r.actualizado > ultimaActualizacion) {
      ultimaActualizacion = r.actualizado;
    }
  });
  return { data, ultimaActualizacion };
}

function logHistorial(clave, operacion, detalle, usuario) {
  stmtHistorial.run(clave, operacion, detalle || null, usuario || 'sistema', new Date().toISOString());
}

function matchAlumno(item, alumno) {
  const nombre = (alumno.apellidoNombre || '').toLowerCase();
  const ci     = (alumno.ci || '').trim();
  if (item.alumno && nombre && item.alumno.toLowerCase() === nombre) return true;
  if (item.ci && ci && item.ci.trim() === ci) return true;
  if (item.alumnos && nombre && item.alumnos.toLowerCase().includes(nombre)) return true;
  return false;
}

function buildExpediente(alumno, all) {
  const familias    = all.familias.filter(f => matchAlumno(f, alumno));
  const seguimiento = all.seguimiento.filter(s => matchAlumno(s, alumno));
  const documentos  = all.documentos.filter(d => {
    const txt = (d.alumnos || '').toLowerCase();
    return txt.includes('todos') || matchAlumno({ alumnos: d.alumnos }, alumno);
  });

  const logros = seguimiento.map(s => parseFloat(s.pctLogro)).filter(n => !isNaN(n));
  const promedioLogro = logros.length
    ? Math.round(logros.reduce((a, b) => a + b, 0) / logros.length)
    : null;

  return {
    alumno,
    familias,
    seguimiento,
    documentos,
    resumen: {
      compromisosPendientes: familias.filter(f => f.estado === 'Pendiente').length,
      registrosSeguimiento:  seguimiento.length,
      documentosPendientes:  documentos.filter(d => d.estado === 'Pendiente' || d.estado === 'En preparación').length,
      promedioLogro,
    },
  };
}

function buscarEnDatos(all, q) {
  const term = q.toLowerCase().trim();
  if (!term) return [];

  const resultados = [];

  all.alumnos.forEach(a => {
    const texto = [a.apellidoNombre, a.ci, a.curso, a.necesidad, a.docente].join(' ').toLowerCase();
    if (texto.includes(term)) {
      resultados.push({ seccion: 'alumnos', id: a.id, titulo: a.apellidoNombre || 'Sin nombre', subtitulo: `${a.curso || '—'} · ${a.estado || 'Activo'}`, tipo: 'Alumno' });
    }
  });

  all.familias.forEach(f => {
    const texto = [f.alumno, f.acuerdo, f.responsable].join(' ').toLowerCase();
    if (texto.includes(term)) {
      resultados.push({ seccion: 'familias', id: f.id, titulo: f.alumno || '—', subtitulo: (f.acuerdo || '').slice(0, 80), tipo: 'Compromiso' });
    }
  });

  all.documentos.forEach(d => {
    const texto = [d.documento, d.alumnos, d.baseLegal].join(' ').toLowerCase();
    if (texto.includes(term)) {
      resultados.push({ seccion: 'documentos', id: d.id, titulo: (d.documento || '').slice(0, 70), subtitulo: d.estado || '—', tipo: 'Documento MEC' });
    }
  });

  all.seguimiento.forEach(s => {
    const texto = [s.alumno, s.ci, s.materia, s.objetivo].join(' ').toLowerCase();
    if (texto.includes(term)) {
      resultados.push({ seccion: 'seguimiento', id: s.id, titulo: s.alumno || '—', subtitulo: `${s.materia || '—'} · ${s.trimestre || '—'}`, tipo: 'Seguimiento' });
    }
  });

  all.calendario.forEach(c => {
    const texto = [c.accion, c.mes, c.normativa, c.destinatario].join(' ').toLowerCase();
    if (texto.includes(term)) {
      resultados.push({ seccion: 'calendario', id: c.id, titulo: (c.accion || '').slice(0, 70), subtitulo: `${c.mes || '—'} · ${c.estado || '—'}`, tipo: 'Calendario' });
    }
  });

  return resultados.slice(0, 50);
}

function calcStats(all) {
  const alumnosActivos = all.alumnos.filter(a => a.estado === 'Activo' || !a.estado).length;

  const porAdecuacion = {};
  all.alumnos.filter(a => a.estado === 'Activo' || !a.estado).forEach(a => {
    const k = a.tipoAdecuacion || 'Sin especificar';
    porAdecuacion[k] = (porAdecuacion[k] || 0) + 1;
  });

  const porEstadoDoc = {};
  all.documentos.forEach(d => {
    const k = d.estado || 'Sin estado';
    porEstadoDoc[k] = (porEstadoDoc[k] || 0) + 1;
  });

  const porGradoApoyo = {};
  all.alumnos.filter(a => a.estado === 'Activo' || !a.estado).forEach(a => {
    const k = a.gradoApoyo || 'Sin especificar';
    porGradoApoyo[k] = (porGradoApoyo[k] || 0) + 1;
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let alertasVencidas = 0;
  let alertasProximas = 0;

  const contarAlertas = items => {
    items.forEach(item => {
      const fecha = item.fechaLimite || item.fecha;
      if (!fecha) return;
      const d = new Date(fecha);
      d.setHours(0, 0, 0, 0);
      const days = Math.round((d - hoy) / 86400000);
      if (days < 0) alertasVencidas++;
      else if (days <= 30) alertasProximas++;
    });
  };

  contarAlertas(all.familias);
  contarAlertas(all.documentos);
  contarAlertas(all.calendario);

  return {
    totales: {
      alumnos: all.alumnos.length,
      alumnosActivos,
      familias: all.familias.length,
      documentos: all.documentos.length,
      seguimiento: all.seguimiento.length,
      calendario: all.calendario.length,
    },
    porAdecuacion,
    porEstadoDoc,
    porGradoApoyo,
    alertas: { vencidas: alertasVencidas, proximas: alertasProximas },
    compromisosPendientes: all.familias.filter(f => f.estado === 'Pendiente').length,
    docsPendientes: all.documentos.filter(d => d.estado === 'Pendiente' || d.estado === 'En preparación').length,
  };
}

// ── Middlewares ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const clave = req.headers['x-app-password'];
  if (!clave || clave !== APP_PASSWORD) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }
  req.usuario = req.headers['x-app-user'] || 'usuario';
  next();
}

// ── Rutas API ────────────────────────────────────────────────────────────────

app.get('/api/data', auth, (req, res) => {
  try {
    const { data, ultimaActualizacion } = getAllData();
    res.json({ ok: true, data, ultimaActualizacion, version: '2.0' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer datos' });
  }
});

app.post('/api/data', auth, (req, res) => {
  try {
    const payload = req.body;
    const ahora   = new Date().toISOString();
    const prev    = getAllData().data;

    const tx = db.transaction(() => {
      SECCIONES.forEach(sec => {
        if (payload[sec] !== undefined) {
          const anterior = prev[sec]?.length || 0;
          const nuevo    = Array.isArray(payload[sec]) ? payload[sec].length : 0;
          stmtSave.run(sec, JSON.stringify(payload[sec]), ahora);
          if (anterior !== nuevo) {
            logHistorial(sec, 'sync', `${anterior} → ${nuevo} registros`, req.usuario);
          }
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

app.get('/api/status', (req, res) => {
  try {
    const { data, ultimaActualizacion } = getAllData();
    const conteos = {};
    SECCIONES.forEach(s => { conteos[s] = data[s]?.length || 0; });
    res.json({ ok: true, version: '2.0', conteos, ultimaActualizacion });
  } catch (e) {
    res.status(500).json({ error: 'Error de estado' });
  }
});

app.get('/api/stats', auth, (req, res) => {
  try {
    const { data } = getAllData();
    res.json({ ok: true, stats: calcStats(data) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al calcular estadísticas' });
  }
});

app.get('/api/buscar', auth, (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) {
      return res.json({ ok: true, resultados: [], total: 0 });
    }
    const { data } = getAllData();
    const resultados = buscarEnDatos(data, q);
    res.json({ ok: true, resultados, total: resultados.length, query: q });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
});

app.get('/api/alumnos/:id/expediente', auth, (req, res) => {
  try {
    const { data } = getAllData();
    const alumno = data.alumnos.find(a => a.id === req.params.id);
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json({ ok: true, expediente: buildExpediente(alumno, data) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al generar expediente' });
  }
});

app.post('/api/historial', auth, (req, res) => {
  try {
    const { clave, operacion, detalle } = req.body;
    if (!clave || !operacion) {
      return res.status(400).json({ error: 'clave y operacion son requeridos' });
    }
    logHistorial(clave, operacion, detalle, req.usuario);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al registrar historial' });
  }
});

app.get('/api/historial', auth, (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = parseInt(req.query.offset, 10) || 0;
    const rows = db.prepare(
      'SELECT id, clave, operacion, detalle, usuario, fecha FROM historial ORDER BY fecha DESC LIMIT ? OFFSET ?'
    ).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as n FROM historial').get().n;
    res.json({ ok: true, historial: rows, total, limit, offset });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer historial' });
  }
});

app.get('/api/backup', auth, (req, res) => {
  const { data } = getAllData();
  const result = { _backup: new Date().toISOString(), _version: '2.0', ...data };
  res.setHeader('Content-Disposition', `attachment; filename="backup_inclusivo_${new Date().toISOString().slice(0, 10)}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result, null, 2));
});

// ── Inicio ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Servidor Inclusivo Cerritos v2 corriendo en puerto ${PORT}`);
  console.log(`📁 Base de datos: ${DB_PATH}`);
  console.log(`🔑 Clave de acceso: ${APP_PASSWORD !== 'cerritos2026' ? 'personalizada' : 'predeterminada (cambiala en Railway)'}`);
});
