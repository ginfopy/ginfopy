/* ==========================================================================
   ESTADO GLOBAL DE LA APLICACIÓN
   ========================================================================== */
// Lista de tareas iniciales por defecto para que la app se vea espectacular desde el primer segundo
const DEFAULT_TASKS = [
    {
        id: "task-1",
        title: "Diseñar interfaz del Panel",
        description: "Crear wireframes de alta fidelidad en Figma para las vistas de estadísticas y configuración.",
        priority: "high",
        status: "inprogress",
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 días en el futuro
        tags: ["Diseño", "UI/UX", "Figma"]
    },
    {
        id: "task-2",
        title: "Escribir documentación técnica",
        description: "Documentar la API de autenticación y los flujos de base de datos para el equipo de desarrollo.",
        priority: "low",
        status: "todo",
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 días en el futuro
        tags: ["Doc", "Servidor"]
    },
    {
        id: "task-3",
        title: "Optimizar consultas de base de datos",
        description: "Revisar índices en PostgreSQL para reducir la latencia del inicio de sesión en peticiones recurrentes.",
        priority: "high",
        status: "inreview",
        dueDate: new Date().toISOString().split('T')[0], // Hoy
        tags: ["Base de Datos", "Rendimiento"]
    },
    {
        id: "task-4",
        title: "Configurar servidor de integración continua",
        description: "Escribir el archivo yaml de GitHub Actions para ejecutar pruebas unitarias automáticamente al subir código.",
        priority: "medium",
        status: "done",
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer (Vencida pero Completada)
        tags: ["Despliegue", "Automatización"]
    }
];

// Estado en memoria de la aplicación
let tasks = [];

/* ==========================================================================
   ELEMENTOS DEL DOM (CACHE)
   ========================================================================== */
const dom = {
    // Columnas del Tablero
    listTodo: document.getElementById('list-todo'),
    listInprogress: document.getElementById('list-inprogress'),
    listInreview: document.getElementById('list-inreview'),
    listDone: document.getElementById('list-done'),
    
    // Contadores de Columnas
    countTodo: document.getElementById('count-todo'),
    countInprogress: document.getElementById('count-inprogress'),
    countInreview: document.getElementById('count-inreview'),
    countDone: document.getElementById('count-done'),
    
    // Estadísticas del Sidebar
    totalTasksCount: document.getElementById('total-tasks-count'),
    highPriorityCount: document.getElementById('high-priority-count'),
    completedTasksCount: document.getElementById('completed-tasks-count'),
    
    // Buscador y Filtros
    searchInput: document.getElementById('search-input'),
    priorityFilter: document.getElementById('priority-filter'),
    
    // Modal y Formulario
    taskModal: document.getElementById('task-modal'),
    taskForm: document.getElementById('task-form'),
    modalTitle: document.getElementById('modal-title'),
    taskIdInput: document.getElementById('task-id'),
    titleInput: document.getElementById('task-title-input'),
    descInput: document.getElementById('task-desc-input'),
    priorityInput: document.getElementById('task-priority-input'),
    priorityDisplay: document.getElementById('priority-value-display'),
    dateInput: document.getElementById('task-date-input'),
    tagsInput: document.getElementById('task-tags-input'),
    
    // Botones de acción del Modal
    btnNewTask: document.getElementById('btn-new-task'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancelModal: document.getElementById('btn-cancel-modal')
};

/* ==========================================================================
   PERSISTENCIA Y GESTIÓN DE DATOS (LOCALSTORAGE)
   ========================================================================== */
// Guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem('flujokanban_tasks', JSON.stringify(tasks));
    updateStats();
}

// Cargar tareas desde localStorage o usar las de defecto
function loadTasks() {
    const saved = localStorage.getItem('flujokanban_tasks');
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch (e) {
            console.error("Error al leer tareas guardadas, restaurando por defecto", e);
            tasks = [...DEFAULT_TASKS];
        }
    } else {
        tasks = [...DEFAULT_TASKS];
        saveTasks();
    }
}

// Calcular y actualizar estadísticas en el Sidebar
function updateStats() {
    const total = tasks.length;
    const high = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
    const completed = tasks.filter(t => t.status === 'done').length;

    dom.totalTasksCount.textContent = total;
    dom.highPriorityCount.textContent = high;
    dom.completedTasksCount.textContent = completed;
}

/* ==========================================================================
   RENDERIZADO DINÁMICO DEL TABLERO
   ========================================================================== */
