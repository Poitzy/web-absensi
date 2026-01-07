require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/absensi', require('./routes/absensi'));
app.use('/api/shift', require('./routes/shift'));
app.use('/api/request-shift', require('./routes/requestShift'));

app.listen(5000, () => console.log('Server running on 5000'));
