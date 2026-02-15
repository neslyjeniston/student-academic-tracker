require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

/* ===============================
   🔗 CONNECT DATABASE
================================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });

/* ===============================
   🚀 CREATE ADMIN (Dynamic)
================================= */
(async () => {
  try {
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
      console.log('❌ Usage: node createAdmin.js <username> <password>');
      process.exit(0);
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists with this username');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      username,
      password: hashedPassword,
    });

    console.log('✅ Admin created successfully');
    process.exit();

  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
})();
