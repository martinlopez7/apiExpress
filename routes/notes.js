const express = require('express');
const router = express.Router();
const Note = require('../modules/note');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Create Note
router.post('/', async (req, res) => {
    try {
        const note = new Note({
            ...req.body,
            userId: req.userId // Añadir el ID del usuario autenticado
        });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Notes (solo las del usuario autenticado)
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId }).sort({ isPinned: -1, date: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Búsqueda avanzada con filtros
router.get('/search', async (req, res) => {
    try {
        const { query, tags, fromDate, toDate } = req.query;
        
        // Construir el pipeline de agregación
        const pipeline = [
            { $match: { userId: req.userId } }
        ];
        
        // Filtro de texto
        if (query) {
            pipeline.push({
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                }
            });
        }
        
        // Filtro de etiquetas
        if (tags) {
            const tagList = tags.split(',');
            pipeline.push({
                $match: { tags: { $in: tagList } }
            });
        }
        
        // Filtro de fechas
        if (fromDate || toDate) {
            const dateFilter = {};
            if (fromDate) dateFilter.$gte = new Date(fromDate);
            if (toDate) dateFilter.$lte = new Date(toDate);
            
            if (Object.keys(dateFilter).length > 0) {
                pipeline.push({
                    $match: { date: dateFilter }
                });
            }
        }
        
        // Ordenar resultados
        pipeline.push({ $sort: { isPinned: -1, date: -1 } });
        
        const notes = await Note.aggregate(pipeline);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Búsqueda de texto utilizando el índice de texto
router.get('/text-search', async (req, res) => {
    try {
        const { text } = req.query;
        
        if (!text) {
            return res.status(400).json({ message: 'Search text is required' });
        }
        
        const notes = await Note.aggregate([
            {
                $match: {
                    $text: { $search: text },
                    userId: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $addFields: {
                    score: { $meta: "textScore" }
                }
            },
            {
                $sort: { score: -1, isPinned: -1, date: -1 }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    date: 1,
                    tags: 1,
                    isPinned: 1,
                    score: 1
                }
            }
        ]);
        
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener estadísticas de notas por etiquetas
router.get('/stats/tags', async (req, res) => {
    try {
        const stats = await Note.aggregate([
            { $match: { userId: req.userId } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener estadísticas de notas por período de tiempo
router.get('/stats/time', async (req, res) => {
    try {
        const { period } = req.query; // 'day', 'month', 'year'
        let groupFormat;
        
        switch(period) {
            case 'day':
                groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
                break;
            case 'month':
                groupFormat = { $dateToString: { format: '%Y-%m', date: '$date' } };
                break;
            case 'year':
            default:
                groupFormat = { $dateToString: { format: '%Y', date: '$date' } };
        }
        
        const stats = await Note.aggregate([
            { $match: { userId: req.userId } },
            { $group: { 
                _id: groupFormat,
                count: { $sum: 1 },
                pinned: { $sum: { $cond: ['$isPinned', 1, 0] } }
            }},
            { $sort: { _id: 1 } }
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un resumen de notas agrupadas por mes con análisis de datos
router.get('/monthly-summary', async (req, res) => {
    try {
        const { year } = req.query;
        const yearNum = year ? parseInt(year) : new Date().getFullYear();
        
        const startDate = new Date(yearNum, 0, 1);
        const endDate = new Date(yearNum + 1, 0, 1);
        
        const summary = await Note.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    month: { $month: '$date' },
                    tags: 1,
                    isPinned: 1,
                    contentLength: { $strLenCP: '$description' }
                }
            },
            {
                $group: {
                    _id: '$month',
                    count: { $sum: 1 },
                    avgLength: { $avg: '$contentLength' },
                    pinnedCount: { $sum: { $cond: ['$isPinned', 1, 0] } },
                    tags: { $push: '$tags' },
                    titles: { $push: '$title' }
                }
            },
            {
                $addFields: {
                    month: '$_id',
                    allTags: { $reduce: {
                        input: '$tags',
                        initialValue: [],
                        in: { $concatArrays: ['$$value', '$$this'] }
                    }}
                }
            },
            {
                $project: {
                    _id: 0,
                    month: 1,
                    count: 1,
                    avgLength: 1,
                    pinnedCount: 1,
                    // Aplanar los arrays de tags
                    topTags: {
                        $slice: [
                            {
                                $map: {
                                    input: {
                                        $sortArray: {
                                            input: {
                                                $map: {
                                                    input: {
                                                        $setUnion: "$allTags"
                                                    },
                                                    as: "tag",
                                                    in: {
                                                        tag: "$$tag",
                                                        count: {
                                                            $size: {
                                                                $filter: {
                                                                    input: "$allTags",
                                                                    as: "t",
                                                                    cond: { $eq: ["$$t", "$$tag"] }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            sortBy: { count: -1 }
                                        }
                                    },
                                    as: "tagObj",
                                    in: {
                                        tag: "$$tagObj.tag",
                                        count: "$$tagObj.count"
                                    }
                                }
                            },
                            0, 5 // Mostrar solo los 5 principales
                        ]
                    },
                    recentTitles: { $slice: ["$titles", 0, 3] } // Mostrar solo los 3 títulos más recientes
                }
            },
            {
                $sort: { month: 1 }
            }
        ]);
        
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Note (verificando que pertenezca al usuario)
router.put('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        Object.assign(note, req.body);
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Note (verificando que pertenezca al usuario)
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;