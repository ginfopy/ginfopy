# PLANES DE CLASE — TERCER CICLO
## Área de Tecnología e Informática
### 8.° Grado — Año Lectivo 2026 (Completo: 4 Bimestres)

**COLEGIO PRESBITERIANO CERRITOS** | Lambaré, Paraguay
**Dirección Académica:** Lic. Rodrigo Godoy
**Coordinación Tercer Ciclo:** Prof. Perla Forcado
**Grado:** 8.° Grado de Educación Escolar Básica
**Carga horaria:** 3 horas semanales (1 h Computación + 2 h Programación)
**Total anual:** 114 horas (38 semanas × 3 h)
**Sala:** Sala de Informática — Secundaria (25 PCs, Windows 10/11, 8 GB RAM, VS Code + Chrome)
**Herramientas principales:** Python 3 (Thonny/VS Code) · Machine Learning for Kids · IA generativa (supervisada)
**Política de IA:** NIVEL 1 — Uso supervisado permitido con Declaración de Uso Ético obligatoria (Reglamento Institucional).
**Documento derivado del:** Plan Anual Tercer Ciclo v1.0 y Normativo Tercer Ciclo v1.0

---

# ESTRUCTURA SEMANAL TIPO

Cada semana de clase se organiza en dos disciplinas complementarias:

| Disciplina | Horas semanales | Enfoque |
|---|---|---|
| **Computación** | 1 h | Contexto: redes, ciberseguridad, nube, ética digital. |
| **Programación** | 2 h | Práctica: Python estructurado, Machine Learning, uso crítico de IA. |

---

# PRIMER BIMESTRE (9 semanas — 9 de febrero a 10 de abril de 2026)
**Objetivo general del bimestre:** Consolidar los fundamentos de redes (cómo llega internet al aula), seguridad básica de contraseñas, y dominar en Python las estructuras de control condicionales (if/elif/else) y operadores lógicos.

---

## CLASE 1 — Diagnóstico y redes básicas

**Fecha:** Semana del 9 de febrero de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Evaluar las competencias de 7.° grado y comprender la topología de la red del aula (LAN, router, switch, WiFi).
- **Programación:** Repasar la sintaxis básica de Python (variables, tipos de datos, print, input) mediante un proyecto de bienvenida.

### Secuencia didáctica

**Computación (1 h)**
- **Inicio (10 min):** Bienvenida al 8.° grado. El docente explica: "Este año dejan de ser principiantes. Ahora van a entender cómo funciona internet por dentro y van a usar IA como profesionales, pero con ética".
- **Desarrollo (30 min):** **Mapa de red avanzado.** Los estudiantes usan `ipconfig`, `ping` y `tracert` en CMD para mapear la ruta desde su PC hasta google.com. Identifican LAN, puerta de enlace (router) y WAN.
- **Cierre (20 min):** Reflexión: "¿Por qué el ping a veces falla? ¿Qué es la latencia?".

**Programación (2 h)**
- **Inicio (15 min):** Repaso relámpago de Python en Thonny. El docente proyecta un script con errores de sintaxis y los estudiantes lo depuran.
- **Desarrollo (60 min):** **Proyecto "Perfil Digital".** Cada estudiante escribe un script que pida nombre, edad, hobby favorito y red social preferida. El programa debe calcular el año de nacimiento y mostrar un "perfil" formateado con saltos de línea y caracteres especiales.
- **Cierre (15 min):** Guardado del archivo en el portafolio digital de Google Drive.

### Evaluación
- **Comp:** Mapa de red y trazabilidad correctamente interpretados.
- **Prog:** Script "Perfil Digital" ejecutado sin errores de sintaxis.

---

## CLASE 2 — Cómo llega internet al aula y condicionales if/else

**Fecha:** Semana del 16 de febrero de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Comprender la cadena ISP (Proveedor de Servicios) → Router → Switch → PC.
- **Programación:** Dominar la estructura condicional simple `if/else` y los operadores de comparación.

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** El docente dibuja en la pizarra la topología física y lógica de la conexión del colegio. Explica el rol del ISP (ej: Tigo, Claro), el módem, el router y el switch. Los estudiantes identifican los puntos únicos de fallo en la red del aula.

