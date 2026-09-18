import {
  describe,
  expect,
  it,
} from "vitest";

import {
  analyzeKeywords,
  buildResumeSearchText,
  extractJobKeywords,
} from "../keywordAnalyzer";

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
      title: "Test Resume",
    });

  return {
    ...resume,
    ...overrides,
  };
};

/* ========================================
   buildResumeSearchText
======================================== */

describe("buildResumeSearchText", () => {
  it("returns an empty string for missing resume data", () => {
    expect(
      buildResumeSearchText(null)
    ).toBe("");
  });

  it("includes job title and summary", () => {
    const resume =
      createTestResume({
        personalInfo: {
          jobTitle:
            "Java Developer",
        },

        summary:
          "Building Spring Boot applications",
      });

    const text =
      buildResumeSearchText(
        resume
      );

    expect(text).toContain(
      "java developer"
    );

    expect(text).toContain(
      "spring boot applications"
    );
  });

  it("includes experience information", () => {
    const resume =
      createTestResume({
        experience: [
          {
            id: "exp-1",

            jobTitle:
              "Backend Developer",

            company:
              "Acme Technologies",

            employmentType:
              "full-time",

            location:
              "Hyderabad",

            description:
              "Developed REST APIs using Java",
          },
        ],
      });

    const text =
      buildResumeSearchText(
        resume
      );

    expect(text).toContain(
      "backend developer"
    );

    expect(text).toContain(
      "acme technologies"
    );

    expect(text).toContain(
      "rest apis"
    );

    expect(text).toContain(
      "java"
    );
  });

  it("includes education information", () => {
    const resume =
      createTestResume({
        education: [
          {
            id: "edu-1",

            degree:
              "Bachelor of Technology",

            fieldOfStudy:
              "Computer Science",

            institution:
              "Example University",

            description:
              "Studied algorithms and data structures",
          },
        ],
      });

    const text =
      buildResumeSearchText(
        resume
      );

    expect(text).toContain(
      "bachelor of technology"
    );

    expect(text).toContain(
      "computer science"
    );

    expect(text).toContain(
      "example university"
    );

    expect(text).toContain(
      "algorithms"
    );
  });

  it("includes skills", () => {
    const resume =
      createTestResume({
        skills: [
          "React",
          "Java",
          "MySQL",
        ],
      });

    const text =
      buildResumeSearchText(
        resume
      );

    expect(text).toContain(
      "react"
    );

    expect(text).toContain(
      "java"
    );

    expect(text).toContain(
      "mysql"
    );
  });

  it("includes project names, descriptions, and technologies", () => {
    const resume =
      createTestResume({
        projects: [
          {
            id: "project-1",

            name:
              "Movie Booking System",

            description:
              "Built secure booking APIs",

            technologies: [
              "Spring Boot",
              "JWT",
              "MySQL",
            ],
          },
        ],
      });

    const text =
      buildResumeSearchText(
        resume
      );

    expect(text).toContain(
      "movie booking system"
    );

    expect(text).toContain(
      "secure booking apis"
    );

    expect(text).toContain(
      "spring boot"
    );

    expect(text).toContain(
      "jwt"
    );
  });

  it("includes certification name and issuer", () => {
    const resume =
      createTestResume({
        certifications: [
          {
            id: "cert-1",

            name:
              "AWS Developer",

            issuer:
              "Amazon Web Services",
          },
        ],
      });

    const text =
      buildResumeSearchText(
        resume
      );

    expect(text).toContain(
      "aws developer"
    );

    expect(text).toContain(
      "amazon web services"
    );
  });

  it("handles malformed array fields safely", () => {
    const resume =
      createTestResume({
        experience: null,
        education: "invalid",
        skills: null,
        projects: {},
        certifications: 123,
      });

    expect(() =>
      buildResumeSearchText(
        resume
      )
    ).not.toThrow();
  });
});

/* ========================================
   extractJobKeywords
======================================== */

