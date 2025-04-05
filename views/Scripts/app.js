// Archivo principal de la aplicación
import { setUserInitial } from './auth/authUI.js';
import { login, register, togglePasswordVisibility } from './auth/auth.js';
import { setupThemeToggle } from './ui/theme.js';
import { initializeSearch } from './ui/search.js';
import { setupFilters } from './ui/filters.js';
import { setupNoteModal } from './notes/noteModal.js';
import { loadNotes } from './notes/noteUI.js';

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');

    // Si estamos en una página de autenticación y hay token, redirigir al index
    if (isAuthPage && token) {
        window.location.href = '/index.html';
        return;
    }

    // Si NO estamos en una página de autenticación y NO hay token, redirigir al login
    if (!isAuthPage && !token) {
        window.location.href = '/login.html';
        return;
    }

    // Inicializar formularios de autenticación si estamos en páginas de auth
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }

    // Inicializar los botones de toggle password
    if (isAuthPage) {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', togglePasswordVisibility);
        });
    }

    // Cargar notas solo si estamos en la página principal
    if (!isAuthPage) {
        initializeUI();
    }
});

// Inicializar elementos de la UI
function initializeUI() {
    // Configurar el avatar del usuario con la inicial
    setUserInitial();
    
    // Configurar el botón de tema
    setupThemeToggle();
    
    // Configurar el modal de notas
    setupNoteModal();
    
    // Inicializar la barra de búsqueda
    initializeSearch();
    
    // Inicializar los filtros
    setupFilters();
    
    // Cargar las notas
    loadNotes();
}

// Función para mostrar/ocultar el menú desplegable
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = this.querySelector('.dropdown-menu');
    dropdown.classList.toggle('active');
}

// Funciones de utilidad
const handleApiResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la operación');
    }
    return data;
};

const handleApiError = (error) => {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = error.message || 'Error al conectar con el servidor';
        errorElement.style.display = 'block';
    } else {
        alert(error.message || 'Error al conectar con el servidor');
    }
};

// Función auxiliar para hacer peticiones autenticadas
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        return;
    }

    return response;
}

// Funciones de notas
async function createNote() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const isPinned = document.getElementById('isPinned').checked;
    const date = new Date();

    try {
        await fetchWithAuth('/api/notes', {
            method: 'POST',
            body: JSON.stringify({ 
                title, 
                description, 
                tags, 
                isPinned,
                date 
            })
        }).then(handleApiResponse);

        clearForm();
        loadNotes();
        
        // Cerrar el modal después de crear la nota
        const noteModal = document.getElementById('noteModal');
        if (noteModal) {
            noteModal.classList.remove('active');
        }
    } catch (error) {
        handleApiError(error);
    }
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('isPinned').checked = false;
}

let currentEditNoteId = null;

// Función para editar una nota
function editNote(noteId) {
    currentEditNoteId = noteId;
    
    // Obtener la nota del DOM
    const noteElement = document.querySelector(`.note[data-id="${noteId}"]`);
    if (!noteElement) return;
    
    const title = noteElement.querySelector('.note-title').textContent;
    const description = noteElement.querySelector('p').textContent;
    
    // Obtener las etiquetas (si existen)
    let tags = [];
    const tagsElement = noteElement.querySelector('small');
    if (tagsElement && tagsElement.textContent.trim()) {
        tags = tagsElement.textContent.split(',').map(tag => tag.trim());
    }
    
    // Verificar si la nota está fijada
    const isPinned = noteElement.classList.contains('pinned');
    
    // Llenar el formulario con los datos de la nota
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('tags').value = tags.join(', ');
    document.getElementById('isPinned').checked = isPinned;
    
    // Abrir el modal
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
        noteModal.classList.add('active');
    }
    
    // Cambiar el título del modal
    const modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Editar Nota';
    }
    
    // Cambiar el botón de guardar por uno de actualizar
    const saveButton = document.querySelector('.note-form .btn-primary');
    if (saveButton) {
        saveButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Nota';
        saveButton.onclick = updateNote;
    }
}

async function updateNote() {
    if (!currentEditNoteId) return;

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const isPinned = document.getElementById('isPinned').checked;

    try {
        await fetchWithAuth(`/api/notes/${currentEditNoteId}`, {
            method: 'PUT',
            body: JSON.stringify({ 
                title, 
                description, 
                tags, 
                isPinned 
            })
        }).then(handleApiResponse);

        // Cerrar el modal
        const noteModal = document.getElementById('noteModal');
        if (noteModal) {
            noteModal.classList.remove('active');
        }
        
        // Resetear el formulario y el modo
        clearForm();
        resetFormToCreateMode();
        
        // Recargar las notas
        loadNotes();
    } catch (error) {
        handleApiError(error);
    }
}

async function deleteNote(noteId) {
    try {
        await fetchWithAuth(`/api/notes/${noteId}`, {
            method: 'DELETE'
        }).then(handleApiResponse);

        loadNotes();
    } catch (error) {
        handleApiError(error);
    }
}

// Función para resetear el formulario al modo de creación
function resetFormToCreateMode() {
    currentEditNoteId = null;
    
    // Cambiar el título del modal
    const modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Nueva Nota';
    }
    
    // Restaurar el botón de guardar
    const saveButton = document.querySelector('.note-form .btn-primary');
    if (saveButton) {
        saveButton.innerHTML = '<i class="fas fa-save"></i> Guardar Nota';
        saveButton.onclick = createNote;
    }
}

// Estado de los filtros
let filters = {
    pinned: false
};

function applyFiltersToNotes() {
    const notesList = document.getElementById('notesList');
    const notes = Array.from(notesList.children);

    notes.forEach(note => {
        const isPinned = note.getAttribute('data-pinned') === 'true';
        
        // Mostrar la nota solo si cumple con el filtro de fijadas
        note.style.display = !filters.pinned || isPinned ? 'block' : 'none';
    });
}