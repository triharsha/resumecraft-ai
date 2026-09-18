import {
  analyzeKeywords,
} from "./keywordAnalyzer";

import {
  containsNumber,
  containsPercentage,
  getWordCount,
  toPercentage,
} from "./textUtils";

/* ========================================
   Impact Verbs
======================================== */

const IMPACT_VERBS = [
  "achieved",
  "automated",
  "built",
  "created",
  "delivered",
  "designed",
  "developed",
  "drove",
  "enhanced",
  "established",
  "generated",
  "implemented",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "optimized",
  "reduced",
  "resolved",
  "scaled",
  "streamlined",
  "supported",
  "tested",
  "transformed",
  "upgraded",
];

/* ========================================
   Suggestion Helper
======================================== */

const createSuggestion = ({
  id,
  category,
  priority,
  message,
  actionLabel,
  targetSection,
}) => ({
  id,
  category,
  priority,
  message,
  actionLabel,
  targetSection,
});

/* ========================================
   Helpers
======================================== */

const hasText = (
  value
) => {
  return (
    typeof value ===
      "string" &&
    value.trim().length > 0
  );
};

const normalizeForMatching = (
  value
) => {
  return String(value || "")
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}+#.\-/\s]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
};

const escapeRegExp = (
  value = ""
) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const containsTerm = (
  value,
  term
) => {
  const text =
    normalizeForMatching(value);

  const target =
    normalizeForMatching(term);

  if (!text || !target) {
    return false;
  }

  /*
   * Use explicit Unicode-aware boundaries
   * instead of raw substring matching.
   *
   * This avoids false positives while still
   * supporting technical punctuation such as
   * +, # and periods.
   */

  const escapedTarget =
    escapeRegExp(target);

  const pattern =
    new RegExp(
      `(^|[^\\p{L}\\p{N}+#.])${escapedTarget}(?=$|[^\\p{L}\\p{N}+#.])`,
      "iu"
    );

  return pattern.test(text);
};

const getVisibleExperience = (
  resume
) => {
  if (
    !Array.isArray(
      resume?.experience
    )
  ) {
    return [];
  }

  return resume.experience.filter(
    (experience) =>
      hasText(
        experience.jobTitle
      ) ||
      hasText(
        experience.company
      ) ||
      hasText(
        experience.description
      )
  );
};

const getVisibleEducation = (
  resume
) => {
  if (
    !Array.isArray(
      resume?.education
    )
  ) {
    return [];
  }

  return resume.education.filter(
    (education) =>
      hasText(
        education.institution
      ) ||
      hasText(
        education.degree
      ) ||
      hasText(
        education.fieldOfStudy
      )
  );
};

const getVisibleProjects = (
  resume
) => {
  if (
    !Array.isArray(
      resume?.projects
    )
  ) {
    return [];
  }

  return resume.projects.filter(
    (project) =>
      hasText(project.name) ||
      hasText(
        project.description
      ) ||
      (
        Array.isArray(
          project.technologies
        ) &&
        project.technologies
          .length > 0
      )
  );
};

const getSkills = (
  resume
) => {
  if (
    !Array.isArray(
      resume?.skills
    )
  ) {
    return [];
  }

  return resume.skills.filter(
    (skill) =>
      hasText(skill)
  );
};

/* ========================================
   ATS Readiness Score
======================================== */

