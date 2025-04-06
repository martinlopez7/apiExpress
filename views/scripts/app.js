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