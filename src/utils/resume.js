import defaultResume from "../data/defaultResume";

/* ========================================
   General Helpers
======================================== */

export const createId = (
  prefix = "item"
) =>
  `${prefix}-${crypto.randomUUID()}`;

export const getCurrentTimestamp =
  () => new Date().toISOString();

/* ========================================
   Employment Types
======================================== */

export const employmentTypes = [
  {
    value: "full-time",
    label: "Full-time",
  },
  {
    value: "part-time",
    label: "Part-time",
  },
  {
    value: "internship",
    label: "Internship",
  },
  {
    value: "contract",
    label: "Contract",
  },
  {
    value: "freelance",
    label: "Freelance",
  },
  {
    value: "apprenticeship",
    label: "Apprenticeship",
  },
  {
    value: "volunteer",
    label: "Volunteer",
  },
];

/* ========================================
   Fresher-Friendly Employment Types
======================================== */

export const fresherFriendlyTypes = [
  "part-time",
  "internship",
  "freelance",
  "apprenticeship",
  "volunteer",
];

/* ========================================
   Employment Type Label
======================================== */

export const getEmploymentTypeLabel = (
  value
) => {
  const employmentType =
    employmentTypes.find(
      (type) =>
        type.value === value
    );

  return (
    employmentType?.label ||
    "Full-time"
  );
};

/* ========================================
   Empty Experience
======================================== */

export const createEmptyExperience =
  () => ({
    id: createId(
      "experience"
    ),

    jobTitle: "",

    company: "",

    employmentType:
      "full-time",

    location: "",

    startDate: "",

    endDate: "",

    current: false,

    description: "",
  });

/* ========================================
   Empty Education
======================================== */

export const createEmptyEducation =
  () => ({
    id: createId(
      "education"
    ),

    institution: "",

    degree: "",

    fieldOfStudy: "",

    location: "",

    startDate: "",

    endDate: "",

    current: false,

    description: "",
  });

/* ========================================
   Empty Project
======================================== */

export const createEmptyProject =
  () => ({
    id: createId(
      "project"
    ),

    name: "",

    description: "",

    technologies: [],

    projectUrl: "",

    githubUrl: "",
  });

/* ========================================
   Empty Certification
======================================== */

export const createEmptyCertification =
  () => ({
    id: createId(
      "certification"
    ),

    name: "",

    issuer: "",

    issueDate: "",

    credentialUrl: "",
  });

/* ========================================
   Empty Language
======================================== */

export const createEmptyLanguage =
  () => ({
    id: createId(
      "language"
    ),

    name: "",

    proficiency: "",
  });

/* ========================================
   Persistence Helpers
======================================== */

const validTemplateIds =
  new Set([
    "modern",
    "nova",
    "horizon",
    "vertex",
    "metro",

    "professional",
    "executive",
    "corporate",
    "sterling",
    "authority",

    "minimal",
    "pure",
    "clean",
    "mono",
    "air",

    "classic",
    "heritage",
    "oxford",
    "chronicle",
    "timeless",

    "canvas",
    "spectrum",
    "muse",
    "studio",
    "vivid",

    "developer",
    "engineer",
    "terminal",
    "architect",
    "stack",
  ]);

const validFontSizes = [
  "small",
  "medium",
  "large",
];

const validSpacings = [
  "compact",
  "normal",
  "relaxed",
];

const isPlainObject = (
  value
) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const normalizeString = (
  value,
  fallback = ""
) =>
  typeof value === "string"
    ? value
    : fallback;

const normalizeBoolean = (
  value,
  fallback = false
) =>
  typeof value === "boolean"
    ? value
    : fallback;

const normalizeItem = (
  item,
  defaults,
  prefix
) => {
  const safeItem =
    isPlainObject(item)
      ? item
      : {};

  return {
    ...defaults,
    ...safeItem,

    id:
      normalizeString(
        safeItem.id
      ) ||
      createId(prefix),
  };
};

const normalizeSection = (
  section,
  defaults,
  prefix
) => {
  if (!Array.isArray(section)) {
    return [];
  }

  return section.map(
    (item) =>
      normalizeItem(
        item,
        defaults,
        prefix
      )
  );
};