const analyzeAtsReadiness = (
  resume
) => {
  const personal =
    resume?.personalInfo || {};

  const experience =
    getVisibleExperience(
      resume
    );

  const education =
    getVisibleEducation(
      resume
    );

  const projects =
    getVisibleProjects(
      resume
    );

  const skills =
    getSkills(resume);

  let points = 0;

  const suggestions = [];

  /*
   * Total:
   *
   * Name ................ 10
   * Email ............... 10
   * Phone ............... 5
   * Location ............ 5
   * Job title ........... 10
   * Summary ............. 15
   * Experience/project .. 15
   * Education ........... 10
   * Skills .............. 15
   * Professional link ... 5
   *
   * Total .............. 100
   */

  /* ========================================
     Name
  ======================================== */

  if (
    hasText(
      personal.firstName
    ) ||
    hasText(
      personal.lastName
    )
  ) {
    points += 10;
  } else {
    suggestions.push(
      createSuggestion({
        id: "missing-name",

        category:
          "ATS Readiness",

        priority:
          "high",

        message:
          "Add your name to the Personal Info section.",

        actionLabel:
          "Add Personal Info",

        targetSection:
          "personal",
      })
    );
  }

  /* ========================================
     Email
  ======================================== */

  if (
    hasText(
      personal.email
    )
  ) {
    points += 10;
  } else {
    suggestions.push(
      createSuggestion({
        id: "missing-email",

        category:
          "ATS Readiness",

        priority:
          "high",

        message:
          "Add a professional email address so recruiters can contact you.",

        actionLabel:
          "Add Email",

        targetSection:
          "personal",
      })
    );
  }

  /* ========================================
     Phone
  ======================================== */

  if (
    hasText(
      personal.phone
    )
  ) {
    points += 5;
  } else {
    suggestions.push(
      createSuggestion({
        id: "missing-phone",

        category:
          "ATS Readiness",

        priority:
          "medium",

        message:
          "Add a phone number so recruiters can contact you easily.",

        actionLabel:
          "Add Phone",

        targetSection:
          "personal",
      })
    );
  }

  /* ========================================
     Location
  ======================================== */

  if (
    hasText(
      personal.location
    )
  ) {
    points += 5;
  } else {
    suggestions.push(
      createSuggestion({
        id:
          "missing-location",

        category:
          "ATS Readiness",

        priority:
          "low",

        message:
          "Add your location to make your contact information more complete.",

        actionLabel:
          "Add Location",

        targetSection:
          "personal",
      })
    );
  }

  /* ========================================
     Professional Job Title
  ======================================== */

  if (
    hasText(
      personal.jobTitle
    )
  ) {
    points += 10;
  } else {
    suggestions.push(
      createSuggestion({
        id:
          "missing-job-title",

        category:
          "ATS Readiness",

        priority:
          "high",

        message:
          "Add a professional job title near your name.",

        actionLabel:
          "Add Job Title",

        targetSection:
          "personal",
      })
    );
  }

  /* ========================================
     Professional Summary
  ======================================== */

  const summaryWordCount =
    getWordCount(
      resume?.summary || ""
    );

  if (
    summaryWordCount >= 30
  ) {
    points += 15;
  } else if (
    summaryWordCount >= 15
  ) {
    points += 9;

    suggestions.push(
      createSuggestion({
        id:
          "summary-needs-detail",

        category:
          "Content",

        priority:
          "medium",

        message:
          "Strengthen your professional summary with more specific detail about your background, strengths and value.",

        actionLabel:
          "Improve Summary",

        targetSection:
          "summary",
      })
    );
  } else if (
    summaryWordCount > 0
  ) {
    points += 4;

    suggestions.push(
      createSuggestion({
        id:
          "summary-too-short",

        category:
          "Content",

        priority:
          "high",

        message:
          "Your summary is very short. Aim for a focused 2–4 sentence professional summary.",

        actionLabel:
          "Improve Summary",

        targetSection:
          "summary",
      })
    );
  } else {
    suggestions.push(
      createSuggestion({
        id:
          "missing-summary",

        category:
          "Content",

        priority:
          "high",

        message:
          "Add a concise professional summary that introduces your strengths and experience.",

        actionLabel:
          "Add Summary",

        targetSection:
          "summary",
      })
    );
  }

  /* ========================================
     Experience / Practical Evidence
  ======================================== */

  /*
   * Fresher resumes can use strong
   * projects as evidence of practical
   * experience.
   */

  if (
    experience.length > 0
  ) {
    points += 15;
  } else if (
    resume?.isFresher &&
    projects.length > 0
  ) {
    points += 15;
  } else {
    suggestions.push(
      createSuggestion({
        id:
          resume?.isFresher
            ? "fresher-practical-experience"
            : "missing-experience",

        category:
          "Content",

        priority:
          "high",

        message:
          resume?.isFresher
            ? "Add internships or strong projects to demonstrate practical experience."
            : "Add relevant professional experience.",

        actionLabel:
          resume?.isFresher
            ? "Add Practical Evidence"
            : "Add Experience",

        targetSection:
          resume?.isFresher
            ? "projects"
            : "experience",
      })
    );
  }

  /* ========================================
     Education
  ======================================== */

  if (
    education.length > 0
  ) {
    points += 10;
  } else {
    suggestions.push(
      createSuggestion({
        id:
          "missing-education",

        category:
          "ATS Readiness",

        priority:
          "medium",

        message:
          "Add your education details.",

        actionLabel:
          "Add Education",

        targetSection:
          "education",
      })
    );
  }

  /* ========================================
     Skills
  ======================================== */

  if (
    skills.length >= 8
  ) {
    points += 15;
  } else if (
    skills.length >= 4
  ) {
    points += 10;

    suggestions.push(
      createSuggestion({
        id:
          "skills-could-expand",

        category:
          "Content",

        priority:
          "medium",

        message:
          "Your skills section could be more complete. Add additional skills that genuinely represent your capabilities.",

        actionLabel:
          "Review Skills",

        targetSection:
          "skills",
      })
    );
  } else if (
    skills.length > 0
  ) {
    points += 5;

    suggestions.push(
      createSuggestion({
        id:
          "limited-skills",

        category:
          "Content",

        priority:
          "high",

        message:
          "Your skills section is limited. Add more skills that accurately represent your technical or professional capabilities.",

        actionLabel:
          "Improve Skills",

        targetSection:
          "skills",
      })
    );
  } else {
    suggestions.push(
      createSuggestion({
        id:
          "missing-skills",

        category:
          "Content",

        priority:
          "high",

        message:
          "Add a dedicated skills section with skills that accurately represent your capabilities.",

        actionLabel:
          "Add Skills",

        targetSection:
          "skills",
      })
    );
  }

  /* ========================================
     Professional Links
  ======================================== */

  if (
    hasText(
      personal.linkedin
    ) ||
    hasText(
      personal.github
    ) ||
    hasText(
      personal.website
    )
  ) {
    points += 5;
  } else {
    suggestions.push(
      createSuggestion({
        id:
          "missing-professional-link",

        category:
          "ATS Readiness",

        priority:
          "low",

        message:
          "Consider adding LinkedIn, GitHub, or a portfolio website.",

        actionLabel:
          "Add Profile Link",

        targetSection:
          "personal",
      })
    );
  }

  return {
    score:
      toPercentage(points),

    suggestions,
  };
};

