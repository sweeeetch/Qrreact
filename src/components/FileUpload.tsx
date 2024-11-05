import React from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onUpload: (attendees: Map<string, { email: string; presence: number }>) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: { email: string }[] = XLSX.utils.sheet_to_json(firstSheet);

      const newAttendees = new Map();
      jsonData.forEach(row => {
        if (row.email) {
          newAttendees.set(row.email.toLowerCase(), {
            email: row.email.toLowerCase(),
            presence: 0
          });
        }
      });

      onUpload(newAttendees);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full">
      <label className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-300 cursor-pointer hover:bg-gray-50">
        <Upload className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm text-gray-600">Upload Excel File</span>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}