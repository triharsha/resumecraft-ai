import {
  GoogleGenAI,
} from "@google/genai";

import {
  generateWithFallback,
  getGeminiErrorResponse,
} from "./_utils/gemini.js";

/* ========================================
   Configuration
======================================== */

const MAX_CONTEXT_LENGTH =
  14000;

const MAX_RECOMMENDATIONS =
  8;

/* ========================================
   Text Helpers
======================================== */

const normalizeText = (
  value
) => {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim();
};

const truncateText = (
  value,
  maxLength =
    MAX_CONTEXT_LENGTH
) => {
  const normalized =
    normalizeText(value);

  if (
    normalized.length <=
    maxLength
  ) {
    return normalized;
  }

  return normalized
    .slice(
      0,
      maxLength
    )
    .trim();
};

/* ========================================
   Skill Helpers
======================================== */

const normalizeSkillKey = (
  value
) => {
  return normalizeText(
    value
  ).toLowerCase();
};

const normalizeSkillList = (
  value
) => {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  const seen =
    new Set();

  return value
    .map((item) => {
      if (
        typeof item ===
        "string"
      ) {
        return normalizeText(
          item
        );
      }

      if (
        item &&
        typeof item ===
          "object"
      ) {
        return normalizeText(
          item.name ||
            item.skill ||
            ""
        );
      }

      return "";
    })
    .filter((skill) => {
      if (!skill) {
        return false;
      }

      const key =
        normalizeSkillKey(
          skill
        );

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    });
};

/* ========================================
   Resume Context Helpers
======================================== */

const buildExperienceContext =
  (resume) => {
    const experiences =
      Array.isArray(
        resume?.experience
      )
        ? resume.experience
        : Array.isArray(
              resume?.experiences
            )
          ? resume.experiences
          : [];

    return experiences
      .map((item) => {
        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return "";
        }

        const jobTitle =
          normalizeText(
            item.jobTitle ||
              item.title ||
              ""
          );

        const company =
          normalizeText(
            item.company ||
              ""
          );

        const employmentType =
          normalizeText(
            item.employmentType ||
              ""
          );

        const description =
          truncateText(
            item.description ||
              "",
            2500
          );

        return [
          jobTitle
            ? `Role: ${jobTitle}`
            : "",

          company
            ? `Company: ${company}`
            : "",

          employmentType
            ? `Employment Type: ${employmentType}`
            : "",

          description
            ? `Description: ${description}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .filter(Boolean)
      .join("\n\n");
  };

const buildProjectContext =
  (resume) => {
    const projects =
      Array.isArray(
        resume?.projects
      )
        ? resume.projects
        : [];

    return projects
      .map((item) => {
        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return "";
        }

        const name =
          normalizeText(
            item.name ||
              item.title ||
              ""
          );

        const technologies =
          normalizeSkillList(
            item.technologies
          );

        const description =
          truncateText(
            item.description ||
              "",
            2500
          );

        return [
          name
            ? `Project: ${name}`
            : "",

          technologies.length >
          0
            ? `Technologies: ${technologies.join(
                ", "
              )}`
            : "",

          description
            ? `Description: ${description}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .filter(Boolean)
      .join("\n\n");
  };

/* ========================================
   Gemini Output Helper
======================================== */

const extractInteractionText =
  (interaction) => {
    if (!interaction) {
      return "";
    }

    /*
     * Current Gemini Interactions API
     * exposes generated text here.
     */
    if (
      typeof interaction.output_text ===
        "string" &&
      interaction.output_text.trim()
    ) {
      return interaction.output_text.trim();
    }

    /*
     * Compatibility fallback for
     * older interaction response shapes.
     */
    if (
      typeof interaction.text ===
        "string" &&
      interaction.text.trim()
    ) {
      return interaction.text.trim();
    }

    if (
      Array.isArray(
        interaction.outputs
      )
    ) {
      for (
        let index =
          interaction.outputs.length -
          1;
        index >= 0;
        index -= 1
      ) {
        const output =
          interaction.outputs[
            index
          ];

        if (
          typeof output?.text ===
            "string" &&
          output.text.trim()
        ) {
          return output.text.trim();
        }
      }
    }

    if (
      Array.isArray(
        interaction.steps
      )
    ) {
      for (
        let index =
          interaction.steps.length -
          1;
        index >= 0;
        index -= 1
      ) {
        const step =
          interaction.steps[
            index
          ];

        if (
          !Array.isArray(
            step?.content
          )
        ) {
          continue;
        }

        const text =
          step.content
            .map((part) =>
              typeof part?.text ===
              "string"
                ? part.text
                : ""
            )
            .filter(Boolean)
            .join("\n")
            .trim();

        if (text) {
          return text;
        }
      }
    }

    return "";
  };

/* ========================================
   JSON Response Parser
======================================== */

const parseJsonResponse = (
  value
) => {
  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    return null;
  }

  let cleaned =
    value.trim();

  cleaned = cleaned
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/,
      ""
    )
    .trim();

  try {
    return JSON.parse(
      cleaned
    );
  } catch {
    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf(
        "}"
      );

    if (
      start === -1 ||
      end === -1 ||
      end <= start
    ) {
      return null;
    }

    try {
      return JSON.parse(
        cleaned.slice(
          start,
          end + 1
        )
      );
    } catch {
      return null;
    }
  }
};

