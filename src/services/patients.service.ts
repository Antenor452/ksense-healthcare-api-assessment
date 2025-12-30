import { apiFetch } from "../clients/http.client";
import { FetchPatientsResponseApiSchema } from "../schemas/api/fetch-patients-response.api.schema";

export const fetchPatients = async (page = 1, limit = 10) => {
  const response = await apiFetch<unknown>(`/patients`, {
    method: "GET",
    params: {
      page,
      limit,
    },
  });

  const parsedResponse = FetchPatientsResponseApiSchema.parse(response);

  return parsedResponse;
};