function renderBoard() {
    // 1. Limpiamos todas las listas del DOM
    dom.listTodo.innerHTML = '';
    dom.listInprogress.innerHTML = '';
    dom.listInreview.innerHTML = '';
    dom.listDone.innerHTML = '';

    // Contadores temporales para cada columna
    const columnCounts = { todo: 0, inprogress: 0, inreview: 0, done: 0 };
    
    // Obtener filtros actuales
    const searchQuery = dom.searchInput.value.toLowerCase().trim();
    const selectedPriority = dom.priorityFilter.value;

    // 2. Filtramos e insertamos las tareas correspondientes
    tasks.forEach(task => {
        // Filtro por texto (título o etiquetas)
        const matchesSearch = task.title.toLowerCase().includes(searchQuery) || 
                              task.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        
        // Filtro por prioridad
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

        if (matchesSearch && matchesPriority) {
            const cardEl = createTaskCardDOM(task);
            
            // Insertar tarjeta en su columna respectiva
            switch (task.status) {
                case 'todo':
                    dom.listTodo.appendChild(cardEl);
                    columnCounts.todo++;
                    break;
                case 'inprogress':
                    dom.listInprogress.appendChild(cardEl);
                    columnCounts.inprogress++;
                    break;
                case 'inreview':
                    dom.listInreview.appendChild(cardEl);
                    columnCounts.inreview++;
                    break;
                case 'done':
                    dom.listDone.appendChild(cardEl);
                    columnCounts.done++;
                    break;
            }
        }
    });

    // 3. Actualizamos los contadores visuales de las columnas en el DOM
    dom.countTodo.textContent = columnCounts.todo;
    dom.countInprogress.textContent = columnCounts.inprogress;
    dom.countInreview.textContent = columnCounts.inreview;
    dom.countDone.textContent = columnCounts.done;
}

// Crea los elementos del DOM de una tarjeta individual
function createTaskCardDOM(task) {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', task.id);

    // Formatear fecha límite
    let dateHTML = '';
    if (task.dueDate) {
        const todayStr = new Date().toISOString().split('T')[0];
        const isOverdue = task.dueDate < todayStr && task.status !== 'done';
        const dateObj = new Date(task.dueDate + 'T00:00:00'); // Evitamos problemas de zona horaria local
        
        const formattedDate = dateObj.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short' 
        });

        dateHTML = `
            <div class="card-due-date ${isOverdue ? 'date-overdue' : ''}">
                <span class="material-symbols-outlined">calendar_today</span>
                <span>${formattedDate}</span>
            </div>
        `;
    }

    // Renderizar tags (etiquetas)
    const tagsHTML = task.tags
        .filter(t => t.trim() !== '')
        .map(t => `<span class="tag">${escapeHTML(t)}</span>`)
        .join('');

    card.innerHTML = `
        <div class="card-header">
            <span class="card-priority priority-${task.priority}">
                ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
            </span>
            <button class="card-actions-btn" title="Editar tarea">
                <span class="material-symbols-outlined">edit</span>
            </button>
        </div>
        <h3>${escapeHTML(task.title)}</h3>
        <p>${escapeHTML(task.description || "Sin descripción")}</p>
        <div class="card-footer">
            <div class="card-tags">${tagsHTML}</div>
            ${dateHTML}
        </div>
    `;

    // EVENTOS DE LA TARJETA
    // Evento de Editar al hacer clic en el botón de edición
    const editBtn = card.querySelector('.card-actions-btn');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitamos efectos secundarios
        openEditModal(task);
    });

    // EVENTOS DRAG & DROP DE LA TARJETA
    card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        // Guardamos el ID de la tarjeta que se está arrastrando en la data de transferencia
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    return card;
}

/* ==========================================================================
   INTERACCIÓN CON EL MODAL (AÑADIR / EDITAR TAREAS)
   ========================================================================== */
// Actualiza el texto visual de la prioridad según el valor numérico (1, 2 o 3)
function updatePriorityDisplay(value) {
    const labels = {
        '1': 'Baja',
        '2': 'Media',
        '3': 'Alta'
    };
    const colors = {
        '1': 'var(--priority-low)',
        '2': 'var(--priority-medium)',
        '3': 'var(--priority-high)'
    };
    if (dom.priorityDisplay) {
        dom.priorityDisplay.textContent = labels[value] || 'Media';
        dom.priorityDisplay.style.color = colors[value] || 'var(--priority-medium)';
    }
}

function openNewTaskModal() {
    dom.modalTitle.textContent = "Crear Nueva Tarea";
    dom.taskIdInput.value = "";
    dom.taskForm.reset();
    
    // Ajustar valor por defecto del slider de prioridad y su texto
    dom.priorityInput.value = 2;
    updatePriorityDisplay(2);
    
    // Poner por defecto la fecha de hoy
    dom.dateInput.value = new Date().toISOString().split('T')[0];
    
    dom.taskModal.showModal();
}

