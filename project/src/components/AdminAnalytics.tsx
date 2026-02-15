import React from 'react';
import type { Student } from '../types';
import { calculateCGPA } from '../utils/gradeCalculator';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Building2, 
  BarChart3 
} from 'lucide-react';

interface Props {
  students: Student[];
}

export const AdminAnalytics = ({ students }: Props) => {

  /* ===============================
      📊 PREPARE DATA
  =============================== */

  const studentsWithCGPA = students.map(student => ({
    ...student,
    cgpa: calculateCGPA(student.semesters || [])
  }));

  const rankedStudents = [...studentsWithCGPA].sort(
    (a, b) => b.cgpa - a.cgpa
  );

  const topper = rankedStudents[0];

  const averageCGPA =
    studentsWithCGPA.length > 0
      ? (
          studentsWithCGPA.reduce((sum, s) => sum + s.cgpa, 0) /
          studentsWithCGPA.length
        ).toFixed(2)
      : "0.00";

  const passedStudents = students.filter(student =>
    student.semesters.every(sem =>
      sem.courses.every(course => course.grade !== 'R')
    )
  );

  const passPercentage =
    students.length > 0
      ? ((passedStudents.length / students.length) * 100).toFixed(1)
      : "0";

  const studentsWithArrears =
    students.length - passedStudents.length;

  /* ===============================
      🏫 EXTRA ANALYTICS
  =============================== */

  const uniqueDepartments = new Set(students.map(s => s.department));

  const totalCourses = students.reduce((total, student) => {
    return total + student.semesters.reduce((sum, sem) => {
      return sum + sem.courses.length;
    }, 0);
  }, 0);

  const topFive = rankedStudents.slice(0, 5);

  const studentsAtRisk = studentsWithCGPA.filter(s => s.cgpa < 5);

  const cgpaAbove9 = studentsWithCGPA.filter(s => s.cgpa >= 9).length;
  const cgpaAbove8 = studentsWithCGPA.filter(s => s.cgpa >= 8 && s.cgpa < 9).length;
  const cgpaAbove7 = studentsWithCGPA.filter(s => s.cgpa >= 7 && s.cgpa < 8).length;
  const cgpaBelow6 = studentsWithCGPA.filter(s => s.cgpa < 6).length;

  /* ===============================
      🎨 UI
  =============================== */

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Institutional Analytics
          </h1>
          <p className="text-slate-500">Real-time academic performance and student insights</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Active: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* SUMMARY BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={students.length} icon={<Users />} color="blue" />
        <StatCard title="Departments" value={uniqueDepartments.size} icon={<Building2 />} color="indigo" />
        <StatCard title="Total Courses" value={totalCourses} icon={<BookOpen />} color="purple" />
        <StatCard title="Average CGPA" value={averageCGPA} icon={<TrendingUp />} color="emerald" />
        <StatCard title="Pass Rate" value={`${passPercentage}%`} icon={<GraduationCap />} color="teal" />
        <StatCard title="Arrears" value={studentsWithArrears} icon={<AlertTriangle />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PERFORMANCE DATA */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performer Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <Award className="absolute -right-4 -top-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">🥇 Academic Excellence</h2>
              {topper ? (
                <div>
                  <p className="text-2xl font-bold">{topper.name}</p>
                  <p className="text-blue-400 text-lg font-mono mt-1">CGPA: {topper.cgpa}</p>
                  <div className="mt-4 inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30">
                    {topper.department}
                  </div>
                </div>
              ) : <p className="text-slate-500">No data available</p>}
            </div>

            {/* Top 5 Students List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Rank Leaderboard
              </h2>
              <div className="space-y-3">
                {topFive.map((student, index) => (
                  <div key={student._id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-600">
                      <span className="text-slate-400 mr-2">{index + 1}.</span> {student.name}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold ring-1 ring-blue-100">
                      {student.cgpa}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CGPA DISTRIBUTION BARS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-slate-800 font-bold mb-6">CGPA Distribution Curve</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <Distribution label="9.0+" value={cgpaAbove9} total={students.length} color="bg-emerald-500" />
              <Distribution label="8.0 - 8.9" value={cgpaAbove8} total={students.length} color="bg-blue-500" />
              <Distribution label="7.0 - 7.9" value={cgpaAbove7} total={students.length} color="bg-indigo-500" />
              <Distribution label="Below 6.0" value={cgpaBelow6} total={students.length} color="bg-rose-500" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RISK MONITOR */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-slate-800 font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Risk Monitor
            </h2>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase">
              CGPA &lt; 5.0
            </span>
          </div>
          
          <div className="space-y-4">
            {studentsAtRisk.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl shadow-inner">✓</div>
                <p className="text-green-600 font-bold">Campus Healthy</p>
                <p className="text-slate-400 text-xs mt-1">Zero students currently at risk</p>
              </div>
            ) : (
              studentsAtRisk.map(student => (
                <div key={student._id} className="p-3 rounded-xl bg-red-50 border border-red-100 group transition-all hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-red-900 group-hover:text-red-700">{student.name}</p>
                      <p className="text-xs text-red-700/60 font-medium uppercase">{student.rollNumber}</p>
                    </div>
                    <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-black shadow-sm">
                      {student.cgpa}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ===============================
    REUSABLE DASHBOARD UI ATOMS
=============================== */

const StatCard = ({ title, value, icon, color }: any) => {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    teal: "text-teal-600 bg-teal-50 border-teal-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon && React.cloneElement(icon, { size: 20 })}
      </div>
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">{title}</h2>
      <p className="text-2xl font-black text-slate-800 mt-2">{value}</p>
    </div>
  );
};

const Distribution = ({ label, value, total, color }: any) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">{label}</p>
        <p className="text-lg font-black text-slate-800">{value}</p>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};