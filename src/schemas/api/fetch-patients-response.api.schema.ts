import { z } from "zod";
import { MetadataApiSchema } from "./metadata.api.schema";
import { PaginationApiSchema } from "./pagination.api.schema";
import { PatientApiSchema } from "./patient.api.schema";

//Response variants

const PatientsDataResponse = z.object({
  data: z.array(PatientApiSchema),
  pagination: PaginationApiSchema,
  metadata: MetadataApiSchema.optional().nullable(),
});

const PatientsFlatPaginationSchema = z.object({
  patients: z.array(PatientApiSchema),
  count: z.number(),
  total_records: z.number(),
  current_page: z.number(),
  per_page: z.number(),
});

export const FetchPatientsResponseApiSchema = z
  .union([PatientsDataResponse, PatientsFlatPaginationSchema])
  .transform((response) => {
    //Variant 1 :{data,pagination,metadata}
    if ("data" in response) {
      console.info("Got Fetch Patients Variant 1");
      return response;
    }
    console.info("Got Fetch Patients Variant 2 ");
    return {
      data: response.patients,
      pagination: {
        page: response.current_page,
        limit: response.per_page,
        total: response.total_records,
        totalPages: Math.ceil(response.total_records / response.per_page),
        hasNext:
          response.current_page <
          Math.ceil(response.total_records / response.per_page),
        hasPrevious: response.current_page > 1,
      },
      metadata: null,
    };
  });

export type FetchPatientsResponseApiType = z.infer<
  typeof FetchPatientsResponseApiSchema
>;
