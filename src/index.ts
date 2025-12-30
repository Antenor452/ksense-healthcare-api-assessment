import "dotenv/config";
import { fetchPatients } from "./clients/patients.client";

const fetchPatientTest = async () => {
  const patients = await fetchPatients();

  console.log(patients);
};

fetchPatientTest();
