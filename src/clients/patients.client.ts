import { apiFetch } from "./http.client";
import {
  FetchPatientsResponseApiSchema,
  FetchPatientsResponseApiType,
} from "../schemas/api/fetch-patients-response.api.schema";

export const fetchPatients = async (page = 1, limit = 10) => {
  const response = await apiFetch<unknown>(
    `/patients?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  const parsedResponse = FetchPatientsResponseApiSchema.parse(response);

  return parsedResponse;
};
