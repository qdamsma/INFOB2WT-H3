const express = require('express');
const path = require('path');
const db = require('../database');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getFriends } = require('../models/friends');

router.get('/', authMiddleware, (req, res) => {
    const userId = req.session.userId;

    db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }

        if (!user) {
            return res.status(404).send('Gebruiker niet gevonden');
        }

        res.sendFile(path.join(__dirname, '../views/profile.html'));
    });
});

router.get('/data', authMiddleware, (req, res) => {
    const userId = req.session.userId;
    db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        db.all(`
            SELECT f.user_id, f.friend_id, f.status, u.first_name, u.last_name 
            FROM Friendships f
            JOIN users u ON (f.user_id = u.user_id OR f.friend_id = u.user_id)
            WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 0`, 
            [userId, userId], (err, requests) => {
                if (err) {
                    return res.status(500).json({ error: 'Fout bij ophalen vriendschapsverzoeken' });
                }

                res.json({ user, requests }); 
            });
    });
});

module.exports = router;