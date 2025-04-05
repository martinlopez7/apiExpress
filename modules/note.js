const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    tags: [String],
    isPinned: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

NoteSchema.index({ userId: 1, date: -1 }); // Índice compuesto para búsquedas por usuario ordenadas por fecha
NoteSchema.index({ userId: 1, isPinned: -1, date: -1 }); // Índice para la consulta principal (get all)
NoteSchema.index({ tags: 1, userId: 1 }); // Índice para búsqueda por etiquetas

// Índice de texto para búsquedas textuales eficientes
NoteSchema.index(
    { title: 'text', description: 'text' },
    { weights: { title: 10, description: 5 } } // El título tiene mayor peso en la búsqueda
);

module.exports = mongoose.model('Note', NoteSchema);