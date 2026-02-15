const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/student_tracker');

(async () => {
  await Admin.deleteMany({});
  console.log("All admins deleted");
  process.exit();
})();
