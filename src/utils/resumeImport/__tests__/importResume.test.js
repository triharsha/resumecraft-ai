import {
  describe,
  expect,
  it,
} from "vitest";

import defaultResume from "../../../data/defaultResume";

import {
  createImportedResumeData,
} from "../importResume";

/* ========================================
   Helpers
======================================== */

const createParsedResume = (
  overrides = {}
) => ({
  personalInfo: {
    firstName: "Alex",
    lastName: "Morgan",
    jobTitle: "Software Developer",
    email: "alex@example.com",
    phone: "9999999999",
    location: "Hyderabad",
    website: "",
    linkedin: "",
    github: "",
  },

  summary:
    "Frontend developer focused on modern applications.",

  experience: [],
  education: [],
  skills: [
    "React",
    "JavaScript",
  ],
  projects: [],
  certifications: [],
  languages: [],

  ...overrides,
});

/* ========================================
   Imported Title
======================================== */

describe("createImportedResumeData title", () => {
  it("creates a title from first and last name", () => {
    const result =
      createImportedResumeData(
        createParsedResume()
      );

    expect(result.title).toBe(
      "Alex Morgan Resume"
    );
  });

  it("creates a title from only first name", () => {
    const result =
      createImportedResumeData(
        createParsedResume({
          personalInfo: {
            firstName: "Alex",
            lastName: "",
          },
        })
      );

    expect(result.title).toBe(
      "Alex Resume"
    );
  });

  it("creates a title from only last name", () => {
    const result =
      createImportedResumeData(
        createParsedResume({
          personalInfo: {
            firstName: "",
            lastName: "Morgan",
          },
        })
      );

    expect(result.title).toBe(
      "Morgan Resume"
    );
  });

  it("uses Imported Resume when no name exists", () => {
    const result =
      createImportedResumeData({
        personalInfo: {},
      });

    expect(result.title).toBe(
      "Imported Resume"
    );
  });
});

/* ========================================
   Personal Information
======================================== */

describe("createImportedResumeData personal info", () => {
  it("merges parsed personal info with defaults", () => {
    const result =
      createImportedResumeData({
        personalInfo: {
          firstName: "Alex",
          email: "alex@example.com",
        },
      });

    expect(
      result.personalInfo.firstName
    ).toBe("Alex");

    expect(
      result.personalInfo.email
    ).toBe("alex@example.com");

    expect(
      result.personalInfo.lastName
    ).toBe(
      defaultResume.personalInfo.lastName
    );

    expect(
      result.personalInfo.linkedin
    ).toBe(
      defaultResume.personalInfo.linkedin
    );
  });

  it("falls back safely when personalInfo is missing", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.personalInfo
    ).toEqual(
      defaultResume.personalInfo
    );
  });
});

/* ========================================
   Summary
======================================== */

describe("createImportedResumeData summary", () => {
  it("trims imported summary text", () => {
    const result =
      createImportedResumeData({
        summary:
          "   Software Developer   ",
      });

    expect(result.summary).toBe(
      "Software Developer"
    );
  });

  it("uses empty summary when summary is missing", () => {
    const result =
      createImportedResumeData({});

    expect(result.summary).toBe("");
  });
});

/* ========================================
   Sections
======================================== */

describe("createImportedResumeData sections", () => {
  it("preserves imported arrays", () => {
    const parsed =
      createParsedResume({
        experience: [
          {
            id: "exp-1",
            jobTitle:
              "Developer",
          },
        ],

        education: [
          {
            id: "edu-1",
            institution:
              "University",
          },
        ],

        projects: [
          {
            id: "project-1",
            name:
              "ResumeCraft",
          },
        ],

        certifications: [
          {
            id: "cert-1",
            name:
              "Java Certification",
          },
        ],

        languages: [
          {
            id: "language-1",
            name: "English",
          },
        ],
      });

    const result =
      createImportedResumeData(
        parsed
      );

    expect(
      result.experience
    ).toEqual(
      parsed.experience
    );

    expect(
      result.education
    ).toEqual(
      parsed.education
    );

    expect(
      result.skills
    ).toEqual(
      parsed.skills
    );

    expect(
      result.projects
    ).toEqual(
      parsed.projects
    );

    expect(
      result.certifications
    ).toEqual(
      parsed.certifications
    );

    expect(
      result.languages
    ).toEqual(
      parsed.languages
    );
  });

  it("replaces invalid section values with empty arrays", () => {
    const result =
      createImportedResumeData({
        experience: null,
        education: "invalid",
        skills: {},
        projects: null,
        certifications:
          undefined,
        languages: 123,
      });

    expect(
      result.experience
    ).toEqual([]);

    expect(
      result.education
    ).toEqual([]);

    expect(
      result.skills
    ).toEqual([]);

    expect(
      result.projects
    ).toEqual([]);

    expect(
      result.certifications
    ).toEqual([]);

    expect(
      result.languages
    ).toEqual([]);
  });
});

