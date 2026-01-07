const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

const getWIB = () => {
    const now = new Date();
    return new Date(now.getTime() + (7 * 60 * 60 * 1000));
};

// 1. GET: Absensi Saya Hari Ini (karyawan)
router.get('/me', auth, (req, res) => {
    const userId = req.user.id;
    const today = getWIB().toISOString().split('T')[0];
    const query = `
        SELECT a.*, s.nama_shift 
        FROM absensi a 
        JOIN shift s ON a.shift_id = s.id 
        WHERE a.user_id = ? AND a.tanggal = ?
        ORDER BY a.jam_masuk DESC
    `;
    db.query(query, [userId, today], (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal ambil data" });
        res.json(results);
    });
});

// 2. POST: Absen Masuk
router.post('/', auth, (req, res) => {
    const userId = req.user.id;
    const wibNow = getWIB();
    const today = wibNow.toISOString().split('T')[0];
    const timeNow = wibNow.toISOString().split('T')[1].substring(0, 8);

    const findShiftQuery = `
        SELECT id FROM shift 
        WHERE (jam_mulai <= ? AND jam_selesai > ?)
        OR (jam_mulai > jam_selesai AND (? >= jam_mulai OR ? < jam_selesai))
        LIMIT 1
    `;

    db.query(findShiftQuery, [timeNow, timeNow, timeNow, timeNow], (err, shifts) => {
        if (err || shifts.length === 0) return res.status(400).json({ message: "Tidak ada shift aktif" });

        const checkActive = 'SELECT id FROM absensi WHERE user_id = ? AND tanggal = ? AND jam_keluar IS NULL';
        db.query(checkActive, [userId, today], (err, existing) => {
            if (existing.length > 0) return res.status(400).json({ message: "Sesi kerja masih aktif" });

            db.query(`INSERT INTO absensi (user_id, shift_id, tanggal, jam_masuk, status) VALUES (?, ?, ?, ?, 'Hadir')`,
            [userId, shifts[0].id, today, timeNow], (err) => {
                if (err) return res.status(500).json({ message: "Gagal masuk" });
                res.json({ message: "Berhasil masuk" });
            });
        });
    });
});

// 3. PUT: Absen Pulang
router.put('/pulang', auth, (req, res) => {
    const userId = req.user.id;
    const timeNow = getWIB().toISOString().split('T')[1].substring(0, 8);
    const today = getWIB().toISOString().split('T')[0];

    db.query(`UPDATE absensi SET jam_keluar = ? WHERE user_id = ? AND tanggal = ? AND jam_keluar IS NULL`, 
    [timeNow, userId, today], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal pulang" });
        res.json({ message: "Berhasil pulang" });
    });
});

// 4. GET: Monitoring Admin
router.get('/', auth, (req, res) => {
    const { date } = req.query;
    let query = `
        SELECT a.*, u.nama, u.role, s.nama_shift 
        FROM absensi a
        JOIN users u ON a.user_id = u.id
        JOIN shift s ON a.shift_id = s.id
    `;
    let params = [];
    if (date) {
        query += ` WHERE a.tanggal = ?`;
        params.push(date);
    }
    query += ` ORDER BY a.tanggal DESC, a.jam_masuk DESC`;

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: "Error" });
        res.json(results);
    });
});

// 5. DELETE
router.delete('/:id', auth, role('admin'), (req, res) => {
    db.query('DELETE FROM absensi WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Gagal" });
        res.json({ message: "Terhapus" });
    });
});

module.exports = router;