/* ========================================
   AI API Endpoints
======================================== */

const REWRITE_SUMMARY_AI_ENDPOINT =
  "/api/rewrite-summary";

const IMPROVE_EXPERIENCE_AI_ENDPOINT =
  "/api/improve-experience";

const IMPROVE_PROJECT_AI_ENDPOINT =
  "/api/improve-project";

const TAILOR_RESUME_AI_ENDPOINT =
  "/api/tailor-resume";

const RECOMMEND_SKILLS_AI_ENDPOINT =
  "/api/recommend-skills";

/* ========================================
   Shared Response Parser
======================================== */

const parseResponse = async (
  response,
  fallbackMessage
) => {
  let data = null;

  try {
    data =
      await response.json();
  } catch {
    // Keep data as null when the
    // response body is not valid JSON.
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        fallbackMessage
    );
  }

  return data;
};

/* ========================================
   Shared AI Request
======================================== */

const fetchAi = async (
  endpoint,
  options
) => {
  try {
    return await fetch(
      endpoint,
      options
    );
  } catch {
    throw new Error(
      "Unable to connect to the AI service. Please check your connection and try again."
    );
  }
};

/* ========================================
   Rewrite Professional Summary
======================================== */

export const rewriteSummary =
  async ({
    summary,
    jobTitle = "",
    jobDescription = "",
    skills = [],
    experience = "",
    projects = "",
  }) => {
    const response =
      await fetchAi(
        REWRITE_SUMMARY_AI_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            summary,
            jobTitle,
            jobDescription,
            skills,
            experience,
            projects,
          }),
        }
      );

    const data =
      await parseResponse(
        response,
        "Unable to rewrite the summary right now."
      );

    const suggestion =
      typeof data?.suggestion ===
      "string"
        ? data.suggestion.trim()
        : typeof data?.summary ===
            "string"
          ? data.summary.trim()
          : "";

    if (!suggestion) {
      throw new Error(
        "The AI service did not return a valid summary."
      );
    }

    return suggestion;
  };

/* ========================================
   Improve Experience Description
======================================== */

export const improveExperience =
  async ({
    description,
    jobTitle = "",
    company = "",
    employmentType = "",
    targetJobTitle = "",
    targetJobDescription = "",
    skills = [],
    projects = "",
  }) => {
    const response =
      await fetchAi(
        IMPROVE_EXPERIENCE_AI_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            description,
            jobTitle,
            company,
            employmentType,
            targetJobTitle,
            targetJobDescription,
            skills,
            projects,
          }),
        }
      );

    const data =
      await parseResponse(
        response,
        "Unable to improve the experience right now."
      );

    const suggestion =
      typeof data?.suggestion ===
      "string"
        ? data.suggestion.trim()
        : typeof data?.description ===
            "string"
          ? data.description.trim()
          : "";

    if (!suggestion) {
      throw new Error(
        "The AI service did not return a valid experience description."
      );
    }

    return suggestion;
  };

/* ========================================
   Improve Project Description
======================================== */

export const improveProject =
  async ({
    description,
    projectName = "",
    technologies = [],
    targetJobTitle = "",
    targetJobDescription = "",
    skills = [],
    experience = "",
  }) => {
    const response =
      await fetchAi(
        IMPROVE_PROJECT_AI_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            description,
            projectName,
            technologies,
            targetJobTitle,
            targetJobDescription,
            skills,
            experience,
          }),
        }
      );

    const data =
      await parseResponse(
        response,
        "Unable to improve the project right now."
      );

    const suggestion =
      typeof data?.suggestion ===
      "string"
        ? data.suggestion.trim()
        : typeof data?.description ===
            "string"
          ? data.description.trim()
          : "";

    if (!suggestion) {
      throw new Error(
        "The AI service did not return a valid project description."
      );
    }

    return suggestion;
  };

/* ========================================
   AI Resume Tailoring
======================================== */

export const tailorResume =
  async ({
    resume,
    targetJobTitle = "",
    targetCompany = "",
    targetJobDescription = "",
  }) => {
    const response =
      await fetchAi(
        TAILOR_RESUME_AI_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resume,
            targetJobTitle,
            targetCompany,
            targetJobDescription,
          }),
        }
      );

    const data =
      await parseResponse(
        response,
        "Unable to tailor the resume right now."
      );

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      throw new Error(
        "The AI service did not return valid tailoring recommendations."
      );
    }

    return data;
  };

/* ========================================
   AI Skill Recommendations
======================================== */

export const recommendSkills =
  async ({
    resume,
    focusSkill = "",
    targetJobTitle = "",
    targetCompany = "",
    targetJobDescription = "",
  }) => {
    const response =
      await fetchAi(
        RECOMMEND_SKILLS_AI_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resume,
            focusSkill,
            targetJobTitle,
            targetCompany,
            targetJobDescription,
          }),
        }
      );

    const data =
      await parseResponse(
        response,
        "Unable to recommend skills right now."
      );

    if (
      !data ||
      typeof data !==
        "object" ||
      Array.isArray(data) ||
      !Array.isArray(
        data.skills
      )
    ) {
      throw new Error(
        "The AI service did not return valid skill recommendations."
      );
    }

    const skills =
      data.skills
        .map(
          (item) => {
            if (
              !item ||
              typeof item !==
                "object"
            ) {
              return null;
            }

            const skill =
              typeof item.skill ===
              "string"
                ? item.skill.trim()
                : "";

            const reason =
              typeof item.reason ===
              "string"
                ? item.reason.trim()
                : "";

            if (!skill) {
              return null;
            }

            return {
              skill,
              reason,
            };
          }
        )
        .filter(Boolean);

    return {
      ...data,
      skills,
    };
  };