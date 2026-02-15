import React from 'react';
import { GraduationCap, User, BookOpen, Users, LogOut } from 'lucide-react';
import { Student } from '../types';

interface StudentHeaderProps {
  student: Student;
  onLogout: () => void; // Added to resolve TypeScript error
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ student, onLogout }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Profile Info */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
          <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
            <User className="h-10 w-10" />
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {student.name}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-3">
              <div className="flex items-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                {student.department}
              </div>
              
              <div className="flex items-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                {student.rollNumber}
              </div>
              
              <div className="flex items-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Batch {student.batch}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Logout Action */}
        <button
          onClick={onLogout}
          className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all font-black text-xs uppercase tracking-widest border border-transparent hover:border-rose-100"
        >
          <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          Logout
        </button>

      </div>
    </div>
  );
};