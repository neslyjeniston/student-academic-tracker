import React from 'react';
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
} from 'recharts';

interface Props {
  semesters: Semester[];
}

export const CGPAChart: React.FC<Props> = ({ semesters }) => {
  
  // Convert semesters into chart data
  const data = semesters.map((sem, index) => ({
    semester: `Sem ${index + 1}`,
    gpa: calculateSemesterGPA(sem),
  }));

  // 🚨 Prevent empty chart crash
  if (!data.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          CGPA Progression
        </h2>

        <p className="text-gray-500">
          No semester data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        CGPA Progression
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="semester" />

          {/* GPA is out of 10 */}
          <YAxis domain={[0, 10]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="gpa"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