**Programación (2 h)**
- **Desarrollo:** **Validador de acceso.** Cada estudiante programa un script que pida una "contraseña" (hardcodeada en una variable). Si es correcta, muestra "Acceso concedido"; si no, "Acceso denegado". Luego, agregan un contador de intentos: si fallan 3 veces, el programa se bloquea.
- **Cierre:** Reflexión sobre cómo los servidores reales usan condicionales millones de veces por segundo para autorizar accesos.

---

## CLASE 3 — Contraseñas seguras y condicionales anidados

**Fecha:** Semana del 23 de febrero de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Analizar qué hace que una contraseña sea fuerte (longitud, complejidad, entropía).
- **Programación:** Usar condicionales anidados (`elif`) y operadores lógicos (`and`, `or`, `not`).

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** **Laboratorio de contraseñas.** Los estudiantes usan un verificador seguro (ej: kaspersky.com/password-check) para probar contraseñas ficticias. Analizan por qué "123456" se rompe en milisegundos y "P@ssw0rd!" también. Aprenden el concepto de "frase de contraseña" (passphrase).

**Programación (2 h)**
- **Desarrollo:** **Auditor de contraseñas.** Programa en Python que reciba una contraseña y evalúe su fortaleza usando `elif`:
  - Si longitud < 8: "Muy débil".
  - Si longitud >= 8 y no tiene números: "Débil".
  - Si longitud >= 8 y tiene números y mayúsculas: "Fuerte".
  - Usa `and`, `or` y métodos de string (`.isdigit()`, `.isupper()`).

---

## CLASE 4 — Identidad digital y operadores lógicos

**Fecha:** Semana del 2 de marzo de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Comprender la identidad digital y la huella que dejamos en los servicios en línea.
- **Programación:** Consolidar el uso de operadores lógicos en condicionales complejas.

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** Los estudiantes analizan los "Términos y Condiciones" de una red social popular (resumen de 1 página). Identifican qué datos recopila la empresa y a quién se los cede.

**Programación (2 h)**
- **Desarrollo:** **Filtro de contenido.** Programa que pida la edad del usuario y el género de película que quiere ver. Usando `and`/`or`, el programa decide si puede ver esa película según una clasificación etaria ficticia. Ej: `if edad >= 13 and (genero == "terror" or genero == "accion"):`.

---

## CLASE 5 — Evaluación bimestral 1

**Fecha:** Semana del 9 de marzo de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Secuencia didáctica
- **Computación (1 h):** Prueba práctica: configurar una IP estática en la PC (simulado), identificar componentes de red en imágenes y resolver un caso de "la red no funciona" (diagnóstico lógico).
- **Programación (2 h):** Desafío cronometrado: escribir un script en Python que use variables, input, if/elif/else y operadores lógicos para resolver un problema (ej: calculadora de IMC con categorías).

---

# SEGUNDO BIMESTRE (9 semanas — 13 de abril a 19 de junio de 2026)
**Objetivo general del bimestre:** Dominar los servicios en la nube (IaaS, PaaS, SaaS), el trabajo colaborativo, y profundizar en Python con bucles (while, for), listas y manejo de errores.

---

## CLASE 6 — Nube y servicios en línea (IaaS, PaaS, SaaS)

**Fecha:** Semana del 13 de abril de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Diferenciar los modelos de servicio en la nube.
- **Programación:** Introducir el bucle `while` y el concepto de bucle infinito controlado.

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** El docente explica IaaS (AWS, servidores), PaaS (Google App Engine), SaaS (Gmail, Drive, Netflix). Los estudiantes clasifican 10 servicios que usan diariamente en estas categorías.

**Programación (2 h)**
- **Desarrollo:** **Menú interactivo.** Programa con `while True` que muestre un menú de opciones (1. Saludar, 2. Despedir, 3. Salir). El bucle se repite hasta que el usuario elija "3". Se introduce el comando `break`.

---

