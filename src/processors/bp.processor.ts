import { BloodPressure, NormalizedScore } from "./types";

type BPScore = 0 | 1 | 2 | 3;

const scoreBloodPressure = (systolic: number, diastolic: number): BPScore => {
  switch (true) {
    // Stage 2 (highest risk FIRST)
    case systolic >= 140 || diastolic >= 90:
      return 3;

    // Stage 1
    case (systolic >= 130 && systolic <= 139) ||
      (diastolic >= 80 && diastolic <= 89):
      return 2;

    // Elevated
    case systolic >= 120 && systolic <= 129 && diastolic < 80:
      return 1;

    // Normal
    case systolic < 120 && diastolic < 80:
      return 0;

    // fallback
    default:
      return 0;
  }
};

export const processBloodPressure = (
  rawBP: unknown
): NormalizedScore<BloodPressure, BPScore> => {
  if (typeof rawBP !== "string") {
    return { isValid: false };
  }

  //match pattern
  const match = rawBP.match(/^(\d+)\/(\d+)$/);

  if (!match) {
    return { isValid: false };
  }

  const [_, systolicStr = "", diastolicStr = ""] = match;

  const systolic = Number(systolicStr);
  const diastolic = Number(diastolicStr);

  if (isNaN(systolic) || isNaN(diastolic)) {
    return { isValid: false };
  }

  const score = scoreBloodPressure(systolic, diastolic);

  return {
    isValid: true,
    score,
    value: {
      systolic,
      diastolic,
    },
  };
};
