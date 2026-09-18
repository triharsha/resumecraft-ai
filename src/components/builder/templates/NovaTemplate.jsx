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

  fluent:
    "Fluent",

  professional:
    "Professional Working",

  intermediate:
    "Intermediate",

  basic:
    "Basic",
};

/* ========================================
   Nova Section Heading
======================================== */

const NovaSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        mb-2

        flex
        items-center
        gap-2
      "
    >
      <span
        className="
          h-1.5
          w-1.5
          shrink-0
          rounded-full
        "
        style={{
          backgroundColor:
            accentColor,
        }}
      />

      <h3
        className="
          shrink-0

          font-black
          uppercase
          leading-none
          tracking-[0.16em]

          text-zinc-950
        "
        style={{
          fontSize:
            scaledFontSize(
              7.2,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <span
        className="
          h-px
          flex-1
          bg-zinc-200
        "
      />
    </div>
  );
};

/* ========================================
   Nova Meta Item
======================================== */

const NovaMetaItem = ({
  label,
  value,
  fontScale,
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <p
        className="
          font-black
          uppercase
          leading-none
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
        {label}
      </p>

      <p
        className="
          mt-1
          break-words
          font-semibold
          leading-[1.25]
          text-zinc-700
        "
        style={{
          fontSize:
            scaledFontSize(
              5.8,
              fontScale
            ),
        }}
      >
        {value}
      </p>
    </div>
  );
};

/* ========================================
   Nova Template
======================================== */

const NovaTemplate = ({
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
        11,
        spacingScale
      ),
  };

  const hasContactInformation =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location ||
    personalInfo.website ||
    personalInfo.linkedin ||
    personalInfo.github;

  const hasSidebarContent =
    skills.length > 0 ||
    visibleEducations.length > 0 ||
    visibleCertifications.length >
      0 ||
    visibleLanguages.length > 0;

  const hasMainContent =
    resume.summary ||
    visibleExperiences.length > 0 ||
    visibleProjects.length > 0 ||
    (
      isFresher &&
      visibleExperiences.length ===
        0
    );

  const hasResumeContent =
    hasMainContent ||
    hasSidebarContent;

  return (
    <div
      ref={contentRef}
      className="
        absolute
        inset-0

        overflow-hidden

        bg-white

        text-zinc-900
      "
    >
      {/* =====================================
          Accent Rail
      ===================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          top-0

          w-1.5
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      {/* =====================================
          Header
      ===================================== */}

      <header
        className="
          relative

          px-7
          pb-4
          pt-6

          sm:px-8
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-6
          "
        >
          <div
            className="
              min-w-0
              flex-1
            "
          >
            <div
              className="
                mb-2

                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-px
                  w-7
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <span
                className="
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.2em]
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
                Resume
              </span>
            </div>

            <h2
              className="
                font-black
                leading-[0.92]
                tracking-[-0.055em]

                text-zinc-950
              "
              style={{
                fontSize:
                  scaledFontSize(
                    23,
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

                  font-bold
                  leading-tight

                  text-zinc-500
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      8.2,
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

          {hasContactInformation && (
            <div
              className="
                w-[37%]
                shrink-0

                border-l
                border-zinc-200

                pl-4
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-3
                  gap-y-2.5
                "
              >
                <NovaMetaItem
                  label="Email"
                  value={
                    personalInfo.email
                  }
                  fontScale={
                    fontScale
                  }
                />

                <NovaMetaItem
                  label="Phone"
                  value={
                    personalInfo.phone
                  }
                  fontScale={
                    fontScale
                  }
                />

                <NovaMetaItem
                  label="Location"
                  value={
                    personalInfo.location
                  }
                  fontScale={
                    fontScale
                  }
                />

                <NovaMetaItem
                  label="Website"
                  value={
                    personalInfo.website
                  }
                  fontScale={
                    fontScale
                  }
                />

                <NovaMetaItem
                  label="LinkedIn"
                  value={
                    personalInfo.linkedin
                  }
                  fontScale={
                    fontScale
                  }
                />

                <NovaMetaItem
                  label="GitHub"
                  value={
                    personalInfo.github
                  }
                  fontScale={
                    fontScale
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div
          className="
            mt-4
            h-px
            w-full
            bg-zinc-200
          "
        >
          <div
            className="
              h-px
              w-[28%]
            "
            style={{
              backgroundColor:
                accentColor,
            }}
          />
        </div>
      </header>

      {/* =====================================
          Resume Body
      ===================================== */}

      <div
        className="
          grid
          grid-cols-[31%_1fr]

          gap-5

          px-7
          pb-6

          sm:px-8
        "
      >
        {/* =================================
            Left Column
        ================================= */}

        <aside
          className="
            min-w-0

            border-r
            border-zinc-200

            pr-5
          "
        >
          {/* Skills */}

          {skills.length > 0 && (
            <section>
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Skills
              </NovaSectionHeading>

              <div
                className="
                  flex
                  flex-wrap
                  gap-1.5
                "
              >
                {skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <span
                      key={`${skill}-${index}`}
                      className="
                        rounded-md

                        border
                        border-zinc-200

                        bg-zinc-50

                        px-1.5
                        py-1

                        font-bold
                        leading-none

                        text-zinc-700
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5.7,
                            fontScale
                          ),
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </section>
          )}

          {/* Education */}

          {visibleEducations.length >
            0 && (
            <section
              style={
                skills.length > 0
                  ? sectionStyle
                  : undefined
              }
            >
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Education
              </NovaSectionHeading>

              <div className="space-y-2.5">
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
                        .join(" · ");

                    return (
                      <div
                        key={
                          education.id
                        }
                      >
                        <p
                          className="
                            font-black
                            leading-[1.25]

                            text-zinc-950
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6.5,
                                fontScale
                              ),
                          }}
                        >
                          {qualification ||
                            "Qualification"}
                        </p>

                        {education.institution && (
                          <p
                            className="
                              mt-0.5

                              font-semibold
                              leading-[1.3]

                              text-zinc-500
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.7,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              education.institution
                            }
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
                                  5.3,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              education.location
                            }
                          </p>
                        )}

                        {dateRange && (
                          <p
                            className="
                              mt-1

                              font-bold
                              leading-none
                            "
                            style={{
                              color:
                                accentColor,

                              fontSize:
                                scaledFontSize(
                                  5.2,
                                  fontScale
                                ),
                            }}
                          >
                            {dateRange}
                          </p>
                        )}

                        {education.description && (
                          <p
                            className="
                              mt-1

                              whitespace-pre-line

                              leading-[1.35]

                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.6,
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
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Certifications */}

          {visibleCertifications.length >
            0 && (
            <section
              style={
                skills.length > 0 ||
                visibleEducations.length >
                  0
                  ? sectionStyle
                  : undefined
              }
            >
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Certifications
              </NovaSectionHeading>

              <div className="space-y-2">
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
                            font-black
                            leading-[1.25]

                            text-zinc-900
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6,
                                fontScale
                              ),
                          }}
                        >
                          {certification.name ||
                            "Certification"}
                        </p>

                        {certification.issuer && (
                          <p
                            className="
                              mt-0.5

                              leading-[1.3]

                              text-zinc-500
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.5,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              certification.issuer
                            }
                          </p>
                        )}

                        {issueDate && (
                          <p
                            className="
                              mt-0.5

                              font-bold
                            "
                            style={{
                              color:
                                accentColor,

                              fontSize:
                                scaledFontSize(
                                  5.1,
                                  fontScale
                                ),
                            }}
                          >
                            {issueDate}
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Languages */}

          {visibleLanguages.length >
            0 && (
            <section
              style={
                skills.length > 0 ||
                visibleEducations.length >
                  0 ||
                visibleCertifications.length >
                  0
                  ? sectionStyle
                  : undefined
              }
            >
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Languages
              </NovaSectionHeading>

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
                      >
                        <p
                          className="
                            font-black
                            leading-[1.25]

                            text-zinc-800
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.9,
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
                              mt-0.5

                              leading-[1.25]

                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.2,
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
            </section>
          )}
        </aside>

        {/* =================================
            Main Column
        ================================= */}

        <main className="min-w-0">
          {/* Summary */}

          {resume.summary && (
            <section>
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Profile
              </NovaSectionHeading>

              <p
                className="
                  whitespace-pre-line

                  leading-[1.45]

                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6.5,
                      fontScale
                    ),
                }}
              >
                {resume.summary}
              </p>
            </section>
          )}

          {/* Experience */}

          {visibleExperiences.length >
            0 && (
            <section
              style={
                resume.summary
                  ? sectionStyle
                  : undefined
              }
            >
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Experience
              </NovaSectionHeading>

              <div className="space-y-3">
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
                      <div
                        key={
                          experience.id
                        }
                        className="
                          relative

                          pl-3
                        "
                      >
                        <span
                          className="
                            absolute
                            bottom-0
                            left-0
                            top-0

                            w-px
                          "
                          style={{
                            backgroundColor:
                              `${accentColor}55`,
                          }}
                          aria-hidden="true"
                        />

                        <span
                          className="
                            absolute
                            left-[-2px]
                            top-1

                            h-[5px]
                            w-[5px]

                            rounded-full
                          "
                          style={{
                            backgroundColor:
                              accentColor,
                          }}
                          aria-hidden="true"
                        />

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                font-black
                                leading-[1.25]

                                text-zinc-950
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    7.1,
                                    fontScale
                                  ),
                              }}
                            >
                              {experience.jobTitle ||
                                "Job Title"}
                            </p>

                            <p
                              className="
                                mt-0.5

                                font-semibold
                                leading-[1.3]

                                text-zinc-500
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    5.9,
                                    fontScale
                                  ),
                              }}
                            >
                              {experience.company ||
                                "Organisation"}

                              {employmentType &&
                                ` · ${employmentType}`}

                              {experience.location &&
                                ` · ${experience.location}`}
                            </p>
                          </div>

                          {dateRange && (
                            <p
                              className="
                                shrink-0

                                rounded-full

                                bg-zinc-100

                                px-2
                                py-1

                                text-right
                                font-bold
                                leading-none

                                text-zinc-500
                              "
                              style={{
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
                        </div>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-1.5
                              leading-[1.4]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.2,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Fresher Profile */}

          {isFresher &&
            visibleExperiences.length ===
              0 && (
              <section
                style={
                  resume.summary
                    ? sectionStyle
                    : undefined
                }
              >
                <NovaSectionHeading
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Focus
                </NovaSectionHeading>

                <div
                  className="
                    rounded-lg

                    border
                    border-zinc-200

                    bg-zinc-50

                    p-2.5
                  "
                >
                  <p
                    className="
                      leading-[1.4]

                      text-zinc-600
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          6.1,
                          fontScale
                        ),
                    }}
                  >
                    Early-career
                    candidate with
                    education, projects,
                    technical skills, and
                    certifications
                    positioned as the
                    primary evidence of
                    capability.
                  </p>
                </div>
              </section>
            )}

          {/* Projects */}

          {visibleProjects.length >
            0 && (
            <section
              style={
                resume.summary ||
                visibleExperiences.length >
                  0 ||
                (
                  isFresher &&
                  visibleExperiences.length ===
                    0
                )
                  ? sectionStyle
                  : undefined
              }
            >
              <NovaSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Selected Projects
              </NovaSectionHeading>

              <div className="space-y-2.5">
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
                      <div
                        key={
                          project.id
                        }
                        className="
                          rounded-lg

                          border
                          border-zinc-200

                          p-2.5
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >
                          <p
                            className="
                              min-w-0

                              font-black
                              leading-[1.25]

                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.8,
                                  fontScale
                                ),
                            }}
                          >
                            {project.name ||
                              "Project"}
                          </p>

                          {(project.projectUrl ||
                            project.githubUrl) && (
                            <p
                              className="
                                shrink-0

                                font-bold
                                leading-none
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
                              {project.projectUrl &&
                                "Live"}

                              {project.projectUrl &&
                                project.githubUrl &&
                                " · "}

                              {project.githubUrl &&
                                "GitHub"}
                            </p>
                          )}
                        </div>

                        {technologies.length >
                          0 && (
                          <p
                            className="
                              mt-1

                              font-bold
                              leading-[1.3]

                              text-zinc-500
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.5,
                                  fontScale
                                ),
                            }}
                          >
                            {technologies.join(
                              " / "
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
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* =====================================
          Empty State
      ===================================== */}

      {!hasResumeContent && (
        <div
          className="
            mx-8
            mt-2

            rounded-xl

            border
            border-dashed
            border-zinc-200

            p-4

            text-center
          "
        >
          <p
            className="
              leading-[1.4]
              text-zinc-400
            "
            style={{
              fontSize:
                scaledFontSize(
                  6.5,
                  fontScale
                ),
            }}
          >
            Add your resume
            information to see your
            live Nova preview.
          </p>
        </div>
      )}
    </div>
  );
};

export default NovaTemplate;