function openEditModal(task) {
    dom.modalTitle.textContent = "Editar Tarea";
    dom.taskIdInput.value = task.id;
    dom.titleInput.value = task.title;
    dom.descInput.value = task.description;
    
    // Mapear prioridad string a número para el slider
    const priorityMap = { low: 1, medium: 2, high: 3 };
    const priorityVal = priorityMap[task.priority] || 2;
    dom.priorityInput.value = priorityVal;
    updatePriorityDisplay(priorityVal);
    
    dom.dateInput.value = task.dueDate || "";
    dom.tagsInput.value = task.tags.join(', ');
    
    dom.taskModal.showModal();
}

function closeModal() {
    dom.taskModal.close();
}

// Procesa el guardado del formulario (Creación o Edición)
function handleFormSubmit(e) {
    // Si cerramos el modal cancelando, no hacemos nada
    if (e.submitter && e.submitter.id === 'btn-cancel-modal') return;

    const id = dom.taskIdInput.value;
    const title = dom.titleInput.value.trim();
    const description = dom.descInput.value.trim();
    
    // Mapear prioridad numérica del slider a string para el estado
    const reversePriorityMap = { '1': 'low', '2': 'medium', '3': 'high' };
    const priority = reversePriorityMap[dom.priorityInput.value] || 'medium';
    const dueDate = dom.dateInput.value;
    
    // Convertir etiquetas separadas por comas en array limpio
    const tags = dom.tagsInput.value
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

    if (!title) return;

    if (id) {
        // MODO EDICIÓN: Buscar y actualizar tarea
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { 
                ...tasks[index], 
                title, 
                description, 
                priority, 
                dueDate, 
                tags 
            };
        }
    } else {
        // MODO CREACIÓN: Agregar nueva tarea
        const newTask = {
            id: `task-${Date.now()}`,
            title,
            description,
            priority,
            status: 'todo', // Nueva tarea siempre inicia en "Por Hacer"
            dueDate,
            tags
        };
        tasks.push(newTask);
    }

    saveTasks();
    renderBoard();
}

/* ==========================================================================
   CONFIGURACIÓN DRAG & DROP EN COLUMNAS
   ========================================================================== */
function initDragAndDrop() {
    const listContainers = [dom.listTodo, dom.listInprogress, dom.listInreview, dom.listDone];

    listContainers.forEach(listContainer => {
        // Obtener el estado correspondiente de la columna (definido en el padre `section`)
        const columnStatus = listContainer.parentElement.getAttribute('data-status');

        // dragover: Ocurre cuando arrastramos un elemento sobre una columna válida
        listContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); // Esencial para permitir que se pueda soltar
            e.dataTransfer.dropEffect = 'move';
            listContainer.classList.add('drag-over');
        });

        // dragleave: Ocurre cuando el elemento arrastrado sale del área de la columna
        listContainer.addEventListener('dragleave', () => {
            listContainer.classList.remove('drag-over');
        });

        // drop: Ocurre cuando soltamos el elemento arrastrado en la columna
        listContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            listContainer.classList.remove('drag-over');

            const taskId = e.dataTransfer.getData('text/plain');
            const taskIndex = tasks.findIndex(t => t.id === taskId);

            if (taskIndex !== -1 && tasks[taskIndex].status !== columnStatus) {
                // Actualizar estado en memoria
                tasks[taskIndex].status = columnStatus;
                
                saveTasks();
                renderBoard();
            }
        });
    });
}

/* ==========================================================================
   IMPRESIÓN DE TAREAS POR COLUMNA
   ========================================================================== */
