import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface SubmitSuccessProps {
  onReset: () => void;
  language: Language;
}

const SubmitSuccess: React.FC<SubmitSuccessProps> = ({ onReset, language }) => {
  const t = (key: string) => translations[key][language];
  
  return (
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
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('thankYou')}</h2>
        <p className="text-gray-300">
          {t('responsesRecorded')}
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-300 mb-6">
          {t('appreciationMessage')}
        </p>
        
        <button
          onClick={onReset}
          className="btn btn-primary"
        >
          {t('newEvaluation')}
        </button>
      </div>
    </motion.div>
  );
};

export default SubmitSuccess;