import { z } from "zod";

export const PaginationApiSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export type PaginationApiType = z.infer<typeof PaginationApiSchema>;
