import { z } from "zod";

export const PatientApiSchema = z.object({
  patient_id: z.string(),
  name: z.string().optional().nullable(),
  age: z.union([z.number(), z.string()]).optional().nullable(),
  gender: z.enum(["F", "M"]).optional().nullable(),
  blood_pressure: z.string().optional().nullable(),
  temperature: z.union([z.number(), z.string()]).optional().nullable(),
  visit_date: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),
});

export type PatientApiType = z.infer<typeof PatientApiSchema>;
