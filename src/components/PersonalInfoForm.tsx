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

  // Function to format name as proper case
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

  // Handle name change with proper case formatting
  const handleNameChange = (value: string) => {
    onChange('name', formatName(value));
  };

  // Handle numeric field changes
  const handleNumericChange = (field: keyof PersonalInfo, value: string) => {
    onChange(field, validateNumeric(value));
  };

  const getMaritalStatusOptions = () => {
    if (spouse === 'husband') {
      return ['Soltero', 'Casado', 'Comprometido'];
    }
    return ['Soltera', 'Casada', 'Comprometida'];
  };

  const childrenOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  const formFields = [
    { 
      id: 'name', 
      label: t('fullName'), 
      type: 'text', 
      required: true,
      onChange: handleNameChange 
    },
    { 
      id: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      value: email,
      onChange: onEmailChange
    },
    { 
      id: 'age', 
      label: t('age'), 
      type: 'number', 
      required: true,
      onChange: (value: string) => handleNumericChange('age', value)
    },
    { 
      id: 'ocupacion', 
      label: t('occupation'), 
      type: 'text', 
      required: true 
    },
    { 
      id: 'religion', 
      label: t('religion'), 
      type: 'text', 
      required: true 
    },
    { 
      id: 'education', 
      label: t('education'), 
      type: 'text', 
      required: false 
    },
    { 
      id: 'maritalStatus', 
      label: t('maritalStatus'), 
      type: 'select', 
      required: true,
      options: getMaritalStatusOptions()
    },
    { 
      id: 'timeAsCouple', 
      label: t('timeAsCouple'), 
      type: 'number', 
      required: false,
      onChange: (value: string) => handleNumericChange('timeAsCouple', value)
    },
    { 
      id: 'previousMarriages', 
      label: t('previousMarriages'), 
      type: 'number', 
      required: false,
      onChange: (value: string) => handleNumericChange('previousMarriages', value)
    },
    { 
      id: 'numberOfChildren', 
      label: t('numberOfChildren'), 
      type: 'select', 
      required: false,
      options: childrenOptions
    },
    { 
      id: 'spouseEmail', 
      label: spouse === 'husband' ? t('wifeEmail') : t('husbandEmail'), 
      type: 'email', 
      required: true 
    },
  ];

  const renderField = (field: any) => {
    const commonProps = {
      id: field.id,
      required: field.required,
      disabled: readOnly,
      className: `w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[#1f1f1f] text-white ${
        readOnly ? 'bg-[#1a1a1a] cursor-not-allowed' : ''
      }`
    };

    return (
      <div key={field.id} className="mb-3">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">
          {field.label}{field.required && <span className="text-red-500">*</span>}
        </label>
        
        {field.type === 'select' ? (
          <select
            {...commonProps}
            value={personalInfo[field.id as keyof PersonalInfo] || ''}
            onChange={(e) => onChange(field.id as keyof PersonalInfo, e.target.value)}
          >
            <option value="">{`Seleccione ${field.label.toLowerCase()}`}</option>
            {field.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            {...commonProps}
            value={field.value !== undefined ? field.value : personalInfo[field.id as keyof PersonalInfo] || ''}
            onChange={(e) => {
              if (field.onChange) {
                field.onChange(e.target.value);
              } else {
                onChange(field.id as keyof PersonalInfo, e.target.value);
              }
            }}
            placeholder={`${field.label.toLowerCase()}`}
          />
        )}
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