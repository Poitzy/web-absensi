const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email=?',
    [email],
    (err, r) => {
      if (r.length === 0)
        return res.status(401).json({ message: 'User tidak ditemukan' });

      const user = r[0];
      if (password !== user.password)
        return res.status(401).json({ message: 'Password salah' });

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          shift_id: user.shift_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token, role: user.role });
    }
  );
});

module.exports = router;
