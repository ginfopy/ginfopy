/**
 * Sistema Inclusivo Cerritos — Módulo v2
 * Paginación, búsqueda global, gráficos, expediente e historial
 */
(function () {
  'use strict';

  const PAGE_SIZE = 25;
  const _pages = { alumnos: 1, familias: 1, documentos: 1, seguimiento: 1, calendario: 1, historial: 1 };
  window.PAGE_SIZE = PAGE_SIZE;
  window._pages = _pages;
  let _chartAdec = null;
  let _chartDocs = null;

  // ── Utilidades ───────────────────────────────────────────────────────────

  window.V2 = {
    PAGE_SIZE,
    getUsuario: () => sessionStorage.getItem('app_user') || 'usuario',
    getPassword: () => sessionStorage.getItem('app_pw') || '',
  };

  function apiHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-app-password': V2.getPassword(),
      'x-app-user': V2.getUsuario(),
    };
  }

  window.logAccion = async function (clave, operacion, detalle) {
    try {
      await fetch('/api/historial', {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ clave, operacion, detalle }),
      });
    } catch (_) { /* offline o standalone */ }
  };

  window.paginate = function (arr, page, size) {
    const total = arr.length;
    const pages = Math.max(1, Math.ceil(total / size));
    const p = Math.min(Math.max(1, page), pages);
    const start = (p - 1) * size;
    return { items: arr.slice(start, start + size), page: p, pages, total };
  };

  window.renderPagination = function (containerId, section, total, onChange) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const cur = _pages[section] || 1;
    if (pages <= 1) { el.innerHTML = ''; return; }

    const btns = [];
    btns.push(`<button class="pg-btn" ${cur <= 1 ? 'disabled' : ''} onclick="V2.setPage('${section}',${cur - 1},${onChange})">‹</button>`);
    for (let i = 1; i <= pages; i++) {
      if (pages > 7 && Math.abs(i - cur) > 2 && i !== 1 && i !== pages) {
        if (i === 2 || i === pages - 1) btns.push('<span class="pg-dots">…</span>');
        continue;
      }
      btns.push(`<button class="pg-btn${i === cur ? ' active' : ''}" onclick="V2.setPage('${section}',${i},${onChange})">${i}</button>`);
    }
    btns.push(`<button class="pg-btn" ${cur >= pages ? 'disabled' : ''} onclick="V2.setPage('${section}',${cur + 1},${onChange})">›</button>`);
    el.innerHTML = `<div class="pagination-bar"><span class="pg-info">${total} registros · pág. ${cur}/${pages}</span><div class="pg-btns">${btns.join('')}</div></div>`;
  };

  V2.setPage = function (section, page, fnName) {
    _pages[section] = page;
    if (typeof window[fnName] === 'function') window[fnName]();
  };

  V2.resetPage = function (section) { _pages[section] = 1; };

  // ── Búsqueda global ──────────────────────────────────────────────────────

  function buscarLocal(q) {
    const term = q.toLowerCase().trim();
    if (term.length < 2) return [];
    const out = [];
    const scan = (sec, tipo, items, titFn, subFn) => {
      items.forEach(item => {
        const blob = JSON.stringify(item).toLowerCase();
        if (blob.includes(term)) {
          out.push({ seccion: sec, id: item.id, titulo: titFn(item), subtitulo: subFn(item), tipo });
        }
      });
    };
    scan('alumnos', 'Alumno', _mem.alumnos, a => a.apellidoNombre || '—', a => `${a.curso || '—'} · ${a.estado || 'Activo'}`);
    scan('familias', 'Compromiso', _mem.familias, f => f.alumno || '—', f => (f.acuerdo || '').slice(0, 80));
    scan('documentos', 'Documento MEC', _mem.documentos, d => (d.documento || '').slice(0, 70), d => d.estado || '—');
    scan('seguimiento', 'Seguimiento', _mem.seguimiento, s => s.alumno || '—', s => `${s.materia || '—'} · ${s.trimestre || '—'}`);
    scan('calendario', 'Calendario', _mem.calendario, c => (c.accion || '').slice(0, 70), c => `${c.mes || '—'} · ${c.estado || '—'}`);
    return out.slice(0, 50);
  }

  async function buscarGlobal(q) {
    try {
      const r = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`, { headers: apiHeaders() });
      if (r.ok) {
        const j = await r.json();
        return j.resultados || [];
      }
    } catch (_) { /* fallback local */ }
    return buscarLocal(q);
  }

  window.abrirBusqueda = function () {
    const ov = document.getElementById('search-overlay');
    if (ov) { ov.style.display = 'flex'; document.getElementById('global-search-input')?.focus(); }
  };

  window.cerrarBusqueda = function () {
    const ov = document.getElementById('search-overlay');
    if (ov) ov.style.display = 'none';
  };

  window.ejecutarBusqueda = async function () {
    const q = (document.getElementById('global-search-input')?.value || '').trim();
    const box = document.getElementById('search-results');
    if (!box) return;
    if (q.length < 2) { box.innerHTML = '<div class="search-hint">Escribí al menos 2 caracteres…</div>'; return; }
    box.innerHTML = '<div class="search-hint"><i class="bi bi-arrow-repeat spin"></i> Buscando…</div>';
    const res = await buscarGlobal(q);
    if (!res.length) {
      box.innerHTML = '<div class="search-hint">Sin resultados para «' + esc(q) + '»</div>';
      return;
    }
    box.innerHTML = res.map(r => `
      <div class="search-item" onclick="V2.irResultado('${r.seccion}','${r.id}')">
        <span class="search-tipo">${esc(r.tipo)}</span>
        <strong>${esc(r.titulo)}</strong>
        <small>${esc(r.subtitulo)}</small>
      </div>`).join('');
  };

  V2.irResultado = function (seccion, id) {
    cerrarBusqueda();
    if (seccion === 'alumnos') {
      showPage('alumnos');
      setTimeout(() => verExpediente(id), 50);
      return;
    }
    const map = { familias: 'renderFamilias', documentos: 'renderDocumentos', seguimiento: 'renderSeguimiento', calendario: 'renderCalendario' };
    showPage(seccion);
    setTimeout(() => {
      const item = (_mem[seccion] || []).find(x => x.id === id);
      if (!item) return;
      const modals = { familias: 'modalFamilia', documentos: 'modalDocumento', seguimiento: 'modalSeguimiento', calendario: 'modalCalendario' };
      if (modals[seccion]) window[modals[seccion]](id);
    }, 50);
  };

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  // ── Expediente del alumno ─────────────────────────────────────────────────

  function buildExpedienteLocal(alumnoId) {
    const alumno = DB.byId('alumnos', alumnoId);
    if (!alumno) return null;
    const match = (item) => {
      const nom = (alumno.apellidoNombre || '').toLowerCase();
      const ci  = (alumno.ci || '').trim();
      if (item.alumno && nom && item.alumno.toLowerCase() === nom) return true;
      if (item.ci && ci && item.ci.trim() === ci) return true;
      if (item.alumnos && (item.alumnos.toLowerCase().includes('todos') || (nom && item.alumnos.toLowerCase().includes(nom)))) return true;
      return false;
    };
    const familias = _mem.familias.filter(match);
    const seguimiento = _mem.seguimiento.filter(match);
    const documentos = _mem.documentos.filter(match);
    const logros = seguimiento.map(s => parseFloat(s.pctLogro)).filter(n => !isNaN(n));
    return {
      alumno, familias, seguimiento, documentos,
      resumen: {
        compromisosPendientes: familias.filter(f => f.estado === 'Pendiente').length,
        registrosSeguimiento: seguimiento.length,
        documentosPendientes: documentos.filter(d => d.estado === 'Pendiente' || d.estado === 'En preparación').length,
        promedioLogro: logros.length ? Math.round(logros.reduce((a, b) => a + b, 0) / logros.length) : null,
      },
    };
  }

  window.verExpediente = async function (alumnoId) {
    let exp = buildExpedienteLocal(alumnoId);
    try {
      const r = await fetch(`/api/alumnos/${encodeURIComponent(alumnoId)}/expediente`, { headers: apiHeaders() });
      if (r.ok) { const j = await r.json(); exp = j.expediente; }
    } catch (_) { /* local */ }
    if (!exp) { alert('Alumno no encontrado.'); return; }

    const a = exp.alumno;
    const r = exp.resumen;
    openModal(`Expediente — ${a.apellidoNombre || 'Alumno'}`, `
      <div class="expediente-wrap">
        <div class="row g-2 mb-3">
          <div class="col-md-3"><div class="exp-stat"><div class="exp-num">${r.compromisosPendientes}</div><div class="exp-lbl">Compromisos pendientes</div></div></div>
          <div class="col-md-3"><div class="exp-stat"><div class="exp-num">${r.registrosSeguimiento}</div><div class="exp-lbl">Registros seguimiento</div></div></div>
          <div class="col-md-3"><div class="exp-stat"><div class="exp-num">${r.documentosPendientes}</div><div class="exp-lbl">Docs pendientes</div></div></div>
          <div class="col-md-3"><div class="exp-stat"><div class="exp-num">${r.promedioLogro != null ? r.promedioLogro + '%' : '—'}</div><div class="exp-lbl">Promedio logro</div></div></div>
        </div>
        <div class="exp-section"><h6>Datos del alumno</h6>
          <table class="table table-sm"><tbody>
            <tr><td><strong>CI</strong></td><td>${esc(a.ci)}</td><td><strong>Curso</strong></td><td>${esc(a.curso)}</td></tr>
            <tr><td><strong>Turno</strong></td><td>${esc(a.turno)}</td><td><strong>Estado</strong></td><td>${esc(a.estado || 'Activo')}</td></tr>
            <tr><td><strong>Necesidad</strong></td><td colspan="3">${esc(a.necesidad)}</td></tr>
            <tr><td><strong>Adecuación</strong></td><td colspan="3">${esc(a.tipoAdecuacion)} · Apoyo ${esc(a.gradoApoyo)}</td></tr>
            <tr><td><strong>Docente</strong></td><td>${esc(a.docente)}</td><td><strong>Tel. familia</strong></td><td>${esc(a.telFamilia)}</td></tr>
          </tbody></table>
        </div>
        ${exp.familias.length ? `<div class="exp-section"><h6>Compromisos con familia (${exp.familias.length})</h6>
          <ul class="exp-list">${exp.familias.map(f => `<li><span class="badge bg-secondary me-1">${esc(f.estado)}</span>${esc((f.acuerdo || '').slice(0, 100))}${f.fechaLimite ? ' · <em>' + fmtDate(f.fechaLimite) + '</em>' : ''}</li>`).join('')}</ul></div>` : ''}
        ${exp.seguimiento.length ? `<div class="exp-section"><h6>Seguimiento académico (${exp.seguimiento.length})</h6>
          <ul class="exp-list">${exp.seguimiento.slice(0, 8).map(s => `<li><strong>${esc(s.materia)}</strong> (${esc(s.trimestre)}) — ${s.pctLogro != null ? s.pctLogro + '%' : '—'} · ${esc((s.resultado || '').slice(0, 60))}</li>`).join('')}${exp.seguimiento.length > 8 ? '<li><em>… y ' + (exp.seguimiento.length - 8) + ' más</em></li>' : ''}</ul></div>` : ''}
        ${exp.documentos.length ? `<div class="exp-section"><h6>Documentos MEC vinculados (${exp.documentos.length})</h6>
          <ul class="exp-list">${exp.documentos.map(d => `<li><span class="badge bg-secondary me-1">${esc(d.estado)}</span>${esc((d.documento || '').slice(0, 80))}</li>`).join('')}</ul></div>` : ''}
      </div>
      <div class="mt-3 text-end">
        <button class="btn-print" onclick="imprimirExpediente('${alumnoId}')"><i class="bi bi-printer"></i> Imprimir expediente</button>
      </div>`, null);
    document.getElementById('modalSave').style.display = 'none';
    const modalEl = document.getElementById('mainModal');
    modalEl.addEventListener('hidden.bs.modal', () => { document.getElementById('modalSave').style.display = ''; }, { once: true });
  };

  window.imprimirExpediente = function (alumnoId) {
    verExpediente(alumnoId);
    setTimeout(() => window.print(), 400);
  };

  // ── Gráficos del dashboard ────────────────────────────────────────────────

  window.renderDashboardCharts = async function () {
    const row = document.getElementById('charts-row');
    if (!row || typeof Chart === 'undefined') return;

    let stats = null;
    try {
      const r = await fetch('/api/stats', { headers: apiHeaders() });
      if (r.ok) stats = (await r.json()).stats;
    } catch (_) { /* local */ }

    if (!stats) stats = calcStatsLocal();

    const adecLabels = Object.keys(stats.porAdecuacion);
    const adecData   = Object.values(stats.porAdecuacion);
    const docLabels  = Object.keys(stats.porEstadoDoc);
    const docData    = Object.values(stats.porEstadoDoc);

    row.innerHTML = `
      <div class="col-md-6"><div class="chart-card"><h6>Alumnos activos por tipo de adecuación</h6><canvas id="chart-adec" height="200"></canvas></div></div>
      <div class="col-md-6"><div class="chart-card"><h6>Documentos MEC por estado</h6><canvas id="chart-docs" height="200"></canvas></div></div>`;

    if (_chartAdec) _chartAdec.destroy();
    if (_chartDocs) _chartDocs.destroy();

    const short = s => s.replace('Adecuación Curricular ', 'Adec. ').replace('Adecuación de ', '').slice(0, 28);

    _chartAdec = new Chart(document.getElementById('chart-adec'), {
      type: 'doughnut',
      data: {
        labels: adecLabels.map(short),
        datasets: [{ data: adecData, backgroundColor: ['#2E75B6', '#375623', '#C55A11', '#888'] }],
      },
      options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } }, maintainAspectRatio: false },
    });

    _chartDocs = new Chart(document.getElementById('chart-docs'), {
      type: 'bar',
      data: {
        labels: docLabels,
        datasets: [{ label: 'Documentos', data: docData, backgroundColor: '#2E75B6' }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        maintainAspectRatio: false,
      },
    });
  };

  function calcStatsLocal() {
    const activos = _mem.alumnos.filter(a => a.estado === 'Activo' || !a.estado);
    const porAdecuacion = {};
    activos.forEach(a => { const k = a.tipoAdecuacion || 'Sin especificar'; porAdecuacion[k] = (porAdecuacion[k] || 0) + 1; });
    const porEstadoDoc = {};
    _mem.documentos.forEach(d => { const k = d.estado || 'Sin estado'; porEstadoDoc[k] = (porEstadoDoc[k] || 0) + 1; });
    return { porAdecuacion, porEstadoDoc };
  }

  // ── Historial de actividad ────────────────────────────────────────────────

  window.renderHistorial = async function () {
    const box = document.getElementById('table-historial');
    if (!box) return;
    box.innerHTML = '<div class="empty-state"><i class="bi bi-arrow-repeat spin"></i> Cargando historial…</div>';

    try {
      const r = await fetch('/api/historial?limit=100', { headers: apiHeaders() });
      if (!r.ok) throw new Error('No disponible');
      const j = await r.json();
      const rows = j.historial || [];
      document.getElementById('cnt-historial').textContent = j.total + ' eventos';

      if (!rows.length) {
        box.innerHTML = '<div class="empty-state"><i class="bi bi-clock-history"></i>Sin eventos registrados aún.</div>';
        return;
      }

      box.innerHTML = `<div class="table-responsive"><table class="table table-sm table-hover">
        <thead><tr><th>Fecha</th><th>Sección</th><th>Operación</th><th>Detalle</th><th>Usuario</th></tr></thead>
        <tbody>${rows.map(h => `<tr>
          <td style="white-space:nowrap;font-size:11px">${new Date(h.fecha).toLocaleString('es-PY')}</td>
          <td><span class="badge bg-primary">${esc(h.clave)}</span></td>
          <td>${esc(h.operacion)}</td>
          <td><small>${esc(h.detalle || '—')}</small></td>
          <td><small>${esc(h.usuario || '—')}</small></td>
        </tr>`).join('')}</tbody></table></div>`;
    } catch (_) {
      box.innerHTML = '<div class="empty-state"><i class="bi bi-info-circle"></i>El historial requiere conexión al servidor.</div>';
    }
  };

  // ── Recargar datos del servidor ───────────────────────────────────────────

  window.recargarDatos = async function () {
    const pw = V2.getPassword();
    if (!pw) return;
    if (!confirm('¿Recargar datos desde el servidor? Se perderán cambios locales no guardados.')) return;
    const ok = await cargarDesdeServidor(pw);
    if (ok) {
      renderDashboard();
      alert('Datos actualizados desde el servidor.');
    } else {
      alert('No se pudo recargar. Verificá la conexión.');
    }
  };

  // ── Atajos de teclado ─────────────────────────────────────────────────────

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      abrirBusqueda();
    }
    if (e.key === 'Escape') cerrarBusqueda();
  });

  // ── Hook en arranque: guardar nombre de usuario ───────────────────────────

  const _origArrancar = window.arrancarConClave;
  if (_origArrancar) {
    window.arrancarConClave = async function (clave) {
      const userInp = document.getElementById('input-usuario');
      const user = (userInp?.value || '').trim() || 'usuario';
      sessionStorage.setItem('app_user', user);
      return _origArrancar(clave);
    };
  }

  // ── Hook renderDashboard para gráficos ────────────────────────────────────

  const _origDash = window.renderDashboard;
  if (_origDash) {
    window.renderDashboard = function () {
      _origDash();
      renderDashboardCharts();
    };
  }

  // ── Extender DB para registrar acciones ───────────────────────────────────

  const _origAdd = DB.add.bind(DB);
  const _origUpdate = DB.update.bind(DB);
  const _origDel = DB.del.bind(DB);

  DB.add = function (k, item) {
    _origAdd(k, item);
    const last = (_mem[k] || []).slice(-1)[0];
    logAccion(k, 'crear', last?.id || '');
  };
  DB.update = function (k, id, item) {
    _origUpdate(k, id, item);
    logAccion(k, 'editar', id);
  };
  DB.del = function (k, id) {
    _origDel(k, id);
    logAccion(k, 'eliminar', id);
  };

  if (typeof initApp === 'function') initApp();

})();
