import {
  describe,
  expect,
  it,
} from "vitest";

import {
  parseResumeText,
} from "../resumeTextParser";

/* ========================================
   Basic Validation
======================================== */

describe("parseResumeText validation", () => {
  it("throws for empty text", () => {
    expect(() =>
      parseResumeText("")
    ).toThrow(
      "There is no resume text to parse."
    );
  });

  it("throws for whitespace-only text", () => {
    expect(() =>
      parseResumeText(
        "   \n   "
      )
    ).toThrow(
      "There is no resume text to parse."
    );
  });

  it("throws safely for null input", () => {
    expect(() =>
      parseResumeText(null)
    ).toThrow(
      "There is no resume text to parse."
    );
  });
});

/* ========================================
   Personal Information
======================================== */

describe("parseResumeText personal information", () => {
  it("detects name and job title", () => {
    const result =
      parseResumeText(`
Alex Morgan
Software Developer
alex@example.com

Summary
Developer building modern applications.
      `);

    expect(
      result.resume.personalInfo
        .firstName
    ).toBe("Alex");

    expect(
      result.resume.personalInfo
        .lastName
    ).toBe("Morgan");

    expect(
      result.resume.personalInfo
        .jobTitle
    ).toBe(
      "Software Developer"
    );
  });

  it("detects email", () => {
    const result =
      parseResumeText(`
Alex Morgan
Software Developer
alex@example.com
      `);

    expect(
      result.resume.personalInfo
        .email
    ).toBe(
      "alex@example.com"
    );
  });

  it("detects phone number", () => {
    const result =
      parseResumeText(`
Alex Morgan
Software Developer
+91 98765 43210
      `);

    expect(
      result.resume.personalInfo
        .phone
    ).toContain(
      "98765 43210"
    );
  });

  it("detects LinkedIn and GitHub URLs", () => {
    const result =
      parseResumeText(`
Alex Morgan
Software Developer
https://linkedin.com/in/alexmorgan
https://github.com/alexmorgan
      `);

    expect(
      result.resume.personalInfo
        .linkedin
    ).toBe(
      "https://linkedin.com/in/alexmorgan"
    );

    expect(
      result.resume.personalInfo
        .github
    ).toBe(
      "https://github.com/alexmorgan"
    );
  });

  it("detects a general website separately", () => {
    const result =
      parseResumeText(`
Alex Morgan
Software Developer
https://alexmorgan.dev
      `);

    expect(
      result.resume.personalInfo
        .website
    ).toBe(
      "https://alexmorgan.dev"
    );
  });
});

/* ========================================
   Section Aliases
======================================== */

describe("parseResumeText section aliases", () => {
  it("recognizes professional summary", () => {
    const result =
      parseResumeText(`
Alex Morgan

Professional Summary
Full stack developer.
      `);

    expect(
      result.resume.summary
    ).toBe(
      "Full stack developer."
    );
  });

  it("recognizes technical skills", () => {
    const result =
      parseResumeText(`
Alex Morgan

Technical Skills
Java, React, Spring Boot
      `);

    expect(
      result.resume.skills
    ).toEqual([
      "Java",
      "React",
      "Spring Boot",
    ]);
  });

  it("recognizes languages known", () => {
    const result =
      parseResumeText(`
Alex Morgan

Languages Known
English, Telugu, Hindi
      `);

    expect(
      result.resume.languages.map(
        (language) =>
          language.name
      )
    ).toEqual([
      "English",
      "Telugu",
      "Hindi",
    ]);
  });
});

/* ========================================
   Summary
======================================== */

describe("parseResumeText summary", () => {
  it("joins multiline summary content", () => {
    const result =
      parseResumeText(`
Alex Morgan

Summary
Software developer focused on
building reliable web applications.
      `);

    expect(
      result.resume.summary
    ).toBe(
      "Software developer focused on building reliable web applications."
    );
  });
});

/* ========================================
   Skills
======================================== */

