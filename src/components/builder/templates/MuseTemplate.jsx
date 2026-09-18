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

const MuseSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[auto_1fr]
        items-center
        gap-3
      "
    >
      <h3
        className="
          font-serif
          italic
          leading-none
          text-zinc-950
        "
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",
          fontSize:
            scaledFontSize(
              7.2,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <div className="flex items-center">
        <span
          className="
            h-[3px]
            w-8
            shrink-0
          "
          style={{
            backgroundColor:
              accentColor,
          }}
        />

        <span className="h-px flex-1 bg-zinc-200" />
      </div>
    </div>
  );
};

/* ========================================
   Muse Template
======================================== */

const MuseTemplate = ({
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
        text-zinc-800
      "
    >
      {/* =====================================
          Decorative Composition
      ===================================== */}

      <div
        className="
          absolute
          right-0
          top-0
          h-32
          w-32
          opacity-[0.08]
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <div
        className="
          absolute
          right-20
          top-20
          h-14
          w-14
          rounded-full
          border
          opacity-20
        "
        style={{
          borderColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <div
        className="
          absolute
          right-10
          top-32
          h-2
          w-2
          rotate-45
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <div
        className="
          relative
          px-10
          pb-8
          pt-9
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <header
          className="
            grid
            grid-cols-[1fr_32%]
            gap-8
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-3
                flex
                items-center
                gap-3
              "
            >
              <p
                className="
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.4,
                      fontScale
                    ),
                }}
              >
                Portfolio Résumé
              </p>

              <span
                className="
                  h-px
                  w-12
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />
            </div>

            <h2
              className="
                max-w-[95%]
                font-normal
                leading-[0.9]
                tracking-[-0.045em]
                text-zinc-950
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
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
                  max-w-[90%]
                  font-medium
                  leading-[1.25]
                  text-zinc-600
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6.6,
                      fontScale
                    ),
                }}
              >
                {
                  personalInfo.jobTitle
                }
              </p>
            )}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
              "
              aria-hidden="true"
            >
              <span
                className="h-2 w-8"
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <span
                className="
                  h-2
                  w-2
                  rotate-45
                  border
                "
                style={{
                  borderColor:
                    accentColor,
                }}
              />

              <span className="h-px w-20 bg-zinc-300" />
            </div>
          </div>

          <div
            className="
              relative
              self-end
              border-t
              border-zinc-300
              pt-3
            "
          >
            <p
              className="
                font-serif
                italic
                text-zinc-950
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontSize:
                  scaledFontSize(
                    5.8,
                    fontScale
                  ),
              }}
            >
              Contact
            </p>

            {hasContactInfo ? (
              <div className="mt-2 space-y-1">
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
                          4.8,
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
                          4.8,
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
                          4.8,
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
                          4.8,
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
                          4.8,
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
                          4.8,
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
                      4.8,
                      fontScale
                    ),
                }}
              >
                Contact details
                appear here.
              </p>
            )}
          </div>
        </header>

        {/* =====================================
            Profile
        ===================================== */}

        {resume.summary && (
          <section
            className="
              relative
              grid
              grid-cols-[26%_1fr]
              gap-6
              border-y
              border-zinc-200
              py-4
            "
            style={{
              marginTop:
                scaledSpacing(
                  12,
                  spacingScale
                ),
            }}
          >
            <div>
              <p
                className="
                  font-serif
                  italic
                  leading-none
                  text-zinc-950
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize:
                    scaledFontSize(
                      8,
                      fontScale
                    ),
                }}
              >
                About
              </p>

              <p
                className="
                  mt-1.5
                  uppercase
                  tracking-[0.15em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.2,
                      fontScale
                    ),
                }}
              >
                Professional
                perspective
              </p>
            </div>

            <div
              className="
                relative
                pl-5
              "
            >
              <span
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  w-[3px]
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <p
                className="
                  whitespace-pre-line
                  leading-[1.55]
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
                {resume.summary}
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Main Content
        ===================================== */}

        <div
          className="
            grid
            grid-cols-[1fr_29%]
            gap-8
          "
          style={{
            marginTop:
              scaledSpacing(
                11,
                spacingScale
              ),
          }}
        >
          {/* ===================================
              Main Column
          =================================== */}

          <main>
            {/* Experience */}

            {visibleExperiences.length >
              0 && (
              <section>
                <MuseSectionHeading
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Experience
                </MuseSectionHeading>

                <div className="mt-3">
                  {visibleExperiences.map(
                    (
                      experience,
                      index
                    ) => {
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
                          .filter(
                            Boolean
                          )
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
                            grid-cols-[25%_1fr]
                            gap-5
                          "
                          style={{
                            marginBottom:
                              scaledSpacing(
                                index ===
                                  visibleExperiences.length -
                                    1
                                  ? 0
                                  : 9,
                                spacingScale
                              ),
                          }}
                        >
                          <div
                            className="
                              border-t
                              border-zinc-300
                              pt-2
                            "
                          >
                            {dateRange && (
                              <p
                                className="
                                  font-semibold
                                  leading-[1.3]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.8,
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
                                  mt-1
                                  leading-[1.3]
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.5,
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

                          <div>
                            <h4
                              className="
                                font-serif
                                leading-[1.15]
                                text-zinc-950
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
                                    5.1,
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
                                  mt-1.5
                                  leading-[1.48]
                                  text-zinc-600
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      5.4,
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

            {/* Fresher */}

            {isFresher &&
              visibleExperiences.length ===
                0 && (
              <section>
                <MuseSectionHeading
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Aspiration
                </MuseSectionHeading>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-[25%_1fr]
                    gap-5
                  "
                >
                  <p
                    className="
                      border-t
                      border-zinc-300
                      pt-2
                      uppercase
                      tracking-[0.12em]
                      text-zinc-400
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.4,
                          fontScale
                        ),
                    }}
                  >
                    Career
                    Beginning
                  </p>

                  <div>
                    <p
                      className="
                        font-serif
                        italic
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
                      Ready to create
                      meaningful work.
                    </p>

                    <p
                      className="
                        mt-1.5
                        leading-[1.48]
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
                      Bringing together
                      academic learning,
                      practical projects,
                      curiosity, and
                      developing
                      expertise to begin
                      a thoughtful
                      professional
                      journey.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Projects */}

            {visibleProjects.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <MuseSectionHeading
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Selected Work
                </MuseSectionHeading>

                <div className="mt-3">
                  {visibleProjects.map(
                    (
                      project,
                      index
                    ) => {
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
                          key={
                            project.id
                          }
                          className="
                            grid
                            grid-cols-[46px_1fr]
                            gap-4
                            border-b
                            border-zinc-200
                            py-3
                            first:pt-0
                          "
                        >
                          <div>
                            <span
                              className="
                                font-serif
                                italic
                                leading-none
                              "
                              style={{
                                color:
                                  accentColor,

                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",

                                fontSize:
                                  scaledFontSize(
                                    10,
                                    fontScale
                                  ),
                              }}
                            >
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>
                          </div>

                          <div>
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >
                              <h4
                                className="
                                  font-bold
                                  leading-[1.2]
                                  text-zinc-950
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      5.9,
                                      fontScale
                                    ),
                                }}
                              >
                                {project.name ||
                                  "Project"}
                              </h4>

                              {(project.projectUrl ||
                                project.githubUrl) && (
                                <p
                                  className="
                                    shrink-0
                                    uppercase
                                    tracking-[0.08em]
                                    text-zinc-400
                                  "
                                  style={{
                                    fontSize:
                                      scaledFontSize(
                                        4,
                                        fontScale
                                      ),
                                  }}
                                >
                                  {project.projectUrl &&
                                    "Portfolio"}

                                  {project.projectUrl &&
                                    project.githubUrl &&
                                    " / "}

                                  {project.githubUrl &&
                                    "Code"}
                                </p>
                              )}
                            </div>

                            {technologies.length >
                              0 && (
                              <p
                                className="
                                  mt-1
                                  font-medium
                                  leading-[1.3]
                                "
                                style={{
                                  color:
                                    accentColor,

                                  fontSize:
                                    scaledFontSize(
                                      4.7,
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
                                  mt-1.5
                                  leading-[1.45]
                                  text-zinc-600
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      5.2,
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

            {/* Education */}

            {visibleEducations.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <MuseSectionHeading
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Education
                </MuseSectionHeading>

                <div className="mt-3 space-y-3">
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
                          .filter(
                            Boolean
                          )
                          .join(" – ");

                      const qualification =
                        [
                          education.degree,
                          education.fieldOfStudy,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(", ");

                      return (
                        <article
                          key={
                            education.id
                          }
                          className="
                            grid
                            grid-cols-[25%_1fr]
                            gap-5
                          "
                        >
                          <p
                            className="
                              border-t
                              border-zinc-300
                              pt-2
                              leading-[1.3]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.6,
                                  fontScale
                                ),
                            }}
                          >
                            {dateRange ||
                              education.location ||
                              "Education"}
                          </p>

                          <div>
                            <h4
                              className="
                                font-serif
                                leading-[1.2]
                                text-zinc-950
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
                                      4.9,
                                      fontScale
                                    ),
                                }}
                              >
                                {
                                  education.institution
                                }
                              </p>
                            )}

                            {dateRange &&
                              education.location && (
                              <p
                                className="
                                  mt-0.5
                                  leading-[1.3]
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.5,
                                      fontScale
                                    ),
                                }}
                              >
                                {
                                  education.location
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
                                      5,
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
          </main>

          {/* ===================================
              Side Column
          =================================== */}

          <aside
            className="
              border-l
              border-zinc-200
              pl-5
            "
          >
            {/* Skills */}

            {skills.length > 0 && (
              <section>
                <p
                  className="
                    font-serif
                    italic
                    leading-none
                    text-zinc-950
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
                  Expertise
                </p>

                <div
                  className="
                    mt-2.5
                    space-y-1.5
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

                        <span
                          className="
                            font-medium
                            leading-[1.3]
                            text-zinc-700
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5,
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

            {/* Certifications */}

            {visibleCertifications.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <p
                  className="
                    font-serif
                    italic
                    leading-none
                    text-zinc-950
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
                  Credentials
                </p>

                <div className="mt-2.5 space-y-2.5">
                  {visibleCertifications.map(
                    (
                      certification
                    ) => {
                      const issueDate =
                        formatMonth(
                          certification.issueDate
                        );

                      return (
                        <article
                          key={
                            certification.id
                          }
                          className="
                            border-t
                            border-zinc-200
                            pt-2
                          "
                        >
                          <p
                            className="
                              font-bold
                              leading-[1.3]
                              text-zinc-800
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5,
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
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.4,
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
                        </article>
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
                style={sectionStyle}
              >
                <p
                  className="
                    font-serif
                    italic
                    leading-none
                    text-zinc-950
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
                  Languages
                </p>

                <div className="mt-2.5 space-y-2">
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
                          <div
                            className="
                              flex
                              items-baseline
                              justify-between
                              gap-2
                            "
                          >
                            <p
                              className="
                                font-semibold
                                leading-[1.3]
                                text-zinc-700
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
                                language.name
                              }
                            </p>

                            <span
                              className="
                                h-1
                                w-1
                                shrink-0
                                rounded-full
                              "
                              style={{
                                backgroundColor:
                                  accentColor,
                              }}
                            />
                          </div>

                          {proficiency && (
                            <p
                              className="
                                mt-0.5
                                leading-[1.3]
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.4,
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
        </div>

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-8
              grid
              grid-cols-[27%_1fr]
              gap-6
              border-y
              border-zinc-200
              py-5
            "
          >
            <p
              className="
                font-serif
                italic
                leading-[1.1]
                text-zinc-950
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
              Begin your story
            </p>

            <div
              className="
                border-l-2
                pl-5
              "
              style={{
                borderColor:
                  accentColor,
              }}
            >
              <p
                className="
                  leading-[1.5]
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
                Add your experience,
                projects, skills, and
                education to compose
                your professional
                narrative.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MuseTemplate;