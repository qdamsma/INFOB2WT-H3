const express = require('express');
const router = express.Router();
const Friend = require('../models/friends');

// POST /friends/request (Send a friend request)
router.post('/request', (req, res) => {
    const user_id = req.body.user_id;
    const friend_id = req.body.friend_id;

    //Consider checking if they are already friend and if the ids are valid!
    Friend.checkFriendshipRequest(user_id, friend_id, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to check friend request' });
        }
        if (row) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }
        Friend.sendFriendRequest(user_id, friend_id, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to send friend request' });
            }
            res.json({ message: 'Friend request sent successfully' });
        });
    })
});

// POST /friends/accept (Accept a friend request)
router.post('/accept', (req, res) => {
    const user_id = req.body.user_id;
    const friend_id = req.body.friend_id;

    Friend.acceptFriendRequest(user_id, friend_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to accept friend request' });
        }
        res.json({ message: 'Friend request accepted successfully' });
    });
});

// POST /friends/reject (Reject a friend request)
router.post('/reject', (req, res) => {
    const user_id = req.body.user_id;
    const friend_id = req.body.friend_id;

    Friend.rejectFriendRequest(user_id, friend_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to reject friend request' });
        }
        res.json({ message: 'Friend request rejected successfully' });
    });
});

// GET /friends/:user_id (Get a user's friends)
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    Friend.getFriends(user_id, (err, friends) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve friends' });
        }
        res.json(friends);
    });
});

module.exports = router;