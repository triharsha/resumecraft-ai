import {
  describe,
  expect,
  it,
} from "vitest";

import {
  analyzeResume,
} from "../atsAnalyzer";

import {
  createResume,
} from "../../resume";

/* ========================================
   Helpers
======================================== */

const createTestResume = (
  overrides = {}
) => {
  const resume =
    createResume({
      title:
        "Fresher Test Resume",
    });

  return {
    ...resume,
    ...overrides,
  };
};

const strongPersonalInfo = {
  firstName: "Alex",
  lastName: "Morgan",

  jobTitle:
    "Software Developer",

  email:
    "alex@example.com",

  phone:
    "9999999999",

  location:
    "Hyderabad",

  linkedin:
    "linkedin.com/in/alex",

  github: "",
  website: "",
};

const strongSummary = `
Software developer with a strong foundation
in Java, React, Spring Boot, database design,
REST APIs, object oriented programming and
modern web development. Experienced through
academic and personal projects in designing,
building, testing and improving complete
applications while applying clean coding
practices and collaborative development
workflows.
`;

const strongSkills = [
  "Java",
  "Spring Boot",
  "React",
  "JavaScript",
  "HTML",
  "CSS",
  "MySQL",
  "Git",
];

const strongEducation = [
  {
    id: "education-1",

    institution:
      "Example University",

    degree:
      "Bachelor of Technology",

    fieldOfStudy:
      "Computer Science",

    location:
      "Hyderabad",

    startDate:
      "2022-06",

    endDate:
      "2026-05",

    current: false,

    description:
      "Studied software engineering and computer science.",
  },
];

const strongProject = {
  id: "project-1",

  name:
    "ResumeCraft AI",

  description:
    `
    Developed a responsive resume builder
    application using React and modern
    frontend architecture. Implemented
    persistent resume management, ATS
    analysis, PDF import and export, and
    reusable resume templates for users.
    `,

  technologies: [
    "React",
    "JavaScript",
    "Tailwind CSS",
  ],

  projectUrl: "",
  githubUrl: "",
};

const strongExperience = {
  id: "experience-1",

  jobTitle:
    "Software Developer",

  company:
    "Example Technologies",

  employmentType:
    "full-time",

  location:
    "Hyderabad",

  startDate:
    "2025-01",

  endDate: "",

  current: true,

  description:
    `
    Developed and improved production
    applications using Java and React,
    implemented reusable components,
    optimized application performance,
    collaborated with team members and
    delivered features used by more than
    100 customers with measurable impact.
    `,
};

/* ========================================
   Fresher Practical Evidence
======================================== */

describe("fresher practical evidence", () => {
  it("does not require professional experience when a fresher has a visible project", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [],

        projects: [
          strongProject,
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestionIds =
      result.suggestions.map(
        (item) => item.id
      );

    expect(
      suggestionIds
    ).not.toContain(
      "missing-experience"
    );

    expect(
      suggestionIds
    ).not.toContain(
      "fresher-practical-experience"
    );
  });

  it("asks a fresher without experience or projects for practical evidence", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [],
        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestion =
      result.suggestions.find(
        (item) =>
          item.id ===
          "fresher-practical-experience"
      );

    expect(
      suggestion
    ).toBeDefined();

    expect(
      suggestion.priority
    ).toBe("high");

    expect(
      suggestion.targetSection
    ).toBe("projects");

    expect(
      suggestion.actionLabel
    ).toBe(
      "Add Practical Evidence"
    );

    expect(
      suggestion.message
        .toLowerCase()
    ).toContain(
      "internships or strong projects"
    );
  });

  it("does not give a fresher the experienced-candidate missing-experience suggestion", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [],
        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "missing-experience"
      )
    ).toBe(false);
  });

  it("accepts professional experience for a fresher when it exists", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [
          strongExperience,
        ],

        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "fresher-practical-experience"
      )
    ).toBe(false);

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "missing-experience"
      )
    ).toBe(false);
  });
});

/* ========================================
   Fresher Project Expectations
======================================== */