describe("parseResumeText skills", () => {
  it("parses comma-separated skills", () => {
    const result =
      parseResumeText(`
Alex Morgan

Skills
Java, React, MySQL
      `);

    expect(
      result.resume.skills
    ).toEqual([
      "Java",
      "React",
      "MySQL",
    ]);
  });

  it("removes skill category labels", () => {
    const result =
      parseResumeText(`
Alex Morgan

Skills
Programming Languages: Java, JavaScript
Frameworks & Libraries: React, Spring Boot
      `);

    expect(
      result.resume.skills
    ).toEqual([
      "Java",
      "JavaScript",
      "React",
      "Spring Boot",
    ]);
  });

  it("removes duplicate skills case-insensitively", () => {
    const result =
      parseResumeText(`
Alex Morgan

Skills
React, Java, react, JAVA
      `);

    expect(
      result.resume.skills
    ).toEqual([
      "React",
      "Java",
    ]);
  });
});

/* ========================================
   Experience
======================================== */

describe("parseResumeText experience", () => {
  it("parses experience with date range", () => {
    const result =
      parseResumeText(`
Alex Morgan

Experience
Software Developer at Acme 2022 - 2024
• Built scalable applications.
      `);

    expect(
      result.resume.experience
    ).toHaveLength(1);

    const experience =
      result.resume
        .experience[0];

    expect(
      experience.jobTitle
    ).toBe(
      "Software Developer"
    );

    expect(
      experience.company
    ).toBe("Acme");

    expect(
      experience.startDate
    ).toBe("2022");

    expect(
      experience.endDate
    ).toBe("2024");

    expect(
      experience.current
    ).toBe(false);

    expect(
      experience.description
    ).toContain(
      "Built scalable applications."
    );
  });

  it("recognizes present employment", () => {
    const result =
      parseResumeText(`
Alex Morgan

Experience
Software Developer at Acme 2023 - Present
• Building web applications.
      `);

    const experience =
      result.resume
        .experience[0];

    expect(
      experience.startDate
    ).toBe("2023");

    expect(
      experience.endDate
    ).toBe("");

    expect(
      experience.current
    ).toBe(true);
  });

  it("supports internship section alias", () => {
    const result =
      parseResumeText(`
Alex Morgan

Internships
Software Intern at Acme 2024 - Present
• Built internal tools.
      `);

    expect(
      result.resume.experience
    ).toHaveLength(1);
  });
});

/* ========================================
   Education
======================================== */

describe("parseResumeText education", () => {
  it("detects degree information", () => {
    const result =
      parseResumeText(`
Alex Morgan

Education
B.Tech (Computer Science) 2020 - 2024
Example University
      `);

    expect(
      result.resume.education
    ).toHaveLength(1);

    const education =
      result.resume
        .education[0];

    expect(
      education.degree
    ).toBe("B.Tech");

    expect(
      education.fieldOfStudy
    ).toBe(
      "Computer Science"
    );

    expect(
      education.institution
    ).toBe(
      "Example University"
    );

    expect(
      education.startDate
    ).toBe("2020");

    expect(
      education.endDate
    ).toBe("2024");
  });
});

/* ========================================
   Projects
======================================== */

describe("parseResumeText projects", () => {
  it("parses project title and bullet description", () => {
    const result =
      parseResumeText(`
Alex Morgan

Projects
ResumeCraft AI
• Built an AI-assisted resume builder.
      `);

    expect(
      result.resume.projects
    ).toHaveLength(1);

    expect(
      result.resume.projects[0]
        .name
    ).toBe(
      "ResumeCraft AI"
    );

    expect(
      result.resume.projects[0]
        .description
    ).toContain(
      "Built an AI-assisted resume builder."
    );
  });

  it("parses project technologies", () => {
    const result =
      parseResumeText(`
Alex Morgan

Projects
ResumeCraft AI
Technologies: React, Zustand, Tailwind CSS
      `);

    expect(
      result.resume.projects[0]
        .technologies
    ).toEqual([
      "React",
      "Zustand",
      "Tailwind CSS",
    ]);
  });

  it("detects GitHub project URLs", () => {
    const result =
      parseResumeText(`
Alex Morgan

Projects
ResumeCraft AI
https://github.com/alex/resumecraft
      `);

    expect(
      result.resume.projects[0]
        .githubUrl
    ).toBe(
      "https://github.com/alex/resumecraft"
    );
  });
});

