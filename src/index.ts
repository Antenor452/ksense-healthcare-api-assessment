import "dotenv/config";
import { writeFile } from "fs/promises";

import { generatePatientAlters } from "./processors/patients.processor";
import { submitAssessment } from "./services/submit-assessment.service";

const serializeAlerts = (alerts: {
  high_risk_patients: Set<string>;
  fever_patients: Set<string>;
  data_quality_issues: Set<string>;
}) => {
  return {
    high_risk_patients: Array.from(alerts.high_risk_patients),
    fever_patients: Array.from(alerts.fever_patients),
    data_quality_issues: Array.from(alerts.data_quality_issues),
  };
};

const main = async () => {
  const alerts = await generatePatientAlters();

  const serializedAlerts = serializeAlerts(alerts);
  await writeFile(
    "alerts.json",
    JSON.stringify(serializedAlerts, null, 2),
    "utf-8"
  );
  const results = await submitAssessment(alerts);
  await writeFile(
    "submission-results.json",
    JSON.stringify(results, null, 2),
    "utf-8"
  );
  console.log("✅ Alerts and results written to files");
};

main();
