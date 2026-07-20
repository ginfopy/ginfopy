# PLANES DE CLASE — NIVEL MEDIO
## Área de Tecnología e Informática
### 3.° Curso BTI — Año Lectivo 2026 (Completo: 4 Bimestres)

**COLEGIO PRESBITERIANO CERRITOS** | Lambaré, Paraguay
**Dirección Académica:** Lic. Rodrigo Godoy
**Coordinación Nivel Medio:** Prof. Rossana Franco
**Curso:** 3.° Curso — Bachillerato Técnico en Informática (BTI)
**Carga horaria:** 16 horas semanales (4 h Algorítmica + 12 h Gabinete)
**Total anual:** 608 horas (38 semanas × 16 h)
**Distribución Gabinete:** Lab. Proyecto (4.5 h/sem) · Software (2.25 h/sem) · Hardware/Redes (2.25 h/sem)
**Sala:** Sala de Informática — Secundaria (25 PCs, Windows 10/11, 8 GB RAM, VS Code + Chrome)
**Política de IA:** NIVEL 2 — Uso profesional con Declaración de Uso Ético obligatoria. Integridad académica plena.
**Marco curricular:** Res. DGTCEEB y EM N° 2786/2026 — Diseño Curricular BTI Informática
**Documento derivado del:** Plan Maestro Institucional v3.0, Normativo Nivel Medio v1.0 y Plan Anual Nivel Medio v1.0

---

# CARACTERÍSTICAS ESPECIALES DEL 3.° BTI

El 3.° Curso BTI es el **año terminal** del bachillerato técnico. Su característica distintiva es el **Proyecto de Egreso**: una aplicación funcional completa que resuelve un problema real de la comunidad, desarrollada durante todo el año y defendida oralmente ante tribunal evaluador al finalizar el 4.° bimestre.

Este proyecto es la **evidencia máxima** del perfil de egreso definido en la Res. DGTCEEB y EM N° 2786/2026 y constituye el requisito fundamental para la obtención del título de **Auxiliar Técnico de Nivel Medio en Informática**.

---

# ESTRUCTURA SEMANAL TIPO

| Disciplina | Horas semanales | Enfoque |
|---|---|---|
| **Algorítmica** | 4 h | Estructuras de datos avanzadas, algoritmos complejos, APIs, integración con IA. |
| **Gabinete Lab. (Proyecto)** | 4.5 h | Desarrollo del Proyecto de Egreso: aplicación completa con BD, APIs, IA. |
| **Gabinete Software** | 2.25 h | Python avanzado: APIs, integración con servicios externos, frameworks. |
| **Gabinete Hardware/Redes** | 2.25 h | Configuración de servidor, montaje de red de complejidad sencilla. |

---

# PRIMER BIMESTRE (9 semanas — 9 de febrero a 10 de abril de 2026)
**Objetivo general del bimestre:** Definición del Proyecto de Egreso. Estructuras de datos avanzadas (pilas, colas, listas enlazadas, árboles binarios). Introducción a APIs REST. Configuración de entorno de desarrollo profesional.

---

## SEMANAS 1-2 — Definición del Proyecto de Egreso + Repaso de estructuras + APIs introductorias

### Algorítmica (8 h)
**Contenido:** Diagnóstico de competencias de 2.° BTI. Repaso de estructuras de datos: pilas, colas, listas enlazadas, árboles binarios de búsqueda (BST). Introducción a APIs REST: concepto, endpoints, métodos HTTP (GET, POST, PUT, DELETE), códigos de estado, JSON como formato de intercambio.
**Actividades:** Implementación en pseudocódigo de las estructuras de datos. Trazabilidad de operaciones. Análisis de APIs públicas (ej: API de clima, API de películas). Identificación de endpoints y formato de respuesta JSON.

### Gabinete Lab. (9 h)
**Contenido:** Definición del Proyecto de Egreso: identificación de un problema real de la comunidad escolar o local. Análisis de requerimientos. Diseño del modelo E-R de la base de datos. Wireframes de la interfaz web. Planificación del proyecto con metodología ágil (sprints de 2 semanas).
**Actividades:** Los estudiantes presentan propuestas de proyecto (mínimo 3 opciones por estudiante). El docente aprueba las propuestas viables. Formación de equipos de 2-3 estudiantes. Redacción del documento de requerimientos funcionales y no funcionales. Diseño del modelo E-R y wireframes.

### Gabinete Software (4.5 h)
**Contenido:** Consumo de APIs REST en Python con la librería `requests`. Manejo de respuestas JSON. Autenticación básica (API keys). Manejo de errores en peticiones HTTP.
**Actividades:** Scripts que consumen APIs públicas: obtener clima actual de una ciudad, buscar películas por título, obtener datos de un país. Parseo de respuestas JSON y extracción de datos específicos.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Configuración de entorno de desarrollo profesional: instalación de herramientas (Git, VS Code con extensiones, Python virtual environments). Configuración de GitHub para el proyecto. Buenas prácticas de control de versiones: branching strategy (main, develop, feature branches).
**Actividades:** Configuración del entorno de desarrollo en las PCs. Creación del repositorio del proyecto en GitHub. Configuración de ramas. Primer commit con estructura inicial del proyecto.

