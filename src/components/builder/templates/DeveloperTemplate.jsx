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

const DeveloperSectionHeading = ({
  prefix,
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
        border-b
        border-zinc-200
        pb-1.5
      "
    >
      <span
        className="
          shrink-0
          font-mono
          font-bold
        "
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              4.8,
              fontScale
            ),
        }}
      >
        {prefix}
      </span>

      <h3
        className="
          font-bold
          leading-none
          tracking-[-0.01em]
          text-zinc-950
        "
        style={{
          fontSize:
            scaledFontSize(
              6.2,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <span className="ml-auto h-px w-10 bg-zinc-300" />
    </div>
  );
};

/* ========================================
   Developer Template
======================================== */

const DeveloperTemplate = ({
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
      {/* =====================================
          Top Accent
      ===================================== */}

      <div
        className="absolute left-0 top-0 h-[6px] w-full"
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
            grid-cols-[1fr_34%]
            gap-8
          "
        >
          {/* Identity */}

          <div className="min-w-0">
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
                  font-mono
                  font-bold
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
                {"<developer>"}
              </span>

              <span className="h-px w-10 bg-zinc-300" />

              <span
                className="
                  font-mono
                  uppercase
                  tracking-[0.12em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      3.9,
                      fontScale
                    ),
                }}
              >
                Professional
                Profile
              </span>
            </div>

            <h2
              className="
                max-w-[96%]
                font-black
                leading-[0.9]
                tracking-[-0.045em]
                text-zinc-950
              "
              style={{
                fontSize:
                  scaledFontSize(
                    18,
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
                  font-mono
                  font-semibold
                  leading-[1.25]
                "
                style={{
                  color:
                    accentColor,
                  fontSize:
                    scaledFontSize(
                      6,
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

          {/* Contact */}

          <div
            className="
              border-l
              border-zinc-300
              pl-4
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="
                  font-mono
                  font-bold
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
                const
              </span>

              <p
                className="
                  font-bold
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.8,
                      fontScale
                    ),
                }}
              >
                contact
              </p>

              <span
                className="
                  font-mono
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
                =
              </span>
            </div>

            {hasContactInfo ? (
              <div className="mt-2 space-y-1">
                {personalInfo.email && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
                      text-zinc-600
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
                      personalInfo.email
                    }
                  </p>
                )}

                {personalInfo.phone && (
                  <p
                    className="
                      font-mono
                      leading-[1.3]
                      text-zinc-600
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
                      personalInfo.phone
                    }
                  </p>
                )}

                {personalInfo.location && (
                  <p
                    className="
                      font-mono
                      leading-[1.3]
                      text-zinc-600
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
                      personalInfo.location
                    }
                  </p>
                )}

                {personalInfo.website && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
                      text-zinc-600
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
                      personalInfo.website
                    }
                  </p>
                )}

                {personalInfo.linkedin && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
                      text-zinc-600
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
                      personalInfo.linkedin
                    }
                  </p>
                )}

                {personalInfo.github && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
                      text-zinc-600
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
                      personalInfo.github
                    }
                  </p>
                )}
              </div>
            ) : (
              <p
                className="
                  mt-2
                  font-mono
                  leading-[1.4]
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
                {"{ add: details }"}
              </p>
            )}
          </div>
        </header>

        {/* =====================================
            Code Divider
        ===================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-[auto_1fr_auto]
            items-center
            gap-3
          "
        >
          <span
            className="
              font-mono
              font-bold
            "
            style={{
              color:
                accentColor,
              fontSize:
                scaledFontSize(
                  4,
                  fontScale
                ),
            }}
          >
            {"// build.profile()"}
          </span>

          <div className="h-px bg-zinc-300" />

          <span
            className="
              font-mono
              text-zinc-400
            "
            style={{
              fontSize:
                scaledFontSize(
                  3.8,
                  fontScale
                ),
            }}
          >
            v1.0
          </span>
        </div>

        {/* =====================================
            Profile
        ===================================== */}

        {resume.summary && (
          <section
            className="
              grid
              grid-cols-[24%_1fr]
              gap-5
            "
            style={{
              marginTop:
                scaledSpacing(
                  9,
                  spacingScale
                ),
            }}
          >
            <div>
              <p
                className="
                  font-mono
                  font-bold
                "
                style={{
                  color:
                    accentColor,
                  fontSize:
                    scaledFontSize(
                      4.5,
                      fontScale
                    ),
                }}
              >
                export default
              </p>

              <p
                className="
                  mt-0.5
                  font-bold
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.4,
                      fontScale
                    ),
                }}
              >
                Profile
              </p>
            </div>

            <div
              className="
                border-l-2
                pl-4
              "
              style={{
                borderColor:
                  accentColor,
              }}
            >
              <p
                className="
                  whitespace-pre-line
                  leading-[1.5]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.5,
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
            Main Grid
        ===================================== */}

        <div
          className="
            grid
            grid-cols-[1fr_31%]
            gap-7
          "
          style={{
            marginTop:
              scaledSpacing(
                10,
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
                <DeveloperSectionHeading
                  prefix="//"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Experience
                </DeveloperSectionHeading>

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
                            grid-cols-[26%_1fr]
                            gap-4
                          "
                          style={{
                            marginBottom:
                              scaledSpacing(
                                index ===
                                  visibleExperiences.length -
                                    1
                                  ? 0
                                  : 8,
                                spacingScale
                              ),
                          }}
                        >
                          <div>
                            {dateRange && (
                              <p
                                className="
                                  font-mono
                                  font-bold
                                  leading-[1.3]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.4,
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
                                  font-mono
                                  leading-[1.3]
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
                                {
                                  experience.location
                                }
                              </p>
                            )}
                          </div>

                          <div
                            className="
                              relative
                              border-l
                              border-zinc-200
                              pl-4
                            "
                          >
                            <span
                              className="
                                absolute
                                -left-[3px]
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

                            <h4
                              className="
                                font-bold
                                leading-[1.2]
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
                              {experience.jobTitle ||
                                "Job Title"}
                            </h4>

                            <div
                              className="
                                mt-0.5
                                flex
                                flex-wrap
                                items-center
                                gap-x-1.5
                                gap-y-0.5
                              "
                            >
                              <p
                                className="
                                  font-mono
                                  font-semibold
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
                                {experience.company ||
                                  "Organisation"}
                              </p>

                              {employmentType && (
                                <span
                                  className="
                                    font-mono
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
                                  {`<${employmentType}>`}
                                </span>
                              )}
                            </div>

                            {experience.description && (
  <ResumeDescription
    description={
      experience.description
    }
    className="
      mt-1.5
      leading-[1.43]
      text-zinc-600
    "
    style={{
      fontSize:
                                    scaledFontSize(
                                      5.1,
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
                <DeveloperSectionHeading
                  prefix="//"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Career Start
                </DeveloperSectionHeading>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-[26%_1fr]
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        font-mono
                        font-bold
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
                      status:
                    </p>

                    <p
                      className="
                        mt-0.5
                        font-mono
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
                      ready_to_build
                    </p>
                  </div>

                  <div
                    className="
                      border-l
                      border-zinc-200
                      pl-4
                    "
                  >
                    <p
                      className="
                        font-bold
                        leading-[1.25]
                        text-zinc-950
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5.7,
                            fontScale
                          ),
                      }}
                    >
                      Emerging
                      developer ready
                      for production
                      challenges.
                    </p>

                    <p
                      className="
                        mt-1
                        leading-[1.45]
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
                      Combining
                      academic
                      foundations,
                      hands-on
                      projects, and
                      growing technical
                      skills to
                      contribute,
                      learn, and build
                      reliable software.
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
                <DeveloperSectionHeading
                  prefix="{}"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Projects
                </DeveloperSectionHeading>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
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
                            border
                            border-zinc-200
                            p-3
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >
                            <span
                              className="
                                font-mono
                                font-bold
                              "
                              style={{
                                color:
                                  accentColor,
                                fontSize:
                                  scaledFontSize(
                                    4,
                                    fontScale
                                  ),
                              }}
                            >
                              {`repo_${String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}`}
                            </span>

                            {(project.projectUrl ||
                              project.githubUrl) && (
                              <span
                                className="
                                  font-mono
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.8,
                                      fontScale
                                    ),
                                }}
                              >
                                {project.projectUrl &&
                                  "live"}

                                {project.projectUrl &&
                                  project.githubUrl &&
                                  " / "}

                                {project.githubUrl &&
                                  "git"}
                              </span>
                            )}
                          </div>

                          <h4
                            className="
                              mt-1
                              font-bold
                              leading-[1.2]
                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.6,
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
                                mt-1
                                font-mono
                                leading-[1.35]
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
      leading-[1.4]
      text-zinc-600
    "
    style={{
      fontSize:
                                  scaledFontSize(
                                    4.9,
                                    fontScale
                                  ),
    }}
  />
)}
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
                <DeveloperSectionHeading
                  prefix="::"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Education
                </DeveloperSectionHeading>

                <div className="mt-3 space-y-2.5">
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
                            grid-cols-[26%_1fr]
                            gap-4
                          "
                        >
                          <div>
                            <p
                              className="
                                font-mono
                                font-semibold
                                leading-[1.3]
                                text-zinc-500
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.3,
                                    fontScale
                                  ),
                              }}
                            >
                              {dateRange ||
                                "education"}
                            </p>

                            {education.location && (
                              <p
                                className="
                                  mt-0.5
                                  font-mono
                                  leading-[1.3]
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
                                {
                                  education.location
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
                                font-bold
                                leading-[1.25]
                                text-zinc-950
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    5.4,
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
                                  font-mono
                                  font-semibold
                                "
                                style={{
                                  color:
                                    accentColor,
                                  fontSize:
                                    scaledFontSize(
                                      4.5,
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
                                      4.8,
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
              Technical Sidebar
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
                    font-mono
                    font-bold
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
                  dependencies
                </p>

                <h3
                  className="
                    mt-0.5
                    font-bold
                    leading-none
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
                  Technical Skills
                </h3>

                <div
                  className="
                    mt-3
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
                          grid
                          grid-cols-[18px_1fr]
                          gap-2
                          border-b
                          border-zinc-100
                          pb-1.5
                        "
                      >
                        <span
                          className="
                            font-mono
                            font-bold
                          "
                          style={{
                            color:
                              accentColor,
                            fontSize:
                              scaledFontSize(
                                4,
                                fontScale
                              ),
                          }}
                        >
                          +
                        </span>

                        <span
                          className="
                            font-mono
                            font-medium
                            leading-[1.3]
                            text-zinc-700
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.6,
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
                    font-mono
                    font-bold
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
                  verified[]
                </p>

                <h3
                  className="
                    mt-0.5
                    font-bold
                    leading-none
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
                  Certifications
                </h3>

                <div className="mt-3 space-y-2.5">
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
                              font-semibold
                              leading-[1.3]
                              text-zinc-800
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.8,
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
                                font-mono
                                leading-[1.3]
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
                    font-mono
                    font-bold
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
                  languages[]
                </p>

                <h3
                  className="
                    mt-0.5
                    font-bold
                    leading-none
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
                  Languages
                </h3>

                <div className="mt-3 space-y-2">
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
                            border-b
                            border-zinc-100
                            pb-1.5
                          "
                        >
                          <p
                            className="
                              font-mono
                              font-semibold
                              leading-[1.3]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.6,
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
                                font-mono
                                leading-[1.3]
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.9,
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
              border
              border-zinc-200
              p-5
            "
          >
            <p
              className="
                font-mono
                font-bold
              "
              style={{
                color:
                  accentColor,
                fontSize:
                  scaledFontSize(
                    4.5,
                    fontScale
                  ),
              }}
            >
              {"// initialize resume"}
            </p>

            <h3
              className="
                mt-1
                font-bold
                leading-[1.2]
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
              Start building your
              developer profile.
            </h3>

            <p
              className="
                mt-1.5
                leading-[1.45]
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
              Add technical skills,
              projects, experience,
              education, and
              credentials to
              initialize your resume.
            </p>

            <p
              className="
                mt-2
                font-mono
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
              {"status: waiting_for_input"}
            </p>
          </div>
        )}

        {/* =====================================
            Footer Signature
        ===================================== */}

        {hasResumeContent && (
          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              border-t
              border-zinc-200
              pt-2
            "
          >
            <span
              className="
                font-mono
                font-bold
              "
              style={{
                color:
                  accentColor,
                fontSize:
                  scaledFontSize(
                    3.8,
                    fontScale
                  ),
              }}
            >
              {"</developer>"}
            </span>

            <span className="h-px flex-1 bg-zinc-100" />

            <span
              className="
                font-mono
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    3.7,
                    fontScale
                  ),
              }}
            >
              build complete
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperTemplate;