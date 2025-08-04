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
    'Nebraska'
  ],
  'Ecuador': [
    'Quito'
  ],
  'Colombia': [
    'Bogotá',
    'Medellín'
  ],
  'Brasil': [
    'Sao Paulo',
    'Curitiba',
    'Maringa',
    'Betim',
    'Farropilha',
    'Vale da Onça',
    'Belo horizonte',
    'Foz de Iguazu'
  ],
  'México': [
    'Cuernavaca'
  ],
  
  'Guatemala': [
    'Xela'
  ],
  
};