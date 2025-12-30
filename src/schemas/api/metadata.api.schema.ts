import { z } from "zod";

export const metadataApiSchema = z.object({
  timestamp: z.string(),
  version: z.string(),
  requestId: z.string(),
});
