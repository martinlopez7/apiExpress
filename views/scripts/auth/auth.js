// Funciones relacionadas con la autenticación
import { handleApiResponse, handleApiError } from '../utils/api.js';
import { saveToken, removeToken } from '../utils/tokenUtils.js';

// Función para iniciar sesión
export async function login(event) {
    event.preventDefault();
    
    // Limpiar mensaje de error anterior
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        });

        const data = await handleApiResponse(response);
        saveToken(data.token);
        window.location.href = '/index.html';
    } catch (error) {
        handleApiError(error);
    }
}

// Función para registrarse
export async function register(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: password
            })
        });

        const data = await handleApiResponse(response);
        saveToken(data.token);
        window.location.href = '/index.html';
    } catch (error) {
        handleApiError(error);
    }
}

// Función para cerrar sesión
export function logout() {
    removeToken();
    window.location.href = '/login.html';
}

// Función para alternar la visibilidad de la contraseña
export function togglePasswordVisibility(event) {
    const button = event.currentTarget;
    const targetId = button.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);
    const icon = button.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
} 