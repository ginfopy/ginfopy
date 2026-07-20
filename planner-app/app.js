const TEMPLATE_STORAGE_KEY = "prep_templates_v1";

const templateForm = document.getElementById("template-form");
const templateList = document.getElementById("template-list");
const eventTemplateSelect = document.getElementById("event-template");

const eventForm = document.getElementById("event-form");
const timelineElement = document.getElementById("timeline");
const timelineNote = document.getElementById("timeline-note");
const agendaDateInput = document.getElementById("agenda-date");
const agendaNote = document.getElementById("agenda-note");
const agendaList = document.getElementById("agenda-list");
const eventList = document.getElementById("event-list");
const descendingCalendarList = document.getElementById("descending-calendar-list");

const eventFields = {
  prepHours: document.getElementById("event-prep-hours"),
  qualityDays: document.getElementById("event-quality-days"),
  coordinationDays: document.getElementById("event-coordination-days"),
  professorsDays: document.getElementById("event-professors-days")
};

let templates = loadTemplates();
let events = [];
renderTemplates();
populateTemplateSelect();
setEventFields(0, 0, 0, 0);
setAgendaDateToday();
bootstrapEvents();

templateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const template = {
    id: crypto.randomUUID(),
    name: document.getElementById("tpl-name").value.trim(),
    prepHours: parseInt(document.getElementById("tpl-prep-hours").value, 10),
    qualityDays: parseInt(document.getElementById("tpl-quality-days").value, 10),
    coordinationDays: parseInt(document.getElementById("tpl-coordination-days").value, 10),
    professorsDays: parseInt(document.getElementById("tpl-professors-days").value, 10)
  };

  templates.push(template);
  saveTemplates();
  renderTemplates();
  populateTemplateSelect();
  templateForm.reset();
});

eventTemplateSelect.addEventListener("change", () => {
  const selected = templates.find((t) => t.id === eventTemplateSelect.value);
  if (!selected) {
    setEventFields(0, 0, 0, 0);
    return;
  }

  setEventFields(
    selected.prepHours,
    selected.qualityDays,
    selected.coordinationDays,
    selected.professorsDays
  );
});

agendaDateInput.addEventListener("change", () => {
  renderAgendaForDate(agendaDateInput.value);
});

eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = document.getElementById("event-type").value.trim();
  const eventDateStr = document.getElementById("event-date").value;
  const prepHours = parseInt(eventFields.prepHours.value, 10);
  const qualityDays = parseInt(eventFields.qualityDays.value, 10);
  const coordinationDays = parseInt(eventFields.coordinationDays.value, 10);
  const professorsDays = parseInt(eventFields.professorsDays.value, 10);
  const extraHolidays = parseExtraHolidays(
    document.getElementById("event-extra-holidays").value
  );

  const eventDate = fromDateInput(eventDateStr);
  if (!eventDate) {
    timelineNote.textContent = "La fecha del evento no es válida.";
    timelineElement.innerHTML = "";
    return;
  }

  const plan = buildTimeline({
    type,
    eventDate,
    prepHours,
    qualityDays,
    coordinationDays,
    professorsDays,
    extraHolidays
  });

  const eventRecord = {
    id: crypto.randomUUID(),
    type,
    eventDateYmd: toYMD(eventDate),
    createdAt: new Date().toISOString(),
    steps: plan.map((step) => ({
      id: crypto.randomUUID(),
      task: step.task,
      dateYmd: toYMD(step.date),
      dependency: step.dependency,
      done: false
    }))
  };

  try {
    await apiCreateEvent(eventRecord);
    await refreshEventsFromDb();
    renderTimeline(plan);
    eventForm.reset();
    eventTemplateSelect.value = "";
    setEventFields(0, 0, 0, 0);
  } catch (error) {
    timelineNote.textContent = error.message || "No se pudo guardar el evento en la base de datos.";
  }
});

