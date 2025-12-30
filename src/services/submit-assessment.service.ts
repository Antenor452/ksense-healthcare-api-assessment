import { apiFetch } from "../clients/http.client";
import { InternalAlerts } from "../processors/patients.processor";
import {
  SubmitAssessmentResponse,
  SubmitAssessmentSchema,
} from "../schemas/api/submit-assessment.api.schema";

export const submitAssessment = async (alerts: InternalAlerts) => {
  const rawPayload = {
    high_risk_patients: Array.from(alerts.high_risk_patients),
    fever_patients: Array.from(alerts.fever_patients),
    data_quality_issues: Array.from(alerts.data_quality_issues),
  };

  const parsedPayload = SubmitAssessmentSchema.parse(rawPayload);

  const response = await apiFetch<SubmitAssessmentResponse>(
    `/submit-assessment`,
    {
      method: "POST",
      body: JSON.stringify(parsedPayload),
      headers: {
        "Content-Type": "application/json",
      },
      retryConfig: {
        maxRetries: 0,
        retryOnStatusCodes: [],
      },
    }
  );

  return response;
};