/* ========================================
   Normalize Persisted Resume
======================================== */

export const normalizeResume = (
  resume
) => {
  const safeResume =
    isPlainObject(resume)
      ? resume
      : {};

  const fallbackTimestamp =
    getCurrentTimestamp();

  const experienceDefaults =
    structuredClone(
      defaultResume.experience[0]
    );

  const educationDefaults =
    structuredClone(
      defaultResume.education[0]
    );

  const projectDefaults =
    structuredClone(
      defaultResume.projects[0]
    );

  const certificationDefaults =
    structuredClone(
      defaultResume
        .certifications[0]
    );

  const languageDefaults =
    structuredClone(
      defaultResume.languages[0]
    );

  const normalizedExperience =
    normalizeSection(
      safeResume.experience,
      experienceDefaults,
      "experience"
    ).map((item) => ({
      ...item,

      employmentType:
        employmentTypes.some(
          (type) =>
            type.value ===
            item.employmentType
        )
          ? item.employmentType
          : "full-time",

      current:
        normalizeBoolean(
          item.current
        ),
    }));

  const normalizedEducation =
    normalizeSection(
      safeResume.education,
      educationDefaults,
      "education"
    ).map((item) => ({
      ...item,

      current:
        normalizeBoolean(
          item.current
        ),
    }));

  const normalizedProjects =
    normalizeSection(
      safeResume.projects,
      projectDefaults,
      "project"
    ).map((item) => ({
      ...item,

      technologies:
        Array.isArray(
          item.technologies
        )
          ? item.technologies.filter(
              (technology) =>
                typeof technology ===
                "string"
            )
          : [],
    }));

  const normalizedCertifications =
    normalizeSection(
      safeResume.certifications,
      certificationDefaults,
      "certification"
    );

  const normalizedLanguages =
    normalizeSection(
      safeResume.languages,
      languageDefaults,
      "language"
    );

  const personalInfo =
    isPlainObject(
      safeResume.personalInfo
    )
      ? safeResume.personalInfo
      : {};

  const jobTarget =
    isPlainObject(
      safeResume.jobTarget
    )
      ? safeResume.jobTarget
      : {};

  const analysis =
    isPlainObject(
      safeResume.analysis
    )
      ? safeResume.analysis
      : {};

  const customization =
    isPlainObject(
      safeResume.customization
    )
      ? safeResume.customization
      : {};

  return {
    ...structuredClone(
      defaultResume
    ),

    ...safeResume,

    id:
      normalizeString(
        safeResume.id
      ) ||
      createId("resume"),

    title:
      normalizeString(
        safeResume.title,
        "Untitled Resume"
      ).trim() ||
      "Untitled Resume",

    templateId:
      validTemplateIds.has(
        safeResume.templateId
      )
        ? safeResume.templateId
        : "modern",

    isFresher:
      normalizeBoolean(
        safeResume.isFresher
      ),

    createdAt:
      normalizeString(
        safeResume.createdAt
      ) ||
      fallbackTimestamp,

    updatedAt:
      normalizeString(
        safeResume.updatedAt
      ) ||
      fallbackTimestamp,

    personalInfo: {
      ...defaultResume.personalInfo,
      ...personalInfo,

      firstName:
        normalizeString(
          personalInfo.firstName
        ),

      lastName:
        normalizeString(
          personalInfo.lastName
        ),

      jobTitle:
        normalizeString(
          personalInfo.jobTitle
        ),

      email:
        normalizeString(
          personalInfo.email
        ),

      phone:
        normalizeString(
          personalInfo.phone
        ),

      location:
        normalizeString(
          personalInfo.location
        ),

      website:
        normalizeString(
          personalInfo.website
        ),

      linkedin:
        normalizeString(
          personalInfo.linkedin
        ),

      github:
        normalizeString(
          personalInfo.github
        ),
    },

    summary:
      normalizeString(
        safeResume.summary
      ),

    experience:
      normalizedExperience,

    education:
      normalizedEducation,

    skills:
      Array.isArray(
        safeResume.skills
      )
        ? safeResume.skills.filter(
            (skill) =>
              typeof skill ===
              "string"
          )
        : [],

    projects:
      normalizedProjects,

    certifications:
      normalizedCertifications,

    languages:
      normalizedLanguages,

    jobTarget: {
      ...defaultResume.jobTarget,
      ...jobTarget,

      jobTitle:
        normalizeString(
          jobTarget.jobTitle
        ),

      company:
        normalizeString(
          jobTarget.company
        ),

      jobDescription:
        normalizeString(
          jobTarget.jobDescription
        ),
    },

    analysis: {
      ...defaultResume.analysis,
      ...analysis,

      overallScore:
        typeof analysis.overallScore ===
        "number"
          ? analysis.overallScore
          : 0,

      atsScore:
        typeof analysis.atsScore ===
        "number"
          ? analysis.atsScore
          : 0,

      contentScore:
        typeof analysis.contentScore ===
        "number"
          ? analysis.contentScore
          : 0,

      impactScore:
        typeof analysis.impactScore ===
        "number"
          ? analysis.impactScore
          : 0,

      keywordScore:
        typeof analysis.keywordScore ===
        "number"
          ? analysis.keywordScore
          : 0,

      missingKeywords:
        Array.isArray(
          analysis.missingKeywords
        )
          ? analysis
              .missingKeywords
          : [],

      matchedKeywords:
        Array.isArray(
          analysis.matchedKeywords
        )
          ? analysis
              .matchedKeywords
          : [],

      suggestions:
        Array.isArray(
          analysis.suggestions
        )
          ? analysis.suggestions
          : [],
    },

    customization: {
      ...defaultResume.customization,
      ...customization,

      fontFamily:
        normalizeString(
          customization.fontFamily,
          defaultResume
            .customization
            .fontFamily
        ),

      fontSize:
        validFontSizes.includes(
          customization.fontSize
        )
          ? customization.fontSize
          : defaultResume
              .customization
              .fontSize,

      accentColor:
        normalizeString(
          customization.accentColor,
          defaultResume
            .customization
            .accentColor
        ),

      spacing:
        validSpacings.includes(
          customization.spacing
        )
          ? customization.spacing
          : defaultResume
              .customization
              .spacing,
    },
  };
};

/* ========================================
   Normalize Persisted Resumes
======================================== */

export const normalizeResumes = (
  resumes
) => {
  if (!Array.isArray(resumes)) {
    return [];
  }

  return resumes
    .filter(
      (resume) =>
        isPlainObject(resume)
    )
    .map(
      (resume) =>
        normalizeResume(resume)
    );
};

/* ========================================
   Create Resume
======================================== */

export const createResume = ({
  title = "Untitled Resume",

  templateId = "modern",

  accentColor = "#7c3aed",
} = {}) => {
  const timestamp =
    getCurrentTimestamp();

  return {
    ...structuredClone(
      defaultResume
    ),

    id: createId(
      "resume"
    ),

    title,

    templateId,

    isFresher: false,

    createdAt:
      timestamp,

    updatedAt:
      timestamp,

    experience: [
      createEmptyExperience(),
    ],

    education: [
      createEmptyEducation(),
    ],

    projects: [
      createEmptyProject(),
    ],

    certifications: [
      createEmptyCertification(),
    ],

    languages: [
      createEmptyLanguage(),
    ],

    customization: {
      ...defaultResume.customization,

      accentColor,
    },
  };
};

/* ========================================
   Duplicate Resume
======================================== */

export const duplicateResumeData = (
  resume
) => {
  const timestamp =
    getCurrentTimestamp();

  const duplicated =
    structuredClone(
      resume
    );

  return {
    ...duplicated,

    id: createId(
      "resume"
    ),

    title: `${
      resume.title ||
      "Untitled Resume"
    } Copy`,

    createdAt:
      timestamp,

    updatedAt:
      timestamp,
  };
};

/* ========================================
   Update Timestamp
======================================== */

export const withUpdatedTimestamp = (
  resume
) => ({
  ...resume,

  updatedAt:
    getCurrentTimestamp(),
});