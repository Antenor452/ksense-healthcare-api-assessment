import { z } from "zod";

export const MetadataApiSchema = z.object({
  timestamp: z.string(),
  version: z.string(),
  requestId: z.string(),
});

export type MetadataApiType = z.infer<typeof MetadataApiSchema>;
