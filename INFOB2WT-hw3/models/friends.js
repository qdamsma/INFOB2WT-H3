const db = require('../database');

// Check if a friend request already exists (in either direction)
function checkFriendshipRequest(user_id, friend_id, callback) {
    const query = `
        SELECT * FROM Friendships 
        WHERE (user_id = ? AND friend_id = ?)
           OR (user_id = ? AND friend_id = ?)
    `;
    db.get(query, [user_id, friend_id, friend_id, user_id], callback);
}

// Send a new friend request
function sendFriendRequest(user_id, friend_id, callback) {
    const query = `
        INSERT INTO Friendships (user_id, friend_id, status)
        VALUES (?, ?, 0)
    `;
    db.run(query, [user_id, friend_id], callback);
}

// Accept a friend request (status = 1)
function acceptFriendRequest(user_id, friend_id, callback) {
    const query = `
        UPDATE Friendships
        SET status = 1
        WHERE user_id = ? AND friend_id = ? AND status = 0
    `;
    db.run(query, [friend_id, user_id], callback); // friend_id had het verzoek gestuurd
}

// Reject a friend request (delete the row)
function rejectFriendRequest(user_id, friend_id, callback) {
    const query = `
        DELETE FROM Friendships
        WHERE user_id = ? AND friend_id = ? AND status = 0
    `;
    db.run(query, [friend_id, user_id], callback);
}

// Get all friends (only accepted friendships, status = 1)
function getFriends(user_id, callback) {
    const query = `
        SELECT u.id, u.username
        FROM Users u
        JOIN Friendships f ON 
            (f.user_id = ? AND f.friend_id = u.id AND f.status = 1)
            OR (f.friend_id = ? AND f.user_id = u.id AND f.status = 1)
    `;
    db.all(query, [user_id, user_id], callback);
}

module.exports = {
    checkFriendshipRequest,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends
};