---

## SEMANAS 3-4 — Árboles binarios + Diseño de BD del proyecto + Flask avanzado + Servidor web

### Algorítmica (8 h)
**Contenido:** Árboles binarios de búsqueda (BST): inserción, búsqueda, eliminación. Recorridos: inorden, preorden, postorden. Complejidad: O(log n) promedio, O(n) peor caso. Aplicaciones de BST: índices de bases de datos, sistemas de archivos.
**Actividades:** Construcción manual de BST. Implementación en pseudocódigo. Trazabilidad de recorridos. Ejercicio: dado un BST, encontrar el elemento más cercano a un valor dado.

### Gabinete Lab. (9 h)
**Contenido:** Diseño e implementación de la base de datos del proyecto: script SQL DDL completo con tablas normalizadas (3FN), restricciones, claves foráneas, índices. Inserción de datos iniciales. Creación de vistas para consultas frecuentes.
**Actividades:** Implementación del modelo E-R en SQL. Creación de la base de datos en SQLite/MySQL. Inserción de datos de prueba. Pruebas de integridad referencial.

### Gabinete Software (4.5 h)
**Contenido:** Flask avanzado: blueprints para organización de código, middleware, manejo de sesiones y cookies, protección CSRF, validación de formularios con WTForms.
**Actividades:** Reestructuración de la aplicación Flask del 2.° BTI usando blueprints. Implementación de sistema de autenticación completo con sesiones. Validación de formularios con WTForms.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Introducción a servidores web: concepto de servidor, tipos (Apache, Nginx, Flask development server). Instalación y configuración básica de Apache/Nginx en Windows/Linux. Virtual hosts.
**Actividades:** Instalación de Apache/Nginx en una PC del aula. Configuración de un virtual host para servir una página web estática. Configuración de permisos de archivos.

---

## SEMANAS 5-6 — Grafos (introducción) + Backend del proyecto + APIs propias + Configuración de red

### Algorítmica (8 h)
**Contenido:** Introducción a grafos: concepto, vértices, aristas, grafos dirigidos y no dirigidos, ponderados. Representación: matriz de adyacencia, lista de adyacencia. Recorridos: BFS (Breadth-First Search), DFS (Depth-First Search). Aplicaciones: redes sociales, mapas, rutas.
**Actividades:** Construcción de grafos en papel. Implementación de representaciones en pseudocódigo. Trazabilidad de BFS y DFS. Ejercicio: encontrar el camino más corto en un grafo no ponderado.

### Gabinete Lab. (9 h)
**Contenido:** Desarrollo del backend del proyecto: implementación de rutas CRUD completas con Flask. Conexión con la base de datos usando SQLAlchemy (ORM) o consultas SQL directas. Implementación de lógica de negocio.
**Actividades:** Implementación de todas las rutas CRUD del proyecto. Pruebas con Postman o similar. Documentación de la API con Swagger/OpenAPI (introducción).

### Gabinete Software (4.5 h)
**Contenido:** Creación de APIs propias con Flask: diseño de endpoints RESTful, manejo de JSON, códigos de estado HTTP, documentación con comentarios y docstrings.
**Actividades:** Desarrollo de una API REST completa para el proyecto: endpoints para listar, crear, actualizar y eliminar recursos. Pruebas con Postman.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Configuración de red para el proyecto: asignación de IP estática al servidor, configuración de DNS local, pruebas de acceso desde otras PCs de la red.
**Actividades:** Configuración de la PC servidor con IP estática. Pruebas de acceso a la aplicación Flask desde otras PCs de la red LAN. Configuración de firewall para permitir acceso al puerto del servidor.

---

## SEMANAS 7-8 — Algoritmos de grafos + Frontend del proyecto + Integración API externa + Seguridad

### Algorítmica (8 h)
**Contenido:** Algoritmos de grafos: Dijkstra (camino más corto en grafos ponderados), Floyd-Warshall (todos los pares). Complejidad de los algoritmos. Aplicaciones prácticas: GPS, redes de computadoras.
**Actividades:** Trazabilidad de Dijkstra con grafos pequeños. Implementación en pseudocódigo. Ejercicio: encontrar la ruta más corta entre dos ciudades en un mapa.

### Gabinete Lab. (9 h)
**Contenido:** Desarrollo del frontend del proyecto: plantillas HTML con Jinja2, CSS responsive, JavaScript para interactividad (AJAX para llamadas asíncronas a la API).
**Actividades:** Desarrollo de todas las vistas del proyecto. Implementación de formularios con validación del lado del cliente. Uso de AJAX para actualizar datos sin recargar la página.

