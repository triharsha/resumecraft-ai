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
   Terminal Section Heading
======================================== */

const TerminalSectionHeading = ({
  command,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        border-b
        border-zinc-800
        pb-1.5
      "
    >
      <span
        className="font-mono font-bold"
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              4.8,
              fontScale
            ),
        }}
      >
        $
      </span>

      <h3
        className="
          font-mono
          font-bold
          leading-none
          text-zinc-100
        "
        style={{
          fontSize:
            scaledFontSize(
              5.5,
              fontScale
            ),
        }}
      >
        {command}
      </h3>

      <span
        className="
          ml-auto
          font-mono
          uppercase
          tracking-[0.08em]
          text-zinc-600
        "
        style={{
          fontSize:
            scaledFontSize(
              3.5,
              fontScale
            ),
        }}
      >
        output
      </span>
    </div>
  );
};

/* ========================================
   Terminal Template
======================================== */

const TerminalTemplate = ({
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
        bg-zinc-950
        text-zinc-300
      "
    >
      {/* =====================================
          Terminal Window Header
      ===================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-zinc-800
          bg-zinc-900
          px-8
          py-2.5
        "
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="h-2 w-2 rounded-full bg-zinc-600" />

          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                accentColor,
            }}
          />
        </div>

        <p
          className="
            font-mono
            tracking-[0.06em]
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
          resume@portfolio:~
        </p>

        <p
          className="
            font-mono
            text-zinc-600
          "
          style={{
            fontSize:
              scaledFontSize(
                3.6,
                fontScale
              ),
          }}
        >
          bash
        </p>
      </div>

      <div
        className="
          px-9
          pb-7
          pt-6
        "
      >
        {/* =====================================
            Identity
        ===================================== */}

        <header
          className="
            grid
            grid-cols-[1fr_34%]
            gap-7
          "
        >
          <div className="min-w-0">
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
                    4.7,
                    fontScale
                  ),
              }}
            >
              $ whoami
            </p>

            <h2
              className="
                mt-2
                font-mono
                font-black
                leading-[0.95]
                tracking-[-0.04em]
                text-white
              "
              style={{
                fontSize:
                  scaledFontSize(
                    15.5,
                    fontScale
                  ),
              }}
            >
              {fullName ||
                "your-name"}
            </h2>

            {personalInfo.jobTitle && (
              <div
                className="
                  mt-2
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
                        4.7,
                        fontScale
                      ),
                  }}
                >
                  &gt;
                </span>

                <p
                  className="
                    font-mono
                    font-semibold
                    leading-[1.25]
                    text-zinc-300
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        5.8,
                        fontScale
                      ),
                  }}
                >
                  {
                    personalInfo.jobTitle
                  }
                </p>
              </div>
            )}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-[5px]
                  w-10
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <span className="h-px w-24 bg-zinc-700" />

              <span
                className="
                  h-[7px]
                  w-[5px]
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Contact */}

          <div
            className="
              border
              border-zinc-800
              bg-zinc-900/60
              p-3
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
                    4.3,
                    fontScale
                  ),
              }}
            >
              $ cat contact.txt
            </p>

            {hasContactInfo ? (
              <div className="mt-2 space-y-1">
                {personalInfo.email && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
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
                    email:{" "}
                    <span className="text-zinc-200">
                      {
                        personalInfo.email
                      }
                    </span>
                  </p>
                )}

                {personalInfo.phone && (
                  <p
                    className="
                      font-mono
                      leading-[1.3]
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
                    phone:{" "}
                    <span className="text-zinc-200">
                      {
                        personalInfo.phone
                      }
                    </span>
                  </p>
                )}

                {personalInfo.location && (
                  <p
                    className="
                      font-mono
                      leading-[1.3]
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
                    location:{" "}
                    <span className="text-zinc-200">
                      {
                        personalInfo.location
                      }
                    </span>
                  </p>
                )}

                {personalInfo.website && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
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
                    web:{" "}
                    <span className="text-zinc-200">
                      {
                        personalInfo.website
                      }
                    </span>
                  </p>
                )}

                {personalInfo.linkedin && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
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
                    linkedin:{" "}
                    <span className="text-zinc-200">
                      {
                        personalInfo.linkedin
                      }
                    </span>
                  </p>
                )}

                {personalInfo.github && (
                  <p
                    className="
                      break-all
                      font-mono
                      leading-[1.3]
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
                    github:{" "}
                    <span className="text-zinc-200">
                      {
                        personalInfo.github
                      }
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p
                className="
                  mt-2
                  font-mono
                  text-zinc-600
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.1,
                      fontScale
                    ),
                }}
              >
                no contact data found
              </p>
            )}
          </div>
        </header>

        {/* =====================================
            Summary
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
            <TerminalSectionHeading
              command="cat profile.md"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                mt-2.5
                grid
                grid-cols-[22px_1fr]
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
                &gt;
              </span>

              <p
                className="
                  whitespace-pre-line
                  font-mono
                  leading-[1.5]
                  text-zinc-300
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5,
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
            grid-cols-[1fr_30%]
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
                <TerminalSectionHeading
                  command="./experience --list"
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
                          .join(" -> ");

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
                            border-l
                            border-zinc-700
                            pl-3
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
                                      4,
                                      fontScale
                                    ),
                                }}
                              >
                                {`process[${String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}]`}
                              </p>

                              <h4
                                className="
                                  mt-0.5
                                  font-mono
                                  font-bold
                                  leading-[1.2]
                                  text-zinc-100
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
                            </div>

                            {dateRange && (
                              <p
                                className="
                                  shrink-0
                                  text-right
                                  font-mono
                                  leading-[1.3]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.9,
                                      fontScale
                                    ),
                                }}
                              >
                                {dateRange}
                              </p>
                            )}
                          </div>

                          <p
                            className="
                              mt-0.5
                              font-mono
                              font-semibold
                              text-zinc-300
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.5,
                                  fontScale
                                ),
                            }}
                          >
                            @{" "}
                            {experience.company ||
                              "organisation"}
                          </p>

                          {(employmentType ||
                            experience.location) && (
                            <p
                              className="
                                mt-0.5
                                font-mono
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
                              {[
                                employmentType,
                                experience.location,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " | "
                                )}
                            </p>
                          )}

                          {experience.description && (
                            <div
                              className="
                                mt-1.5
                                grid
                                grid-cols-[14px_1fr]
                                gap-1
                              "
                            >
                              <span
                                className="
                                  font-mono
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
                                |
                              </span>

                              <ResumeDescription
                                description={
                                  experience.description
                                }
                                className="
                                  font-mono
                                  leading-[1.42]
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.7,
                                      fontScale
                                    ),
                                }}
                              />
                            </div>
                          )}
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
                <TerminalSectionHeading
                  command="./career --init"
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
                    border
                    border-zinc-800
                    bg-zinc-900/50
                    p-3
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
                          4.2,
                          fontScale
                        ),
                    }}
                  >
                    [ OK ] profile initialized
                  </p>

                  <p
                    className="
                      mt-1.5
                      font-mono
                      font-semibold
                      leading-[1.35]
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
                    Entry-level
                    professional ready
                    to ship, learn,
                    and contribute.
                  </p>

                  <p
                    className="
                      mt-1
                      font-mono
                      leading-[1.45]
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
                    Academic
                    foundations and
                    hands-on project
                    experience are
                    ready for
                    real-world
                    challenges.
                  </p>
                </div>
              </section>
            )}

            {/* Projects */}

            {visibleProjects.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <TerminalSectionHeading
                  command="ls ./projects"
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
                            border
                            border-zinc-800
                            bg-zinc-900/40
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
                                    3.9,
                                    fontScale
                                  ),
                              }}
                            >
                              {`drwx ${
                                index + 1
                              }`}
                            </p>

                            {(project.projectUrl ||
                              project.githubUrl) && (
                              <p
                                className="
                                  font-mono
                                  text-zinc-600
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.5,
                                      fontScale
                                    ),
                                }}
                              >
                                {project.projectUrl &&
                                  "live"}

                                {project.projectUrl &&
                                  project.githubUrl &&
                                  " | "}

                                {project.githubUrl &&
                                  "git"}
                              </p>
                            )}
                          </div>

                          <h4
                            className="
                              mt-1
                              font-mono
                              font-bold
                              leading-[1.2]
                              text-zinc-100
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.1,
                                  fontScale
                                ),
                            }}
                          >
                            {project.name ||
                              "project"}
                          </h4>

                          {technologies.length >
                            0 && (
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
                                    3.9,
                                    fontScale
                                  ),
                              }}
                            >
                              [
                              {technologies.join(
                                ", "
                              )}
                              ]
                            </p>
                          )}

                          {project.description && (
                            <ResumeDescription
                              description={
                                project.description
                              }
                              className="
                                mt-1.5
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
                <TerminalSectionHeading
                  command="cat education.log"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

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
                          .join(" -> ");

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
                            gap-3
                          "
                        >
                          <div>
                            <p
                              className="
                                font-mono
                                text-zinc-500
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.9,
                                    fontScale
                                  ),
                              }}
                            >
                              {dateRange ||
                                "--"}
                            </p>

                            {education.location && (
                              <p
                                className="
                                  mt-0.5
                                  font-mono
                                  text-zinc-600
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.6,
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
                              border-zinc-800
                              pl-3
                            "
                          >
                            <h4
                              className="
                                font-mono
                                font-bold
                                leading-[1.25]
                                text-zinc-200
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.8,
                                    fontScale
                                  ),
                              }}
                            >
                              {qualification ||
                                "qualification"}
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
                                      4.1,
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
                                  font-mono
                                  leading-[1.4]
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
              Sidebar
          =================================== */}

          <aside
            className="
              border-l
              border-zinc-800
              pl-5
            "
          >
            {/* Skills */}

            {skills.length > 0 && (
              <section>
                <TerminalSectionHeading
                  command="pkg --list"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                />

                <div className="mt-3 space-y-1">
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
                          gap-1.5
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
                            leading-[1.35]
                            text-zinc-300
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.3,
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
                <TerminalSectionHeading
                  command="verify certs"
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
                            border-l
                            border-zinc-800
                            pl-2.5
                          "
                        >
                          <p
                            className="
                              font-mono
                              font-semibold
                              leading-[1.3]
                              text-zinc-300
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.3,
                                  fontScale
                                ),
                            }}
                          >
                            {certification.name ||
                              "certificate"}
                          </p>

                          {(certification.issuer ||
                            issueDate) && (
                            <p
                              className="
                                mt-0.5
                                font-mono
                                leading-[1.3]
                                text-zinc-600
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.7,
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
                                  " | "
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
                <TerminalSectionHeading
                  command="locale -a"
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
                            border-b
                            border-zinc-900
                            pb-1.5
                          "
                        >
                          <p
                            className="
                              font-mono
                              font-semibold
                              text-zinc-300
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
                          </p>

                          {proficiency && (
                            <p
                              className="
                                mt-0.5
                                font-mono
                                text-zinc-600
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.6,
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
              border-zinc-800
              bg-zinc-900/50
              p-4
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
                    4.4,
                    fontScale
                  ),
              }}
            >
              $ resumecraft --init
            </p>

            <div className="mt-2 space-y-1">
              <p
                className="
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
                [....] loading profile
              </p>

              <p
                className="
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
                [....] checking resume data
              </p>

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
                      4.2,
                      fontScale
                    ),
                }}
              >
                [WAIT] input required
              </p>
            </div>

            <p
              className="
                mt-3
                font-mono
                leading-[1.45]
                text-zinc-300
              "
              style={{
                fontSize:
                  scaledFontSize(
                    4.8,
                    fontScale
                  ),
              }}
            >
              Add your profile,
              technical skills,
              projects, experience,
              education, and
              credentials to start
              this session.
            </p>
          </div>
        )}

        {/* =====================================
            Terminal Prompt Footer
        ===================================== */}

        {hasResumeContent && (
          <footer
            className="
              mt-5
              flex
              items-center
              gap-2
              border-t
              border-zinc-800
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
                    4,
                    fontScale
                  ),
              }}
            >
              resume@portfolio:~$
            </span>

            <span
              className="
                h-[9px]
                w-[5px]
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
              aria-hidden="true"
            />

            <span
              className="
                ml-auto
                font-mono
                text-zinc-700
              "
              style={{
                fontSize:
                  scaledFontSize(
                    3.5,
                    fontScale
                  ),
              }}
            >
              exit_code: 0
            </span>
          </footer>
        )}
      </div>
    </div>
  );
};

export default TerminalTemplate;