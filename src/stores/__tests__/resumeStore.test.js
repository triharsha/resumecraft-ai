import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import useResumeStore, {
  selectActiveResume,
  selectActiveResumeId,
  selectResumeCount,
  selectResumes,
} from "../resumeStore";

import {
  createEmptyExperience,
  createResume,
} from "../../utils/resume";

/* ========================================
   Helpers
======================================== */

const resetStore = () => {
  useResumeStore.setState({
    resumes: [],
    activeResumeId: null,
  });

  window.localStorage.clear();
};

/* ========================================
   Resume Store Tests
======================================== */

describe("resumeStore", () => {
  beforeEach(() => {
    resetStore();
  });

  /* ========================================
     Initial State
  ======================================== */

  describe("initial state", () => {
    it("starts with no resumes and no active resume", () => {
      const state =
        useResumeStore.getState();

      expect(state.resumes).toEqual(
        []
      );

      expect(
        state.activeResumeId
      ).toBeNull();
    });
  });

  /* ========================================
     Add Resume
  ======================================== */

  describe("addResume", () => {
    it("creates, stores, and activates a resume", () => {
      const created =
        useResumeStore
          .getState()
          .addResume();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].id
      ).toBe(created.id);

      expect(
        state.activeResumeId
      ).toBe(created.id);
    });

    it("prepends newly created resumes", () => {
      const first =
        useResumeStore
          .getState()
          .addResume({
            title: "First",
          });

      const second =
        useResumeStore
          .getState()
          .addResume({
            title: "Second",
          });

      const state =
        useResumeStore.getState();

      expect(
        state.resumes.map(
          (resume) =>
            resume.id
        )
      ).toEqual([
        second.id,
        first.id,
      ]);

      expect(
        state.activeResumeId
      ).toBe(second.id);
    });

    it("passes template and accent options to resume creation", () => {
      const created =
        useResumeStore
          .getState()
          .addResume({
            title:
              "Custom Resume",

            templateId:
              "professional",

            accentColor:
              "#2563eb",
          });

      expect(created.title).toBe(
        "Custom Resume"
      );

      expect(
        created.templateId
      ).toBe("professional");

      expect(
        created.customization
          .accentColor
      ).toBe("#2563eb");
    });
  });

  /* ========================================
     Active Resume
  ======================================== */

  describe("active resume", () => {
    it("sets an existing resume as active", () => {
      const first =
        useResumeStore
          .getState()
          .addResume({
            title: "First",
          });

      useResumeStore
        .getState()
        .addResume({
          title: "Second",
        });

      useResumeStore
        .getState()
        .setActiveResume(
          first.id
        );

      expect(
        useResumeStore.getState()
          .activeResumeId
      ).toBe(first.id);
    });

    it("clears active resume when an unknown ID is requested", () => {
      useResumeStore
        .getState()
        .addResume();

      useResumeStore
        .getState()
        .setActiveResume(
          "missing-resume"
        );

      expect(
        useResumeStore.getState()
          .activeResumeId
      ).toBeNull();
    });

    it("clears the active resume explicitly", () => {
      useResumeStore
        .getState()
        .addResume();

      useResumeStore
        .getState()
        .clearActiveResume();

      expect(
        useResumeStore.getState()
          .activeResumeId
      ).toBeNull();
    });
  });

  /* ========================================
     Update Resume
  ======================================== */

  describe("updateResume", () => {
    it("updates only the requested resume", () => {
      const first =
        useResumeStore
          .getState()
          .addResume({
            title: "First",
          });

      const second =
        useResumeStore
          .getState()
          .addResume({
            title: "Second",
          });

      useResumeStore
        .getState()
        .updateResume(
          first.id,
          {
            summary:
              "Updated summary",
          }
        );

      const state =
        useResumeStore.getState();

      const updatedFirst =
        state.resumes.find(
          (resume) =>
            resume.id ===
            first.id
        );

      const untouchedSecond =
        state.resumes.find(
          (resume) =>
            resume.id ===
            second.id
        );

      expect(
        updatedFirst.summary
      ).toBe(
        "Updated summary"
      );

      expect(
        untouchedSecond.summary
      ).toBe("");
    });

    it("renames a resume and trims whitespace", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .renameResume(
          resume.id,
          "  Java Developer  "
        );

      const updated =
        useResumeStore
          .getState()
          .resumes.find(
            (item) =>
              item.id ===
              resume.id
          );

      expect(updated.title).toBe(
        "Java Developer"
      );
    });

    it("ignores an empty rename", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume({
            title:
              "Original Resume",
          });

      useResumeStore
        .getState()
        .renameResume(
          resume.id,
          "   "
        );

      const updated =
        useResumeStore
          .getState()
          .resumes.find(
            (item) =>
              item.id ===
              resume.id
          );

      expect(updated.title).toBe(
        "Original Resume"
      );
    });
  });

  /* ========================================
     Personal Info + Summary
  ======================================== */

  describe("personal information and summary", () => {
    it("merges personal information without removing existing fields", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .updatePersonalInfo(
          resume.id,
          {
            firstName:
              "Triharsha",

            email:
              "test@example.com",
          }
        );

      useResumeStore
        .getState()
        .updatePersonalInfo(
          resume.id,
          {
            jobTitle:
              "Full Stack Developer",
          }
        );

      const updated =
        useResumeStore
          .getState()
          .resumes[0];

      expect(
        updated.personalInfo
          .firstName
      ).toBe("Triharsha");

      expect(
        updated.personalInfo.email
      ).toBe(
        "test@example.com"
      );

      expect(
        updated.personalInfo
          .jobTitle
      ).toBe(
        "Full Stack Developer"
      );
    });

    it("updates the resume summary", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .updateSummary(
          resume.id,
          "Java and React developer"
        );

      expect(
        useResumeStore.getState()
          .resumes[0].summary
      ).toBe(
        "Java and React developer"
      );
    });
  });

  /* ========================================
     Section CRUD
  ======================================== */

  describe("section item CRUD", () => {
    it("adds a section item", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      const experience =
        createEmptyExperience();

      experience.jobTitle =
        "Software Developer";

      useResumeStore
        .getState()
        .addSectionItem(
          resume.id,
          "experience",
          experience
        );

      const updated =
        useResumeStore
          .getState()
          .resumes[0];

      expect(
        updated.experience.some(
          (item) =>
            item.id ===
            experience.id
        )
      ).toBe(true);
    });

    it("updates a section item", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      const experienceId =
        resume.experience[0]
          .id;

      useResumeStore
        .getState()
        .updateSectionItem(
          resume.id,
          "experience",
          experienceId,
          {
            jobTitle:
              "Backend Developer",

            company:
              "Acme",
          }
        );

      const experience =
        useResumeStore
          .getState()
          .resumes[0]
          .experience[0];

      expect(
        experience.jobTitle
      ).toBe(
        "Backend Developer"
      );

      expect(
        experience.company
      ).toBe("Acme");
    });

    it("removes a section item", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      const experienceId =
        resume.experience[0]
          .id;

      useResumeStore
        .getState()
        .removeSectionItem(
          resume.id,
          "experience",
          experienceId
        );

      expect(
        useResumeStore.getState()
          .resumes[0]
          .experience
      ).toEqual([]);
    });
  });

  /* ========================================
     Skills
  ======================================== */

  describe("skills", () => {
    it("sets skills", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .setSkills(
          resume.id,
          [
            "React",
            "Java",
          ]
        );

      expect(
        useResumeStore.getState()
          .resumes[0].skills
      ).toEqual([
        "React",
        "Java",
      ]);
    });

    it("falls back to an empty array for invalid skills", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .setSkills(
          resume.id,
          null
        );

      expect(
        useResumeStore.getState()
          .resumes[0].skills
      ).toEqual([]);
    });
  });

  /* ========================================
     Job Target / Analysis / Customization
  ======================================== */

  describe("nested resume updates", () => {
    it("updates job target while preserving other job target fields", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .updateJobTarget(
          resume.id,
          {
            jobTitle:
              "Java Developer",
          }
        );

      useResumeStore
        .getState()
        .updateJobTarget(
          resume.id,
          {
            company:
              "Example Corp",
          }
        );

      const jobTarget =
        useResumeStore
          .getState()
          .resumes[0]
          .jobTarget;

      expect(
        jobTarget.jobTitle
      ).toBe(
        "Java Developer"
      );

      expect(
        jobTarget.company
      ).toBe(
        "Example Corp"
      );
    });

    it("merges analysis updates", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .updateAnalysis(
          resume.id,
          {
            overallScore: 80,
          }
        );

      useResumeStore
        .getState()
        .updateAnalysis(
          resume.id,
          {
            atsScore: 90,
          }
        );

      const analysis =
        useResumeStore
          .getState()
          .resumes[0]
          .analysis;

      expect(
        analysis.overallScore
      ).toBe(80);

      expect(
        analysis.atsScore
      ).toBe(90);
    });

    it("merges customization updates", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .updateCustomization(
          resume.id,
          {
            fontSize: "small",
          }
        );

      useResumeStore
        .getState()
        .updateCustomization(
          resume.id,
          {
            spacing: "compact",
          }
        );

      const customization =
        useResumeStore
          .getState()
          .resumes[0]
          .customization;

      expect(
        customization.fontSize
      ).toBe("small");

      expect(
        customization.spacing
      ).toBe("compact");

      expect(
        customization.fontFamily
      ).toBe("Inter");
    });
  });

  /* ========================================
     Duplicate
  ======================================== */

  describe("duplicateResume", () => {
    it("duplicates a resume, prepends it, and makes it active", () => {
      const original =
        useResumeStore
          .getState()
          .addResume({
            title:
              "Developer Resume",
          });

      useResumeStore
        .getState()
        .setSkills(
          original.id,
          ["React"]
        );

      const duplicate =
        useResumeStore
          .getState()
          .duplicateResume(
            original.id
        );

      const state =
        useResumeStore.getState();

      expect(duplicate).not.toBeNull();

      expect(
        state.resumes
      ).toHaveLength(2);

      expect(
        state.resumes[0].id
      ).toBe(duplicate.id);

      expect(
        state.activeResumeId
      ).toBe(duplicate.id);

      expect(
        duplicate.title
      ).toBe(
        "Developer Resume Copy"
      );

      expect(
        duplicate.skills
      ).toEqual(["React"]);
    });

    it("returns null when the original resume does not exist", () => {
      const duplicate =
        useResumeStore
          .getState()
          .duplicateResume(
            "missing-resume"
        );

      expect(duplicate).toBeNull();

      expect(
        useResumeStore.getState()
          .resumes
      ).toEqual([]);
    });
  });

  /* ========================================
     Delete
  ======================================== */

  describe("deleteResume", () => {
    it("deletes a non-active resume without changing the active resume", () => {
      const first =
        useResumeStore
          .getState()
          .addResume({
            title: "First",
          });

      const second =
        useResumeStore
          .getState()
          .addResume({
            title: "Second",
          });

      /*
       * Second is currently active.
       * Delete First.
       */

      useResumeStore
        .getState()
        .deleteResume(
          first.id
        );

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].id
      ).toBe(second.id);

      expect(
        state.activeResumeId
      ).toBe(second.id);
    });

    it("falls back to another resume when the active resume is deleted", () => {
      const first =
        useResumeStore
          .getState()
          .addResume({
            title: "First",
          });

      const second =
        useResumeStore
          .getState()
          .addResume({
            title: "Second",
          });

      expect(
        useResumeStore.getState()
          .activeResumeId
      ).toBe(second.id);

      useResumeStore
        .getState()
        .deleteResume(
          second.id
        );

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].id
      ).toBe(first.id);

      expect(
        state.activeResumeId
      ).toBe(first.id);
    });

    it("clears activeResumeId when the final resume is deleted", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .deleteResume(
          resume.id
        );

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toEqual([]);

      expect(
        state.activeResumeId
      ).toBeNull();
    });

    it("does nothing when deleting an unknown resume", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .deleteResume(
          "missing-resume"
        );

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].id
      ).toBe(resume.id);
    });
  });

  /* ========================================
     Backup Restoration
  ======================================== */

  describe("restoreBackup", () => {
    it("restores valid resumes and active resume", () => {
      const first =
        createResume({
          title:
            "Backup First",
        });

      const second =
        createResume({
          title:
            "Backup Second",
        });

      useResumeStore
        .getState()
        .restoreBackup({
          resumes: [
            first,
            second,
          ],

          activeResumeId:
            second.id,
        });

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(2);

      expect(
        state.activeResumeId
      ).toBe(second.id);
    });

    it("falls back to the first resume when backup activeResumeId is stale", () => {
      const first =
        createResume({
          title:
            "Backup First",
        });

      const second =
        createResume({
          title:
            "Backup Second",
        });

      useResumeStore
        .getState()
        .restoreBackup({
          resumes: [
            first,
            second,
          ],

          activeResumeId:
            "missing-resume",
        });

      const state =
        useResumeStore.getState();

      expect(
        state.activeResumeId
      ).toBe(first.id);
    });

    it("safely restores malformed backup data as an empty state", () => {
      useResumeStore
        .getState()
        .restoreBackup({
          resumes: null,
          activeResumeId:
            "missing",
        });

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toEqual([]);

      expect(
        state.activeResumeId
      ).toBeNull();
    });
  });

  /* ========================================
     Clear
  ======================================== */

  describe("clearResumes", () => {
    it("removes every resume and clears the active resume", () => {
      useResumeStore
        .getState()
        .addResume();

      useResumeStore
        .getState()
        .addResume();

      useResumeStore
        .getState()
        .clearResumes();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toEqual([]);

      expect(
        state.activeResumeId
      ).toBeNull();
    });
  });

  /* ========================================
     Selectors
  ======================================== */

  describe("selectors", () => {
    it("returns resume state through selectors", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      const state =
        useResumeStore.getState();

      expect(
        selectResumes(state)
      ).toBe(state.resumes);

      expect(
        selectActiveResumeId(
          state
        )
      ).toBe(resume.id);

      expect(
        selectActiveResume(state)
          ?.id
      ).toBe(resume.id);

      expect(
        selectResumeCount(state)
      ).toBe(1);
    });

    it("returns null when no active resume exists", () => {
      const state =
        useResumeStore.getState();

      expect(
        selectActiveResume(state)
      ).toBeNull();
    });
  });
});