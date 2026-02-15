import React, { useMemo } from 'react';
import { Semester } from '../types';
import { calculateSemesterGPA } from '../utils/gradeCalculator';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  ResponsiveContainer, Area, ComposedChart, ReferenceLine, ReferenceArea
} from 'recharts';

interface Props {
  semesters: Semester[];
  targetGpa?: number; // Optional target line
}

export const CGPAChart: React.FC<Props> = ({ semesters, targetGpa = 8.5 }) => {
  
  const chartData = useMemo(() => {
    let totalGradePoints = 0;
    
    return semesters.map((sem, index) => {
      const sgpa = calculateSemesterGPA(sem);
      totalGradePoints += sgpa;
      const cgpa = totalGradePoints / (index + 1);
      
      const prevSgpa = index > 0 ? calculateSemesterGPA(semesters[index - 1]) : sgpa;
      const trend = sgpa - prevSgpa;

      return {
        semester: `Sem ${index + 1}`,
        sgpa: Number(sgpa.toFixed(2)),
        cgpa: Number(cgpa.toFixed(2)),
        trend: Number(trend.toFixed(2)),
        isHighest: false, // Will calculate below
      };
    });
  }, [semesters]);

  // Find the highest SGPA to highlight it
  const highestSgpa = Math.max(...chartData.map(d => d.sgpa));
  chartData.forEach(d => { if(d.sgpa === highestSgpa) d.isHighest = true; });

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md bg-opacity-90">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{data.semester}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-8">
              <span className="text-blue-400">Semester GPA:</span>
              <span className="font-mono font-bold">{data.sgpa}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-emerald-400">Cumulative:</span>
              <span className="font-mono font-bold">{data.cgpa}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">Trend:</span>
              <span className={`text-xs font-bold ${data.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.trend > 0 ? '↑' : '↓'} {Math.abs(data.trend)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) return <div className="p-10 text-center text-gray-400">Awaiting academic data...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Analytics</h2>
          <p className="text-sm text-slate-500 font-medium">Tracking Semester vs. Cumulative Performance</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
           <div className="px-3 py-1 text-xs font-bold text-blue-600 uppercase">SGPA</div>
           <div className="px-3 py-1 text-xs font-bold text-emerald-600 uppercase">CGPA</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          
          {/* Reference Areas for Grading Zones */}
          <ReferenceArea y1={9} y2={10} fill="#f0fdf4" fillOpacity={0.5} />
          <ReferenceArea y1={0} y2={4} fill="#fef2f2" fillOpacity={0.5} />

          <XAxis 
            dataKey="semester" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
            dy={15}
          />
          
          <YAxis 
            domain={[0, 10]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />

          {/* Target GPA Line */}
          <ReferenceLine y={targetGpa} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#94a3b8', fontSize: 10 }} />

          <Area type="monotone" dataKey="sgpa" fill="url(#lineGradient)" stroke="none" />

          {/* SGPA Line */}
          <Line
            type="stepAfter" // Advanced: Shows "plateaus" of performance
            dataKey="sgpa"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={(props: any) => {
               const { cx, cy, payload } = props;
               if (payload.isHighest) {
                 return <circle cx={cx} cy={cy} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={2} />;
               }
               return <circle cx={cx} cy={cy} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2} />;
            }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />

          {/* CGPA Line */}
          <Line
            type="monotone"
            dataKey="cgpa"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};