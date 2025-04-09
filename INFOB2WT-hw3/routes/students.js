const express = require('express');
const router = express.Router();
const db = require('../database');
const { Student, Course, Person } = require('../models/member'); // zorg dat je member.js exporteert

router.get('/', (req, res) => {
    const query = `
        SELECT 
            u.user_id, u.first_name, u.last_name, u.age, u.email, u.photo_path, u.hobbies, 
            p.program_name,
            c.course_id, c.course_name, c.description AS course_description
        FROM Users u
        LEFT JOIN Programs p ON u.program_id = p.program_id
        LEFT JOIN User_Courses uc ON u.user_id = uc.user_id
        LEFT JOIN Courses c ON uc.course_id = c.course_id
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const studentMap = new Map();

        rows.forEach(row => {
            const id = row.user_id;
            if (!studentMap.has(id)) {
                studentMap.set(id, {
                    firstName: row.first_name,
                    lastName: row.last_name,
                    age: row.age,
                    hobbies: JSON.parse(row.hobbies || '[]'),
                    email: row.email,
                    photo: row.photo_path || '',
                    major: row.program_name || '',
                    courses: [],
                    intro: '',
                    head1: '', texts1: '',
                    head2: '', texts2: '',
                    head3: '', texts3: '',
                    head4: '', texts4: '',
                    headVak: ''
                });
            }

            if (row.course_id) {
                const course = {
                    title: row.course_name,
                    teacher: { firstName: 'Docent', lastName: 'Onbekend' },
                    description: row.course_description
                };
                studentMap.get(id).courses.push(course);
            }
        });

        const students = Array.from(studentMap.values());
        res.json(students);
    });
});

module.exports = router;