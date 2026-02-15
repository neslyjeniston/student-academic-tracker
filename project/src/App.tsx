import { useState, useEffect } from 'react';
import { StudentHeader } from './components/StudentHeader';
import { SemesterCard } from './components/SemesterCard';
import { CGPAChart } from './components/CGPAChart';
import { LoginPage } from './components/LoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAnalytics } from './components/AdminAnalytics';
import { calculateCGPA } from './utils/gradeCalculator';
import type { Student, LoginCredentials, Role } from './types';
import { generateStudentReport } from "./utils/pdfGenerator";
import { LogOut, LayoutDashboard, FileDown, ArrowLeft } from 'lucide-react';

type LoginMode = 'STUDENT' | 'ADMIN';
type AdminPage = 'DASHBOARD' | 'ANALYTICS';

function App() {

  // ✅ Render backend URL
  const API_BASE = "https://student-academic-tracker-esh9.onrender.com";

  const [role, setRole] = useState<Role | null>(null);
  const [loginMode, setLoginMode] = useState<LoginMode>('STUDENT');
  const [loginError, setLoginError] = useState('');
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [adminPage, setAdminPage] = useState<AdminPage>('DASHBOARD');

  const getToken = () => localStorage.getItem('token');

  /* ================= FETCH ================= */

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      const data = await res.json();
      setStudentsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch students error:", err);
      setStudentsList([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= AUTH ================= */

  const handleStudentLogin = (credentials: LoginCredentials) => {
    if (!Array.isArray(studentsList)) return;

    const student = studentsList.find(
      s =>
        s.rollNumber === credentials.rollNumber &&
        s.dateOfBirth === credentials.dateOfBirth
    );

    if (!student) {
      setLoginError('Invalid registration number or date of birth');
      return;
    }

    setCurrentStudent(student);
    setRole('STUDENT');
    setLoginError('');
  };

  const handleAdminLogin = async (credentials: LoginCredentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) throw new Error();

      const { token } = await res.json();
      localStorage.setItem('token', token);

      setRole('ADMIN');
      setLoginError('');
    } catch {
      setLoginError('Invalid admin credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setCurrentStudent(null);
    setSelectedStudent(null);
    setAdminPage('DASHBOARD');
  };

  /* ================= STUDENT CRUD ================= */

  const addStudent = async (student: Student) => {
    await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(student),
    });
    await fetchStudents();
  };

  const updateStudent = async (student: Student) => {
    if (!student._id) return;

    await fetch(`${API_BASE}/students/${student._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(student),
    });

    await fetchStudents();
  };

  const deleteStudent = async (id: string) => {
    await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    await fetchStudents();
  };

  /* ================= SEMESTER CRUD ================= */

  const addSemester = async (studentId: string, semesterNumber: number) => {
    await fetch(`${API_BASE}/students/${studentId}/semesters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ semesterNumber }),
    });

    await fetchStudents();
  };

  const deleteSemester = async (studentId: string, semId: string) => {
    await fetch(`${API_BASE}/students/${studentId}/semesters/${semId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    await fetchStudents();
  };

  /* ================= COURSE CRUD ================= */

  const addCourse = async (
    studentId: string,
    semId: string,
    course: { name: string; credits: number; grade: string }
  ) => {
    await fetch(`${API_BASE}/students/${studentId}/semesters/${semId}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(course),
    });

    await fetchStudents();
  };

  const updateCourse = async (
    studentId: string,
    semId: string,
    courseId: string,
    grade: string
  ) => {
    await fetch(
      `${API_BASE}/students/${studentId}/semesters/${semId}/courses/${courseId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ grade }),
      }
    );

    await fetchStudents();
  };

  const deleteCourse = async (
    studentId: string,
    semId: string,
    courseId: string
  ) => {
    await fetch(
      `${API_BASE}/students/${studentId}/semesters/${semId}/courses/${courseId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    await fetchStudents();
  };

  /* ================= ADMIN VIEW ================= */

  if (role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50">

        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg">
            <LayoutDashboard className="w-5 h-5" />
            Admin Panel
          </div>

          <div className="flex gap-4 items-center">
            <button onClick={() => { setAdminPage('DASHBOARD'); setSelectedStudent(null); }}>
              Dashboard
            </button>
            <button onClick={() => setAdminPage('ANALYTICS')}>
              Analytics
            </button>
            <button onClick={logout} className="text-red-500 flex items-center gap-1">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="p-6">

          {selectedStudent && (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <StudentHeader student={selectedStudent} onLogout={logout} />
              <CGPAChart semesters={selectedStudent.semesters} />

              {selectedStudent.semesters.map(sem => (
                <SemesterCard key={sem._id} semester={sem} />
              ))}

              <button
                onClick={() => generateStudentReport(selectedStudent)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <FileDown className="w-4 h-4 inline mr-2" />
                Download Report
              </button>
            </div>
          )}

          {!selectedStudent && adminPage === 'DASHBOARD' && (
            <AdminDashboard
              students={studentsList}
              onAddStudent={addStudent}
              onUpdateStudent={updateStudent}
              onDeleteStudent={deleteStudent}
              onSelectStudent={setSelectedStudent}
              onAddSemester={addSemester}
              onUpdateSemester={() => {}}
              onDeleteSemester={deleteSemester}
              onAddCourse={addCourse}
              onUpdateCourse={updateCourse}
              onDeleteCourse={deleteCourse}
            />
          )}

          {adminPage === 'ANALYTICS' && (
            <AdminAnalytics students={studentsList} />
          )}

        </main>
      </div>
    );
  }

  /* ================= STUDENT VIEW ================= */

  if (role === 'STUDENT' && currentStudent) {
    const cgpa = calculateCGPA(currentStudent.semesters);

    return (
      <div className="p-6 space-y-6">
        <StudentHeader student={currentStudent} onLogout={logout} />
        <CGPAChart semesters={currentStudent.semesters} />

        <div className="text-2xl font-black text-blue-600">
          CGPA: {cgpa}
        </div>

        {currentStudent.semesters.map(sem => (
          <SemesterCard key={sem._id} semester={sem} />
        ))}

        <button
          onClick={() => generateStudentReport(currentStudent)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <FileDown className="w-4 h-4 inline mr-2" />
          Download PDF
        </button>
      </div>
    );
  }

  /* ================= LOGIN ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      {loginMode === 'STUDENT' ? (
        <LoginPage
          onLogin={handleStudentLogin}
          error={loginError}
          onAdminClick={() => setLoginMode('ADMIN')}
        />
      ) : (
        <AdminLoginPage
          onLogin={handleAdminLogin}
          error={loginError}
          onBack={() => setLoginMode('STUDENT')}
        />
      )}
    </div>
  );
}

export default App;
