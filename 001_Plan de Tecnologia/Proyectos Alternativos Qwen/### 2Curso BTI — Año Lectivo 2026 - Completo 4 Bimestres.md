# PLANES DE CLASE — NIVEL MEDIO
## Área de Tecnología e Informática
### 2.° Curso BTI — Año Lectivo 2026 (Completo: 4 Bimestres)

**COLEGIO PRESBITERIANO CERRITOS** | Lambaré, Paraguay
**Dirección Académica:** Lic. Rodrigo Godoy
**Coordinación Nivel Medio:** Prof. Rossana Franco
**Curso:** 2.° Curso — Bachillerato Técnico en Informática (BTI)
**Carga horaria:** 16 horas semanales (4 h Algorítmica + 12 h Gabinete)
**Total anual:** 608 horas (38 semanas × 16 h)
**Distribución Gabinete:** Lab. BB.DD. (4.5 h/sem) · Software (2.25 h/sem) · Hardware/Redes (2.25 h/sem)
**Sala:** Sala de Informática — Secundaria (25 PCs, Windows 10/11, 8 GB RAM, VS Code + Chrome)
**Política de IA:** NIVEL 2 — Uso profesional con Declaración de Uso Ético obligatoria.
**Marco curricular:** Res. DGTCEEB y EM N° 2786/2026 — Diseño Curricular BTI Informática
**Documento derivado del:** Plan Maestro Institucional v3.0, Normativo Nivel Medio v1.0 y Plan Anual Nivel Medio v1.0

---

# ESTRUCTURA SEMANAL TIPO

| Disciplina | Horas semanales | Enfoque |
|---|---|---|
| **Algorítmica** | 4 h | POO, algoritmos de ordenamiento y búsqueda, complejidad algorítmica. |
| **Gabinete Lab. (BB.DD.)** | 4.5 h | Bases de datos relacionales: SQL, modelado E-R, normalización, conexión con interfaz. |
| **Gabinete Software** | 2.25 h | POO en Python, módulos, manejo avanzado de errores, testing básico. |
| **Gabinete Hardware/Redes** | 2.25 h | Mantenimiento preventivo y correctivo. Configuración de red LAN. |

---

# PRIMER BIMESTRE (9 semanas — 9 de febrero a 10 de abril de 2026)
**Objetivo general del bimestre:** Dominar POO en Python (clases, objetos, atributos, métodos, encapsulamiento). Fundamentos de bases de datos relacionales: modelo Entidad-Relación, normalización básica e introducción a SQL. Mantenimiento correctivo de hardware.

---

## SEMANAS 1-2 — Diagnóstico + Clases y objetos en Python + Modelo E-R + Repaso Hardware

### Algorítmica (8 h)
**Contenido:** Diagnóstico de competencias de 1.° BTI. Repaso de funciones, módulos y estructuras de datos. Introducción a la Programación Orientada a Objetos (POO): paradigma vs programación estructurada. Conceptos fundamentales: clase, objeto, atributo, método, instancia. Analogía del mundo real: clase = plano, objeto = casa construida. Notación UML básica para clases: nombre, atributos, métodos.
**Actividades:** Identificación de objetos y clases en el entorno cotidiano (coche, persona, cuenta bancaria). Modelado en papel de 5 clases con atributos y métodos. Diagramas UML básicos. Primer ejercicio de traducción: clase `Persona` con atributos (nombre, edad, dirección) y métodos (presentarse, cumplir_años).

### Gabinete Lab. (9 h)
**Contenido:** Diagnóstico de HTML/CSS/JS de 1.° BTI. Introducción a las bases de datos: ¿qué son? ¿Para qué sirven? Diferencia entre archivo plano (CSV, TXT) y base de datos relacional. Conceptos: dato, información, campo, registro, tabla. Introducción al Modelo Entidad-Relación (E-R): entidades, atributos, relaciones, cardinalidad (1:1, 1:N, N:M).
**Actividades:** Análisis de casos reales: ¿cómo organiza datos una biblioteca? ¿Un hospital? ¿Una tienda? Elaboración de diagramas E-R en papel para 3 casos. Identificación de entidades, atributos y relaciones.

### Gabinete Software (4.5 h)
**Contenido:** Instalación y configuración de MySQL/SQLite y DBeaver (o DB Browser for SQLite). Primera clase en Python: sintaxis `class`, método `__init__()`, `self`, creación de instancias. Acceso a atributos y llamada a métodos.
**Actividades:** Implementación de las clases modeladas en Algorítmica: `Persona`, `Estudiante`, `Producto`. Creación de múltiples instancias. Ejercicios de acceso y modificación de atributos.

### Gabinete Hardware (4.5 h)
**Contenido:** Repaso de componentes de 1.° BTI. Introducción al mantenimiento correctivo: diagnóstico de fallas por síntomas (no enciende, pitidos, pantalla azul, lentitud). Metodología de diagnóstico: identificar síntomas → aislar componentes → probar hipótesis → reemplazar.
**Actividades:** Simulación de fallas en PCs del aula. Diagnóstico guiado usando metodología. Registro de síntomas y conclusiones en ficha técnica.

