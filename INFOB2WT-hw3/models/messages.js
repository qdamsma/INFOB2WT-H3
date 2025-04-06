const db = require('../database');

const Message = {
    sendMessage: (sender_id, receiver_id, message_text, callback) => {
        db.run(
            'INSERT INTO Messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)',
            [sender_id, receiver_id, message_text],
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },

    getMessages: (user_id, callback) => {
        db.all(
            'SELECT * FROM Messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_date',
            [user_id, user_id],
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            }
        );
    },

    markAsRead: (message_id, callback) => {
        db.run(
            'UPDATE Messages SET is_read = ? WHERE message_id = ?',
            [1, message_id], // 1: true
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },
    getMessagesBySenderAndReciever: (sender_id, reciever_id, callback) => {
         db.all(
            'SELECT * FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_date',
            [sender_id, reciever_id, reciever_id, sender_id],
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            }
        );
    }
};

module.exports = Message;