const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

/* =====================================================
   📄 GET ALL STUDENTS (PUBLIC)
===================================================== */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find(); // ❗ removed sort for safety
    res.status(200).json(students);
  } catch (err) {
    console.error("🔥 GET /students error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   ➕ ADD STUDENT (ADMIN ONLY)
===================================================== */
router.post('/', auth, async (req, res) => {
  try {
    const { name, rollNumber, department, batch, dateOfBirth } = req.body;

    if (!name || !rollNumber || !department || !batch || !dateOfBirth) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await Student.findOne({ rollNumber });
    if (exists) {
      return res.status(409).json({ message: 'Roll number already exists' });
    }

    const student = new Student({
      name,
      rollNumber,
      department: department.toUpperCase(),
      batch,
      dateOfBirth,
      semesters: [],
    });

    await student.save();
    res.status(201).json(student);

  } catch (err) {
    console.error("🔥 ADD STUDENT error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ✏️ UPDATE STUDENT (ADMIN ONLY)
===================================================== */
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, department, batch, dateOfBirth } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name ?? student.name;
    student.department = department ? department.toUpperCase() : student.department;
    student.batch = batch ?? student.batch;
    student.dateOfBirth = dateOfBirth ?? student.dateOfBirth;

    await student.save();
    res.json(student);

  } catch (err) {
    console.error("🔥 UPDATE STUDENT error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ➕ ADD SEMESTER (ADMIN ONLY)
===================================================== */
router.post('/:id/semesters', auth, async (req, res) => {
  try {
    const { semesterNumber } = req.body;

    if (!semesterNumber) {
      return res.status(400).json({ message: 'Semester number is required' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const exists = student.semesters.some(
      sem => sem.semesterNumber === semesterNumber
    );

    if (exists) {
      return res.status(409).json({ message: 'Semester already exists' });
    }

    student.semesters.push({
      semesterNumber,
      courses: [],
    });

    await student.save();
    res.status(201).json(student);

  } catch (err) {
    console.error("🔥 ADD SEMESTER error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ❌ DELETE SEMESTER
===================================================== */
router.delete('/:id/semesters/:semId', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const semester = student.semesters.id(req.params.semId);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });

    semester.deleteOne();
    await student.save();

    res.json(student);

  } catch (err) {
    console.error("🔥 DELETE SEMESTER error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ➕ ADD COURSE
===================================================== */
router.post('/:id/semesters/:semId/courses', auth, async (req, res) => {
  try {
    const { name, credits, grade } = req.body;

    if (!name || !credits || !grade) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const semester = student.semesters.id(req.params.semId);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });

    semester.courses.push({
      name,
      credits,
      grade,
      isBacklog: grade === 'R',
    });

    await student.save();
    res.status(201).json(student);

  } catch (err) {
    console.error("🔥 ADD COURSE error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ✏️ UPDATE COURSE
===================================================== */
router.put('/:id/semesters/:semId/courses/:courseId', auth, async (req, res) => {
  try {
    const { name, credits, grade } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const semester = student.semesters.id(req.params.semId);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });

    const course = semester.courses.id(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.name = name ?? course.name;
    course.credits = credits ?? course.credits;
    course.grade = grade ?? course.grade;
    course.isBacklog = grade === 'R';

    await student.save();
    res.json(student);

  } catch (err) {
    console.error("🔥 UPDATE COURSE error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ❌ DELETE COURSE
===================================================== */
router.delete('/:id/semesters/:semId/courses/:courseId', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const semester = student.semesters.id(req.params.semId);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });

    const course = semester.courses.id(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.deleteOne();
    await student.save();

    res.json(student);

  } catch (err) {
    console.error("🔥 DELETE COURSE error:", err);
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   ❌ DELETE STUDENT
===================================================== */
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });

  } catch (err) {
    console.error("🔥 DELETE STUDENT error:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
