// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users');
const db = require('./models/db'); // 👈 assumes you already have db.js
const authRouter = require('./routes/auth');



const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Secure Dev Portal Backend Running');
});

app.use('/api/users', usersRouter);  // Mount test route
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