/* ========================================
   Content Quality Score
======================================== */

const analyzeContentQuality = (
  resume
) => {
  const experience =
    getVisibleExperience(
      resume
    );

  const education =
    getVisibleEducation(
      resume
    );

  const projects =
    getVisibleProjects(
      resume
    );

  const skills =
    getSkills(resume);

  let earned = 0;
  let possible = 0;

  const suggestions = [];

  /* ========================================
     Summary
  ======================================== */

  possible += 25;

  const summaryWords =
    getWordCount(
      resume?.summary || ""
    );

  if (
    summaryWords >= 35 &&
    summaryWords <= 120
  ) {
    earned += 25;
  } else if (
    summaryWords >= 20
  ) {
    earned += 18;
  } else if (
    summaryWords > 0
  ) {
    earned += 8;
  }

  if (
    summaryWords > 120
  ) {
    suggestions.push(
      createSuggestion({
        id:
          "summary-too-long",

        category:
          "Content",

        priority:
          "medium",

        message:
          "Consider shortening your professional summary so recruiters can scan it quickly.",

        actionLabel:
          "Edit Summary",

        targetSection:
          "summary",
      })
    );
  }

  /* ========================================
     Experience
  ======================================== */

  if (
    experience.length > 0
  ) {
    possible += 30;

    const strongDescriptions =
      experience.filter(
        (item) =>
          getWordCount(
            item.description || ""
          ) >= 20
      ).length;

    earned +=
      (
        strongDescriptions /
        experience.length
      ) * 30;

    if (
      strongDescriptions <
      experience.length
    ) {
      suggestions.push(
        createSuggestion({
          id:
            "experience-description-quality",

          category:
            "Content",

          priority:
            "high",

          message:
            "Add clearer accomplishment-focused descriptions to your experience entries.",

          actionLabel:
            "Improve Experience",

          targetSection:
            "experience",
        })
      );
    }
  } else if (
    !resume?.isFresher
  ) {
    possible += 30;
  }

  /* ========================================
     Projects
  ======================================== */

  if (
    projects.length > 0
  ) {
    possible += 20;

    const completeProjects =
      projects.filter(
        (project) =>
          hasText(
            project.name
          ) &&
          getWordCount(
            project.description ||
              ""
          ) >= 15 &&
          Array.isArray(
            project.technologies
          ) &&
          project.technologies
            .length > 0
      ).length;

    earned +=
      (
        completeProjects /
        projects.length
      ) * 20;

    if (
      completeProjects <
      projects.length
    ) {
      suggestions.push(
        createSuggestion({
          id:
            "project-quality",

          category:
            "Content",

          priority:
            "medium",

          message:
            "Give each project a clear description and list the technologies used.",

          actionLabel:
            "Improve Projects",

          targetSection:
            "projects",
        })
      );
    }
  } else if (
    resume?.isFresher
  ) {
    possible += 20;

    suggestions.push(
      createSuggestion({
        id:
          "fresher-missing-project",

        category:
          "Content",

        priority:
          "high",

        message:
          "Projects are especially valuable for a fresher resume. Add at least one strong project.",

        actionLabel:
          "Add Project",

        targetSection:
          "projects",
      })
    );
  }

  /* ========================================
     Education
  ======================================== */

  possible += 10;

  if (
    education.length > 0
  ) {
    earned += 10;
  }

  /* ========================================
     Skills
  ======================================== */

  possible += 15;

  if (
    skills.length >= 8
  ) {
    earned += 15;
  } else if (
    skills.length >= 4
  ) {
    earned += 10;
  } else if (
    skills.length > 0
  ) {
    earned += 5;
  }

  const score =
    possible === 0
      ? 0
      : toPercentage(
          (
            earned /
            possible
          ) * 100
        );

  return {
    score,
    suggestions,
  };
};