function printColumn(status) {
    const searchQuery = dom.searchInput.value.toLowerCase().trim();
    const selectedPriority = dom.priorityFilter.value;
    
    // Filtramos las tareas que pertenecen a esta columna y cumplen con los filtros actuales
    const columnTasks = tasks.filter(task => {
        if (task.status !== status) return false;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery) || 
                              task.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
        return matchesSearch && matchesPriority;
    });
    
    const columnTitles = {
        todo: 'Por Hacer',
        inprogress: 'En Progreso',
        inreview: 'En Revisión',
        done: 'Completado'
    };
    const title = columnTitles[status] || 'Tareas';
    
    // Generar documento HTML limpio y optimizado para impresión
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Tareas - ${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #111;
                background-color: #fff;
                margin: 40px;
                line-height: 1.5;
            }
            .header {
                border-bottom: 2px solid #333;
                padding-bottom: 12px;
                margin-bottom: 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
            .header .info {
                font-size: 13px;
                color: #555;
                text-align: right;
            }
            .task-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .task-card {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 18px;
                page-break-inside: avoid;
            }
            .task-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .task-title {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #0f172a;
            }
            .task-priority {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #cbd5e1;
            }
            .priority-high {
                background-color: #fef2f2;
                color: #991b1b;
                border-color: #fecaca;
            }
            .priority-medium {
                background-color: #fff7ed;
                color: #9a3412;
                border-color: #ffedd5;
            }
            .priority-low {
                background-color: #f0fdf4;
                color: #166534;
                border-color: #bbf7d0;
            }
            .task-desc {
                font-size: 13px;
                color: #334155;
                margin: 10px 0 14px 0;
                white-space: pre-wrap;
            }
            .task-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #64748b;
                border-top: 1px solid #f1f5f9;
                padding-top: 8px;
            }
            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            .tag {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 2px 6px;
                border-radius: 4px;
            }
            .no-tasks {
                text-align: center;
                color: #64748b;
                font-style: italic;
                padding: 40px;
                border: 2px dashed #cbd5e1;
                border-radius: 8px;
            }
            @media print {
                body { margin: 0; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1>Reporte de Tareas: ${title}</h1>
                <div style="font-size: 13px; margin-top: 4px; color: #64748b;">Generado desde Tablero FlujoKanban</div>
            </div>
            <div class="info">
                <div>Fecha de Reporte: ${new Date().toLocaleDateString('es-ES')}</div>
                <div>Tareas impresas: ${columnTasks.length}</div>
            </div>
        </div>
        
        <div class="task-list">
    `;
    
    if (columnTasks.length === 0) {
        htmlContent += `
            <div class="no-tasks">
                No hay tareas que mostrar en esta columna bajo los filtros de búsqueda actuales.
            </div>
        `;
    } else {
        columnTasks.forEach(task => {
            const priorityLabels = { high: 'Alta', medium: 'Media', low: 'Baja' };
            const tagsHTML = task.tags
                .map(t => `<span class="tag">${escapeHTML(t)}</span>`)
                .join(' ');
                
            let dateHTML = '';
            if (task.dueDate) {
                const dateObj = new Date(task.dueDate + 'T00:00:00');
                const formattedDate = dateObj.toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'long',
                    year: 'numeric'
                });
                dateHTML = `<span>Fecha Límite: ${formattedDate}</span>`;
            }
            
            htmlContent += `
                <div class="task-card">
                    <div class="task-card-header">
                        <h2 class="task-title">${escapeHTML(task.title)}</h2>
                        <span class="task-priority priority-${task.priority}">${priorityLabels[task.priority]}</span>
                    </div>
                    <div class="task-desc">${escapeHTML(task.description || 'Sin descripción')}</div>
                    <div class="task-footer">
                        <div class="tags">${tagsHTML}</div>
                        ${dateHTML}
                    </div>
                </div>
            `;
        });
    }
    
    htmlContent += `
        </div>
        <script>
            window.onload = function() {
                window.print();
                // Opcional: Cerrar la ventana tras finalizar la impresión
                window.onafterprint = function() {
                    window.close();
                };
            }
        </script>
    </body>
    </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    } else {
        alert("Por favor habilita las ventanas emergentes (pop-ups) en tu navegador para ver la vista de impresión.");
    }
}

/* ==========================================================================
   FUNCIONES AUXILIARES
   ========================================================================== */
// Escapa caracteres especiales de HTML para prevenir XSS al renderizar texto ingresado por el usuario
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos
    loadTasks();
    
    // 2. Renderizar inicial
    renderBoard();
    
    // 3. Activar funcionalidad de Drag & Drop
    initDragAndDrop();

    // 4. Asignar Event Listeners del Header/Buscador
    dom.searchInput.addEventListener('input', renderBoard);
    dom.priorityFilter.addEventListener('change', renderBoard);
    
    // 5. Asignar Event Listeners del Modal
    dom.btnNewTask.addEventListener('click', openNewTaskModal);
    dom.btnCloseModal.addEventListener('click', closeModal);
    dom.btnCancelModal.addEventListener('click', closeModal);
    dom.taskForm.addEventListener('submit', handleFormSubmit);

    // Actualizar visualizador de prioridad al arrastrar el slider
    dom.priorityInput.addEventListener('input', (e) => {
        updatePriorityDisplay(e.target.value);
    });

    // Asignar event listeners para imprimir tareas por columna
    document.querySelectorAll('.btn-print-column').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitamos gatillar dragstarts o eventos innecesarios
            const status = btn.getAttribute('data-status');
            printColumn(status);
        });
    });

    // Cerramos el modal si se hace clic fuera del contenido del diálogo
    dom.taskModal.addEventListener('click', (e) => {
        const dialogDimensions = dom.taskModal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dom.taskModal.close();
        }
    });
});
