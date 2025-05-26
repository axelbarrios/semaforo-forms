import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, Factor } from '../types';
import { translations } from '../translations';
import ProgressBar from './ProgressBar';

interface StickyHeaderProps {
  spouse: 'husband' | 'wife';
  language: Language;
  isVisible: boolean;
  current: number;
  total: number;
  currentFactor?: Factor;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ 
  spouse, 
  language, 
  isVisible,
  current,
  total,
  currentFactor
}) => {
  const t = (key: string) => translations[key][language];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#3F3F3F]/90 backdrop-blur-sm shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col items-center justify-between mb-2">
              <div className="flex items-center justify-between w-full mb-2">
                <img 
                  src="https://matrimoniosrem.com/wp-content/uploads/2021/07/REM_NUEVO-04-2048x825.png" 
                  alt="Logo REM" 
                  className="h-8 md:h-10 lg:h-12 w-auto"
                />
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
                  {spouse === 'husband' ? t('husbandForm') : t('wifeForm')}
                </h2>
              </div>
              {currentFactor && (
                <div className="w-full text-center">
                  <h3 className="text-sm md:text-base lg:text-lg text-indigo-300 font-medium">
                    {t('factorToEvaluate')} {t(currentFactor)}
                  </h3>
                </div>
              )}
            </div>
            <div className="px-4">
              <ProgressBar 
                current={current} 
                total={total} 
                language={language}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyHeader;