import type { Semester } from '../types';

/* Convert grade → grade point */
const gradeToPoint = (grade: string): number => {

  const map: Record<string, number> = {
    O: 10,
    'A+': 9,
    A: 8,
    'B+': 7,
    B: 6,
    C: 5,
    R: -1,
  };

  // Anything not listed = FAIL
  return map[grade?.toUpperCase()] ?? -1;
};


/* ===============================
   SGPA
================================ */
export const calculateSemesterGPA = (semester: Semester): number => {

  if (!semester?.courses?.length) return 0;

  let totalCredits = 0;
  let totalPoints = 0;

  semester.courses.forEach(course => {

    const point = gradeToPoint(course.grade);

    // ❗ Skip failed grades completely
    if (point === -1) return;

    totalCredits += course.credits;
    totalPoints += course.credits * point;
  });

  return totalCredits
    ? Number((totalPoints / totalCredits).toFixed(2))
    : 0;
};


/* ===============================
   CGPA
================================ */
export const calculateCGPA = (semesters: Semester[] = []) => {

  let totalCredits = 0;
  let totalPoints = 0;

  semesters.forEach(sem => {

    sem.courses?.forEach(course => {

      const point = gradeToPoint(course.grade);

      if (point === -1) return;

      totalCredits += course.credits;
      totalPoints += course.credits * point;
    });

  });

  return totalCredits
    ? Number((totalPoints / totalCredits).toFixed(2))
    : 0;
};
