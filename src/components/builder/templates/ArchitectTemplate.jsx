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
   Architecture Section Heading
======================================== */

const ArchitectSectionHeading = ({
  label,
  title,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[78px_1fr]
        items-end
        gap-3
      "
    >
      <div>
        <p
          className="
            font-mono
            font-bold
            uppercase
            tracking-[0.1em]
          "
          style={{
            color: accentColor,
            fontSize:
              scaledFontSize(
                3.8,
                fontScale
              ),
          }}
        >
          {label}
        </p>

        <div
          className="
            mt-1.5
            flex
            items-center
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              border-2
              bg-white
            "
            style={{
              borderColor:
                accentColor,
            }}
          />

          <span
            className="
              h-px
              flex-1
              bg-zinc-300
            "
          />
        </div>
      </div>

      <div
        className="
          border-b
          border-zinc-300
          pb-1.5
        "
      >
        <h3
          className="
            font-bold
            uppercase
            leading-none
            tracking-[0.07em]
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
          {title}
        </h3>
      </div>
    </div>
  );
};

/* ========================================
   Architect Template
======================================== */

const ArchitectTemplate = ({
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

  const sectionStyle = {
    marginTop:
      scaledSpacing(
        10,
        spacingScale
      ),
  };

  return (
    <div
      ref={contentRef}
      className="
        absolute
        inset-0
        overflow-hidden
        bg-white
        text-zinc-700
      "
    >
      {/* =====================================
          Blueprint Frame
      ===================================== */}

      <div
        className="
          absolute
          inset-x-5
          inset-y-5
          border
          border-zinc-200
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute
          left-5
          top-5
          h-12
          w-[3px]
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
          bottom-5
          right-5
          h-12
          w-[3px]
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
            grid-cols-[1fr_34%]
            gap-8
          "
        >
          {/* Identity */}

          <div>
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  font-mono
                  font-bold
                  uppercase
                  tracking-[0.14em]
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
                System Architect Profile
              </span>

              <span className="h-px w-14 bg-zinc-300" />

              <span
                className="
                  font-mono
                  uppercase
                  tracking-[0.08em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      3.6,
                      fontScale
                    ),
                }}
              >
                Blueprint / A01
              </span>
            </div>

            <h2
              className="
                mt-3
                font-black
                uppercase
                leading-[0.9]
                tracking-[-0.04em]
                text-zinc-950
              "
              style={{
                fontSize:
                  scaledFontSize(
                    16,
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
                  font-semibold
                  leading-[1.2]
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
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <span className="h-px w-20 bg-zinc-300" />

              <span
                className="
                  font-mono
                  uppercase
                  tracking-[0.08em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      3.6,
                      fontScale
                    ),
                }}
              >
                Architecture Record
              </span>
            </div>
          </div>

          {/* Contact Node */}

          <div
            className="
              border
              border-zinc-300
              bg-zinc-50
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-300
                px-3
                py-2
              "
            >
              <span
                className="
                  font-mono
                  font-bold
                  uppercase
                  tracking-[0.09em]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      3.8,
                      fontScale
                    ),
                }}
              >
                Identity Node
              </span>

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />
            </div>

            {hasContactInfo ? (
              <div className="space-y-1.5 p-3">
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
                          4,
                          fontScale
                        ),
                    }}
                  >
                    <span className="text-zinc-400">
                      MAIL
                    </span>{" "}
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
                          4,
                          fontScale
                        ),
                    }}
                  >
                    <span className="text-zinc-400">
                      TEL
                    </span>{" "}
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
                          4,
                          fontScale
                        ),
                    }}
                  >
                    <span className="text-zinc-400">
                      LOC
                    </span>{" "}
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
                          4,
                          fontScale
                        ),
                    }}
                  >
                    <span className="text-zinc-400">
                      WEB
                    </span>{" "}
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
                          4,
                          fontScale
                        ),
                    }}
                  >
                    <span className="text-zinc-400">
                      IN
                    </span>{" "}
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
                          4,
                          fontScale
                        ),
                    }}
                  >
                    <span className="text-zinc-400">
                      GIT
                    </span>{" "}
                    {
                      personalInfo.github
                    }
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3">
                <p
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
                  Contact node not configured
                </p>
              </div>
            )}
          </div>
        </header>

        {/* =====================================
            Architecture Overview
        ===================================== */}

        {resume.summary && (
          <section
            style={{
              marginTop:
                scaledSpacing(
                  9,
                  spacingScale
                ),
            }}
          >
            <ArchitectSectionHeading
              label="Profile"
              title="Architecture Overview"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                mt-3
                grid
                grid-cols-[78px_1fr]
                gap-3
              "
            >
              <div className="relative">
                <div
                  className="
                    absolute
                    left-[3px]
                    top-0
                    h-full
                    w-px
                    bg-zinc-200
                  "
                />

                <span
                  className="
                    relative
                    block
                    h-[7px]
                    w-[7px]
                    rounded-full
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />
              </div>

              <p
                className="
                  whitespace-pre-line
                  leading-[1.5]
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
                {resume.summary}
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Main Architecture Grid
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
                <ArchitectSectionHeading
                  label="Record"
                  title="Architecture Experience"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

                <div className="mt-3 space-y-3">
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
                            grid-cols-[78px_1fr]
                            gap-3
                          "
                        >
                          {/* Rail */}

                          <div
                            className="
                              relative
                              border-r
                              border-zinc-200
                              pr-3
                            "
                          >
                            <span
                              className="
                                absolute
                                -right-[5px]
                                top-1
                                h-[9px]
                                w-[9px]
                                rounded-full
                                border-2
                                bg-white
                              "
                              style={{
                                borderColor:
                                  accentColor,
                              }}
                            />

                            <p
                              className="
                                font-mono
                                font-bold
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
                              {`AR-${String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}`}
                            </p>

                            {dateRange && (
                              <p
                                className="
                                  mt-1
                                  font-mono
                                  leading-[1.3]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.7,
                                      fontScale
                                    ),
                                }}
                              >
                                {dateRange}
                              </p>
                            )}
                          </div>

                          {/* Record */}

                          <div
                            className="
                              border
                              border-zinc-200
                              p-3
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
                              <div>
                                <h4
                                  className="
                                    font-bold
                                    leading-[1.2]
                                    text-zinc-950
                                  "
                                  style={{
                                    fontSize:
                                      scaledFontSize(
                                        5.5,
                                        fontScale
                                      ),
                                  }}
                                >
                                  {experience.jobTitle ||
                                    "Role"}
                                </h4>

                                <p
                                  className="
                                    mt-0.5
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
                                  {experience.company ||
                                    "Organisation"}
                                </p>
                              </div>

                              <span
                                className="
                                  shrink-0
                                  font-mono
                                  uppercase
                                  tracking-[0.06em]
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.5,
                                      fontScale
                                    ),
                                }}
                              >
                                Architecture Record
                              </span>
                            </div>

                            {(employmentType ||
                              experience.location) && (
                              <div
                                className="
                                  mt-2
                                  flex
                                  flex-wrap
                                  gap-x-3
                                  gap-y-1
                                  border-y
                                  border-zinc-100
                                  py-1.5
                                "
                              >
                                {employmentType && (
                                  <span
                                    className="
                                      font-mono
                                      text-zinc-500
                                    "
                                    style={{
                                      fontSize:
                                        scaledFontSize(
                                          3.7,
                                          fontScale
                                        ),
                                    }}
                                  >
                                    TYPE:{" "}
                                    {
                                      employmentType
                                    }
                                  </span>
                                )}

                                {experience.location && (
                                  <span
                                    className="
                                      font-mono
                                      text-zinc-500
                                    "
                                    style={{
                                      fontSize:
                                        scaledFontSize(
                                          3.7,
                                          fontScale
                                        ),
                                    }}
                                  >
                                    NODE:{" "}
                                    {
                                      experience.location
                                    }
                                  </span>
                                )}
                              </div>
                            )}

                            {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-2
                              whitespace-pre-line
                              leading-[1.43]
                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.8,
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
                <ArchitectSectionHeading
                  label="Launch"
                  title="Foundation Record"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-[78px_1fr]
                    gap-3
                  "
                >
                  <div
                    className="
                      relative
                      border-r
                      border-zinc-200
                      pr-3
                    "
                  >
                    <span
                      className="
                        absolute
                        -right-[5px]
                        top-1
                        h-[9px]
                        w-[9px]
                        rounded-full
                        border-2
                        bg-white
                      "
                      style={{
                        borderColor:
                          accentColor,
                      }}
                    />

                    <p
                      className="
                        font-mono
                        font-bold
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
                      INIT
                    </p>
                  </div>

                  <div
                    className="
                      border
                      border-zinc-200
                      bg-zinc-50
                      p-3
                    "
                  >
                    <p
                      className="
                        font-bold
                        leading-[1.3]
                        text-zinc-900
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5.2,
                            fontScale
                          ),
                      }}
                    >
                      Building the first
                      professional layer.
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
                            4.7,
                            fontScale
                          ),
                      }}
                    >
                      Ready to apply
                      technical
                      knowledge,
                      structured
                      problem-solving,
                      project
                      experience, and
                      continuous
                      learning in a
                      professional
                      environment.
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
                <ArchitectSectionHeading
                  label="System"
                  title="System Portfolio"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

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
                            relative
                            border
                            border-zinc-200
                            p-3
                          "
                        >
                          <div
                            className="
                              absolute
                              left-0
                              top-0
                              h-[3px]
                              w-12
                            "
                            style={{
                              backgroundColor:
                                accentColor,
                            }}
                          />

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >
                            <p
                              className="
                                font-mono
                                font-bold
                                uppercase
                                tracking-[0.08em]
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
                              {`SYS-${String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}`}
                            </p>

                            {(project.projectUrl ||
                              project.githubUrl) && (
                              <p
                                className="
                                  font-mono
                                  uppercase
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.4,
                                      fontScale
                                    ),
                                }}
                              >
                                {project.projectUrl &&
                                  "LIVE"}

                                {project.projectUrl &&
                                  project.githubUrl &&
                                  " / "}

                                {project.githubUrl &&
                                  "SOURCE"}
                              </p>
                            )}
                          </div>

                          <h4
                            className="
                              mt-1.5
                              font-bold
                              leading-[1.2]
                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.2,
                                  fontScale
                                ),
                            }}
                          >
                            {project.name ||
                              "System"}
                          </h4>

                          {technologies.length >
                            0 && (
                            <div
                              className="
                                mt-2
                                border-y
                                border-zinc-100
                                py-1.5
                              "
                            >
                              <p
                                className="
                                  font-mono
                                  leading-[1.35]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.8,
                                      fontScale
                                    ),
                                }}
                              >
                                STACK /{" "}
                                {technologies.join(
                                  " · "
                                )}
                              </p>
                            </div>
                          )}

                          {project.description && (
                          <ResumeDescription
                            description={
                              project.description
                            }
                            className="
                              mt-2
                              whitespace-pre-line
                              leading-[1.4]
                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.5,
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
          </main>

          {/* ===================================
              Architecture Sidebar
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
                <ArchitectSectionHeading
                  label="Capability"
                  title="Core Capabilities"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

                <div className="mt-3">
                  {skills.map(
                    (
                      skill,
                      index
                    ) => (
                      <div
                        key={`${skill}-${index}`}
                        className="
                          relative
                          grid
                          grid-cols-[18px_1fr]
                          gap-2
                          pb-2
                        "
                      >
                        {index !==
                          skills.length -
                            1 && (
                          <span
                            className="
                              absolute
                              left-[3px]
                              top-[8px]
                              h-full
                              w-px
                              bg-zinc-200
                            "
                          />
                        )}

                        <span
                          className="
                            relative
                            mt-[3px]
                            h-[7px]
                            w-[7px]
                            rounded-full
                            border-2
                            bg-white
                          "
                          style={{
                            borderColor:
                              accentColor,
                          }}
                        />

                        <span
                          className="
                            font-medium
                            leading-[1.35]
                            text-zinc-700
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.4,
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

            {/* Education */}

            {visibleEducations.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <ArchitectSectionHeading
                  label="Foundation"
                  title="Education"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

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
                            border-l-2
                            pl-3
                          "
                          style={{
                            borderColor:
                              accentColor,
                          }}
                        >
                          <h4
                            className="
                              font-bold
                              leading-[1.25]
                              text-zinc-900
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.7,
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
                                text-zinc-600
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.2,
                                    fontScale
                                  ),
                              }}
                            >
                              {
                                education.institution
                              }
                            </p>
                          )}

                          {(dateRange ||
                            education.location) && (
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
                                    3.6,
                                    fontScale
                                  ),
                              }}
                            >
                              {[
                                dateRange,
                                education.location,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " · "
                                )}
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
                                    4.2,
                                    fontScale
                                  ),
                              }}
                            >
                              {
                                education.description
                              }
                            </p>
                          )}
                        </article>
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
                style={sectionStyle}
              >
                <ArchitectSectionHeading
                  label="Credential"
                  title="Certifications"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

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
                            border-b
                            border-zinc-200
                            pb-2
                          "
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
                                  4.4,
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
                                    3.6,
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
                <ArchitectSectionHeading
                  label="Interface"
                  title="Languages"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

                <div className="mt-3 space-y-1.5">
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
                            grid
                            grid-cols-[1fr_auto]
                            gap-2
                            border-b
                            border-zinc-100
                            pb-1.5
                          "
                        >
                          <span
                            className="
                              font-medium
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.2,
                                  fontScale
                                ),
                            }}
                          >
                            {
                              language.name
                            }
                          </span>

                          {proficiency && (
                            <span
                              className="
                                text-right
                                font-mono
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.4,
                                    fontScale
                                  ),
                              }}
                            >
                              {proficiency}
                            </span>
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
              grid-cols-[90px_1fr]
              border
              border-zinc-300
            "
          >
            <div
              className="
                relative
                border-r
                border-zinc-300
                bg-zinc-50
                p-4
              "
            >
              <span
                className="
                  block
                  h-3
                  w-3
                  rounded-full
                  border-[3px]
                  bg-white
                "
                style={{
                  borderColor:
                    accentColor,
                }}
              />

              <span
                className="
                  absolute
                  left-[21px]
                  top-7
                  h-[calc(100%-28px)]
                  w-px
                  bg-zinc-300
                "
              />
            </div>

            <div className="p-4">
              <p
                className="
                  font-mono
                  font-bold
                  uppercase
                  tracking-[0.1em]
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
                Blueprint Pending
              </p>

              <h3
                className="
                  mt-1
                  font-bold
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
                Define your professional
                architecture.
              </h3>

              <p
                className="
                  mt-1
                  leading-[1.45]
                  text-zinc-500
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.7,
                      fontScale
                    ),
                }}
              >
                Add your profile,
                capabilities,
                experience, systems,
                education,
                certifications, and
                languages to construct
                this resume.
              </p>
            </div>
          </div>
        )}

        {/* =====================================
            Footer
        ===================================== */}

        {hasResumeContent && (
          <footer
            className="
              mt-5
              grid
              grid-cols-[auto_1fr_auto]
              items-center
              gap-3
              border-t
              border-zinc-200
              pt-2
            "
          >
            <span
              className="
                font-mono
                font-bold
                uppercase
                tracking-[0.08em]
              "
              style={{
                color:
                  accentColor,
                fontSize:
                  scaledFontSize(
                    3.6,
                    fontScale
                  ),
              }}
            >
              ARC / PROFILE
            </span>

            <div
              className="
                flex
                items-center
              "
            >
              <span className="h-px flex-1 bg-zinc-200" />

              <span
                className="
                  mx-2
                  h-2
                  w-2
                  rounded-full
                  border-2
                  bg-white
                "
                style={{
                  borderColor:
                    accentColor,
                }}
              />

              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <span
              className="
                font-mono
                uppercase
                tracking-[0.08em]
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    3.5,
                    fontScale
                  ),
              }}
            >
              System Architecture
            </span>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ArchitectTemplate;