/* ========================================
   Impact Score
======================================== */

const analyzeImpact = (
  resume
) => {
  const experience =
    getVisibleExperience(
      resume
    );

  const projects =
    getVisibleProjects(
      resume
    );

  const descriptions = [
    ...experience.map(
      (item) =>
        item.description || ""
    ),

    ...projects.map(
      (item) =>
        item.description || ""
    ),
  ].filter(hasText);

  const suggestions = [];

  /* ========================================
     No Impact Content
  ======================================== */

  if (
    descriptions.length === 0
  ) {
    return {
      score: 0,

      suggestions: [
        createSuggestion({
          id:
            "missing-impact-content",

          category:
            "Impact",

          priority:
            "high",

          message:
            "Add accomplishment-focused descriptions to your experience or projects.",

          actionLabel:
            experience.length > 0
              ? "Improve Experience"
              : "Improve Projects",

          targetSection:
            experience.length > 0
              ? "experience"
              : "projects",
        }),
      ],
    };
  }

  let totalPoints = 0;

  /*
   * These counters allow the recommendation
   * layer to understand which impact signals
   * are actually missing instead of blindly
   * showing every impact recommendation when
   * the total score is below 70.
   */

  let impactVerbCount = 0;
  let quantifiedCount = 0;

  /* ========================================
     Analyze Descriptions
  ======================================== */

  descriptions.forEach(
    (description) => {
      let itemScore = 0;

      /* Description substance */

      const words =
        getWordCount(
          description
        );

      if (words >= 20) {
        itemScore += 30;
      } else if (
        words >= 10
      ) {
        itemScore += 18;
      } else {
        itemScore += 6;
      }

      /* Action verbs */

      const hasImpactVerb =
        IMPACT_VERBS.some(
          (verb) =>
            containsTerm(
              description,
              verb
            )
        );

      if (
        hasImpactVerb
      ) {
        impactVerbCount += 1;

        itemScore += 30;
      }

      /* Quantification */

      if (
        containsPercentage(
          description
        )
      ) {
        quantifiedCount += 1;

        itemScore += 25;
      } else if (
        containsNumber(
          description
        )
      ) {
        quantifiedCount += 1;

        itemScore += 18;
      }

      /* Result language */

      const hasResultLanguage =
        [
          "result",
          "impact",
          "performance",
          "efficiency",
          "revenue",
          "users",
          "customers",
          "response time",
          "load time",
          "accuracy",
          "productivity",
          "cost",
        ].some(
          (term) =>
            containsTerm(
              description,
              term
            )
        );

      if (
        hasResultLanguage
      ) {
        itemScore += 15;
      }

      totalPoints +=
        Math.min(
          itemScore,
          100
        );
    }
  );

  const score =
    toPercentage(
      totalPoints /
        descriptions.length
    );

  /* ========================================
     Impact Suggestions
  ======================================== */

  /*
   * Only recommend an improvement when that
   * signal is actually missing from at least
   * one analyzed description.
   */

  if (
    score < 70 &&
    impactVerbCount <
      descriptions.length
  ) {
    suggestions.push(
      createSuggestion({
        id:
          "weak-action-verbs",

        category:
          "Impact",

        priority:
          "high",

        message:
          "Use stronger action verbs such as developed, improved, optimized, implemented, or led.",

        actionLabel:
          experience.length > 0
            ? "Improve Experience"
            : "Improve Projects",

        targetSection:
          experience.length > 0
            ? "experience"
            : "projects",
      })
    );
  }

  if (
    score < 70 &&
    quantifiedCount <
      descriptions.length
  ) {
    suggestions.push(
      createSuggestion({
        id:
          "missing-quantification",

        category:
          "Impact",

        priority:
          "high",

        message:
          "Quantify achievements where accurate, such as performance improvements, users served, defects reduced, or percentage gains.",

        actionLabel:
          experience.length > 0
            ? "Add Results"
            : "Improve Projects",

        targetSection:
          experience.length > 0
            ? "experience"
            : "projects",
      })
    );
  }

  return {
    score,
    suggestions,
  };
};

