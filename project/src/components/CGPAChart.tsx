import React, { useMemo } from 'react';
import { Semester } from '../types';
import { calculateSemesterGPA } from '../utils/gradeCalculator';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';

interface Props {
  semesters: Semester[];
}

export const CGPAChart: React.FC<Props> = ({ semesters }) => {
  // Memoize data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    return semesters.map((sem, index) => {
      const sgpa = calculateSemesterGPA(sem);
      
      // Assuming each sem has a credit weight. If not, we use a simple running average
      // For this example, we'll treat semesters equally for the CGPA calculation
      totalGradePoints += sgpa;
      const cgpa = totalGradePoints / (index + 1);

      return {
        semester: `Sem ${index + 1}`,
        sgpa: Number(sgpa.toFixed(2)),
        cgpa: Number(cgpa.toFixed(2)),
      };
    });
  }, [semesters]);

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">CGPA Progression</h2>
        <p className="text-gray-400 italic">No semester data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Academic Growth</h2>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span> SGPA
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Cumulative
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          
          <XAxis 
            dataKey="semester" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
          />
          
          <YAxis 
            domain={[0, 10]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />

          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}
          />

          {/* Area under the SGPA line */}
          <Area 
            type="monotone" 
            dataKey="sgpa" 
            fill="url(#colorSgpa)" 
            stroke="none" 
          />

          {/* Individual Semester Line */}
          <Line
            type="monotone"
            dataKey="sgpa"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />

          {/* Cumulative CGPA Line */}
          <Line
            type="monotone"
            dataKey="cgpa"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={2000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};