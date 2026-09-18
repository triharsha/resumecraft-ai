import {
  GoogleGenAI,
} from "@google/genai";

import {
  generateWithFallback,
  getGeminiErrorResponse,
} from "./_utils/gemini.js";

const MAX_SUMMARY_LENGTH = 700;
const MAX_CONTEXT_LENGTH = 12000;

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
   Rewrite Summary
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

  const summary =
    limitText(
      body.summary,
      MAX_SUMMARY_LENGTH
    );

  const jobTitle =
    limitText(
      body.jobTitle,
      150
    );

  const jobDescription =
    limitText(
      body.jobDescription,
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
          .filter(
            Boolean
          )
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

  const projects =
    limitText(
      body.projects,
      2000
    );

  if (!summary) {
    return jsonResponse(
      response,
      400,
      {
        error:
          "Add a professional summary before using AI Rewrite.",
      }
    );
  }

  /* ========================================
     Resume Context
  ======================================== */

  const resumeContext = `
CURRENT SUMMARY:
${summary}

TARGET JOB TITLE:
${jobTitle || "Not provided"}

TARGET JOB DESCRIPTION:
${jobDescription || "Not provided"}

SKILLS:
${
  skills.length > 0
    ? skills.join(", ")
    : "Not provided"
}

EXPERIENCE CONTEXT:
${experience || "Not provided"}

PROJECT CONTEXT:
${projects || "Not provided"}
  `.slice(
    0,
    MAX_CONTEXT_LENGTH
  );

  /* ========================================
     Prompt
  ======================================== */

  const prompt = `
You are an expert resume editor.

Rewrite the candidate's professional summary using only information supported by the supplied resume context.

Your job is not only to improve the wording. You must identify the strongest supported evidence in the resume and organize that evidence around the supplied target role when one is provided.

Requirements:

ACCURACY
- Preserve factual accuracy.
- Do not invent employers, job titles, technologies, tools, frameworks, databases, achievements, metrics, education, certifications, or years of experience.
- Do not claim a skill unless it is supported by the supplied resume context.
- Do not assume a technology stack from the target job title alone.
- Do not assume that "Full Stack Developer" means MERN, Java Full Stack, Python Full Stack, .NET Full Stack, or any other specific stack.
- Determine the candidate's actual technology stack only from the supplied resume evidence.

EVIDENCE SOURCE ACCURACY
- Distinguish clearly between professional work experience, internship experience, and project experience.
- Treat EXPERIENCE CONTEXT and PROJECT CONTEXT as different evidence sources.
- Do not describe project work as professional experience, employment experience, work experience, industry experience, or commercial experience unless the supplied EXPERIENCE CONTEXT explicitly supports that claim.
- Do not combine internship evidence and project evidence into a broader claim of "professional full-stack experience" unless the EXPERIENCE CONTEXT itself demonstrates professional full-stack work.
- If backend evidence comes from an internship and frontend evidence comes from projects, describe that distinction accurately.
- Safe wording may include phrases such as "hands-on experience", "practical experience", "project experience", "internship experience", or explicit wording such as "backend internship experience combined with frontend project experience".
- Avoid wording that makes academic, personal, or portfolio projects sound like paid employment.
- Do not upgrade an internship into a full-time professional role.
- Do not upgrade project responsibilities into employer responsibilities.
- When evidence comes from multiple sources, connect them accurately rather than merging them into a stronger unsupported employment claim.

TARGET-ROLE RELEVANCE
- If a target job title or job description is provided, actively rebalance the summary toward that target role.
- Prioritize supported technologies, projects, responsibilities, and experience that are most relevant to the target role.
- Reduce emphasis on less relevant information when stronger target-role evidence is available.
- Do not merely append a sentence mentioning the target role.
- The entire summary should reflect the target role when supported by the resume.

FULL-STACK HANDLING
- If the target is a full-stack role, inspect the supplied resume for supported evidence across multiple application layers.
- When available, include concrete supported frontend evidence.
- When available, include concrete supported backend or server-side evidence.
- When available, include concrete supported API, database, or data-persistence evidence.
- Balance those areas naturally instead of describing only one side of the stack.
- Mention actual supported technologies rather than vague phrases such as "across the stack" when concrete technologies are available.
- If the resume supports only part of a full-stack profile, do not invent the missing part.
- If frontend and backend evidence come from different resume sections, preserve that distinction rather than implying both were performed in the same professional role.
- A full-stack target does not automatically prove professional full-stack employment.
- Prefer accurate positioning such as "Full Stack Developer with hands-on experience..." when the evidence combines internship and project work.

FRONTEND / BACKEND HANDLING
- For a frontend target, prioritize supported UI, responsive development, browser-side technologies, frontend frameworks, styling tools, and frontend projects.
- For a backend target, prioritize supported server-side technologies, APIs, databases, application services, integration work, and backend projects.
- These are categories of evidence, not fixed technology lists. Use only the candidate's actual supported technologies.

POSITIONING
- When the resume clearly supports the target role, describe the candidate directly in terms of that role.
- Do not describe the candidate as "transitioning", "aspiring", "eager to move into", "looking to move into", or similar unless that wording is explicitly supported by the resume.
- Do not imply that the candidate lacks target-role capability when the supplied resume contains relevant supporting evidence.
- Direct role positioning must not exaggerate the type or level of experience.
- Being positioned as a target role does not allow you to convert projects into professional employment experience.
- If the candidate is a fresher or has internship-level professional evidence, keep the experience level truthful and proportionate.

CONTENT QUALITY
- Improve clarity, specificity, professional tone, and ATS readability.
- Prefer concise, natural language over buzzwords.
- Prefer concrete supported technologies and responsibilities over generic claims.
- Prefer evidence from experience and projects over simply repeating a skills list.
- Keep the strongest target-relevant evidence near the beginning when appropriate.
- Avoid listing every technology if doing so weakens readability or role focus.
- Do not force unrelated target-job keywords that are unsupported by the resume.
- Avoid inflated phrases such as "extensive professional experience", "proven industry experience", "seasoned", "expert", or similar unless explicitly supported by the resume evidence.

NO TARGET JOB
- If no target job title or job description is provided, improve the summary based only on the candidate's strongest supported resume evidence.
- Do not invent or assume a target role when none is provided.

OUTPUT RULES
- Do not use first-person pronouns.
- Do not add headings, labels, quotation marks, bullet points, markdown, or commentary.
- Return only the rewritten professional summary.
- The final summary must be no more than 700 characters.

Resume context:
${resumeContext}
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
        `Summary AI used fallback model "${model}".`
      );
    }

    /* ========================================
       Validate Gemini Response
    ======================================== */

    const rewrittenSummary =
      normalizeText(
        result?.output_text
      );

    if (
      !rewrittenSummary
    ) {
      throw new Error(
        "Gemini returned an empty summary."
      );
    }

    if (
      rewrittenSummary.length >
      MAX_SUMMARY_LENGTH
    ) {
      return jsonResponse(
        response,
        502,
        {
          error:
            "The AI response exceeded the summary length limit. Please try again.",
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
        summary:
          rewrittenSummary,
      }
    );
  } catch (error) {
    console.error(
      "Gemini summary rewrite failed:",
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