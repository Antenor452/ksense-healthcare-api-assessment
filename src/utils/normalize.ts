export type NormalizedBloodPressure = {
  isValid: boolean;
  systolic: number;
  diastolic: number;
};

export const normalizePatientBP = (bp: unknown): NormalizedBloodPressure => {
  const fallbackValue: NormalizedBloodPressure = {
    systolic: 0,
    diastolic: 0,
    isValid: false,
  };
  if (typeof bp !== "string") return fallbackValue;
  //Use regex to match the pattern for bp

  const match = bp.match(/^(\d+)\/(\d+)$/);

  if (!match) return fallbackValue;

  const [systolicStr = "", diastolicStr = ""] = match;

  const systolic = parseInt(systolicStr, 10);
  const diastolic = parseInt(diastolicStr, 10);

  if (isNaN(systolic) || isNaN(diastolic)) return fallbackValue;

  return {
    systolic,
    diastolic,
    isValid: true,
  };
};
