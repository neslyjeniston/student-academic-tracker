const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: '*'
}));
app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_tracker')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

/* ---------- ROUTES ---------- */
// ✅ Student routes (CRUD)
const studentRoutes = require('./routes/studentRoutes');
app.use('/students', studentRoutes);

// ✅ Auth routes (Admin login → JWT)
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

/* ---------- TEST ROUTE ---------- */
app.get('/', (req, res) => {
  res.send('Student Academic Tracker API is running 🚀');
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});