/* ========================================
   Evidence Depth Score

   Internal calibration only.

   This prevents a thin resume from receiving
   an unrealistically high overall score just
   because a small number of target keywords
   happen to match perfectly.

   Fresher resumes can establish practical
   evidence through internships and projects.
======================================== */

const analyzeEvidenceDepth = (
  resume
) => {
  const personal =
    resume?.personalInfo || {};

  const experience =
    getVisibleExperience(
      resume
    );

  const education =
    getVisibleEducation(
      resume
    );

  const projects =
    getVisibleProjects(
      resume
    );

  const skills =
    getSkills(
      resume
    );

  let points = 0;

  /*
   * Total:
   *
   * Summary quality ............ 15
   * Practical evidence ......... 40
   * Education .................. 15
   * Skills depth ............... 20
   * Professional links ......... 5
   * Profile completeness ....... 5
   *
   * Total ..................... 100
   */

  /* ========================================
     Summary Evidence
  ======================================== */

  const summaryWords =
    getWordCount(
      resume?.summary || ""
    );

  if (
    summaryWords >= 35
  ) {
    points += 15;
  } else if (
    summaryWords >= 20
  ) {
    points += 10;
  } else if (
    summaryWords > 0
  ) {
    points += 5;
  }

  /* ========================================
     Practical Evidence
  ======================================== */

  if (
    resume?.isFresher
  ) {
    /*
     * Freshers can establish strong evidence
     * through internships + projects.
     *
     * We deliberately do NOT require several
     * professional jobs.
     */

    if (
      experience.length >= 1 &&
      projects.length >= 2
    ) {
      points += 40;
    } else if (
      experience.length >= 1 &&
      projects.length >= 1
    ) {
      points += 25;
    } else if (
      projects.length >= 2
    ) {
      points += 28;
    } else if (
      experience.length >= 1 ||
      projects.length >= 1
    ) {
      points += 16;
    }
  } else {
    /*
     * Experienced candidates are expected to
     * demonstrate more professional evidence.
     */

    if (
      experience.length >= 3
    ) {
      points += 40;
    } else if (
      experience.length === 2
    ) {
      points += 32;
    } else if (
      experience.length === 1
    ) {
      points += 20;
    } else if (
      projects.length >= 2
    ) {
      points += 12;
    } else if (
      projects.length === 1
    ) {
      points += 6;
    }
  }

  /* ========================================
     Education Evidence
  ======================================== */

  if (
    education.length > 0
  ) {
    points += 15;
  }

  /* ========================================
     Skills Depth
  ======================================== */

  if (
    skills.length >= 8
  ) {
    points += 20;
  } else if (
    skills.length >= 6
  ) {
    points += 16;
  } else if (
    skills.length >= 4
  ) {
    points += 12;
  } else if (
    skills.length > 0
  ) {
    points += 6;
  }

  /* ========================================
     Professional Links
  ======================================== */

  if (
    hasText(
      personal.linkedin
    ) ||
    hasText(
      personal.github
    ) ||
    hasText(
      personal.website
    )
  ) {
    points += 5;
  }

  /* ========================================
     Profile Completeness
  ======================================== */

  if (
    hasText(
      personal.jobTitle
    )
  ) {
    points += 3;
  }

  if (
    hasText(
      personal.phone
    ) &&
    hasText(
      personal.location
    )
  ) {
    points += 2;
  }

  return {
    score:
      Math.min(
        100,
        Math.max(
          0,
          Math.round(
            points
          )
        )
      ),
  };
};

