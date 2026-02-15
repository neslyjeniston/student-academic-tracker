import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { Student } from "../types";
import { calculateSemesterGPA, calculateCGPA } from "./gradeCalculator";

export const generateStudentReport = (student: Student) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // --- 1. Header & Branding ---
  doc.setFillColor(30, 41, 59); 
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("ACADEMIC PERFORMANCE REPORT", margin, 20);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString();
  doc.text(`Report Issued: ${dateStr}`, margin, 30);

  // --- 2. Student Details ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  const infoY = 50;
  
  doc.setFont("helvetica", "bold"); doc.text("Student:", margin, infoY);
  doc.setFont("helvetica", "normal"); doc.text(student.name, margin + 20, infoY);
  
  doc.setFont("helvetica", "bold"); doc.text("Roll No:", margin, infoY + 7);
  doc.setFont("helvetica", "normal"); doc.text(student.rollNumber, margin + 20, infoY + 7);

  let yPosition = infoY + 25;

  // --- 3. Semester Data Iteration ---
  student.semesters.forEach((semester) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text(`SEMESTER ${semester.semesterNumber}`, margin, yPosition);
    
    const sgpa = calculateSemesterGPA(semester);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`SGPA: ${sgpa.toFixed(2)}`, pageWidth - 35, yPosition);

    // FIX 1: Casting tuples and literal types for RowInput compatibility
    const tableData: RowInput[] = semester.courses.map(course => [
      course.name,
      course.credits,
      { 
        content: course.grade, 
        styles: { 
          fontStyle: 'bold' as 'bold',
          textColor: (course.grade === "R" ? [220, 38, 38] : [30, 41, 59]) as [number, number, number] 
        } 
      },
      {
        content: course.grade === "R" ? "ARREAR" : "CLEARED",
        styles: {
          textColor: (course.grade === "R" ? [220, 38, 38] : [22, 163, 74]) as [number, number, number]
        }
      }
    ]);

    autoTable(doc, {
      startY: yPosition + 4,
      head: [["Course Name", "Credits", "Grade", "Status"]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  });

  // --- 4. Final CGPA Summary ---
  const cgpa = calculateCGPA(student.semesters);
  if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = 20; }

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, yPosition, pageWidth - (margin * 2), 20, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Overall CGPA: ${cgpa.toFixed(2)}`, margin + 5, yPosition + 12);

  // --- 5. Footer & Page Numbers ---
  // FIX 2: Using the direct method instead of .internal.getNumberOfPages()
  const totalPages = doc.getNumberOfPages(); 
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  doc.save(`${student.rollNumber}_MarkReport.pdf`);
};