import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message content must be at least 10 characters long")
    .max(500, "Message content must be at most 500 characters long"),
});