/* ========================================
   Overall Score
======================================== */

const calculateOverallScore = ({
  atsScore,
  contentScore,
  impactScore,
  keywordScore,
  evidenceScore,
  hasJobDescription,
}) => {
  /*
   * Evidence Depth is internal only.
   *
   * It contributes directly to the score and
   * also provides a gradual confidence
   * adjustment.
   *
   * This avoids arbitrary hard caps while
   * preventing thin resumes from scoring too
   * highly from keyword coverage alone.
   */

  /* ========================================
     Weighted Score
  ======================================== */

  const weightedScore =
    !hasJobDescription
      ? atsScore * 0.3 +
        contentScore * 0.35 +
        impactScore * 0.25 +
        evidenceScore * 0.1
      : atsScore * 0.25 +
        contentScore * 0.3 +
        impactScore * 0.2 +
        keywordScore * 0.15 +
        evidenceScore * 0.1;

  /*
   * Evidence Confidence
   *
   * Evidence 100 -> multiplier 1.00
   * Evidence  75 -> multiplier 0.955
   * Evidence  50 -> multiplier 0.91
   * Evidence  25 -> multiplier 0.865
   * Evidence   0 -> multiplier 0.82
   */

  const normalizedEvidence =
    Math.min(
      100,
      Math.max(
        0,
        evidenceScore
      )
    );

  const evidenceConfidence =
    0.82 +
    (
      normalizedEvidence /
      100
    ) *
      0.18;

  const calibratedScore =
    weightedScore *
    evidenceConfidence;

  return toPercentage(
    calibratedScore
  );
};

