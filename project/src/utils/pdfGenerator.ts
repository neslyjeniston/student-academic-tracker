import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Student } from "../types";
import { calculateSemesterGPA, calculateCGPA } from "./gradeCalculator";

export const generateStudentReport = (student: Student) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Academic Mark Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Name: ${student.name}`, 14, 30);
  doc.text(`Roll No: ${student.rollNumber}`, 14, 36);
  doc.text(`Department: ${student.department}`, 14, 42);
  doc.text(`Batch: ${student.batch}`, 14, 48);

  let yPosition = 60;

  student.semesters.forEach((semester, index) => {
    doc.setFontSize(14);
    doc.text(`Semester ${semester.semesterNumber}`, 14, yPosition);

    const tableData = semester.courses.map(course => [
      course.name,
      course.credits,
      course.grade,
      course.grade === "R" ? "Arrear" : "Cleared",
    ]);

    autoTable(doc, {
      startY: yPosition + 5,
      head: [["Course", "Credits", "Grade", "Status"]],
      body: tableData,
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    const gpa = calculateSemesterGPA(semester);
    doc.text(`Semester GPA: ${gpa}`, 14, yPosition);

    yPosition += 10;
  });

  const cgpa = calculateCGPA(student.semesters);
  doc.setFontSize(14);
  doc.text(`Overall CGPA: ${cgpa}`, 14, yPosition + 10);

  doc.save(`${student.rollNumber}_MarkReport.pdf`);
};
