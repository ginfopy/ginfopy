# Instrucciones de Despliegue — Sistema de Educación Inclusiva
## Colegio Presbiteriano Cerritos

---

## ¿Qué hay en esta carpeta?

```
servidor_inclusivo/
├── server.js          ← El servidor (Node.js + Express)
├── package.json       ← Lista de dependencias
├── .gitignore         ← Archivos a ignorar en Git
├── INSTRUCCIONES.md   ← Este archivo
└── public/
    └── index.html     ← La aplicación web
```

Los datos se guardan en una base de datos SQLite (`datos.db`) que se crea
automáticamente cuando el servidor inicia por primera vez.

---

## OPCIÓN A — Despliegue en Railway (recomendado, gratis)

### Requisitos previos
- Cuenta en GitHub: https://github.com (gratis)
- Cuenta en Railway: https://railway.app (gratis, $5 de crédito mensual)

### Paso 1 — Subir el código a GitHub

1. Entrá a https://github.com y creá un repositorio nuevo llamado `sistema-inclusivo`
2. Descargá e instalá **GitHub Desktop**: https://desktop.github.com
3. En GitHub Desktop: File → Add Local Repository → seleccioná esta carpeta
4. Si dice "not a Git repository", hacé clic en "create a repository"
5. Commit summary: "versión inicial" → clic en "Commit to main"
6. Clic en "Publish repository" → asegurate que sea **Private** → clic en "Publish"

### Paso 2 — Crear el proyecto en Railway

1. Entrá a https://railway.app y hacé clic en "Start a New Project"
2. Elegí "Deploy from GitHub repo"
3. Autorizá Railway para acceder a tu GitHub
4. Seleccioná el repositorio `sistema-inclusivo`
5. Railway lo detecta automáticamente como Node.js y empieza a desplegarlo

### Paso 3 — Agregar volumen para la base de datos

Railway borra los archivos temporales en cada redeploy. Para que la base de datos persista:

1. En tu proyecto de Railway, andá a la pestaña **Volumes**
2. Clic en "New Volume"
3. Mount Path: `/app/data`
4. Clic en "Create"
5. En la pestaña **Variables**, agregá:
   ```
   DB_PATH = /app/data/datos.db
   ```

### Paso 4 — Configurar la clave de acceso

En la pestaña **Variables** de Railway, agregá:
```
APP_PASSWORD = (la clave que elijas, por ejemplo: Cerritos2026!)
```

⚠️ **Cambiá la clave predeterminada** (`cerritos2026`) por una clave propia.

### Paso 5 — Obtener la URL pública

1. En Railway, andá a la pestaña **Settings**
2. En "Networking", clic en "Generate Domain"
3. Tu app estará disponible en algo como: `https://sistema-inclusivo-production.up.railway.app`

### Paso 6 — Compartir con tu equipo

Enviá a cada docente:
- **URL**: la dirección que generó Railway
- **Clave de acceso**: la que configuraste en APP_PASSWORD

---

## OPCIÓN B — Prueba local (sin internet, solo para testear)

Si tenés Node.js instalado (https://nodejs.org):

```bash
# En la carpeta servidor_inclusivo/:
npm install
node server.js
```

Luego abrís el navegador en: http://localhost:3000

---

## Gestión de datos

### Respaldo manual
Abrí en el navegador: `https://tu-url.railway.app/api/backup?x-app-password=TU_CLAVE`

O desde el botón "Exportar datos" dentro de la app.

### Restaurar datos
Usá el botón "Importar datos" dentro de la app para cargar un backup .json anterior.

---

## Preguntas frecuentes

**¿Funciona con cualquier navegador?**
Sí. Al estar en un servidor ya no hace falta Chrome/Edge específicamente. Funciona en Chrome, Edge, Firefox, y desde celulares Android.

**¿Varios usuarios pueden editar al mismo tiempo?**
Pueden conectarse y ver datos al mismo tiempo. Si dos personas editan exactamente el mismo registro a la vez, gana el último en guardar. Para un equipo escolar esto raramente es un problema.

**¿Qué pasa si Railway cae?**
Railway tiene 99.9% de uptime. Si hubiera un problema, los datos están seguros en el volumen. Podés hacer backup periódico desde la app.

**¿Cuánto cuesta?**
Railway da $5 de crédito mensual gratis. Un servidor pequeño como este consume aprox. $0.50-$1 por mes, por lo que entra dentro del crédito gratuito sin costo adicional.

---

## Cambiar la clave de acceso

1. En Railway, pestaña **Variables**
2. Modificar el valor de `APP_PASSWORD`
3. Railway reinicia el servidor automáticamente
4. Avisá a tu equipo la nueva clave

---

*Sistema generado para el Lic. Rodrigo Godoy — Colegio Presbiteriano Cerritos, Paraguay*
