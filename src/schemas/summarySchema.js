import {
  z,
} from "zod";

export const summarySchema =
  z.object({
    summary: z
      .string()
      .trim()
      .max(
        700,
        "Professional summary must be 700 characters or less."
      ),
  });