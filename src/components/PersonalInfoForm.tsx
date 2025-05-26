import React from 'react';
import { motion } from 'framer-motion';
import { PersonalInfo, Language } from '../types';
import { translations } from '../translations';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  isComplete: boolean;
  readOnly?: boolean;
  email?: string;
  onEmailChange?: (email: string) => void;
  spouse?: 'husband' | 'wife';
  language: Language;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  personalInfo, 
  onChange,
  isComplete,
  readOnly = false,
  email = '',
  onEmailChange,
  spouse = 'husband',
  language
}) => {
  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    return translations[key][language];
  };
  
  const formFields = [
    { id: 'date', label: t('date'), type: 'date', required: true },
    { id: 'name', label: t('fullName'), type: 'text', required: true },
    { id: 'age', label: t('age'), type: 'text', required: true },
    { id: 'ocupacion', label: t('occupation'), type: 'text', required: true },
    { id: 'religion', label: t('religion'), type: 'text', required: true },
    { id: 'education', label: t('education'), type: 'text', required: false },
    { id: 'maritalStatus', label: t('maritalStatus'), type: 'text', required: false },
    { id: 'timeAsCouple', label: t('timeAsCouple'), type: 'text', required: false },
    { id: 'previousMarriages', label: t('previousMarriages'), type: 'text', required: false },
    { id: 'numberOfChildren', label: t('numberOfChildren'), type: 'text', required: false },
    { 
      id: 'spouseEmail', 
      label: spouse === 'husband' ? t('wifeEmail') : t('husbandEmail'), 
      type: 'text', 
      required: true 
    },
  ];

  const renderField = (field: { id: string; label: string; type: string; required: boolean }) => (
    <div key={field.id} className="mb-3">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">
        {field.label}{field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={field.type}
        id={field.id}
        value={personalInfo[field.id as keyof PersonalInfo] || ''}
        onChange={(e) => onChange(field.id as keyof PersonalInfo, e.target.value)}
        className={`w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[#1f1f1f] text-white ${
          readOnly ? 'bg-[#1a1a1a] cursor-not-allowed' : ''
        }`}
        placeholder={`${field.label.toLowerCase()}`}
        required={field.required}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );

  return (
    <motion.div 
      className={`bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-8 text-white ${readOnly ? 'opacity-75' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">{t('generalInfo')}</h2>
      
      {/* Email warning message */}
      <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
        <p className="text-yellow-200 text-sm">
          {t('emailWarning')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map(renderField)}
        
        {/* Campo de correo electrónico */}
        <div className="mb-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            {t('yourEmail')}<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => onEmailChange && onEmailChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[#1f1f1f] text-white ${
              readOnly ? 'bg-[#1a1a1a] cursor-not-allowed' : ''
            }`}
            placeholder={spouse === 'husband' ? t('husbandEmailPlaceholder') : t('wifeEmailPlaceholder')}
            required
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
      </div>
      
      {!readOnly && (
        <div className="mt-4 text-sm text-gray-400">
          <p>{t('requiredFields')}</p>
        </div>
      )}
    </motion.div>
  );
};

export default PersonalInfoForm;