---

## SEMANAS 3-4 — Encapsulamiento + Entidades y atributos en E-R + Métodos de instancia + Beep codes y fuentes

### Algorítmica (8 h)
**Contenido:** Encapsulamiento: atributos públicos vs privados (convención `_` y `__` en Python). Métodos getter y setter. Propiedades (`@property`). Principio de ocultación de información: la clase controla cómo se accede a sus datos.
**Actividades:** Refactorización de clases anteriores para usar encapsulamiento. Implementación de validaciones en setters (ej: edad no puede ser negativa). Ejercicios de diseño: clase `CuentaBancaria` con saldo privado y métodos `depositar()` y `retirar()` con validación.

### Gabinete Lab. (9 h)
**Contenido:** Profundización en modelo E-R: tipos de atributos (simple, compuesto, derivado, multivalorado). Claves: clave primaria (PK), clave candidata. Restricciones de integridad: entidad (PK no nula, única), referencial. Diagramas E-R con notación de Chen y Crow's Foot.
**Actividades:** Modelado E-R completo de una base de datos para un sistema de biblioteca (Libro, Autor, Préstamo, Socio). Definición de PKs. Identificación de relaciones y cardinalidades. Validación del modelo con casos de uso.

### Gabinete Software (4.5 h)
**Contenido:** Métodos de instancia vs métodos de clase (`@classmethod`) vs métodos estáticos (`@staticmethod`). Representación de objetos: `__str__()`, `__repr__()`. Comparación de objetos.
**Actividades:** Implementación de `__str__()` en todas las clases creadas. Métodos de clase para contar instancias (`contador`). Métodos estáticos para validaciones. Ejercicio: clase `Fecha` con métodos para calcular diferencia entre fechas.

### Gabinete Hardware (4.5 h)
**Contenido:** Diagnóstico por beep codes: interpretación de pitidos según fabricante (AMI, Award, Phoenix). Fallas de fuente de poder: síntomas, testing con multímetro o tester de fuentes. Procedimiento de reemplazo seguro de fuente.
**Actividades:** Identificación de beep codes en tabla de referencia. Simulación de diagnóstico de fuente. Procedimiento paso a paso de reemplazo de fuente (con PC desconectada).

---

## SEMANAS 5-6 — Herencia simple + Relaciones 1:N en E-R + Herencia en Python + Reemplazo de RAM y disco

### Algorítmica (8 h)
**Contenido:** Herencia simple: concepto, superclase y subclase. Relación "es-un" (un Perro ES UN Animal). Ventajas de la herencia: reutilización de código, jerarquías lógicas. Diagramas UML con herencia (flecha hueca).
**Actividades:** Diseño de jerarquías de clases: `Figura` → `Circulo`, `Rectangulo`, `Triangulo`. `Vehiculo` → `Auto`, `Moto`, `Camion`. `Empleado` → `Gerente`, `Desarrollador`. Diagramas UML completos.

### Gabinete Lab. (9 h)
**Contenido:** Relaciones 1:N y N:M en el modelo E-R. Entidades débiles. Atributos de relación. Transformación del modelo E-R a tablas: reglas de mapeo. Claves foráneas (FK). Integridad referencial.
**Actividades:** Transformación del modelo E-R de la biblioteca a tablas con PKs y FKs. Ejercicios de mapeo: relación 1:N (Autor → Libro), relación N:M (Estudiante ↔ Curso con tabla intermedia). Verificación de integridad referencial.

### Gabinete Software (4.5 h)
**Contenido:** Herencia en Python: sintaxis `class Subclase(Superclase)`. Uso de `super()` para llamar al constructor de la superclase. Sobreescritura de métodos. MRO (Method Resolution Order) básico.
**Actividades:** Implementación de las jerarquías diseñadas en Algorítmica. Uso de `super().__init__()`. Sobreescritura de `__str__()` y métodos específicos. Verificación de herencia con `isinstance()` e `issubclass()`.

### Gabinete Hardware (4.5 h)
**Contenido:** Reemplazo de RAM: tipos (DDR3, DDR4, DDR5), compatibilidad, procedimiento. Reemplazo de disco duro/SSD: factores de forma (2.5", 3.5", M.2), interfaz (SATA, NVMe), clonación de disco.
**Actividades:** Identificación del tipo de RAM instalada en las PCs del aula. Procedimiento de reemplazo de RAM (con PC desconectada). Identificación de tipo de disco. Procedimiento de reemplazo y clonación con herramienta gratuita (Clonezilla o Macrium Reflect).

---

## SEMANAS 7-8 — Polimorfismo + Introducción a SQL (DDL) + Polimorfismo en Python + Mantenimiento preventivo avanzado

