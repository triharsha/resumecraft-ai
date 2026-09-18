import {
  describe,
  expect,
  it,
} from "vitest";

import {
  analyzeTailoring,
} from "../tailoringAnalyzer";

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
        "Tailoring Test Resume",
    });

  return {
    ...resume,
    ...overrides,
  };
};

const createJobTarget = (
  jobDescription,
  overrides = {}
) => ({
  jobTitle:
    "Full Stack Developer",

  company:
    "Example Corp",

  jobDescription,

  ...overrides,
});

/* ========================================
   No Job Target
======================================== */

describe("analyzeTailoring - no job target", () => {
  it("returns a safe result when resume is missing", () => {
    const result =
      analyzeTailoring(null);

    expect(result).toEqual({
      hasJobTarget: false,

      jobTitle: "",
      company: "",

      recommendations: [],

      summary: {
        matchScore: 0,
        matchedCount: 0,
        missingCount: 0,
        totalKeywords: 0,
        recommendationCount: 0,
        highPriorityCount: 0,
        mediumPriorityCount: 0,
        isStrongMatch: false,
        needsTailoring: false,
      },
    });
  });

  it("returns no tailoring recommendations without a job description", () => {
    const resume =
      createTestResume({
        jobTarget: {
          jobTitle:
            "Java Developer",

          company:
            "Acme",

          jobDescription: "",
        },
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.hasJobTarget
    ).toBe(false);

    expect(
      result.jobTitle
    ).toBe(
      "Java Developer"
    );

    expect(
      result.company
    ).toBe("Acme");

    expect(
      result.recommendations
    ).toEqual([]);

    expect(
      result.summary
        .needsTailoring
    ).toBe(false);
  });

  it("treats whitespace-only job descriptions as missing", () => {
    const resume =
      createTestResume({
        jobTarget:
          createJobTarget(
            "     "
          ),
      });

    expect(
      analyzeTailoring(
        resume
      ).hasJobTarget
    ).toBe(false);
  });
});

/* ========================================
   Job Target Metadata
======================================== */

describe("analyzeTailoring - job target metadata", () => {
  it("preserves job title and company", () => {
    const resume =
      createTestResume({
        jobTarget:
          createJobTarget(
            "Java and React required.",
            {
              jobTitle:
                "Senior Java Developer",

              company:
                "Tech Corp",
            }
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.hasJobTarget
    ).toBe(true);

    expect(
      result.jobTitle
    ).toBe(
      "Senior Java Developer"
    );

    expect(
      result.company
    ).toBe("Tech Corp");
  });

  it("allows analysis when title and company are empty but description exists", () => {
    const resume =
      createTestResume({
        jobTarget: {
          jobTitle: "",
          company: "",

          jobDescription:
            "Java React Docker required.",
        },
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.hasJobTarget
    ).toBe(true);

    expect(
      result.jobTitle
    ).toBe("");

    expect(
      result.company
    ).toBe("");
  });
});

/* ========================================
   Recommendation Generation
======================================== */

describe("analyzeTailoring - recommendations", () => {
  it("creates recommendations only for missing keywords", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
        ],

        jobTarget:
          createJobTarget(
            `
            Java React Docker
            required.
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const recommendedKeywords =
      result.recommendations.map(
        (item) =>
          item.keyword
      );

    expect(
      recommendedKeywords
    ).not.toContain("java");

    expect(
      recommendedKeywords
    ).toContain("react");

    expect(
      recommendedKeywords
    ).toContain("docker");
  });

  it("does not recommend anything when every target keyword is matched", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "React",
          "Docker",
        ],

        jobTarget:
          createJobTarget(
            "Java React Docker"
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.recommendations
    ).toEqual([]);

    expect(
      result.summary
        .recommendationCount
    ).toBe(0);

    expect(
      result.summary
        .needsTailoring
    ).toBe(false);
  });

  it("creates stable recommendation IDs from keywords", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            Spring Boot and React
            required.
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const spring =
      result.recommendations.find(
        (item) =>
          item.keyword ===
          "spring boot"
      );

    expect(spring).toBeDefined();

    expect(spring.id).toBe(
      "tailor-spring-boot"
    );
  });

  it("sets every recommendation category to Tailoring", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            Java React Docker
            required.
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.recommendations
        .length
    ).toBeGreaterThan(0);

    result.recommendations.forEach(
      (recommendation) => {
        expect(
          recommendation.category
        ).toBe("Tailoring");
      }
    );
  });
});

/* ========================================
   Technical Keyword Destination
======================================== */

describe("analyzeTailoring - technical keyword destinations", () => {
  it("recommends Skills first for a missing technical keyword", () => {
    const resume =
      createTestResume({
        skills: [],

        experience: [],

        projects: [],

        jobTarget:
          createJobTarget(
            "Docker required."
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const docker =
      result.recommendations.find(
        (item) =>
          item.keyword ===
          "docker"
      );

    expect(docker).toBeDefined();

    expect(
      docker.keywordType
    ).toBe("technical");

    expect(
      docker.targetSection
    ).toBe("skills");

    expect(
      docker.actionLabel
    ).toBe(
      "Review Skills"
    );
  });

  it("technical recommendation message warns to add the skill only if genuine", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            "Docker required."
          ),
      });

    const docker =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "docker"
      );

    expect(
      docker.message
        .toLowerCase()
    ).toContain(
      "if you genuinely have this skill"
    );

    expect(
      docker.message
    ).toContain(
      "Skills section"
    );
  });
});

/* ========================================
   Soft Skill Destination
======================================== */

describe("analyzeTailoring - soft-skill destinations", () => {
  it("recommends Experience for a missing soft skill when experience exists", () => {
    const resume =
      createTestResume({
        experience: [
          {
            id: "exp-1",

            jobTitle:
              "Developer",

            company:
              "Example Corp",

            description:
              "Built backend systems",
          },
        ],

        projects: [],

        jobTarget:
          createJobTarget(
            "Communication required."
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const communication =
      result.recommendations.find(
        (item) =>
          item.keyword ===
          "communication"
      );

    expect(
      communication
    ).toBeDefined();

    expect(
      communication
        .keywordType
    ).toBe("soft-skill");

    expect(
      communication
        .targetSection
    ).toBe("experience");

    expect(
      communication
        .actionLabel
    ).toBe(
      "Tailor Experience"
    );
  });

  it("recommends Projects for a soft skill when no experience exists", () => {
    const resume =
      createTestResume({
        experience: [],

        projects: [],

        jobTarget:
          createJobTarget(
            "Leadership required."
          ),
      });

    const leadership =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "leadership"
      );

    expect(
      leadership
    ).toBeDefined();

    expect(
      leadership
        .targetSection
    ).toBe("projects");

    expect(
      leadership
        .actionLabel
    ).toBe(
      "Tailor Projects"
    );
  });

  it("soft-skill recommendation asks for truthful evidence", () => {
    const resume =
      createTestResume({
        experience: [],

        projects: [],

        jobTarget:
          createJobTarget(
            "Leadership required."
          ),
      });

    const leadership =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "leadership"
      );

    expect(
      leadership.message
        .toLowerCase()
    ).toContain(
      "truthful example"
    );
  });
});

/* ========================================
   Domain Keyword Destination
======================================== */

describe("analyzeTailoring - domain keyword destinations", () => {
  it("recommends Experience first for a repeated domain keyword when experience exists", () => {
    const resume =
      createTestResume({
        experience: [
          {
            id: "exp-1",

            jobTitle:
              "Developer",

            company:
              "Example Corp",

            description:
              "Built scalable services",
          },
        ],

        projects: [],

        jobTarget:
          createJobTarget(
            `
            Payments systems require
            payments expertise and
            payments reliability
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const payments =
      result.recommendations.find(
        (item) =>
          item.keyword ===
          "payments"
      );

    expect(payments).toBeDefined();

    expect(
      payments.keywordType
    ).toBe("domain");

    expect(
      payments.targetSection
    ).toBe("experience");
  });

  it("recommends Projects for a domain keyword when experience is unavailable", () => {
    const resume =
      createTestResume({
        experience: [],

        projects: [],

        jobTarget:
          createJobTarget(
            `
            Payments systems use
            payments workflows
            `
          ),
      });

    const payments =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "payments"
      );

    expect(payments).toBeDefined();

    expect(
      payments.targetSection
    ).toBe("projects");
  });

  it("domain recommendation encourages natural truthful terminology", () => {
    const resume =
      createTestResume({
        experience: [],

        projects: [],

        jobTarget:
          createJobTarget(
            `
            Payments systems use
            payments workflows
            `
          ),
      });

    const payments =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "payments"
      );

    expect(
      payments.message
        .toLowerCase()
    ).toContain(
      "accurately reflects your background"
    );

    expect(
      payments.message
        .toLowerCase()
    ).toContain(
      "naturally"
    );
  });
});

/* ========================================
   Priority
======================================== */

describe("analyzeTailoring - priority", () => {
  it("maps high-importance missing keywords to high priority", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            Docker Docker Docker Docker
            `
          ),
      });

    const docker =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "docker"
      );

    expect(docker).toBeDefined();

    expect(
      docker.importance
    ).toBe("high");

    expect(
      docker.priority
    ).toBe("high");
  });

  it("maps medium-importance technical keywords to medium priority", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            "React required"
          ),
      });

    const react =
      analyzeTailoring(
        resume
      ).recommendations.find(
        (item) =>
          item.keyword ===
          "react"
      );

    expect(react).toBeDefined();

    expect(
      react.importance
    ).toBe("medium");

    expect(
      react.priority
    ).toBe("medium");
  });

  it("sorts higher-priority recommendations before lower-priority recommendations", () => {
    const resume =
      createTestResume({
        skills: [],

        experience: [],

        projects: [],

        jobTarget:
          createJobTarget(
            `
            Docker Docker Docker Docker
            React
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const dockerIndex =
      result.recommendations
        .findIndex(
          (item) =>
            item.keyword ===
            "docker"
        );

    const reactIndex =
      result.recommendations
        .findIndex(
          (item) =>
            item.keyword ===
            "react"
        );

    expect(
      dockerIndex
    ).toBeGreaterThanOrEqual(0);

    expect(
      reactIndex
    ).toBeGreaterThanOrEqual(0);

    expect(
      dockerIndex
    ).toBeLessThan(
      reactIndex
    );
  });
});

