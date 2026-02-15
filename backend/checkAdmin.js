const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/student_tracker');

(async () => {
  const admins = await Admin.find();
  console.log("Admins in DB:");
  console.log(admins);
  process.exit();
})();
