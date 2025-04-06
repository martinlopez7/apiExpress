// Funciones utilitarias para manejar respuestas y peticiones API

// Manejar respuestas de la API
export async function handleApiResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la operación');
    }
    return data;
}

// Manejar errores de la API
export function handleApiError(error) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = error.message || 'Error al conectar con el servidor';
        errorElement.style.display = 'block';
    } else {
        alert(error.message || 'Error al conectar con el servidor');
    }
}

// Realizar peticiones autenticadas
export async function fetchWithAuth(url, options = {}) {
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