### Algorítmica (8 h)
**Contenido:** Polimorfismo: definición, tipos (sobrecarga, sobreescritura). Principio de sustitución de Liskov (simplificado): una subclase debe poder usarse donde se espera la superclase. Ejemplos prácticos de polimorfismo. Composición vs herencia: relación "tiene-un" vs "es-un".
**Actividades:** Ejercicios de polimorfismo: función que recibe lista de `Figura` y calcula área total sin saber el tipo específico. Composición: clase `Auto` que tiene un `Motor` y 4 `Rueda`. Comparación de soluciones con herencia vs composición.

### Gabinete Lab. (9 h)
**Contenido:** Introducción a SQL. Lenguaje DDL (Data Definition Language): `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`. Tipos de datos SQL: `INT`, `VARCHAR`, `TEXT`, `DATE`, `FLOAT`, `BOOLEAN`. Restricciones: `PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`, `FOREIGN KEY`.
**Actividades:** Creación de las tablas del modelo E-R de la biblioteca usando SQL. Definición de tipos de datos adecuados. Aplicación de restricciones. Verificación de la estructura con `DESCRIBE` o vista gráfica en DBeaver.

### Gabinete Software (4.5 h)
**Contenido:** Polimorfismo en Python: duck typing, métodos mágicos (`__len__`, `__add__`, `__eq__`). Clases abstractas con `abc.ABC` y `@abstractmethod` (introducción).
**Actividades:** Implementación de métodos mágicos. Ejercicio: clase `Vector2D` con `__add__`, `__sub__`, `__eq__`. Creación de clase abstracta `Forma` con método abstracto `calcular_area()` y subclases que lo implementen.

### Gabinete Hardware (4.5 h)
**Contenido:** Mantenimiento preventivo avanzado: gestión de disco (desfragmentación HDD, TRIM SSD), limpieza de registro, gestión de programas de inicio, actualizaciones de BIOS/UEFI. Herramientas: CCleaner (o BleachBit), msconfig, Task Manager (inicio).
**Actividades:** Mantenimiento preventivo completo de las PCs del aula. Optimización de inicio. Limpieza de archivos temporales. Verificación de salud del disco con CrystalDiskInfo. Documentación del proceso en ficha técnica.

---

## SEMANA 9 — Evaluación bimestral integradora

### Algorítmica (4 h)
**Evaluación escrita:** Modelado de clases con UML. Herencia, encapsulamiento, polimorfismo. Composición vs herencia. Trazabilidad de código POO.

### Gabinete Lab. (4.5 h)
**Entrega de proyecto:** Modelo E-R completo + script SQL DDL de una base de datos para un caso real (sistema escolar, tienda, biblioteca). Validación de integridad referencial.

### Gabinete Software (2.25 h)
**Evaluación práctica:** Implementación de un sistema de clases con herencia, encapsulamiento y polimorfismo. Resolución de problemas en tiempo limitado.

### Gabinete Hardware/Redes (2.25 h)
**Evaluación práctica:** Diagnóstico de falla simulada en PC. Reemplazo de componente. Informe técnico de mantenimiento.

---

# SEGUNDO BIMESTRE (9 semanas — 13 de abril a 19 de junio de 2026)
**Objetivo general del bimestre:** Algoritmos de ordenamiento (burbuja, inserción, selección, quicksort) y búsqueda (lineal, binaria). SQL DML (INSERT, SELECT, UPDATE, DELETE). Conexión Python + BD con sqlite3/mysql-connector. Configuración de red LAN.

---

## SEMANAS 10-11 — Algoritmos de ordenamiento + SQL DML (INSERT/SELECT) + Módulos Python + Redes LAN

### Algorítmica (8 h)
**Contenido:** Algoritmos de ordenamiento: burbuja (Bubble Sort), inserción (Insertion Sort), selección (Selection Sort). Implementación en pseudocódigo. Trazabilidad paso a paso. Análisis de complejidad intuitivo: número de comparaciones e intercambios. Casos mejor, peor y promedio.
**Actividades:** Implementación manual de cada algoritmo en pseudocódigo. Trazabilidad con arreglos de 8-10 elementos. Comparación visual del rendimiento. Identificación de cuándo cada algoritmo es más eficiente.

### Gabinete Lab. (9 h)
**Contenido:** SQL DML (Data Manipulation Language): `INSERT INTO`, `SELECT` con `WHERE`, `ORDER BY`, `LIMIT`. Operadores de comparación: `=`, `<>`, `<`, `>`, `<=`, `>=`. Operadores lógicos: `AND`, `OR`, `NOT`. `LIKE` para búsqueda de patrones.
**Actividades:** Inserción de datos en las tablas de la biblioteca. Consultas SELECT con filtros: libros de un autor, libros publicados después de cierto año, préstamos activos. Ordenamiento de resultados.

