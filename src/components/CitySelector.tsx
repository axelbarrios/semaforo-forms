import React from 'react';
import { motion } from 'framer-motion';
import { remCities } from '../config/cities';

interface CitySelectorProps {
  onSelectCity: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onSelectCity }) => {
  return (
    <div className="flex items-center justify-center min-h-screen absolute inset-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-white"
      >
        {/* Logo REM */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://matrimoniosrem.com/wp-content/uploads/2021/07/REM_NUEVO-04-2048x825.png" 
            alt="Logo REM" 
            className="w-full max-w-md h-auto"
          />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Seleccione su ciudad REM</h2>
          
          <div className="max-w-md mx-auto">
            <select
              onChange={(e) => onSelectCity(e.target.value)}
              className="w-full p-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Seleccione una ciudad</option>
              {remCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CitySelector;