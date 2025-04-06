// Funciones relacionadas con el modal de notas
import { createNote, updateNote } from './noteAPI.js';
import { loadNotes } from './noteUI.js';

// Id de la nota que se está editando
let currentEditNoteId = null;

// Configurar el modal de creación/edición de notas
export function setupNoteModal() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteModal = document.getElementById('noteModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const saveButton = document.querySelector('.note-form .btn-primary');
    
    if (addNoteBtn && noteModal) {
        // Abrir el modal al hacer clic en el botón de añadir
        addNoteBtn.addEventListener('click', () => {
            clearForm();
            resetFormToCreateMode();
            openNoteModal();
        });
        
        // Cerrar el modal al hacer clic en el botón de cerrar
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeNoteModal);
        }
        
        // Cerrar el modal al hacer clic fuera del contenido
        noteModal.addEventListener('click', (event) => {
            if (event.target === noteModal) {
                closeNoteModal();
            }
        });

        // Configurar el botón de guardar
        if (saveButton) {
            saveButton.addEventListener('click', handleFormSubmit);
        }
    }
}

// Abrir el modal de notas
export function openNoteModal() {
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
        noteModal.classList.add('active');
    }
}

// Cerrar el modal de notas
export function closeNoteModal() {
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
        noteModal.classList.remove('active');
        clearForm();
        resetFormToCreateMode();
    }
}

// Limpiar el formulario
export function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('isPinned').checked = false;
}

// Resetear el formulario al modo de creación
export function resetFormToCreateMode() {
    currentEditNoteId = null;
    
    // Cambiar el título del modal
    const modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Nueva Nota';
    }
}

// Llenar el formulario para editar
export function fillFormForEdit(noteId, title, description, tags, isPinned) {
    currentEditNoteId = noteId;
    
    // Llenar el formulario con los datos de la nota
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('tags').value = tags.join(', ');
    document.getElementById('isPinned').checked = isPinned;
    
    // Cambiar el título del modal
    const modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Editar Nota';
    }
}

// Manejar el envío del formulario
async function handleFormSubmit() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const isPinned = document.getElementById('isPinned').checked;
    
    const noteData = { 
        title, 
        description, 
        tags, 
        isPinned
    };
    
    try {
        if (currentEditNoteId) {
            // Estamos en modo edición
            await updateNote(currentEditNoteId, noteData);
        } else {
            // Estamos en modo creación
            noteData.date = new Date();
            await createNote(noteData);
        }
        
        // Cerrar el modal y recargar las notas
        closeNoteModal();
        loadNotes();
    } catch (error) {
        console.error('Error al guardar la nota:', error);
    }
} 
