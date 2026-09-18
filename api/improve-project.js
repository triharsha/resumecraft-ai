import {
  GoogleGenAI,
} from "@google/genai";

import {
  generateWithFallback,
  getGeminiErrorResponse,
} from "./_utils/gemini.js";

const MAX_DESCRIPTION_LENGTH = 1200;
const MAX_CONTEXT_LENGTH = 14000;

const ai = new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY,
});

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

/* ========================================
   Preserve Bullet Line Breaks
======================================== */

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
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(
          /\s+/g,
          " "
        )
    )
    .filter(Boolean)
    .join("\n")
    .trim();
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

/* ========================================
   Improve Project
======================================== */

export default async function handler(
  request,
  response
) {
  if (
    request.method !== "POST"
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

  if (
    !process.env
      .GEMINI_API_KEY
  ) {
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

  const description =
    limitText(
      body.description,
      MAX_DESCRIPTION_LENGTH
    );

  const projectName =
    limitText(
      body.projectName,
      150
    );

  const technologies =
    Array.isArray(
      body.technologies
    )
      ? body.technologies
          .filter(
            (technology) =>
              typeof technology ===
              "string"
          )
          .map(
            (technology) =>
              limitText(
                technology,
                50
              )
          )
          .filter(Boolean)
          .slice(
            0,
            30
          )
      : [];

  const targetJobTitle =
    limitText(
      body.targetJobTitle,
      150
    );

  const targetJobDescription =
    limitText(
      body.targetJobDescription,
      6000
    );

  const skills =
    Array.isArray(
      body.skills
    )
      ? body.skills
          .filter(
            (skill) =>
              typeof skill ===
              "string"
          )
          .map(
            (skill) =>
              limitText(
                skill,
                40
              )
          )
          .filter(Boolean)
          .slice(
            0,
            30
          )
      : [];

  const experience =
    limitText(
      body.experience,
      3000
    );

  if (!description) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "Add a project description before using AI Improve.",
      }
    );
  }

  /* ========================================
     Project Context
  ======================================== */

  const projectContext = `
CURRENT PROJECT DESCRIPTION:
${description}

PROJECT NAME:
${projectName || "Not provided"}

PROJECT TECHNOLOGIES:
${
  technologies.length > 0
    ? technologies.join(", ")
    : "Not provided"
}

CANDIDATE SKILLS:
${
  skills.length > 0
    ? skills.join(", ")
    : "Not provided"
}

RELEVANT EXPERIENCE:
${experience || "Not provided"}

TARGET JOB TITLE:
${targetJobTitle || "Not provided"}

TARGET JOB DESCRIPTION:
${targetJobDescription || "Not provided"}
  `.slice(
    0,
    MAX_CONTEXT_LENGTH
  );

  /* ========================================
     Prompt
  ======================================== */

  const prompt = `
You are an expert technical resume editor.

Improve the candidate's project description using only facts supported by the supplied context.

ACCURACY:
- Preserve factual accuracy.
- Do not invent features, technologies, APIs, databases, users, deployment platforms, metrics, percentages, performance improvements, business results, awards, achievements, scale, complexity, collaboration, or ownership.
- Do not claim that a technology was used in this project merely because it appears in the candidate's general skills or experience.
- Treat PROJECT TECHNOLOGIES and the existing project description as the authoritative sources for technologies used in this project.
- Use candidate skills, experience, and target-job information only to improve wording and relevance when supported by the project itself.
- Do not infer performance, reliability, scalability, optimization, security, adoption, efficiency gains, or user impact unless explicitly supported by the supplied project description.
- Do not convert a general project activity into an achievement unless the source explicitly supports the achievement.

CONTENT:
- Strengthen weak wording.
- Clearly communicate what the project does, what was built, and the candidate's technical contribution when those facts are present.
- Prefer strong action-oriented resume language.
- Improve ATS readability naturally.
- Preserve meaningful technical details from the original description.
- Prioritize supported project details that are most relevant to the target role.
- Prefer concrete project evidence over generic claims.

BULLET FORMAT:
- Rewrite the project description as concise resume bullet points.
- Return between 2 and 5 bullet points depending on how much supported information exists.
- Each bullet must communicate one clear supported project feature, technical contribution, or implementation detail.
- Start each bullet with a strong action verb when appropriate.
- Use the bullet character "•" at the beginning of every bullet.
- Put every bullet on its own line.
- Do not number the bullets.
- Do not return paragraph text.
- Do not add blank lines between bullets.
- Do not create extra bullets merely to reach a target count.
- If the source supports only 2 useful bullets, return only 2.

STYLE:
- Keep bullets concise and recruiter-friendly.
- Avoid repetitive sentence structures.
- Avoid vague filler.
- Do not use first-person pronouns.
- Do not add headings, labels, quotation marks, markdown headings, commentary, or explanations.
- Do not use Markdown "-" or "*" bullets.
- Use only the "•" bullet character.

OUTPUT:
- Return only the improved project bullet points.
- The complete result must be no more than 1200 characters.

Project context:
${projectContext}
  `.trim();

  /* ========================================
     Gemini Request With Fallback
  ======================================== */

  try {
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
            return ai
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
      console.info(
        `Project AI used fallback model "${model}".`
      );
    }

    /* ========================================
       Validate Gemini Response
    ======================================== */

    const improvedDescription =
      normalizeMultilineText(
        result?.output_text
      );

    if (
      !improvedDescription
    ) {
      throw new Error(
        "Gemini returned an empty project description."
      );
    }

    if (
      improvedDescription.length >
      MAX_DESCRIPTION_LENGTH
    ) {
      return jsonResponse(
        response,
        502,
        {
          error:
            "The AI response exceeded the project description limit. Please try again.",
        }
      );
    }

    /* ========================================
       Success
    ======================================== */

    return jsonResponse(
      response,
      200,
      {
        description:
          improvedDescription,
      }
    );
  } catch (error) {
    console.error(
      "Gemini project improvement failed:",
      error
    );

    const aiError =
      getGeminiErrorResponse(
        error
      );

    return jsonResponse(
      response,
      aiError.status,
      {
        error:
          aiError.error,
      }
    );
  }
}