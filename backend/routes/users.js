const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

/* GET ALL KARYAWAN */
router.get('/', auth, role('admin'), (req, res) => {
  db.query(`
    SELECT u.id, u.nama, u.email, u.role, u.shift_id, s.nama_shift
    FROM users u
    LEFT JOIN shift s ON s.id = u.shift_id
  `, (e, r) => {
    if (e) return res.status(500).json({ message: "Gagal mengambil data" });
    res.json(r);
  });
});

/* CREATE KARYAWAN */
router.post('/', auth, role('admin'), (req, res) => {
  const { nama, email, password, shift_id } = req.body;
  const finalShiftId = shift_id === "" ? null : shift_id;

  db.query(
    `INSERT INTO users (nama, email, password, role, shift_id)
     VALUES (?, ?, ?, ?, ?)`,
    [nama, email, password, 'karyawan', finalShiftId],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal menambah karyawan" });
      res.json({ message: 'Karyawan ditambahkan' });
    }
  );
});

/* UPDATE KARYAWAN */
router.put('/:id', auth, role('admin'), (req, res) => {
  const { nama, email, shift_id } = req.body;
  
  // PERBAIKAN: Memastikan shift_id null jika kosong agar tidak error di MySQL
  const finalShiftId = shift_id === "" ? null : shift_id;

  const query = `UPDATE users SET nama=?, email=?, shift_id=? WHERE id=?`;
  
  db.query(
    query,
    [nama, email, finalShiftId, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email sudah digunakan karyawan lain' });
        }
        return res.status(500).json({ message: 'Gagal memperbarui database' });
      }
      res.json({ message: 'Data karyawan berhasil diperbarui' });
    }
  );
});

/* DELETE KARYAWAN */
router.delete('/:id', auth, role('admin'), (req, res) => {
  db.query(
    'DELETE FROM users WHERE id=?',
    [req.params.id],
    () => res.json({ message: 'Karyawan dihapus' })
  );
});

module.exports = router;