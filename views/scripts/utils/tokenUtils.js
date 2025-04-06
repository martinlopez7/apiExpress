// Utilidades para manejar tokens JWT

// Decodificar un token JWT
export function decodeToken(token) {
    try {
        // Dividir el token en sus partes
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('El token no tiene el formato JWT esperado');
            return null;
        }
        
        // Decodificar la parte del payload
        const encodedPayload = parts[1];
        const decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        
        // Convertir a objeto JSON
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

// Obtener el token de localStorage
export function getToken() {
    return localStorage.getItem('token');
}

// Guardar el token en localStorage
export function saveToken(token) {
    localStorage.setItem('token', token);
}

// Eliminar el token de localStorage
export function removeToken() {
    localStorage.removeItem('token');
}

// Verificar si hay un token válido
export function hasValidToken() {
    const token = getToken();
    return !!token;
}