## CLASE 7 — Google Drive, OneDrive y bucle for

**Fecha:** Semana del 20 de abril de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Trabajo colaborativo en la nube (permisos de edición, historial de versiones).
- **Programación:** Dominar el bucle `for` con `range()` y iteración sobre cadenas de texto.

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** Los estudiantes crean un documento compartido en Google Docs. Cada uno edita una sección simultáneamente. Exploran el "Historial de versiones" para recuperar un texto borrado.

**Programación (2 h)**
- **Desarrollo:** **Analizador de texto.** Programa que pida una oración y use `for letra in oracion:` para contar cuántas vocales tiene, cuántas consonantes y cuántos espacios.

---

## CLASE 8 — Listas en Python

**Fecha:** Semana del 27 de abril de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Evaluación rápida de servicios en la nube.
- **Programación:** Crear, indexar, modificar y recorrer listas en Python.

### Secuencia didáctica

**Programación (2 h)**
- **Desarrollo:** **Lista de compras inteligente.** Programa que permita al usuario agregar productos a una lista (`append`), eliminar productos (`remove`), mostrar la lista ordenada (`sort`) y buscar si un producto existe (`in`). Todo dentro de un menú con `while`.

---

## CLASE 9 — Evaluación bimestral 2

**Fecha:** Semana del 4 de mayo de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Secuencia didáctica
- **Computación (1 h):** Cuestionario oral sobre IaaS/PaaS/SaaS y configuración de permisos en la nube.
- **Programación (2 h):** Proyecto "Gestor de Notas": el programa pide las notas de 5 materias (usando `for` y lista), calcula el promedio, y muestra si el estudiante aprobó o no.

---

# TERCER BIMESTRE (9 semanas — 6 de julio a 11 de septiembre de 2026)
**Objetivo general del bimestre:** Ciberseguridad avanzada (phishing, malware), funciones en Python, Machine Learning for Kids, y la introducción crítica y supervisada a la IA generativa con Declaración de Uso Ético.

---

## CLASE 10 — Phishing, malware y funciones en Python

**Fecha:** Semana del 6 de julio de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Identificar correos de phishing y tipos de malware (virus, troyano, ransomware).
- **Programación:** Definir y usar funciones propias en Python (`def`).

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** **Análisis de correos reales.** El docente proyecta 5 correos (algunos legítimos, otros phishing). Los estudiantes deben identificar las "red flags": remitente sospechoso, urgencia artificial, enlaces ocultos.

**Programación (2 h)**
- **Desarrollo:** **Calculadora con funciones.** Los estudiantes reescriben su calculadora del año anterior, pero ahora cada operación es una función (`def sumar(a, b):`). El menú principal llama a estas funciones.

---

## CLASE 11 — Higiene digital y manejo de errores

**Fecha:** Semana del 13 de julio de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Comprender la higiene digital (actualizaciones, backups, antivirus).
- **Programación:** Introducir el manejo de excepciones (`try/except`) para evitar que el programa colapse.

### Secuencia didáctica

**Programación (2 h)**
- **Desarrollo:** **División segura.** Programa que pida dos números y los divida. Si el usuario ingresa texto o divide por cero, el programa usa `try/except ValueError` y `ZeroDivisionError` para mostrar un mensaje amigable en lugar de un "traceback" rojo.

---

## CLASE 12 — Machine Learning for Kids: interfaz y datos

**Fecha:** Semana del 20 de julio de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Introducción al concepto de ML: la máquina aprende de los datos, no de reglas explícitas.
- **Programación:** Usar la plataforma Machine Learning for Kids para recolectar datos y entrenar un modelo de clasificación de texto.

### Secuencia didáctica

**Programación (2 h)**
- **Desarrollo:** Los estudiantes crean un proyecto en ML for Kids: "Asistente de tareas". Entrenan un modelo para clasificar frases en "Tarea de Mate", "Tarea de Historia" o "Juego". Recolectan 10 ejemplos por clase, entrenan el modelo y prueban su precisión.

---

## CLASE 13 — ML for Kids: integración con Python