/* ========================================
   Recommendation Validation
======================================== */

const sanitizeRecommendations =
  ({
    parsed,
    existingSkills,
  }) => {
    const rawSkills =
      Array.isArray(
        parsed?.skills
      )
        ? parsed.skills
        : [];

    const existingKeys =
      new Set(
        existingSkills.map(
          normalizeSkillKey
        )
      );

    const returnedKeys =
      new Set();

    return rawSkills
      .map((item) => {
        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return null;
        }

        const skill =
          normalizeText(
            item.skill
          );

        const reason =
          normalizeText(
            item.reason
          );

        if (!skill) {
          return null;
        }

        const key =
          normalizeSkillKey(
            skill
          );

        if (
          !key ||
          existingKeys.has(
            key
          ) ||
          returnedKeys.has(
            key
          )
        ) {
          return null;
        }

        returnedKeys.add(
          key
        );

        return {
          skill,
          reason,
        };
      })
      .filter(Boolean)
      .slice(
        0,
        MAX_RECOMMENDATIONS
      );
  };

/* ========================================
   Prompt Builder
======================================== */

const buildPrompt = ({
  focusSkill,
  existingSkills,
  targetJobTitle,
  targetCompany,
  targetJobDescription,
  experienceContext,
  projectContext,
}) => {
  const existingSkillsText =
    existingSkills.length >
    0
      ? existingSkills.join(
          ", "
        )
      : "None provided";

  const targetTitleText =
    targetJobTitle ||
    "Not provided";

  const targetCompanyText =
    targetCompany ||
    "Not provided";

  const targetDescriptionText =
    targetJobDescription ||
    "Not provided";

  const experienceText =
    experienceContext ||
    "No experience information provided.";

  const projectText =
    projectContext ||
    "No project information provided.";

  return `
You are an AI assistant inside a resume builder.

Your task is to recommend useful skills the user may choose to add to their resume.

IMPORTANT:
These are OPTIONAL skill recommendations.

Do not claim the user already possesses a recommended skill.

Do not write recommendations as achievements or verified experience.

PRIMARY CONTEXT:

The user's most recently added skill is:

"${focusSkill}"

This focus skill is the PRIMARY signal for your recommendations.

Recommend skills that are meaningfully related, adjacent, complementary, or commonly used with "${focusSkill}".

Examples:

React may lead to:
TypeScript, Next.js, Redux Toolkit, React Router, React Testing Library, Jest, GraphQL.

Spring Boot may lead to:
Spring Security, Spring Data JPA, Java, RESTful APIs, Swagger/OpenAPI, JUnit, Docker, Maven.

Power BI may lead to:
DAX, Power Query, Data Modeling, Data Visualization, ETL, Tableau, Advanced Excel.

These examples illustrate relationships only.

Do not mechanically copy them when they are not appropriate.

SECONDARY CONTEXT:

Use the existing resume, projects, experience, and target job to make the recommendations more relevant.

Do not allow an unrelated target job to completely override the focus skill.

For example:

If the focus skill is React and the target job mentions Java, recommendations should still primarily relate to React.

EXISTING SKILLS:

${existingSkillsText}

Do NOT recommend any skill already present in the existing skills list.

TARGET JOB:

Job Title:
${targetTitleText}

Company:
${targetCompanyText}

Job Description:
${targetDescriptionText}

EXPERIENCE:

${experienceText}

PROJECTS:

${projectText}

RULES:

1. Return between 4 and ${MAX_RECOMMENDATIONS} recommendations when enough relevant options exist.

2. Prioritize skills closely connected to "${focusSkill}".

3. Recommendations may include:
   - technologies,
   - frameworks,
   - libraries,
   - development tools,
   - testing tools,
   - databases,
   - platforms,
   - development practices,
   - domain-specific technical skills.

4. Recommendations are optional learning/resume candidates, not factual claims.

5. Never invent:
   - employers,
   - projects,
   - certifications,
   - achievements,
   - years of experience,
   - metrics,
   - responsibilities,
   - education.

6. Avoid vague recommendations when a useful specific skill exists.

7. Avoid duplicate or near-duplicate recommendations.

8. Never recommend "${focusSkill}" itself because it already exists on the resume.

9. Keep each reason concise.

10. Explain why the recommendation relates to the focus skill or target role.

11. Do not say:
   - "You know..."
   - "You have experience with..."
   - "You are proficient in..."
   unless explicitly supported by the resume.

12. Return JSON only.

Return exactly:

{
  "skills": [
    {
      "skill": "Skill Name",
      "reason": "Short explanation of why this is a useful related skill."
    }
  ]
}

Do not include markdown or any text outside the JSON.
`;
};

