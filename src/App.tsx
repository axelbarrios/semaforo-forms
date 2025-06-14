import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factor, FormData, FactorScore, PersonalInfo, Language } from './types';
import { questions } from './questions';
import { calculateScore, submitToGoogleSheets } from './utils';
import FormHeader from './components/FormHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import FactorSection from './components/FactorSection';
import ProgressBar from './components/ProgressBar';
import SubmitSuccess from './components/SubmitSuccess';
import Welcome from './components/Welcome';
import LanguageSelector from './components/LanguageSelector';
import StickyHeader from './components/StickyHeader';
import CitySelector from './components/CitySelector';
import GenderSelector from './components/GenderSelector';
import { translations } from './translations';

function App() {
  const [formData, setFormData] = useState<FormData>({
    spouse: 'husband',
    name: '',
    email: '',
    language: 'es',
    remCity: '',
    personalInfo: {
      name: '',
      age: '',
      ocupacion: '',
      religion: '',
      education: '',
      pais: '',
      ciudad: '',
      maritalStatus: '',
      timeAsCouple: '',
      previousMarriages: '',
      numberOfChildren: '',
      spouseEmail: ''
    },
    answers: {},
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentFormStep, setCurrentFormStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scores, setScores] = useState<FactorScore[]>([]);
  const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(true);
  const [showCitySelector, setShowCitySelector] = useState<boolean>(false);
  const [showGenderSelector, setShowGenderSelector] = useState<boolean>(false);
  const [showStickyHeader, setShowStickyHeader] = useState<boolean>(false);

  const factors: Factor[] = [
    'CONSENSO',
    'SATISFACCION',
    'COHESION',
    'EXPRESION DE AFECTO',
    'CONEXION SEXUAL',
  ];

  const totalSteps = factors.length;
  const currentFactor = factors[currentStep];

  const answeredQuestions = Object.keys(formData.answers).length;
  const totalQuestions = questions.length;
  const progress = answeredQuestions / totalQuestions;

  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    return translations[key][formData.language];
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 0.25;

      setShowStickyHeader(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentFormStep, currentStep]);

  const handleAnswerChange = (id: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [id]: value,
      },
    }));
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ 
      ...prev, 
      name,
      personalInfo: {
        ...prev.personalInfo,
        name
      }
    }));
  };

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));

    if (field === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value
      }));
    }
  };

  const handleToggleSpouse = () => {
    setFormData(prev => ({
      ...prev,
      spouse: prev.spouse === 'husband' ? 'wife' : 'husband',
    }));
  };

  const handleSelectLanguage = (language: Language) => {
    setFormData(prev => ({
      ...prev,
      language
    }));
    setShowLanguageSelector(false);
    setShowCitySelector(true);
  };

  const handleSelectCity = (city: string, country: string) => {
    setFormData(prev => ({
      ...prev,
      remCity: city,
      personalInfo: {
        ...prev.personalInfo,
        ciudad: city,
        pais: country
      }
    }));
    setShowCitySelector(false);
    setShowGenderSelector(true);
  };

  const handleSelectGender = (gender: 'husband' | 'wife') => {
    setFormData(prev => ({
      ...prev,
      spouse: gender
    }));
    setShowGenderSelector(false);
    setCurrentFormStep(0);
  };

  const handleNext = () => {
    if (currentFormStep < 2) {
      setCurrentFormStep(prev => prev + 1);
      setCurrentStep(0);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (currentFormStep > 0) {
      setCurrentFormStep(prev => prev - 1);
      setShowPersonalInfo(true);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      alert(t('invalidEmailAlert'));
      return;
    }

    if (!formData.personalInfo.spouseEmail || !isValidEmail(formData.personalInfo.spouseEmail)) {
      alert(t('invalidSpouseEmailAlert'));
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitToGoogleSheets(formData);

      if (success) {
        const calculatedScores = calculateScore(formData);
        setScores(calculatedScores);
        setIsSubmitted(true);
        scrollToTop();
      } else {
        alert(t('submitError'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      spouse: 'husband',
      name: '',
      email: '',
      language: 'es',
      remCity: '',
      personalInfo: {
        name: '',
        age: '',
        ocupacion: '',
        religion: '',
        education: '',
        pais: '',
        ciudad: '',
        maritalStatus: '',
        timeAsCouple: '',
        previousMarriages: '',
        numberOfChildren: '',
        spouseEmail: ''
      },
      answers: {},
    });
    setCurrentStep(0);
    setCurrentFormStep(0);
    setIsSubmitted(false);
    setScores([]);
    setShowPersonalInfo(true);
    setShowLanguageSelector(true);
    setShowCitySelector(false);
    setShowGenderSelector(false);
    scrollToTop();
  };

  const isCurrentFactorComplete = () => {
    const factorQuestions = questions.filter(q => q.factor === currentFactor);
    return factorQuestions.every(q => formData.answers[q.id] !== undefined);
  };

  const isPersonalInfoComplete = () => {
    const requiredFields: (keyof PersonalInfo)[] = [
      'name',
      'age',
      'ocupacion',
      'religion',
      'maritalStatus',
      'spouseEmail'
    ];
    const allRequiredFieldsFilled = requiredFields.every(field => formData.personalInfo[field]);
    const validMainEmail = formData.email && isValidEmail(formData.email);
    const validSpouseEmail = formData.personalInfo.spouseEmail && isValidEmail(formData.personalInfo.spouseEmail);

    return allRequiredFieldsFilled && validMainEmail && validSpouseEmail;
  };

  const renderCurrentStep = () => {
    if (showLanguageSelector) {
      return <LanguageSelector onSelectLanguage={handleSelectLanguage} />;
    }

    if (showCitySelector) {
      return <CitySelector onSelectCity={handleSelectCity} language={formData.language} />;
    }

    if (showGenderSelector) {
      return <GenderSelector onSelectGender={handleSelectGender} language={formData.language} />;
    }

    if (currentFormStep === 0) {
      return <Welcome onNext={handleNext} language={formData.language} />;
    }

    if (currentFormStep === 1) {
      return (
        <PersonalInfoForm 
          personalInfo={formData.personalInfo}
          onChange={handlePersonalInfoChange}
          isComplete={isPersonalInfoComplete()}
          email={formData.email}
          onEmailChange={handleEmailChange}
          spouse={formData.spouse}
          language={formData.language}
        />
      );
    }

    return (
      <>
        {!showStickyHeader && (
          <ProgressBar 
            current={answeredQuestions} 
            total={totalQuestions} 
            language={formData.language} 
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <FactorSection
              factor={currentFactor}
              answers={formData.answers}
              onAnswerChange={handleAnswerChange}
              language={formData.language}
            />
          </motion.div>
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className={`min-h-screen bg-[#3F3F3F] py-8 px-4 ${showLanguageSelector || showCitySelector || showGenderSelector ? 'p-0' : ''}`}>
      {!showLanguageSelector && !showCitySelector && !showGenderSelector && !isSubmitted && currentFormStep === 2 && (
        <StickyHeader 
          spouse={formData.spouse}
          language={formData.language}
          isVisible={showStickyHeader}
          current={answeredQuestions}
          total={totalQuestions}
          currentFactor={currentFactor}
        />
      )}

      {!isSubmitted ? (
        <div className={`${showLanguageSelector || showCitySelector || showGenderSelector ? '' : 'form-container'}`}>
          {!showLanguageSelector && !showCitySelector && !showGenderSelector && (
            <FormHeader 
              spouse={formData.spouse} 
              onToggleSpouse={handleToggleSpouse} 
              showInstructions={currentFormStep === 2}
              language={formData.language}
            />
          )}

          {renderCurrentStep()}

          {currentFormStep > 0 && !showLanguageSelector && !showCitySelector && !showGenderSelector && (
            <div className="form-footer">
              <button
                onClick={handlePrevious}
                disabled={currentFormStep === 0 && currentStep === 0}
                className={`btn ${currentFormStep === 0 && currentStep === 0 ? 'bg-gray-300 cursor-not-allowed' : 'btn-secondary'}`}
              >
                {t('previous')}
              </button>

              {(currentFormStep < 2 || currentStep < totalSteps - 1) ? (
                <button
                  onClick={handleNext}
                  disabled={(currentFormStep === 1 && !isPersonalInfoComplete()) || 
                          (currentFormStep === 2 && !isCurrentFactorComplete())}
                  className={`btn ${
                    (currentFormStep === 1 && !isPersonalInfoComplete()) || 
                    (currentFormStep === 2 && !isCurrentFactorComplete())
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'btn-primary'
                  }`}
                >
                  {t('next')}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isCurrentFactorComplete()}
                  className={`btn ${isSubmitting || !isCurrentFactorComplete() ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}`}
                >
                  {isSubmitting ? t('submitting') : t('submit')}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <SubmitSuccess onReset={handleReset} language={formData.language} />
      )}
    </div>
  );
}

export default App;