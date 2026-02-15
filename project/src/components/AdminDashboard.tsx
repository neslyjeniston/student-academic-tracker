import { useState } from 'react';
import {
  UserPlus,
  Filter,
  XCircle,
  Eye,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';
import type { Student } from '../types';
import { calculateCGPA } from '../utils/gradeCalculator';
import { AdminCoursePanel } from './AdminCoursePanel';

interface Props {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;

  onSelectStudent: (student: Student) => void;

  onAddSemester: (studentId: string, semesterNumber: number) => void;
  onUpdateSemester: (
    studentId: string,
    semId: string,
    semesterNumber: number
  ) => void;
  onDeleteSemester: (studentId: string, semId: string) => void;

  onAddCourse: (
    studentId: string,
    semId: string,
    course: { name: string; credits: number; grade: string }
  ) => void;

  onUpdateCourse: (
    studentId: string,
    semId: string,
    courseId: string,
    grade: string
  ) => void;

  onDeleteCourse: (
    studentId: string,
    semId: string,
    courseId: string
  ) => void;
}

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];

export const AdminDashboard = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudent,
  onAddSemester,
  onUpdateSemester,
  onDeleteSemester,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}: Props) => {

  /* ================= FORM STATE ================= */
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const resetForm = () => {
    setEditingStudent(null);
    setName('');
    setRollNumber('');
    setDepartment('');
    setBatch('');
    setDateOfBirth('');
  };

  const handleSubmit = () => {
    if (!name || !rollNumber || !department || !batch || !dateOfBirth) return;

    const payload: Student = {
      ...(editingStudent?._id ? { _id: editingStudent._id } : {}),
      name,
      rollNumber,
      department,
      batch,
      dateOfBirth,
      semesters: editingStudent?.semesters || [],
    };

    editingStudent ? onUpdateStudent(payload) : onAddStudent(payload);
    resetForm();
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setDepartment(student.department);
    setBatch(student.batch);
    setDateOfBirth(student.dateOfBirth);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ================= FILTER ================= */
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBatch, setFilterBatch] = useState('');

  const uniqueBatches = Array.from(new Set(students.map(s => s.batch)));

  const filteredStudents = students.filter(student => {
    const matchDept = filterDepartment
      ? student.department === filterDepartment
      : true;

    const matchBatch = filterBatch
      ? student.batch === filterBatch
      : true;

    return matchDept && matchBatch;
  });

  /* ================= EXPAND STATE ================= */
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);
  const [semesterInput, setSemesterInput] = useState<number>(1);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">

      {/* ================= REGISTER / EDIT ================= */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-xl flex items-center gap-2">
            <UserPlus size={20} className="text-blue-600" />
            {editingStudent ? 'Update Profile' : 'Register New Student'}
          </h2>

          {editingStudent && (
            <button
              onClick={resetForm}
              className="text-rose-500 text-xs font-black uppercase hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            className="input-style"
            placeholder="Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            className="input-style"
            placeholder="Roll Number"
            value={rollNumber}
            disabled={!!editingStudent}
            onChange={e => setRollNumber(e.target.value)}
          />

          <select
            className="input-style"
            value={department}
            onChange={e => setDepartment(e.target.value)}
          >
            <option value="">Select Dept</option>
            {DEPARTMENTS.map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <input
            className="input-style"
            placeholder="Batch"
            value={batch}
            onChange={e => setBatch(e.target.value)}
          />

          <input
            type="date"
            className="input-style"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm"
        >
          {editingStudent ? 'Save Changes' : 'Add Student'}
        </button>
      </div>

      {/* ================= FILTER ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border flex justify-between flex-wrap gap-4">
        <div className="flex gap-3 items-center flex-wrap">
          <Filter size={16} />

          <select
            value={filterDepartment}
            onChange={e => setFilterDepartment(e.target.value)}
            className="input-style"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dep => (
              <option key={dep}>{dep}</option>
            ))}
          </select>

          <select
            value={filterBatch}
            onChange={e => setFilterBatch(e.target.value)}
            className="input-style"
          >
            <option value="">All Batches</option>
            {uniqueBatches.map(b => (
              <option key={b}>{b}</option>
            ))}
          </select>

          {(filterDepartment || filterBatch) && (
            <button
              onClick={() => {
                setFilterDepartment('');
                setFilterBatch('');
              }}
              className="text-rose-500 text-xs font-bold flex items-center gap-1"
            >
              <XCircle size={14} /> Clear
            </button>
          )}
        </div>

        <div className="text-xs font-bold">
          Found: {filteredStudents.length} Students
        </div>
      </div>

      {/* ================= STUDENT LIST ================= */}
      <div className="space-y-3">
        {filteredStudents.map(student => {
          const cgpa = Number(calculateCGPA(student.semesters));
          const isOpen = expandedStudent === student._id;

          return (
            <div key={student._id} className="bg-white rounded-2xl border shadow-sm">

              {/* Header */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setExpandedStudent(isOpen ? null : student._id!)
                    }
                  >
                    {isOpen ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  <div>
                    <h3 className="font-bold">{student.name}</h3>
                    <p className="text-xs text-slate-500">
                      {student.rollNumber} • {student.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">

                  <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                    {cgpa.toFixed(2)} CGPA
                  </div>

                  {/* 👁 VIEW */}
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Eye size={16} />
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() => startEdit(student)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => onDeleteStudent(student._id!)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Section */}
              {isOpen && (
                <div className="px-14 pb-8 pt-2 border-t">

                  {/* Add Semester */}
                  <div className="flex gap-3 mb-4">
                    <input
                      type="number"
                      value={semesterInput}
                      min="1"
                      max="8"
                      onChange={e => setSemesterInput(Number(e.target.value))}
                      className="input-style w-20 text-center"
                    />

                    <button
                      onClick={() =>
                        onAddSemester(student._id!, semesterInput)
                      }
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Semester
                    </button>
                  </div>

                  {/* Semester List */}
                  {student.semesters
                    .sort((a, b) => a.semesterNumber - b.semesterNumber)
                    .map(sem => {
                      const isSemOpen = expandedSemester === sem._id;

                      return (
                        <div key={sem._id} className="mb-4 border rounded-xl">

                          <div className="flex justify-between items-center p-3">
                            <button
                              onClick={() =>
                                setExpandedSemester(
                                  isSemOpen ? null : sem._id!
                                )
                              }
                              className="flex items-center gap-2 text-xs font-bold"
                            >
                              {isSemOpen ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                              Semester {sem.semesterNumber}
                            </button>

                            <button
                              onClick={() =>
                                onDeleteSemester(student._id!, sem._id!)
                              }
                              className="text-rose-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {isSemOpen && (
                            <div className="p-4 border-t">
                              <AdminCoursePanel
                                studentId={student._id!}
                                semId={sem._id!}
                                courses={sem.courses}
                                onAddCourse={onAddCourse}
                                onUpdateCourse={onUpdateCourse}
                                onDeleteCourse={onDeleteCourse}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