### Gabinete Software (4.5 h)
**Contenido:** Integración de APIs externas en el proyecto: consumo de APIs de terceros (ej: API de mapas, API de pagos, API de notificaciones). Manejo de rate limiting y caché.
**Actividades:** Integración de al menos una API externa en el proyecto (ej: mostrar ubicación en mapa, enviar notificaciones por email).

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Seguridad de aplicaciones web: HTTPS, certificados SSL/TLS (concepto), protección contra inyección SQL, XSS, CSRF. Implementación de medidas de seguridad en Flask.
**Actividades:** Implementación de medidas de seguridad en el proyecto: validación de entradas, protección CSRF, escape de HTML. Generación de certificado SSL autofirmado para pruebas.

---

## SEMANA 9 — Evaluación bimestral integradora

### Algorítmica (4 h)
**Evaluación escrita:** Estructuras de datos avanzadas (árboles, grafos), algoritmos de recorrido y búsqueda, análisis de complejidad.

### Gabinete Lab. (4.5 h)
**Entrega parcial del proyecto:** Backend funcional con todas las rutas CRUD implementadas. Base de datos operativa. Documentación de la API.

### Gabinete Software (2.25 h)
**Evaluación práctica:** Implementación de una API REST completa con Flask. Consumo de API externa.

### Gabinete Hardware/Redes (2.25 h)
**Evaluación práctica:** Configuración de servidor web. Configuración de red LAN con acceso al servidor.

---

# SEGUNDO BIMESTRE (9 semanas — 13 de abril a 19 de junio de 2026)
**Objetivo general del bimestre:** Integración con IA (APIs de IA generativa). Algoritmos avanzados. Finalización del frontend. Testing automatizado. Montaje de red de complejidad sencilla.

---

## SEMANAS 10-11 — Algoritmos de ordenamiento avanzados + Integración con IA + Testing + Montaje de red

### Algorítmica (8 h)
**Contenido:** Algoritmos de ordenamiento avanzados: Merge Sort, Quick Sort (profundización), Heap Sort. Análisis comparativo de complejidad. Algoritmos de búsqueda avanzados: búsqueda hash, árboles balanceados (concepto).
**Actividades:** Implementación en pseudocódigo de los algoritmos avanzados. Análisis comparativo de rendimiento. Ejercicios de selección: ¿qué algoritmo usar según el caso?

### Gabinete Lab. (9 h)
**Contenido:** Integración con IA en el proyecto: uso de APIs de IA generativa (OpenAI, Google Gemini, Anthropic Claude) para agregar funcionalidades inteligentes al proyecto (ej: generación de resúmenes, clasificación de texto, recomendaciones).
**Actividades:** Integración de al menos una funcionalidad de IA en el proyecto usando APIs. Implementación de prompts estructurados. Manejo de respuestas de la IA. Documentación del uso de IA con Declaración de Uso Ético.

### Gabinete Software (4.5 h)
**Contenido:** Testing automatizado en Python: pytest (framework moderno), fixtures, parametrización de tests, cobertura de código (coverage). Test-driven development (TDD) aplicado al proyecto.
**Actividades:** Escritura de tests automatizados para las funciones principales del proyecto. Ejecución de tests con pytest. Generación de reporte de cobertura.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Montaje de red de complejidad sencilla: planificación de red para una oficina pequeña (10-15 PCs), selección de equipos (switch, router, access point), cableado estructurado (norma T568B), configuración de VLANs básicas.
**Actividades:** Montaje físico de una red LAN con 4-5 PCs, switch y router. Cableado con conectores RJ-45. Configuración de VLANs para separar tráfico (ej: red administrativa, red de invitados). Pruebas de conectividad.

---

## SEMANAS 12-13 — Programación dinámica (introducción) + Optimización del proyecto + CI/CD básico + Seguridad avanzada

### Algorítmica (8 h)
**Contenido:** Introducción a programación dinámica: concepto, subproblemas overlapping, memoización. Problema clásico: Fibonacci con memoización, problema de la mochila (knapsack) simplificado. Comparación con fuerza bruta.
**Actividades:** Resolución de problemas con programación dinámica en pseudocódigo. Trazabilidad de la tabla de memoización. Análisis de mejora de complejidad.

### Gabinete Lab. (9 h)
**Contenido:** Optimización del proyecto: refactorización de código, optimización de consultas SQL (índices, consultas eficientes), optimización de carga de páginas (lazy loading, caché).
**Actividades:** Análisis de rendimiento del proyecto con herramientas de profiling. Optimización de consultas lentas. Implementación de caché para datos frecuentes.

### Gabinete Software (4.5 h)
**Contenido:** Introducción a CI/CD (Continuous Integration/Continuous Deployment): concepto, GitHub Actions para automatización de tests y despliegue.
**Actividades:** Configuración de GitHub Actions para ejecutar tests automáticamente en cada push. Configuración de despliegue automático a un servidor de pruebas (si es posible) o generación de artefactos.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Seguridad avanzada de redes: configuración de firewall con reglas complejas, IDS/IPS (concepto), monitoreo de tráfico con Wireshark (introducción), análisis de logs.
**Actividades:** Configuración de reglas de firewall avanzadas. Captura de tráfico con Wireshark y análisis básico. Interpretación de logs de acceso al servidor.