/* ========================================
   API Handler
======================================== */

export default async function handler(
  req,
  res
) {
  /* ========================================
     Method Guard
  ======================================== */

  if (
    req.method !==
    "POST"
  ) {
    res.setHeader(
      "Allow",
      "POST"
    );

    return res
      .status(405)
      .json({
        error:
          "Method not allowed.",
      });
  }

  /* ========================================
     API Key Guard
  ======================================== */

  const apiKey =
    process.env
      .GEMINI_API_KEY;

  if (!apiKey) {
    console.error(
      "GEMINI_API_KEY is not configured."
    );

    return res
      .status(500)
      .json({
        error:
          "AI service is not configured.",
      });
  }

  /* ========================================
     Request
  ======================================== */

  const {
    resume = {},
    focusSkill = "",
    targetJobTitle = "",
    targetCompany = "",
    targetJobDescription = "",
  } = req.body || {};

  const normalizedFocusSkill =
    normalizeText(
      focusSkill
    );

  if (
    !normalizedFocusSkill
  ) {
    return res
      .status(400)
      .json({
        error:
          "Add at least one skill before asking AI for recommendations.",
      });
  }

  const existingSkills =
    normalizeSkillList(
      resume?.skills
    );

  const normalizedTargetJobTitle =
    normalizeText(
      targetJobTitle
    );

  const normalizedTargetCompany =
    normalizeText(
      targetCompany
    );

  const normalizedTargetJobDescription =
    truncateText(
      targetJobDescription,
      5000
    );

  const experienceContext =
    truncateText(
      buildExperienceContext(
        resume
      ),
      5000
    );

  const projectContext =
    truncateText(
      buildProjectContext(
        resume
      ),
      5000
    );

  /* ========================================
     Prompt
  ======================================== */

  const prompt =
    buildPrompt({
      focusSkill:
        normalizedFocusSkill,

      existingSkills,

      targetJobTitle:
        normalizedTargetJobTitle,

      targetCompany:
        normalizedTargetCompany,

      targetJobDescription:
        normalizedTargetJobDescription,

      experienceContext,

      projectContext,
    });

  /* ========================================
     Gemini
  ======================================== */

  try {
    const ai =
      new GoogleGenAI({
        apiKey,
      });

    const {
      result,
      model,
      usedFallback,
    } =
      await generateWithFallback({
        generate:
          async (
            selectedModel
          ) =>
            ai.interactions.create(
              {
                model:
                  selectedModel,

                input:
                  prompt,
              }
            ),
      });

    if (usedFallback) {
      console.warn(
        `Skills AI used fallback model "${model}".`
      );
    }

    /* ========================================
       Read Gemini Output
    ======================================== */

    const responseText =
      extractInteractionText(
        result
      );

    if (!responseText) {
      console.error(
        "Skills AI returned no readable text.",
        {
          model,
          hasOutputText:
            Boolean(
              result?.output_text
            ),
          outputs:
            result?.outputs
              ?.length || 0,
          steps:
            result?.steps
              ?.length || 0,
        }
      );

      return res
        .status(502)
        .json({
          error:
            "AI did not return skill recommendations. Please try again.",
        });
    }

    /* ========================================
       Parse JSON
    ======================================== */

    const parsed =
      parseJsonResponse(
        responseText
      );

    if (
      !parsed ||
      typeof parsed !==
        "object" ||
      Array.isArray(parsed) ||
      !Array.isArray(
        parsed.skills
      )
    ) {
      console.error(
        "Skills AI returned invalid JSON.",
        responseText
      );

      return res
        .status(502)
        .json({
          error:
            "AI returned an invalid skill recommendation response. Please try again.",
        });
    }

    /* ========================================
       Sanitize
    ======================================== */

    const skills =
      sanitizeRecommendations({
        parsed,
        existingSkills,
      });

    /* ========================================
       Success
    ======================================== */

    return res
      .status(200)
      .json({
        skills,
      });
  } catch (error) {
    console.error(
      "Skills AI failed:",
      error
    );

    const {
      status,
      error:
        errorMessage,
    } =
      getGeminiErrorResponse(
        error
      );

    return res
      .status(status)
      .json({
        error:
          errorMessage,
      });
  }
}