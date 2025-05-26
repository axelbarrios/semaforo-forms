export interface Question {
  id: number;
  text: string;
  factor: Factor;
  scoring: 'normal' | 'reverse';
}

export type Factor = 
  | 'CONSENSO'
  | 'SATISFACCION'
  | 'COHESION'
  | 'EXPRESION DE AFECTO'
  | 'CONEXION SEXUAL';

export interface PersonalInfo {
  name: string;
  age: string;
  ocupacion: string;
  religion: string;
  education: string;
  pais: string;
  ciudad: string;
  maritalStatus: string;
  timeAsCouple: string;
  previousMarriages: string;
  numberOfChildren: string;
  spouseEmail: string;
}

export interface FormData {
  spouse: 'husband' | 'wife';
  name: string;
  email: string;
  language: 'es' | 'pt' | 'en';
  remCity: string;
  personalInfo: PersonalInfo;
  answers: Record<number, number>;
}

export interface FactorScore {
  factor: Factor;
  score: number;
  maxPossible: number;
  percentage: number;
}

export type Language = 'es' | 'pt' | 'en';

export interface Translations {
  [key: string]: {
    es: string;
    pt: string;
    en: string;
  };
}