/* ========================================
   Tailoring Summary
======================================== */

describe("analyzeTailoring - summary", () => {
  it("keeps summary counts consistent with recommendations", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
        ],

        jobTarget:
          createJobTarget(
            `
            Java React Docker AWS
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.summary
        .recommendationCount
    ).toBe(
      result.recommendations
        .length
    );

    expect(
      result.summary
        .missingCount
    ).toBe(
      result.recommendations
        .length
    );

    expect(
      result.summary
        .matchedCount +
        result.summary
          .missingCount
    ).toBe(
      result.summary
        .totalKeywords
    );
  });

  it("counts high-priority recommendations correctly", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            Docker Docker Docker Docker
            AWS AWS AWS AWS
            React
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const actualHigh =
      result.recommendations.filter(
        (item) =>
          item.priority ===
          "high"
      ).length;

    expect(
      result.summary
        .highPriorityCount
    ).toBe(actualHigh);
  });

  it("counts medium-priority recommendations correctly", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            Java React Docker
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const actualMedium =
      result.recommendations.filter(
        (item) =>
          item.priority ===
          "medium"
      ).length;

    expect(
      result.summary
        .mediumPriorityCount
    ).toBe(actualMedium);
  });

  it("sets needsTailoring when recommendations exist", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            "Java React Docker"
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.recommendations
        .length
    ).toBeGreaterThan(0);

    expect(
      result.summary
        .needsTailoring
    ).toBe(true);
  });

  it("sets needsTailoring false when all keywords are matched", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "React",
          "Docker",
        ],

        jobTarget:
          createJobTarget(
            "Java React Docker"
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.summary
        .needsTailoring
    ).toBe(false);
  });

  it("marks a 100 percent keyword match as strong", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "React",
          "Docker",
          "AWS",
        ],

        jobTarget:
          createJobTarget(
            "Java React Docker AWS"
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.summary
        .matchScore
    ).toBe(100);

    expect(
      result.summary
        .isStrongMatch
    ).toBe(true);
  });

  it("marks a weak keyword match as not strong", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            Java React Spring Boot
            Docker AWS
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    expect(
      result.summary
        .matchScore
    ).toBeLessThan(75);

    expect(
      result.summary
        .isStrongMatch
    ).toBe(false);
  });
});

/* ========================================
   Recommendation Integrity
======================================== */

describe("analyzeTailoring - recommendation integrity", () => {
  it("does not create duplicate recommendation IDs", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            `
            React React.js ReactJS
            Node NodeJS Node.js
            Docker Docker
            `
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    const ids =
      result.recommendations.map(
        (item) => item.id
      );

    expect(
      new Set(ids).size
    ).toBe(ids.length);
  });

  it("provides required recommendation fields", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget:
          createJobTarget(
            "Java React Docker"
          ),
      });

    const result =
      analyzeTailoring(
        resume
      );

    result.recommendations.forEach(
      (item) => {
        expect(
          item.id
        ).toBeTruthy();

        expect(
          item.keyword
        ).toBeTruthy();

        expect(
          item.keywordType
        ).toBeTruthy();

        expect(
          item.importance
        ).toBeTruthy();

        expect(
          typeof item.frequency
        ).toBe("number");

        expect(
          item.priority
        ).toBeTruthy();

        expect(
          item.category
        ).toBe("Tailoring");

        expect(
          item.targetSection
        ).toBeTruthy();

        expect(
          item.actionLabel
        ).toBeTruthy();

        expect(
          item.message
        ).toBeTruthy();
      }
    );
  });
});