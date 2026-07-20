# Planificador de Preparacion

Aplicacion web para crear eventos y calcular una linea de tiempo de preparacion con dependencias, almacenada en base de datos SQLite.

## Funcionalidades

- Creacion de plantillas editables para procedimientos recurrentes.
- Creacion de eventos con parametros propios o reutilizando una plantilla.
- Calculo automatico hacia atras desde la fecha del evento.
- Almacenamiento persistente de eventos y tareas en `planner.db` (SQLite).
- Ajuste por dias no laborables:
  - fines de semana (sabado y domingo)
  - feriados adicionales definidos por el usuario
- Visualizacion del cronograma con dependencias.
- Agenda integrada por dia y calendario descendente de procesos.

## Uso

1. Ejecuta el servidor:
   - `node server.mjs`
2. Abre en navegador:
   - `http://localhost:3000`
3. Guarda una plantilla (opcional).
4. Crea un evento y pulsa **Guardar evento y cronograma**.
5. Revisa la linea de tiempo calculada y las vistas integradas.

## Ejemplo rapido

Si el evento es el `2026-05-05` y la preparacion requiere `72` horas:

- La app convierte horas a dias laborables (`72h -> 3 dias`).
- Luego resta, en este orden:
  - tiempo para profesores
  - revision de coordinacion
  - control de calidad
  - preparacion
- Cada resta evita dias no laborables.
