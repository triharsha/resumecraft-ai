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

const VertexSectionHeading = ({
  children,
  accentColor,
  fontScale,
  index,
}) => {
  return (
    <div
      className="
        flex
        items-start
        gap-2
      "
    >
      <span
        className="
          shrink-0
          font-black
          leading-none
        "
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              5,
              fontScale
            ),
        }}
      >
        {String(index).padStart(
          2,
          "0"
        )}
      </span>

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
   Vertex Template
======================================== */

const VertexTemplate = ({
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
          grid-cols-[1.35fr_0.65fr]
        "
      >
        {/* Identity */}

        <div
          className="
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
                h-2
                w-2
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
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    4.9,
                    fontScale
                  ),
              }}
            >
              Professional Profile
            </span>
          </div>

          <h2
            className="
              font-black
              uppercase
              leading-[0.88]
              tracking-[-0.045em]
              text-zinc-950
            "
            style={{
              fontSize:
                scaledFontSize(
                  21,
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
                leading-[1.2]
              "
              style={{
                color:
                  accentColor,

                fontSize:
                  scaledFontSize(
                    7.7,
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

        {/* Contact Panel */}

        <div
          className="
            bg-zinc-950
            px-5
            py-6
          "
        >
          <p
            className="
              mb-3
              font-black
              uppercase
              leading-none
              tracking-[0.16em]
              text-white
            "
            style={{
              fontSize:
                scaledFontSize(
                  5.3,
                  fontScale
                ),
            }}
          >
            Contact
          </p>

          {hasContactInfo ? (
            <div
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-2.5
              "
            >
              {personalInfo.email && (
                <div>
                  <p
                    className="
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-zinc-500
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    Email
                  </p>

                  <p
                    className="
                      mt-0.5
                      break-all
                      font-semibold
                      leading-[1.25]
                      text-zinc-200
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
                </div>
              )}

              {personalInfo.phone && (
                <div>
                  <p
                    className="
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-zinc-500
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    Phone
                  </p>

                  <p
                    className="
                      mt-0.5
                      font-semibold
                      leading-[1.25]
                      text-zinc-200
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
                </div>
              )}

              {personalInfo.location && (
                <div>
                  <p
                    className="
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-zinc-500
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    Location
                  </p>

                  <p
                    className="
                      mt-0.5
                      font-semibold
                      leading-[1.25]
                      text-zinc-200
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
                </div>
              )}

              {personalInfo.website && (
                <div>
                  <p
                    className="
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-zinc-500
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    Website
                  </p>

                  <p
                    className="
                      mt-0.5
                      break-all
                      font-semibold
                      leading-[1.25]
                      text-zinc-200
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
                </div>
              )}

              {personalInfo.linkedin && (
                <div>
                  <p
                    className="
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-zinc-500
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    LinkedIn
                  </p>

                  <p
                    className="
                      mt-0.5
                      break-all
                      font-semibold
                      leading-[1.25]
                      text-zinc-200
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
                </div>
              )}

              {personalInfo.github && (
                <div>
                  <p
                    className="
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-zinc-500
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    GitHub
                  </p>

                  <p
                    className="
                      mt-0.5
                      break-all
                      font-semibold
                      leading-[1.25]
                      text-zinc-200
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
                </div>
              )}
            </div>
          ) : (
            <p
              className="
                leading-[1.4]
                text-zinc-500
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.2,
                    fontScale
                  ),
              }}
            >
              Add your contact
              information.
            </p>
          )}
        </div>
      </header>

      {/* Accent Bar */}

      <div
        className="h-1.5"
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      {/* =====================================
          Body
      ===================================== */}

      <div
        className="
          px-7
          pb-6
          pt-4
          sm:px-8
        "
      >
        {/* Summary */}

        {resume.summary && (
          <section
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
          >
            <VertexSectionHeading
              index={1}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </VertexSectionHeading>

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
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={sectionStyle}
          >
            <VertexSectionHeading
              index={2}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </VertexSectionHeading>

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
                    >
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
                              uppercase
                              leading-[1.2]
                              tracking-[-0.01em]
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
                                  5.8,
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
                              font-black
                              uppercase
                              leading-[1.25]
                              text-zinc-400
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
                            mt-1
                            leading-[1.4]
                            text-zinc-700
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6.1,
                                fontScale
                              ),
                          }}
                        />
                      )}

                      <div
                        className="
                          mt-2
                          h-px
                          bg-zinc-100
                        "
                      />
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
          <section
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={sectionStyle}
          >
            <VertexSectionHeading
              index={2}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Focus
            </VertexSectionHeading>

            <div
              className="
                border-l-2
                pl-3
              "
              style={{
                borderColor:
                  accentColor,
              }}
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
                Early-career profile
                focused on education,
                technical capability,
                projects, internships,
                and certifications.
              </p>
            </div>
          </section>
        )}

        {/* Projects */}

        {visibleProjects.length >
          0 && (
          <section
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={sectionStyle}
          >
            <VertexSectionHeading
              index={3}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Projects
            </VertexSectionHeading>

            <div className="space-y-2">
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
                            uppercase
                            leading-[1.2]
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
                          {project.name ||
                            "Project"}
                        </p>

                        {technologies.length >
                          0 && (
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
                                  5.3,
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
                                  5.9,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>

                      {(project.projectUrl ||
                        project.githubUrl) && (
                        <div
                          className="
                            flex
                            flex-col
                            items-end
                            gap-1
                          "
                        >
                          {project.projectUrl && (
                            <span
                              className="
                                border
                                border-zinc-200
                                px-1.5
                                py-1
                                font-black
                                uppercase
                                leading-none
                                text-zinc-500
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.5,
                                    fontScale
                                  ),
                              }}
                            >
                              Live
                            </span>
                          )}

                          {project.githubUrl && (
                            <span
                              className="
                                border
                                border-zinc-200
                                px-1.5
                                py-1
                                font-black
                                uppercase
                                leading-none
                                text-zinc-500
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.5,
                                    fontScale
                                  ),
                              }}
                            >
                              Code
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* Skills */}

        {skills.length > 0 && (
          <section
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={sectionStyle}
          >
            <VertexSectionHeading
              index={4}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Skills
            </VertexSectionHeading>

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
                      border
                      border-zinc-300
                      px-2
                      py-1
                      font-black
                      uppercase
                      leading-none
                      tracking-[0.04em]
                      text-zinc-700
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          5.2,
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
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={sectionStyle}
          >
            <VertexSectionHeading
              index={5}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </VertexSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-5
                gap-y-2
              "
            >
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
                          uppercase
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
                                5.4,
                                fontScale
                              ),
                          }}
                        >
                          {
                            education.institution
                          }

                          {education.location &&
                            ` · ${education.location}`}
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
                                5,
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
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* Additional */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={sectionStyle}
          >
            <VertexSectionHeading
              index={6}
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Additional
            </VertexSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-5
              "
            >
              {visibleCertifications.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-1.5
                      font-black
                      uppercase
                      tracking-[0.12em]
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
                                    5.1,
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
                </div>
              )}

              {visibleLanguages.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-1.5
                      font-black
                      uppercase
                      tracking-[0.12em]
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
                    Languages
                  </p>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-x-3
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
                                leading-[1.25]
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
                                      4.9,
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

        {/* Empty */}

        {!hasResumeContent && (
          <div
            className="
              mt-4
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
                    6.4,
                    fontScale
                  ),
              }}
            >
              Add your resume
              information to see your
              live Vertex preview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VertexTemplate;