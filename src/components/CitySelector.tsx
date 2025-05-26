import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { countries, citiesByCountry } from '../config/cities';
import { Language } from '../types';
import { translations } from '../translations';

interface CitySelectorProps {
  onSelectCity: (city: string, country: string) => void;
  language?: Language;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onSelectCity, language = 'es' }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const t = (key: string) => translations[key][language];

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    setSelectedCountry(country);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    if (city && selectedCountry) {
      onSelectCity(city, selectedCountry);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen absolute inset-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-white"
      >
        <div className="flex justify-center mb-6">
          <img 
            src="https://matrimoniosrem.com/wp-content/uploads/2021/07/REM_NUEVO-04-2048x825.png" 
            alt="Logo REM" 
            className="w-full max-w-md h-auto"
          />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{t('selectRemCity')}</h2>
          
          <div className="max-w-md mx-auto space-y-4">
            {/* Country Selection */}
            <div>
              <select
                onChange={handleCountryChange}
                value={selectedCountry}
                className="w-full p-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">{t('selectCountry')}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selection */}
            <div>
              <select
                onChange={handleCityChange}
                disabled={!selectedCountry}
                className="w-full p-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{t('selectCity')}</option>
                {selectedCountry && citiesByCountry[selectedCountry]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CitySelector;