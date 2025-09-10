export interface CountryCities {
  [key: string]: string[];
}

export const countries = [
  'USA',
  'Ecuador',
  'Brasil',
  'Colombia',
  'México',
  'Guatemala',
  
  
] as const;

export const citiesByCountry: CountryCities = {
  'USA': [
    'Florida',
    'Washington',
    'Colorado',
    'Nebraska',
    'REM TEAMS',
  ],
  'Ecuador': [
    'Quito'
  ],
  'Colombia': [
    'Bogotá',
    'Medellín',
    'REM TEAMS',
  ],
  'Brasil': [
    'Sao Paulo',
    'Curitiba',
    'Maringa',
    'Betim',
    'Farropilha',
    'Vale da Onça',
    'Belo horizonte',
    'Foz de Iguazu',
    'REM TEAMS',
  ],
  'México': [
    'Cuernavaca',
    'REM TEAMS',
  ],
  
  'Guatemala': [
    'Xela',
    'REM TEAMS',
  ],
  
};