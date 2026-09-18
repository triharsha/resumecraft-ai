import {
  getMeaningfulTokens,
  normalizeText,
  toPercentage,
  uniqueStrings,
} from "./textUtils";

/* ========================================
   Known Technical Keywords
======================================== */

const TECHNICAL_KEYWORDS = [
  "html",
  "css",
  "javascript",
  "typescript",
  "react",
  "react.js",
  "reactjs",
  "vue",
  "angular",
  "next.js",
  "nextjs",
  "node",
  "node.js",
  "nodejs",

  "java",
  "spring",
  "spring boot",
  "spring security",
  "hibernate",
  "jpa",
  "jwt",

  "python",
  "django",
  "flask",

  "c",
  "c++",
  "c#",
  ".net",

  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",

  "rest",
  "rest api",
  "restful",
  "graphql",

  "git",
  "github",
  "gitlab",

  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",

  "tailwind",
  "tailwind css",
  "bootstrap",

  "vite",
  "webpack",

  "jest",
  "vitest",
  "cypress",
  "playwright",

  "linux",
  "agile",
  "scrum",

  "figma",

  "machine learning",
  "artificial intelligence",
  "ai",

  "data structures",
  "algorithms",
  "oop",
  "object oriented programming",

  "microservices",
  "ci/cd",
  "devops",
];

/* ========================================
   Important Soft-Skill Keywords
======================================== */

const SOFT_SKILL_KEYWORDS = [
  "communication",
  "collaboration",
  "leadership",
  "problem solving",
  "problem-solving",
  "teamwork",
  "analytical",
  "attention to detail",
  "time management",
  "adaptability",
  "ownership",
  "mentoring",
];

/* ========================================
   Keyword Aliases

   Different spellings represent the same
   underlying skill.
======================================== */

const KEYWORD_ALIASES = {
  "react.js": "react",
  reactjs: "react",

  "node.js": "node.js",
  nodejs: "node.js",
  node: "node.js",

  nextjs: "next.js",

  "tailwind css":
    "tailwind css",
  tailwind:
    "tailwind css",

  restful:
    "rest api",
  rest:
    "rest api",

  "problem-solving":
    "problem solving",

  "object oriented programming":
    "oop",

  "artificial intelligence":
    "artificial intelligence",
  ai:
    "artificial intelligence",
};

/* ========================================
   Generic Job Description Noise

   These words may appear frequently in a
   job posting but are usually not useful
   resume keywords by themselves.
======================================== */

const JOB_DESCRIPTION_NOISE =
  new Set([
    "ability",
    "abilities",
    "about",
    "across",
    "also",
    "applicant",
    "applicants",
    "application",
    "applications",
    "candidate",
    "candidates",
    "company",
    "companies",
    "develop",
    "developing",
    "development",
    "employee",
    "employees",
    "engineering",
    "engineer",
    "engineers",
    "environment",
    "excellent",
    "experience",
    "experienced",
    "including",
    "knowledge",
    "looking",
    "opportunity",
    "preferred",
    "responsibilities",
    "responsibility",
    "required",
    "requirement",
    "requirements",
    "role",
    "skills",
    "strong",
    "team",
    "teams",
    "technical",
    "technology",
    "technologies",
    "using",
    "work",
    "working",
    "years",
  ]);

/* ========================================
   Helpers
======================================== */

const canonicalizeKeyword = (
  keyword
) => {
  const normalized =
    normalizeText(keyword);

  return (
    KEYWORD_ALIASES[
      normalized
    ] || normalized
  );
};

const getKeywordType = (
  keyword
) => {
  const normalized =
    canonicalizeKeyword(
      keyword
    );

  const technical =
    TECHNICAL_KEYWORDS.some(
      (item) =>
        canonicalizeKeyword(
          item
        ) === normalized
    );

  if (technical) {
    return "technical";
  }

  const softSkill =
    SOFT_SKILL_KEYWORDS.some(
      (item) =>
        canonicalizeKeyword(
          item
        ) === normalized
    );

  if (softSkill) {
    return "soft-skill";
  }

  return "domain";
};

/* ========================================
   Safe Phrase Detection
======================================== */

const containsKeyword = (
  text,
  keyword
) => {
  const normalizedText =
    normalizeText(text);

  const normalizedKeyword =
    normalizeText(keyword);

  if (
    !normalizedText ||
    !normalizedKeyword
  ) {
    return false;
  }

  /*
   * Short terms need special handling.
   *
   * Plain includes() would incorrectly
   * match:
   *
   * c -> communication
   * ai -> maintain
   */

  if (
    normalizedKeyword === "c"
  ) {
    return /(^|\s)c($|\s)/i.test(
      normalizedText
    );
  }

  if (
    normalizedKeyword === "ai"
  ) {
    return /(^|\s)ai($|\s)/i.test(
      normalizedText
    );
  }

  /*
   * Padding spaces prevents many partial
   * word matches while still supporting
   * phrases such as "spring boot".
   */

  return ` ${normalizedText} `.includes(
    ` ${normalizedKeyword} `
  );
};