---

## SEMANAS 14-15 — Backtracking + Documentación del proyecto + Despliegue + Informe de red

### Algorítmica (8 h)
**Contenido:** Backtracking: concepto, aplicaciones (problema de las N reinas, sudoku simplificado, laberintos). Implementación en pseudocódigo. Análisis de complejidad.
**Actividades:** Implementación de algoritmos de backtracking en pseudocódigo. Resolución de problemas clásicos. Análisis de casos donde backtracking es aplicable.

### Gabinete Lab. (9 h)
**Contenido:** Documentación completa del proyecto: README profesional, manual de usuario, manual técnico (arquitectura, modelo E-R, diagrama de clases, API), capturas de pantalla, video demostrativo.
**Actividades:** Redacción de toda la documentación del proyecto. Creación de diagramas UML (clases, secuencia). Grabación de video demostrativo (3-5 minutos).

### Gabinete Software (4.5 h)
**Contenido:** Despliegue del proyecto: opciones de hosting (Heroku, Render, PythonAnywhere, servidor propio). Configuración de variables de entorno. Preparación para producción.
**Actividades:** Despliegue del proyecto en una plataforma de hosting gratuita (Heroku/Render) o en servidor local. Configuración de base de datos en producción. Pruebas finales.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Elaboración del informe técnico de red del proyecto: documentación completa de la red montada, diagramas, tabla de direccionamiento, políticas de seguridad, recomendaciones.
**Actividades:** Redacción del informe técnico completo. Presentación oral del informe (5 minutos).

---

## SEMANA 16 — Evaluación bimestral integradora

### Algorítmica (4 h)
**Evaluación escrita:** Algoritmos avanzados (ordenamiento, programación dinámica, backtracking), análisis de complejidad, selección de algoritmos según el caso.

### Gabinete Lab. (4.5 h)
**Entrega del proyecto completo:** Aplicación funcional desplegada, documentación completa, video demostrativo, Declaración de Uso Ético de IA (si aplica).

### Gabinete Software (2.25 h)
**Evaluación práctica:** Implementación de tests automatizados. Configuración de CI/CD básico.

### Gabinete Hardware/Redes (2.25 h)
**Evaluación práctica:** Montaje y configuración de red con VLANs. Informe técnico de red.

---

# TERCER BIMESTRE (9 semanas — 6 de julio a 11 de septiembre de 2026)
**Objetivo general del bimestre:** Finalización y pulido del Proyecto de Egreso. Pruebas de usuario. Preparación de la defensa oral. Evaluaciones parciales.

---

## SEMANAS 17-18 — Repaso algorítmico + Pruebas de usuario + Optimización final + Diagnóstico de red

### Algorítmica (8 h)
**Contenido:** Repaso integrador de todos los algoritmos vistos en el año: estructuras de datos, ordenamiento, búsqueda, grafos, programación dinámica, backtracking. Resolución de problemas complejos que combinen múltiples conceptos.
**Actividades:** Ejercicios integradores de alta complejidad. Simulacros de evaluación. Análisis de casos reales: ¿qué algoritmos y estructuras de datos usar para cada problema?

### Gabinete Lab. (9 h)
**Contenido:** Pruebas de usuario (User Acceptance Testing - UAT): invitar a usuarios reales (compañeros de otros cursos, docentes, personal del colegio) a probar la aplicación. Recopilación de feedback. Iteración de mejoras.
**Actividades:** Organización de sesiones de pruebas con usuarios externos. Recopilación de feedback estructurado (encuestas, entrevistas). Implementación de mejoras prioritarias. Corrección de bugs reportados.

### Gabinete Software (4.5 h)
**Contenido:** Optimización final del código: refactorización, eliminación de código duplicado, mejora de legibilidad, comentarios y docstrings completos. Análisis de calidad de código con herramientas (pylint, flake8).
**Actividades:** Refactorización completa del código. Ejecución de herramientas de análisis estático. Corrección de warnings y errores de estilo.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Diagnóstico avanzado de red: uso de herramientas de diagnóstico (ping, traceroute, nslookup, netstat, Wireshark). Identificación de problemas de conectividad, latencia, pérdida de paquetes.
**Actividades:** Diagnóstico de problemas de red simulados. Uso de Wireshark para analizar tráfico. Interpretación de resultados y propuesta de soluciones.

---

## SEMANAS 19-20 — Preparación de la defensa + Testing final + Despliegue en producción + Seguridad final

### Algorítmica (8 h)
**Contenido:** Preparación de la defensa oral del proyecto: estructura de la presentación, manejo del tiempo, anticipación de preguntas del tribunal. Práctica de la presentación.
**Actividades:** Ensayo de la presentación oral (10 minutos por equipo). Retroalimentación del docente y compañeros. Ajustes finales.

### Gabinete Lab. (9 h)
**Contenido:** Testing final exhaustivo: pruebas funcionales, de rendimiento, de seguridad, de usabilidad. Corrección de últimos bugs. Preparación del entorno de producción.
**Actividades:** Ejecución de suite completa de tests. Pruebas de carga (si aplica). Verificación de seguridad. Preparación del deployment final.

