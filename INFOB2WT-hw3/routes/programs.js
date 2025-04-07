const express = require('express');
const router = express.Router();
const Program = require('../models/programs');

// GET /programs (Get all programs)
router.get('/', (req, res) => {
    Program.getAll((err, programs) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve programs' });
        }
        res.json(programs);
    });
});

// GET /programs/:id (Get a program by ID)
router.get('/:id', (req, res) => {
    const program_id = req.params.id;

    Program.findById(program_id, (err, program) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve program' });
        }

        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }

        res.json(program);
    });
});

// POST /programs (Create a new program)
router.post('/', (req, res) => {
    const newProgram = {
        program_name: req.body.program_name,
        description: req.body.description,
    };

    Program.create(newProgram, (err, program) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create program' });
        }

        res.status(201).json({ message: 'Program created successfully', program: program });
    });
});

// PUT /programs/:id (Update an existing program)
router.put('/:id', (req, res) => {
    const program_id = req.params.id;
    const updatedProgram = {
        program_name: req.body.program_name,
        description: req.body.description,
    };

    Program.update(program_id, updatedProgram, (err, program) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update program' });
        }

        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }

        res.json({ message: 'Program updated successfully', program: program });
    });
});

// DELETE /programs/:id (Delete a program)
router.delete('/:id', (req, res) => {
    const program_id = req.params.id;

    Program.delete(program_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete program' });
        }

        res.json({ message: 'Program deleted successfully' });
    });
});

module.exports = router;