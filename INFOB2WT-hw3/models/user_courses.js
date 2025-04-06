const db = require('../database');

const UserCourse = {
    create: (user_id, course_id, callback) => {
        db.run(
            'INSERT INTO User_Courses (user_id, course_id) VALUES (?, ?)',
            [user_id, course_id],
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },

    delete: (user_id, course_id, callback) => {
        db.run(
            'DELETE FROM User_Courses WHERE user_id = ? AND course_id = ?',
            [user_id, course_id],
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },

    getCoursesForUser: (user_id, callback) => {
        db.all(
            'SELECT Courses.* FROM User_Courses JOIN Courses ON User_Courses.course_id = Courses.course_id WHERE User_Courses.user_id = ?',
            [user_id],
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            }
        );
    },

    getUsersForCourse: (course_id, callback) => {
        db.all(
            'SELECT Users.* FROM User_Courses JOIN Users ON User_Courses.user_id = Users.user_id WHERE User_Courses.course_id = ?',
            [course_id],
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            }
        );
    }
};

module.exports = UserCourse;