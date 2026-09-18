import {
  z,
} from "zod";

/* ========================================
   Month Validation
======================================== */

const MONTH_REGEX =
  /^\d{4}-(0[1-9]|1[0-2])$/;

const isValidMonth = (
  value
) =>
  value === "" ||
  MONTH_REGEX.test(value);

/* ========================================
   Optional Credential URL
======================================== */

const optionalUrlSchema = z
  .string()
  .trim()
  .max(
    300,
    "Credential URL must be 300 characters or less."
  )
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      try {
        const url =
          new URL(value);

        return (
          url.protocol ===
            "http:" ||
          url.protocol ===
            "https:"
        );
      } catch {
        return false;
      }
    },
    {
      message:
        "Enter a valid URL starting with http:// or https://.",
    }
  );

/* ========================================
   Certification Schema
======================================== */

export const certificationSchema =
  z.object({
    name: z
      .string()
      .trim()
      .max(
        150,
        "Certification name must be 150 characters or less."
      ),

    issuer: z
      .string()
      .trim()
      .max(
        150,
        "Issuing organization must be 150 characters or less."
      ),

    issueDate: z
      .string()
      .refine(
        isValidMonth,
        {
          message:
            "Enter a valid issue date.",
        }
      ),

    credentialUrl:
      optionalUrlSchema,
  });