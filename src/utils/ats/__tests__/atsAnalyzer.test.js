import {
  describe,
  expect,
  it,
} from "vitest";

import {
  analyzeResume,
} from "../atsAnalyzer";

/* ========================================
   Resume Factory
======================================== */

const createResume = (
  overrides = {}
) => {
  return {
    id: "test-resume",

    title: "Test Resume",

    isFresher: false,

    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      jobTitle: "",
      linkedin: "",
      github: "",
      website: "",
    },

    summary: "",

    experience: [],

    education: [],

    skills: [],

    projects: [],

    certifications: [],

    languages: [],

    jobTarget: {
      jobTitle: "",
      company: "",
      jobDescription: "",
    },

    ...overrides,
  };
};

/* ========================================
   Complete Resume Factory
======================================== */

const createStrongResume = (
  overrides = {}
) => {
  return createResume({
    personalInfo: {
      firstName: "Jordan",
      lastName: "Miller",
      email:
        "jordan@example.com",
      phone:
        "+1 555 123 4567",
      location:
        "San Francisco, CA",
      jobTitle:
        "Frontend Developer",
      linkedin:
        "linkedin.com/in/jordan",
      github:
        "github.com/jordan",
      website: "",
    },

    summary:
      "Frontend developer with experience building responsive web applications using modern JavaScript technologies. Skilled in developing maintainable user interfaces, improving application performance, collaborating with cross-functional teams, and delivering reliable products for real users.",

    experience: [
      {
        id: "experience-1",
        jobTitle:
          "Frontend Developer",
        company:
          "Example Labs",
        location:
          "San Francisco, CA",
        description:
          "Developed responsive React applications used by 5000 users and improved page load performance by 35% through component optimization and better frontend architecture.",
      },
    ],

    education: [
      {
        id: "education-1",
        institution:
          "Example University",
        degree:
          "Bachelor of Science",
        fieldOfStudy:
          "Computer Science",
      },
    ],

    skills: [
      "React",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Git",
      "REST API",
      "Agile",
    ],

    projects: [
      {
        id: "project-1",
        name:
          "Project Dashboard",
        description:
          "Built a responsive project management dashboard that improved task visibility for users and reduced common workflow delays by 20%.",
        technologies: [
          "React",
          "JavaScript",
          "CSS",
        ],
      },
    ],

    ...overrides,
  });
};

/* ========================================
   Tests
======================================== */