/* ========================================
   Resume Searchable Text
======================================== */

export const buildResumeSearchText = (
  resume
) => {
  const parts = [];

  const personalInfo =
    resume?.personalInfo || {};

  parts.push(
    personalInfo.jobTitle,
    resume?.summary
  );

  const experiences =
    Array.isArray(
      resume?.experience
    )
      ? resume.experience
      : [];

  experiences.forEach(
    (experience) => {
      parts.push(
        experience.jobTitle,
        experience.company,
        experience.employmentType,
        experience.location,
        experience.description
      );
    }
  );

  const education =
    Array.isArray(
      resume?.education
    )
      ? resume.education
      : [];

  education.forEach(
    (item) => {
      parts.push(
        item.degree,
        item.fieldOfStudy,
        item.institution,
        item.description
      );
    }
  );

  const skills =
    Array.isArray(
      resume?.skills
    )
      ? resume.skills
      : [];

  parts.push(...skills);

  const projects =
    Array.isArray(
      resume?.projects
    )
      ? resume.projects
      : [];

  projects.forEach(
    (project) => {
      parts.push(
        project.name,
        project.description
      );

      if (
        Array.isArray(
          project.technologies
        )
      ) {
        parts.push(
          ...project.technologies
        );
      }
    }
  );

  const certifications =
    Array.isArray(
      resume?.certifications
    )
      ? resume.certifications
      : [];

  certifications.forEach(
    (certification) => {
      parts.push(
        certification.name,
        certification.issuer
      );
    }
  );

  return normalizeText(
    parts
      .filter(Boolean)
      .join(" ")
  );
};

/* ========================================
   Known Keyword Detection
======================================== */

const findKnownKeywords = (
  jobDescription
) => {
  const known = [
    ...TECHNICAL_KEYWORDS,
    ...SOFT_SKILL_KEYWORDS,
  ];

  const found =
    known.filter(
      (keyword) =>
        containsKeyword(
          jobDescription,
          keyword
        )
    );

  return uniqueStrings(
    found.map(
      canonicalizeKeyword
    )
  );
};

/* ========================================
   Frequency Map
======================================== */

const buildFrequencyMap = (
  jobDescription
) => {
  const tokens =
    getMeaningfulTokens(
      jobDescription,
      {
        minimumLength: 3,
      }
    );

  const frequencies = {};

  tokens.forEach((token) => {
    const normalized =
      normalizeText(token);

    if (
      !normalized ||
      JOB_DESCRIPTION_NOISE.has(
        normalized
      )
    ) {
      return;
    }

    frequencies[normalized] =
      (frequencies[
        normalized
      ] || 0) + 1;
  });

  return frequencies;
};

/* ========================================
   Frequency Keywords
======================================== */

const findFrequentKeywords = (
  jobDescription
) => {
  const frequencies =
    buildFrequencyMap(
      jobDescription
    );

  return Object.entries(
    frequencies
  )
    /*
     * Requiring repetition prevents random
     * one-off words from dominating the
     * keyword analysis.
     */
    .filter(
      ([, count]) =>
        count >= 2
    )
    .sort(
      (a, b) =>
        b[1] - a[1]
    )
    .slice(0, 20)
    .map(
      ([keyword]) =>
        keyword
    );
};

/* ========================================
   Keyword Frequency
======================================== */

const getKeywordFrequency = (
  jobDescription,
  keyword
) => {
  const normalizedDescription =
    normalizeText(
      jobDescription
    );

  const normalizedKeyword =
    normalizeText(
      keyword
    );

  if (
    !normalizedDescription ||
    !normalizedKeyword
  ) {
    return 0;
  }

  /*
   * Multi-word phrases need phrase-level
   * counting rather than the single-token
   * frequency map.
   *
   * Pad both the searchable text and the
   * phrase with spaces so matches must occur
   * at normalized token boundaries instead
   * of as arbitrary substrings.
   */

  if (
    normalizedKeyword.includes(
      " "
    )
  ) {
    const searchableText =
      ` ${normalizedDescription} `;

    const targetPhrase =
      ` ${normalizedKeyword} `;

    let count = 0;
    let startIndex = 0;

    while (true) {
      const index =
        searchableText.indexOf(
          targetPhrase,
          startIndex
        );

      if (index === -1) {
        break;
      }

      count += 1;

      startIndex =
        index +
        targetPhrase.length;
    }

    return count;
  }

  const frequencies =
    buildFrequencyMap(
      jobDescription
    );

  return (
    frequencies[
      normalizedKeyword
    ] || 0
  );
};

/* ========================================
   Extract Job Keywords
======================================== */

export const extractJobKeywords = (
  jobDescription = ""
) => {
  if (
    !jobDescription.trim()
  ) {
    return [];
  }

  const known =
    findKnownKeywords(
      jobDescription
    );

  const frequent =
    findFrequentKeywords(
      jobDescription
    );

  const combined = [
    ...known,
    ...frequent,
  ].map(
    canonicalizeKeyword
  );

  return uniqueStrings(
    combined
  ).slice(0, 35);
};

