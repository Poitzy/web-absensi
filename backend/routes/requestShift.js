const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

// KARYAWAN: Kirim Request
router.post('/request', auth, role('karyawan'), (req, res) => {
    const { shift_id, tanggal_request, keterangan } = req.body;
    const userId = req.user.id;

    db.query(
        'INSERT INTO request_shift (user_id, shift_id, tanggal_request, keterangan, status) VALUES (?, ?, ?, ?, "pending")',
        [userId, shift_id, tanggal_request, keterangan],
        (err) => {
            if (err) return res.status(500).json({ message: "Gagal mengirim request" });
            res.json({ message: "Request shift berhasil dikirim!" });
        }
    );
});

// ADMIN: List Request
router.get('/admin/list', auth, role('admin'), (req, res) => {
    db.query(`
        SELECT rs.*, u.nama, s.nama_shift 
        FROM request_shift rs
        JOIN users u ON rs.user_id = u.id
        JOIN shift s ON rs.shift_id = s.id
        WHERE rs.status = 'pending'
        ORDER BY rs.tanggal_request ASC`, 
        (err, results) => {
            if (err) return res.status(500).json({ message: "Gagal mengambil data" });
            res.json(results);
        }
    );
});

// ADMIN: Action (Approve/Reject)
router.put('/admin/action/:id', auth, role('admin'), (req, res) => {
    const { status } = req.body; 
    const requestId = req.params.id;

    db.query('SELECT * FROM request_shift WHERE id = ?', [requestId], (err, row) => {
        if (err || !row.length) return res.status(404).json({ message: "Request tidak ditemukan" });
        
        const { user_id, shift_id } = row[0];

        if (status === 'approved') {
            db.query('UPDATE users SET shift_id = ? WHERE id = ?', [shift_id, user_id], () => {
                db.query('UPDATE request_shift SET status = "approved" WHERE id = ?', [requestId], () => {
                    res.json({ message: "Request disetujui" });
                });
            });
        } else {
            db.query('UPDATE request_shift SET status = "rejected" WHERE id = ?', [requestId], () => {
                res.json({ message: "Request ditolak" });
            });
        }
    });
});

module.exports = router;