### Gabinete Software (4.5 h)
**Contenido:** Módulos y paquetes en Python: `import`, `from...import`, `import...as`. Creación de módulos propios. Estructura de paquetes con `__init__.py`. Módulo `os` para operaciones de sistema de archivos.
**Actividades:** Creación de un paquete `mi_biblioteca` con módulos: `modelos.py` (clases), `utilidades.py` (funciones auxiliares), `principal.py` (programa principal). Importación cruzada entre módulos.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Configuración práctica de red LAN: asignación de IPs estáticas, máscara de subred, puerta de enlace. Pruebas de conectividad: `ping`, `tracert`, `ipconfig /all`. Compartir archivos en red Windows. Mapa de red con herramientas (Advanced IP Scanner o Fing).
**Actividades:** Configuración de red LAN entre 4-5 PCs del aula. Asignación de IPs en rango 192.168.1.x. Pruebas de conectividad. Compartir una carpeta en red y acceder desde otra PC. Elaboración de mapa de red.

---

## SEMANAS 12-13 — Algoritmos de búsqueda + SQL agregaciones + Conexión Python-BD + Router SOHO

### Algorítmica (8 h)
**Contenido:** Algoritmos de búsqueda: búsqueda lineal (O(n)), búsqueda binaria (O(log n)). Requisito de datos ordenados para búsqueda binaria. Implementación en pseudocódigo. Análisis comparativo: ¿cuándo usar cada una?
**Actividades:** Implementación y trazabilidad de ambos algoritmos. Ejercicios de análisis: dado un arreglo de 1000 elementos, ¿cuántas comparaciones hace cada algoritmo en el peor caso? Ejercicio integrador: ordenar un arreglo y luego buscar un elemento.

