// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/data', (req, res) => {
  const sql = 'SELECT * FROM DELMEC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

module.exports = router;