/* ========================================
   Import Defaults
======================================== */

describe("createImportedResumeData defaults", () => {
  it("uses the default template", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.templateId
    ).toBe(
      defaultResume.templateId
    );
  });

  it("uses the default accent color", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.customization
        .accentColor
    ).toBe(
      defaultResume
        .customization
        .accentColor
    );
  });

  it("allows template preference override", () => {
    const result =
      createImportedResumeData(
        {},
        {
          templateId:
            "professional",
        }
      );

    expect(
      result.templateId
    ).toBe(
      "professional"
    );
  });

  it("allows accent color override", () => {
    const result =
      createImportedResumeData(
        {},
        {
          accentColor:
            "#2563eb",
        }
      );

    expect(
      result.customization
        .accentColor
    ).toBe(
      "#2563eb"
    );
  });

  it("preserves the remaining default customization values", () => {
    const result =
      createImportedResumeData(
        {},
        {
          accentColor:
            "#2563eb",
        }
      );

    expect(
      result.customization
        .fontFamily
    ).toBe(
      defaultResume
        .customization
        .fontFamily
    );

    expect(
      result.customization
        .fontSize
    ).toBe(
      defaultResume
        .customization
        .fontSize
    );

    expect(
      result.customization
        .spacing
    ).toBe(
      defaultResume
        .customization
        .spacing
    );
  });

  it("always imports as non-fresher initially", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.isFresher
    ).toBe(false);
  });
});

/* ========================================
   Reset Derived Data
======================================== */

describe("createImportedResumeData derived data", () => {
  it("starts with an empty job target", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.jobTarget
    ).toEqual(
      defaultResume.jobTarget
    );
  });

  it("resets analysis arrays", () => {
    const result =
      createImportedResumeData({
        analysis: {
          missingKeywords: [
            "Docker",
          ],

          matchedKeywords: [
            "React",
          ],

          suggestions: [
            {
              id: "fake",
            },
          ],
        },
      });

    expect(
      result.analysis
        .missingKeywords
    ).toEqual([]);

    expect(
      result.analysis
        .matchedKeywords
    ).toEqual([]);

    expect(
      result.analysis
        .suggestions
    ).toEqual([]);
  });

  it("preserves default analysis score fields", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.analysis
        .overallScore
    ).toBe(
      defaultResume
        .analysis
        .overallScore
    );

    expect(
      result.analysis
        .atsScore
    ).toBe(
      defaultResume
        .analysis
        .atsScore
    );

    expect(
      result.analysis
        .contentScore
    ).toBe(
      defaultResume
        .analysis
        .contentScore
    );
  });
});

/* ========================================
   Safety
======================================== */

describe("createImportedResumeData safety", () => {
  it("handles null parsed resume", () => {
    expect(() =>
      createImportedResumeData(
        null
      )
    ).not.toThrow();
  });

  it("does not mutate defaultResume", () => {
    const before =
      structuredClone(
        defaultResume
      );

    createImportedResumeData(
      createParsedResume(),
      {
        templateId:
          "professional",

        accentColor:
          "#000000",
      }
    );

    expect(
      defaultResume
    ).toEqual(before);
  });

  it("creates independent nested default objects", () => {
    const result =
      createImportedResumeData({});

    expect(
      result.personalInfo
    ).not.toBe(
      defaultResume.personalInfo
    );

    expect(
      result.jobTarget
    ).not.toBe(
      defaultResume.jobTarget
    );

    expect(
      result.analysis
    ).not.toBe(
      defaultResume.analysis
    );

    expect(
      result.customization
    ).not.toBe(
      defaultResume.customization
    );
  });
});