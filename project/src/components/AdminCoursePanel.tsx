import { useState } from 'react';
import { Plus, Trash2, Check, X, Edit2 } from 'lucide-react';
import type { Course } from '../types';

interface Props {
  studentId: string;
  semId: string;
  courses: Course[];
  onAddCourse: (studentId: string, semId: string, course: { name: string; credits: number; grade: string }) => void;
  onUpdateCourse: (studentId: string, semId: string, courseId: string, grade: string) => void;
  onDeleteCourse: (studentId: string, semId: string, courseId: string) => void;
}

export const AdminCoursePanel = ({
  studentId,
  semId,
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse
}: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newGrade, setNewGrade] = useState('A');

  // Track which course is being edited for grades
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editGrade, setEditGrade] = useState('');

  const handleAdd = () => {
    if (!newName) return;
    onAddCourse(studentId, semId, {
      name: newName,
      credits: Number(newCredits),
      grade: newGrade
    });
    setNewName('');
    setIsAdding(false);
  };

  const handleUpdate = (courseId: string) => {
    onUpdateCourse(studentId, semId, courseId, editGrade);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
            <tr>
              <th className="px-4 py-2">Course Name</th>
              <th className="px-4 py-2">Credits</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {courses.map((course) => (
              <tr key={course._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">{course.name}</td>
                <td className="px-4 py-3 text-slate-500">{course.credits}</td>
                <td className="px-4 py-3">
                  {editingId === course._id ? (
                    <select 
                      value={editGrade} 
                      onChange={(e) => setEditGrade(e.target.value)}
                      className="bg-white border border-blue-200 rounded px-2 py-1 text-xs font-bold outline-none ring-2 ring-blue-500/10"
                    >
                      {['O', 'A+', 'A', 'B+', 'B', 'C', 'F'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      ['O', 'A+', 'A'].includes(course.grade) ? 'bg-emerald-50 text-emerald-600' : 
                      course.grade === 'F' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {course.grade}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === course._id ? (
                      <>
                        <button onClick={() => handleUpdate(course._id!)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setEditingId(course._id!); setEditGrade(course.grade); }}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => onDeleteCourse(studentId, semId, course._id!)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Course Form */}
      {isAdding ? (
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            className="col-span-1 md:col-span-2 p-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-500"
            placeholder="Course Name (e.g. Data Structures)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              className="w-full p-2 rounded-lg border border-slate-200 text-xs text-center"
              value={newCredits}
              onChange={(e) => setNewCredits(Number(e.target.value))}
              placeholder="Cr"
            />
            <select 
              className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
            >
              {['O', 'A+', 'A', 'B+', 'B', 'C', 'F'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase">Confirm</button>
            <button onClick={() => setIsAdding(false)} className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg"><X size={14} /></button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-xs font-bold flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add Course to Semester
        </button>
      )}
    </div>
  );
};