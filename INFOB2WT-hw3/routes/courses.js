const express = require('express');
const router = express.Router();
const Course = require('../models/courses');

// GET /courses (Get all courses)
router.get('/', (req, res) => {
    Course.getAll((err, courses) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve courses' });
        }
        res.json(courses);
    });
});

// GET /courses/:id (Get a course by ID)
router.get('/:id', (req, res) => {
    const course_id = req.params.id;

    Course.findById(course_id, (err, course) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve course' });
        }

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    });
});

// POST /courses (Create a new course)
router.post('/', (req, res) => {
    const newCourse = {
        course_name: req.body.course_name,
        description: req.body.description,
        duration: req.body.duration,
        points: req.body.points
    };

    Course.create(newCourse, (err, course) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create course' });
        }

        res.status(201).json({ message: 'Course created successfully', course: course });
    });
});

// PUT /courses/:id (Update an existing course)
router.put('/:id', (req, res) => {
    const course_id = req.params.id;
    const updatedCourse = {
        course_name: req.body.course_name,
        description: req.body.description,
        duration: req.body.duration,
        points: req.body.points
    };

    Course.update(course_id, updatedCourse, (err, course) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update course' });
        }

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course updated successfully', course: course });
    });
});

// DELETE /courses/:id (Delete a course)
router.delete('/:id', (req, res) => {
    const course_id = req.params.id;

    Course.delete(course_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete course' });
        }

        res.json({ message: 'Course deleted successfully' });
    });
});

module.exports = router;