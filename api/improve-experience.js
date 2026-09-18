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
   Improve Experience
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

  const jobTitle =
    limitText(
      body.jobTitle,
      150
    );

  const company =
    limitText(
      body.company,
      150
    );

  const employmentType =
    limitText(
      body.employmentType,
      80
    );

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

  const projects =
    limitText(
      body.projects,
      2500
    );

  if (!description) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "Add an experience description before using AI Improve.",
      }
    );
  }

  /* ========================================
     Experience Context
  ======================================== */

  const experienceContext = `
CURRENT EXPERIENCE DESCRIPTION:
${description}

ROLE:
${jobTitle || "Not provided"}

COMPANY / ORGANISATION:
${company || "Not provided"}

EMPLOYMENT TYPE:
${employmentType || "Not provided"}

CANDIDATE SKILLS:
${
  skills.length > 0
    ? skills.join(", ")
    : "Not provided"
}

RELEVANT PROJECT CONTEXT:
${projects || "Not provided"}

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
You are an expert resume editor.

Improve the candidate's work experience description using only facts supported by the supplied context.

ACCURACY:
- Preserve factual accuracy.
- Do not invent responsibilities, technologies, employers, clients, achievements, metrics, percentages, revenue, team sizes, awards, dates, or business results.
- Do not add a technology or skill unless it is supported by the supplied context.
- Do not exaggerate seniority, ownership, leadership, or impact.
- Do not describe the candidate as leading, owning, architecting, mentoring, managing, or driving initiatives unless that is explicitly supported.
- Do not add unsupported metrics or measurable outcomes.
- Do not infer performance, reliability, scalability, optimization, security, quality improvements, efficiency gains, or other outcomes unless they are explicitly supported by the supplied experience description.
- When the source only states that something was tested, describe only the testing activity and do not invent the result, purpose, or outcome of that testing.
- Do not convert a general activity into an achievement unless the source explicitly supports the achievement.

CONTENT:
- Strengthen weak wording.
- Make responsibilities and contributions clearer.
- Prefer strong action-oriented language where supported.
- Preserve meaningful technical details from the original description.
- Improve ATS readability naturally.
- Use target-job information only when the candidate's existing experience supports it.
- Prioritize supported responsibilities, technologies, and contributions that are most relevant to the target role.

BULLET FORMAT:
- Rewrite the experience as concise resume bullet points.
- Return between 3 and 6 bullet points depending on how much supported information exists.
- Each bullet must communicate one clear responsibility, contribution, or supported technical activity.
- Start each bullet with a strong action verb when appropriate.
- Use the bullet character "•" at the beginning of every bullet.
- Put every bullet on its own line.
- Do not number the bullets.
- Do not return paragraph text.
- Do not add blank lines between bullets.
- Do not create extra bullets merely to reach a certain count.
- If the source information supports only 3 useful bullets, return only 3.

STYLE:
- Keep bullets concise and recruiter-friendly.
- Avoid repetitive sentence structures.
- Avoid vague filler such as "responsible for" when stronger wording is supported.
- Do not use first-person pronouns.
- Do not add headings, labels, quotation marks, markdown headings, commentary, or explanations.
- Do not use Markdown "-" or "*" bullets.
- Use only the "•" bullet character.

OUTPUT:
- Return only the improved bullet points.
- The complete result must be no more than 1200 characters.

Experience context:
${experienceContext}
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
        `Experience AI used fallback model "${model}".`
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
        "Gemini returned an empty experience description."
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
            "The AI response exceeded the experience description limit. Please try again.",
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
      "Gemini experience improvement failed:",
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