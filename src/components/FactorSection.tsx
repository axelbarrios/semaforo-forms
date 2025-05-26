import React from 'react';
import { motion } from 'framer-motion';
import { Factor, Language } from '../types';
import { getFactorQuestions } from '../utils';
import QuestionItem from './QuestionItem';
import { translations } from '../translations';

interface FactorSectionProps {
  factor: Factor;
  answers: Record<number, number>;
  onAnswerChange: (id: number, value: number) => void;
  language: Language;
}

const FactorSection: React.FC<FactorSectionProps> = ({ factor, answers, onAnswerChange, language }) => {
  const questions = getFactorQuestions(factor, language);
  const t = (key: string) => translations[key][language];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="factor-heading text-center">{t('factorToEvaluate')} {t(factor)}</h3>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            value={answers[question.id] || null}
            onChange={onAnswerChange}
            language={language}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FactorSection;