import defaultResume from "../../data/defaultResume";

/* ========================================
   Helpers
======================================== */

const cleanText = (
  value
) =>
  String(
    value || ""
  ).trim();

const createImportedTitle = (
  parsedResume
) => {
  const firstName =
    cleanText(
      parsedResume
        ?.personalInfo
        ?.firstName
    );

  const lastName =
    cleanText(
      parsedResume
        ?.personalInfo
        ?.lastName
    );

  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  if (fullName) {
    return `${fullName} Resume`;
  }

  return "Imported Resume";
};

/* ========================================
   Merge Parsed Resume With
   ResumeCraft Defaults
======================================== */

export const createImportedResumeData = (
  parsedResume,
  {
    templateId =
      defaultResume.templateId,

    accentColor =
      defaultResume
        .customization
        .accentColor,
  } = {}
) => {
  const source =
    parsedResume || {};

  return {
    title:
      createImportedTitle(
        source
      ),

    personalInfo: {
      ...defaultResume.personalInfo,
      ...(source.personalInfo ||
        {}),
    },

    summary:
      cleanText(
        source.summary
      ),

    experience:
      Array.isArray(
        source.experience
      )
        ? source.experience
        : [],

    education:
      Array.isArray(
        source.education
      )
        ? source.education
        : [],

    skills:
      Array.isArray(
        source.skills
      )
        ? source.skills
        : [],

    projects:
      Array.isArray(
        source.projects
      )
        ? source.projects
        : [],

    certifications:
      Array.isArray(
        source.certifications
      )
        ? source.certifications
        : [],

    languages:
      Array.isArray(
        source.languages
      )
        ? source.languages
        : [],

    jobTarget: {
      ...defaultResume.jobTarget,
    },

    analysis: {
      ...defaultResume.analysis,

      missingKeywords: [],
      matchedKeywords: [],
      suggestions: [],
    },

    customization: {
      ...defaultResume.customization,

      accentColor,
    },

    templateId,

    isFresher: false,
  };
};

export default createImportedResumeData;