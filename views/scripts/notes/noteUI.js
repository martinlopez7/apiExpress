// Funciones de UI relacionadas con notas
import { getNotes, deleteNote } from './noteAPI.js';
import { handleApiError } from '../utils/api.js';
import { openNoteModal, fillFormForEdit } from './noteModal.js';
import { showConfirmDialog } from '../ui/confirmDialog.js';

// Variable para aplicar filtros
let filters = {
    pinned: false
};

// Cargar y mostrar las notas
export async function loadNotes() {
    try {
        const notes = await getNotes();
        renderNotes(notes);
    } catch (error) {
        handleApiError(error);
    }
}

// Renderizar las notas en el DOM
export function renderNotes(notes) {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    notesList.innerHTML = notes.map(note => `
        <div class="note ${note.isPinned ? 'pinned' : ''}" data-id="${note._id}" data-tags="${note.tags.join(',')}" data-pinned="${note.isPinned}">
            <h3 class="note-title">${note.title}</h3>
            <p>${note.description}</p>
            <small>${note.tags.join(', ')}</small>
            <div class="note-actions">
                <button class="edit-btn">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones
    attachNoteEventListeners();
    
    // Aplicar filtros si existen
    applyFiltersToNotes();
}

// Adjuntar event listeners a los botones de las notas
function attachNoteEventListeners() {
    // Event listeners para botones de editar
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteElement = this.closest('.note');
            const noteId = noteElement.getAttribute('data-id');
            editNote(noteId);
        });
    });
    
    // Event listeners para botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteElement = this.closest('.note');
            const noteId = noteElement.getAttribute('data-id');
            handleDeleteNote(noteId);
        });
    });
}

// Manejar la edición de una nota
export function editNote(noteId) {
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
    
    // Abrir el modal en modo edición
    fillFormForEdit(noteId, title, description, tags, isPinned);
    openNoteModal();
}

// Manejar la eliminación de una nota
async function handleDeleteNote(noteId) {
    // Obtener el título de la nota para mostrarlo en la confirmación
    const noteElement = document.querySelector(`.note[data-id="${noteId}"]`);
    if (!noteElement) return;
    
    const noteTitle = noteElement.querySelector('.note-title').textContent;
    
    // Mostrar el diálogo de confirmación personalizado
    const isConfirmed = await showConfirmDialog({
        title: 'Eliminar Nota',
        message: `¿Estás seguro de que deseas eliminar la nota "${noteTitle}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });
    
    if (isConfirmed) {
        try {
            await deleteNote(noteId);
            loadNotes();
        } catch (error) {
            console.error('Error al eliminar la nota:', error);
        }
    }
}

// Aplicar filtros a las notas
export function applyFiltersToNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    const notes = Array.from(notesList.children);

    notes.forEach(note => {
        const isPinned = note.getAttribute('data-pinned') === 'true';
        
        // Mostrar la nota solo si cumple con el filtro de fijadas
        note.style.display = !filters.pinned || isPinned ? 'block' : 'none';
    });
}

// Actualizar filtros
export function updateFilters(newFilters) {
    filters = { ...filters, ...newFilters };
    applyFiltersToNotes();
} 
