# Documentación del Sistema de Educación Inclusiva
## Colegio Presbiteriano Cerritos — Paraguay

**Versión del sistema:** 2.0  
**Autor:** Lic. Rodrigo Godoy — Director Nivel Secundario  
**Año lectivo de referencia:** 2026

---

## Novedades v2.0

| Funcionalidad | Descripción |
|---------------|-------------|
| **Paginación** | Tablas de 25 registros por página (escalable a cientos de alumnos) |
| **Búsqueda global** | `Ctrl+K` — busca en todas las secciones simultáneamente |
| **Expediente del alumno** | Vista integrada: datos, compromisos, seguimiento y docs MEC |
| **Gráficos analíticos** | Dashboard con Chart.js: adecuaciones y estado documental |
| **Historial de actividad** | Auditoría de cambios con usuario y timestamp |
| **API ampliada** | `/api/stats`, `/api/buscar`, `/api/historial`, `/api/alumnos/:id/expediente` |
| **Identificación de usuario** | Nombre del docente en login para trazabilidad |

---

## Tabla de contenidos

1. [Descripción general](#1-descripción-general)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Modelo de datos](#4-modelo-de-datos)
5. [Módulos funcionales](#5-módulos-funcionales)
6. [Lógica de alertas y fechas](#6-lógica-de-alertas-y-fechas)
7. [Aplicación web (frontend)](#7-aplicación-web-frontend)
8. [Servidor backend](#8-servidor-backend)
9. [Versión standalone (HTML local)](#9-versión-standalone-html-local)
10. [Generadores de planilla Excel](#10-generadores-de-planilla-excel)
11. [Calendario MEC de referencia](#11-calendario-mec-de-referencia)
12. [Normativa paraguaya de referencia](#12-normativa-paraguaya-de-referencia)
13. [Despliegue e instalación](#13-despliegue-e-instalación)
14. [Respaldo, importación y exportación](#14-respaldo-importación-y-exportación)
15. [Seguridad y limitaciones](#15-seguridad-y-limitaciones)
16. [Flujos de trabajo típicos](#16-flujos-de-trabajo-típicos)

---

## 1. Descripción general

Este proyecto es un **Sistema de Seguimiento de Educación Inclusiva** desarrollado para el **Colegio Presbiteriano Cerritos** (Paraguay). Permite gestionar de forma centralizada:

- El registro de alumnos inclusivos y sus adecuaciones curriculares.
- Los compromisos y acuerdos con familias.
- Los documentos y trámites exigidos por el **Ministerio de Educación y Ciencias (MEC)**.
- El seguimiento académico individual por materia y período.
- Un calendario anual con fechas clave de la normativa inclusiva.

El sistema existe en **tres formatos complementarios**:

| Formato | Archivo / carpeta | Persistencia | Uso recomendado |
|---------|-------------------|--------------|-----------------|
| **Web con servidor** | `servidor_inclusivo/` | SQLite en servidor (Railway) | Equipo docente compartiendo datos en la nube |
| **Web standalone** | `SistemaInclusivo_Cerritos.html` | Archivo JSON local (Chrome/Edge) | Uso offline en una sola computadora |
| **Planilla Excel** | Scripts Python `crear_planilla_*.py` | Archivo `.xlsx` | Registro tradicional con fórmulas y formato condicional |

Los tres formatos comparten la **misma lógica de negocio** (secciones, campos, alertas por vencimiento, documentos MEC precargados y calendario 2026), pero difieren en cómo **persisten los datos**.

---

## 2. Estructura del proyecto

```
003_Sistema Inclusivos/
│
├── Documentacion.md                    ← Este documento
├── Calendario_MEC_2026.md              ← Referencia normativa del calendario escolar nacional
├── SistemaInclusivo_Cerritos.html      ← App web standalone (archivo JSON local)
│
├── crear_planilla_inclusiva.py         ← Generador Excel (capacidad estándar: ~50 alumnos)
├── crear_planilla_inclusiva_250.py     ← Generador Excel ampliado (hasta 250 alumnos)
│
└── servidor_inclusivo/                 ← App web + servidor Node.js
    ├── server.js                       ← Backend Express + SQLite (v2)
    ├── package.json                    ← Dependencias npm
    ├── .gitignore                      ← Ignora node_modules, *.db, .env
    ├── INSTRUCCIONES.md                ← Guía de despliegue en Railway
    ├── datos.db                        ← Base SQLite (se crea al iniciar; no versionada)
    └── public/
        ├── index.html                  ← Frontend principal
        └── js/
            └── app-v2.js               ← Módulo v2: paginación, búsqueda, gráficos, expediente
```

### Dependencias principales

| Componente | Tecnología | Versión mínima |
|------------|------------|----------------|
| Servidor | Node.js | ≥ 18.0.0 |
| Framework HTTP | Express | ^4.18.2 |
| Base de datos | better-sqlite3 | ^9.4.3 |
| Frontend | Bootstrap 5.3.2 + Bootstrap Icons | CDN |
| Planillas Excel | openpyxl (Python) | — |

---

## 3. Arquitectura del sistema

### 3.1. Diagrama general

```
┌─────────────────────────────────────────────────────────────────┐
│                     NAVEGADOR WEB (Frontend)                     │
│  index.html  /  SistemaInclusivo_Cerritos.html                  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Dashboard│  │ Alumnos  │  │ Familias │  │ Documentos   │   │
│  │ (alertas)│  │          │  │          │  │ MEC          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────────────────────────────┐    │
│  │ Seguimiento  │  │ Calendario 2026                       │    │
│  └──────────────┘  └──────────────────────────────────────┘    │
│                                                                  │
│  Capa de datos en memoria: objeto `_mem` + API `DB`             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │                                   │
          ▼                                   ▼
┌─────────────────────┐           ┌─────────────────────────┐
│  MODO SERVIDOR      │           │  MODO STANDALONE        │
│                     │           │                         │
│  POST /api/data     │           │  File System Access API │
│  GET  /api/data     │           │  + IndexedDB (handle)   │
│         │           │           │         │               │
│         ▼           │           │         ▼               │
│  server.js          │           │  datos_inclusivo.json   │
│         │           │           │  (archivo local)        │
│         ▼           │           └─────────────────────────┘
│  SQLite (datos.db)  │
└─────────────────────┘
```

### 3.2. Patrón de diseño

La aplicación sigue un patrón **SPA monolítica** (Single Page Application):

- Un único archivo HTML contiene **estructura, estilos y toda la lógica JavaScript**.
- No hay framework frontend (React, Vue, etc.): se usa JavaScript vanilla con renderizado dinámico de tablas HTML.
- Los datos viven en un objeto en memoria (`_mem`) con una capa de abstracción (`DB`) que dispara guardado automático con **debounce de 400 ms** tras cada cambio.
- La navegación entre secciones alterna visibilidad de `<div class="page">` mediante la función `showPage()`.

### 3.3. Inicialización

**Modo servidor (`public/index.html`):**

1. Al cargar la página, se muestra un overlay de inicio pidiendo la **clave de acceso**.
2. Si existe clave en `sessionStorage`, intenta reconectar automáticamente.
3. Tras autenticación exitosa, carga datos desde `GET /api/data`.
4. Ejecuta `preload()` para insertar documentos MEC y eventos de calendario si las colecciones están vacías.
5. Renderiza el dashboard.

**Modo standalone (`SistemaInclusivo_Cerritos.html`):**

1. Overlay ofrece **abrir archivo existente** o **crear archivo nuevo**.
2. Usa `showOpenFilePicker` / `showSaveFilePicker` (File System Access API).
3. Guarda el *file handle* en IndexedDB (`CerritosIDB`) para reconexión en sesiones futuras.
4. Misma lógica de `preload()` y dashboard.

---

## 4. Modelo de datos

Todos los registros (excepto los metadatos de exportación) incluyen un campo **`id`** generado automáticamente:

```
id = Date.now() + '_' + Math.random().toString(36).slice(2, 7)
```

El almacenamiento se organiza en **5 colecciones** (arrays JSON):

### 4.1. `alumnos` — Registro de alumnos inclusivos

| Campo | Tipo | Descripción | Validación / valores |
|-------|------|-------------|----------------------|
| `id` | string | Identificador único | Auto-generado |
| `apellidoNombre` | string | Nombre completo | **Requerido** |
| `ci` | string | Cédula de identidad | Usado para autocompletar seguimiento |
| `fechaNacim` | string (ISO date) | Fecha de nacimiento | Formato `YYYY-MM-DD` |
| `curso` | string | Curso o grado | Ej: "1° Año", "3° Grado" |
| `turno` | string | Turno escolar | Mañana, Tarde, Tiempo Completo |
| `necesidad` | string | Diagnóstico o necesidad | Texto libre |
| `tipoAdecuacion` | string | Tipo de adecuación MEC | Adecuación de Acceso, Adecuación Curricular No Significativa, Adecuación Curricular Significativa |
| `gradoApoyo` | string | Intensidad del apoyo | Leve, Moderado, Intenso |
| `fechaIngreso` | string (ISO date) | Fecha de ingreso al programa | — |
| `docente` | string | Docente responsable | — |
| `telFamilia` | string | Teléfono de contacto familiar | — |
| `responsableMEC` | string | Responsable ante el MEC | Default: "Lic. Rodrigo Godoy" |
| `estado` | string | Estado del alumno | Activo, Egresado, Trasladado, Retirado |
| `observaciones` | string | Notas adicionales | — |

### 4.2. `familias` — Compromisos con familias

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `id` | string | Identificador único | Auto-generado |
| `alumno` | string | Nombre del alumno | **Requerido**; datalist desde alumnos registrados |
| `fechaReunion` | string (ISO date) | Fecha de la reunión | Default: hoy |
| `participantes` | string | Quiénes asistieron | — |
| `acuerdo` | string | Compromiso formal | **Requerido** |
| `estado` | string | Estado del compromiso | Pendiente, Cumplido, Reprogramado, Incumplido |
| `fechaLimite` | string (ISO date) | Plazo del compromiso | Dispara alertas |
| `proximaReunion` | string (ISO date) | Próxima reunión programada | — |
| `seguimiento` | string | Notas de seguimiento | — |
| `responsable` | string | Responsable institucional | — |
| `firma` | string | Constancia de firma | — |

### 4.3. `documentos` — Trámites y documentos MEC

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `id` | string | Identificador único | Auto-generado |
| `documento` | string | Nombre del trámite | **Requerido** |
| `alumnos` | string | Alumnos afectados | Ej: "Todos los alumnos inclusivos" |
| `baseLegal` | string | Fundamentación normativa | — |
| `estado` | string | Estado del trámite | Pendiente, En preparación, Presentado, Aprobado, Observado |
| `fechaLimite` | string (ISO date) | Plazo de entrega | Dispara alertas |
| `responsable` | string | Responsable | — |
| `dondePresentar` | string | Destino del documento | Ej: Supervisión Educativa |
| `observaciones` | string | Notas | — |

**Documentos precargados al iniciar** (12 ítems): planilla de matrícula inclusiva, PEI, informes semestrales de adecuaciones, evaluación psicopedagógica, nómina por nivel, constancia de diagnóstico, PAR, acta de compromiso familiar, informe final anual, solicitud de recursos de apoyo, certificado SENADIS.

### 4.4. `seguimiento` — Seguimiento académico individual

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `id` | string | Identificador único | Auto-generado |
| `ci` | string | CI del alumno | **Requerido**; busca en `alumnos` |
| `alumno` | string | Nombre | Auto-completado desde CI |
| `materia` | string | Materia o área | — |
| `trimestre` | string | Período evaluado | 1er/2do/3er Trimestre, Semestral, Anual |
| `tipoAdecuacion` | string | Tipo de adecuación | Auto-completado desde registro de alumno |
| `objetivo` | string | Objetivo planteado | — |
| `estrategia` | string | Estrategia utilizada | — |
| `resultado` | string | Resultado observado | — |
| `pctLogro` | number (0–100) | Porcentaje de logro | Barra de progreso con colores |
| `proximoPaso` | string | Próximo paso planificado | — |
| `fechaRegistro` | string (ISO date) | Fecha del registro | Default: hoy |
| `docente` | string | Docente que registra | — |

**Integración con alumnos:** al ingresar la CI en el modal de seguimiento, la función `autoFillAlumno()` busca el alumno en la colección `alumnos` y completa automáticamente nombre y tipo de adecuación.

### 4.5. `calendario` — Eventos del año lectivo 2026

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `id` | string | Identificador único | Auto-generado |
| `mes` | string | Mes del evento | Enero–Diciembre |
| `accion` | string | Descripción del evento | **Requerido** |
| `fecha` | string (ISO date) | Fecha del evento | Dispara alertas |
| `normativa` | string | Base legal | — |
| `destinatario` | string | Responsable / destinatario | — |
| `estado` | string | Estado | Pendiente, En proceso, Completado, Reprogramado |

**Versión servidor:** 18 eventos básicos de normativa inclusiva.  
**Versión standalone:** calendario ampliado (~30+ eventos) que integra Res. MEC 2065/2025, feriados y fechas del calendario institucional de Cerritos.

### 4.6. Formato de exportación JSON

```json
{
  "alumnos": [ /* ... */ ],
  "familias": [ /* ... */ ],
  "documentos": [ /* ... */ ],
  "seguimiento": [ /* ... */ ],
  "calendario": [ /* ... */ ],
  "exportado": "2026-06-25T12:00:00.000Z",
  "version": "1.0"
}
```

En modo standalone, el archivo guardado incluye además `_guardado` y `_version`.

---

## 5. Módulos funcionales

### 5.1. Panel de Alertas (Dashboard)

Es la pantalla principal. Calcula en tiempo real:

| Indicador | Lógica de cálculo |
|-----------|-------------------|
| Alumnos activos | `alumnos` con `estado === 'Activo'` o sin estado |
| Compromisos pendientes | `familias` con `estado === 'Pendiente'` |
| Documentos MEC pendientes | `documentos` con estado `Pendiente` o `En preparación` |
| Alertas (≤ 30 días) | Items de familias, documentos y calendario con `fechaLimite`/`fecha` dentro de 30 días o vencidos |

Las tarjetas de estadísticas son **clicables** y navegan a la sección correspondiente aplicando filtros automáticos (`irAFiltro()`).

La tabla de alertas consolida vencimientos de **familias**, **documentos MEC** y **calendario**, ordenados por días restantes (más urgentes primero).

### 5.2. Alumnos Inclusivos

- CRUD completo mediante modales Bootstrap.
- Filtros: búsqueda por nombre, turno, estado.
- Impresión via `window.print()` (oculta sidebar y botones con CSS `@media print`).

### 5.3. Compromisos con Familias

- CRUD con vinculación al listado de alumnos (datalist).
- Ordenamiento automático por proximidad de `fechaLimite`.
- Colores de fila según urgencia.

### 5.4. Documentos MEC

- CRUD sobre documentos precargados o nuevos.
- Filtros por texto y estado.
- Referencia normativa visible en caja informativa.

### 5.5. Seguimiento Académico

- Registro por CI con autocompletado de alumno y adecuación.
- Filtros por alumno, trimestre y materia (lista dinámica).
- Visualización de `% Logro` con barra de progreso coloreada:
  - Verde: ≥ 70%
  - Amarillo: 50–69%
  - Rojo: < 50%

### 5.6. Calendario 2026

- CRUD de eventos anuales.
- Filtros por mes y estado.
- Ordenamiento cronológico por fecha.

### 5.7. Exportar / Importar

- **Exportar:** descarga JSON con todas las colecciones.
- **Importar:** reemplaza **todos** los datos actuales (requiere confirmación doble en modo servidor).

---

## 6. Lógica de alertas y fechas

### 6.1. Cálculo de días restantes

```javascript
function daysLeft(fechaISO) {
  // Diferencia en días entre fecha límite y hoy (medianoche local)
  return Math.round((fechaLimite - hoy) / 86400000);
}
```

Retorna `null` si no hay fecha.

### 6.2. Umbrales de alerta

| Condición | Etiqueta | Color de fila | Clase CSS |
|-----------|----------|---------------|-----------|
| `days < 0` | 🔴 VENCIDO | Rojo claro `#FCE4D6` | `row-vencido` / `bd-vencido` |
| `0 ≤ days ≤ 15` | ⚠️ URGENTE / PRÓXIMO | Naranja `#FCE9D9` | `row-urgente` / `bd-urgente` |
| `16 ≤ days ≤ 30` | 🟡 PRÓXIMO / ATENCIÓN | Amarillo `#FFF2CC` | `row-proximo` / `bd-proximo` |
| `days > 30` | 🟢 OK | Verde `#E2EFDA` | `bd-ok` |
| Sin fecha | Sin fecha | Gris | `bd-nf` |

Esta misma lógica se replica en las planillas Excel mediante **formato condicional** (`CellIsRule`) en las columnas de días restantes.

---

## 7. Aplicación web (frontend)

### 7.1. Tecnologías

- **HTML5** semántico, idioma `es`.
- **Bootstrap 5.3.2** (CSS + JS bundle) desde CDN.
- **Bootstrap Icons 1.11.3** desde CDN.
- **JavaScript ES6+** sin transpilación.

### 7.2. Paleta de colores institucional

| Variable / uso | Hex | Descripción |
|----------------|-----|-------------|
| `--azul-osc` | `#1F3864` | Sidebar, títulos, encabezados |
| `--azul-med` | `#2E75B6` | Botones, encabezados de tabla |
| `--azul-clar` | `#DEEAF1` | Fondos suaves |
| Verde logro | `#375623` | Indicadores positivos |
| Rojo alerta | `#C00000` | Vencidos, bajo rendimiento |
| Naranja urgente | `#C55A11` | Plazos ≤ 15 días |

### 7.3. API interna `DB`

Objeto que abstrae el acceso a `_mem`:

| Método | Descripción |
|--------|-------------|
| `DB.get(colección)` | Retorna array de la colección |
| `DB.add(colección, item)` | Agrega registro con `id` y dispara `autoSave()` |
| `DB.update(colección, id, item)` | Actualiza por `id` y dispara `autoSave()` |
| `DB.del(colección, id)` | Elimina por `id` y dispara `autoSave()` |
| `DB.byId(colección, id)` | Busca un registro por `id` |

### 7.4. Funciones de renderizado

Cada sección tiene su par `render*()` + `modal*()`:

| Sección | Render | Modal CRUD |
|---------|--------|------------|
| Dashboard | `renderDashboard()` | — |
| Alumnos | `renderAlumnos()` | `modalAlumno(id?)` |
| Familias | `renderFamilias()` | `modalFamilia(id?)` |
| Documentos | `renderDocumentos()` | `modalDocumento(id?)` |
| Seguimiento | `renderSeguimiento()` | `modalSeguimiento(id?)` |
| Calendario | `renderCalendario()` | `modalCalendario(id?)` |

Eliminación universal: `delItem(colección, id, renderFn)`.

### 7.5. Función `preload()`

Se ejecuta tras la carga inicial. Si las colecciones `documentos` y `calendario` están vacías, inserta los datos semilla (documentos MEC y eventos del calendario 2026). Esto garantiza que un despliegue nuevo tenga contenido útil desde el primer uso.

---

## 8. Servidor backend

**Archivo:** `servidor_inclusivo/server.js`

### 8.1. Stack

- **Express 4** — servidor HTTP y API REST.
- **better-sqlite3** — base de datos SQLite síncrona embebida.
- Archivos estáticos servidos desde `public/`.

### 8.2. Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto del servidor |
| `APP_PASSWORD` | `cerritos2026` | Clave de acceso compartida |
| `DB_PATH` | `./datos.db` | Ruta del archivo SQLite |

### 8.3. Esquema de base de datos

**Tabla `datos`:**

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `clave` | TEXT PK | Nombre de la colección (`alumnos`, `familias`, etc.) |
| `valor` | TEXT | JSON serializado del array |
| `actualizado` | TEXT | ISO timestamp de última modificación |

**Tabla `historial`:**

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK AUTO | — |
| `clave` | TEXT | Colección afectada |
| `operacion` | TEXT | Tipo de operación |
| `detalle` | TEXT | Detalle opcional |
| `usuario` | TEXT | Usuario opcional |
| `fecha` | TEXT | Timestamp |

> **Nota:** La tabla `historial` registra sincronizaciones y operaciones CRUD desde v2.0, identificando al usuario via header `x-app-user`.

### 8.4. Endpoints API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/data` | Sí | Devuelve todas las colecciones como JSON |
| `POST` | `/api/data` | Sí | Guarda todas las colecciones (reemplazo parcial por sección) |
| `GET` | `/api/status` | No | Health check: versión, conteos y última actualización |
| `GET` | `/api/stats` | Sí | Estadísticas agregadas para gráficos del dashboard |
| `GET` | `/api/buscar?q=texto` | Sí | Búsqueda global en todas las colecciones (mín. 2 caracteres) |
| `GET` | `/api/alumnos/:id/expediente` | Sí | Expediente integrado de un alumno |
| `GET` | `/api/historial?limit=50&offset=0` | Sí | Registro de auditoría de cambios |
| `POST` | `/api/historial` | Sí | Registrar evento manual `{ clave, operacion, detalle }` |
| `GET` | `/api/backup` | Sí | Descarga JSON completo como archivo adjunto |
| `GET` | `/` | No | Sirve `public/index.html` |

**Autenticación:** headers HTTP:
- `x-app-password` — debe coincidir con `APP_PASSWORD`
- `x-app-user` — nombre del usuario (opcional, para auditoría)

**Ejemplo de lectura:**

```http
GET /api/data
x-app-password: tu_clave_secreta
```

**Ejemplo de guardado:**

```http
POST /api/data
Content-Type: application/json
x-app-password: tu_clave_secreta

{
  "alumnos": [ ... ],
  "familias": [ ... ],
  "documentos": [ ... ],
  "seguimiento": [ ... ],
  "calendario": [ ... ]
}
```

### 8.5. Inicialización de datos

Al arrancar, si no existen registros para las 5 secciones, inserta arrays vacíos `[]`. El contenido semilla lo aporta el frontend via `preload()`.

---

## 9. Versión standalone (HTML local)

**Archivo:** `SistemaInclusivo_Cerritos.html`

### 9.1. Diferencias respecto a la versión servidor

| Aspecto | Servidor | Standalone |
|---------|----------|------------|
| Autenticación | Clave de acceso (`APP_PASSWORD`) | Selección de archivo JSON |
| Persistencia | SQLite via API REST | File System Access API |
| Reconexión | `sessionStorage.app_pw` | IndexedDB (`CerritosIDB`) guarda file handle |
| Estado en sidebar | "Guardado en servidor ✓" | Nombre del archivo JSON |
| Calendario precargado | 18 eventos | ~30+ eventos (MEC 2065 + institucional) |
| Navegadores | Cualquier navegador moderno | **Chrome o Edge** (requiere File System Access API) |

### 9.2. Flujo de archivo local

```
Usuario abre HTML
       │
       ▼
¿Hay handle en IndexedDB? ──Sí──► Solicitar permiso ──► Leer JSON
       │ No
       ▼
Overlay: "Abrir existente" / "Crear nuevo"
       │
       ▼
showOpenFilePicker / showSaveFilePicker
       │
       ▼
Guardar handle en IndexedDB
       │
       ▼
Cada cambio → debounce 400ms → writeFile() al JSON local
```

### 9.3. Funciones clave standalone

| Función | Propósito |
|---------|-----------|
| `conectarArchivo(crear)` | Abre o crea archivo JSON |
| `tryReconnect()` | Reconecta handle desde IndexedDB |
| `writeFile()` | Escribe `_mem` al archivo |
| `readFile(handle)` | Lee JSON al objeto `_mem` |
| `cambiarArchivo()` | Permite seleccionar otro archivo |

---

## 10. Generadores de planilla Excel

Dos scripts Python generan planillas `.xlsx` con **openpyxl**, replicando la estructura del sistema web en formato hoja de cálculo.

### 10.1. Comparación de scripts

| Característica | `crear_planilla_inclusiva.py` | `crear_planilla_inclusiva_250.py` |
|----------------|-------------------------------|-----------------------------------|
| Filas Alumnos | 50 (filas 4–53) | 250 (filas 4–253) |
| Filas Familias | 100 | 750 |
| Filas Seguimiento | 100 | 750 |
| Filas Documentos MEC | 51 (+ 12 precargados) | 80 (+ 12 precargados) |
| Estilo | Detallado, más comentarios | Compacto, funciones helper |
| Salida | Ruta fija en `/sessions/.../outputs/` | Idem |

> **Nota:** Las rutas de salida apuntan a un entorno de generación anterior. Para uso local, modificar la variable `out_path` / `out` al final de cada script.

### 10.2. Hojas generadas

| # | Nombre hoja | Contenido |
|---|-------------|-----------|
| 1 | 📋 INICIO | Dashboard con fórmulas `COUNTA`/`COUNTIF` y panel de alertas |
| 2 | 📚 Alumnos | Registro de alumnos con listas desplegables |
| 3 | 🤝 Familias | Compromisos; columna "Días Restantes" con fórmula `=G{r}-TODAY()` |
| 4 | 📄 Documentos MEC | 12 documentos precargados + filas vacías |
| 5 | 📊 Seguimiento | Progreso académico con formato condicional en `% Logro` |
| 6 | 📅 Calendario 2026 | 18 fechas clave precargadas |
| 7 | ℹ️ Instrucciones | Guía de uso, código de colores y normativa |

### 10.3. Fórmulas automáticas en Excel

- **Días restantes:** `=IF(F{r}="","",F{r}-TODAY())`
- **Estado de alerta:** `=IF(... IF(G{r}<0,"🔴 VENCIDO", IF(G{r}<=15,"⚠️ URGENTE", ...)))`
- **Contadores del dashboard:** referencias cruzadas entre hojas (`COUNTA`, `COUNTIF`)

### 10.4. Formato condicional

Aplicado en columnas de días restantes y `% Logro`:

| Regla | Color |
|-------|-------|
| `< 0` | Rojo |
| `0–15` | Naranja |
| `16–30` | Amarillo |
| `> 30` | Verde |

### 10.5. Ejecución

```bash
pip install openpyxl
python crear_planilla_inclusiva_250.py
```

---

## 11. Calendario MEC de referencia

**Archivo:** `Calendario_MEC_2026.md`

Documento de referencia basado en la **Resolución MEC N° 2065/2025** (calendario escolar nacional 2026). No es consumido directamente por el código; sirve como fuente para cargar fechas en el calendario del sistema.

### Contenido principal

- **Anexo I:** 26 actividades del cronograma escolar (inicio de clases 23/02/2026, valoraciones, recesos, cierre 30/11/2026).
- **Anexo II:** Feriados nacionales y asuetos.
- **Anexo III–IV:** Días laborales del educador (200) y días de clases (183).
- **Anexo V:** Cronograma de jornada sindical por departamento.
- **Notas de Educación Inclusiva:**
  - Matrícula inclusiva **durante todo el año sin condicionamiento**.
  - Pre-clases con énfasis en Educación Inclusiva (Ítem 4).
  - Clausura Ofertas No Formales de Educación Inclusiva: **16–27 de noviembre**.

---

## 12. Normativa paraguaya de referencia

El sistema referencia las siguientes normas en dashboard, documentos y calendario:

| Norma | Descripción |
|-------|-------------|
| **Ley N° 5136/2013** | Ley de Educación Inclusiva — marco general |
| **Res. MEC N° 29.664/2012** | Integración escolar de personas con discapacidad |
| **Decreto N° 1.350/2019** | Reglamentación de la Ley 5136/2013 |
| **Res. MEC N° 29.451/2010** | Procedimientos para adecuaciones curriculares |
| **Ley N° 4962/2013** | Carta Orgánica del SENADIS (certificado de discapacidad) |
| **Res. MEC N° 2065/2025** | Calendario escolar nacional 2026 |

### Tipos de adecuación curricular (según normativa)

1. **Adecuación de Acceso** — modificaciones del entorno, materiales o comunicación.
2. **Adecuación Curricular No Significativa** — ajustes en metodología, evaluación o temporalización sin alterar contenidos esenciales.
3. **Adecuación Curricular Significativa** — modificaciones sustanciales de contenidos, objetivos y criterios de evaluación (requiere PAR).

---

## 13. Despliegue e instalación

### 13.1. Opción A — Servidor en la nube (Railway) — Recomendado

Ver guía detallada en `servidor_inclusivo/INSTRUCCIONES.md`.

Resumen:

1. Subir `servidor_inclusivo/` a un repositorio GitHub (privado).
2. Conectar el repo a [Railway](https://railway.app).
3. Crear **Volume** con mount path `/app/data`.
4. Configurar variables:
   - `DB_PATH=/app/data/datos.db`
   - `APP_PASSWORD=<clave_segura>`
5. Generar dominio público en Settings → Networking.
6. Compartir URL + clave con el equipo docente.

**Costo estimado:** ~USD 0.50–1/mes (dentro del crédito gratuito de Railway).

### 13.2. Opción B — Servidor local

```bash
cd servidor_inclusivo
npm install
node server.js
```

Abrir `http://localhost:3000`. Clave predeterminada: `cerritos2026`.

### 13.3. Opción C — HTML standalone

1. Abrir `SistemaInclusivo_Cerritos.html` en **Chrome** o **Edge**.
2. Elegir "Crear archivo nuevo" o "Abrir existente".
3. Guardar el JSON en una ubicación accesible (ej: carpeta compartida del colegio).

### 13.4. Opción D — Planilla Excel

```bash
pip install openpyxl
python crear_planilla_inclusiva_250.py
```

Abrir el `.xlsx` generado en Microsoft Excel o LibreOffice Calc.

---

## 14. Respaldo, importación y exportación

### 14.1. Desde la aplicación web

| Acción | Método |
|--------|--------|
| Exportar | Botón "Exportar datos" en sidebar → descarga JSON |
| Importar | Botón "Importar datos" → seleccionar JSON → reemplaza todo |
| Backup API | `GET /api/backup` con header `x-app-password` |

### 14.2. Recomendaciones de respaldo

- Realizar exportación JSON **semanal** durante períodos activos.
- Antes de importar, exportar el estado actual como respaldo.
- En Railway, el volumen persiste entre redeploys, pero un backup externo es recomendable.

### 14.3. Compatibilidad de formatos

El JSON exportado desde cualquier modo (servidor, standalone o backup API) es **intercambiable** entre modos, siempre que contenga las 5 colecciones.

---

## 15. Seguridad y limitaciones

### 15.1. Seguridad

| Aspecto | Implementación |
|---------|----------------|
| Autenticación servidor | Clave compartida simple via header HTTP |
| Almacenamiento de clave | `sessionStorage` (se pierde al cerrar pestaña) |
| HTTPS | Proporcionado por Railway en producción |
| Datos sensibles | CI, teléfonos y diagnósticos de menores — tratar el JSON/DB como confidencial |

> **Importante:** Cambiar la clave predeterminada `cerritos2026` antes de desplegar en producción.

### 15.2. Limitaciones conocidas

| Limitación | Detalle |
|------------|---------|
| Concurrencia | Último en guardar gana; no hay bloqueo optimista |
| Autenticación básica | Una sola clave compartida; no hay usuarios individuales |
| Historial | Tabla `historial` en SQLite no implementada en API |
| Standalone | Requiere Chrome/Edge; no funciona en Firefox/Safari para persistencia |
| Sin offline en servidor | Requiere conexión a internet para modo Railway |
| Sin adjuntos | No almacena archivos PDF/imágenes de documentos |

---

## 16. Flujos de trabajo típicos

### 16.1. Inicio de año escolar

1. Registrar alumnos inclusivos en **Alumnos** (o importar JSON del año anterior y actualizar).
2. Verificar documentos MEC precargados en **Documentos** (matrícula, nómina, PEI).
3. Revisar **Calendario 2026** y marcar eventos completados.
4. Monitorear **Panel de Alertas** semanalmente.

### 16.2. Reunión con familia

1. Ir a **Compromisos Familias** → "Agregar Compromiso".
2. Seleccionar alumno, registrar acuerdo y fecha límite.
3. El dashboard mostrará alertas automáticas según proximidad del plazo.

### 16.3. Seguimiento trimestral

1. Ir a **Seguimiento Académico** → "Agregar Registro".
2. Ingresar CI del alumno (autocompleta nombre y adecuación).
3. Completar objetivo, estrategia, resultado y % de logro.
4. Filtrar por trimestre para revisión colectiva.

### 16.4. Entrega de documentación al MEC

1. Ir a **Documentos MEC**.
2. Filtrar por estado "Pendiente" o "En preparación".
3. Actualizar estado a "Presentado" al entregar.
4. Usar filtros del dashboard para priorizar vencimientos.

### 16.5. Migración Excel → Web

1. Exportar datos manualmente desde Excel (copiar registros).
2. Ingresar en la app web sección por sección, o
3. Construir un JSON con la estructura documentada en [sección 4](#4-modelo-de-datos) e importar.

---

## Apéndice A — Mapa de funciones JavaScript

| Función | Archivo | Descripción |
|---------|---------|-------------|
| `initApp()` | index.html (servidor) | Inicialización con clave |
| `arrancarConClave(clave)` | index.html | Autenticación y carga |
| `autoSave()` | Ambos | Debounce + persistencia |
| `cargarDesdeServidor(pw)` | index.html | GET /api/data |
| `conectarArchivo(crear)` | standalone | File picker |
| `preload()` | Ambos | Datos semilla |
| `showPage(name)` | Ambos | Navegación SPA |
| `renderDashboard()` | Ambos | Panel de alertas |
| `daysLeft(fecha)` | Ambos | Cálculo de días |
| `alertBadge(days)` | Ambos | HTML de badge de alerta |
| `exportarDatos()` | Ambos | Descarga JSON |
| `importarDatos()` | Ambos | Carga JSON |
| `delItem(col, id, fn)` | Ambos | Eliminación con confirmación |
| `autoFillAlumno()` | Ambos | Autocompletado por CI |

---

## Apéndice B — Glosario

| Término | Significado |
|---------|-------------|
| **MEC** | Ministerio de Educación y Ciencias (Paraguay) |
| **PEI** | Plan Educativo Individual |
| **PAR** | Plan de Apoyos y Recursos |
| **SENADIS** | Secretaría Nacional por los Derechos Humanos de las Personas con Discapacidad |
| **DGEEI** | Dirección General de Educación Especial e Inclusiva |
| **RUE** | Registro Único del Estudiante |
| **SAEC** | Servicio de Atención Educativa Compensatoria |
| **Adecuación curricular** | Modificación del currículo para garantizar acceso equitativo al aprendizaje |

---

*Documentación generada para el Lic. Rodrigo Godoy — Colegio Presbiteriano Cerritos, Paraguay — 2026.*
