const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

/* GET ALL SHIFT */
router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM shift', (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Gagal mengambil data shift" });
    }
    res.json(results);
  });
});

/* CREATE SHIFT */
router.post('/', auth, role('admin'), (req, res) => {
  const { nama_shift, jam_mulai, jam_selesai } = req.body;
  
  db.query(
    'INSERT INTO shift (nama_shift, jam_mulai, jam_selesai) VALUES (?, ?, ?)',
    [nama_shift, jam_mulai, jam_selesai],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Gagal menambahkan shift" });
      }
      res.json({ message: 'Shift berhasil ditambahkan' });
    }
  );
});

module.exports = router;