/* ========================================
   Suggestion Priority
======================================== */

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

const sortSuggestions = (
  suggestions
) => {
  return [
    ...suggestions,
  ].sort(
    (a, b) =>
      (
        PRIORITY_ORDER[
          a.priority
        ] ?? 3
      ) -
      (
        PRIORITY_ORDER[
          b.priority
        ] ?? 3
      )
  );
};

/* ========================================
   Suggestion Deduplication
======================================== */

const deduplicateSuggestions = (
  suggestions
) => {
  return Array.from(
    new Map(
      suggestions.map(
        (suggestion) => [
          suggestion.id,
          suggestion,
        ]
      )
    ).values()
  );
};

/* ========================================
   Main Analyzer
======================================== */

export const analyzeResume = (
  resume
) => {
  /* ========================================
     Empty Resume
  ======================================== */

  if (!resume) {
    return {
      overallScore: 0,

      atsScore: 0,
      contentScore: 0,
      impactScore: 0,
      keywordScore: 0,

      matchedKeywords: [],
      missingKeywords: [],
      targetKeywords: [],

      keywordDetails: [],
      highPriorityMissing: [],

      matchedCount: 0,
      missingCount: 0,
      totalKeywords: 0,

      suggestions: [],
    };
  }

  /* ========================================
     Analysis Modules
  ======================================== */

  const ats =
    analyzeAtsReadiness(
      resume
    );

  const content =
    analyzeContentQuality(
      resume
    );

  const impact =
    analyzeImpact(
      resume
    );

  const evidence =
    analyzeEvidenceDepth(
      resume
    );

  const keyword =
    analyzeKeywords(
      resume
    );

  /* ========================================
     Overall Score
  ======================================== */

  const overallScore =
    calculateOverallScore({
      atsScore:
        ats.score,

      contentScore:
        content.score,

      impactScore:
        impact.score,

      keywordScore:
        keyword.score,

      evidenceScore:
        evidence.score,

      hasJobDescription:
        keyword.hasJobDescription,
    });

  /* ========================================
     General Resume Suggestions

     Keyword-specific tailoring guidance is
     intentionally NOT added here.

     Responsibility:

     SuggestionsPanel
       -> resume structure
       -> content quality
       -> measurable impact

     KeywordAnalysis
       -> keyword coverage

     TailoringRecommendations
       -> missing keyword guidance
       -> recommended resume section
       -> target-job tailoring

     This separation prevents duplicate
     recommendations.
  ======================================== */

  const suggestions = [
    ...ats.suggestions,
    ...content.suggestions,
    ...impact.suggestions,
  ];

  /* ========================================
     Deduplicate + Sort
  ======================================== */

  const uniqueSuggestions =
    deduplicateSuggestions(
      suggestions
    );

  const sortedSuggestions =
    sortSuggestions(
      uniqueSuggestions
    ).slice(0, 12);

  /* ========================================
     Result
  ======================================== */

  return {
    overallScore,

    atsScore:
      ats.score,

    contentScore:
      content.score,

    impactScore:
      impact.score,

    keywordScore:
      keyword.score,

    matchedKeywords:
      keyword.matchedKeywords,

    missingKeywords:
      keyword.missingKeywords,

    targetKeywords:
      keyword.targetKeywords,

    keywordDetails:
      keyword.keywordDetails,

    highPriorityMissing:
      keyword.highPriorityMissing,

    matchedCount:
      keyword.matchedCount,

    missingCount:
      keyword.missingCount,

    totalKeywords:
      keyword.totalKeywords,

    suggestions:
      sortedSuggestions,
  };
};