describe("fresher project expectations", () => {
  it("specifically recommends a project when a fresher has no projects", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [],
        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestion =
      result.suggestions.find(
        (item) =>
          item.id ===
          "fresher-missing-project"
      );

    expect(
      suggestion
    ).toBeDefined();

    expect(
      suggestion.category
    ).toBe("Content");

    expect(
      suggestion.priority
    ).toBe("high");

    expect(
      suggestion.targetSection
    ).toBe("projects");

    expect(
      suggestion.actionLabel
    ).toBe("Add Project");
  });

  it("does not show the fresher missing-project suggestion when a project exists", () => {
    const resume =
      createTestResume({
        isFresher: true,

        projects: [
          strongProject,
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "fresher-missing-project"
      )
    ).toBe(false);
  });

  it("still evaluates project quality for fresher projects", () => {
    const resume =
      createTestResume({
        isFresher: true,

        projects: [
          {
            id: "project-weak",

            name:
              "Portfolio",

            description:
              "React project",

            technologies: [],
          },
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestion =
      result.suggestions.find(
        (item) =>
          item.id ===
          "project-quality"
      );

    expect(
      suggestion
    ).toBeDefined();

    expect(
      suggestion.targetSection
    ).toBe("projects");
  });

  it("does not flag a complete fresher project for project quality", () => {
    const resume =
      createTestResume({
        isFresher: true,

        projects: [
          strongProject,
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "project-quality"
      )
    ).toBe(false);
  });
});

/* ========================================
   Experienced Resume Rules
======================================== */

describe("experienced resume practical evidence", () => {
  it("requires professional experience for a non-fresher", () => {
    const resume =
      createTestResume({
        isFresher: false,

        experience: [],
        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestion =
      result.suggestions.find(
        (item) =>
          item.id ===
          "missing-experience"
      );

    expect(
      suggestion
    ).toBeDefined();

    expect(
      suggestion.priority
    ).toBe("high");

    expect(
      suggestion.targetSection
    ).toBe("experience");

    expect(
      suggestion.actionLabel
    ).toBe(
      "Add Experience"
    );
  });

  it("does not replace professional experience with projects for a non-fresher", () => {
    const resume =
      createTestResume({
        isFresher: false,

        experience: [],

        projects: [
          strongProject,
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "missing-experience"
      )
    ).toBe(true);
  });

  it("does not show missing-experience when professional experience exists", () => {
    const resume =
      createTestResume({
        isFresher: false,

        experience: [
          strongExperience,
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "missing-experience"
      )
    ).toBe(false);
  });

  it("does not show fresher-specific project recommendations to a non-fresher", () => {
    const resume =
      createTestResume({
        isFresher: false,

        experience: [],
        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "fresher-missing-project"
      )
    ).toBe(false);

    expect(
      result.suggestions.some(
        (item) =>
          item.id ===
          "fresher-practical-experience"
      )
    ).toBe(false);
  });
});

/* ========================================
   Fresher vs Experienced Scoring
======================================== */

describe("fresher and experienced scoring", () => {
  it("gives a fresher with a project more ATS readiness than the same fresher without practical evidence", () => {
    const base = {
      isFresher: true,

      personalInfo:
        strongPersonalInfo,

      summary:
        strongSummary,

      education:
        strongEducation,

      skills:
        strongSkills,

      experience: [],
    };

    const withProject =
      analyzeResume(
        createTestResume({
          ...base,

          projects: [
            strongProject,
          ],
        })
      );

    const withoutProject =
      analyzeResume(
        createTestResume({
          ...base,

          projects: [],
        })
      );

    expect(
      withProject.atsScore
    ).toBeGreaterThan(
      withoutProject.atsScore
    );
  });

  it("gives a non-fresher with professional experience more ATS readiness than one without experience", () => {
    const base = {
      isFresher: false,

      personalInfo:
        strongPersonalInfo,

      summary:
        strongSummary,

      education:
        strongEducation,

      skills:
        strongSkills,

      projects: [],
    };

    const withExperience =
      analyzeResume(
        createTestResume({
          ...base,

          experience: [
            strongExperience,
          ],
        })
      );

    const withoutExperience =
      analyzeResume(
        createTestResume({
          ...base,

          experience: [],
        })
      );

    expect(
      withExperience.atsScore
    ).toBeGreaterThan(
      withoutExperience.atsScore
    );
  });

  it("allows a strong fresher project to provide the same ATS practical-evidence points as experience", () => {
    const base = {
      personalInfo:
        strongPersonalInfo,

      summary:
        strongSummary,

      education:
        strongEducation,

      skills:
        strongSkills,
    };

    const fresher =
      analyzeResume(
        createTestResume({
          ...base,

          isFresher: true,

          experience: [],

          projects: [
            strongProject,
          ],
        })
      );

    const experienced =
      analyzeResume(
        createTestResume({
          ...base,

          isFresher: false,

          experience: [
            strongExperience,
          ],

          projects: [],
        })
      );

    expect(
      fresher.atsScore
    ).toBe(
      experienced.atsScore
    );
  });
});

/* ========================================
   Impact Logic
======================================== */

describe("fresher impact logic", () => {
  it("uses project descriptions for fresher impact scoring", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [],

        projects: [
          {
            ...strongProject,

            description:
              `
              Developed and optimized a
              React application used by
              100 users, improving page
              performance by 35 percent
              while reducing repetitive
              workflows and increasing
              overall productivity for
              users during resume creation.
              `,
          },
        ],
      });

    const result =
      analyzeResume(
        resume
      );

    expect(
      result.impactScore
    ).toBeGreaterThan(0);
  });

  it("directs missing impact content to projects when no experience exists", () => {
    const resume =
      createTestResume({
        isFresher: true,

        experience: [],
        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestion =
      result.suggestions.find(
        (item) =>
          item.id ===
          "missing-impact-content"
      );

    expect(
      suggestion
    ).toBeDefined();

    expect(
      suggestion.targetSection
    ).toBe("projects");

    expect(
      suggestion.actionLabel
    ).toBe(
      "Improve Projects"
    );
  });

  it("directs impact improvements to experience when experience exists", () => {
    const resume =
      createTestResume({
        isFresher: false,

        experience: [
          {
            ...strongExperience,

            description:
              "Worked on software.",
          },
        ],

        projects: [],
      });

    const result =
      analyzeResume(
        resume
      );

    const suggestion =
      result.suggestions.find(
        (item) =>
          item.id ===
          "weak-action-verbs"
      );

    expect(
      suggestion
    ).toBeDefined();

    expect(
      suggestion.targetSection
    ).toBe("experience");
  });
});