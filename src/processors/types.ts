export type NormalizedScore<TValue, TScore extends number = number> = {
  isValid: boolean;
  value?: TValue;
  score?: TScore;
};

export type BloodPressure = {
  systolic: number;
  diastolic: number;
};

export type Age = number;

export type Temperature = number;
