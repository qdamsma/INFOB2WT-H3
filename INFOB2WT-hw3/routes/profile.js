const express = require('express');
const path = require('path');
const db = require('../database');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

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

        res.json(user);
    });
});

module.exports = router;