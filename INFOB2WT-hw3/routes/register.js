const express = require('express');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../database');

router.post('/', (req, res) => {
    const { first_name, last_name, age, email, password, program_id, hobbies } = req.body;

    // Wachtwoord hashen
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error("Hashing error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        const hobbiesJson = JSON.stringify(hobbies);

        db.run(`INSERT INTO Users (first_name, last_name, age, email, password, program_id, hobbies) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, age, email, hashedPassword, program_id, hobbiesJson],
            function (err) {
                if (err) {
                    console.error("Insert error:", err);
                    return res.status(500).json({ error: "Could not register user" });
                }

                req.session.userId = this.lastID;
                console.log("Gebruiker geregistreerd:", this.lastID);
                res.redirect('/group19/');
            }
        );
    });
});

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});

module.exports = router;