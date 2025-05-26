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

  // Function to format name in proper case
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to validate numeric input
  const validateNumeric = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleNameChange = (value: string) => {
    onChange('name', formatName(value));
  };

  const handleAgeChange = (value: string) => {
    const numericValue = validateNumeric(value);
    onChange('age', numericValue);
  };

  const handleTimeAsCoupleChange = (value: string) => {
    const numericValue = validateNumeric(value);
    onChange('timeAsCouple', numericValue);
  };

  // Get marital status options based on spouse type
  const getMaritalStatusOptions = () => {
    if (spouse === 'husband') {
      return ['Soltero', 'Casado', 'Comprometido'];
    }
    return ['Soltera', 'Casada', 'Comprometida'];
  };

  const formFields = [
    { 
      id: 'name', 
      label: t('fullName'), 
      type: 'text', 
      required: true,
      onChange: handleNameChange,
      value: personalInfo.name
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      value: email,
      onChange: (value: string) => onEmailChange && onEmailChange(value)
    },
    { 
      id: 'age', 
      label: t('age'), 
      type: 'text', 
      required: true,
      onChange: handleAgeChange,
      value: personalInfo.age
    },
    { 
      id: 'ocupacion', 
      label: t('occupation'), 
      type: 'text', 
      required: true,
      value: personalInfo.ocupacion
    },
    { 
      id: 'religion', 
      label: t('religion'), 
      type: 'text', 
      required: true,
      value: personalInfo.religion
    },
    { 
      id: 'education', 
      label: t('education'), 
      type: 'text', 
      required: false,
      value: personalInfo.education
    },
    { 
      id: 'maritalStatus', 
      label: t('maritalStatus'), 
      type: 'select', 
      required: true,
      value: personalInfo.maritalStatus,
      options: getMaritalStatusOptions()
    },
    { 
      id: 'timeAsCouple', 
      label: t('timeAsCouple'), 
      type: 'text', 
      required: false,
      onChange: handleTimeAsCoupleChange,
      value: personalInfo.timeAsCouple
    },
    { 
      id: 'numberOfChildren', 
      label: t('numberOfChildren'), 
      type: 'select', 
      required: false,
      value: personalInfo.numberOfChildren,
      options: ['1', '2', '3', '4', '5', '6', '7', '8']
    },
    { 
      id: 'spouseEmail', 
      label: spouse === 'husband' ? t('wifeEmail') : t('husbandEmail'), 
      type: 'email', 
      required: true,
      value: personalInfo.spouseEmail
    },
  ];

  const renderField = (field: any) => {
    if (field.type === 'select') {
      return (
        <div key={field.id} className="mb-3">
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">
            {field.label}{field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            id={field.id}
            value={field.value}
            onChange={(e) => onChange(field.id as keyof PersonalInfo, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[#1f1f1f] text-white ${
              readOnly ? 'bg-[#1a1a1a] cursor-not-allowed' : ''
            }`}
            required={field.required}
            disabled={readOnly}
          >
            <option value="">{`Seleccione ${field.label.toLowerCase()}`}</option>
            {field.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.id} className="mb-3">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">
          {field.label}{field.required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={field.type}
          id={field.id}
          value={field.value}
          onChange={(e) => field.onChange ? field.onChange(e.target.value) : onChange(field.id as keyof PersonalInfo, e.target.value)}
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
  };

  return (
    <motion.div 
      className={`bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-8 text-white ${readOnly ? 'opacity-75' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">{t('generalInfo')}</h2>
      
      <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
        <p className="text-yellow-200 text-sm">
          {t('emailWarning')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map(renderField)}
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