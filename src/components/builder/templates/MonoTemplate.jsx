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

const languageProficiencyLabels = {
  "native-bilingual":
    "Native / Bilingual",
  fluent: "Fluent",
  professional:
    "Professional Working",
  intermediate: "Intermediate",
  basic: "Basic",
};

const MonoSectionHeading = ({
  number,
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
          font-mono
          font-semibold
          leading-none
        "
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              4.4,
              fontScale
            ),
        }}
      >
        [{number}]
      </span>

      <h3
        className="
          font-mono
          font-bold
          uppercase
          leading-none
          tracking-[0.14em]
          text-zinc-800
        "
        style={{
          fontSize:
            scaledFontSize(
              5.1,
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

const MonoTemplate = ({
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

  const educations =
    Array.isArray(
      resume.education
    )
      ? resume.education
      : [];

  const visibleEducations =
    educations.filter(
      (education) =>
        education.degree ||
        education.fieldOfStudy ||
        education.institution ||
        education.description
    );

  const skills =
    Array.isArray(resume.skills)
      ? resume.skills.filter(
          (skill) =>
            typeof skill ===
              "string" &&
            skill.trim()
        )
      : [];

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

  const isFresher =
    Boolean(resume.isFresher);

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.github,
  ].filter(Boolean);

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
        8.5,
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
        text-zinc-800
      "
    >
      <main
        className="
          px-9
          pb-7
          pt-8
        "
      >
        {/* Header */}

        <header>
          <div
            className="
              flex
              items-center
              justify-between
              gap-6
              border-b
              border-zinc-900
              pb-2
            "
          >
            <p
              className="
                font-mono
                font-semibold
                uppercase
                tracking-[0.16em]
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    4.1,
                    fontScale
                  ),
              }}
            >
              Resume / Profile
            </p>

            <p
              className="
                font-mono
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    4.1,
                    fontScale
                  ),
              }}
            >
              01
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-[1fr_30%]
              gap-6
              py-4
            "
          >
            <div className="min-w-0">
              <h2
                className="
                  font-mono
                  font-semibold
                  uppercase
                  leading-[0.95]
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
                    font-medium
                    leading-[1.3]
                    text-zinc-500
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
              )}
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
                  mb-1.5
                  font-mono
                  font-semibold
                  uppercase
                  tracking-[0.12em]
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
                Details
              </p>

              {contactItems.length >
              0 ? (
                <div className="space-y-1">
                  {contactItems.map(
                    (
                      item,
                      index
                    ) => (
                      <p
                        key={`${item}-${index}`}
                        className="
                          break-all
                          font-mono
                          leading-[1.3]
                          text-zinc-600
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              4.4,
                              fontScale
                            ),
                        }}
                      >
                        {item}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p
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
                  —
                </p>
              )}
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              border-y
              border-zinc-200
              py-1.5
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
                    4.2,
                    fontScale
                  ),
              }}
            >
              ::
            </span>

            <p
              className="
                font-mono
                uppercase
                tracking-[0.12em]
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
              Professional record
            </p>

            <span
              className="
                ml-auto
                font-mono
                text-zinc-300
              "
              style={{
                fontSize:
                  scaledFontSize(
                    4,
                    fontScale
                  ),
              }}
            >
              ----------------
            </span>
          </div>
        </header>

        {/* Profile */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <MonoSectionHeading
              number="01"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </MonoSectionHeading>

            <div
              className="
                grid
                grid-cols-[18%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-mono
                  uppercase
                  leading-[1.4]
                  tracking-[0.08em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.3,
                      fontScale
                    ),
                }}
              >
                Summary
              </p>

              <p
                className="
                  whitespace-pre-line
                  leading-[1.5]
                  text-zinc-600
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

        {/* Experience */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <MonoSectionHeading
              number="02"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </MonoSectionHeading>

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
                    [start, end]
                      .filter(Boolean)
                      .join(" — ");

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
                        grid-cols-[18%_1fr]
                        gap-4
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-mono
                              font-medium
                              leading-[1.35]
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
                                  4.1,
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
                              font-semibold
                              leading-[1.25]
                              text-zinc-900
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.8,
                                  fontScale
                                ),
                            }}
                          >
                            {experience.jobTitle ||
                              "Job Title"}
                          </h4>

                          <span
                            className="
                              shrink-0
                              font-mono
                              text-zinc-300
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4,
                                  fontScale
                                ),
                            }}
                          >
                            //
                          </span>
                        </div>

                        <p
                          className="
                            mt-0.5
                            font-mono
                            leading-[1.3]
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
                          {experience.company ||
                            "Organisation"}

                          {employmentType &&
                            ` / ${employmentType}`}
                        </p>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
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

        {/* Fresher Objective */}

        {isFresher &&
          visibleExperiences.length ===
            0 && (
          <section
            style={sectionStyle}
          >
            <MonoSectionHeading
              number="02"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Objective
            </MonoSectionHeading>

            <div
              className="
                grid
                grid-cols-[18%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-mono
                  uppercase
                  tracking-[0.08em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.3,
                      fontScale
                    ),
                }}
              >
                Entry / Level
              </p>

              <p
                className="
                  border-l
                  border-zinc-200
                  pl-4
                  leading-[1.5]
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
                Motivated
                early-career
                professional ready to
                apply academic,
                technical, and project
                experience in a
                collaborative
                professional
                environment.
              </p>
            </div>
          </section>
        )}

        {/* Skills */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <MonoSectionHeading
              number="03"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Skills
            </MonoSectionHeading>

            <div
              className="
                grid
                grid-cols-[18%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-mono
                  uppercase
                  tracking-[0.08em]
                  text-zinc-400
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.3,
                      fontScale
                    ),
                }}
              >
                Toolkit
              </p>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-x-4
                  gap-y-1.5
                  border-l
                  border-zinc-200
                  pl-4
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
                        min-w-0
                        items-baseline
                        gap-1.5
                      "
                    >
                      <span
                        className="
                          shrink-0
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
                        +
                      </span>

                      <span
                        className="
                          truncate
                          font-mono
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
                        {skill}
                      </span>
                    </div>
                  )
                )}
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
            <MonoSectionHeading
              number="04"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Projects
            </MonoSectionHeading>

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
                    <article
                      key={
                        project.id
                      }
                      className="
                        grid
                        grid-cols-[18%_1fr]
                        gap-4
                      "
                    >
                      <div>
                        <p
                          className="
                            font-mono
                            uppercase
                            tracking-[0.07em]
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.1,
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
                              font-mono
                              font-semibold
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
                            {project.projectUrl &&
                              "LIVE"}

                            {project.projectUrl &&
                              project.githubUrl &&
                              " / "}

                            {project.githubUrl &&
                              "CODE"}
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
                            font-semibold
                            leading-[1.25]
                            text-zinc-900
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.5,
                                fontScale
                              ),
                          }}
                        >
                          {project.name ||
                            "Project Name"}
                        </h4>

                        {technologies.length >
                          0 && (
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
                                  4.3,
                                  fontScale
                                ),
                            }}
                          >
                            [
                            {technologies.join(
                              " / "
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
                              mt-1
                              leading-[1.45]
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

        {/* Education */}

        {visibleEducations.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <MonoSectionHeading
              number="05"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </MonoSectionHeading>

            <div className="space-y-2">
              {visibleEducations.map(
                (education) => {
                  const qualification =
                    [
                      education.degree,
                      education.fieldOfStudy,
                    ]
                      .filter(Boolean)
                      .join(" / ");

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
                    [start, end]
                      .filter(Boolean)
                      .join(" — ");

                  return (
                    <article
                      key={
                        education.id
                      }
                      className="
                        grid
                        grid-cols-[18%_1fr]
                        gap-4
                      "
                    >
                      <p
                        className="
                          font-mono
                          leading-[1.35]
                          text-zinc-400
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              4.3,
                              fontScale
                            ),
                        }}
                      >
                        {dateRange}
                      </p>

                      <div
                        className="
                          border-l
                          border-zinc-200
                          pl-4
                        "
                      >
                        <h4
                          className="
                            font-semibold
                            leading-[1.25]
                            text-zinc-900
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
                            {
                              education.institution
                            }

                            {education.location &&
                              ` / ${education.location}`}
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
                                  4.9,
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

        {/* Additional */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <MonoSectionHeading
              number="06"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Additional
            </MonoSectionHeading>

            <div
              className="
                grid
                grid-cols-[18%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-mono
                  uppercase
                  leading-[1.4]
                  tracking-[0.08em]
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
                Extras
              </p>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-6
                  border-l
                  border-zinc-200
                  pl-4
                "
              >
                {visibleCertifications.length >
                  0 && (
                  <div>
                    <p
                      className="
                        mb-1.5
                        font-mono
                        font-semibold
                        uppercase
                        tracking-[0.1em]
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
                                  font-medium
                                  leading-[1.3]
                                  text-zinc-700
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

                              <p
                                className="
                                  mt-0.5
                                  font-mono
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4.1,
                                      fontScale
                                    ),
                                }}
                              >
                                {[
                                  certification.issuer,
                                  issueDate,
                                ]
                                  .filter(Boolean)
                                  .join(" / ")}
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
                        font-mono
                        font-semibold
                        uppercase
                        tracking-[0.1em]
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
                            >
                              <p
                                className="
                                  font-medium
                                  text-zinc-700
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
                                  language.name
                                }
                              </p>

                              {proficiency && (
                                <p
                                  className="
                                    mt-0.5
                                    font-mono
                                    text-zinc-400
                                  "
                                  style={{
                                    fontSize:
                                      scaledFontSize(
                                        4.1,
                                        fontScale
                                      ),
                                  }}
                                >
                                  {
                                    proficiency
                                  }
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
            </div>
          </section>
        )}

        {/* Empty State */}

        {!hasResumeContent && (
          <div
            className="
              mt-6
              border-y
              border-zinc-200
              py-5
            "
          >
            <p
              className="
                font-mono
                uppercase
                tracking-[0.08em]
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
              [00] Waiting for
              resume content...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MonoTemplate;