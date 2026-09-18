import {
  GoogleGenAI,
} from "@google/genai";

import {
  generateWithFallback,
  getGeminiErrorResponse,
} from "./_utils/gemini.js";

const MAX_JOB_DESCRIPTION_LENGTH =
  10000;

const MAX_RESUME_CONTEXT_LENGTH =
  24000;

/* ========================================
   Helpers
======================================== */

const jsonResponse = (
  response,
  status,
  body
) => {
  return response
    .status(status)
    .json(body);
};

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
    .trim()
    .replace(/\s+/g, " ");
};

/*
 * Preserve intentional line breaks in
 * Experience and Project descriptions.
 *
 * Unlike normalizeText(), this does not
 * convert newlines into spaces.
 */
const normalizeMultilineText = (
  value
) => {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(
          /[ \t]+/g,
          " "
        )
    )
    .filter(Boolean)
    .join("\n")
    .trim();
};

const limitMultilineText = (
  value,
  maxLength
) => {
  return normalizeMultilineText(
    value
  ).slice(
    0,
    maxLength
  );
};

const normalizeForComparison = (
  value
) => {
  return normalizeText(
    value
  )
    .toLowerCase()
    .replace(
      /[•●▪◦‣⁃*_-]/g,
      " "
    )
    .replace(
      /[^a-z0-9\s]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
};

const isMeaningfullyDifferent = (
  original,
  suggested
) => {
  const originalText =
    normalizeForComparison(
      original
    );

  const suggestedText =
    normalizeForComparison(
      suggested
    );

  if (!suggestedText) {
    return false;
  }

  if (!originalText) {
    return true;
  }

  if (
    originalText ===
    suggestedText
  ) {
    return false;
  }

  const originalWords =
    new Set(
      originalText.split(" ")
    );

  const suggestedWords =
    new Set(
      suggestedText.split(" ")
    );

  const sharedWords =
    [...originalWords].filter(
      (word) =>
        suggestedWords.has(
          word
        )
    ).length;

  const totalWords =
    new Set([
      ...originalWords,
      ...suggestedWords,
    ]).size;

  const similarity =
    totalWords > 0
      ? sharedWords /
        totalWords
      : 1;

  return similarity < 0.9;
};

const limitText = (
  value,
  maxLength
) => {
  return normalizeText(
    value
  ).slice(
    0,
    maxLength
  );
};

const normalizeSkills = (
  skills
) => {
  if (
    !Array.isArray(skills)
  ) {
    return [];
  }

  return skills
    .map((skill) => {
      if (
        typeof skill ===
        "string"
      ) {
        return limitText(
          skill,
          60
        );
      }

      if (
        skill &&
        typeof skill ===
          "object"
      ) {
        return limitText(
          skill.name,
          60
        );
      }

      return "";
    })
    .filter(Boolean)
    .slice(0, 40);
};

const normalizeExperience = (
  experience
) => {
  if (
    !Array.isArray(
      experience
    )
  ) {
    return [];
  }

  return experience
    .map(
      (
        item,
        index
      ) => ({
        index,

        jobTitle:
          limitText(
            item?.jobTitle,
            150
          ),

        company:
          limitText(
            item?.company,
            150
          ),

        employmentType:
          limitText(
            item?.employmentType,
            80
          ),

        description:
          limitMultilineText(
            item?.description,
            2500
          ),
      })
    )
    .filter(
      (item) =>
        item.jobTitle ||
        item.company ||
        item.description
    )
    .slice(0, 15);
};

const normalizeProjects = (
  projects
) => {
  if (
    !Array.isArray(
      projects
    )
  ) {
    return [];
  }

  return projects
    .map(
      (
        project,
        index
      ) => ({
        index,

        name:
          limitText(
            project?.name,
            150
          ),

        description:
          limitMultilineText(
            project?.description,
            2500
          ),

        technologies:
          Array.isArray(
            project?.technologies
          )
            ? project.technologies
                .map(
                  (
                    technology
                  ) =>
                    limitText(
                      technology,
                      60
                    )
                )
                .filter(
                  Boolean
                )
                .slice(
                  0,
                  20
                )
            : [],
      })
    )
    .filter(
      (project) =>
        project.name ||
        project.description ||
        project
          .technologies
          .length > 0
    )
    .slice(0, 15);
};

/* ========================================
   Gemini Output
======================================== */

const extractInteractionText = (
  interaction
) => {
  if (!interaction) {
    return "";
  }

  if (
    typeof interaction
      .output_text ===
      "string" &&
    interaction.output_text.trim()
  ) {
    return interaction
      .output_text
      .trim();
  }

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
        interaction.outputs
          .length - 1;
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

      if (
        Array.isArray(
          output?.content
        )
      ) {
        const text =
          output.content
            .map(
              (part) =>
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
          .map(
            (part) =>
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
   JSON Extraction
======================================== */

const extractJson = (
  value
) => {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const cleaned =
    value
      .trim()
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
      cleaned.indexOf(
        "{"
      );

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
   Resume Tailoring
======================================== */

export default async function handler(
  request,
  response
) {
  /* ========================================
     Method Guard
  ======================================== */

  if (
    request.method !==
    "POST"
  ) {
    response.setHeader(
      "Allow",
      "POST"
    );

    return jsonResponse(
      response,
      405,
      {
        error:
          "Method not allowed.",
      }
    );
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

    return jsonResponse(
      response,
      500,
      {
        error:
          "AI service is not configured.",
      }
    );
  }

  /* ========================================
     Request Body
  ======================================== */

  const body =
    request.body;

  if (
    !body ||
    typeof body !==
      "object"
  ) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "A request body is required.",
      }
    );
  }

  const resume =
    body.resume;

  if (
    !resume ||
    typeof resume !==
      "object"
  ) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "Resume data is required.",
      }
    );
  }

  /* ========================================
     Target Job
  ======================================== */

  const targetJobTitle =
    limitText(
      body.targetJobTitle,
      150
    );

  const targetCompany =
    limitText(
      body.targetCompany,
      150
    );

  const targetJobDescription =
    limitText(
      body.targetJobDescription,
      MAX_JOB_DESCRIPTION_LENGTH
    );

  if (
    !targetJobDescription
  ) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "Add a target job description before tailoring your resume.",
      }
    );
  }

  /* ========================================
     Resume Data
  ======================================== */

  const summary =
    limitText(
      resume.summary,
      1200
    );

  const skills =
    normalizeSkills(
      resume.skills
    );

  const experience =
    normalizeExperience(
      Array.isArray(
        resume.experience
      )
        ? resume.experience
        : resume.experiences
    );

  const projects =
    normalizeProjects(
      resume.projects
    );

  if (
    !summary &&
    skills.length === 0 &&
    experience.length === 0 &&
    projects.length === 0
  ) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "Add resume content before using AI Tailoring.",
      }
    );
  }

  /* ========================================
     Resume Context
  ======================================== */

  const resumeContext = `
TARGET JOB TITLE:
${targetJobTitle || "Not provided"}

TARGET COMPANY:
${targetCompany || "Not provided"}

TARGET JOB DESCRIPTION:
${targetJobDescription}

CURRENT PROFESSIONAL SUMMARY:
${summary || "Not provided"}

CURRENT SKILLS:
${
  skills.length > 0
    ? skills.join(", ")
    : "Not provided"
}

CURRENT EXPERIENCE:
${
  experience.length > 0
    ? JSON.stringify(
        experience,
        null,
        2
      )
    : "Not provided"
}

CURRENT PROJECTS:
${
  projects.length > 0
    ? JSON.stringify(
        projects,
        null,
        2
      )
    : "Not provided"
}
  `.slice(
    0,
    MAX_RESUME_CONTEXT_LENGTH
  );

  /* ========================================
     AI Prompt
  ======================================== */

  const prompt = `
You are an expert resume editor and ATS tailoring assistant.

Analyze the candidate's existing resume against the supplied target job description and propose truthful, job-relevant improvements.

CRITICAL FACTUAL RULES:
- Use only information supported by the supplied resume.
- Never invent employers.
- Never invent job titles.
- Never invent technologies.
- Never invent skills.
- Never invent certifications.
- Never invent education.
- Never invent achievements.
- Never invent responsibilities.
- Never invent dates.
- Never invent years of experience.
- Never invent percentages, revenue, users, performance gains, or other metrics.
- Do not add a keyword merely because it appears in the job description unless the resume already supports that capability.
- You may improve wording and emphasize relevant existing information.
- Preserve the meaning of the candidate's actual experience.

TAILORING GOALS:
- Improve ATS relevance.
- Improve professional clarity.
- Emphasize existing experience that best matches the target role.
- Naturally use supported terminology from the job description.
- Avoid keyword stuffing.
- Keep writing concise and professional.
- Prefer evidence-based language over generic buzzwords.

CONTEXT SENSITIVITY:
- The recommendations must be meaningfully influenced by the supplied target job description.
- Prioritize supported resume evidence that is most relevant to that specific role.
- Two substantially different target job descriptions should produce meaningfully different emphasis when the resume contains evidence relevant to both.
- Do not force irrelevant resume content into a target role merely to create differences.
- If the resume does not support a requested job requirement, do not fabricate it.

PROFESSIONAL SUMMARY:
- If a current summary exists, provide a tailored version.
- Keep it concise.
- Do not use first-person pronouns.
- Do not add unsupported claims.
- Emphasize supported skills and experience most relevant to the target job.

EXPERIENCE:
- Return suggestions only for experience entries that can meaningfully benefit from tailoring.
- Preserve the original array index using "index".
- Rewrite only the description.
- Keep responsibilities and achievements factually equivalent to the original content.
- Emphasize supported responsibilities most relevant to the target job.
- The suggested description must be a meaningful rewrite, not a copy or near-copy of the original.
- If the original contains multiple responsibilities or achievements, return each rewritten point on its own line beginning with "• ".
- Preserve separate bullet points as separate lines.
- Do not merge multiple bullets into one paragraph.
- If no meaningful truthful rewrite is possible, omit that experience entry from the experiences array.

PROJECTS:
- Return suggestions only for projects that can meaningfully benefit from tailoring.
- Preserve the original array index using "index".
- Rewrite only the project description.
- Do not add technologies that are not already supported.
- Emphasize supported project technologies and features most relevant to the target job.
- The suggested description must be a meaningful rewrite, not a copy or near-copy of the original.
- If the original contains multiple features or contributions, return each rewritten point on its own line beginning with "• ".
- Preserve separate bullet points as separate lines.
- Do not merge multiple bullets into one paragraph.
- If no meaningful truthful rewrite is possible, omit that project entry from the projects array.

SKILL SUGGESTIONS:
- Treat this section as suggestions for NEW entries that could truthfully be added to the candidate's Skills section.
- Do NOT return any skill that is already listed in CURRENT SKILLS, including case-only differences.
- Recommend a skill only when it is explicitly supported by evidence elsewhere in CURRENT EXPERIENCE or CURRENT PROJECTS.
- A technology explicitly named in an experience or project may be recommended when it is not already in CURRENT SKILLS and it is relevant to the target job.
- A capability may be recommended only when the experience or project text clearly demonstrates that exact capability; do not infer adjacent technologies or unsupported expertise.
- Never recommend a skill merely because it appears in the target job description.
- Never recommend learning or claiming an unsupported skill as though the candidate already has it.
- Prioritize supported, job-relevant skills that are genuinely missing from CURRENT SKILLS.
- If every supported relevant skill is already present in CURRENT SKILLS, return an empty skills array.

GENERAL SUGGESTIONS:
- Provide a short list of specific tailoring recommendations.
- Recommendations should explain what the candidate could emphasize or improve.
- Do not instruct the candidate to fabricate information.
- If the target job asks for unsupported skills, you may identify the gap in general suggestions, but never present the unsupported skill as an existing candidate skill.

RETURN FORMAT:

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not include commentary before or after the JSON.

Use exactly this structure:

{
  "summary": {
    "original": "current summary or empty string",
    "suggested": "tailored summary or empty string"
  },
  "experiences": [
    {
      "index": 0,
      "original": "existing description",
      "suggested": "tailored description",
      "reason": "brief explanation"
    }
  ],
  "projects": [
    {
      "index": 0,
      "original": "existing description",
      "suggested": "tailored description",
      "reason": "brief explanation"
    }
  ],
  "skills": [
    {
      "skill": "supported skill missing from CURRENT SKILLS",
      "reason": "why it is relevant to the target role"
    }
  ],
  "suggestions": [
    "specific tailoring recommendation"
  ]
}

If no meaningful improvement exists for a section, return an empty array for that section or an empty suggested string for the summary.

Resume context:
${resumeContext}
  `.trim();

  /* ========================================
     Gemini Request
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
          ) => {
            return await ai
              .interactions
              .create({
                model:
                  selectedModel,

                input:
                  prompt,
              });
          },
      });

    if (usedFallback) {
      console.warn(
        `Resume Tailoring AI used fallback model "${model}".`
      );
    }

    /* ========================================
       Extract Output
    ======================================== */

    const output =
      extractInteractionText(
        result
      );

    if (!output) {
      console.error(
        "Resume Tailoring AI returned no readable text.",
        {
          model,

          hasOutputText:
            Boolean(
              result
                ?.output_text
            ),

          outputs:
            result
              ?.outputs
              ?.length || 0,

          steps:
            result
              ?.steps
              ?.length || 0,
        }
      );

      return jsonResponse(
        response,
        502,
        {
          error:
            "AI did not return resume tailoring recommendations. Please try again.",
        }
      );
    }

    /* ========================================
       Parse JSON
    ======================================== */

    const tailoring =
      extractJson(
        output
      );

    if (
      !tailoring ||
      typeof tailoring !==
        "object" ||
      Array.isArray(
        tailoring
      )
    ) {
      console.error(
        "Resume Tailoring AI returned invalid JSON.",
        output
      );

      return jsonResponse(
        response,
        502,
        {
          error:
            "AI returned an invalid resume tailoring response. Please try again.",
        }
      );
    }

    /* ========================================
       Validate Response Shape
    ======================================== */

    const normalizedTailoring =
      {
        summary: {
          original:
            normalizeText(
              tailoring
                ?.summary
                ?.original
            ),

          suggested:
            normalizeText(
              tailoring
                ?.summary
                ?.suggested
            ),
        },

        experiences:
          Array.isArray(
            tailoring.experiences
          )
            ? tailoring
                .experiences
                .filter(
                  (item) =>
                    Number.isInteger(
                      item?.index
                    ) &&
                    typeof item
                      ?.suggested ===
                      "string"
                )
                .map(
                  (item) => ({
                    index:
                      item.index,

                    original:
                      normalizeMultilineText(
                        item.original
                      ),

                    suggested:
                      normalizeMultilineText(
                        item.suggested
                      ),

                    reason:
                      normalizeText(
                        item.reason
                      ),
                  })
                )
                .filter(
                  (item) =>
                    item.suggested &&
                    isMeaningfullyDifferent(
                      item.original,
                      item.suggested
                    )
                )
            : [],

        projects:
          Array.isArray(
            tailoring.projects
          )
            ? tailoring
                .projects
                .filter(
                  (item) =>
                    Number.isInteger(
                      item?.index
                    ) &&
                    typeof item
                      ?.suggested ===
                      "string"
                )
                .map(
                  (item) => ({
                    index:
                      item.index,

                    original:
                      normalizeMultilineText(
                        item.original
                      ),

                    suggested:
                      normalizeMultilineText(
                        item.suggested
                      ),

                    reason:
                      normalizeText(
                        item.reason
                      ),
                  })
                )
                .filter(
                  (item) =>
                    item.suggested &&
                    isMeaningfullyDifferent(
                      item.original,
                      item.suggested
                    )
                )
            : [],

        skills:
          Array.isArray(
            tailoring.skills
          )
            ? tailoring
                .skills
                .map(
                  (item) => ({
                    skill:
                      normalizeText(
                        item?.skill
                      ),

                    reason:
                      normalizeText(
                        item?.reason
                      ),
                  })
                )
                .filter(
                  (item) =>
                    item.skill
                )
                .slice(
                  0,
                  15
                )
            : [],

        suggestions:
          Array.isArray(
            tailoring.suggestions
          )
            ? tailoring
                .suggestions
                .filter(
                  (item) =>
                    typeof item ===
                    "string"
                )
                .map(
                  (item) =>
                    normalizeText(
                      item
                    )
                )
                .filter(Boolean)
                .slice(
                  0,
                  10
                )
            : [],
      };

    /* ========================================
       Success
    ======================================== */

    return jsonResponse(
      response,
      200,
      normalizedTailoring
    );
  } catch (error) {
    console.error(
      "Gemini resume tailoring failed:",
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

    return jsonResponse(
      response,
      status,
      {
        error:
          errorMessage,
      }
    );
  }
}