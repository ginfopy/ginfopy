(function () {
  "use strict";

  const STORAGE_KEY = "sociograma-curso-v2";
  const LEGACY_STORAGE_KEY = "sociograma-curso-v1";

  const defaultPreguntas = [
    "un trabajo en grupo para la asignatura",
    "una presentación oral",
    "un proyecto de investigación",
    "actividades extraescolares o deporte",
    "estudio o preparación de exámenes",
  ];

  /** @type {{ version: number, cursoActivoId: string|null, cursos: Array<{id:string,nombre:string,alumnos:string[],preguntas:string[],preferences:Record<string, Record<number, string[]>>}> }} */
  let store = { version: 2, cursoActivoId: null, cursos: [] };
  /** @type {typeof store.cursos[0]|null} */
  let activeCourse = null;
  let filePersistence = false;
  let saveTimer = null;

  let network = null;
  let graphContainer = null;
  let graphEdges = null;

  function generateId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "c-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function defaultPreguntasCopy() {
    return [...defaultPreguntas];
  }

  function newCourseObject(nombre) {
    return {
      id: generateId(),
      nombre: nombre.trim() || "Nuevo curso",
      alumnos: [],
      preguntas: defaultPreguntasCopy(),
      preferences: {},
    };
  }

  function normalizeStore(data) {
    const s = {
      version: 2,
      cursoActivoId: data && data.cursoActivoId != null ? data.cursoActivoId : null,
      cursos: data && Array.isArray(data.cursos) ? data.cursos : [],
    };
    s.cursos = s.cursos.map((c) => ({
      id: c.id || generateId(),
      nombre: String(c.nombre || "Sin nombre").trim() || "Sin nombre",
      alumnos: Array.isArray(c.alumnos) ? c.alumnos.map(slug).filter(Boolean) : [],
      preguntas:
        Array.isArray(c.preguntas) && c.preguntas.length === 5
          ? c.preguntas.map((p) => String(p))
          : defaultPreguntasCopy(),
      preferences: c.preferences && typeof c.preferences === "object" ? c.preferences : {},
      envios: c.envios && typeof c.envios === "object" ? c.envios : {},
    }));
    if (s.cursoActivoId && !s.cursos.some((c) => c.id === s.cursoActivoId)) {
      s.cursoActivoId = s.cursos[0]?.id ?? null;
    }
    return s;
  }

  function getAlumnos() {
    return activeCourse ? activeCourse.alumnos : [];
  }

  function getPreguntas() {
    return activeCourse ? activeCourse.preguntas : defaultPreguntasCopy();
  }

  function getPreferences() {
    return activeCourse ? activeCourse.preferences : {};
  }

  function setStorageStatus(msg) {
    const el = document.getElementById("storage-status");
    if (el) el.textContent = msg;
  }

  function schedulePersist() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      persistStore();
    }, 350);
  }

  async function persistStore() {
    if (activeCourse) store.cursoActivoId = activeCourse.id;
    else if (store.cursos.length) store.cursoActivoId = store.cursos[0].id;
    else store.cursoActivoId = null;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (_) {
      /* ignore */
    }

    if (!filePersistence) return;

    try {
      const r = await fetch("/api/datos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      if (r.ok) {
        setStorageStatus(
          `${store.cursos.length} curso(s) · guardado en datos.json` +
            (activeCourse ? ` · activo: ${activeCourse.nombre}` : "")
        );
      } else {
        setStorageStatus("Error al guardar en datos.json");
      }
    } catch (_) {
      setStorageStatus("Sin conexión al servidor; copia en el navegador.");
    }
  }

  async function loadStore() {
    filePersistence = false;
    try {
      const r = await fetch("/api/datos", { cache: "no-store" });
      if (r.ok) {
        store = normalizeStore(await r.json());
        filePersistence = true;
        migrateLegacyLocalStorage();
        setStorageStatus(
          `${store.cursos.length} curso(s) · datos en datos.json (carpeta del proyecto)`
        );
        return;
      }
    } catch (_) {
      /* sin servidor */
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) store = normalizeStore(JSON.parse(raw));
      else {
        store = normalizeStore({ version: 2, cursoActivoId: null, cursos: [] });
        migrateLegacyLocalStorage();
      }
    } catch (_) {
      store = normalizeStore({ version: 2, cursoActivoId: null, cursos: [] });
    }

    setStorageStatus(
      "Modo solo navegador. Ejecuta npm start en esta carpeta para guardar en datos.json."
    );
  }

  function migrateLegacyLocalStorage() {
    try {
      const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const hasLegacy =
        Array.isArray(data.alumnos) &&
        data.alumnos.length > 0 &&
        !store.cursos.some((c) => c.nombre === "Curso (migrado)");
      if (hasLegacy) {
        const c = newCourseObject("Curso (migrado)");
        c.alumnos = data.alumnos.map(slug).filter(Boolean);
        if (Array.isArray(data.preguntas) && data.preguntas.length === 5) {
          c.preguntas = data.preguntas.map((p) => String(p));
        }
        if (data.preferences && typeof data.preferences === "object") {
          c.preferences = data.preferences;
        }
        store.cursos.push(c);
        if (!store.cursoActivoId) store.cursoActivoId = c.id;
      }
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      schedulePersist();
    } catch (_) {
      /* ignore */
    }
  }

  function setActiveCourse(id) {
    const found = store.cursos.find((c) => c.id === id);
    if (!found) {
      activeCourse = null;
      return;
    }
    activeCourse = found;
    store.cursoActivoId = id;
    refreshCourseUI();
    schedulePersist();
  }

  function createCourse(nombre) {
    const c = newCourseObject(nombre);
    store.cursos.push(c);
    setActiveCourse(c.id);
    return c;
  }

  function syncActiveCourseFromSelect() {
    const sel = document.getElementById("curso-select");
    if (!sel || !sel.value) return;
    const found = store.cursos.find((c) => c.id === sel.value);
    if (found) {
      activeCourse = found;
      store.cursoActivoId = found.id;
    }
  }

  /** Diálogo propio: window.prompt suele fallar en vistas embebidas del IDE. */
  function askCursoNombre(titulo, valorInicial) {
    const dialog = document.getElementById("dialog-curso-nombre");
    const input = document.getElementById("dialog-curso-input");
    const titleEl = document.getElementById("dialog-curso-titulo");
    const cancelBtn = document.getElementById("dialog-curso-cancelar");
    if (!dialog || !input || typeof dialog.showModal !== "function") {
      const fallback = window.prompt(titulo, valorInicial || "");
      if (fallback === null) return Promise.resolve(null);
      const t = fallback.trim();
      return Promise.resolve(t || null);
    }

    return new Promise((resolve) => {
      titleEl.textContent = titulo;
      input.value = valorInicial || "";

      function finish(value) {
        dialog.removeEventListener("close", onClose);
        cancelBtn.removeEventListener("click", onCancel);
        resolve(value);
      }

      function onClose() {
        if (dialog.returnValue === "ok") {
          const t = input.value.trim();
          finish(t || null);
        } else {
          finish(null);
        }
      }

      function onCancel(ev) {
        ev.preventDefault();
        dialog.close("cancel");
      }

      dialog.addEventListener("close", onClose);
      cancelBtn.addEventListener("click", onCancel);
      dialog.showModal();
      input.focus();
      input.select();
    });
  }

  function renderCursoSelect() {
    const sel = document.getElementById("curso-select");
    if (!sel) return;
    sel.innerHTML = "";
    if (store.cursos.length === 0) {
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "(sin cursos — crea uno)";
      sel.appendChild(o);
      activeCourse = null;
      return;
    }
    if (!activeCourse) {
      const activeId = store.cursoActivoId || store.cursos[0].id;
      activeCourse =
        store.cursos.find((c) => c.id === activeId) || store.cursos[0];
      store.cursoActivoId = activeCourse.id;
    }
    store.cursos.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.nombre;
      sel.appendChild(o);
    });
    sel.value = activeCourse.id;
  }

  async function ensureActiveCourseForEdit() {
    if (activeCourse) return true;
    syncActiveCourseFromSelect();
    if (activeCourse) return true;
    const nombre = await askCursoNombre("Nombre del nuevo curso", "3º ESO A");
    if (nombre === null) return false;
    createCourse(nombre || "Nuevo curso");
    return true;
  }

  function getEncuestaUrlForCourse() {
    const base = `${window.location.origin}/encuesta.html`;
    if (!activeCourse) return base;
    return `${base}?curso=${encodeURIComponent(activeCourse.id)}`;
  }

  function updateEncuestaProfUI() {
    const box = document.getElementById("encuesta-prof-box");
    if (!box) return;
    box.hidden = !filePersistence;
    if (!filePersistence) return;

    const input = document.getElementById("encuesta-url-input");
    const open = document.getElementById("encuesta-url-open");
    const hint = document.getElementById("encuesta-url-curso");
    const encUrl = getEncuestaUrlForCourse();
    if (input) input.value = encUrl;
    if (open) open.href = encUrl;
    if (hint) {
      hint.textContent = activeCourse
        ? `Enlace al curso «${activeCourse.nombre}»: el alumno solo elige su nombre en la lista.`
        : "Enlace general: el alumno elige curso y nombre.";
    }
    renderPrefEnvioEstado();
  }

  function renderPrefEnvioEstado() {
    const meta = document.getElementById("pref-envio-estado");
    const list = document.getElementById("pref-envio-lista");
    if (!meta || !list) return;
    list.innerHTML = "";
    if (!activeCourse) {
      meta.textContent = "";
      return;
    }
    const alumnos = activeCourse.alumnos;
    const envios = activeCourse.envios || {};
    const prefs = activeCourse.preferences || {};
    let enviados = 0;
    alumnos.forEach((a) => {
      const done = !!(envios[a] || prefs[a]);
      if (done) enviados++;
      const li = document.createElement("li");
      li.textContent = (done ? "✓ " : "○ ") + a;
      li.className = done ? "enviado" : "pendiente";
      list.appendChild(li);
    });
    meta.textContent =
      alumnos.length === 0
        ? "Añade la lista de alumnos para que puedan enviar la encuesta."
        : `${enviados} de ${alumnos.length} alumnos han enviado la encuesta (o tienen preferencias guardadas).`;
  }

  async function refreshStoreFromServer() {
    if (!filePersistence) return;
    try {
      const r = await fetch("/api/datos", { cache: "no-store" });
      if (!r.ok) return;
      const prevId = activeCourse?.id;
      store = normalizeStore(await r.json());
      if (prevId) {
        activeCourse = store.cursos.find((c) => c.id === prevId) || activeCourse;
        store.cursoActivoId = activeCourse?.id ?? store.cursoActivoId;
      }
      renderCursoSelect();
      refreshCourseUI();
    } catch (_) {
      /* ignore */
    }
  }

  function refreshCourseUI() {
    renderCursoSelect();
    const alumnos = getAlumnos();
    const input = document.getElementById("alumnos-input");
    if (input) input.value = activeCourse ? alumnos.join("\n") : "";
    ensurePrefKeys();
    renderAlumnosChips();
    renderPreguntasFields();
    fillPrefAlumnoSelect();
    renderPrefCuestionario();
    updateEncuestaProfUI();
    if (document.getElementById("panel-mapa")?.classList.contains("active")) {
      drawGraph();
    }
  }

  /** Mapa de calor 0–1: azul (bajo) → verde → ámbar → rojo (alto). */
  function heatColorFromT(t) {
    t = Math.max(0, Math.min(1, t));
    const stops = [
      { t: 0, c: [37, 99, 235] },
      { t: 0.38, c: [16, 185, 129] },
      { t: 0.68, c: [245, 158, 11] },
      { t: 1, c: [220, 38, 38] },
    ];
    let i = 0;
    while (i < stops.length - 2 && t > stops[i + 1].t) i++;
    const a = stops[i];
    const b = stops[i + 1];
    const range = b.t - a.t || 1;
    const u = (t - a.t) / range;
    const r = Math.round(a.c[0] + (b.c[0] - a.c[0]) * u);
    const g = Math.round(a.c[1] + (b.c[1] - a.c[1]) * u);
    const bl = Math.round(a.c[2] + (b.c[2] - a.c[2]) * u);
    return (
      "#" +
      [r, g, bl]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function heatColorDarker(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const f = 0.82;
    return (
      "#" +
      [r, g, b]
        .map((x) =>
          Math.max(0, Math.round(x * f))
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
    );
  }

  function heatColorLighter(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const mix = 0.38;
    const lr = Math.round(r + (255 - r) * mix);
    const lg = Math.round(g + (255 - g) * mix);
    const lb = Math.round(b + (255 - b) * mix);
    return (
      "#" +
      [lr, lg, lb]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function contrastLabelColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return L > 0.52 ? "#0f172a" : "#f8fafc";
  }

  function applyHeatmapToEdges(edges) {
    if (edges.length === 0) return;
    const vals = edges.map((e) => e.value);
    const minW = Math.min(...vals);
    const maxW = Math.max(...vals);
    edges.forEach((e) => {
      const t = maxW === minW ? 0.5 : (e.value - minW) / (maxW - minW);
      const main = heatColorFromT(t);
      e.color = { color: main, highlight: heatColorDarker(main) };
    });
  }

  function slug(name) {
    return name.trim();
  }

  function ensurePrefKeys() {
    if (!activeCourse) return;
    const alumnos = activeCourse.alumnos;
    const preferences = activeCourse.preferences;
    const next = {};
    for (const a of alumnos) {
      next[a] = preferences[a] || {};
      for (let i = 0; i < 5; i++) {
        if (!Array.isArray(next[a][i])) next[a][i] = [];
      }
    }
    activeCourse.preferences = next;
  }

  function parseAlumnosText(text) {
    const parts = text
      .split(/[\n,;]+/)
      .map((s) => slug(s))
      .filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const p of parts) {
      if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
      }
    }
    return out;
  }

  function renderAlumnosChips() {
    const el = document.getElementById("alumnos-chips");
    const count = document.getElementById("alumnos-count");
    el.innerHTML = "";
    if (!activeCourse) {
      count.textContent = "Crea o selecciona un curso arriba.";
      return;
    }
    const alumnos = getAlumnos();
    alumnos.forEach((name) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = name;
      el.appendChild(span);
    });
    count.textContent =
      alumnos.length === 0
        ? `Curso «${activeCourse.nombre}»: sin alumnos todavía.`
        : `Curso «${activeCourse.nombre}»: ${alumnos.length} alumno(s).`;
  }

  function renderPreguntasFields() {
    const wrap = document.getElementById("preguntas-fields");
    wrap.innerHTML = "";
    if (!activeCourse) {
      wrap.innerHTML = '<p class="meta">Selecciona o crea un curso para editar las actividades.</p>';
      return;
    }
    const preguntas = getPreguntas();
    for (let i = 0; i < 5; i++) {
      const row = document.createElement("div");
      row.className = "pregunta-row";
      const lab = document.createElement("label");
      lab.textContent = `Actividad ${i + 1}`;
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.index = String(i);
      input.value = preguntas[i] || "";
      input.addEventListener("change", () => {
        if (!activeCourse) return;
        activeCourse.preguntas[i] = input.value.trim() || defaultPreguntas[i];
        schedulePersist();
      });
      row.appendChild(lab);
      row.appendChild(input);
      wrap.appendChild(row);
    }
  }

  function fillPrefAlumnoSelect() {
    const sel = document.getElementById("pref-alumno");
    const prev = sel.value;
    sel.innerHTML = "";
    const alumnos = getAlumnos();
    alumnos.forEach((a) => {
      const o = document.createElement("option");
      o.value = a;
      o.textContent = a;
      sel.appendChild(o);
    });
    if (alumnos.length && prev && alumnos.includes(prev)) sel.value = prev;
    else if (alumnos.length) sel.selectedIndex = 0;
  }

  function renderPrefCuestionario() {
    const host = document.getElementById("pref-cuestionario");
    host.innerHTML = "";
    if (!activeCourse) {
      host.innerHTML = '<p class="meta">Selecciona o crea un curso.</p>';
      return;
    }
    const alumno = document.getElementById("pref-alumno").value;
    const alumnos = getAlumnos();
    const preguntas = getPreguntas();
    const preferences = getPreferences();
    if (!alumno) {
      host.innerHTML =
        '<p class="meta">Añade alumnos en el paso 1 para poder registrar preferencias.</p>';
      return;
    }
    ensurePrefKeys();
    const otros = alumnos.filter((a) => a !== alumno);

    for (let q = 0; q < 5; q++) {
      const block = document.createElement("div");
      block.className = "pref-block";
      const h3 = document.createElement("h3");
      h3.textContent = `¿Con quién te gustaría compartir: ${preguntas[q]}?`;
      block.appendChild(h3);
      const grid = document.createElement("div");
      grid.className = "check-grid";
      const chosen = new Set(preferences[alumno][q] || []);

      otros.forEach((peer) => {
        const id = `pref-${q}-${encodeURIComponent(alumno)}-${encodeURIComponent(peer)}`;
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = id;
        cb.checked = chosen.has(peer);
        cb.dataset.peer = peer;
        cb.dataset.q = String(q);
        label.appendChild(cb);
        label.appendChild(document.createTextNode(peer));
        grid.appendChild(label);
      });
      block.appendChild(grid);
      host.appendChild(block);
    }
  }

  function computeEdgeWeights() {
    const alumnos = getAlumnos();
    const preferences = getPreferences();
    ensurePrefKeys();
    const forward = new Map();
    function addForward(from, to) {
      if (!forward.has(from)) forward.set(from, new Map());
      const m = forward.get(from);
      m.set(to, (m.get(to) || 0) + 1);
    }
    for (const a of alumnos) {
      for (let q = 0; q < 5; q++) {
        const list = preferences[a]?.[q] || [];
        for (const b of list) {
          if (alumnos.includes(b) && b !== a) addForward(a, b);
        }
      }
    }
    const undirected = new Map();
    for (let i = 0; i < alumnos.length; i++) {
      for (let j = i + 1; j < alumnos.length; j++) {
        const a = alumnos[i];
        const b = alumnos[j];
        const wAB = forward.get(a)?.get(b) || 0;
        const wBA = forward.get(b)?.get(a) || 0;
        const total = wAB + wBA;
        if (total > 0) undirected.set(`${a}\0${b}`, total);
      }
    }
    return { forward, undirected };
  }

  /** Cada elección en una actividad concreta (from eligió a to). */
  function computeChoiceDetails() {
    const alumnos = getAlumnos();
    const preferences = getPreferences();
    const preguntas = getPreguntas();
    ensurePrefKeys();
    const out = [];
    for (const a of alumnos) {
      for (let q = 0; q < 5; q++) {
        for (const b of preferences[a]?.[q] || []) {
          if (alumnos.includes(b) && b !== a) {
            out.push({
              from: a,
              to: b,
              actividad: preguntas[q] || `Actividad ${q + 1}`,
            });
          }
        }
      }
    }
    return out;
  }

  function choicesForEdge(from, to, directed, allChoices) {
    if (directed) {
      return allChoices.filter((c) => c.from === from && c.to === to);
    }
    return allChoices.filter(
      (c) =>
        (c.from === from && c.to === to) || (c.from === to && c.to === from)
    );
  }

  function formatEdgeDetailTitle(edge, directed) {
    if (directed) {
      return `${edge.from} → ${edge.to}`;
    }
    return `${edge.from} — ${edge.to}`;
  }

  function showEdgeDetailDialog(edgeId) {
    if (!graphEdges) return;
    const edge = graphEdges.get(edgeId);
    if (!edge || !edge.detailLines || edge.detailLines.length === 0) return;

    const dialog = document.getElementById("dialog-edge-detalle");
    const titulo = document.getElementById("dialog-edge-titulo");
    const resumen = document.getElementById("dialog-edge-resumen");
    const lista = document.getElementById("dialog-edge-lista");
    if (!dialog || !titulo || !resumen || !lista) return;

    const directed = document.getElementById("opt-dirigido").checked;
    titulo.textContent = formatEdgeDetailTitle(edge, directed);
    resumen.textContent = `${edge.detailLines.length} elección(es) en actividades (peso mostrado: ${edge.value}).`;

    lista.innerHTML = "";
    edge.detailLines.forEach((c) => {
      const li = document.createElement("li");
      const dir = document.createElement("span");
      dir.className = "dir";
      dir.textContent = `${c.from} eligió a ${c.to}`;
      li.appendChild(dir);
      li.appendChild(document.createTextNode(` · ${c.actividad}`));
      lista.appendChild(li);
    });

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  function buildGraphData(directed, showEdgeLabels) {
    const alumnos = getAlumnos();
    const { forward, undirected } = computeEdgeWeights();
    const allChoices = computeChoiceDetails();
    const incoming = {};
    for (const id of alumnos) incoming[id] = 0;
    for (const [, m] of forward) {
      for (const [to, w] of m) {
        incoming[to] += w;
      }
    }

    const incValues = alumnos.map((id) => incoming[id] || 0);
    const minInc = incValues.length ? Math.min(...incValues) : 0;
    const maxInc = incValues.length ? Math.max(...incValues) : 0;

    const distinctPreferringCount = {};
    for (const id of alumnos) distinctPreferringCount[id] = 0;
    for (const id of alumnos) {
      const choosers = new Set();
      for (const [from, m] of forward) {
        if ((m.get(id) || 0) > 0) choosers.add(from);
      }
      distinctPreferringCount[id] = choosers.size;
    }

    const nodes = alumnos.map((id, idx) => {
      const inc = incValues[idx];
      const nDistinct = distinctPreferringCount[id] || 0;
      const peopleLine =
        nDistinct === 0
          ? "0 personas"
          : nDistinct === 1
            ? "1 persona"
            : `${nDistinct} personas`;
      const label = `${id}\n${peopleLine}`;
      const tHeat =
        maxInc === minInc ? 0.5 : (inc - minInc) / (maxInc - minInc);
      const bg = heatColorFromT(tHeat);
      const border = heatColorDarker(bg);
      return {
        id,
        label: label,
        value: Math.max(inc, 1),
        color: {
          background: bg,
          border: border,
          highlight: {
            background: heatColorLighter(bg),
            border: heatColorDarker(border),
          },
        },
        font: {
          color: contrastLabelColor(bg),
          size: 13,
          align: "center",
          vadjust: 0,
        },
        title:
          nDistinct === 0 && inc === 0
            ? `${id} · Nadie le ha elegido aún`
            : `${id} · ${nDistinct} ${nDistinct === 1 ? "persona distinta le ha elegido" : "personas distintas le han elegido"} (${inc} elección${inc === 1 ? "" : "es"} en total en actividades)`,
      };
    });

    const edges = [];

    if (directed) {
      const seen = new Set();
      for (const [from, m] of forward) {
        for (const [to, w] of m) {
          if (w <= 0) continue;
          const eid = `${from}->${to}`;
          if (seen.has(eid)) continue;
          seen.add(eid);
          const detailLines = choicesForEdge(from, to, true, allChoices);
          const titleExtra =
            detailLines.length > 0
              ? "\n" +
                detailLines
                  .map((c) => `• ${c.from} → ${c.to}: ${c.actividad}`)
                  .join("\n")
              : "";
          edges.push({
            id: eid,
            from,
            to,
            arrows: "to",
            value: w,
            label: showEdgeLabels ? String(w) : undefined,
            detailLines,
            title: `${from} eligió a ${to}: ${w} elección(es). Clic en el número para ver el detalle.${titleExtra}`,
          });
        }
      }
    } else {
      for (const [key, total] of undirected) {
        const [a, b] = key.split("\0");
        const detailLines = choicesForEdge(a, b, false, allChoices);
        const titleExtra =
          detailLines.length > 0
            ? "\n" +
              detailLines
                .map((c) => `• ${c.from} eligió a ${c.to}: ${c.actividad}`)
                .join("\n")
            : "";
        edges.push({
          id: `${a}--${b}`,
          from: a,
          to: b,
          value: total,
          label: showEdgeLabels ? String(total) : undefined,
          detailLines,
          title: `Peso ${total}. Clic en el número para ver quién eligió a quién.${titleExtra}`,
        });
      }
    }

    applyHeatmapToEdges(edges);
    return { nodes, edges };
  }

  function getGraphFullscreenWrap() {
    return document.getElementById("graph-fullscreen-wrap");
  }

  function isGraphFullscreen() {
    const wrap = getGraphFullscreenWrap();
    return !!(wrap && document.fullscreenElement === wrap);
  }

  function updateGraphFullscreenButton() {
    const btn = document.getElementById("btn-graph-fullscreen");
    if (!btn) return;
    const on = isGraphFullscreen();
    btn.textContent = on ? "Salir de pantalla completa" : "Pantalla completa";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    if (network) {
      setTimeout(() => network.fit({ animation: true }), 150);
    }
  }

  async function toggleGraphFullscreen() {
    const wrap = getGraphFullscreenWrap();
    if (!wrap) return;
    try {
      if (isGraphFullscreen()) {
        await document.exitFullscreen();
      } else {
        await wrap.requestFullscreen();
      }
    } catch (_) {
      alert("Tu navegador no permite pantalla completa en esta vista.");
    }
  }

  function drawGraph() {
    if (!graphContainer) graphContainer = document.getElementById("graph");
    const directed = document.getElementById("opt-dirigido").checked;
    const showLabels = document.getElementById("opt-etiquetas").checked;
    const alumnos = getAlumnos();
    const { nodes, edges } = buildGraphData(directed, showLabels);

    const legend = document.getElementById("graph-legend");
    const cursoLabel = activeCourse ? ` · ${activeCourse.nombre}` : "";
    legend.textContent =
      !activeCourse
        ? "Selecciona un curso para ver su sociograma."
        : alumnos.length === 0
          ? `Curso «${activeCourse.nombre}»: añade alumnos para ver el sociograma.`
          : `${nodes.length} nodos, ${edges.length} vínculos${cursoLabel}. Clic en el número de una línea para ver las elecciones.`;

    if (!activeCourse || alumnos.length === 0) {
      if (network) {
        network.destroy();
        network = null;
      }
      graphEdges = null;
      graphContainer.innerHTML =
        '<p class="meta" style="padding:1rem">Sin datos para dibujar.</p>';
      return;
    }

    graphContainer.innerHTML = "";
    graphEdges = new vis.DataSet(edges);
    const data = { nodes: new vis.DataSet(nodes), edges: graphEdges };
    const options = {
      nodes: {
        shape: "circle",
        scaling: {
          min: 26,
          max: 54,
          label: { enabled: true, min: 10, max: 16 },
        },
        borderWidth: 2,
        font: {
          align: "center",
          vadjust: 0,
        },
      },
      edges: {
        smooth: { type: "continuous", roundness: 0.35 },
        scaling: {
          min: 1,
          max: 8,
          label: { enabled: showLabels, min: 10, max: 18 },
        },
        font: {
          size: 13,
          color: "#0f172a",
          strokeWidth: 3,
          strokeColor: "#f4f2ef",
          align: "middle",
        },
      },
      physics: {
        enabled: true,
        stabilization: { iterations: 200 },
        barnesHut: {
          gravitationalConstant: -3500,
          centralGravity: 0.25,
          springLength: 120,
          springConstant: 0.035,
        },
      },
      interaction: { hover: true, tooltipDelay: 120, selectConnectedEdges: false },
    };

    network = new vis.Network(graphContainer, data, options);
    network.on("click", (params) => {
      if (params.edges.length === 1) {
        showEdgeDetailDialog(params.edges[0]);
      }
    });
    network.once("stabilizationIterationsDone", () => {
      network.setOptions({ physics: false });
    });
  }

  function switchTab(id) {
    document.querySelectorAll(".tab").forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".panel").forEach((p) => {
      const on = p.id === `panel-${id}`;
      p.classList.toggle("active", on);
      p.hidden = !on;
    });
    if (id === "mapa") drawGraph();
    if ((id === "preferencias" || id === "alumnos") && filePersistence) {
      refreshStoreFromServer();
    }
  }

  async function applyImportedData(data) {
    if (Array.isArray(data.cursos)) {
      if (
        store.cursos.length > 0 &&
        !confirm(
          "El archivo contiene varios cursos. ¿Reemplazar todos los datos actuales?"
        )
      ) {
        return false;
      }
      store = normalizeStore(data);
      const id = store.cursoActivoId || store.cursos[0]?.id;
      activeCourse = id ? store.cursos.find((c) => c.id === id) || null : null;
      return true;
    }

    if (!(await ensureActiveCourseForEdit())) return false;
    if (Array.isArray(data.alumnos)) {
      activeCourse.alumnos = data.alumnos.map(slug).filter(Boolean);
    }
    if (Array.isArray(data.preguntas) && data.preguntas.length === 5) {
      activeCourse.preguntas = data.preguntas.map((p) => String(p));
    }
    if (data.preferences && typeof data.preferences === "object") {
      activeCourse.preferences = data.preferences;
    }
    return true;
  }

  async function init() {
    await loadStore();

    if (store.cursos.length > 0) {
      const id = store.cursoActivoId || store.cursos[0].id;
      activeCourse = store.cursos.find((c) => c.id === id) || store.cursos[0];
      store.cursoActivoId = activeCourse.id;
    }

    renderCursoSelect();
    refreshCourseUI();
    updateEncuestaProfUI();

    document.getElementById("dialog-edge-cerrar")?.addEventListener("click", () => {
      document.getElementById("dialog-edge-detalle")?.close();
    });

    document.getElementById("btn-copy-encuesta")?.addEventListener("click", async () => {
      const url = getEncuestaUrlForCourse();
      try {
        await navigator.clipboard.writeText(url);
        const btn = document.getElementById("btn-copy-encuesta");
        const prev = btn.textContent;
        btn.textContent = "¡Copiado!";
        setTimeout(() => {
          btn.textContent = prev;
        }, 2000);
      } catch (_) {
        const input = document.getElementById("encuesta-url-input");
        input.select();
        document.execCommand("copy");
        alert("Enlace copiado.");
      }
    });

    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    document.getElementById("curso-select").addEventListener("change", (ev) => {
      const id = ev.target.value;
      if (!id) return;
      setActiveCourse(id);
    });

    document.getElementById("btn-nuevo-curso").addEventListener("click", async () => {
      const nombre = await askCursoNombre("Nombre del nuevo curso", "");
      if (nombre === null) return;
      createCourse(nombre || "Nuevo curso");
    });

    document.getElementById("btn-renombrar-curso").addEventListener("click", async () => {
      syncActiveCourseFromSelect();
      if (!activeCourse) {
        alert("Crea o selecciona un curso primero.");
        return;
      }
      const nombre = await askCursoNombre(
        "Nuevo nombre del curso",
        activeCourse.nombre
      );
      if (nombre === null) return;
      activeCourse.nombre = nombre;
      renderCursoSelect();
      schedulePersist();
      renderAlumnosChips();
    });

    document.getElementById("btn-eliminar-curso").addEventListener("click", () => {
      if (!activeCourse) {
        alert("No hay curso seleccionado.");
        return;
      }
      if (
        !confirm(
          `¿Eliminar el curso «${activeCourse.nombre}» y todas sus encuestas?`
        )
      ) {
        return;
      }
      const removedId = activeCourse.id;
      store.cursos = store.cursos.filter((c) => c.id !== removedId);
      if (store.cursos.length) {
        setActiveCourse(store.cursos[0].id);
      } else {
        activeCourse = null;
        store.cursoActivoId = null;
        refreshCourseUI();
        schedulePersist();
      }
    });

    document.getElementById("btn-parse-alumnos").addEventListener("click", async () => {
      if (!(await ensureActiveCourseForEdit())) return;
      const text = document.getElementById("alumnos-input").value;
      activeCourse.alumnos = parseAlumnosText(text);
      ensurePrefKeys();
      schedulePersist();
      renderAlumnosChips();
      fillPrefAlumnoSelect();
      renderPrefCuestionario();
    });

    document.getElementById("btn-clear-alumnos").addEventListener("click", () => {
      if (!activeCourse) return;
      if (!confirm("¿Vaciar la lista de alumnos de este curso?")) return;
      document.getElementById("alumnos-input").value = "";
      activeCourse.alumnos = [];
      activeCourse.preferences = {};
      schedulePersist();
      renderAlumnosChips();
      fillPrefAlumnoSelect();
      renderPrefCuestionario();
    });

    document.getElementById("pref-alumno").addEventListener("change", renderPrefCuestionario);

    document.getElementById("btn-guardar-pref").addEventListener("click", () => {
      if (!activeCourse) {
        alert("Selecciona un curso primero.");
        return;
      }
      const alumno = document.getElementById("pref-alumno").value;
      if (!alumno) return;
      ensurePrefKeys();
      for (let q = 0; q < 5; q++) {
        activeCourse.preferences[alumno][q] = [];
      }
      document.querySelectorAll("#pref-cuestionario input[type=checkbox]").forEach((cb) => {
        if (cb.checked) {
          const q = Number(cb.dataset.q);
          const peer = cb.dataset.peer;
          activeCourse.preferences[alumno][q].push(peer);
        }
      });
      schedulePersist();
      renderPrefCuestionario();
      alert("Preferencias guardadas para " + alumno + ".");
    });

    document.getElementById("opt-dirigido").addEventListener("change", drawGraph);
    document.getElementById("opt-etiquetas").addEventListener("change", drawGraph);
    document.getElementById("btn-fit").addEventListener("click", () => {
      if (network) network.fit({ animation: true });
    });

    document.getElementById("btn-graph-fullscreen")?.addEventListener("click", () => {
      toggleGraphFullscreen();
    });
    document.addEventListener("fullscreenchange", updateGraphFullscreenButton);

    document.getElementById("btn-export").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(store, null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "datos.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });

    document.getElementById("import-file").addEventListener("change", (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const data = JSON.parse(String(reader.result));
          if (!(await applyImportedData(data))) return;
          ensurePrefKeys();
          schedulePersist();
          renderCursoSelect();
          if (activeCourse) {
            document.getElementById("curso-select").value = activeCourse.id;
          }
          refreshCourseUI();
        } catch (_) {
          alert("No se pudo importar el archivo JSON.");
        }
      };
      reader.readAsText(file);
      ev.target.value = "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
    });
  } else {
    init();
  }
})();
