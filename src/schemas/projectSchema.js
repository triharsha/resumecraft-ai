import {
  z,
} from "zod";

/* ========================================
   URL Helpers
======================================== */

const optionalUrlSchema = z
  .string()
  .trim()
  .max(
    300,
    "URL must be 300 characters or less."
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

const optionalGitHubUrlSchema =
  z
    .string()
    .trim()
    .max(
      300,
      "GitHub URL must be 300 characters or less."
    )
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        try {
          const url =
            new URL(value);

          const hostname =
            url.hostname
              .toLowerCase()
              .replace(
                /^www\./,
                ""
              );

          return (
            (url.protocol ===
              "http:" ||
              url.protocol ===
                "https:") &&
            hostname ===
              "github.com"
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "Enter a valid GitHub URL.",
      }
    );

/* ========================================
   Project Schema
======================================== */

export const projectSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .max(
          120,
          "Project name must be 120 characters or less."
        ),

      description: z
        .string()
        .trim()
        .max(
          1200,
          "Description must be 1200 characters or less."
        ),

      technologies: z
        .array(
          z
            .string()
            .trim()
            .min(
              1,
              "Technology cannot be empty."
            )
            .max(
              40,
              "Technology names must be 40 characters or less."
            )
        )
        .max(
          20,
          "You can add up to 20 technologies."
        ),

      projectUrl:
        optionalUrlSchema,

      githubUrl:
        optionalGitHubUrlSchema,
    })

    /* ========================================
       Duplicate Technology Validation
    ======================================== */

    .refine(
      (data) => {
        const technologies =
          data.technologies.map(
            (technology) =>
              technology
                .trim()
                .replace(
                  /\s+/g,
                  " "
                )
                .toLowerCase()
          );

        return (
          new Set(
            technologies
          ).size ===
          technologies.length
        );
      },
      {
        message:
          "Technologies cannot contain duplicates.",
        path: [
          "technologies",
        ],
      }
    );