### Gabinete Software (4.5 h)
**Contenido:** Despliegue en producción (si no se hizo en el bimestre anterior): configuración final del servidor, base de datos de producción, variables de entorno, monitoreo básico.
**Actividades:** Deployment final de la aplicación. Configuración de monitoreo básico (logs, alertas de errores). Verificación de funcionamiento en producción.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Seguridad final del proyecto: auditoría de seguridad básica, verificación de medidas de protección, hardening del servidor.
**Actividades:** Auditoría de seguridad del proyecto y servidor. Implementación de medidas de hardening adicionales. Documentación de políticas de seguridad.

---

## SEMANAS 21-22 — Ensayo general + Documentación final + Portafolio técnico + Inventario

### Algorítmica (8 h)
**Contenido:** Ensayo general de la defensa oral. Simulacro completo con tribunal simulado (docente + coordinador + compañero). Retroalimentación detallada.
**Actividades:** Simulacro de defensa oral (15 minutos por equipo: 10 min presentación + 5 min preguntas). Retroalimentación constructiva. Ajustes finales.

### Gabinete Lab. (9 h)
**Contenido:** Documentación final del proyecto: actualización de README, manual de usuario, manual técnico, video demostrativo. Preparación del repositorio GitHub para la evaluación.
**Actividades:** Actualización final de toda la documentación. Verificación de que el repositorio GitHub está completo y organizado. Preparación de materiales para la presentación.

### Gabinete Software (4.5 h)
**Contenido:** Compilación del portafolio técnico del año: todos los proyectos, ejercicios y evaluaciones de los 3 años del BTI organizados en GitHub y Google Drive. Reflexión sobre la trayectoria.
**Actividades:** Organización del portafolio técnico. Escritura de documento de reflexión: "¿Qué sabía en 1.° BTI? ¿Qué sé ahora? ¿Cuál fue mi mayor desafío? ¿Cómo me preparé para el campo laboral o la educación superior?".

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Actualización del inventario del laboratorio de informática. Recomendaciones de mantenimiento y mejora para el próximo año.
**Actividades:** Inventario completo de hardware y software del laboratorio. Redacción de informe de recomendaciones.

---

## SEMANA 23 — Evaluación bimestral integradora

### Algorítmica (4 h)
**Evaluación escrita integradora:** Todos los temas del año. Resolución de problemas complejos.

### Gabinete Lab. (4.5 h)
**Entrega final del proyecto:** Aplicación desplegada y funcional, documentación completa, portafolio técnico del año.

### Gabinete Software (2.25 h)
**Evaluación práctica:** Testing automatizado completo. Análisis de calidad de código.

### Gabinete Hardware/Redes (4.5 h)
**Evaluación práctica:** Diagnóstico de red avanzado. Informe técnico final.

---

# CUARTO BIMESTRE (11 semanas — 14 de septiembre a 13 de noviembre de 2026)
**Objetivo general del bimestre:** DEFENSA ORAL DEL PROYECTO DE EGRESO ante tribunal evaluador. Evaluaciones finales. Cierre del año. Entrega de títulos.

---

## SEMANAS 24-26 — DEFENSA ORAL DEL PROYECTO DE EGRESO

### Formato de la defensa (por equipo, 20 minutos totales):

1. **Presentación oral (10 minutos):**
   - Introducción del problema y la solución propuesta (2 min).
   - Demostración en vivo de la aplicación funcional (3 min).
   - Explicación de la arquitectura técnica: modelo E-R, diagrama de clases, estructura del código, tecnologías utilizadas (3 min).
   - Explicación del uso ético de IA (si aplica): qué se usó, para qué, cómo se verificó (1 min).
   - Conclusiones y lecciones aprendidas (1 min).

2. **Preguntas del tribunal (10 minutos):**
   - El tribunal está compuesto por: docente del área, coordinador de nivel, y un docente invitado o profesional externo (si es posible).
   - Preguntas sobre: arquitectura, decisiones de diseño, algoritmos utilizados, seguridad, escalabilidad, uso de IA, documentación.
   - Los estudiantes deben demostrar dominio completo del proyecto y capacidad de responder preguntas técnicas con fundamentos.

### Rúbrica de evaluación del Proyecto de Egreso:

