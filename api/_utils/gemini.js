/* ========================================
   Gemini Model Configuration
======================================== */

export const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

export const GEMINI_PRIMARY_MODEL =
  GEMINI_MODELS[0];

/* ========================================
   Error Helpers
======================================== */

export const getGeminiErrorStatus = (
  error
) => {
  return (
    error?.status ??
    error?.statusCode ??
    error?.cause?.status ??
    error?.cause?.statusCode ??
    null
  );
};

export const isGeminiFallbackError = (
  error
) => {
  const status =
    getGeminiErrorStatus(
      error
    );

  return (
    status === 429 ||
    status === 503
  );
};

/* ========================================
   Friendly Error Message
======================================== */

export const getGeminiErrorResponse = (
  error
) => {
  const status =
    getGeminiErrorStatus(
      error
    );

  if (status === 429) {
    return {
      status: 429,
      error:
        "AI request limits are currently reached. Please wait a few moments and try again.",
    };
  }

  if (status === 503) {
    return {
      status: 503,
      error:
        "AI is temporarily busy. Please try again in a few moments.",
    };
  }

  return {
    status: 500,
    error:
      "AI service is temporarily unavailable. Please try again.",
  };
};

/* ========================================
   Generate With Model Fallback Chain
======================================== */

export const generateWithFallback =
  async ({
    generate,
    models =
      GEMINI_MODELS,
  }) => {
    if (
      typeof generate !==
      "function"
    ) {
      throw new Error(
        "A Gemini generate function is required."
      );
    }

    if (
      !Array.isArray(models) ||
      models.length === 0
    ) {
      throw new Error(
        "At least one Gemini model is required."
      );
    }

    let lastError = null;

    for (
      let index = 0;
      index <
      models.length;
      index += 1
    ) {
      const model =
        models[index];

      try {
        const result =
          await generate(
            model
          );

        return {
          result,
          model,
          usedFallback:
            index > 0,
          fallbackIndex:
            index,
        };
      } catch (error) {
        lastError =
          error;

        const status =
          getGeminiErrorStatus(
            error
          );

        const hasNextModel =
          index <
          models.length -
            1;

        /* ========================================
           Non-Fallback Errors
        ======================================== */

        if (
          !isGeminiFallbackError(
            error
          )
        ) {
          console.error(
            `Gemini model "${model}" failed with a non-fallback error:`,
            error
          );

          throw error;
        }

        /* ========================================
           No Models Remaining
        ======================================== */

        if (
          !hasNextModel
        ) {
          console.error(
            `All Gemini models failed. Final model "${model}" returned status ${status}:`,
            error
          );

          break;
        }

        /* ========================================
           Try Next Model
        ======================================== */

        const nextModel =
          models[
            index + 1
          ];

        console.warn(
          `Gemini model "${model}" failed with status ${status}. Trying fallback model "${nextModel}".`
        );
      }
    }

    throw (
      lastError ||
      new Error(
        "All Gemini models failed."
      )
    );
  };