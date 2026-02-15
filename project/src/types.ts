/* ===============================
   📘 COURSE
=============================== */

export interface Course {
  _id?: string;        // Mongo creates it
  name: string;
  credits: number;
  grade: string;       // O, A+, A, B+, B, C, D, R
}

/* ===============================
   📘 SEMESTER
=============================== */

export interface Semester {
  _id?: string;        // Mongo id
  semesterNumber: number;
  courses: Course[];
}

/* ===============================
   🎓 STUDENT
=============================== */

export interface Student {
  _id?: string;        // Mongo id
  name: string;
  rollNumber: string;
  department: string;
  batch: string;
  dateOfBirth: string;
  semesters: Semester[];
}

/* ===============================
   🔐 AUTH
=============================== */

export type Role = 'STUDENT' | 'ADMIN';

export interface Admin {
  username: string;
  password: string;
}

export interface LoginCredentials {
  rollNumber?: string;
  dateOfBirth?: string;
  username?: string;
  password?: string;
}