| Criterio | Excelente (10) | Bueno (7-9) | Suficiente (5-6) | Insuficiente (<5) |
|---|---|---|---|---|
| **Funcionalidad** | Aplicación completa, todas las funcionalidades operativas sin errores. | Aplicación funcional con errores menores. | Funciona parcialmente. | No funcional o errores críticos. |
| **Arquitectura técnica** | Diseño sólido, normalización correcta, uso apropiado de patrones. | Diseño adecuado, pocos errores. | Diseño básico, sin normalización. | Sin diseño o incorrecto. |
| **Calidad del código** | Código limpio, bien estructurado, comentado, sigue buenas prácticas. | Código funcional, comentarios básicos. | Código desorganizado, pocos comentarios. | Código ilegible o sin estructura. |
| **Uso de IA** | Integración inteligente de IA con Declaración de Uso Ético completa y auditoría. | Uso de IA declarado pero auditoría incompleta. | Uso de IA no declarado o declarado incorrectamente. | Plagio o uso fraudulento de IA. |
| **Documentación** | Documentación profesional: README, manuales, diagramas UML, video. | Documentación completa pero básica. | Documentación incompleta. | Sin documentación. |
| **Presentación oral** | Presentación clara, fluida, responde preguntas con dominio y fundamentos técnicos. | Presentación clara, responde preguntas básicas. | Presentación básica, dificultades para responder. | No presenta o presentación deficiente. |
| **Impacto social** | Proyecto resuelve un problema real de la comunidad con impacto demostrable. | Proyecto útil pero impacto limitado. | Proyecto con impacto mínimo. | Sin impacto social. |
| **Despliegue** | Aplicación desplegada y accesible en producción. | Desplegada con limitaciones. | No desplegada pero funcional localmente. | No funcional. |

---

## SEMANAS 27-28 — Evaluaciones finales de Algorítmica y Gabinete

### Algorítmica (4 h)
**Evaluación escrita final integradora:** Todos los temas del año y de los 3 años del BTI: teoría de conjuntos, lógica simbólica, estructuras de datos, algoritmos de ordenamiento y búsqueda, grafos, programación dinámica, backtracking, POO, análisis de complejidad.

### Gabinete (12 h)
**Evaluación práctica integradora:**
- **Lab. Proyecto (4.5 h):** Evaluación del proyecto desplegado y documentación.
- **Software (2.25 h):** Implementación de un problema complejo con estructuras de datos avanzadas y APIs.
- **Hardware/Redes (2.25 h):** Montaje y configuración de red completa con seguridad. Diagnóstico de fallas.

---

## SEMANA 29 — Portafolio técnico y retrospectiva

### Todas las disciplinas (16 h)
**Contenido:** Compilación final del portafolio técnico de los 3 años del BTI. Retrospectiva profunda de la trayectoria formativa.

**Actividades:**
- Organización de todos los repositorios de GitHub de los 3 años.
- Escritura de documento de retrospectiva comprehensive: "¿Qué sabía al entrar a 1.° BTI? ¿Qué sé ahora? ¿Cuál fue mi evolución? ¿Cómo me preparé para el campo laboral o la educación superior?".
- Preparación de presentación del portafolio para entrevistas de trabajo o admisión universitaria.

---

## SEMANA 30 — Orientación profesional y académica

### Todas las disciplinas (16 h)
**Contenido:** Orientación sobre opciones post-egreso: campo laboral (puestos disponibles para Auxiliar Técnico en Informática), educación superior (carreras universitarias afines: Ingeniería en Informática, Sistemas, Ciencias de la Computación), emprendimiento tecnológico.

**Actividades:**
- Presentación de opciones laborales: desarrollador junior, soporte técnico, administrador de redes, analista de datos.
- Presentación de opciones universitarias: requisitos, perfil de ingreso, campo laboral.
- Elaboración de CV técnico y perfil de LinkedIn (si tienen acceso).
- Simulación de entrevista técnica.

---

## SEMANA 31 — Ceremonia de egreso y entrega de títulos

### Todas las disciplinas (16 h)
**Contenido:** Ceremonia formal de egreso del Bachillerato Técnico en Informática.

**Actividades:**
- Entrega formal del título de **Auxiliar Técnico de Nivel Medio en Informática** conforme a la Res. DGTCEEB y EM N° 2786/2026.
- Presentación de los Proyectos de Egreso ante la comunidad educativa (padres, directivos, otros estudiantes).
- Palabras de cierre del docente, coordinador y dirección general.
- Reconocimientos especiales: mejor proyecto, mejor presentación, mayor progreso, liderazgo técnico.

---

## SEMANAS 32-33 — Actividades de cierre y transición

### Todas las disciplinas (16 h/semana)
**Contenido:** Actividades de cierre del año y preparación para la transición a la vida profesional o universitaria.

**Actividades:**
- Limpieza y organización del laboratorio.
- Mentoría a estudiantes de cursos inferiores (si es posible).
- Proyectos personales o de interés especial.
- Networking con profesionales del área (charlas virtuales con egresados o profesionales invitados).

---

# RESUMEN ANUAL — 3.° BTI

