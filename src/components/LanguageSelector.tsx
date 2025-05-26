import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { translations } from '../translations';

interface LanguageSelectorProps {
  onSelectLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
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
          <h2 className="text-xl font-bold text-white mb-6">
            {translations.selectLanguage.es} / {translations.selectLanguage.pt} / {translations.selectLanguage.en}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1f1f1f] p-6 rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              onClick={() => onSelectLanguage('es')}
            >
              <div className="flex justify-center mb-4">
                <img 
                  src="https://flagcdn.com/w320/es.png" 
                  alt="Bandera de España" 
                  className="w-24 h-auto rounded-md shadow-md"
                />
              </div>
              <p className="text-xl font-medium text-center">{translations.spanish.es}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1f1f1f] p-6 rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              onClick={() => onSelectLanguage('pt')}
            >
              <div className="flex justify-center mb-4">
                <img 
                  src="https://flagcdn.com/w320/br.png" 
                  alt="Bandeira do Brasil" 
                  className="w-24 h-auto rounded-md shadow-md"
                />
              </div>
              <p className="text-xl font-medium text-center">{translations.portuguese.es}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1f1f1f] p-6 rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              onClick={() => onSelectLanguage('en')}
            >
              <div className="flex justify-center mb-4">
                <img 
                  src="https://flagcdn.com/w320/us.png" 
                  alt="United States Flag" 
                  className="w-24 h-auto rounded-md shadow-md"
                />
              </div>
              <p className="text-xl font-medium text-center">{translations.english.es}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;