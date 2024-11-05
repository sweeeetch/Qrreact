import React, { useState } from 'react';
import { QrCode, Download } from 'lucide-react';
import { Scanner } from './components/Scanner';
import { AttendanceStatus } from './components/AttendanceStatus';
import { FileUpload } from './components/FileUpload';
import { ExportButton } from './components/ExportButton';

interface Attendee {
  email: string;
  presence: number;
  lastScanned?: Date;
}

function App() {
  const [attendees, setAttendees] = useState<Map<string, Attendee>>(new Map());
  const [scanResult, setScanResult] = useState<{
    email: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    const email = decodedText.trim().toLowerCase();
    
    if (attendees.has(email)) {
      const attendee = attendees.get(email)!;
      const now = new Date();
      
      if (!attendee.lastScanned || (now.getTime() - attendee.lastScanned.getTime()) > 60000) {
        const updatedAttendees = new Map(attendees);
        updatedAttendees.set(email, {
          ...attendee,
          presence: attendee.presence + 1,
          lastScanned: now
        });
        
        setAttendees(updatedAttendees);
        setScanResult({
          email,
          status: 'success',
          message: `Attendance recorded! Count: ${attendee.presence + 1}`
        });
      } else {
        setScanResult({
          email,
          status: 'error',
          message: 'Please wait 1 minute between scans'
        });
      }
    } else {
      setScanResult({
        email,
        status: 'error',
        message: 'Email not registered in the system'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            QR Code Attendance System
          </h1>

          <div className="space-y-6">
            {attendees.size === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Upload Attendee List
                </h2>
                <FileUpload onUpload={setAttendees} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  {!isScanning ? (
                    <button
                      onClick={() => setIsScanning(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <QrCode className="w-5 h-5" />
                      Scan Now
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsScanning(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Close Scanner
                    </button>
                  )}
                  <ExportButton attendees={attendees} />
                </div>

                {isScanning && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Scanner
                      onScanSuccess={handleScanSuccess}
                      isScanning={isScanning}
                    />
                  </div>
                )}

                <AttendanceStatus scanResult={scanResult} />

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Registered Attendees: {attendees.size}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="font-medium text-gray-600">Email</div>
                      <div className="font-medium text-gray-600">Presence</div>
                      {Array.from(attendees.values()).map((attendee) => (
                        <React.Fragment key={attendee.email}>
                          <div className="text-gray-800">{attendee.email}</div>
                          <div className="text-gray-800">{attendee.presence}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;