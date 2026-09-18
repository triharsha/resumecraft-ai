import {
  analyzeKeywords,
} from "./keywordAnalyzer";

/* ========================================
   Helpers
======================================== */

const hasText = (value) =>
  typeof value === "string" &&
  value.trim().length > 0;

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}+#.\-/\s]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (
  value = ""
) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const includesKeyword = (
  value,
  keyword
) => {
  const text = normalize(value);
  const target = normalize(keyword);

  if (!text || !target) {
    return false;
  }

  /*
   * Match the keyword as a standalone
   * normalized term or phrase instead of
   * using raw substring matching.
   *
   * This prevents short keywords such as
   * "ai" or "c" from matching inside
   * unrelated words.
   *
   * We intentionally avoid JavaScript's
   * \b because technical terms such as
   * c++, c#, node.js and next.js contain
   * non-word characters.
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

const sectionContainsKeyword = (
  values,
  keyword
) => {
  return values.some((value) =>
    includesKeyword(
      value,
      keyword
    )
  );
};

/* ========================================
   Resume Section Text
======================================== */

const getSectionContent = (
  resume
) => {
  const experience =
    Array.isArray(
      resume?.experience
    )
      ? resume.experience
      : [];

  const projects =
    Array.isArray(
      resume?.projects
    )
      ? resume.projects
      : [];

  const skills =
    Array.isArray(
      resume?.skills
    )
      ? resume.skills
      : [];

  return {
    summary: [
      resume?.summary || "",
    ],

    skills,

    experience:
      experience.flatMap(
        (item) => [
          item.jobTitle,
          item.company,
          item.description,
        ]
      ),

    projects:
      projects.flatMap(
        (item) => [
          item.name,
          item.description,
          ...(Array.isArray(
            item.technologies
          )
            ? item.technologies
            : []),
        ]
      ),
  };
};

/* ========================================
   Recommendation Destination
======================================== */

const getRecommendedSection = ({
  keyword,
  type,
  sections,
  resume,
}) => {
  /*
   * If the keyword already exists in one
   * section, prefer strengthening another
   * relevant section rather than blindly
   * repeating it everywhere.
   */

  const inSummary =
    sectionContainsKeyword(
      sections.summary,
      keyword
    );

  const inSkills =
    sectionContainsKeyword(
      sections.skills,
      keyword
    );

  const inExperience =
    sectionContainsKeyword(
      sections.experience,
      keyword
    );

  const inProjects =
    sectionContainsKeyword(
      sections.projects,
      keyword
    );

  /*
   * Technical skills are usually most
   * appropriate in Skills first.
   */

  if (type === "technical") {
    if (!inSkills) {
      return "skills";
    }

    if (
      Array.isArray(
        resume?.experience
      ) &&
      resume.experience.length >
        0 &&
      !inExperience
    ) {
      return "experience";
    }

    if (!inProjects) {
      return "projects";
    }

    return "summary";
  }

  /*
   * Soft skills are stronger when shown
   * through evidence instead of simply
   * being listed in Skills.
   */

  if (type === "soft-skill") {
    if (
      Array.isArray(
        resume?.experience
      ) &&
      resume.experience.length >
        0 &&
      !inExperience
    ) {
      return "experience";
    }

    if (!inProjects) {
      return "projects";
    }

    return "summary";
  }

  /*
   * Domain terminology generally belongs
   * in experience/project context first.
   */

  if (
    Array.isArray(
      resume?.experience
    ) &&
    resume.experience.length >
      0 &&
    !inExperience
  ) {
    return "experience";
  }

  if (!inProjects) {
    return "projects";
  }

  if (!inSummary) {
    return "summary";
  }

  return "skills";
};

/* ========================================
   Recommendation Copy
======================================== */

const getActionLabel = (
  section
) => {
  const labels = {
    skills: "Review Skills",

    summary:
      "Tailor Summary",

    experience:
      "Tailor Experience",

    projects:
      "Tailor Projects",
  };

  return (
    labels[section] ||
    "Review Resume"
  );
};

const getSectionLabel = (
  section
) => {
  const labels = {
    skills: "Skills",

    summary:
      "Professional Summary",

    experience:
      "Experience",

    projects:
      "Projects",
  };

  return (
    labels[section] ||
    "Resume"
  );
};

const getRecommendationMessage = ({
  keyword,
  type,
  section,
}) => {
  const sectionLabel =
    getSectionLabel(section);

  if (
    type === "technical"
  ) {
    if (
      section === "skills"
    ) {
      return `The job description emphasizes "${keyword}". If you genuinely have this skill, consider adding it to your Skills section.`;
    }

    return `The role emphasizes "${keyword}". If you have used it professionally, strengthen your ${sectionLabel} with specific evidence of how you used it.`;
  }

  if (
    type === "soft-skill"
  ) {
    return `The employer values "${keyword}". Rather than simply listing it, demonstrate it with a truthful example in your ${sectionLabel}.`;
  }

  return `The job description repeatedly emphasizes "${keyword}". If it accurately reflects your background, consider using this terminology naturally in your ${sectionLabel}.`;
};

/* ========================================
   Priority
======================================== */

const getRecommendationPriority = (
  importance
) => {
  if (
    importance === "high"
  ) {
    return "high";
  }

  if (
    importance === "medium"
  ) {
    return "medium";
  }

  return "low";
};

/* ========================================
   Build Tailoring Recommendations
======================================== */

const buildRecommendations = ({
  resume,
  keywordDetails,
}) => {
  const sections =
    getSectionContent(resume);

  return keywordDetails
    .filter(
      (item) =>
        !item.matched
    )
    .map((item) => {
      const targetSection =
        getRecommendedSection({
          keyword:
            item.keyword,

          type:
            item.type,

          sections,

          resume,
        });

      return {
        id:
          `tailor-${item.keyword}`
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            ),

        keyword:
          item.keyword,

        keywordType:
          item.type,

        importance:
          item.importance,

        frequency:
          item.frequency,

        priority:
          getRecommendationPriority(
            item.importance
          ),

        category:
          "Tailoring",

        targetSection,

        actionLabel:
          getActionLabel(
            targetSection
          ),

        message:
          getRecommendationMessage({
            keyword:
              item.keyword,

            type:
              item.type,

            section:
              targetSection,
          }),
      };
    })
    .sort((a, b) => {
      const order = {
        high: 0,
        medium: 1,
        low: 2,
      };

      const priorityDifference =
        (
          order[
            a.priority
          ] ??
          3
        ) -
        (
          order[
            b.priority
          ] ??
          3
        );

      if (
        priorityDifference !==
        0
      ) {
        return priorityDifference;
      }

      return (
        b.frequency -
        a.frequency
      );
    });
};

