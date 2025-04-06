// Funciones relacionadas con el tema de la aplicación

// Configurar el botón de cambio de tema
export function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Verificar si hay una preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            updateThemeIcon(true);
        }
        
        // Agregar el evento de clic para cambiar el tema
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Cambiar entre tema claro y oscuro
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    updateThemeIcon(isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Actualizar el icono del botón de tema
function updateThemeIcon(isDarkMode) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Limpiar el contenido actual
        themeToggle.innerHTML = '';
        
        // Agregar el icono correspondiente
        const icon = document.createElement('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.appendChild(icon);
    }
} 