**Fecha:** Semana del 27 de julio de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Programación:** Conectar el modelo entrenado en ML for Kids con un script de Python para crear una aplicación funcional.

### Secuencia didáctica

**Programación (2 h)**
- **Desarrollo:** Los estudiantes descargan el código Python que genera ML for Kids. Lo ejecutan en Thonny. El programa les pide una frase y les responde a qué categoría pertenece según su modelo. Analizan el código para entender cómo se conecta con la API.

---

## CLASE 14 — Introducción a la IA generativa y Prompting

**Fecha:** Semana del 3 de agosto de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Diferenciar IA de clasificación (ML for Kids) de IA generativa (LLMs como ChatGPT).
- **Programación:** Aprender ingeniería de instrucciones (prompting) básica.

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** El docente explica cómo funciona un LLM (predicción de la siguiente palabra). Muestra ejemplos de "alucinaciones" (cuando la IA inventa datos).

**Programación (2 h)**
- **Desarrollo:** **Taller de Prompting.** Los estudiantes usan una herramienta de IA generativa supervisada por el docente. Deben lograr que la IA escriba un poema sobre Paraguay usando exactamente 3 palabras en guaraní, y luego un script de Python que calcule el área de un círculo. Comparan cómo cambia el resultado según la claridad del prompt.

---

## CLASE 15 — Ética de la IA y Declaración de Uso Ético

**Fecha:** Semana del 10 de agosto de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- **Computación:** Comprender el Reglamento Institucional de Uso Ético de la IA.
- **Programación:** Aprender a auditar el código generado por IA y completar la Declaración de Uso Ético.

### Secuencia didáctica

**Computación (1 h)**
- **Desarrollo:** Lectura guiada del Reglamento. Análisis de casos: "¿Es plagio si la IA me ayuda a escribir el código? ¿Y si la IA lo escribe todo?".

**Programación (2 h)**
- **Desarrollo:** Los estudiantes usan IA para generar un script que ordene una lista de números, pero el código tiene un error a propósito. Deben depurarlo, entenderlo y llenar la Declaración de Uso Ético (herramienta usada, propósito, cómo verificaron el resultado).

---

## CLASE 16 — Evaluación bimestral 3

**Fecha:** Semana del 17 de agosto de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Secuencia didáctica
- **Computación (1 h):** Evaluación de ciberseguridad: identificar phishing, malware y configurar privacidad.
- **Programación (2 h):** Presentación del modelo de ML for Kids y entrega de la Declaración de Uso Ético de un script asistido por IA.

---

# CUARTO BIMESTRE (11 semanas — 14 de septiembre a 13 de noviembre de 2026)
**Objetivo general del bimestre:** Desarrollo del proyecto integrador de cierre (Python + IA opcional), preparación del portafolio técnico del año, y evaluación de salida del 8.° grado.

---

## CLASE 17 — Definición del proyecto integrador

**Fecha:** Semana del 14 de septiembre de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- Definir un proyecto que resuelva un problema real usando Python y, opcionalmente, IA (ML for Kids o generativa con declaración).

### Secuencia didáctica
- **Desarrollo:** Los estudiantes presentan propuestas: (1) Chatbot de orientación escolar (ML for Kids), (2) Generador de contraseñas seguras con IA, (3) Sistema de quiz adaptativo. El docente aprueba las propuestas y los estudiantes forman equipos de 2-3 personas.

---

## CLASES 18-22 — Desarrollo del proyecto integrador

**Fechas:** Semanas del 21 de septiembre al 19 de octubre de 2026
**Duración:** 3 horas cada una

### Secuencia didáctica
- **Programación (2 h):** Trabajo autónomo de los equipos. El docente actúa como "Scrum Master", haciendo reuniones de 5 minutos al inicio de cada clase para verificar avances y desbloquear problemas.
- **Computación (1 h):** Clases magistrales cortas sobre temas avanzados solicitados por los equipos (ej: cómo guardar datos en un archivo .txt, cómo usar la librería `random`, cómo estructurar un proyecto con funciones).

---

## CLASE 23 — Depuración y documentación

