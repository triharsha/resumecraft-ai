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
   Section Heading
======================================== */

const MetroSectionHeading = ({
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
          h-2
          w-2
          shrink-0
        "
        style={{
          backgroundColor:
            accentColor,
        }}
      />

      <h3
        className="
          font-black
          uppercase
          leading-none
          tracking-[0.15em]
          text-zinc-950
        "
        style={{
          fontSize:
            scaledFontSize(
              7,
              fontScale
            ),
        }}
      >
        {children}
      </h3>
    </div>
  );
};

/* ========================================
   Metro Template
======================================== */

const MetroTemplate = ({
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
        text-zinc-900
      "
    >
      {/* =====================================
          Header
      ===================================== */}

      <header
        className="
          grid
          grid-cols-[42%_1fr]
        "
      >
        {/* Name Block */}

        <div
          className="
            bg-zinc-950
            px-7
            py-6
            sm:px-8
          "
        >
          <div
            className="
              mb-3
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-px
                w-6
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
                tracking-[0.2em]
              "
              style={{
                color:
                  accentColor,

                fontSize:
                  scaledFontSize(
                    4.8,
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
              leading-[0.9]
              tracking-[-0.05em]
              text-white
            "
            style={{
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
                font-bold
                leading-[1.25]
                text-zinc-300
              "
              style={{
                fontSize:
                  scaledFontSize(
                    7.3,
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

        {/* Intro Block */}

        <div
          className="
            flex
            flex-col
            justify-center
            px-6
            py-6
          "
        >
          <p
            className="
              font-black
              uppercase
              leading-none
              tracking-[0.16em]
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
            Professional Snapshot
          </p>

          {resume.summary ? (
            <p
              className="
                mt-2
                line-clamp-4
                whitespace-pre-line
                leading-[1.45]
                text-zinc-700
              "
              style={{
                fontSize:
                  scaledFontSize(
                    6.2,
                    fontScale
                  ),
              }}
            >
              {resume.summary}
            </p>
          ) : (
            <p
              className="
                mt-2
                leading-[1.4]
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    6,
                    fontScale
                  ),
              }}
            >
              Add a professional
              summary to introduce your
              experience and strengths.
            </p>
          )}
        </div>
      </header>

      {/* =====================================
          Contact Ribbon
      ===================================== */}

      {hasContactInfo && (
        <div
          className="
            grid
            grid-cols-3
            gap-x-4
            gap-y-1

            border-b
            border-zinc-200

            bg-zinc-50

            px-7
            py-2.5

            sm:px-8
          "
        >
          {personalInfo.email && (
            <p
              className="
                break-all
                font-semibold
                leading-[1.25]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              <span
                className="
                  mr-1
                  font-black
                  uppercase
                  text-zinc-400
                "
              >
                E
              </span>

              {personalInfo.email}
            </p>
          )}

          {personalInfo.phone && (
            <p
              className="
                font-semibold
                leading-[1.25]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              <span
                className="
                  mr-1
                  font-black
                  uppercase
                  text-zinc-400
                "
              >
                P
              </span>

              {personalInfo.phone}
            </p>
          )}

          {personalInfo.location && (
            <p
              className="
                font-semibold
                leading-[1.25]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              <span
                className="
                  mr-1
                  font-black
                  uppercase
                  text-zinc-400
                "
              >
                L
              </span>

              {personalInfo.location}
            </p>
          )}

          {personalInfo.website && (
            <p
              className="
                break-all
                font-semibold
                leading-[1.25]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              <span
                className="
                  mr-1
                  font-black
                  uppercase
                  text-zinc-400
                "
              >
                W
              </span>

              {personalInfo.website}
            </p>
          )}

          {personalInfo.linkedin && (
            <p
              className="
                break-all
                font-semibold
                leading-[1.25]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              <span
                className="
                  mr-1
                  font-black
                  uppercase
                  text-zinc-400
                "
              >
                IN
              </span>

              {personalInfo.linkedin}
            </p>
          )}

          {personalInfo.github && (
            <p
              className="
                break-all
                font-semibold
                leading-[1.25]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              <span
                className="
                  mr-1
                  font-black
                  uppercase
                  text-zinc-400
                "
              >
                GH
              </span>

              {personalInfo.github}
            </p>
          )}
        </div>
      )}

      {/* =====================================
          Main Grid
      ===================================== */}

      <div
        className="
          grid
          grid-cols-[34%_1fr]
          gap-5

          px-7
          pb-6
          pt-4

          sm:px-8
        "
      >
        {/* =================================
            Left Modules
        ================================= */}

        <aside className="min-w-0">
          {/* Skills */}

          {skills.length > 0 && (
            <section>
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Skills
              </MetroSectionHeading>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-1
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
                        bg-zinc-100
                        px-2
                        py-1.5
                      "
                    >
                      <p
                        className="
                          font-bold
                          leading-[1.2]
                          text-zinc-700
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              5.4,
                              fontScale
                            ),
                        }}
                      >
                        {skill}
                      </p>
                    </div>
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
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Education
              </MetroSectionHeading>

              <div className="space-y-2">
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
                        className="
                          border-l-2
                          pl-2.5
                        "
                        style={{
                          borderColor:
                            accentColor,
                        }}
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
                                6,
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
                                  5.3,
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
                                  5,
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
                            "
                            style={{
                              color:
                                accentColor,

                              fontSize:
                                scaledFontSize(
                                  4.9,
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
                                  5.2,
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
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Credentials
              </MetroSectionHeading>

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
                            font-black
                            leading-[1.25]
                            text-zinc-800
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.7,
                                fontScale
                              ),
                          }}
                        >
                          {certification.name ||
                            "Certification"}
                        </p>

                        <p
                          className="
                            mt-0.5
                            leading-[1.3]
                            text-zinc-500
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5,
                                fontScale
                              ),
                          }}
                        >
                          {[
                            certification.issuer,
                            issueDate,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
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
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Languages
              </MetroSectionHeading>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-2
                  gap-y-1.5
                "
              >
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
                            leading-[1.2]
                            text-zinc-800
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
            </section>
          )}
        </aside>

        {/* =================================
            Right Modules
        ================================= */}

        <main className="min-w-0">
          {/* Experience */}

          {visibleExperiences.length >
            0 && (
            <section>
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Experience
              </MetroSectionHeading>

              <div className="space-y-2.5">
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
                          grid
                          grid-cols-[1fr_auto]
                          gap-3

                          border-b
                          border-zinc-100

                          pb-2
                        "
                      >
                        <div className="min-w-0">
                          <p
                            className="
                              font-black
                              leading-[1.2]
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
                            {experience.jobTitle ||
                              "Job Title"}
                          </p>

                          <p
                            className="
                              mt-0.5
                              font-bold
                              leading-[1.3]
                            "
                            style={{
                              color:
                                accentColor,

                              fontSize:
                                scaledFontSize(
                                  5.6,
                                  fontScale
                                ),
                            }}
                          >
                            {experience.company ||
                              "Organisation"}

                            {employmentType &&
                              ` · ${employmentType}`}
                          </p>

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
                                    5,
                                    fontScale
                                  ),
                              }}
                            >
                              {
                                experience.location
                              }
                            </p>
                          )}

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
                                    5.9,
                                    fontScale
                                  ),
                              }}
                            />
                          )}
                        </div>

                        {dateRange && (
                          <p
                            className="
                              shrink-0
                              bg-zinc-100
                              px-2
                              py-1
                              font-black
                              leading-none
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
                            {dateRange}
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Fresher */}

          {isFresher &&
            visibleExperiences.length ===
              0 && (
            <section>
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Career Focus
              </MetroSectionHeading>

              <div
                className="
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
                        6,
                        fontScale
                      ),
                  }}
                >
                  Early-career profile
                  highlighting education,
                  practical projects,
                  technical strengths,
                  internships, and
                  certifications.
                </p>
              </div>
            </section>
          )}

          {/* Projects */}

          {visibleProjects.length >
            0 && (
            <section
              style={
                visibleExperiences.length >
                  0 ||
                isFresher
                  ? sectionStyle
                  : undefined
              }
            >
              <MetroSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Projects
              </MetroSectionHeading>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                "
              >
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
                          border
                          border-zinc-200
                          p-2.5
                        "
                      >
                        <div
                          className="
                            mb-1
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >
                          <p
                            className="
                              font-black
                              leading-[1.2]
                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.1,
                                  fontScale
                                ),
                            }}
                          >
                            {project.name ||
                              "Project"}
                          </p>

                          {(project.projectUrl ||
                            project.githubUrl) && (
                            <span
                              className="
                                shrink-0
                                font-black
                                uppercase
                              "
                              style={{
                                color:
                                  accentColor,

                                fontSize:
                                  scaledFontSize(
                                    4.4,
                                    fontScale
                                  ),
                              }}
                            >
                              {project.projectUrl &&
                                "Live"}

                              {project.projectUrl &&
                                project.githubUrl &&
                                " / "}

                              {project.githubUrl &&
                                "Code"}
                            </span>
                          )}
                        </div>

                        {technologies.length >
                          0 && (
                          <p
                            className="
                              font-bold
                              leading-[1.3]
                              text-zinc-500
                            "
                            style={{
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
                              leading-[1.35]
                              text-zinc-700
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
                  6.3,
                  fontScale
                ),
            }}
          >
            Add your resume
            information to see your
            live Metro preview.
          </p>
        </div>
      )}
    </div>
  );
};

export default MetroTemplate;