// Funciones relacionadas con la búsqueda

// Inicializar la barra de búsqueda
export function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const resetSearch = document.getElementById('resetSearch');
    const notesList = document.getElementById('notesList');
    const searchResultsMessage = document.getElementById('searchResultsMessage');

    if (searchInput && resetSearch && notesList && searchResultsMessage) {
        // Evento de búsqueda
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const notes = Array.from(notesList.children);
            let hasResults = false;
            
            notes.forEach(note => {
                const title = note.querySelector('.note-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    note.style.display = 'block';
                    hasResults = true;
                } else {
                    note.style.display = 'none';
                }
            });

            // Mostrar/ocultar mensaje de resultados
            if (searchTerm && !hasResults) {
                searchResultsMessage.textContent = 'No se encontraron notas con ese título';
                searchResultsMessage.classList.add('show');
            } else {
                searchResultsMessage.classList.remove('show');
            }
        });

        // Evento de reset
        resetSearch.addEventListener('click', () => {
            searchInput.value = '';
            // Mostrar todas las notas
            const notes = Array.from(notesList.children);
            notes.forEach(note => {
                note.style.display = 'block';
            });
            // Ocultar mensaje de resultados
            searchResultsMessage.classList.remove('show');
        });
    }
} 