import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { translations } from '../translations';

interface FormHeaderProps {
  spouse: 'husband' | 'wife';
  onToggleSpouse: () => void;
  showInstructions?: boolean;
  language: Language;
}

const FormHeader: React.FC<FormHeaderProps> = ({ spouse, onToggleSpouse, showInstructions = false, language }) => {
  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    return translations[key][language];
  };
  
  return (
    <motion.div 
      className="form-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo REM */}
      <div className="flex justify-center mb-6">
        <img 
          src="https://matrimoniosrem.com/wp-content/uploads/2021/07/REM_NUEVO-04-2048x825.png" 
          alt="Logo REM" 
          className="w-full max-w-md h-auto"
        />
      </div>
      
      <div className="flex justify-center items-center mb-4">
        <Heart className="text-red-500 w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">{t('appTitle')}</h1>
      </div>
      
      <p className="text-gray-300 mb-6">
        {t('appDescription')}
      </p>
      
      <div className="bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-8 text-white">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 text-center">
          {spouse === 'husband' ? t('husbandForm') : t('wifeForm')}
        </h2>
      </div>
      
      {showInstructions && (
        <div className="bg-[#2d2d2d] p-4 rounded-lg border border-gray-600 mb-6 text-white">
          <div className="flex justify-between items-center mb-4 bg-[#2d2d2d] p-3 rounded-lg text-white">
           <p>axel</p>
            <div className="text-center flex-1">
              <p className="font-medium">{t('totallyAgree')}</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-medium">{t('agree')}</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-medium">{t('disagree')}</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-medium">{t('totallyDisagree')}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FormHeader;