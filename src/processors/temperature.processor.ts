import { NormalizedScore, Temperature } from "./types";

type TemperatureScore = 0 | 1 | 2;

const scoreTemperature = (temperature: number): TemperatureScore => {
  switch (true) {
    //High Fever
    case temperature >= 101.0:
      return 2;
    //Low Fever
    case temperature >= 99.6:
      return 1;
    //Normal
    default:
      return 0;
  }
};

export const processTemperature = (
  temperature: unknown
): NormalizedScore<Temperature, TemperatureScore> => {
  if (typeof temperature !== "number" && typeof temperature !== "string") {
    return { isValid: false };
  }

  const temperatureNumber = Number(temperature);

  if (isNaN(temperatureNumber)) {
    return { isValid: false };
  }

  const score = scoreTemperature(temperatureNumber);

  return {
    isValid: true,
    score,
    value: temperatureNumber,
  };
};
