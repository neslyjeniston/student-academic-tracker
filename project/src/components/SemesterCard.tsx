import React from 'react';
import type { Semester } from '../types';
import { calculateSemesterGPA } from '../utils/gradeCalculator';

interface SemesterCardProps {
  semester: Semester;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({ semester }) => {

  const courses = semester?.courses ?? [];

  // ✅ CORRECT — pass semester
  const gpa = calculateSemesterGPA(semester);

  const backlogs = semester.courses.filter(
  course => course.grade === 'R'
).length;


  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Semester {semester.semesterNumber}
        </h2>

        <div className="flex space-x-4">
          <div className="text-center">
            <span className="text-sm text-gray-600">GPA</span>
            <p className="text-lg font-bold text-blue-600">
              {gpa}
            </p>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">Backlogs</span>
            <p
              className={`text-lg font-bold ${
                backlogs > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {backlogs}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm text-gray-500">
                Course
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-500">
                Credits
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-500">
                Grade
              </th>
              <th className="px-4 py-2 text-left text-sm text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="border-t">
                <td className="px-4 py-2 text-sm">
                  {course.name}
                </td>

                <td className="px-4 py-2 text-sm text-gray-600">
                  {course.credits}
                </td>

                <td className="px-4 py-2 text-sm">
                  <span
                    className={`font-medium ${
                      course.grade === 'F'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {course.grade}
                  </span>
                </td>

                <td className="px-4 py-2 text-sm">
                  {course.grade === 'R' ? (
  <span className="text-red-600 font-semibold">
    Arrear
  </span>
) : (
  <span className="text-green-600">
    Cleared
  </span>
)}

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};