### Gabinete Lab. (9 h)
**Contenido:** SQL agregaciones: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`. `GROUP BY` y `HAVING`. Subconsultas básicas. `JOIN`: `INNER JOIN`, `LEFT JOIN`. Diferencia entre JOIN y subconsulta.
**Actividades:** Consultas con agregaciones: cantidad de libros por autor, promedio de duración de préstamos, autor con más libros. JOINs: lista de préstamos con nombre del socio y título del libro. Subconsultas: libros del autor que tiene más publicaciones.

### Gabinete Software (4.5 h)
**Contenido:** Conexión Python + Base de datos con `sqlite3` (módulo estándar) o `mysql-connector-python`. Operaciones CRUD desde Python: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Uso de cursores. Protección contra inyección SQL (parámetros).
**Actividades:** Creación de un script Python que se conecte a la BD de la biblioteca. Funciones para: agregar libro, buscar libro por título, listar todos los préstamos, actualizar estado de un préstamo. Manejo de errores con try/except.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Configuración de router SOHO: acceso al panel de administración (192.168.1.1 o 192.168.0.1), cambio de contraseña del router, configuración de red WiFi (SSID, contraseña WPA2/WPA3, canal), DHCP: rango de IPs, lease time. Port forwarding básico.
**Actividades:** Acceso al panel de administración del router del aula (o simulación con software). Configuración de WiFi. Establecimiento de rango DHCP. Cambio de contraseña. Documentación de la configuración.

---

## SEMANAS 14-15 — QuickSort + SQL avanzado + Mini-proyecto BD + Seguridad de red

### Algorítmica (8 h)
**Contenido:** Algoritmo QuickSort: concepto de pivote, partición, recursión. Complejidad: O(n log n) promedio, O(n²) peor caso. Comparación con los algoritmos básicos. Introducción al concepto de algoritmos recursivos.
**Actividades:** Trazabilidad de QuickSort con arreglos pequeños. Implementación en pseudocódigo. Comparación visual del rendimiento de los 4 algoritmos vistos (burbuja, inserción, selección, quicksort).

### Gabinete Lab. (9 h)
**Contenido:** SQL avanzado: vistas (`CREATE VIEW`), índices (`CREATE INDEX`), transacciones básicas (`BEGIN`, `COMMIT`, `ROLLBACK`). Diseño de base de datos para un caso nuevo. Normalización: 1FN, 2FN, 3FN (introducción práctica).
**Actividades:** Creación de vistas para consultas frecuentes. Análisis de normalización: dada una tabla no normalizada, descomponerla en tablas normalizadas. Ejercicio: tabla de facturas con datos redundantes → descomposición en Facturas + Clientes + Productos.

### Gabinete Software (4.5 h)
**Contenido:** Mini-proyecto: sistema de gestión con interfaz de consola que use la BD. Menú con opciones CRUD. Manejo de errores de conexión y consultas. Formateo de salida de datos (tablas en consola).
**Actividades:** Desarrollo del sistema de gestión de biblioteca con menú: (1) Agregar libro, (2) Buscar libro, (3) Listar todos, (4) Registrar préstamo, (5) Devolver libro, (6) Ver préstamos activos, (7) Salir.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Seguridad de red: firewall de Windows (reglas de entrada/salida), filtrado MAC en router, segmentación básica (red de invitados vs red interna). Concepto de DMZ. Monitoreo de tráfico básico.
**Actividades:** Configuración de reglas en el firewall de Windows: bloquear un puerto, permitir una aplicación. Filtrado MAC en el router. Creación de red de invitados. Análisis de conexiones activas con `netstat`.

---

## SEMANA 16 — Evaluación bimestral integradora

### Algorítmica (4 h)
**Evaluación escrita:** Algoritmos de ordenamiento y búsqueda. Análisis de complejidad. Trazabilidad de algoritmos recursivos.

### Gabinete Lab. (4.5 h)
**Entrega de proyecto:** Base de datos normalizada con SQL DDL + DML. Sistema de gestión con CRUD completo desde Python. Vistas e índices.

### Gabinete Software (2.25 h)
**Evaluación práctica:** Implementación de algoritmos de ordenamiento en Python. Conexión a BD y ejecución de consultas.

### Gabinete Hardware/Redes (2.25 h)
**Evaluación práctica:** Configuración completa de red LAN con router, firewall y seguridad. Informe técnico.

---

# TERCER BIMESTRE (9 semanas — 6 de julio a 11 de septiembre de 2026)
**Objetivo general del bimestre:** Estructuras de datos (pilas, colas, listas enlazadas). SQL con conexión a interfaz web (Flask básico). Mantenimiento correctivo avanzado. Preparación del proyecto integrador.

---

## SEMANAS 17-18 — Pilas y colas + Flask introductorio + Estructuras en Python + Diagnóstico avanzado

### Algorítmica (8 h)
**Contenido:** Estructuras de datos abstractas: pila (LIFO), cola (FIFO). Operaciones: push, pop, peek (pila); enqueue, dequeue, front (cola). Aplicaciones: pila = historial del navegador, deshacer; cola = impresora, atención al cliente. Listas enlazadas: concepto, nodo, puntero, ventajas vs arreglos.
**Actividades:** Implementación de pila y cola en pseudocódigo. Simulación manual de operaciones. Ejercicios de aplicación: invertir una cadena usando pila, simulación de cola de atención. Diagramas de listas enlazadas.

### Gabinete Lab. (9 h)
**Contenido:** Introducción a Flask (framework web Python): instalación (`pip install flask`), estructura básica de una app, rutas (`@app.route`), plantillas HTML con Jinja2. Servidor de desarrollo. Primera página web servida desde Python.
**Actividades:** Instalación de Flask. Creación de "Hola mundo" web. Creación de rutas: `/`, `/libros`, `/autores`. Renderizado de plantillas HTML. Paso de datos desde Python a HTML.

### Gabinete Software (4.5 h)
**Contenido:** Implementación de pilas y colas en Python usando listas. Clase `Pila` con métodos `push()`, `pop()`, `peek()`, `esta_vacia()`. Clase `Cola` con `encolar()`, `desencolar()`, `frente()`. Introducción a listas enlazadas: clase `Nodo`, clase `ListaEnlazada`.
**Actividades:** Implementación y pruebas de `Pila` y `Cola`. Ejercicio: verificador de paréntesis balanceados usando pila. Simulación de cola de impresión. Implementación básica de lista enlazada con inserción al inicio y al final.

### Gabinete Hardware (4.5 h)
**Contenido:** Diagnóstico avanzado: pantallazos azules (BSOD): lectura de códigos de error, análisis de minidumps. Herramientas: Event Viewer de Windows, Reliability Monitor. Diagnóstico de RAM con Windows Memory Diagnostic o MemTest86.
**Actividades:** Análisis de capturas de BSOD. Identificación del código de error. Uso de Event Viewer para encontrar errores. Ejecución de diagnóstico de memoria RAM. Interpretación de resultados.

---

## SEMANAS 19-20 — Listas enlazadas + Flask + BD + Testing básico + Reparación de software

### Algorítmica (8 h)
**Contenido:** Listas enlazadas: inserción al inicio, al final, en posición. Eliminación de nodo. Búsqueda en lista enlazada. Comparación de eficiencia con arreglos: inserción O(1) vs O(n), acceso O(n) vs O(1). Listas doblemente enlazadas (concepto).
**Actividades:** Trazabilidad de operaciones en listas enlazadas con diagramas. Implementación en pseudocódigo. Análisis comparativo de eficiencia. Ejercicio: implementar una lista enlazada como base de una cola.

### Gabinete Lab. (9 h)
**Contenido:** Conexión Flask + SQLite/MySQL: consultas SQL desde rutas Flask. Formularios HTML con método POST. Recepción de datos en Flask con `request.form`. Inserción de datos en la BD desde un formulario web.
**Actividades:** Creación de formulario web para agregar libros a la BD. Listado de libros desde la BD renderizado en HTML. Búsqueda de libros por título. Página de detalle de un libro.

### Gabinete Software (4.5 h)
**Contenido:** Testing básico en Python: módulo `unittest`. Creación de casos de prueba. Assertions: `assertEqual`, `assertTrue`, `assertRaises`. Test-Driven Development (TDD) simplificado: escribir test primero, luego código.
**Actividades:** Escritura de tests para las clases `Pila`, `Cola` y `ListaEnlazada`. Ejecución de tests con `python -m unittest`. Identificación de bugs mediante tests fallidos. Corrección y re-ejecución.

### Gabinete Hardware (4.5 h)
**Contenido:** Reparación de software: reparación de inicio de Windows (recuperación, modo seguro, restauración del sistema). Reinstalación limpia vs reparación in-place. Herramientas: SFC (`sfc /scannow`), DISM, CHKDSK.
**Actividades:** Ejecución de `sfc /scannow` en las PCs del aula. Análisis de resultados. Uso de CHKDSK para verificar disco. Procedimiento de restauración del sistema. Documentación.

---

## SEMANAS 21-22 — Árboles binarios (introducción) + Flask avanzado + Decoradores y generadores + Montaje de red

### Algorítmica (8 h)
**Contenido:** Introducción a árboles: concepto, nodo raíz, hojas, profundidad, nivel. Árboles binarios: cada nodo tiene máximo 2 hijos. Árboles binarios de búsqueda (BST): propiedad de orden. Recorridos: inorden, preorden, postorden. Aplicaciones: BST para búsqueda eficiente O(log n).
**Actividades:** Construcción manual de BST insertando valores. Recorridos paso a paso. Implementación de nodo de árbol en pseudocódigo. Ejercicio: dado un BST, encontrar el mínimo, el máximo y buscar un valor.

### Gabinete Lab. (9 h)
**Contenido:** Flask avanzado: sesiones (`session`), autenticación básica de usuarios (login/logout), protección de rutas con decorador. Archivos estáticos (CSS, JS, imágenes). Estructura de proyecto Flask profesional.
**Actividades:** Implementación de sistema de login simple. Protección de rutas: solo usuarios autenticados pueden agregar libros. Agregado de CSS y JavaScript estáticos. Mejora del diseño visual.

### Gabinete Software (4.5 h)
**Contenido:** Decoradores en Python: concepto, sintaxis `@decorador`, funciones como argumentos. Generadores: `yield`, iteración perezosa. Context managers: `with`, método `__enter__` y `__exit__`.
**Actividades:** Creación de decorador `@log_execution` que imprima el nombre de la función y sus argumentos cada vez que se llama. Generador que produce la secuencia de Fibonacci. Context manager personalizado para manejo de archivos con logging.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Montaje de red LAN completa: planificación (cantidad de PCs, switch, router, cableado), instalación física (cable UTP, conectores RJ-45, crimping), configuración lógica (IPs, DNS, DHCP), pruebas de conectividad.
**Actividades:** Montaje de una red LAN entre 4 PCs con switch. Ponchado de cable UTP (norma T568B). Configuración de IPs. Pruebas de ping entre todas las PCs. Prueba de acceso a internet. Documentación de la red montada.

---

## SEMANA 23 — Evaluación bimestral integradora

### Algorítmica (4 h)
**Evaluación escrita:** Estructuras de datos (pilas, colas, listas enlazadas, árboles binarios). Recorridos. Análisis de complejidad.

### Gabinete Lab. (4.5 h)
**Entrega de proyecto:** Aplicación web Flask con BD, formularios, autenticación y CRUD completo. Diseño responsive.

### Gabinete Software (2.25 h)
**Evaluación práctica:** Implementación de estructuras de datos con tests unitarios. Uso de decoradores y generadores.

### Gabinete Hardware/Redes (2.25 h)
**Evaluación práctica:** Montaje y configuración de red LAN completa. Ponchado de cable. Informe técnico.

---

# CUARTO BIMESTRE (11 semanas — 14 de septiembre a 13 de noviembre de 2026)
**Objetivo general del bimestre:** Proyecto integrador: aplicación web CRUD con Flask + BD. Documentación técnica. Git y GitHub. Evaluación final. Preparación para 3.° BTI.

---

## SEMANAS 24-25 — Introducción a Git/GitHub + Planificación del proyecto + Evaluación hardware + Repaso algoritmos

### Algorítmica (8 h)
**Contenido:** Repaso integrador de algoritmos del año: POO, ordenamiento, búsqueda, estructuras de datos. Resolución de problemas complejos que combinen múltiples conceptos. Preparación para el proyecto final.
**Actividades:** Ejercicios integradores: sistema de gestión con POO + ordenamiento + búsqueda. Análisis de casos: ¿qué estructura de datos usar para cada problema? Simulacros de evaluación.

### Gabinete Lab. (9 h)
**Contenido:** Planificación del proyecto integrador: definición de alcance, requerimientos funcionales, modelo E-R de la BD, wireframes de las pantallas web. Selección del caso: sistema de inventario, sistema escolar, sistema de reservas, blog personal.
**Actividades:** Trabajo en equipos de 2-3. Redacción de documento de requerimientos. Diseño del modelo E-R. Wireframes en papel o herramienta (Figma/excalidraw). Aprobación del docente.

### Gabinete Software (4.5 h)
**Contenido:** Introducción a Git y GitHub: conceptos de control de versiones (repositorio, commit, push, pull, branch, merge). Instalación de Git. Creación de cuenta GitHub. Comandos básicos: `git init`, `git add`, `git commit`, `git push`, `git pull`. Archivo `.gitignore`.
**Actividades:** Creación de repositorio local. Primer commit. Subida a GitHub. Creación de ramas. Merge simple. Flujo de trabajo básico.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Evaluación integradora de Hardware y Redes. Repaso de todos los temas: mantenimiento preventivo/correctivo, diagnóstico, redes, seguridad.
**Actividades:** Evaluación práctica: diagnóstico de PC con falla, configuración de red LAN con seguridad, informe técnico completo.

---

## SEMANAS 26-28 — Desarrollo del proyecto integrador

### Algorítmica (8 h)
**Contenido:** Soporte algorítmico al proyecto: implementación de ordenamiento y búsqueda en los datos del proyecto. Optimización de consultas. Lógica de negocio con POO.
**Actividades:** Implementación de clases del modelo de dominio del proyecto. Métodos de búsqueda y ordenamiento aplicados a los datos reales del proyecto.

### Gabinete Lab. (9 h)
**Contenido:** Desarrollo del backend y frontend del proyecto: creación de BD con SQL DDL, implementación de CRUD con Flask, diseño de plantillas HTML con CSS responsive. Integración completa.
**Actividades:** Sprints semanales:
- Sprint 1: BD + modelos Python + rutas básicas.
- Sprint 2: Formularios + inserción/edición + validación.
- Sprint 3: Búsqueda + ordenamiento + autenticación + diseño final.

### Gabinete Software (4.5 h)
**Contenido:** Subida del proyecto a GitHub. Documentación del código con docstrings y comentarios. README con instrucciones de instalación, uso y capturas de pantalla.
**Actividades:** Commits regulares al repositorio. Escritura de README profesional. Documentación de cada módulo.

### Gabinete Hardware/Redes (4.5 h)
**Contenido:** Elaboración del informe técnico final del año: documentación de todas las prácticas de hardware y redes realizadas durante el año. Inventario del laboratorio.
**Actividades:** Redacción del informe técnico. Actualización del inventario del laboratorio. Recomendaciones de mantenimiento y mejora.

---

## SEMANAS 29-30 — Finalización y documentación del proyecto

### Todas las disciplinas (16 h/semana)
**Contenido:** Finalización del proyecto integrador. Testing completo (funcional, de usabilidad). Documentación técnica y manual de usuario. Preparación de la presentación oral. Subida final a GitHub.

### Actividades clave
- Depuración intensiva: pruebas de usuario con compañeros.
- Escritura del manual de usuario (mínimo 3 páginas con capturas).
- Escritura de la documentación técnica (arquitectura, modelo E-R, API de rutas).
- Ensayo de la presentación oral (5-7 minutos por equipo).
- Commit final y tag de versión en GitHub.

---

## SEMANAS 31-33 — Presentaciones del proyecto integrador

### Todas las disciplinas (16 h/semana)

**Formato de presentación (por equipo, 10 minutos):**
1. Presentación del problema y la solución (2 min).
2. Demostración en vivo de la aplicación web (3 min).
3. Explicación de la arquitectura: modelo E-R, clases POO, estructura Flask (3 min).
4. Preguntas del tribunal (docente + coordinador + compañeros) (2 min).

**Rúbrica de evaluación del proyecto integrador:**

| Criterio | Excelente (10) | Bueno (7-9) | Suficiente (5-6) | Insuficiente (<5) |
|---|---|---|---|---|
| Funcionalidad CRUD | Todas las operaciones funcionan sin errores. | Funcionan con errores menores. | Funciona parcialmente. | No funciona. |
| Modelo de BD | Normalizado, con PKs, FKs e integridad. | Normalizado, pocos errores. | Estructura básica, sin normalizar. | Sin BD o estructura incorrecta. |
| Código Python (POO) | Clases bien diseñadas, encapsulamiento, herencia. | Clases funcionales, poco encapsulamiento. | Código estructurado, sin POO. | Código desorganizado. |
| Interfaz web | Responsive, intuitiva, con CSS profesional. | Funcional, diseño básico. | Funcional mínima, sin diseño. | Sin interfaz o no funcional. |
| Documentación | README completo, manual de usuario, capturas, código comentado. | Documentación básica. | Documentación incompleta. | Sin documentación. |
| Git/GitHub | Commits regulares, README, estructura profesional. | Commits presentes, README básico. | Pocos commits. | Sin repositorio. |
| Presentación oral | Clara, fluida, responde preguntas con dominio. | Clara, funcional. | Básica, dificultades. | No presenta. |
| Declaración de IA | Presente si se usó IA, con auditoría de resultados. | Presente pero incompleta. | No aplica o ausente. | Uso no declarado. |

---

## SEMANA 34 — Portafolio técnico y retrospectiva

### Todas las disciplinas (16 h)
**Contenido:** Compilación del portafolio técnico del año: todos los proyectos, ejercicios y evaluaciones organizados en GitHub y Google Drive. Retrospectiva del aprendizaje: reflexión escrita sobre el progreso desde 1.° BTI.
**Actividades:**
- Actualización de GitHub con todos los repositorios del año.
- Escritura de documento de retrospectiva: "¿Qué sabía en febrero? ¿Qué sé ahora? ¿Cuál fue mi mayor desafío? ¿Cómo lo superé?".
- Preparación del portafolio para la presentación ante la coordinación.

---

## SEMANA 35 — Evaluación final de Algorítmica

### Algorítmica (4 h)
**Evaluación escrita integradora:** POO (clases, herencia, polimorfismo), algoritmos de ordenamiento y búsqueda, estructuras de datos (pilas, colas, listas enlazadas, árboles), análisis de complejidad, resolución de problemas.

---

## SEMANA 36 — Evaluación final de Gabinete

### Gabinete (12 h)
**Evaluación práctica integradora:**
- Lab. BB.DD.: diseño de modelo E-R + script SQL completo + consultas avanzadas.
- Software: implementación de sistema POO con conexión a BD y tests.
- Hardware/Redes: montaje de red LAN + configuración de seguridad + informe técnico.

---

## SEMANA 37 — Orientación para 3.° BTI

### Todas las disciplinas (16 h)
**Contenido:** Presentación de los contenidos de 3.° BTI: estructuras de datos avanzadas, APIs e integración con IA, proyecto de egreso, configuración de servidor. Reflexión sobre la trayectoria: de 1.° a 2.° BTI.
**Actividades:**
- Lectura guiada del Plan Anual de 3.° BTI.
- Identificación de las competencias que aún necesitan fortalecerse.
- Plan personal de preparación para 3.° BTI.
- Simulación de defensa de proyecto (práctica para el proyecto de egreso de 3.°).

---

## SEMANA 38 — Cierre del año

### Todas las disciplinas (16 h)
**Contenido:** Entrega de portafolios. Entrega de diplomas de aprobación de 2.° BTI. Celebración del logro.
**Actividades:**
- Entrega formal del portafolio técnico a la coordinación.
- Entrega de diploma "Aprobación de 2.° BTI — Programador Backend y Administrador de BD".
- Palabras de cierre del docente y la coordinación.
- Limpieza y organización final del laboratorio.

---

# RESUMEN ANUAL — 2.° BTI

| Bimestre | Semanas | Algorítmica | Gabinete Lab. (BB.DD.) | Gabinete Software | Gabinete Hardware/Redes |
|---|---|---|---|---|---|
| **1.° Bim** | 1-9 | POO: clases, objetos, encapsulamiento, herencia, polimorfismo, composición. | Modelo E-R: entidades, atributos, relaciones, cardinalidad, PK, FK. SQL DDL. | Clases, métodos, herencia, polimorfismo, módulos en Python. | Mantenimiento correctivo: diagnóstico, beep codes, reemplazo de componentes (fuente, RAM, disco). |
| **2.° Bim** | 10-16 | Ordenamiento (burbuja, inserción, selección, quicksort). Búsqueda (lineal, binaria). Análisis de complejidad. | SQL DML: INSERT, SELECT, JOIN, GROUP BY, subconsultas. Vistas, índices, normalización. | Conexión Python + BD (CRUD). Módulos y paquetes. Mini-proyecto. | Configuración de red LAN, router SOHO, firewall, seguridad de red. |
| **3.° Bim** | 17-23 | Pilas, colas, listas enlazadas, árboles binarios (BST). Recorridos. | Flask: rutas, plantillas, formularios, conexión con BD, autenticación. | Implementación de estructuras de datos. Testing con unittest. Decoradores, generadores. | Diagnóstico avanzado (BSOD, RAM, SFC). Montaje de red LAN física. |
| **4.° Bim** | 24-38 | Repaso integrador. Soporte algorítmico al proyecto. Evaluación final. | Proyecto integrador: aplicación web Flask + BD + CRUD + documentación. | Git/GitHub. Documentación. Testing final. | Informe técnico final. Evaluación integradora. Inventario de laboratorio. |

---

# ARTICULACIÓN VERTICAL

## Lo que 2.° BTI recibe de 1.° BTI
1. Fundamentos de lógica simbólica y teoría de conjuntos.
2. Estructuras de control en Python (condicionales, bucles, funciones).
3. HTML5, CSS3, JavaScript básico.
4. Componentes del PC, ensamblaje, SO, redes básicas.
5. Introducción a POO.

## Lo que 2.° BTI entrega a 3.° BTI
1. POO sólida: clases, herencia, polimorfismo, composición.
2. Bases de datos relacionales: modelado E-R, SQL, normalización.
3. Desarrollo web backend: Flask, formularios, autenticación.
4. Estructuras de datos: pilas, colas, listas enlazadas, árboles.
5. Algoritmos de ordenamiento y búsqueda con análisis de complejidad.
6. Control de versiones: Git/GitHub.
7. Mantenimiento correctivo y montaje de redes LAN.
8. Capacidad de desarrollar y documentar una aplicación web completa con BD.

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