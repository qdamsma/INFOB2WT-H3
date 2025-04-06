const db = require('../database');

const Friend = {
    sendFriendRequest: (user_id, friend_id, callback) => {
        db.run(
            'INSERT INTO Friendships (user_id, friend_id, status) VALUES (?, ?, ?)',
            [user_id, friend_id, 0], // 0: pending
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },

    acceptFriendRequest: (user_id, friend_id, callback) => {
        db.run(
            'UPDATE Friendships SET status = ? WHERE user_id = ? AND friend_id = ?',
            [1, user_id, friend_id], // 1: accepted
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },

    rejectFriendRequest: (user_id, friend_id, callback) => {
        //Consider just deleting the friendship request instead of rejecting
        db.run(
            'DELETE FROM Friendships WHERE user_id = ? AND friend_id = ?',
            [user_id, friend_id],
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            }
        );
    },

    getFriends: (user_id, callback) => {
        db.all(
            'SELECT Users.* FROM Users INNER JOIN Friendships ON (Users.user_id = Friendships.friend_id OR Users.user_id = Friendships.user_id) WHERE (Friendships.user_id = ? OR Friendships.friend_id = ?) AND Friendships.status = ? AND Users.user_id != ?',
            [user_id, user_id, 1, user_id],  // 1: accepted, Exclude the user itself from the list
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            }
        );
    },

    //Check if the request is valid
    checkFriendshipRequest: (user_id, friend_id, callback) => {
        db.get(
            'SELECT * FROM Friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
            [user_id, friend_id, friend_id, user_id],
            (err, row) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, row);
            }
        );
    }
};

module.exports = Friend;