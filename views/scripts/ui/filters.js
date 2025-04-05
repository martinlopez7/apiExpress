// Funciones relacionadas con los filtros
import { updateFilters } from '../notes/noteUI.js';

// Configurar los filtros
export function setupFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const filtersModal = document.getElementById('filtersModal');
    const closeModal = filtersModal ? filtersModal.querySelector('.close-modal') : null;
    const applyFilters = document.getElementById('applyFilters');
    const clearFilters = document.getElementById('clearFilters');
    const pinnedFilter = document.getElementById('pinnedFilter');

    if (!filterBtn || !filtersModal) return;

    // Configurar el botón de filtro
    filterBtn.addEventListener('click', () => {
        filtersModal.style.display = 'block';
    });

    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            filtersModal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera
    filtersModal.addEventListener('click', (e) => {
        if (e.target === filtersModal) {
            filtersModal.style.display = 'none';
        }
    });

    // Aplicar filtros
    if (applyFilters && pinnedFilter) {
        applyFilters.addEventListener('click', () => {
            updateFilters({ pinned: pinnedFilter.checked });
            filtersModal.style.display = 'none';
        });
    }

    // Limpiar filtros
    if (clearFilters && pinnedFilter) {
        clearFilters.addEventListener('click', () => {
            pinnedFilter.checked = false;
            // No aplicar cambios inmediatamente, esperar al clic en "Aplicar filtros"
        });
    }
} 