describe("extractJobKeywords", () => {
  it("returns no keywords for an empty job description", () => {
    expect(
      extractJobKeywords("")
    ).toEqual([]);

    expect(
      extractJobKeywords("   ")
    ).toEqual([]);
  });

  it("detects known technical keywords", () => {
    const keywords =
      extractJobKeywords(
        `
        We are looking for a developer
        with Java, Spring Boot, React,
        MySQL and Docker experience.
        `
      );

    expect(keywords).toContain(
      "java"
    );

    expect(keywords).toContain(
      "spring boot"
    );

    expect(keywords).toContain(
      "react"
    );

    expect(keywords).toContain(
      "mysql"
    );

    expect(keywords).toContain(
      "docker"
    );
  });

  it("detects soft-skill keywords", () => {
    const keywords =
      extractJobKeywords(
        `
        Strong communication,
        collaboration and leadership
        are important for this role.
        `
      );

    expect(keywords).toContain(
      "communication"
    );

    expect(keywords).toContain(
      "collaboration"
    );

    expect(keywords).toContain(
      "leadership"
    );
  });

  it("canonicalizes React aliases", () => {
    const keywords =
      extractJobKeywords(
        `
        React.js experience is required.
        React.js knowledge is preferred.
        `
      );

    expect(keywords).toContain(
      "react"
    );

    expect(
      keywords.filter(
        (keyword) =>
          keyword === "react"
      )
    ).toHaveLength(1);
  });

  it("canonicalizes Node aliases", () => {
    const keywords =
      extractJobKeywords(
        `
        NodeJS and Node.js are used
        throughout our backend.
        `
      );

    expect(keywords).toContain(
      "node.js"
    );

    expect(
      keywords.filter(
        (keyword) =>
          keyword === "node.js"
      )
    ).toHaveLength(1);
  });

  it("canonicalizes REST aliases", () => {
    const keywords =
      extractJobKeywords(
        `
        Build REST APIs and maintain
        RESTful backend services.
        `
      );

    expect(keywords).toContain(
      "rest api"
    );
  });

  it("does not treat generic job-description noise as frequent keywords", () => {
    const keywords =
      extractJobKeywords(
        `
        We are looking for a candidate.
        The candidate will work with our team.
        Strong experience is required.
        Experience with our team is preferred.
        `
      );

    expect(keywords).not.toContain(
      "candidate"
    );

    expect(keywords).not.toContain(
      "experience"
    );

    expect(keywords).not.toContain(
      "team"
    );

    expect(keywords).not.toContain(
      "required"
    );
  });

  it("includes repeated meaningful domain words", () => {
    const keywords =
      extractJobKeywords(
        `
        Payments platform development.
        Build scalable payments systems.
        Payments reliability is important.
        `
      );

    expect(keywords).toContain(
      "payments"
    );
  });

  it("does not promote a random one-off domain word", () => {
    const keywords =
      extractJobKeywords(
        `
        Our platform includes observability.
        The role requires Java development.
        `
      );

    expect(keywords).not.toContain(
      "observability"
    );

    expect(keywords).toContain(
      "java"
    );
  });

  it("returns unique keywords", () => {
    const keywords =
      extractJobKeywords(
        `
        React React.js ReactJS.
        Java Java Java.
        Spring Boot Spring Boot.
        `
      );

    expect(
      new Set(keywords).size
    ).toBe(keywords.length);
  });

  it("limits extracted keywords to 35", () => {
    const repeatedWords =
      Array.from(
        {
          length: 50,
        },
        (_, index) =>
          `domainword${index} domainword${index}`
      ).join(" ");

    const keywords =
      extractJobKeywords(
        repeatedWords
      );

    expect(
      keywords.length
    ).toBeLessThanOrEqual(
      35
    );
  });

  it("does not falsely detect ai inside another word", () => {
    const keywords =
      extractJobKeywords(
        `
        Maintain maintainable systems
        and reliable services.
        `
      );

    expect(keywords).not.toContain(
      "ai"
    );
  });

  it("does not falsely detect c inside normal words", () => {
    const keywords =
      extractJobKeywords(
        `
        Communication and collaboration
        are important.
        `
      );

    expect(keywords).not.toContain(
      "c"
    );
  });
});

