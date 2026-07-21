(function () {
  "use strict";

  /** @type {{ cursos: Array<{id:string,nombre:string,alumnos:string[],preguntas:string[]}> }} */
  let catalog = { cursos: [] };
  /** @type {{ id: string, nombre: string, alumnos: string[], preguntas: string[] }|null} */
  let cursoSel = null;
  let alumnoSel = "";

  function setStatus(msg, isError) {
    const el = document.getElementById("encuesta-status");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("status-error", !!isError);
  }

  function getQueryCursoId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("curso") || params.get("cursoId") || "";
  }

  async function loadCatalog() {
    let r;
    try {
      r = await fetch("/api/encuesta", { cache: "no-store" });
    } catch (_) {
      throw new Error(
        "No hay conexión con el servidor. Abre esta página desde http://…:3780/encuesta.html (no como archivo local)."
      );
    }
    if (r.status === 404) {
      throw new Error(
        "El servidor está desactualizado. Pide al profesor que reinicie con npm start y vuelve a cargar la página."
      );
    }
    if (!r.ok) {
      throw new Error("No se pudo cargar la lista de cursos (error " + r.status + ").");
    }
    catalog = await r.json();
    if (!Array.isArray(catalog.cursos)) catalog.cursos = [];
  }

  function fillCursoSelect() {
    const sel = document.getElementById("enc-curso");
    const pre = getQueryCursoId();
    sel.innerHTML = "";
    if (catalog.cursos.length === 0) {
      sel.disabled = true;
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "(El profesor aún no ha creado ningún curso)";
      sel.appendChild(o);
      return;
    }
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "— Elige tu curso —";
    sel.appendChild(placeholder);
    catalog.cursos.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.nombre;
      sel.appendChild(o);
    });
    sel.disabled = false;
    if (pre && catalog.cursos.some((c) => c.id === pre)) {
      sel.value = pre;
      onCursoChange();
    }
  }

  function onCursoChange() {
    const sel = document.getElementById("enc-curso");
    const id = sel.value;
    cursoSel = catalog.cursos.find((c) => c.id === id) || null;
    const alumnoSelEl = document.getElementById("enc-alumno");
    alumnoSelEl.innerHTML = "";
    alumnoSel = "";
    if (!cursoSel) {
      alumnoSelEl.disabled = true;
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "Primero elige un curso";
      alumnoSelEl.appendChild(o);
      updateContinuar();
      return;
    }
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "— Elige tu nombre —";
    alumnoSelEl.appendChild(ph);
    cursoSel.alumnos.forEach((nombre) => {
      const o = document.createElement("option");
      o.value = nombre;
      o.textContent = nombre;
      alumnoSelEl.appendChild(o);
    });
    alumnoSelEl.disabled = cursoSel.alumnos.length === 0;
    if (cursoSel.alumnos.length === 0) {
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "(Este curso aún no tiene lista de alumnos)";
      alumnoSelEl.appendChild(o);
    }
    updateContinuar();
  }

  function onAlumnoChange() {
    alumnoSel = document.getElementById("enc-alumno").value;
    updateContinuar();
  }

  function updateContinuar() {
    const ok = !!(cursoSel && alumnoSel);
    document.getElementById("btn-continuar").disabled = !ok;
  }

  function showStep(stepId) {
    document.querySelectorAll(".encuesta-step").forEach((s) => {
      const on = s.id === stepId;
      s.classList.toggle("active", on);
      s.hidden = !on;
    });
  }

  async function loadExistingPreferences() {
    const r = await fetch(
      "/api/encuesta/preferencias?" +
        new URLSearchParams({ cursoId: cursoSel.id, alumno: alumnoSel }),
      { cache: "no-store" }
    );
    if (!r.ok) return null;
    const data = await r.json();
    return data.preferences || null;
  }

  function renderCuestionario(existing) {
    const host = document.getElementById("enc-cuestionario");
    host.innerHTML = "";
    const otros = cursoSel.alumnos.filter((a) => a !== alumnoSel);
    const preguntas = cursoSel.preguntas;

    document.getElementById("enc-resumen-alumno").textContent =
      `${alumnoSel} · ${cursoSel.nombre}`;

    for (let q = 0; q < 5; q++) {
      const block = document.createElement("div");
      block.className = "pref-block";
      const h3 = document.createElement("h3");
      h3.textContent = `¿Con quién te gustaría compartir: ${preguntas[q]}?`;
      block.appendChild(h3);
      const grid = document.createElement("div");
      grid.className = "check-grid";
      const chosen = new Set(
        (existing && (existing[String(q)] || existing[q])) || []
      );

      if (otros.length === 0) {
        const p = document.createElement("p");
        p.className = "meta";
        p.textContent = "No hay más alumnos en este curso.";
        block.appendChild(p);
      } else {
        otros.forEach((peer) => {
          const label = document.createElement("label");
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.checked = chosen.has(peer);
          cb.dataset.peer = peer;
          cb.dataset.q = String(q);
          label.appendChild(cb);
          label.appendChild(document.createTextNode(peer));
          grid.appendChild(label);
        });
        block.appendChild(grid);
      }
      host.appendChild(block);
    }
  }

  async function goToCuestionario() {
    if (!cursoSel || !alumnoSel) return;
    setStatus("Cargando cuestionario…");
    try {
      const existing = await loadExistingPreferences();
      renderCuestionario(existing);
      showStep("step-cuestionario");
      setStatus("");
    } catch (_) {
      setStatus("No se pudo cargar el cuestionario.", true);
    }
  }

  function collectPreferences() {
    const prefs = {};
    for (let q = 0; q < 5; q++) prefs[q] = [];
    document
      .querySelectorAll("#enc-cuestionario input[type=checkbox]:checked")
      .forEach((cb) => {
        const q = Number(cb.dataset.q);
        const peer = cb.dataset.peer;
        if (!prefs[q]) prefs[q] = [];
        prefs[q].push(peer);
      });
    return prefs;
  }

  async function enviarRespuestas() {
    const btn = document.getElementById("btn-enviar");
    btn.disabled = true;
    setStatus("Enviando…");
    try {
      const r = await fetch("/api/encuesta/preferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursoId: cursoSel.id,
          alumno: alumnoSel,
          preferences: collectPreferences(),
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || "Error al guardar");
      }
      document.getElementById("enc-confirmacion-texto").textContent =
        `Tus preferencias de ${alumnoSel} (${cursoSel.nombre}) se han guardado correctamente.`;
      showStep("step-confirmacion");
      setStatus("");
    } catch (err) {
      setStatus(err.message || "No se pudo enviar. ¿Está el servidor encendido?", true);
    } finally {
      btn.disabled = false;
    }
  }

  function init() {
    document.getElementById("enc-curso").addEventListener("change", onCursoChange);
    document.getElementById("enc-alumno").addEventListener("change", onAlumnoChange);
    document.getElementById("btn-continuar").addEventListener("click", goToCuestionario);
    document.getElementById("btn-volver").addEventListener("click", () => {
      showStep("step-identidad");
    });
    document.getElementById("btn-enviar").addEventListener("click", enviarRespuestas);
    document.getElementById("btn-editar").addEventListener("click", goToCuestionario);

    setStatus("Conectando…");
    loadCatalog()
      .then(() => {
        fillCursoSelect();
        if (catalog.cursos.length === 0) {
          setStatus(
            "No hay cursos disponibles. El profesor debe crear el curso y la lista de alumnos primero.",
            true
          );
        } else {
          setStatus(
            `${catalog.cursos.length} curso(s) disponible(s). Elige el tuyo y tu nombre.`
          );
        }
      })
      .catch((err) => {
        setStatus(
          err.message +
            " Abre esta página con npm start (misma red que el ordenador del profesor).",
          true
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
