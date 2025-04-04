var express = require('express');
var router = express.Router();
const db = require('../database');

/* GET users listing. */
router.get('/', (req, res) => {
  db.all('SELECT * FROM Users', [], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows); 
  });
});

module.exports = router;