/* ========================================
   analyzeKeywords
======================================== */

describe("analyzeKeywords", () => {
  it("returns a safe empty analysis without a job description", () => {
    const resume =
      createTestResume();

    const result =
      analyzeKeywords(
        resume
      );

    expect(result).toEqual({
      score: 0,

      matchedKeywords: [],
      missingKeywords: [],
      targetKeywords: [],

      keywordDetails: [],

      highPriorityMissing: [],

      matchedCount: 0,
      missingCount: 0,
      totalKeywords: 0,

      hasJobDescription: false,
    });
  });

  it("matches resume skills against job-description keywords", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "Spring Boot",
          "React",
        ],

        jobTarget: {
          jobTitle:
            "Full Stack Developer",

          company:
            "Example Corp",

          jobDescription:
            `
            Java Spring Boot and React
            are required.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.matchedKeywords
    ).toContain("java");

    expect(
      result.matchedKeywords
    ).toContain(
      "spring boot"
    );

    expect(
      result.matchedKeywords
    ).toContain("react");
  });

  it("reports missing keywords", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
        ],

        jobTarget: {
          jobDescription:
            `
            Java, Spring Boot,
            Docker and AWS are required.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.matchedKeywords
    ).toContain("java");

    expect(
      result.missingKeywords
    ).toContain(
      "spring boot"
    );

    expect(
      result.missingKeywords
    ).toContain(
      "docker"
    );

    expect(
      result.missingKeywords
    ).toContain("aws");
  });

  it("matches aliases between job description and resume", () => {
    const resume =
      createTestResume({
        skills: [
          "React",
          "Node.js",
        ],

        jobTarget: {
          jobDescription:
            `
            React.js and NodeJS
            experience required.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.matchedKeywords
    ).toContain("react");

    expect(
      result.matchedKeywords
    ).toContain(
      "node.js"
    );
  });

  it("can match keywords found outside the skills array", () => {
    const resume =
      createTestResume({
        skills: [],

        summary:
          `
          Backend developer building
          Spring Boot and MySQL
          applications.
          `,

        jobTarget: {
          jobDescription:
            `
            Spring Boot and MySQL
            experience required.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.matchedKeywords
    ).toContain(
      "spring boot"
    );

    expect(
      result.matchedKeywords
    ).toContain(
      "mysql"
    );
  });

  it("can match keywords from project technologies", () => {
    const resume =
      createTestResume({
        projects: [
          {
            id: "project-1",

            name:
              "Deployment Platform",

            description:
              "Cloud deployment project",

            technologies: [
              "Docker",
              "AWS",
            ],
          },
        ],

        jobTarget: {
          jobDescription:
            `
            Docker and AWS experience
            required.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.matchedKeywords
    ).toContain(
      "docker"
    );

    expect(
      result.matchedKeywords
    ).toContain("aws");
  });

  it("returns keyword details with type, frequency and importance", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
        ],

        jobTarget: {
          jobDescription:
            `
            Java Java Java Java
            Communication is important
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    const java =
      result.keywordDetails.find(
        (item) =>
          item.keyword ===
          "java"
      );

    const communication =
      result.keywordDetails.find(
        (item) =>
          item.keyword ===
          "communication"
      );

    expect(java).toBeDefined();

    expect(java.matched).toBe(
      true
    );

    expect(java.type).toBe(
      "technical"
    );

    expect(
      java.frequency
    ).toBeGreaterThanOrEqual(
      3
    );

    expect(java.importance).toBe(
      "high"
    );

    expect(
      communication
    ).toBeDefined();

    expect(
      communication.type
    ).toBe("soft-skill");
  });

  it("classifies repeated unknown keywords as domain keywords", () => {
    const resume =
      createTestResume({
        jobTarget: {
          jobDescription:
            `
            Payments systems require
            payments expertise and
            payments reliability.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    const payments =
      result.keywordDetails.find(
        (item) =>
          item.keyword ===
          "payments"
      );

    expect(payments).toBeDefined();

    expect(payments.type).toBe(
      "domain"
    );

    expect(
      payments.frequency
    ).toBeGreaterThanOrEqual(
      2
    );
  });

  it("marks repeatedly requested missing technical skills as high priority", () => {
    const resume =
      createTestResume({
        skills: [],

        jobTarget: {
          jobDescription:
            `
            Docker Docker Docker Docker
            AWS AWS AWS AWS
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.highPriorityMissing
    ).toContain(
      "docker"
    );

    expect(
      result.highPriorityMissing
    ).toContain("aws");
  });

  it("does not mark a matched high-priority keyword as missing", () => {
    const resume =
      createTestResume({
        skills: [
          "Docker",
        ],

        jobTarget: {
          jobDescription:
            `
            Docker Docker Docker Docker
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.highPriorityMissing
    ).not.toContain(
      "docker"
    );

    expect(
      result.matchedKeywords
    ).toContain(
      "docker"
    );
  });

  it("calculates counts consistently", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "React",
        ],

        jobTarget: {
          jobDescription:
            `
            Java React Docker AWS.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.matchedCount
    ).toBe(
      result.matchedKeywords
        .length
    );

    expect(
      result.missingCount
    ).toBe(
      result.missingKeywords
        .length
    );

    expect(
      result.totalKeywords
    ).toBe(
      result.targetKeywords
        .length
    );

    expect(
      result.matchedCount +
        result.missingCount
    ).toBe(
      result.totalKeywords
    );
  });

  it("returns a score between 0 and 100", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "React",
        ],

        jobTarget: {
          jobDescription:
            `
            Java React Spring Boot
            Docker AWS communication.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.score
    ).toBeGreaterThanOrEqual(
      0
    );

    expect(
      result.score
    ).toBeLessThanOrEqual(
      100
    );
  });

  it("gives a fully matching resume a score of 100", () => {
    const resume =
      createTestResume({
        skills: [
          "Java",
          "Spring Boot",
          "React",
          "Docker",
          "AWS",
          "Communication",
        ],

        jobTarget: {
          jobDescription:
            `
            Java Spring Boot React
            Docker AWS communication.
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    expect(
      result.missingKeywords
    ).toEqual([]);

    expect(result.score).toBe(
      100
    );
  });

  it("weights important technical keywords more heavily than lower-priority domain keywords", () => {
    const resume =
      createTestResume({
        skills: [
          "payments",
        ],

        jobTarget: {
          jobDescription:
            `
            Docker Docker Docker Docker
            Payments payments
            `,
        },
      });

    const result =
      analyzeKeywords(
        resume
      );

    const docker =
      result.keywordDetails.find(
        (item) =>
          item.keyword ===
          "docker"
      );

    const payments =
      result.keywordDetails.find(
        (item) =>
          item.keyword ===
          "payments"
      );

    expect(docker).toBeDefined();

    expect(payments).toBeDefined();

    expect(
      docker.importance
    ).toBe("high");

    expect(
      payments.importance
    ).not.toBe("high");

    expect(
      result.missingKeywords
    ).toContain("docker");

    expect(
      result.matchedKeywords
    ).toContain("payments");

    expect(
      result.score
    ).toBeLessThan(50);
  });

  it("sets hasJobDescription when analysis is performed", () => {
    const resume =
      createTestResume({
        jobTarget: {
          jobDescription:
            "Java and React required.",
        },
      });

    expect(
      analyzeKeywords(
        resume
      ).hasJobDescription
    ).toBe(true);
  });
});