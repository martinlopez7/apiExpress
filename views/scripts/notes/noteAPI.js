// Funciones para realizar operaciones de API relacionadas con notas
import { fetchWithAuth, handleApiResponse, handleApiError } from '../utils/api.js';

// Crear una nueva nota
export async function createNote(noteData) {
    try {
        return await fetchWithAuth('/api/notes', {
            method: 'POST',
            body: JSON.stringify(noteData)
        }).then(handleApiResponse);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Actualizar una nota existente
export async function updateNote(noteId, noteData) {
    try {
        return await fetchWithAuth(`/api/notes/${noteId}`, {
            method: 'PUT',
            body: JSON.stringify(noteData)
        }).then(handleApiResponse);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Eliminar una nota
export async function deleteNote(noteId) {
    try {
        return await fetchWithAuth(`/api/notes/${noteId}`, {
            method: 'DELETE'
        }).then(handleApiResponse);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Obtener todas las notas
export async function getNotes() {
    try {
        return await fetchWithAuth('/api/notes').then(handleApiResponse);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
} 