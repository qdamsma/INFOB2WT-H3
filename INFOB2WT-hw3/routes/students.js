const express = require('express');
const router = express.Router();
const path = require('path');
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
                    id: row.user_id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    age: row.age,
                    hobbies: JSON.parse(row.hobbies || '[]'),
                    email: row.email,
                    photo: row.photo_path || '',
                    major: row.program_name || '',
                    courses: [],
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

router.get('/:id', (req, res) => {
    const studentId = req.params.id;

    const query = `
        SELECT 
            u.user_id, u.first_name, u.last_name, u.age, u.email, u.photo_path, u.hobbies, 
            p.program_name,
            c.course_id, c.course_name, c.description AS course_description
        FROM Users u
        LEFT JOIN Programs p ON u.program_id = p.program_id
        LEFT JOIN User_Courses uc ON u.user_id = uc.user_id
        LEFT JOIN Courses c ON uc.course_id = c.course_id
        WHERE u.user_id = ?
    `;

    db.all(query, [studentId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ error: 'Student niet gevonden' });

        const student = {
            id: rows[0].user_id,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            age: rows[0].age,
            hobbies: JSON.parse(rows[0].hobbies || '[]'),
            email: rows[0].email,
            photo: rows[0].photo_path || '',
            major: rows[0].program_name || '',
            courses: [],
        };

        rows.forEach(row => {
            if (row.course_id) {
                student.courses.push({
                    title: row.course_name,
                    teacher: { firstName: 'Docent', lastName: 'Onbekend' },
                    description: row.course_description,
                });
            }
        });

        res.json(student);
    });
});

module.exports = router;