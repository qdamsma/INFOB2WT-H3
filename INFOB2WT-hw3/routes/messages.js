const express = require('express');
const router = express.Router();
const Message = require('../models/messages');

// POST /messages/send (Send a message)
router.post('/send', (req, res) => {
    const sender_id = req.body.sender_id;
    const receiver_id = req.body.receiver_id;
    const message_text = req.body.message_text;

    Message.sendMessage(sender_id, receiver_id, message_text, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to send message' });
        }
        res.json({ message: 'Message sent successfully' });
    });
});

// GET /messages/:user_id (Get a user's messages)
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    Message.getMessages(user_id, (err, messages) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve messages' });
        }
        res.json(messages);
    });
});

// POST /messages/:message_id/read (Mark a message as read)
router.post('/:message_id/read', (req, res) => {
    const message_id = req.params.message_id;

    Message.markAsRead(message_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to mark message as read' });
        }
        res.json({ message: 'Message marked as read successfully' });
    });
});

// GET /messages/:sender_id/:reciever_id
router.get('/:sender_id/:reciever_id', (req, res) => {
    const sender_id = req.params.sender_id;
    const reciever_id = req.params.reciever_id;

    Message.getMessagesBySenderAndReciever(sender_id, reciever_id, (err, messages) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve messages' });
        }
        res.json(messages);
    });
});

module.exports = router;