function buildTimeline(input) {
  const preparationDays = Math.ceil(input.prepHours / 24);
  const holidaysSet = new Set(input.extraHolidays);

  const milestones = [];
  let anchor = previousWorkingDay(input.eventDate, holidaysSet);
  milestones.push({
    task: `Evento: ${input.type}`,
    date: anchor,
    dependency: "Fecha final"
  });

  anchor = subtractWorkingDays(anchor, input.professorsDays, holidaysSet);
  milestones.push({
    task: "Entrega de profesores",
    date: anchor,
    dependency: "Debe completarse antes del evento"
  });

  anchor = subtractWorkingDays(anchor, input.coordinationDays, holidaysSet);
  milestones.push({
    task: "Revisión de coordinación",
    date: anchor,
    dependency: "Depende de entrega de profesores"
  });

  anchor = subtractWorkingDays(anchor, input.qualityDays, holidaysSet);
  milestones.push({
    task: "Control de calidad",
    date: anchor,
    dependency: "Depende de revisión de coordinación"
  });

  anchor = subtractWorkingDays(anchor, preparationDays, holidaysSet);
  milestones.push({
    task: "Inicio de preparación",
    date: anchor,
    dependency: `Requiere ${input.prepHours} horas de preparación`
  });

  return milestones.reverse();
}

function renderTimeline(plan) {
  timelineElement.innerHTML = "";
  timelineNote.textContent = "Cronograma calculado (ajustado por días no laborables).";
  for (const step of plan) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${step.task}</strong> - ${formatDate(step.date)} <em>(${step.dependency})</em>`;
    timelineElement.appendChild(li);
  }
}

function renderAgendaForDate(dateYmd) {
  if (!dateYmd) {
    agendaNote.textContent = "Selecciona una fecha para ver pendientes.";
    agendaList.innerHTML = "";
    return;
  }

  const tasks = flattenEventTasks()
    .filter((task) => task.dateYmd === dateYmd)
    .sort((a, b) => a.eventType.localeCompare(b.eventType));

  agendaList.innerHTML = "";
  if (tasks.length === 0) {
    agendaNote.textContent = "No hay tareas programadas para este día.";
    const li = document.createElement("li");
    li.textContent = "Día libre de tareas de preparación.";
    agendaList.appendChild(li);
    return;
  }

  const pendingCount = tasks.filter((task) => !task.done).length;
  agendaNote.textContent = `Total: ${tasks.length} tareas (${pendingCount} pendientes).`;

  tasks.forEach((task) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", async () => {
      await setTaskDone(task.eventId, task.taskId, checkbox.checked);
    });

    const text = document.createElement("span");
    text.className = task.done ? "task-done" : "";
    text.textContent = `${task.eventType}: ${task.task} (${task.dependency})`;
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(text);
    agendaList.appendChild(li);
  });
}

function renderEventList() {
  eventList.innerHTML = "";
  if (events.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay eventos guardados.";
    eventList.appendChild(li);
    return;
  }

  const ordered = [...events].sort((a, b) => a.eventDateYmd.localeCompare(b.eventDateYmd));
  ordered.forEach((event) => {
    const li = document.createElement("li");
    const pending = event.steps.filter((step) => !step.done).length;

    const title = document.createElement("span");
    title.className = "event-title";
    title.textContent = `${event.type} (${event.eventDateYmd}) - ${pending} pendientes`;
    li.appendChild(title);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", async () => {
      try {
        await apiDeleteEvent(event.id);
        await refreshEventsFromDb();
      } catch (error) {
        agendaNote.textContent = error.message || "No se pudo eliminar el evento.";
      }
    });

    li.appendChild(deleteBtn);
    eventList.appendChild(li);
  });
}

function flattenEventTasks() {
  return events.flatMap((event) =>
    event.steps.map((step) => ({
      eventId: event.id,
      eventType: event.type,
      taskId: step.id,
      task: step.task,
      dateYmd: step.dateYmd,
      dependency: step.dependency,
      done: step.done
    }))
  );
}

async function setTaskDone(eventId, taskId, isDone) {
  const event = events.find((x) => x.id === eventId);
  if (!event) return;
  try {
    await apiSetStepDone(taskId, isDone);
    await refreshEventsFromDb();
  } catch (error) {
    agendaNote.textContent = error.message || "No se pudo actualizar la tarea.";
  }
}

function previousWorkingDay(date, holidaysSet) {
  const d = cloneDate(date);
  while (!isWorkingDay(d, holidaysSet)) d.setDate(d.getDate() - 1);
  return d;
}

function subtractWorkingDays(date, days, holidaysSet) {
  const d = cloneDate(date);
  let remaining = days;
  while (remaining > 0) {
    d.setDate(d.getDate() - 1);
    if (isWorkingDay(d, holidaysSet)) remaining--;
  }
  return d;
}

function isWorkingDay(date, holidaysSet) {
  const day = date.getDay();
  const ymd = toYMD(date);
  const isWeekend = day === 0 || day === 6;
  return !isWeekend && !holidaysSet.has(ymd);
}

function parseExtraHolidays(raw) {
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromDateInput(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full"
  }).format(date);
}

function cloneDate(date) {
  return new Date(date.getTime());
}

function loadTemplates() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveTemplates() {
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

function renderTemplates() {
  templateList.innerHTML = "";
  if (templates.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin plantillas guardadas.";
    templateList.appendChild(li);
    return;
  }

  templates.forEach((tpl) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${tpl.name}</strong> -
      Prep: ${tpl.prepHours}h, Calidad: ${tpl.qualityDays}d,
      Coordinación: ${tpl.coordinationDays}d, Profesores: ${tpl.professorsDays}d
    `;

    const delButton = document.createElement("button");
    delButton.type = "button";
    delButton.textContent = "Eliminar";
    delButton.addEventListener("click", () => {
      templates = templates.filter((t) => t.id !== tpl.id);
      saveTemplates();
      renderTemplates();
      populateTemplateSelect();
    });

    li.appendChild(delButton);
    templateList.appendChild(li);
  });
}

