// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users');
const db = require('./models/db'); // 👈 assumes you already have db.js


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Secure Dev Portal Backend Running');
});

app.use('/api/users', usersRouter);  // Mount test route

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    const [result] = await db.query('SELECT NOW()');
    console.log('✅ DB connected! Time is:', result[0]['NOW()']);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
  }
});

