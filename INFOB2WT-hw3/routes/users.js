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

// Update Profile
router.put('/profile/:id', (req,res) => {
    const id = req.params.id;
    const updatedUser = req.body;

    if (!req.session.userId || req.session.userId !== parseInt(userId)) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    User.update(id, updatedUser, (err, user) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Update failed' });
        }
         res.status(200).json({ message: 'Profile updated succesfully', user: user})

    })


})

module.exports = router;