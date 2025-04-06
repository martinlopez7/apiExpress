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