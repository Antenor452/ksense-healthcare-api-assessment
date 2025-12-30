import { SubmitAssessmentPayload } from "../schemas/api/submit-assessment.api.schema";
import { fetchPatients } from "../services/patients.service";
import { processAge } from "./age.processor";
import { processBloodPressure } from "./bp.processor";
import { processTemperature } from "./temperature.processor";

export type InternalAlerts = {
  high_risk_patients: Set<string>;
  fever_patients: Set<string>;
  data_quality_issues: Set<string>;
};

export const generatePatientAlters = async (): Promise<InternalAlerts> => {
  let currentPage = 1;
  let hasMore = true;

  const alerts: InternalAlerts = {
    high_risk_patients: new Set<string>(),
    fever_patients: new Set<string>(),
    data_quality_issues: new Set<string>(),
  };

  let processedPatientsCount = 0;
  while (hasMore) {
    const { data: patients, pagination } = await fetchPatients(currentPage, 10);

    for (const patient of patients) {
      const { age, temperature, blood_pressure, patient_id } = patient;

      const normalizedAge = processAge(age);
      const normalizedTemperature = processTemperature(temperature);
      const normalizedBloodPressure = processBloodPressure(blood_pressure);

      //Data quality issues
      if (
        !normalizedAge.isValid ||
        !normalizedTemperature.isValid ||
        !normalizedBloodPressure.isValid
      ) {
        alerts.data_quality_issues.add(patient_id);
      }

      //Fever alert
      if (normalizedTemperature.isValid && normalizedTemperature.score >= 1) {
        alerts.fever_patients.add(patient_id);
      }

      //High risk alert
      const totalRiskScore =
        (normalizedAge.isValid ? normalizedAge.score : 0) +
        (normalizedTemperature.isValid ? normalizedTemperature.score : 0) +
        (normalizedBloodPressure.isValid ? normalizedBloodPressure.score : 0);

      if (totalRiskScore >= 4) {
        alerts.high_risk_patients.add(patient_id);
      }
    }

    // console.log(`Processed page ${currentPage} - count : ${patients.length}`);
    hasMore = pagination.hasNext;
    processedPatientsCount += patients.length;

    currentPage++;
  }

  // console.log(`Processed ${processedPatientsCount} patients`);
  // console.log({
  //   high_risk_patients: alerts.high_risk_patients.size,
  //   fever_patients: alerts.fever_patients.size,
  //   data_quality_issues: alerts.data_quality_issues.size,
  // });

  return alerts;
};
