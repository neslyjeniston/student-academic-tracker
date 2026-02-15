// components/AdminSemesterPanel.tsx
import { useState } from 'react';
import { PlusCircle, BookOpen, Layers } from 'lucide-react';
import type { Student } from '../types';

interface Props {
  student: Student;
  onAddSemester: (studentId: string, semesterNumber: number) => void;
}

export const AdminSemesterPanel = ({ student, onAddSemester }: Props) => {
  const [semesterNumber, setSemesterNumber] = useState<number>(student.semesters.length + 1);

  const handleAdd = () => {
    onAddSemester(student._id!, semesterNumber);
    setSemesterNumber(prev => prev + 1); // Auto-increment for better UX
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* Header Section */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-800">Semester Management</h3>
      </div>

      <div className="p-5">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-700 uppercase mb-1 ml-1">
              Semester Number
            </label>
            <input
              type="number"
              className="border border-blue-200 rounded-lg p-2 w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 1"
              value={semesterNumber}
              onChange={e => setSemesterNumber(Number(e.target.value))}
            />
          </div>

          <button
            onClick={handleAdd}
            className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm active:transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Add Semester
          </button>
        </div>

        {/* Semesters List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 mb-3 px-1">Active Semesters</p>
          
          {student.semesters.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No semesters added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.semesters.map(sem => (
                <div 
                  key={sem._id} 
                  className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {sem.semesterNumber}
                    </div>
                    <span className="font-semibold text-slate-700">Semester {sem.semesterNumber}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {sem.courses?.length || 0} Courses
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};