function populateTemplateSelect() {
  eventTemplateSelect.innerHTML = `<option value="">Sin plantilla</option>`;
  templates.forEach((tpl) => {
    const opt = document.createElement("option");
    opt.value = tpl.id;
    opt.textContent = tpl.name;
    eventTemplateSelect.appendChild(opt);
  });

  // Si no hay plantilla seleccionada, mantenemos campos en 0.
  if (!eventTemplateSelect.value) {
    setEventFields(0, 0, 0, 0);
  }
}

function setEventFields(prepHours, qualityDays, coordinationDays, professorsDays) {
  eventFields.prepHours.value = prepHours;
  eventFields.qualityDays.value = qualityDays;
  eventFields.coordinationDays.value = coordinationDays;
  eventFields.professorsDays.value = professorsDays;
}

function setAgendaDateToday() {
  agendaDateInput.value = toYMD(new Date());
}

function renderDescendingCalendar() {
  const tasks = flattenEventTasks().sort((a, b) => {
    if (a.dateYmd === b.dateYmd) return a.eventType.localeCompare(b.eventType);
    return b.dateYmd.localeCompare(a.dateYmd);
  });

  descendingCalendarList.innerHTML = "";
  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay procesos guardados en la base de datos.";
    descendingCalendarList.appendChild(li);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.dateYmd}</strong> - ${task.eventType}: ${task.task}
      <em>(${task.dependency})</em>
    `;
    descendingCalendarList.appendChild(li);
  });
}

async function bootstrapEvents() {
  try {
    await refreshEventsFromDb();
  } catch (error) {
    agendaNote.textContent = error.message || "No se pudo cargar la base de datos.";
  }
}

async function refreshEventsFromDb() {
  events = await apiGetEvents();
  renderEventList();
  renderAgendaForDate(agendaDateInput.value);
  renderDescendingCalendar();
}

async function apiGetEvents() {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("No se pudieron cargar eventos");
  return res.json();
}

async function apiCreateEvent(eventRecord) {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventRecord)
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data.error || "No se pudo guardar el evento");
  }
}

async function apiDeleteEvent(eventId) {
  const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar el evento");
}

async function apiSetStepDone(stepId, done) {
  const res = await fetch(`/api/steps/${stepId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done })
  });
  if (!res.ok) throw new Error("No se pudo actualizar la tarea");
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}
