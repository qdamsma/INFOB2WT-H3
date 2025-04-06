const db = require('../database');

const Course = {
    getAll: (callback) => {
        db.all('SELECT * FROM Courses', [], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, rows);
        });
    },

    findById: (id, callback) => {
        db.get('SELECT * FROM Courses WHERE course_id = ?', [id], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    },

    create: (newCourse, callback) => {
        db.run(
            'INSERT INTO Courses (course_name, description, duration, points) VALUES (?, ?, ?, ?)',
            [newCourse.course_name, newCourse.description, newCourse.duration, newCourse.points],
            function (err) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, { course_id: this.lastID, ...newCourse });
            }
        );
    },

    update: (id, updatedCourse, callback) => {
        db.run(
            'UPDATE Courses SET course_name = ?, description = ?, duration = ?, points = ? WHERE course_id = ?',
            [updatedCourse.course_name, updatedCourse.description, updatedCourse.duration, updatedCourse.points, id],
            (err) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, { course_id: id, ...updatedCourse });
            }
        );
    },

    delete: (id, callback) => {
        db.run(
            'DELETE FROM Courses WHERE course_id = ?',
            [id],
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    }
};

module.exports = Course;