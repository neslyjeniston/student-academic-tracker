const mongoose = require('mongoose');

/* ---------- COURSE SCHEMA ---------- */
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
  isBacklog: {
    type: Boolean,
    default: false,
  },
});

/* ---------- SEMESTER SCHEMA ---------- */
const semesterSchema = new mongoose.Schema({
  semesterNumber: {
    type: Number,
    required: true,
  },
  courses: {
    type: [courseSchema],
    default: [],
  },
});

/* ---------- STUDENT SCHEMA ---------- */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      uppercase: true, // ⭐ AUTO-CONVERTS TO UPPERCASE
      trim: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
    },

    semesters: {
      type: [semesterSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);