import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { translations } from '../translations';

interface ProgressBarProps {
  current: number;
  total: number;
  language: Language;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, language }) => {
  const percentage = Math.round((current / total) * 100);
  const t = (key: string) => translations[key][language];
  
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{t('progress')}</span>
        <span className="text-sm font-medium text-gray-300">{percentage}%</span>
      </div>
      <div className="h-2 bg-[#2d2d2d] rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-indigo-600"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;