describe(
  "analyzeResume",
  () => {
    /* =====================================
       Missing Resume
    ===================================== */

    it(
      "returns safe zero values when no resume is provided",
      () => {
        const result =
          analyzeResume(null);

        expect(
          result.overallScore
        ).toBe(0);

        expect(
          result.atsScore
        ).toBe(0);

        expect(
          result.contentScore
        ).toBe(0);

        expect(
          result.impactScore
        ).toBe(0);

        expect(
          result.keywordScore
        ).toBe(0);

        expect(
          result.suggestions
        ).toEqual([]);

        expect(
          result.matchedKeywords
        ).toEqual([]);

        expect(
          result.missingKeywords
        ).toEqual([]);
      }
    );

    /* =====================================
       Empty Resume
    ===================================== */

    it(
      "handles an empty resume without invalid scores",
      () => {
        const result =
          analyzeResume(
            createResume()
          );

        expect(
          result.overallScore
        ).toBeGreaterThanOrEqual(
          0
        );

        expect(
          result.overallScore
        ).toBeLessThanOrEqual(
          100
        );

        expect(
          result.atsScore
        ).toBeGreaterThanOrEqual(
          0
        );

        expect(
          result.atsScore
        ).toBeLessThanOrEqual(
          100
        );

        expect(
          result.contentScore
        ).toBeGreaterThanOrEqual(
          0
        );

        expect(
          result.contentScore
        ).toBeLessThanOrEqual(
          100
        );

        expect(
          result.impactScore
        ).toBe(0);

        expect(
          result.keywordScore
        ).toBe(0);

        expect(
          result.suggestions.length
        ).toBeGreaterThan(0);
      }
    );

    /* =====================================
       No Job Description
    ===================================== */

    it(
      "does not penalize the overall score for keyword matching when no job description exists",
      () => {
        const resume =
          createStrongResume();

        const result =
          analyzeResume(resume);

        /*
         * Keyword analysis must remain inactive
         * when there is no job description.
         *
         * The overall score includes the internal
         * Evidence Depth calibration, so this test
         * verifies public behavior rather than
         * duplicating the private scoring formula.
         */

        expect(
          result.keywordScore
        ).toBe(0);

        expect(
          result.matchedKeywords
        ).toEqual([]);

        expect(
          result.missingKeywords
        ).toEqual([]);

        expect(
          result.totalKeywords
        ).toBe(0);

        expect(
          result.overallScore
        ).toBeGreaterThan(0);

        expect(
          result.overallScore
        ).toBeLessThanOrEqual(
          100
        );
      }
    );

    /* =====================================
       Fresher With Project
    ===================================== */

    it(
      "allows a fresher with a strong project to satisfy practical experience readiness",
      () => {
        const resume =
          createStrongResume({
            isFresher: true,

            experience: [],
          });

        const result =
          analyzeResume(resume);

        const suggestionIds =
          result.suggestions.map(
            (suggestion) =>
              suggestion.id
          );

        expect(
          suggestionIds
        ).not.toContain(
          "fresher-practical-experience"
        );

        expect(
          suggestionIds
        ).not.toContain(
          "missing-experience"
        );
      }
    );

    /* =====================================
       Fresher Without Practical Evidence
    ===================================== */

    it(
      "recommends practical evidence when a fresher has neither experience nor projects",
      () => {
        const resume =
          createStrongResume({
            isFresher: true,

            experience: [],

            projects: [],
          });

        const result =
          analyzeResume(resume);

        const suggestionIds =
          result.suggestions.map(
            (suggestion) =>
              suggestion.id
          );

        expect(
          suggestionIds
        ).toContain(
          "fresher-practical-experience"
        );

        expect(
          suggestionIds
        ).toContain(
          "fresher-missing-project"
        );
      }
    );

    /* =====================================
       Experienced Resume
    ===================================== */

    it(
      "gives a complete experienced resume strong ATS readiness",
      () => {
        const result =
          analyzeResume(
            createStrongResume()
          );

        expect(
          result.atsScore
        ).toBeGreaterThanOrEqual(
          80
        );

        expect(
          result.contentScore
        ).toBeGreaterThan(
          0
        );

        expect(
          result.impactScore
        ).toBeGreaterThan(
          0
        );
      }
    );

    /* =====================================
       Weak Impact
    ===================================== */

    it(
      "detects weak accomplishment impact",
      () => {
        const resume =
          createStrongResume({
            experience: [
              {
                id:
                  "experience-1",

                jobTitle:
                  "Frontend Developer",

                company:
                  "Example Labs",

                description:
                  "Responsible for frontend development and working with the development team.",
              },
            ],

            projects: [],
          });

        const result =
          analyzeResume(resume);

        const suggestionIds =
          result.suggestions.map(
            (suggestion) =>
              suggestion.id
          );

        expect(
          result.impactScore
        ).toBeLessThan(70);

        expect(
          suggestionIds
        ).toContain(
          "weak-action-verbs"
        );

        expect(
          suggestionIds
        ).toContain(
          "missing-quantification"
        );
      }
    );

    /* =====================================
       Strong Impact
    ===================================== */

    it(
      "rewards quantified accomplishment-focused descriptions",
      () => {
        const resume =
          createStrongResume({
            experience: [
              {
                id:
                  "experience-1",

                jobTitle:
                  "Frontend Developer",

                company:
                  "Example Labs",

                description:
                  "Optimized frontend performance for 5000 users and reduced page load time by 40%, improving application efficiency and customer experience.",
              },
            ],

            projects: [],
          });

        const result =
          analyzeResume(resume);

        expect(
          result.impactScore
        ).toBeGreaterThanOrEqual(
          70
        );

        const suggestionIds =
          result.suggestions.map(
            (suggestion) =>
              suggestion.id
          );

        expect(
          suggestionIds
        ).not.toContain(
          "weak-action-verbs"
        );

        expect(
          suggestionIds
        ).not.toContain(
          "missing-quantification"
        );
      }
    );

    /* =====================================
       Job Description
    ===================================== */

    it(
      "includes keyword score in overall scoring when a job description exists",
      () => {
        const jobTarget = {
          jobTitle:
            "Frontend Developer",

          company:
            "Example Company",

          jobDescription:
            "We are looking for a frontend developer with React, TypeScript, JavaScript, REST API, Git and Agile experience.",
        };

        const weakMatch =
          analyzeResume(
            createStrongResume({
              skills: [
                "HTML",
                "CSS",
              ],

              jobTarget,
            })
          );

        const strongMatch =
          analyzeResume(
            createStrongResume({
              skills: [
                "React",
                "TypeScript",
                "JavaScript",
                "REST API",
                "Git",
                "Agile",
                "HTML",
                "CSS",
              ],

              jobTarget,
            })
          );

        /*
         * Both resumes use targeted analysis.
         *
         * Stronger genuine keyword coverage should
         * improve the keyword score and the overall
         * targeted score.
         *
         * We intentionally do not duplicate the
         * internal Evidence Depth calculation here.
         */

        expect(
          strongMatch.totalKeywords
        ).toBeGreaterThan(0);

        expect(
          strongMatch.keywordScore
        ).toBeGreaterThan(
          weakMatch.keywordScore
        );

        expect(
          strongMatch.overallScore
        ).toBeGreaterThan(
          weakMatch.overallScore
        );
      }
    );

    /* =====================================
       Partial Keyword Match
    ===================================== */

    it(
      "identifies matched and missing job keywords",
      () => {
        const resume =
          createStrongResume({
            skills: [
              "React",
              "JavaScript",
              "Git",
            ],

            jobTarget: {
              jobTitle:
                "Frontend Developer",

              company:
                "Example Company",

              jobDescription:
                "We are looking for a frontend developer with strong React, TypeScript, JavaScript and REST API experience. Knowledge of Git, Agile development and strong communication skills is required.",
            },
          });

        const result =
          analyzeResume(resume);

        expect(
          result.totalKeywords
        ).toBeGreaterThan(0);

        expect(
          result.matchedCount
        ).toBeGreaterThan(0);

        expect(
          result.missingCount
        ).toBeGreaterThan(0);

        expect(
          result.keywordScore
        ).toBeGreaterThan(0);

        expect(
          result.keywordScore
        ).toBeLessThan(100);
      }
    );

    /* =====================================
       Strong Keyword Match
    ===================================== */

    it(
      "improves keyword matching when relevant job keywords are genuinely present",
      () => {
        const jobTarget = {
          jobTitle:
            "Frontend Developer",

          company:
            "Example Company",

          jobDescription:
            "We are looking for a frontend developer with React, TypeScript, JavaScript, REST API, Git and Agile experience.",
        };

        const weakMatch =
          analyzeResume(
            createStrongResume({
              skills: [
                "HTML",
                "CSS",
              ],

              jobTarget,
            })
          );

        const strongMatch =
          analyzeResume(
            createStrongResume({
              skills: [
                "React",
                "TypeScript",
                "JavaScript",
                "REST API",
                "Git",
                "Agile",
                "HTML",
                "CSS",
              ],

              jobTarget,
            })
          );

        expect(
          strongMatch.keywordScore
        ).toBeGreaterThan(
          weakMatch.keywordScore
        );

        expect(
          strongMatch.missingCount
        ).toBeLessThan(
          weakMatch.missingCount
        );
      }
    );

    /* =====================================
       JD Removal
    ===================================== */

    it(
      "returns to resume-only scoring after the job description is removed",
      () => {
        const baseResume =
          createStrongResume();

        const resumeOnly =
          analyzeResume(
            baseResume
          );

        const withJobDescription =
          analyzeResume({
            ...baseResume,

            jobTarget: {
              jobTitle:
                "Frontend Developer",

              company:
                "Example Company",

              jobDescription:
                "React TypeScript JavaScript REST API Git Agile communication.",
            },
          });

        const withoutJobDescription =
          analyzeResume({
            ...baseResume,

            jobTarget: {
              jobTitle: "",
              company: "",
              jobDescription: "",
            },
          });

        expect(
          withJobDescription
            .totalKeywords
        ).toBeGreaterThan(0);

        expect(
          withoutJobDescription
            .keywordScore
        ).toBe(0);

        expect(
          withoutJobDescription
            .totalKeywords
        ).toBe(0);

        expect(
          withoutJobDescription
            .matchedKeywords
        ).toEqual([]);

        expect(
          withoutJobDescription
            .missingKeywords
        ).toEqual([]);

        /*
         * Removing the job description must
         * restore the same calibrated resume-only
         * result as analyzing the base resume.
         */

        expect(
          withoutJobDescription
            .overallScore
        ).toBe(
          resumeOnly.overallScore
        );
      }
    );

    /* =====================================
       Score Bounds
    ===================================== */

    it(
      "keeps every score between 0 and 100",
      () => {
        const result =
          analyzeResume(
            createStrongResume({
              jobTarget: {
                jobTitle:
                  "Frontend Developer",

                company:
                  "Example Company",

                jobDescription:
                  "React TypeScript JavaScript REST API Git Agile communication frontend development responsive applications.",
              },
            })
          );

        const scores = [
          result.overallScore,
          result.atsScore,
          result.contentScore,
          result.impactScore,
          result.keywordScore,
        ];

        scores.forEach(
          (score) => {
            expect(
              Number.isFinite(
                score
              )
            ).toBe(true);

            expect(
              score
            ).toBeGreaterThanOrEqual(
              0
            );

            expect(
              score
            ).toBeLessThanOrEqual(
              100
            );
          }
        );
      }
    );

    /* =====================================
       Suggestion Deduplication
    ===================================== */

    it(
      "does not return duplicate suggestion IDs",
      () => {
        const result =
          analyzeResume(
            createResume()
          );

        const ids =
          result.suggestions.map(
            (suggestion) =>
              suggestion.id
          );

        const uniqueIds =
          new Set(ids);

        expect(
          uniqueIds.size
        ).toBe(ids.length);
      }
    );

    /* =====================================
       Recommendation Separation
    ===================================== */

    it(
      "does not add generic job-keyword recommendations to general ATS suggestions",
      () => {
        const resume =
          createStrongResume({
            skills: [
              "React",
            ],

            jobTarget: {
              jobTitle:
                "Frontend Developer",

              company:
                "Example Company",

              jobDescription:
                "React TypeScript JavaScript REST API Git Agile communication.",
            },
          });

        const result =
          analyzeResume(resume);

        const suggestionIds =
          result.suggestions.map(
            (suggestion) =>
              suggestion.id
          );

        expect(
          suggestionIds
        ).not.toContain(
          "missing-job-keywords"
        );

        expect(
          suggestionIds
        ).not.toContain(
          "missing-job-description"
        );
      }
    );
  }
);