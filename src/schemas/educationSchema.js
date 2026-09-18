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
   Education Schema
======================================== */

export const educationSchema =
  z
    .object({
      institution: z
        .string()
        .trim()
        .max(
          150,
          "Institution name must be 150 characters or less."
        ),

      degree: z
        .string()
        .trim()
        .max(
          120,
          "Degree must be 120 characters or less."
        ),

      fieldOfStudy: z
        .string()
        .trim()
        .max(
          120,
          "Field of study must be 120 characters or less."
        ),

      location: z
        .string()
        .trim()
        .max(
          100,
          "Location must be 100 characters or less."
        ),

      startDate: z
        .string()
        .refine(
          isValidMonth,
          {
            message:
              "Enter a valid start date.",
          }
        ),

      endDate: z
        .string()
        .refine(
          isValidMonth,
          {
            message:
              "Enter a valid end date.",
          }
        ),

      current:
        z.boolean(),

      description: z
        .string()
        .trim()
        .max(
          1000,
          "Description must be 1000 characters or less."
        ),
    })

    /* ========================================
       Current Education Validation
    ======================================== */

    .refine(
      (data) =>
        !data.current ||
        data.endDate === "",
      {
        message:
          "Remove the end date when currently studying.",
        path: [
          "endDate",
        ],
      }
    )

    /* ========================================
       Date Range Validation
    ======================================== */

    .refine(
      (data) => {
        if (
          data.current ||
          !data.startDate ||
          !data.endDate
        ) {
          return true;
        }

        return (
          data.endDate >=
          data.startDate
        );
      },
      {
        message:
          "End date cannot be earlier than start date.",
        path: [
          "endDate",
        ],
      }
    );