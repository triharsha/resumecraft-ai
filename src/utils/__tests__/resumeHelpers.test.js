import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import defaultResume from "../../data/defaultResume";

import {
  createEmptyCertification,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyLanguage,
  createEmptyProject,
  createId,
  createResume,
  duplicateResumeData,
  getCurrentTimestamp,
  normalizeResume,
  normalizeResumes,
  withUpdatedTimestamp,
} from "../resume";

/* ========================================
   Resume Helper Tests
======================================== */

describe("resume helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  /* ========================================
     ID Generation
  ======================================== */

  describe("createId", () => {
    it("creates an ID using the requested prefix", () => {
      const id =
        createId("resume");

      expect(id).toMatch(
        /^resume-/
      );
    });

    it("creates unique IDs", () => {
      const firstId =
        createId("resume");

      const secondId =
        createId("resume");

      expect(firstId).not.toBe(
        secondId
      );
    });
  });

  /* ========================================
     Timestamp
  ======================================== */

  describe("getCurrentTimestamp", () => {
    it("returns a valid ISO timestamp", () => {
      const timestamp =
        getCurrentTimestamp();

      expect(
        Number.isNaN(
          Date.parse(timestamp)
        )
      ).toBe(false);

      expect(timestamp).toContain(
        "T"
      );
    });
  });

  /* ========================================
     Empty Section Factories
  ======================================== */

  describe("empty section factories", () => {
    it("creates an empty experience with a unique ID", () => {
      const first =
        createEmptyExperience();

      const second =
        createEmptyExperience();

      expect(first.id).toMatch(
        /^experience-/
      );

      expect(first.id).not.toBe(
        second.id
      );

      expect(
        first.employmentType
      ).toBe("full-time");

      expect(first.current).toBe(
        false
      );
    });

    it("creates an empty education with a unique ID", () => {
      const education =
        createEmptyEducation();

      expect(education.id).toMatch(
        /^education-/
      );

      expect(
        education.institution
      ).toBe("");

      expect(
        education.current
      ).toBe(false);
    });

    it("creates an empty project with an independent technologies array", () => {
      const first =
        createEmptyProject();

      const second =
        createEmptyProject();

      first.technologies.push(
        "React"
      );

      expect(first.id).toMatch(
        /^project-/
      );

      expect(
        second.technologies
      ).toEqual([]);
    });

    it("creates empty certification and language entries", () => {
      const certification =
        createEmptyCertification();

      const language =
        createEmptyLanguage();

      expect(
        certification.id
      ).toMatch(
        /^certification-/
      );

      expect(language.id).toMatch(
        /^language-/
      );

      expect(
        certification.name
      ).toBe("");

      expect(language.name).toBe(
        ""
      );
    });
  });

  /* ========================================
     Resume Creation
  ======================================== */

  describe("createResume", () => {
    it("creates a resume with the expected defaults", () => {
      const resume =
        createResume();

      expect(resume.id).toMatch(
        /^resume-/
      );

      expect(resume.title).toBe(
        "Untitled Resume"
      );

      expect(
        resume.templateId
      ).toBe("modern");

      expect(
        resume.isFresher
      ).toBe(false);

      expect(
        resume.customization
          .fontFamily
      ).toBe("Inter");

      expect(
        resume.customization
          .fontSize
      ).toBe("medium");

      expect(
        resume.customization
          .accentColor
      ).toBe("#7c3aed");

      expect(
        resume.customization
          .spacing
      ).toBe("normal");
    });

    it("sets createdAt and updatedAt when creating a resume", () => {
      const resume =
        createResume();

      expect(resume.createdAt).toBe(
        resume.updatedAt
      );

      expect(
        Number.isNaN(
          Date.parse(
            resume.createdAt
          )
        )
      ).toBe(false);
    });

    it("accepts title, template, and accent overrides", () => {
      const resume =
        createResume({
          title:
            "Frontend Resume",

          templateId:
            "professional",

          accentColor:
            "#2563eb",
        });

      expect(resume.title).toBe(
        "Frontend Resume"
      );

      expect(
        resume.templateId
      ).toBe("professional");

      expect(
        resume.customization
          .accentColor
      ).toBe("#2563eb");
    });

    it("creates unique resume and section IDs", () => {
      const first =
        createResume();

      const second =
        createResume();

      expect(first.id).not.toBe(
        second.id
      );

      expect(
        first.experience[0].id
      ).not.toBe(
        second.experience[0].id
      );

      expect(
        first.education[0].id
      ).not.toBe(
        second.education[0].id
      );

      expect(
        first.projects[0].id
      ).not.toBe(
        second.projects[0].id
      );
    });

    it("creates independent nested data for different resumes", () => {
      const first =
        createResume();

      const second =
        createResume();

      first.personalInfo.firstName =
        "Triharsha";

      first.skills.push(
        "React"
      );

      first.projects[0]
        .technologies.push(
          "Vite"
        );

      first.analysis
        .missingKeywords.push(
          "Docker"
        );

      expect(
        second.personalInfo
          .firstName
      ).toBe("");

      expect(second.skills).toEqual(
        []
      );

      expect(
        second.projects[0]
          .technologies
      ).toEqual([]);

      expect(
        second.analysis
          .missingKeywords
      ).toEqual([]);
    });

    it("does not mutate defaultResume", () => {
      const resume =
        createResume();

      resume.personalInfo.firstName =
        "Changed";

      resume.skills.push(
        "Java"
      );

      expect(
        defaultResume.personalInfo
          .firstName
      ).toBe("");

      expect(
        defaultResume.skills
      ).toEqual([]);
    });
  });

  /* ========================================
     Resume Duplication
  ======================================== */

  describe("duplicateResumeData", () => {
    it("creates a duplicate with a new resume ID", () => {
      const original =
        createResume({
          title:
            "Java Developer",
        });

      const duplicate =
        duplicateResumeData(
          original
        );

      expect(duplicate.id).not.toBe(
        original.id
      );

      expect(duplicate.id).toMatch(
        /^resume-/
      );

      expect(duplicate.title).toBe(
        "Java Developer Copy"
      );
    });

    it("preserves resume content when duplicating", () => {
      const original =
        createResume({
          title:
            "Frontend Developer",
        });

      original.personalInfo.firstName =
        "Triharsha";

      original.summary =
        "Frontend developer";

      original.skills = [
        "React",
        "JavaScript",
      ];

      const duplicate =
        duplicateResumeData(
          original
        );

      expect(
        duplicate.personalInfo
          .firstName
      ).toBe("Triharsha");

      expect(duplicate.summary).toBe(
        "Frontend developer"
      );

      expect(
        duplicate.skills
      ).toEqual([
        "React",
        "JavaScript",
      ]);
    });

    it("deep clones duplicated resume data", () => {
      const original =
        createResume();

      original.skills.push(
        "React"
      );

      original.projects[0]
        .technologies.push(
          "Vite"
        );

      const duplicate =
        duplicateResumeData(
          original
        );

      duplicate.skills.push(
        "Java"
      );

      duplicate.projects[0]
        .technologies.push(
          "Spring Boot"
        );

      duplicate.personalInfo.firstName =
        "Changed";

      expect(
        original.skills
      ).toEqual(["React"]);

      expect(
        original.projects[0]
          .technologies
      ).toEqual(["Vite"]);

      expect(
        original.personalInfo
          .firstName
      ).toBe("");
    });

    it("uses Untitled Resume when duplicating a resume without a title", () => {
      const original =
        createResume();

      original.title = "";

      const duplicate =
        duplicateResumeData(
          original
        );

      expect(duplicate.title).toBe(
        "Untitled Resume Copy"
      );
    });
  });

  /* ========================================
     Normalization
  ======================================== */

  describe("normalizeResume", () => {
    it("safely normalizes invalid resume data", () => {
      const normalized =
        normalizeResume(null);

      expect(normalized.id).toMatch(
        /^resume-/
      );

      expect(normalized.title).toBe(
        "Untitled Resume"
      );

      expect(
        normalized.templateId
      ).toBe("modern");

      expect(
        normalized.isFresher
      ).toBe(false);

      expect(
        normalized.skills
      ).toEqual([]);
    });

    it("repairs invalid template and customization values", () => {
      const normalized =
        normalizeResume({
          templateId:
            "unknown-template",

          customization: {
            fontSize:
              "gigantic",

            spacing:
              "super-wide",
          },
        });

      expect(
        normalized.templateId
      ).toBe("modern");

      expect(
        normalized.customization
          .fontSize
      ).toBe("medium");

      expect(
        normalized.customization
          .spacing
      ).toBe("normal");
    });

    it("filters invalid skill and technology values", () => {
      const normalized =
        normalizeResume({
          skills: [
            "React",
            null,
            123,
            "Java",
          ],

          projects: [
            {
              name:
                "ResumeCraft",

              technologies: [
                "React",
                null,
                42,
                "Vite",
              ],
            },
          ],
        });

      expect(
        normalized.skills
      ).toEqual([
        "React",
        "Java",
      ]);

      expect(
        normalized.projects[0]
          .technologies
      ).toEqual([
        "React",
        "Vite",
      ]);
    });

    it("repairs missing section item IDs", () => {
      const normalized =
        normalizeResume({
          experience: [
            {
              jobTitle:
                "Developer",
            },
          ],

          education: [
            {
              institution:
                "University",
            },
          ],
        });

      expect(
        normalized.experience[0].id
      ).toMatch(
        /^experience-/
      );

      expect(
        normalized.education[0].id
      ).toMatch(
        /^education-/
      );
    });
  });

  describe("normalizeResumes", () => {
    it("returns an empty array for invalid persisted resume collections", () => {
      expect(
        normalizeResumes(null)
      ).toEqual([]);

      expect(
        normalizeResumes({})
      ).toEqual([]);

      expect(
        normalizeResumes(
          "invalid"
        )
      ).toEqual([]);
    });

    it("removes invalid collection entries and normalizes valid resumes", () => {
      const normalized =
        normalizeResumes([
          null,
          "invalid",
          {
            title:
              "My Resume",
          },
          123,
        ]);

      expect(normalized).toHaveLength(
        1
      );

      expect(
        normalized[0].title
      ).toBe("My Resume");

      expect(
        normalized[0].id
      ).toMatch(/^resume-/);
    });
  });

  /* ========================================
     Update Timestamp
  ======================================== */

  describe("withUpdatedTimestamp", () => {
    it("returns a new resume without mutating the original", () => {
      const original =
        createResume();

      const originalUpdatedAt =
        original.updatedAt;

      const updated =
        withUpdatedTimestamp(
          original
        );

      expect(updated).not.toBe(
        original
      );

      expect(original.updatedAt).toBe(
        originalUpdatedAt
      );

      expect(
        Number.isNaN(
          Date.parse(
            updated.updatedAt
          )
        )
      ).toBe(false);
    });
  });
});