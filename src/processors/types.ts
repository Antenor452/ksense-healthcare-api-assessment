export type NormalizedScore<TValue, TScore extends number = number> =
  | {
      isValid: true;
      value: TValue;
      score: TScore;
    }
  | {
      isValid: false;
    };

export type BloodPressure = {
  systolic: number;
  diastolic: number;
};

export type Age = number;

export type Temperature = number;