/* ========================================
   Tailoring Summary
======================================== */

const buildTailoringSummary = ({
  keywordAnalysis,
  recommendations,
}) => {
  const highPriority =
    recommendations.filter(
      (item) =>
        item.priority ===
        "high"
    );

  const mediumPriority =
    recommendations.filter(
      (item) =>
        item.priority ===
        "medium"
    );

  return {
    matchScore:
      keywordAnalysis.score,

    matchedCount:
      keywordAnalysis
        .matchedCount,

    missingCount:
      keywordAnalysis
        .missingCount,

    totalKeywords:
      keywordAnalysis
        .totalKeywords,

    recommendationCount:
      recommendations.length,

    highPriorityCount:
      highPriority.length,

    mediumPriorityCount:
      mediumPriority.length,

    isStrongMatch:
      keywordAnalysis.score >=
      75,

    needsTailoring:
      recommendations.length >
      0,
  };
};

/* ========================================
   Main Tailoring Analyzer
======================================== */

export const analyzeTailoring = (
  resume
) => {
  const jobTitle =
    resume?.jobTarget
      ?.jobTitle || "";

  const company =
    resume?.jobTarget
      ?.company || "";

  const jobDescription =
    resume?.jobTarget
      ?.jobDescription || "";

  if (
    !hasText(jobDescription)
  ) {
    return {
      hasJobTarget: false,

      jobTitle,
      company,

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
    };
  }

  const keywordAnalysis =
    analyzeKeywords(resume);

  const recommendations =
    buildRecommendations({
      resume,

      keywordDetails:
        keywordAnalysis
          .keywordDetails ||
        [],
    });

  return {
    hasJobTarget: true,

    jobTitle,
    company,

    recommendations,

    summary:
      buildTailoringSummary({
        keywordAnalysis,
        recommendations,
      }),
  };
};

export default analyzeTailoring;