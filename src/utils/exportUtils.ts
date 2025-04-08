
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Report } from '@/types';

// Helper function to convert reports to CSV
const convertToCSV = (reports: Report[]) => {
  // Define column headers
  const headers = ['ID', 'Employee', 'Department', 'Tasks', 'Meetings', 'Challenges', 'Date Submitted'];
  
  // Convert reports to CSV rows
  const csvRows = reports.map(report => {
    return [
      report.id,
      report.userName || `User ${report.userId}`,
      report.department,
      report.tasks?.replace(/"/g, '""').replace(/\n/g, ' ') || '',
      report.meetings?.replace(/"/g, '""').replace(/\n/g, ' ') || '',
      report.challenges?.replace(/"/g, '""').replace(/\n/g, ' ') || '',
      new Date(report.dateSubmitted).toLocaleDateString()
    ];
  });
  
  // Combine headers and rows
  const allRows = [headers, ...csvRows];
  
  // Convert to CSV string
  const csvContent = allRows.map(row => 
    row.map(cell => 
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(',')
  ).join('\n');
  
  return csvContent;
};

// Function to export reports as CSV
export const exportToCSV = (reports: Report[], fileName = 'camma_reports') => {
  const csvContent = convertToCSV(reports);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${fileName}.csv`);
};

// Function to export reports as PDF
export const exportToPDF = (reports: Report[], fileName = 'camma_reports') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(229, 0, 20); // CAMMA Red
  doc.text('CAMMA Report Central', 14, 22);
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Reports Export - ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Generate table
  (doc as any).autoTable({
    startY: 35,
    head: [['ID', 'Employee', 'Department', 'Date Submitted']],
    body: reports.map(report => [
      report.id,
      report.userName || `User ${report.userId}`,
      report.department,
      new Date(report.dateSubmitted).toLocaleDateString()
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [229, 0, 20], // CAMMA Red
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    margin: { top: 35 }
  });
  
  // For each report, add details on separate pages
  reports.forEach((report, index) => {
    if (index > 0) {
      doc.addPage();
    } else {
      doc.addPage();
    }
    
    // Report header
    doc.setFontSize(14);
    doc.setTextColor(229, 0, 20); // CAMMA Red
    doc.text(`Report #${report.id}`, 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Employee: ${report.userName || `User ${report.userId}`}`, 14, 30);
    doc.text(`Department: ${report.department}`, 14, 37);
    doc.text(`Date: ${new Date(report.dateSubmitted).toLocaleDateString()}`, 14, 44);
    
    // Report content
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Tasks:', 14, 55);
    const taskLines = doc.splitTextToSize(report.tasks || 'None specified', 180);
    doc.text(taskLines, 14, 62);
    
    const meetingsY = 62 + (taskLines.length * 7);
    doc.text('Meetings:', 14, meetingsY);
    const meetingsLines = doc.splitTextToSize(report.meetings || 'None specified', 180);
    doc.text(meetingsLines, 14, meetingsY + 7);
    
    const challengesY = meetingsY + 7 + (meetingsLines.length * 7);
    doc.text('Challenges:', 14, challengesY);
    const challengesLines = doc.splitTextToSize(report.challenges || 'None specified', 180);
    doc.text(challengesLines, 14, challengesY + 7);
  });
  
  // Save the PDF
  doc.save(`${fileName}.pdf`);
};
