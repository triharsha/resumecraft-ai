import {
  z,
} from "zod";

/* ========================================
   Indian Mobile Number Validation
======================================== */

const INDIAN_PHONE_REGEX =
  /^[6-9]\d{9}$/;

/* ========================================
   URL Helpers
======================================== */

const isHttpUrl = (
  value
) => {
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
};

const isLinkedInUrl = (
  value
) => {
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
      (hostname ===
        "linkedin.com" ||
        hostname.endsWith(
          ".linkedin.com"
        ))
    );
  } catch {
    return false;
  }
};

const isGitHubUrl = (
  value
) => {
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
};

/* ========================================
   Personal Information Schema
======================================== */

export const personalInfoSchema =
  z.object({
    firstName: z
      .string()
      .trim()
      .max(
        50,
        "First name must be 50 characters or less."
      ),

    lastName: z
      .string()
      .trim()
      .max(
        50,
        "Last name must be 50 characters or less."
      ),

    jobTitle: z
      .string()
      .trim()
      .max(
        100,
        "Job title must be 100 characters or less."
      ),

    email: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" ||
          z
            .email()
            .safeParse(
              value
            ).success,
        {
          message:
            "Enter a valid email address.",
        }
      ),

    phone: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" ||
          INDIAN_PHONE_REGEX.test(
            value
          ),
        {
          message:
            "Enter a valid 10-digit Indian mobile number.",
        }
      ),

    location: z
      .string()
      .trim()
      .max(
        100,
        "Location must be 100 characters or less."
      ),

    website: z
      .string()
      .trim()
      .max(
        300,
        "Website URL must be 300 characters or less."
      )
      .refine(
        (value) =>
          value === "" ||
          isHttpUrl(value),
        {
          message:
            "Enter a valid website URL.",
        }
      ),

    linkedin: z
      .string()
      .trim()
      .max(
        300,
        "LinkedIn URL must be 300 characters or less."
      )
      .refine(
        (value) =>
          value === "" ||
          isLinkedInUrl(
            value
          ),
        {
          message:
            "Enter a valid LinkedIn URL.",
        }
      ),

    github: z
      .string()
      .trim()
      .max(
        300,
        "GitHub URL must be 300 characters or less."
      )
      .refine(
        (value) =>
          value === "" ||
          isGitHubUrl(value),
        {
          message:
            "Enter a valid GitHub URL.",
        }
      ),
  });