| Bimestre | Semanas | Algorítmica | Gabinete Lab. (Proyecto) | Gabinete Software | Gabinete Hardware/Redes |
|---|---|---|---|---|---|
| **1.° Bim** | 1-9 | Estructuras de datos avanzadas (árboles, grafos). APIs REST. | Definición del Proyecto de Egreso. Diseño de BD. Backend con Flask. | Consumo de APIs con Python. Flask avanzado. | Configuración de entorno profesional. Servidor web. Red LAN. |
| **2.° Bim** | 10-16 | Algoritmos avanzados (Merge Sort, programación dinámica, backtracking). | Integración con IA. Optimización. Frontend completo. Despliegue. | Testing automatizado. CI/CD básico. | Montaje de red con VLANs. Seguridad avanzada. |
| **3.° Bim** | 17-23 | Repaso integrador. Preparación de defensa oral. | Pruebas de usuario. Optimización final. Documentación completa. | Refactorización. Análisis de calidad de código. | Diagnóstico de red avanzado. Hardening de seguridad. |
| **4.° Bim** | 24-33 | Evaluación final integradora. | **DEFENSA ORAL DEL PROYECTO DE EGRESO.** Evaluación final. | Evaluación final. | Evaluación final. |

---

# EL PROYECTO DE EGRESO: CARACTERÍSTICAS Y REQUISITOS

## Características del Proyecto de Egreso

1. **Problema real:** Debe resolver un problema real de la comunidad escolar o local (no un ejercicio académico).
2. **Aplicación completa:** Debe ser una aplicación funcional desplegada y accesible (web o desktop).
3. **Base de datos:** Debe usar una base de datos relacional normalizada.
4. **Interfaz de usuario:** Debe tener una interfaz web responsive y amigable.
5. **APIs:** Debe consumir al menos una API externa o exponer su propia API.
6. **IA (opcional pero recomendado):** Puede integrar funcionalidades de IA generativa con Declaración de Uso Ético.
7. **Documentación profesional:** README, manuales, diagramas UML, video demostrativo.
8. **Código de calidad:** Limpio, comentado, con tests automatizados.
9. **Desplegado:** Accesible en producción (no solo localmente).
10. **Defendible:** Los estudiantes deben poder explicar y defender cada decisión de diseño.

## Ejemplos de Proyectos de Egreso (referencia)

1. **Sistema de gestión de biblioteca escolar:** Préstamos, devoluciones, búsqueda, reservas, reportes.
2. **Plataforma de tutorías entre estudiantes:** Registro de tutores, agendamiento de sesiones, calificaciones.
3. **Sistema de control de asistencia con reconocimiento facial:** (usando API de IA) Registro automático de asistencia.
4. **Aplicación de reporte de incidentes en el colegio:** Reporte de problemas de infraestructura, seguimiento, resolución.
5. **Sistema de gestión de eventos escolares:** Creación de eventos, inscripción de participantes, generación de certificados.
6. **Plataforma de venta de productos del colegio:** Catálogo, carrito de compras, historial de pedidos.
7. **Sistema de monitoreo de salud de plantas del colegio:** (usando micro:bit con sensores) Registro de datos, alertas, reportes.
8. **Aplicación de gestión de notas y boletines:** Carga de notas, cálculo de promedios, generación de boletines en PDF.

---

# ARTICULACIÓN VERTICAL FINAL

## Lo que el 3.° BTI recibe de 2.° BTI
1. POO sólida: clases, herencia, polimorfismo, composición.
2. Bases de datos relacionales: modelado E-R, SQL, normalización.
3. Desarrollo web backend: Flask, formularios, autenticación.
4. Estructuras de datos básicas: pilas, colas, listas enlazadas.
5. Algoritmos de ordenamiento y búsqueda.
6. Control de versiones: Git/GitHub.
7. Mantenimiento correctivo y montaje de redes LAN.

## Lo que el 3.° BTI entrega: el egresado BTI

El egresado del BTI es un **Auxiliar Técnico de Nivel Medio en Informática** con el siguiente perfil (según Res. DGTCEEB y EM N° 2786/2026):

### Perfil de egreso del BTI

| Dimensión | Competencias del egresado |
|---|---|
| **Pensamiento computacional** | Diseña, programa e implementa sistemas de software completos usando POO, bases de datos relacionales y APIs. Desarrolla aplicaciones web funcionales con backend y frontend. Aplica algoritmos y estructuras de datos avanzadas para resolver problemas complejos. Analiza la complejidad algorítmica y selecciona la solución más eficiente. |
| **Competencia digital** | Administra hardware y redes básicas. Configura servidores web y bases de datos. Despliega aplicaciones en producción. Usa herramientas profesionales de desarrollo (IDEs, Git, APIs, frameworks). Documenta proyectos con estándares profesionales. |
| **Comprensión de la IA** | Integra APIs de IA generativa en aplicaciones. Comprende los fundamentos de redes neuronales y LLMs. Usa IA como asistente de desarrollo con criterio crítico y ética. Detecta alucinaciones y sesgos en respuestas de IA. |
| **Ciudadanía digital** | Aplica licencias de software (MIT, GPL, CC). Implementa seguridad informática (HTTPS, protección contra ataques). Conoce y aplica la Ley N° 7593/2025 de Protección de Datos Personales. Actúa con integridad profesional plena. Documenta el uso ético de IA. |

### Salidas profesionales y académicas del egresado BTI

**Campo laboral inmediato:**
- Desarrollador web junior (frontend/backend).
- Soporte técnico de nivel 2.
- Administrador de redes pequeñas.
- Analista de datos junior.
- Tester de software.
- Documentador técnico.

