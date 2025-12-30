import { Age, NormalizedScore } from "./types";

type AgeScore = 0 | 1 | 2;

const scoreAge = (age: number): AgeScore => {
  switch (true) {
    case age > 65:
      return 2;
    case age >= 40:
      return 1;

    default:
      return 0;
  }
};

export const processAge = (age: unknown): NormalizedScore<Age, AgeScore> => {
  if (typeof age !== "number" && typeof age !== "string") {
    return { isValid: false };
  }

  const ageNumber = Number(age);

  if (isNaN(ageNumber)) {
    return { isValid: false };
  }

  const score = scoreAge(ageNumber);

  return {
    isValid: true,
    score,
    value: ageNumber,
  };
};
