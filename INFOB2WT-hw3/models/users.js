const db = require('../database'); // Import the database connection
const bcrypt = require('bcrypt');   // For password hashing

const User = {
    create: (newUser, callback) => {
        bcrypt.hash(newUser.password, 10, (err, hash) => {
            if (err) {
                return callback(err, null); // Indicate error
            }

            db.run(
                'INSERT INTO Users (first_name, last_name, age, email, password, photo_path, program_id, hobbies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    newUser.first_name,
                    newUser.last_name,
                    newUser.age,
                    newUser.email,
                    hash, 
                    newUser.photo_path,
                    newUser.program_id,
                    newUser.hobbies
                ],
                function (err) { 
                    if (err) {
                        return callback(err, null);
                    }

                    return callback(null, { user_id: this.lastID, ...newUser });
                }
            );
        });
    },

    findByEmail: (email, callback) => {
        db.get(
            'SELECT * FROM Users WHERE email = ?',
            [email],
            (err, row) => {
                if (err) {
                    return callback(err, null); // Indicate error
                }
                return callback(null, row); // Return the user object (or null if not found)
            }
        );
    },

    findById: (id, callback) => {
        db.get(
            'SELECT * FROM Users WHERE user_id = ?',
            [id],
            (err, row) => {
                if (err) {
                    return callback(err, null); // Indicate error
                }
                return callback(null, row); // Return the user object (or null if not found)
            }
        );
    },

    update: (id, updatedUser, callback) => {
        db.run(
            `UPDATE Users SET first_name = ?, last_name = ?, age = ?, email = ?, photo_path = ?, program_id = ?, hobbies = ? WHERE user_id = ?`,
            [
                updatedUser.first_name,
                updatedUser.last_name,
                updatedUser.age,
                updatedUser.email,
                updatedUser.photo_path,
                updatedUser.program_id,
                updatedUser.hobbies,
                id
            ],
            (err) => {
                if (err) {
                    return callback(err, null); // Indicate error
                }
                return callback(null, { user_id: id, ...updatedUser }); // Indicate success
            }
        );
    },

    delete: (id, callback) => {
        db.run(
            'DELETE FROM Users WHERE user_id = ?',
            [id],
            (err) => {
                if (err) {
                    return callback(err);  //Indicate error
                }
                return callback(null);  //Indicate succes
            }
        );
    }
};

module.exports = User;