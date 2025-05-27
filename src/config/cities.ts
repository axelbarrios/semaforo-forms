export interface CountryCities {
  [key: string]: string[];
}

export const countries = [
  'USA',
  'Ecuador',
  'Brasil',
  'Colombia'
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
    'Furrapilha',
    'Dourados'
  ]
};