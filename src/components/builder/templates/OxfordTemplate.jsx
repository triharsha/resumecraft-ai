import {
  getEmploymentTypeLabel,
} from "../../../utils/resume";

import {
  getFontScale,
  getResumeCustomization,
  getSpacingScale,
  scaledFontSize,
  scaledSpacing,
} from "./templateCustomization";

import ResumeDescription from "./ResumeDescription";

/* ========================================
   Date Formatter
======================================== */

const formatMonth = (value) => {
  if (!value) {
    return "";
  }

  const [year, month] =
    value.split("-");

  if (!year || !month) {
    return value;
  }

  const date = new Date(
    Number(year),
    Number(month) - 1
  );

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      year: "numeric",
    }
  ).format(date);
};

/* ========================================
   Language Labels
======================================== */

const languageProficiencyLabels = {
  "native-bilingual":
    "Native / Bilingual",
  fluent: "Fluent",
  professional:
    "Professional Working",
  intermediate: "Intermediate",
  basic: "Basic",
};

/* ========================================
   Section Heading
======================================== */

const OxfordSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        border-b
        border-zinc-300
        pb-1
      "
    >
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <h3
          className="
            font-serif
            font-bold
            uppercase
            leading-none
            tracking-[0.12em]
            text-zinc-950
          "
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",

            fontSize:
              scaledFontSize(
                6.5,
                fontScale
              ),
          }}
        >
          {children}
        </h3>

        <span
          className="
            h-[2px]
            w-10
            shrink-0
          "
          style={{
            backgroundColor:
              accentColor,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

/* ========================================
   Oxford Template
======================================== */

const OxfordTemplate = ({
  resume,
  contentRef,
}) => {
  const personalInfo =
    resume.personalInfo || {};

  const customization =
    getResumeCustomization(
      resume
    );

  const fontScale =
    getFontScale(
      customization.fontSize
    );

  const spacingScale =
    getSpacingScale(
      customization.spacing
    );

  const accentColor =
    customization.accentColor;

  const fullName = [
    personalInfo.firstName,
    personalInfo.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const isFresher =
    Boolean(resume.isFresher);

  /* ========================================
     Experience
  ======================================== */

  const experiences =
    Array.isArray(
      resume.experience
    )
      ? resume.experience
      : [];

  const visibleExperiences =
    experiences.filter(
      (experience) =>
        experience.jobTitle ||
        experience.company ||
        experience.description
    );

  /* ========================================
     Education
  ======================================== */

  const educations =
    Array.isArray(
      resume.education
    )
      ? resume.education
      : [];

  const visibleEducations =
    educations.filter(
      (education) =>
        education.institution ||
        education.degree ||
        education.fieldOfStudy ||
        education.description
    );

  /* ========================================
     Skills
  ======================================== */

  const skills =
    Array.isArray(
      resume.skills
    )
      ? resume.skills.filter(
          (skill) =>
            typeof skill ===
              "string" &&
            skill.trim()
        )
      : [];

  /* ========================================
     Projects
  ======================================== */

  const projects =
    Array.isArray(
      resume.projects
    )
      ? resume.projects
      : [];

  const visibleProjects =
    projects.filter(
      (project) =>
        project.name ||
        project.description ||
        (
          Array.isArray(
            project.technologies
          ) &&
          project.technologies
            .length > 0
        )
    );

  /* ========================================
     Certifications
  ======================================== */

  const certifications =
    Array.isArray(
      resume.certifications
    )
      ? resume.certifications
      : [];

  const visibleCertifications =
    certifications.filter(
      (certification) =>
        certification.name ||
        certification.issuer ||
        certification.issueDate
    );

  /* ========================================
     Languages
  ======================================== */

  const languages =
    Array.isArray(
      resume.languages
    )
      ? resume.languages
      : [];

  const visibleLanguages =
    languages.filter(
      (language) =>
        language.name
    );

  const sectionStyle = {
    marginTop:
      scaledSpacing(
        10,
        spacingScale
      ),
  };

  const hasContactInfo =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location ||
    personalInfo.website ||
    personalInfo.linkedin ||
    personalInfo.github;

  const hasResumeContent =
    resume.summary ||
    visibleExperiences.length >
      0 ||
    visibleEducations.length >
      0 ||
    skills.length > 0 ||
    visibleProjects.length > 0 ||
    visibleCertifications.length >
      0 ||
    visibleLanguages.length > 0 ||
    isFresher;

  return (
    <div
      ref={contentRef}
      className="
        absolute
        inset-0
        overflow-hidden
        bg-white
        text-zinc-800
      "
    >
      <div
        className="
          px-10
          pb-8
          pt-8
        "
      >
        {/* =====================================
            Academic Header
        ===================================== */}

        <header>
          <div
            className="
              flex
              items-start
              justify-between
              gap-8
            "
          >
            <div className="min-w-0 flex-1">
              <p
                className="
                  mb-1.5
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.22em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.8,
                      fontScale
                    ),
                }}
              >
                Curriculum Vitae
              </p>

              <h2
                className="
                  font-serif
                  font-bold
                  leading-[0.95]
                  tracking-[-0.025em]
                  text-zinc-950
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize:
                    scaledFontSize(
                      20,
                      fontScale
                    ),
                }}
              >
                {fullName ||
                  "Your Name"}
              </h2>

              {personalInfo.jobTitle && (
                <p
                  className="
                    mt-2
                    font-serif
                    leading-[1.25]
                    text-zinc-600
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",

                    fontSize:
                      scaledFontSize(
                        7,
                        fontScale
                      ),
                  }}
                >
                  {
                    personalInfo.jobTitle
                  }
                </p>
              )}
            </div>

            {hasContactInfo && (
              <div
                className="
                  w-[39%]
                  shrink-0
                  border-l
                  border-zinc-200
                  pl-4
                "
              >
                <p
                  className="
                    mb-1.5
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                  "
                  style={{
                    color:
                      accentColor,

                    fontSize:
                      scaledFontSize(
                        4.6,
                        fontScale
                      ),
                  }}
                >
                  Correspondence
                </p>

                <div className="space-y-0.5">
                  {personalInfo.email && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
                        text-zinc-600
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.email
                      }
                    </p>
                  )}

                  {personalInfo.phone && (
                    <p
                      className="
                        leading-[1.3]
                        text-zinc-600
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.phone
                      }
                    </p>
                  )}

                  {personalInfo.location && (
                    <p
                      className="
                        leading-[1.3]
                        text-zinc-600
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.location
                      }
                    </p>
                  )}

                  {personalInfo.website && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
                        text-zinc-600
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.website
                      }
                    </p>
                  )}

                  {personalInfo.linkedin && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
                        text-zinc-600
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.linkedin
                      }
                    </p>
                  )}

                  {personalInfo.github && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
                        text-zinc-600
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.github
                      }
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="
              mt-4
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                h-[3px]
                w-20
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div
              className="
                h-px
                flex-1
                bg-zinc-300
              "
            />
          </div>
        </header>

        {/* =====================================
            Academic Profile
        ===================================== */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </OxfordSectionHeading>

            <p
              className="
                mt-2.5
                whitespace-pre-line
                font-serif
                leading-[1.5]
                text-zinc-700
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  scaledFontSize(
                    6.1,
                    fontScale
                  ),
              }}
            >
              {resume.summary}
            </p>
          </section>
        )}

        {/* =====================================
            Education
        ===================================== */}

        {visibleEducations.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </OxfordSectionHeading>

            <div className="mt-2.5 space-y-2.5">
              {visibleEducations.map(
                (education) => {
                  const start =
                    formatMonth(
                      education.startDate
                    );

                  const end =
                    education.current
                      ? "Present"
                      : formatMonth(
                          education.endDate
                        );

                  const dateRange =
                    [
                      start,
                      end,
                    ]
                      .filter(Boolean)
                      .join(" – ");

                  const qualification =
                    [
                      education.degree,
                      education.fieldOfStudy,
                    ]
                      .filter(Boolean)
                      .join(", ");

                  return (
                    <article
                      key={
                        education.id
                      }
                      className="
                        grid
                        grid-cols-[22%_1fr]
                        gap-4
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-serif
                              italic
                              leading-[1.3]
                              text-zinc-500
                            "
                            style={{
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",

                              fontSize:
                                scaledFontSize(
                                  5.1,
                                  fontScale
                                ),
                            }}
                          >
                            {dateRange}
                          </p>
                        )}

                        {education.location && (
                          <p
                            className="
                              mt-0.5
                              leading-[1.3]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.8,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              education.location
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <h4
                          className="
                            font-serif
                            font-bold
                            leading-[1.25]
                            text-zinc-950
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",

                            fontSize:
                              scaledFontSize(
                                6.5,
                                fontScale
                              ),
                          }}
                        >
                          {qualification ||
                            "Qualification"}
                        </h4>

                        {education.institution && (
                          <p
                            className="
                              mt-0.5
                              font-semibold
                              leading-[1.3]
                            "
                            style={{
                              color:
                                accentColor,

                              fontSize:
                                scaledFontSize(
                                  5.4,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              education.institution
                            }
                          </p>
                        )}

                        {education.description && (
                          <p
                            className="
                              mt-1
                              whitespace-pre-line
                              leading-[1.4]
                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.4,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              education.description
                            }
                          </p>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Experience
        ===================================== */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Professional Experience
            </OxfordSectionHeading>

            <div className="mt-2.5 space-y-3">
              {visibleExperiences.map(
                (experience) => {
                  const start =
                    formatMonth(
                      experience.startDate
                    );

                  const end =
                    experience.current
                      ? "Present"
                      : formatMonth(
                          experience.endDate
                        );

                  const dateRange =
                    [
                      start,
                      end,
                    ]
                      .filter(Boolean)
                      .join(" – ");

                  const employmentType =
                    getEmploymentTypeLabel(
                      experience.employmentType ||
                        "full-time"
                    );

                  return (
                    <article
                      key={
                        experience.id
                      }
                      className="
                        grid
                        grid-cols-[22%_1fr]
                        gap-4
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-serif
                              italic
                              leading-[1.3]
                              text-zinc-500
                            "
                            style={{
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",

                              fontSize:
                                scaledFontSize(
                                  5.1,
                                  fontScale
                                ),
                            }}
                          >
                            {dateRange}
                          </p>
                        )}

                        {experience.location && (
                          <p
                            className="
                              mt-0.5
                              leading-[1.3]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.8,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              experience.location
                            }
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          border-l
                          border-zinc-200
                          pl-4
                        "
                      >
                        <h4
                          className="
                            font-serif
                            font-bold
                            leading-[1.2]
                            text-zinc-950
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",

                            fontSize:
                              scaledFontSize(
                                6.6,
                                fontScale
                              ),
                          }}
                        >
                          {experience.jobTitle ||
                            "Job Title"}
                        </h4>

                        <p
                          className="
                            mt-0.5
                            font-semibold
                            leading-[1.3]
                          "
                          style={{
                            color:
                              accentColor,

                            fontSize:
                              scaledFontSize(
                                5.4,
                                fontScale
                              ),
                          }}
                        >
                          {experience.company ||
                            "Organisation"}

                          {employmentType &&
                            ` · ${employmentType}`}
                        </p>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-1
                              leading-[1.4]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.7,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Fresher
        ===================================== */}

        {isFresher &&
          visibleExperiences.length ===
            0 && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Academic Objective
            </OxfordSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-[22%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-serif
                  italic
                  leading-[1.4]
                  text-zinc-400
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize:
                    scaledFontSize(
                      5.1,
                      fontScale
                    ),
                }}
              >
                Early Career
              </p>

              <p
                className="
                  border-l
                  border-zinc-200
                  pl-4
                  font-serif
                  leading-[1.5]
                  text-zinc-700
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize:
                    scaledFontSize(
                      5.9,
                      fontScale
                    ),
                }}
              >
                Seeking an opportunity
                to apply academic
                preparation, project
                experience, technical
                knowledge, and
                developing professional
                capabilities.
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Projects
        ===================================== */}

        {visibleProjects.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Selected Projects
            </OxfordSectionHeading>

            <div className="mt-2.5 space-y-2.5">
              {visibleProjects.map(
                (project) => {
                  const technologies =
                    Array.isArray(
                      project.technologies
                    )
                      ? project.technologies.filter(
                          Boolean
                        )
                      : [];

                  return (
                    <article
                      key={project.id}
                      className="
                        grid
                        grid-cols-[22%_1fr]
                        gap-4
                      "
                    >
                      <div>
                        <p
                          className="
                            font-semibold
                            uppercase
                            leading-[1.3]
                            tracking-[0.08em]
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.7,
                                fontScale
                              ),
                          }}
                        >
                          Project
                        </p>

                        {(project.projectUrl ||
                          project.githubUrl) && (
                          <p
                            className="
                              mt-1
                              leading-[1.3]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.7,
                                  fontScale
                                ),
                            }}
                          >
                            {project.projectUrl &&
                              "Live"}

                            {project.projectUrl &&
                              project.githubUrl &&
                              " · "}

                            {project.githubUrl &&
                              "Repository"}
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          border-l
                          border-zinc-200
                          pl-4
                        "
                      >
                        <h4
                          className="
                            font-serif
                            font-bold
                            leading-[1.25]
                            text-zinc-950
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",

                            fontSize:
                              scaledFontSize(
                                6.2,
                                fontScale
                              ),
                          }}
                        >
                          {project.name ||
                            "Project"}
                        </h4>

                        {technologies.length >
                          0 && (
                          <p
                            className="
                              mt-0.5
                              font-semibold
                              leading-[1.3]
                            "
                            style={{
                              color:
                                accentColor,

                              fontSize:
                                scaledFontSize(
                                  5,
                                  fontScale
                                ),
                            }}
                          >
                            {technologies.join(
                              " · "
                            )}
                          </p>
                        )}

                        {project.description && (
                          <ResumeDescription
                            description={
                              project.description
                            }
                            className="
                              mt-1
                              leading-[1.4]
                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.5,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Skills
        ===================================== */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Areas of Expertise
            </OxfordSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-3
                gap-x-6
                gap-y-1.5
              "
            >
              {skills.map(
                (
                  skill,
                  index
                ) => (
                  <div
                    key={`${skill}-${index}`}
                    className="
                      flex
                      items-start
                      gap-2
                    "
                  >
                    <span
                      className="
                        mt-[0.38em]
                        h-1
                        w-1
                        shrink-0
                      "
                      style={{
                        backgroundColor:
                          accentColor,
                      }}
                    />

                    <span
                      className="
                        font-serif
                        leading-[1.35]
                        text-zinc-700
                      "
                      style={{
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",

                        fontSize:
                          scaledFontSize(
                            5.5,
                            fontScale
                          ),
                      }}
                    >
                      {skill}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Certifications + Languages
        ===================================== */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <OxfordSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Additional Qualifications
            </OxfordSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-2
                gap-7
              "
            >
              {visibleCertifications.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-1.5
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-zinc-400
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.7,
                          fontScale
                        ),
                    }}
                  >
                    Certifications
                  </p>

                  <div className="space-y-1.5">
                    {visibleCertifications.map(
                      (
                        certification
                      ) => {
                        const issueDate =
                          formatMonth(
                            certification.issueDate
                          );

                        return (
                          <div
                            key={
                              certification.id
                            }
                          >
                            <p
                              className="
                                font-serif
                                font-bold
                                leading-[1.3]
                                text-zinc-800
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",

                                fontSize:
                                  scaledFontSize(
                                    5.5,
                                    fontScale
                                  ),
                              }}
                            >
                              {certification.name ||
                                "Certification"}
                            </p>

                            {(certification.issuer ||
                              issueDate) && (
                              <p
                                className="
                                  mt-0.5
                                  leading-[1.3]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.9,
                                      fontScale
                                    ),
                                }}
                              >
                                {[
                                  certification.issuer,
                                  issueDate,
                                ]
                                  .filter(
                                    Boolean
                                  )
                                  .join(
                                    " · "
                                  )}
                              </p>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {visibleLanguages.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-1.5
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-zinc-400
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.7,
                          fontScale
                        ),
                    }}
                  >
                    Languages
                  </p>

                  <div className="space-y-1.5">
                    {visibleLanguages.map(
                      (language) => {
                        const proficiency =
                          languageProficiencyLabels[
                            language
                              .proficiency
                          ];

                        return (
                          <div
                            key={
                              language.id ||
                              language.name
                            }
                            className="
                              flex
                              items-baseline
                              justify-between
                              gap-3
                            "
                          >
                            <p
                              className="
                                font-serif
                                font-bold
                                leading-[1.3]
                                text-zinc-800
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",

                                fontSize:
                                  scaledFontSize(
                                    5.4,
                                    fontScale
                                  ),
                              }}
                            >
                              {
                                language.name
                              }
                            </p>

                            {proficiency && (
                              <p
                                className="
                                  shrink-0
                                  font-serif
                                  italic
                                  leading-[1.3]
                                  text-zinc-400
                                "
                                style={{
                                  fontFamily:
                                    "Georgia, 'Times New Roman', serif",

                                  fontSize:
                                    scaledFontSize(
                                      4.8,
                                      fontScale
                                    ),
                                }}
                              >
                                {proficiency}
                              </p>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-8
              border-y
              border-zinc-300
              py-5
            "
          >
            <p
              className="
                font-serif
                italic
                leading-[1.5]
                text-zinc-500
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  scaledFontSize(
                    6,
                    fontScale
                  ),
              }}
            >
              Add your academic and
              professional information
              to begin your Oxford CV.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OxfordTemplate;