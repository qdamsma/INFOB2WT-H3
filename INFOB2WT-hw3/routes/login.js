var express = require('express');
const path = require('path');
const User = require('../models/users');
var router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../database');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});


// Login
router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Login failed' });
        }

        if (!user) {
            console.log('Geen gebruiker gevonden met dit e-mailadres');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Login failed' });
            }

            if (!result) {
                console.log('Wachtwoord komt niet overeen');
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            req.session.userId = user.user_id;
            console.log("Login success, session userId:", req.session.userId);
            res.redirect('/');
        });
    });
});

module.exports = router;