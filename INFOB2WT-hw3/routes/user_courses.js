const express = require('express');
const router = express.Router();
const UserCourse = require('../models/user_course');

// POST /user_courses/enroll (Enroll a user in a course)
router.post('/enroll', (req, res) => {
    const user_id = req.body.user_id;
    const course_id = req.body.course_id;

    UserCourse.create(user_id, course_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to enroll user in course' });
        }
        res.json({ message: 'User enrolled in course successfully' });
    });
});

// DELETE /user_courses/unenroll (Unenroll a user from a course)
router.delete('/unenroll', (req, res) => {
    const user_id = req.body.user_id;
    const course_id = req.body.course_id;

    UserCourse.delete(user_id, course_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to unenroll user from course' });
        }
        res.json({ message: 'User unenrolled from course successfully' });
    });
});

// GET /user_courses/:user_id/courses (Get a user's courses)
router.get('/:user_id/courses', (req, res) => {
    const user_id = req.params.user_id;

    UserCourse.getCoursesForUser(user_id, (err, courses) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve courses for user' });
        }
        res.json(courses);
    });
});

// GET /user_courses/:course_id/users (Get users enrolled in a course)
router.get('/:course_id/users', (req, res) => {
    const course_id = req.params.course_id;

    UserCourse.getUsersForCourse(course_id, (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve users for course' });
        }
        res.json(users);
    });
});

module.exports = router;