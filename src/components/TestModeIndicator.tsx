import React from 'react';
import { AlertTriangle } from 'lucide-react';

const TestModeIndicator: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-600 text-white p-2 text-center z-50 flex items-center justify-center">
      <AlertTriangle className="w-5 h-5 mr-2" />
      <span className="font-medium">MODO DE PRUEBA: Los datos no se envían a Google Sheets</span>
    </div>
  );
};

export default TestModeIndicator;