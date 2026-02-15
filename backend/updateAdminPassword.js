const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function updatePassword() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/student_tracker');
    console.log('✅ Connected to MongoDB');

    const username = process.argv[2];
    const newPassword = process.argv[3];

    if (!username || !newPassword) {
      console.log('Usage: node updateAdminPassword.js <username> <newPassword>');
      process.exit();
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log('❌ Admin not found');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Password updated successfully');
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updatePassword();
