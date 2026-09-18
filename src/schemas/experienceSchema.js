import {
  z,
} from "zod";

const employmentTypeValues = [
  "full-time",
  "part-time",
  "internship",
  "contract",
  "freelance",
  "apprenticeship",
  "volunteer",
];

const MONTH_REGEX =
  /^\d{4}-(0[1-9]|1[0-2])$/;

const isValidMonth = (
  value
) =>
  value === "" ||
  MONTH_REGEX.test(value);

export const experienceSchema =
  z
    .object({
      jobTitle: z
        .string()
        .trim()
        .max(
          100,
          "Job title must be 100 characters or less."
        ),

      company: z
        .string()
        .trim()
        .max(
          100,
          "Company name must be 100 characters or less."
        ),

      employmentType:
        z.enum(
          employmentTypeValues
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
          1200,
          "Description must be 1200 characters or less."
        ),
    })

    /* ========================================
       Current Role
    ======================================== */

    .refine(
      (data) =>
        !data.current ||
        data.endDate === "",
      {
        message:
          "Remove the end date for a current role.",
        path: [
          "endDate",
        ],
      }
    )

    /* ========================================
       Date Order
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