/* ========================================
   Certifications
======================================== */

describe("parseResumeText certifications", () => {
  it("parses certification and issuer separated by dash", () => {
    const result =
      parseResumeText(`
Alex Morgan

Certifications
Java Developer - Oracle
      `);

    expect(
      result.resume.certifications
    ).toHaveLength(1);

    expect(
      result.resume
        .certifications[0].name
    ).toBe(
      "Java Developer"
    );

    expect(
      result.resume
        .certifications[0].issuer
    ).toBe("Oracle");
  });

  it("parses certification issuer using by", () => {
    const result =
      parseResumeText(`
Alex Morgan

Certifications
Cloud Fundamentals by Microsoft
      `);

    expect(
      result.resume
        .certifications[0].name
    ).toBe(
      "Cloud Fundamentals"
    );

    expect(
      result.resume
        .certifications[0].issuer
    ).toBe("Microsoft");
  });
});

/* ========================================
   Languages
======================================== */

describe("parseResumeText languages", () => {
  it("parses multiple languages", () => {
    const result =
      parseResumeText(`
Alex Morgan

Languages
English, Telugu, Hindi
      `);

    expect(
      result.resume.languages.map(
        (language) =>
          language.name
      )
    ).toEqual([
      "English",
      "Telugu",
      "Hindi",
    ]);
  });

  it("creates IDs for imported languages", () => {
    const result =
      parseResumeText(`
Alex Morgan

Languages
English, Telugu
      `);

    result.resume.languages.forEach(
      (language) => {
        expect(
          language.id
        ).toBeTruthy();
      }
    );
  });
});

/* ========================================
   Confidence
======================================== */

describe("parseResumeText confidence", () => {
  it("returns confidence metadata", () => {
    const result =
      parseResumeText(`
Alex Morgan
alex@example.com

Summary
Software developer.

Skills
Java, React
      `);

    expect(
      result.confidence
    ).toBeDefined();

    expect(
      result.confidence.checks
    ).toHaveLength(8);

    expect(
      result.confidence.score
    ).toBeGreaterThan(0);
  });

  it("uses weighted section coverage", () => {
    const result =
      parseResumeText(`
Alex Morgan
alex@example.com

Summary
Software developer.

Skills
Java, React
      `);

    /*
     * Personal details = 25
     * Summary = 15
     * Skills = 15
     */

    expect(
      result.confidence.score
    ).toBe(55);
  });

  it("can reach full coverage when all supported sections are detected", () => {
    const result =
      parseResumeText(`
Alex Morgan
Software Developer
alex@example.com

Summary
Full stack developer.

Experience
Developer at Acme 2022 - 2024
• Built applications.

Education
B.Tech (Computer Science) 2018 - 2022
Example University

Skills
Java, React

Projects
ResumeCraft
• Built resume software.

Certifications
Java Developer - Oracle

Languages
English
      `);

    expect(
      result.confidence.score
    ).toBe(100);
  });
});

/* ========================================
   Return Structure
======================================== */

describe("parseResumeText result structure", () => {
  it("returns parsed resume, confidence and sections", () => {
    const result =
      parseResumeText(`
Alex Morgan

Summary
Software developer.
      `);

    expect(result).toHaveProperty(
      "resume"
    );

    expect(result).toHaveProperty(
      "confidence"
    );

    expect(result).toHaveProperty(
      "sections"
    );
  });
});