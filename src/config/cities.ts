export interface CountryCities {
  [key: string]: string[];
}

export const countries = [
  'ESTADOS UNIDOS',
  'ECUADOR',
  'COLOMBIA',
  'BRASIL'
] as const;

export const citiesByCountry: CountryCities = {
  'ESTADOS UNIDOS': [
    'MIAMI',
    'ORLANDO',
    'TAMPA',
    'JACKSONVILLE',
    'WEST PALM BEACH'
  ],
  'ECUADOR': [
    'QUITO',
    'GUAYAQUIL',
    'CUENCA',
    'MANTA',
    'MACHALA'
  ],
  'COLOMBIA': [
    'BOGOTÁ',
    'MEDELLÍN',
    'CALI',
    'BARRANQUILLA',
    'CARTAGENA'
  ],
  'BRASIL': [
    'SÃO PAULO',
    'RIO DE JANEIRO',
    'BRASÍLIA',
    'SALVADOR',
    'FORTALEZA'
  ]
};