/* ========================================
   Resume Keyword Matching
======================================== */

const resumeContainsKeyword = (
  resumeText,
  keyword
) => {
  const canonicalKeyword =
    canonicalizeKeyword(
      keyword
    );

  /*
   * Match the canonical keyword first.
   */

  if (
    containsKeyword(
      resumeText,
      canonicalKeyword
    )
  ) {
    return true;
  }

  /*
   * Also check aliases.
   *
   * Example:
   *
   * JD     -> React.js
   * Resume -> React
   */

  const aliases =
    Object.entries(
      KEYWORD_ALIASES
    )
      .filter(
        ([, canonical]) =>
          canonical ===
          canonicalKeyword
      )
      .map(
        ([alias]) =>
          alias
      );

  return aliases.some(
    (alias) =>
      containsKeyword(
        resumeText,
        alias
      )
  );
};

/* ========================================
   Keyword Importance
======================================== */

const calculateKeywordImportance = ({
  keyword,
  frequency,
}) => {
  const type =
    getKeywordType(
      keyword
    );

  /*
   * Known technical skills begin with
   * stronger importance because they are
   * commonly explicit ATS criteria.
   */

  let weight =
    type === "technical"
      ? 3
      : type ===
          "soft-skill"
        ? 2
        : 1;

  /*
   * Employer repetition increases weight.
   */

  if (frequency >= 3) {
    weight += 2;
  } else if (
    frequency >= 2
  ) {
    weight += 1;
  }

  if (weight >= 5) {
    return "high";
  }

  if (weight >= 3) {
    return "medium";
  }

  return "low";
};

/* ========================================
   Keyword Details
======================================== */

const buildKeywordDetails = ({
  targetKeywords,
  resumeText,
  jobDescription,
}) => {
  return targetKeywords.map(
    (keyword) => {
      const matched =
        resumeContainsKeyword(
          resumeText,
          keyword
        );

      const frequency =
        getKeywordFrequency(
          jobDescription,
          keyword
        );

      return {
        keyword,

        matched,

        type:
          getKeywordType(
            keyword
          ),

        frequency,

        importance:
          calculateKeywordImportance(
            {
              keyword,
              frequency,
            }
          ),
      };
    }
  );
};

/* ========================================
   Weighted Keyword Score
======================================== */

const getImportanceWeight = (
  importance
) => {
  if (
    importance === "high"
  ) {
    return 3;
  }

  if (
    importance === "medium"
  ) {
    return 2;
  }

  return 1;
};

const calculateWeightedScore = (
  keywordDetails
) => {
  if (
    keywordDetails.length === 0
  ) {
    return 0;
  }

  const totalWeight =
    keywordDetails.reduce(
      (total, item) =>
        total +
        getImportanceWeight(
          item.importance
        ),
      0
    );

  const matchedWeight =
    keywordDetails.reduce(
      (total, item) => {
        if (!item.matched) {
          return total;
        }

        return (
          total +
          getImportanceWeight(
            item.importance
          )
        );
      },
      0
    );

  if (totalWeight === 0) {
    return 0;
  }

  return toPercentage(
    (matchedWeight /
      totalWeight) *
      100
  );
};

/* ========================================
   Keyword Analysis
======================================== */

export const analyzeKeywords = (
  resume
) => {
  const jobDescription =
    resume?.jobTarget
      ?.jobDescription || "";

  if (
    !jobDescription.trim()
  ) {
    return {
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
    };
  }

  const targetKeywords =
    extractJobKeywords(
      jobDescription
    );

  const resumeText =
    buildResumeSearchText(
      resume
    );

  const keywordDetails =
    buildKeywordDetails({
      targetKeywords,
      resumeText,
      jobDescription,
    });

  const matchedKeywords =
    keywordDetails
      .filter(
        (item) =>
          item.matched
      )
      .map(
        (item) =>
          item.keyword
      );

  const missingKeywords =
    keywordDetails
      .filter(
        (item) =>
          !item.matched
      )
      .map(
        (item) =>
          item.keyword
      );

  const highPriorityMissing =
    keywordDetails
      .filter(
        (item) =>
          !item.matched &&
          item.importance ===
            "high"
      )
      .map(
        (item) =>
          item.keyword
      );

  /*
   * Weighted scoring gives more influence
   * to technical and repeatedly requested
   * keywords.
   */

  const score =
    calculateWeightedScore(
      keywordDetails
    );

  return {
    score,

    matchedKeywords,
    missingKeywords,
    targetKeywords,

    keywordDetails,

    highPriorityMissing,

    matchedCount:
      matchedKeywords.length,

    missingCount:
      missingKeywords.length,

    totalKeywords:
      targetKeywords.length,

    hasJobDescription: true,
  };
};