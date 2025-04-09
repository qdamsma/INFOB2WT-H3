var express = require('express');
const path = require('path');
var router = express.Router();
const authMiddleware = require('../middleware/auth');


router.get('/', authMiddleware, function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
