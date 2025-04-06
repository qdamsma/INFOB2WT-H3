const db = require('../database');

const Program = {
    getAll: (callback) => {
        db.all('SELECT * FROM Programs', [], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, rows);
        });
    },

    findById: (id, callback) => {
        db.get('SELECT * FROM Programs WHERE program_id = ?', [id], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    },

    create: (newProgram, callback) => {
        db.run(
            'INSERT INTO Programs (program_name, description) VALUES (?, ?)',
            [newProgram.program_name, newProgram.description],
            function (err) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, { program_id: this.lastID, ...newProgram });
            }
        );
    },

    update: (id, updatedProgram, callback) => {
        db.run(
            'UPDATE Programs SET program_name = ?, description = ? WHERE program_id = ?',
            [updatedProgram.program_name, updatedProgram.description, id],
            (err) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, { program_id: id, ...updatedProgram });
            }
        );
    },

    delete: (id, callback) => {
        db.run(
            'DELETE FROM Programs WHERE program_id = ?',
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

module.exports = Program;