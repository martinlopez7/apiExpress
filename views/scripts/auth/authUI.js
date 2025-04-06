// Funciones de UI relacionadas con la autenticación
import { decodeToken } from '../utils/tokenUtils.js';
import { logout } from './auth.js';

// Configurar el avatar del usuario con la inicial
export function setUserInitial() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró token en localStorage');
        return;
    }
    
    try {
        // Decodificar el token para obtener la información del usuario
        const payload = decodeToken(token);
        if (!payload) return;
        
        // Obtener el nombre de usuario del payload
        const username = payload.username || 'Usuario';
        
        // Obtener la inicial
        const initial = username.charAt(0).toUpperCase();
        
        // Establecer la inicial en el avatar
        const userInitialElement = document.getElementById('userInitial');
        if (userInitialElement) {
            userInitialElement.textContent = initial;
        } else {
            console.error('Elemento userInitial no encontrado en el DOM');
        }
        
        // Configurar el evento de clic para el avatar
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', toggleDropdown);
        }

        // Configurar el evento de clic para el botón de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    } catch (error) {
        console.error('Error al configurar el avatar del usuario:', error);
    }
}

// Función para mostrar/ocultar el menú desplegable
export function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = this.querySelector('.dropdown-menu');
    dropdown.classList.toggle('active');
}

// Inicializar formularios de autenticación
export function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm || registerForm) {
        // Inicializar los botones de toggle password
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', togglePasswordVisibility);
        });
    }
} 
