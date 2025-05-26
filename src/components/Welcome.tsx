import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { translations } from '../translations';

interface WelcomeProps {
  onNext: () => void;
  language: Language;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext, language }) => {
  const t = (key: string) => translations[key][language];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-8 text-white"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{t('welcomeTitle')}</h2>
      </div>

      <div className="space-y-4 text-gray-300">
        <p className="font-medium">{t('welcomeGreeting')}</p>
        
        <p>{t('welcomeParagraph1')}</p>
        <p>{t('welcomeParagraph2')}</p>
        <p>{t('welcomeParagraph3')}</p>
        <p>{t('welcomeParagraph4')}</p>
        <p>{t('welcomeThanks')}</p>
        
        <div className="mt-6">
          <p className="font-medium">{t('sincerely')}</p>
          <p>{t('pastorName')}</p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={onNext}
          className="btn btn-primary"
        >
          {t('startEvaluation')}
        </button>
      </div>
    </motion.div>
  );
};

export default Welcome;