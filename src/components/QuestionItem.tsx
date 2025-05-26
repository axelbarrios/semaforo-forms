import React from 'react';
import { motion } from 'framer-motion';
import { Question, Language } from '../types';
import { translations } from '../translations';

interface QuestionItemProps {
  question: Question;
  value: number | null;
  onChange: (id: number, value: number) => void;
  language: Language;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, value, onChange, language }) => {
  // Lista de preguntas con puntuación invertida
  const invertedQuestions = [1,  2, 3, 4, 6, 7, 10, 19, 21, 30, 31, 33, 45, 49, 50, 52, 63, 65, 66, 68, 75];
  const isInverted = invertedQuestions.includes(question.id);
  const t = (key: string) => translations[key][language];

  // Opciones de respuesta con sus valores
  const options = isInverted 
    ? [
        { label: t('totallyAgree'), value: 1 },
        { label: t('agree'), value: 2 },
        { label: t('disagree'), value: 3 },
        { label: t('totallyDisagree'), value: 4 },
      ]
    : [
        { label: t('totallyAgree'), value: 4 },
        { label: t('agree'), value: 3 },
        { label: t('disagree'), value: 2 },
        { label: t('totallyDisagree'), value: 1 },
      ];

  return (
    <motion.div 
      className="mb-6 bg-[#2d2d2d] p-4 rounded-lg shadow-sm text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3">
        <p className="text-sm md:text-base font-medium">{question.id}. {question.text}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {options.map((option) => (
          <div 
            key={option.value} 
            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
              value === option.value 
                ? 'bg-indigo-900 border border-indigo-700' 
                : 'bg-[#1f1f1f] border border-gray-700 hover:bg-[#333333]'
            }`}
            onClick={() => onChange(question.id, option.value)}
          >
            <input
              type="radio"
              id={`q${question.id}-${option.value}`}
              name={`question-${question.id}`}
              className="radio-button mr-2"
              checked={value === option.value}
              onChange={() => onChange(question.id, option.value)}
            />
            <label 
              htmlFor={`q${question.id}-${option.value}`}
              className="text-xs md:text-sm cursor-pointer flex-1 text-gray-300"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionItem;