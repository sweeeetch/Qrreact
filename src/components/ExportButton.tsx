import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  attendees: Map<string, { email: string; presence: number }>;
}

export function ExportButton({ attendees }: ExportButtonProps) {
  const handleExport = () => {
    const data = Array.from(attendees.values()).map(({ email, presence }) => ({
      email,
      presence
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    XLSX.writeFile(workbook, 'attendance.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Download className="w-4 h-4" />
      Export Attendance
    </button>
  );
}