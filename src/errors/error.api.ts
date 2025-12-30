import { z } from "zod";

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  retry_after: z.number().optional(),
});

export type ApiErrorType = z.infer<typeof ApiErrorSchema>;
