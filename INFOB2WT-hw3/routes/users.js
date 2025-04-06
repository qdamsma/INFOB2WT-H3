const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Import the User model
const bcrypt = require('bcrypt'); // For password comparison

// Registration
router.post('/register', (req, res) => {
    const newUser = req.body;
    User.create(newUser, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Registration failed' });
        }
        // Handle successful registration (e.g., log the user in, redirect)
        res.status(201).json({ message: 'User registered successfully', user: user });
    });
});

// Login
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Login failed' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Login failed' });
            }

            if (!result) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Handle successful login (e.g., create session, send token)
            res.status(200).json({ message: 'Login successful', user: {user_id: user.user_id, email:user.email} }); // Send back user info useful on the client
        });
    });
});

// Update Profile
router.put('/profile/:id', (req,res) => {
    const id = req.params.id;
    const updatedUser = req.body;

    User.update(id, updatedUser, (err, user) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Update failed' });
        }
         res.status(200).json({ message: 'Profile updated succesfully', user: user})

    })


})

module.exports = router;