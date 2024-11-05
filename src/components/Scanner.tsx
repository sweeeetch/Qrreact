import React from 'react';
import { Camera } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
  onScanSuccess: (text: string) => void;
  isScanning: boolean;
}

export function Scanner({ onScanSuccess, isScanning }: ScannerProps) {
  React.useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        onScanSuccess,
        (error) => console.error(error)
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isScanning, onScanSuccess]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="reader" className="rounded-lg overflow-hidden"></div>
    </div>
  );
}