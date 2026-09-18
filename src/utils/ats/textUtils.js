/* ========================================
   Common Stop Words
======================================== */

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
  "but",
  "by",
  "can",
  "for",
  "from",
  "had",
  "has",
  "have",
  "he",
  "her",
  "hers",
  "him",
  "his",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "may",
  "more",
  "most",
  "of",
  "on",
  "or",
  "our",
  "ours",
  "she",
  "should",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "they",
  "this",
  "to",
  "us",
  "was",
  "we",
  "were",
  "will",
  "with",
  "you",
  "your",
  "yours",

  "about",
  "across",
  "after",
  "all",
  "also",
  "any",
  "around",
  "both",
  "each",
  "etc",
  "including",
  "like",
  "new",
  "other",
  "over",
  "such",
  "than",
  "then",
  "through",
  "using",
  "within",

  "candidate",
  "candidates",
  "company",
  "job",
  "position",
  "role",
  "team",
  "work",
  "working",
  "responsibilities",
  "responsibility",
  "requirements",
  "required",
  "preferred",
]);

/* ========================================
   Text Normalization
======================================== */

export const normalizeText = (
  value = ""
) => {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}+#.\-/\s]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
};

/* ========================================
   Tokenizer
======================================== */

export const tokenize = (
  value = ""
) => {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .map((token) =>
      token.trim()
    )
    .filter(Boolean);
};

/* ========================================
   Meaningful Tokens
======================================== */

export const getMeaningfulTokens = (
  value = "",
  {
    minimumLength = 2,
    removeStopWords = true,
  } = {}
) => {
  return tokenize(value).filter(
    (token) => {
      if (
        token.length <
        minimumLength
      ) {
        return false;
      }

      if (
        removeStopWords &&
        STOP_WORDS.has(token)
      ) {
        return false;
      }

      if (
        /^\d+$/.test(token)
      ) {
        return false;
      }

      return true;
    }
  );
};

/* ========================================
   Unique Values
======================================== */

export const uniqueStrings = (
  values = []
) => {
  const seen = new Set();

  return values.filter(
    (value) => {
      if (
        typeof value !==
        "string"
      ) {
        return false;
      }

      const normalized =
        normalizeText(value);

      if (
        !normalized ||
        seen.has(normalized)
      ) {
        return false;
      }

      seen.add(normalized);

      return true;
    }
  );
};

/* ========================================
   Word Count
======================================== */

export const getWordCount = (
  value = ""
) => {
  return tokenize(value).length;
};

/* ========================================
   Number Detection
======================================== */

export const containsNumber = (
  value = ""
) => {
  if (
    typeof value !==
    "string"
  ) {
    return false;
  }

  return /\d/.test(value);
};

/* ========================================
   Percentage Detection
======================================== */

export const containsPercentage = (
  value = ""
) => {
  if (
    typeof value !==
    "string"
  ) {
    return false;
  }

  return /\d+(?:\.\d+)?\s*%/.test(
    value
  );
};

/* ========================================
   Safe Percentage
======================================== */

export const toPercentage = (
  value
) => {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
};