**Fecha:** Semana del 26 de octubre de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- Finalizar el código, documentarlo con comentarios y preparar la presentación oral.

### Secuencia didáctica
- **Desarrollo:** Los equipos intercambian sus proyectos con otro equipo para hacer "pruebas de usuario" (QA). Anotan errores y sugerencias. Luego, corrigen y escriben el manual de usuario (1 página).

---

## CLASES 24-25 — Presentación de proyectos

**Fechas:** Semanas del 2 y 9 de noviembre de 2026
**Duración:** 3 horas cada una

### Secuencia didáctica
- Cada equipo tiene 10 minutos para: (1) explicar el problema, (2) mostrar el código y explicar las funciones principales, (3) demostrar el funcionamiento en vivo, (4) responder preguntas.
- Si usaron IA generativa, deben presentar su Declaración de Uso Ético y defender por qué el código es suyo.

---

## CLASE 26 — Portafolio técnico del año

**Fecha:** Semana del 16 de noviembre de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Objetivos
- Organizar todos los proyectos del año en el portafolio digital y reflexionar sobre el aprendizaje.

### Secuencia didáctica
- **Desarrollo:** Los estudiantes suben a su carpeta de Google Drive los 5 mejores proyectos del año. Escriben un documento de reflexión: "¿Qué sé hacer ahora que no sabía en 7.° grado? ¿Cuál fue mi mayor error y cómo lo solucioné?".

---

## CLASE 27 — Evaluación integradora de Computación

**Fecha:** Semana del 23 de noviembre de 2026
**Duración:** 3 horas (1 h Comp + 2 h Prog)

### Secuencia didáctica
- **Computación (1 h):** Estaciones rotativas: (1) Diagnosticar una PC con problema simulado, (2) Configurar permisos de un documento en la nube, (3) Identificar un correo de phishing.
- **Programación (2 h):** Evaluación escrita/digital de conceptos de Python (listas, bucles, funciones) y ética de IA.

---

## CLASE 28 — Cierre del año y egreso

**Fecha:** Semana del 30 de noviembre de 2026
**Duración:** 3 horas

### Secuencia didáctica
- **Reflexión final:** El docente hace un repaso de la trayectoria: de los bloques visuales de 7.° a la IA y Python estructurado de 8.°.
- **Entrega de diplomas:** "Certificado de Programador Python y Usuario Ético de IA".
- **Preparación para 9.°:** El docente adelanta que en 9.° grado profundizarán en la Ley de Protección de Datos, programación de sistemas cliente-servidor y el proyecto final de egreso del Tercer Ciclo.

---

# RESUMEN ANUAL — 8.° GRADO

| Bimestre | Semanas | Contenido central | Competencia principal |
|---|---|---|---|
| **1.° Bim** | 1-9 | Redes avanzadas, contraseñas seguras, identidad digital. Python: condicionales anidados y operadores lógicos. | Comprende la topología de red y programa validadores con lógica compleja. |
| **2.° Bim** | 10-18 | Nube (IaaS/PaaS/SaaS), trabajo colaborativo. Python: bucles (while/for), listas y manejo de errores. | Gestiona servicios en la nube y estructura datos con listas y bucles. |
| **3.° Bim** | 19-27 | Ciberseguridad (phishing/malware). ML for Kids. Introducción a IA generativa con Declaración de Uso Ético. | Entrena modelos de ML y usa IA generativa con criterio crítico y ética. |
| **4.° Bim** | 28-38 | Proyecto integrador (Python + IA). Portafolio técnico. Evaluación de salida. | Desarrolla un proyecto funcional que resuelve un problema real y documenta su proceso. |

---

**Elaborado por:**
Lic. Rodrigo Godoy
Dirección Académica y Área de Informática y Tecnología Educativa
Colegio Presbiteriano Cerritos — Lambaré, Paraguay | Junio 2026

**Revisado por:**
Prof. Perla Forcado
Coordinación Tercer Ciclo

**Aprobado por:** ______________________________ **Fecha:** ____________
Dirección General (Pastor Cristian Jara)