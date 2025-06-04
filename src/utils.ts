import { Factor, FactorScore, FormData, Question, Language } from './types';
import { questions } from './questions';
import { questions_pt } from './questions_pt';

export const getQuestions = (language: Language): Question[] => {
  return language === 'es' ? questions : questions_pt;
};

// Function to capitalize first letter of each word
const toTitleCase = (str: string): string => {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Function to transform personal info fields
const transformPersonalInfo = (personalInfo: FormData['personalInfo']): FormData['personalInfo'] => {
  const transformed = { ...personalInfo };
  
  // Fields that should be in Title Case
  const titleCaseFields = [
    'name',
    'ocupacion',
    'religion',
    'education',
    'maritalStatus',
    'timeAsCouple',
    'previousMarriages',
    'numberOfChildren'
  ];
  
  // Apply Title Case to specified fields
  titleCaseFields.forEach(field => {
    if (transformed[field as keyof typeof transformed]) {
      transformed[field as keyof typeof transformed] = toTitleCase(
        transformed[field as keyof typeof transformed]
      );
    }
  });
  
  // Convert email fields to lowercase
  transformed.spouseEmail = transformed.spouseEmail.toLowerCase();
  
  return transformed;
};

// Get the Google Script URL based on environment
const getGoogleScriptUrl = (): string => {
  const productionUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL_PRODUCTION;
  const testingUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL_TESTING;
  
  if (!productionUrl && !testingUrl) {
    throw new Error('No Google Script URL configured');
  }

  // Default to production URL if available, otherwise use testing URL
  return productionUrl || testingUrl;
};

export const submitToGoogleSheets = async (formData: FormData): Promise<boolean> => {
  try {
    const googleScriptUrl = getGoogleScriptUrl();
    
    if (!googleScriptUrl) {
      console.error('Google Script URL is not configured');
      return false;
    }
    
    // Transform the data before sending
    const transformedData = {
      ...formData,
      name: toTitleCase(formData.name),
      email: formData.email.toLowerCase(),
      personalInfo: transformPersonalInfo(formData.personalInfo),
      // Add sheet name based on spouse type
      sheetName: formData.spouse === 'husband' ? 'Esposos' : 'Esposas'
    };
    
    // Send data to Google Sheets
    await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
      mode: 'no-cors'
    });
    
    return true;
    
  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    return false;
  }
};

export const getFactorQuestions = (factor: Factor, language: Language): Question[] => {
  const questionList = language === 'es' ? questions : questions_pt;
  return questionList.filter(q => q.factor === factor);
};

export const calculateScore = (formData: FormData): FactorScore[] => {
  const factorScores: Record<Factor, { score: number; count: number }> = {
    'CONSENSO': { score: 0, count: 0 },
    'SATISFACCION': { score: 0, count: 0 },
    'COHESION': { score: 0, count: 0 },
    'EXPRESION DE AFECTO': { score: 0, count: 0 },
    'CONEXION SEXUAL': { score: 0, count: 0 },
  };

  // Lista de preguntas con puntuación invertida
  const invertedQuestions = [1, 2, 3, 4, 6, 7, 10, 19, 21, 30, 31, 33, 45, 49, 50, 52, 63, 65, 66, 68, 75];

  // Calculate scores for each factor
  Object.entries(formData.answers).forEach(([questionId, value]) => {
    const qId = parseInt(questionId);
    const questionList = formData.language === 'es' ? questions : questions_pt;
    const question = questionList.find(q => q.id === qId);
    
    if (question) {
      const isInverted = invertedQuestions.includes(qId);
      const adjustedValue = isInverted ? 5 - value : value;
      factorScores[question.factor].score += adjustedValue;
      factorScores[question.factor].count += 1;
    }
  });

  return Object.entries(factorScores).map(([factor, { score }]) => ({
    factor: factor as Factor,
    score,
    maxPossible: 0, // Not needed for Google Sheets submission
    percentage: 0 // Not needed for Google Sheets submission
  }));
};