**Educación superior:**
- Ingeniería en Informática.
- Licenciatura en Sistemas.
- Ciencias de la Computación.
- Ingeniería de Software.
- Analista de Sistemas.
- Desarrollo de Videojuegos.

**Emprendimiento:**
- Desarrollo de aplicaciones propias.
- Consultoría técnica para PyMEs.
- Creación de startups tecnológicas.

---

# EVALUACIÓN INTEGRAL DEL 3.° BTI

## Instrumentos de evaluación

| Instrumento | Peso | Frecuencia |
|---|---|---|
| **Proyecto de Egreso (defensa oral)** | 40% | 4.° bimestre |
| Pruebas escritas de Algorítmica | 20% | Bimestral |
| Proyectos de Gabinete (parciales) | 15% | Bimestral |
| Portafolio técnico de los 3 años | 10% | Semestral |
| Participación y profesionalismo | 10% | Continua |
| Declaraciones de Uso Ético de IA | 5% | Cada entrega que use IA |

## Criterios de aprobación del curso

Para aprobar el 3.° BTI y obtener el título de Auxiliar Técnico en Informática, el estudiante debe:

1. **Aprobar el Proyecto de Egreso** con calificación mínima de 7/10.
2. **Aprobar todas las evaluaciones bimestrales** con calificación mínima de 6/10.
3. **Presentar el portafolio técnico completo** de los 3 años del BTI.
4. **Cumplir con el 80% de asistencia** mínima al año lectivo.
5. **No tener sanciones graves** por falta de integridad académica (plagio, uso fraudulento de IA).

---

# RECURSOS TECNOLÓGICOS

| Recurso | Estado | Acción requerida |
|---|---|---|
| PCs con Windows 10/11 | ✓ Instalado | — |
| VS Code + extensiones | ✓ Instalado | — |
| Python 3 + pip | ✓ Instalado | — |
| Git + GitHub | ✓ Instalado | Crear cuentas institucionales |
| Node.js | ⚠ Pendiente | Instalar para prácticas avanzadas |
| Apache/Nginx | ⚠ Pendiente | Instalar para prácticas de servidores |
| MySQL/PostgreSQL | ⚠ Pendiente | Instalar para bases de datos avanzadas |
| Docker (opcional) | ⚠ Pendiente | Instalar para prácticas de despliegue |
| Conectividad 150 Mbps | ✓ Disponible | Suficiente para 25 usuarios |
| Acceso a APIs de IA | ⚠ Pendiente | Configurar API keys (OpenAI, Google, etc.) |

---

# NOTAS FINALES PARA EL DOCENTE

## Rol del docente en el 3.° BTI

En el 3.° BTI, el rol del docente cambia significativamente:

1. **De instructor a mentor:** El docente ya no enseña contenidos nuevos básicos, sino que guía a los estudiantes en el desarrollo de su proyecto autónomo.
2. **De evaluador a jurado:** En la defensa oral, el docente actúa como jurado evaluador, haciendo preguntas técnicas y evaluando la profundidad del conocimiento.
3. **De profesor a coach profesional:** El docente prepara a los estudiantes para el campo laboral o la educación superior, actuando como mentor de carrera.

## Importancia del Proyecto de Egreso

El Proyecto de Egreso no es un requisito burocrático, es la **evidencia máxima** de que el estudiante ha alcanzado el perfil de egreso definido en la Res. DGTCEEB y EM N° 2786/2026. Es:

- **Para el estudiante:** Su primer proyecto profesional, la pieza central de su portafolio, su carta de presentación para entrevistas de trabajo o admisión universitaria.
- **Para el colegio:** La evidencia concreta de la calidad de la formación técnica ofrecida, el producto tangible del BTI.
- **Para la comunidad:** Una solución real a un problema real, demostrando el impacto social de la educación técnica.

## Ética y profesionalismo

El 3.° BTI es el año donde se consolida el **profesionalismo técnico**. Los estudiantes deben:

1. **Cumplir plazos:** Los sprints del proyecto tienen fechas de entrega inamovables.
2. **Documentar todo:** Cada decisión de diseño debe estar justificada y documentada.
3. **Ser éticos:** El uso de IA debe ser transparente y auditado. El código debe ser propio o correctamente atribuido.
4. **Ser profesionales:** La comunicación con el docente, los compañeros y los usuarios debe ser profesional y respetuosa.
5. **Asumir responsabilidad:** El proyecto es responsabilidad del equipo. No hay excusas por "no tuve tiempo" o "mi compañero no hizo su parte".

---

**Elaborado por:**
Lic. Rodrigo Godoy
Dirección Académica y Área de Informática y Tecnología Educativa
Colegio Presbiteriano Cerritos — Lambaré, Paraguay | Junio 2026

**Revisado por:**
Prof. Rossana Franco
Coordinación Nivel Medio

**Aprobado por:** ______________________________ **Fecha:** ____________
Dirección General (Pastor Cristian Jara)