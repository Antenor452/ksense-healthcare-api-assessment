import "dotenv/config";
import { generatePatientAlters } from "./processors/patients.processor";
import { submitAssessment } from "./services/submit-assessment.service";

const main = async () => {
  const alerts = await generatePatientAlters();

  const results = await submitAssessment(alerts);
};

main();
