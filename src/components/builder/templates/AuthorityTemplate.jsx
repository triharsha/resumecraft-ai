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
  intermediate:
    "Intermediate",
  basic: "Basic",
};

const AuthoritySectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div className="mb-2.5">
      <div
        className="
          flex
          items-end
          gap-3
        "
      >
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
                6.2,
                fontScale
              ),
          }}
        >
          {children}
        </h3>

        <div
          className="
            mb-[1px]
            h-[2px]
            flex-1
          "
          style={{
            backgroundColor:
              accentColor,
          }}
        />
      </div>
    </div>
  );
};

const AuthorityTemplate = ({
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

  const hasContactInfo =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location ||
    personalInfo.linkedin ||
    personalInfo.website ||
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
        text-zinc-900
      "
    >
      {/* Leadership Header */}

      <header
        className="
          bg-zinc-950
          px-8
          pb-5
          pt-6
          text-white
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-7
          "
        >
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
                  h-1.5
                  w-1.5
                  shrink-0
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <p
                className="
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.22em]
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
                Leadership Profile
              </p>
            </div>

            <h2
              className="
                max-w-[480px]
                font-black
                uppercase
                leading-[0.9]
                tracking-[-0.045em]
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
                  mt-2.5
                  font-semibold
                  leading-[1.25]
                  tracking-[0.03em]
                  text-zinc-300
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6.8,
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
              w-[31%]
              shrink-0
              border-l
              border-zinc-700
              pl-4
            "
          >
            <p
              className="
                font-black
                uppercase
                tracking-[0.16em]
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
              Executive Details
            </p>

            {personalInfo.location && (
              <p
                className="
                  mt-2
                  font-semibold
                  leading-[1.3]
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
            )}

            {personalInfo.email && (
              <p
                className="
                  mt-1
                  break-all
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
                {
                  personalInfo.email
                }
              </p>
            )}

            {personalInfo.phone && (
              <p
                className="
                  mt-1
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
                {
                  personalInfo.phone
                }
              </p>
            )}
          </div>
        </div>

        <div
          className="
            mt-4
            h-1
            w-full
          "
          style={{
            backgroundColor:
              accentColor,
          }}
        />
      </header>

      {/* Secondary Contact Strip */}

      {hasContactInfo && (
        <div
          className="
            flex
            flex-wrap
            gap-x-4
            gap-y-1
            border-b
            border-zinc-200
            bg-zinc-50
            px-8
            py-2
          "
        >
          {personalInfo.linkedin && (
            <span
              className="
                break-all
                font-semibold
                text-zinc-600
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
                personalInfo.linkedin
              }
            </span>
          )}

          {personalInfo.website && (
            <span
              className="
                break-all
                font-semibold
                text-zinc-600
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
                personalInfo.website
              }
            </span>
          )}

          {personalInfo.github && (
            <span
              className="
                break-all
                font-semibold
                text-zinc-600
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
                personalInfo.github
              }
            </span>
          )}
        </div>
      )}

      {/* Resume Body */}

      <main
        className="
          px-8
          pb-6
          pt-4
        "
      >
        {/* Executive Snapshot */}

        {resume.summary && (
          <section>
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Executive Snapshot
            </AuthoritySectionHeading>

            <div
              className="
                grid
                grid-cols-[25%_1fr]
                gap-5
              "
            >
              <div>
                <p
                  className="
                    font-black
                    uppercase
                    leading-[1.35]
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
                  Leadership
                  Perspective
                </p>

                <div
                  className="
                    mt-2
                    h-0.5
                    w-8
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
                  font-medium
                  leading-[1.5]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6,
                      fontScale
                    ),
                }}
              >
                {resume.summary}
              </p>
            </div>
          </section>
        )}

        {/* Leadership Experience */}

        {visibleExperiences.length >
          0 && (
          <section
            style={
              resume.summary
                ? sectionStyle
                : undefined
            }
          >
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Professional Leadership
            </AuthoritySectionHeading>

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
                    <article
                      key={
                        experience.id
                      }
                      className="
                        border
                        border-zinc-200
                      "
                    >
                      <div
                        className="
                          grid
                          grid-cols-[1fr_auto]
                          items-center
                          gap-4
                          bg-zinc-50
                          px-3
                          py-1.5
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                          "
                        >
                          <span
                            className="
                              h-2
                              w-1
                              shrink-0
                            "
                            style={{
                              backgroundColor:
                                accentColor,
                            }}
                          />

                          <p
                            className="
                              truncate
                              font-black
                              uppercase
                              leading-[1.2]
                              tracking-[0.06em]
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
                            {experience.company ||
                              "Organisation"}

                            {experience.location &&
                              ` · ${experience.location}`}
                          </p>
                        </div>

                        {dateRange && (
                          <p
                            className="
                              shrink-0
                              font-bold
                              uppercase
                              tracking-[0.06em]
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
                            {dateRange}
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          px-3
                          pb-2.5
                          pt-2
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
                          <h4
                            className="
                              font-black
                              leading-[1.2]
                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.4,
                                  fontScale
                                ),
                            }}
                          >
                            {experience.jobTitle ||
                              "Job Title"}
                          </h4>

                          {employmentType && (
                            <span
                              className="
                                shrink-0
                                font-bold
                                uppercase
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
                              {
                                employmentType
                              }
                            </span>
                          )}
                        </div>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-1
                              whitespace-pre-line
                              leading-[1.4]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.6,
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

        {/* Fresher Mode */}

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
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Objective
            </AuthoritySectionHeading>

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
                  font-medium
                  leading-[1.5]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.9,
                      fontScale
                    ),
                }}
              >
                Ambitious
                early-career
                professional prepared
                to contribute strong
                technical,
                analytical, and
                collaborative
                capabilities while
                developing into
                positions of greater
                responsibility and
                leadership.
              </p>
            </div>
          </section>
        )}

        {/* Leadership Capabilities */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Core Capabilities
            </AuthoritySectionHeading>

            <div
              className="
                grid
                grid-cols-3
                border
                border-zinc-200
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
                      border-b
                      border-r
                      border-zinc-200
                      px-2.5
                      py-1.5
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        shrink-0
                      "
                      style={{
                        backgroundColor:
                          accentColor,
                      }}
                    />

                    <p
                      className="
                        font-bold
                        leading-[1.25]
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
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Projects */}

        {visibleProjects.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Strategic Projects
            </AuthoritySectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-3
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
                    <article
                      key={
                        project.id
                      }
                      className="
                        border-l-2
                        border-zinc-200
                        pl-3
                      "
                      style={{
                        borderLeftColor:
                          accentColor,
                      }}
                    >
                      <h4
                        className="
                          font-black
                          leading-[1.2]
                          text-zinc-950
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              5.8,
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
                            font-bold
                            uppercase
                            leading-[1.3]
                            tracking-[0.05em]
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
                              whitespace-pre-line
                              leading-[1.4]
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

                      {(project.projectUrl ||
                        project.githubUrl) && (
                        <p
                          className="
                            mt-1
                            font-black
                            uppercase
                            tracking-[0.08em]
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
                          {project.projectUrl &&
                            "Project"}

                          {project.projectUrl &&
                            project.githubUrl &&
                            " · "}

                          {project.githubUrl &&
                            "Repository"}
                        </p>
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
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </AuthoritySectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-7
                gap-y-2.5
              "
            >
              {visibleEducations.map(
                (education) => {
                  const qualification =
                    [
                      education.degree,
                      education.fieldOfStudy,
                    ]
                      .filter(Boolean)
                      .join(" · ");

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

                  return (
                    <article
                      key={
                        education.id
                      }
                    >
                      <h4
                        className="
                          font-black
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
                                5,
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
                            mt-0.5
                            font-bold
                            uppercase
                            tracking-[0.05em]
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
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* Credentials */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <AuthoritySectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Credentials
            </AuthoritySectionHeading>

            <div
              className="
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
                      font-black
                      uppercase
                      tracking-[0.12em]
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
                                font-bold
                                leading-[1.25]
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
                              {certification.name ||
                                "Certification"}
                            </p>

                            <p
                              className="
                                mt-0.5
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
                          4.3,
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
                      gap-x-4
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
                                font-bold
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
                              {
                                language.name
                              }
                            </p>

                            {proficiency && (
                              <p
                                className="
                                  mt-0.5
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

        {/* Empty State */}

        {!hasResumeContent && (
          <div
            className="
              mt-4
              border
              border-dashed
              border-zinc-300
              p-5
              text-center
            "
          >
            <p
              className="
                font-semibold
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
              Add your resume
              information to see the
              Authority template.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthorityTemplate;