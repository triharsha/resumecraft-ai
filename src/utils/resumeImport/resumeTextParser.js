/* ========================================
   Resume Section Aliases
======================================== */

const SECTION_ALIASES = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "professional profile",
    "career objective",
    "objective",
    "about me",
  ],

  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "work history",
    "internship",
    "internships",
    "internship experience",
  ],

  education: [
    "education",
    "academic details",
    "academic qualifications",
    "educational qualifications",
    "qualification",
  ],

  skills: [
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "technologies",
    "technical expertise",
    "technical proficiencies",
    "soft skills",
    "softskills",
  ],

  projects: [
    "projects",
    "academic projects",
    "personal projects",
    "professional projects",
    "project experience",
  ],

  certifications: [
    "certifications",
    "certificates",
    "certification",
    "licenses and certifications",
  ],

  languages: [
    "languages",
    "language",
    "language proficiency",
    "languages known",
  ],
};

/* ========================================
   Helpers
======================================== */

const cleanText = (value) =>
  String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

const BULLET_LINE_REGEX =
  /^[•●▪◦◆◇■□✓✔➢➤►*-]\s*/;

const isBulletLine = (
  value
) =>
  BULLET_LINE_REGEX.test(
    cleanText(value)
  );

const cleanLine = (value) =>
  cleanText(value)
    .replace(
      /^[•●▪◦◆◇■□✓✔➢➤►*-]\s*/,
      ""
    )
    .trim();

const normalizeHeading = (
  value
) =>
  cleanText(value)
    .toLowerCase()
    .replace(
      /[:\-–—]+$/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

const uniqueStrings = (
  values
) => {
  const seen = new Set();

  return values.filter(
    (value) => {
      const cleaned =
        cleanText(value);

      if (!cleaned) {
        return false;
      }

      const key =
        cleaned.toLowerCase();

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
};

const createId = () => {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `import-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

/* ========================================
   Heading Detection
======================================== */

const headingLookup =
  new Map();

Object.entries(
  SECTION_ALIASES
).forEach(
  ([section, aliases]) => {
    aliases.forEach(
      (alias) => {
        headingLookup.set(
          normalizeHeading(
            alias
          ),
          section
        );
      }
    );
  }
);

const detectHeading = (
  line
) => {
  const normalized =
    normalizeHeading(line);

  return (
    headingLookup.get(
      normalized
    ) || null
  );
};

/* ========================================
   Split Resume Into Sections
======================================== */

const splitIntoSections = (
  text
) => {
  const lines =
    String(text || "")
      .split(/\r?\n/)
      .map(cleanText)
      .filter(Boolean);

  const sections = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  };

  let activeSection =
    "header";

  lines.forEach(
    (line) => {
      const detectedSection =
        detectHeading(line);

      if (
        detectedSection
      ) {
        activeSection =
          detectedSection;

        return;
      }

      sections[
        activeSection
      ].push(line);
    }
  );

  return sections;
};

/* ========================================
   Personal Information
======================================== */

const EMAIL_REGEX =
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

const PHONE_REGEX =
  /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,5}\)?[\s-]?)?\d[\d\s-]{7,}\d/;

const URL_REGEX =
  /(?:https?:\/\/|www\.)[^\s|]+/gi;

const findEmail = (
  text
) =>
  text.match(
    EMAIL_REGEX
  )?.[0] || "";

const findPhone = (
  text
) => {
  const match =
    text.match(
      PHONE_REGEX
    )?.[0] || "";

  return cleanText(
    match
  );
};

const normalizeUrl = (
  value
) => {
  const cleaned =
    cleanText(
      value
    ).replace(
      /[),.;]+$/g,
      ""
    );

  if (!cleaned) {
    return "";
  }

  if (
    /^https?:\/\//i.test(
      cleaned
    )
  ) {
    return cleaned;
  }

  if (
    /^www\./i.test(
      cleaned
    )
  ) {
    return `https://${cleaned}`;
  }

  return cleaned;
};

const extractUrls = (
  text
) => {
  const urls =
    text.match(
      URL_REGEX
    ) || [];

  return uniqueStrings(
    urls.map(
      normalizeUrl
    )
  );
};

const extractSocialLinks = (
  text
) => {
  const urls =
    extractUrls(text);

  let linkedin = "";
  let github = "";
  let website = "";

  urls.forEach(
    (url) => {
      const lower =
        url.toLowerCase();

      if (
        lower.includes(
          "linkedin.com"
        )
      ) {
        linkedin ||= url;

        return;
      }

      if (
        lower.includes(
          "github.com"
        )
      ) {
        github ||= url;

        return;
      }

      website ||= url;
    }
  );

  return {
    linkedin,
    github,
    website,
  };
};

/* ========================================
   Name Detection
======================================== */

const HEADER_LABEL_REGEX =
  /^(email|e-mail|phone|mobile|contact|linkedin|linked in|github|git hub|website|portfolio|address|location)\b/i;

const looksLikeContactLine = (
  line
) =>
  EMAIL_REGEX.test(
    line
  ) ||
  PHONE_REGEX.test(
    line
  ) ||
  HEADER_LABEL_REGEX.test(
    line
  ) ||
  /linkedin\.com|github\.com|https?:\/\/|www\./i.test(
    line
  );

const detectName = (
  headerLines
) => {
  const candidate =
    headerLines.find(
      (line) => {
        if (
          looksLikeContactLine(
            line
          )
        ) {
          return false;
        }

        const words =
          line
            .split(/\s+/)
            .filter(Boolean);

        return (
          words.length >= 2 &&
          words.length <= 5 &&
          line.length <= 60 &&
          !/[0-9@|]/.test(
            line
          )
        );
      }
    ) || "";

  if (!candidate) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const parts =
    cleanText(
      candidate
    )
      .toLowerCase()
      .split(/\s+/)
      .map(
        (part) =>
          part
            .charAt(0)
            .toUpperCase() +
          part.slice(1)
      );

  return {
    firstName:
      parts[0] || "",

    lastName:
      parts
        .slice(1)
        .join(" "),
  };
};

/* ========================================
   Job Title Detection
======================================== */

const detectJobTitle = (
  headerLines,
  detectedName
) => {
  const fullName =
    cleanText(
      `${detectedName.firstName} ${detectedName.lastName}`
    ).toLowerCase();

  const candidate =
    headerLines.find(
      (line) => {
        const normalized =
          cleanText(
            line
          ).toLowerCase();

        if (
          !normalized ||
          normalized ===
            fullName
        ) {
          return false;
        }

        if (
          looksLikeContactLine(
            line
          )
        ) {
          return false;
        }

        if (
          line.length > 80
        ) {
          return false;
        }

        return true;
      }
    );

  return candidate || "";
};

/* ========================================
   Summary
======================================== */

const parseSummary = (
  lines
) =>
  cleanText(
    lines.join(" ")
  );

/* ========================================
   Skills
======================================== */

const SKILL_CATEGORY_REGEX =
  /^(programming languages?|languages?|frameworks?\s*&?\s*libraries?|libraries|databases?|database technologies|tools?|technologies|web technologies|frontend|front-end|backend|back-end|cloud|platforms?|operating systems?|concepts?|other skills?|technical skills?|soft skills?)\s*:\s*/i;

const protectParentheticalCommas = (
  value
) => {
  let depth = 0;

  let result = "";

  for (
    let index = 0;
    index <
    value.length;
    index += 1
  ) {
    const character =
      value[index];

    if (
      character === "("
    ) {
      depth += 1;
    }

    if (
      character === ")"
    ) {
      depth =
        Math.max(
          0,
          depth - 1
        );
    }

    if (
      character === "," &&
      depth > 0
    ) {
      result +=
        "__COMMA__";
    } else {
      result +=
        character;
    }
  }

  return result;
};

const parseSkills = (
  lines
) => {
  const skills = [];

  lines.forEach(
    (line) => {
      let value =
        cleanLine(line);

      value =
        value.replace(
          SKILL_CATEGORY_REGEX,
          ""
        );

      const protectedValue =
        protectParentheticalCommas(
          value
        );

      const parts =
        protectedValue.split(
          /[,;|•●▪◦]+/
        );

      parts.forEach(
        (part) => {
          const skill =
            cleanText(
              part.replace(
                /__COMMA__/g,
                ","
              )
            );

          if (
            skill &&
            skill.length <= 80
          ) {
            skills.push(
              skill
            );
          }
        }
      );
    }
  );

  return uniqueStrings(
    skills
  ).slice(
    0,
    30
  );
};

/* ========================================
   Date Helpers
======================================== */

const YEAR_RANGE_REGEX =
  /\b((?:19|20)\d{2})\s*(?:-|–|—|to)\s*((?:19|20)\d{2}|present|current)\b/i;

const extractYearRange = (
  text
) => {
  const match =
    text.match(
      YEAR_RANGE_REGEX
    );

  if (!match) {
    return {
      startDate: "",
      endDate: "",
      current: false,
    };
  }

  const endValue =
    match[2];

  const current =
    /present|current/i.test(
      endValue
    );

  return {
    startDate:
      match[1] || "",

    endDate:
      current
        ? ""
        : endValue || "",

    current,
  };
};

/* ========================================
   Education
======================================== */

const DEGREE_REGEX =
  /\b(B\.?\s?Tech|BTech|Bachelor(?:'s)?|B\.?E\.?|M\.?\s?Tech|MTech|Master(?:'s)?|M\.?E\.?|MBA|BBA|BCA|MCA|B\.?Sc|M\.?Sc|Diploma|Ph\.?D)\b/i;

const cleanInstitutionLine = (
  line
) =>
  cleanText(
    line
      .replace(
        /\bCGPA\s*:\s*[\d.]+(?:\/\d+)?/i,
        ""
      )
      .replace(
        /\bGPA\s*:\s*[\d.]+(?:\/\d+)?/i,
        ""
      )
  );

const parseEducation = (
  lines
) => {
  if (!lines.length) {
    return [];
  }

  const entries = [];

  let currentEntry =
    null;

  const pushCurrent =
    () => {
      if (!currentEntry) {
        return;
      }

      const hasContent =
        currentEntry.institution ||
        currentEntry.degree ||
        currentEntry.fieldOfStudy ||
        currentEntry.description;

      if (hasContent) {
        entries.push(
          currentEntry
        );
      }

      currentEntry =
        null;
    };

  lines.forEach(
    (rawLine) => {
      const line =
        cleanLine(
          rawLine
        );

      const hasDegree =
        DEGREE_REGEX.test(
          line
        );

      const dateRange =
        extractYearRange(
          line
        );

      if (hasDegree) {
        pushCurrent();

        currentEntry = {
          id: createId(),

          institution: "",

          degree: "",

          fieldOfStudy: "",

          location: "",

          startDate:
            dateRange.startDate,

          endDate:
            dateRange.endDate,

          current:
            dateRange.current,

          description: "",
        };

        const degreeMatch =
          line.match(
            DEGREE_REGEX
          );

        currentEntry.degree =
          cleanText(
            degreeMatch?.[0] ||
              ""
          );

        const parentheses =
          line.match(
            /\(([^)]+)\)/
          );

        if (
          parentheses
        ) {
          currentEntry.fieldOfStudy =
            cleanText(
              parentheses[1]
            );
        }

        return;
      }

      if (!currentEntry) {
        currentEntry = {
          id: createId(),

          institution: "",

          degree: "",

          fieldOfStudy: "",

          location: "",

          startDate:
            dateRange.startDate,

          endDate:
            dateRange.endDate,

          current:
            dateRange.current,

          description: "",
        };
      }

      if (
        !currentEntry.institution &&
        /university|college|institute|school|academy|technology/i.test(
          line
        )
      ) {
        currentEntry.institution =
          cleanInstitutionLine(
            line
          );

        return;
      }

      currentEntry.description =
        cleanText(
          [
            currentEntry.description,
            line,
          ]
            .filter(Boolean)
            .join(" ")
        );
    }
  );

  pushCurrent();

  return entries;
};

/* ========================================
   Experience
======================================== */

const parseExperience = (
  lines
) => {
  if (!lines.length) {
    return [];
  }

  const entries = [];

  let currentEntry =
    null;

  const createEmptyExperience =
    () => ({
      id: createId(),

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

  const pushCurrent =
    () => {
      if (!currentEntry) {
        return;
      }

      if (
        currentEntry.jobTitle ||
        currentEntry.company ||
        currentEntry.description
      ) {
        entries.push(
          currentEntry
        );
      }

      currentEntry =
        null;
    };

  lines.forEach(
    (rawLine) => {
      const bullet =
        isBulletLine(
          rawLine
        );

      const line =
        cleanLine(
          rawLine
        );

      if (!line) {
        return;
      }

      const dates =
        extractYearRange(
          line
        );

      const containsDates =
        Boolean(
          dates.startDate
        );

      /* =====================================
         Experience With Date Range
      ===================================== */

      if (
        containsDates
      ) {
        pushCurrent();

        const titleLine =
          cleanText(
            line.replace(
              YEAR_RANGE_REGEX,
              ""
            )
          );

        const parts =
          titleLine.split(
            /\s+(?:at|@|\||,)\s+/i
          );

        currentEntry = {
          ...createEmptyExperience(),

          jobTitle:
            parts[0] || "",

          company:
            parts
              .slice(1)
              .join(" "),

          startDate:
            dates.startDate,

          endDate:
            dates.endDate,

          current:
            dates.current,
        };

        return;
      }

      /* =====================================
         First Non-Bullet Line
         = Experience / Internship Title
      ===================================== */

      if (
        !currentEntry &&
        !bullet
      ) {
        currentEntry = {
          ...createEmptyExperience(),

          jobTitle: line,
        };

        return;
      }

      if (!currentEntry) {
        currentEntry =
          createEmptyExperience();
      }

      /* =====================================
         Bullet Lines Are Descriptions
      ===================================== */

      if (bullet) {
        currentEntry.description =
          cleanText(
            [
              currentEntry.description,
              line,
            ]
              .filter(Boolean)
              .join(" ")
          );

        return;
      }

      /* =====================================
         Possible Company

         Only short, non-sentence lines
         are accepted as company names.
      ===================================== */

      const looksLikeCompany =
        !currentEntry.company &&
        line.length <= 80 &&
        !/[.!?]$/.test(
          line
        ) &&
        line
          .split(/\s+/)
          .length <= 10;

      if (
        looksLikeCompany
      ) {
        currentEntry.company =
          line;

        return;
      }

      /* =====================================
         Otherwise Description
      ===================================== */

      currentEntry.description =
        cleanText(
          [
            currentEntry.description,
            line,
          ]
            .filter(Boolean)
            .join(" ")
        );
    }
  );

  pushCurrent();

  return entries;
};

/* ========================================
   Projects
======================================== */

const looksLikeProjectTitle = (
  line
) => {
  if (
    !line ||
    line.length > 80
  ) {
    return false;
  }

  /*
   * Sentences are much more likely
   * to be project descriptions.
   */

  if (
    /[.!?]$/.test(
      line
    )
  ) {
    return false;
  }

  /*
   * Common action verbs indicate
   * description/bullet content.
   */

  if (
    /^(developed|implemented|designed|built|created|integrated|achieved|demonstrated|used|worked|participated|focused|gained|applied|automated|structured|improved|reduced|increased|handled|performed|utilized)\b/i.test(
      line
    )
  ) {
    return false;
  }

  const words =
    line
      .split(/\s+/)
      .filter(Boolean);

  return (
    words.length >= 1 &&
    words.length <= 10
  );
};

const parseProjects = (
  lines
) => {
  if (!lines.length) {
    return [];
  }

  const projects = [];

  let current =
    null;

  const pushCurrent =
    () => {
      if (
        current &&
        current.name
      ) {
        projects.push(
          current
        );
      }

      current =
        null;
    };

  lines.forEach(
    (rawLine) => {
      const bullet =
        isBulletLine(
          rawLine
        );

      const line =
        cleanLine(
          rawLine
        );

      if (!line) {
        return;
      }

      const url =
        extractUrls(
          line
        )[0] || "";

      const technologyMatch =
        line.match(
          /^(?:technologies|technology|tech stack|stack|tools)\s*:\s*(.+)$/i
        );

      /* =====================================
         Standalone Project URL

         A URL-only line belongs to the
         current project and must not be
         mistaken for a new project title.
      ===================================== */

      const isStandaloneUrl =
        Boolean(url) &&
        cleanText(line) ===
          cleanText(url);

      if (
        isStandaloneUrl &&
        current
      ) {
        if (
          /github\.com/i.test(
            url
          )
        ) {
          current.githubUrl ||=
            url;
        } else {
          current.projectUrl ||=
            url;
        }

        return;
      }

      /* =====================================
         Technologies
      ===================================== */

      if (
        technologyMatch &&
        current
      ) {
        current.technologies =
          uniqueStrings(
            technologyMatch[1]
              .split(
                /[,;|]/
              )
              .map(
                cleanText
              )
          );

        return;
      }

      /* =====================================
         Project Title

         Bullet lines must never become
         new project titles.
      ===================================== */

      if (
        !bullet &&
        looksLikeProjectTitle(
          line
        )
      ) {
        pushCurrent();

        current = {
          id: createId(),

          name: line,

          description: "",

          technologies: [],

          projectUrl: "",

          githubUrl: "",
        };

        if (url) {
          if (
            /github\.com/i.test(
              url
            )
          ) {
            current.githubUrl =
              url;
          } else {
            current.projectUrl =
              url;
          }
        }

        return;
      }

      /* =====================================
         Ignore Description Content
         Before First Project Title
      ===================================== */

      if (!current) {
        return;
      }

      /* =====================================
         Project URLs
      ===================================== */

      if (url) {
        if (
          /github\.com/i.test(
            url
          )
        ) {
          current.githubUrl ||=
            url;
        } else {
          current.projectUrl ||=
            url;
        }
      }

      /* =====================================
         Description
      ===================================== */

      current.description =
        cleanText(
          [
            current.description,
            line,
          ]
            .filter(Boolean)
            .join(" ")
        );
    }
  );

  pushCurrent();

  return projects;
};

/* ========================================
   Certifications
======================================== */

const parseCertificationLine = (
  rawLine
) => {
  const line =
    cleanLine(
      rawLine
    );

  if (!line) {
    return null;
  }

  const parts =
    line.split(
      /\s+(?:-|–|—)\s+(?:by\s+)?/i
    );

  let name =
    cleanText(
      parts[0]
    );

  let issuer =
    cleanText(
      parts
        .slice(1)
        .join(" ")
    );

  if (!issuer) {
    const byMatch =
      line.match(
        /^(.+?)\s+by\s+(.+)$/i
      );

    if (
      byMatch
    ) {
      name =
        cleanText(
          byMatch[1]
        );

      issuer =
        cleanText(
          byMatch[2]
        );
    }
  }

  return {
    id: createId(),

    name,

    issuer,

    issueDate: "",

    credentialUrl:
      extractUrls(
        line
      )[0] || "",
  };
};

const parseCertifications = (
  lines
) =>
  lines
    .map(
      parseCertificationLine
    )
    .filter(Boolean);

/* ========================================
   Languages
======================================== */

const parseLanguages = (
  lines
) => {
  const values =
    lines.flatMap(
      (line) =>
        cleanLine(
          line
        ).split(
          /[,;|•●▪◦]+/
        )
    );

  return uniqueStrings(
    values.map(
      cleanText
    )
  ).map(
    (name) => ({
      id: createId(),

      name,

      proficiency: "",
    })
  );
};

/* ========================================
   Import Coverage
======================================== */

const calculateConfidence = (
  parsedResume
) => {
  const checks = [
    {
      key:
        "personalInfo",

      label:
        "Personal details",

      detected:
        Boolean(
          parsedResume
            .personalInfo
            .firstName ||
            parsedResume
              .personalInfo
              .email ||
            parsedResume
              .personalInfo
              .phone
        ),
    },

    {
      key: "summary",

      label: "Summary",

      detected:
        Boolean(
          parsedResume.summary
        ),
    },

    {
      key: "experience",

      label:
        "Experience",

      detected:
        parsedResume
          .experience
          .length > 0,
    },

    {
      key: "education",

      label:
        "Education",

      detected:
        parsedResume
          .education
          .length > 0,
    },

    {
      key: "skills",

      label: "Skills",

      detected:
        parsedResume
          .skills
          .length > 0,
    },

    {
      key: "projects",

      label: "Projects",

      detected:
        parsedResume
          .projects
          .length > 0,
    },

    {
      key:
        "certifications",

      label:
        "Certifications",

      detected:
        parsedResume
          .certifications
          .length > 0,
    },

    {
      key: "languages",

      label:
        "Languages",

      detected:
        parsedResume
          .languages
          .length > 0,
    },
  ];

  /*
   * This percentage represents
   * imported section coverage.
   *
   * It is not ATS score and it is
   * not resume quality.
   */

  const weights = {
    personalInfo: 25,
    summary: 15,
    experience: 15,
    education: 15,
    skills: 15,
    projects: 5,
    certifications: 5,
    languages: 5,
  };

  const score =
    checks.reduce(
      (
        total,
        check
      ) =>
        total +
        (check.detected
          ? weights[
              check.key
            ]
          : 0),
      0
    );

  return {
    score,
    checks,
  };
};

/* ========================================
   Main Parser
======================================== */

export const parseResumeText = (
  rawText
) => {
  const text =
    String(
      rawText || ""
    ).trim();

  if (!text) {
    throw new Error(
      "There is no resume text to parse."
    );
  }

  const sections =
    splitIntoSections(
      text
    );

  const headerText =
    sections.header.join(
      "\n"
    );

  const detectedName =
    detectName(
      sections.header
    );

  const socialLinks =
    extractSocialLinks(
      headerText
    );

  const parsedResume = {
    personalInfo: {
      firstName:
        detectedName.firstName,

      lastName:
        detectedName.lastName,

      jobTitle:
        detectJobTitle(
          sections.header,
          detectedName
        ),

      email:
        findEmail(
          headerText
        ),

      phone:
        findPhone(
          headerText
        ),

      location: "",

      website:
        socialLinks.website,

      linkedin:
        socialLinks.linkedin,

      github:
        socialLinks.github,
    },

    summary:
      parseSummary(
        sections.summary
      ),

    experience:
      parseExperience(
        sections.experience
      ),

    education:
      parseEducation(
        sections.education
      ),

    skills:
      parseSkills(
        sections.skills
      ),

    projects:
      parseProjects(
        sections.projects
      ),

    certifications:
      parseCertifications(
        sections.certifications
      ),

    languages:
      parseLanguages(
        sections.languages
      ),
  };

  const confidence =
    calculateConfidence(
      parsedResume
    );

  return {
    resume:
      parsedResume,

    confidence,

    sections,
  };
};

export default parseResumeText;