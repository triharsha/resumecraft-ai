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

const CorporateSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div className="mb-2">
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span
          className="
            h-3
            w-1
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
            tracking-[0.14em]
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
          {children}
        </h3>
      </div>

      <div className="mt-1.5 h-px bg-zinc-200" />
    </div>
  );
};

const CorporateTemplate = ({
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
        education.institution ||
        education.degree ||
        education.fieldOfStudy ||
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
      {/* Header */}

      <header
        className="
          border-b
          border-zinc-300
          px-8
          pb-4
          pt-6
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
          <div className="min-w-0">
            <p
              className="
                mb-2
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
                    4.8,
                    fontScale
                  ),
              }}
            >
              Corporate Profile
            </p>

            <h2
              className="
                font-black
                uppercase
                leading-[0.95]
                tracking-[-0.035em]
                text-zinc-950
              "
              style={{
                fontSize:
                  scaledFontSize(
                    18.5,
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
                  text-zinc-600
                "
                style={{
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

          <div
            className="
              shrink-0
              text-right
            "
          >
            {personalInfo.location && (
              <p
                className="
                  font-semibold
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
                {
                  personalInfo.location
                }
              </p>
            )}

            <div
              className="
                mt-2
                h-1
                w-12
                ml-auto
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
            />
          </div>
        </div>
      </header>

      {/* Contact Band */}

      {hasContactInfo && (
        <div
          className="
            grid
            grid-cols-3
            gap-x-4
            gap-y-1.5

            bg-zinc-950

            px-8
            py-2.5
          "
        >
          {personalInfo.email && (
            <p
              className="
                break-all
                font-medium
                leading-[1.3]
                text-zinc-200
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
                personalInfo.email
              }
            </p>
          )}

          {personalInfo.phone && (
            <p
              className="
                font-medium
                leading-[1.3]
                text-zinc-200
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
                personalInfo.phone
              }
            </p>
          )}

          {personalInfo.linkedin && (
            <p
              className="
                break-all
                font-medium
                leading-[1.3]
                text-zinc-200
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
                personalInfo.linkedin
              }
            </p>
          )}

          {personalInfo.website && (
            <p
              className="
                break-all
                font-medium
                leading-[1.3]
                text-zinc-200
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
                personalInfo.website
              }
            </p>
          )}

          {personalInfo.github && (
            <p
              className="
                break-all
                font-medium
                leading-[1.3]
                text-zinc-200
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
                personalInfo.github
              }
            </p>
          )}

          {personalInfo.location && (
            <p
              className="
                font-medium
                leading-[1.3]
                text-zinc-200
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
                personalInfo.location
              }
            </p>
          )}
        </div>
      )}

      {/* Body */}

      <div
        className="
          px-8
          pb-6
          pt-4
        "
      >
        {/* Summary */}

        {resume.summary && (
          <section>
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Professional Summary
            </CorporateSectionHeading>

            <div
              className="
                grid
                grid-cols-[18%_1fr]
                gap-4
              "
            >
              <div>
                <p
                  className="
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
                  Profile
                </p>
              </div>

              <p
                className="
                  whitespace-pre-line
                  leading-[1.45]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6.1,
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
            style={
              resume.summary
                ? sectionStyle
                : undefined
            }
          >
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career History
            </CorporateSectionHeading>

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
                      <div
                        className="
                          border-r
                          border-zinc-200
                          pr-3
                        "
                      >
                        {dateRange && (
                          <p
                            className="
                              font-black
                              uppercase
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

                      <div className="min-w-0">
                        <h4
                          className="
                            font-black
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
                          {experience.jobTitle ||
                            "Job Title"}
                        </h4>

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
                                  5.8,
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
          <section
            style={
              resume.summary
                ? sectionStyle
                : undefined
            }
          >
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Objective
            </CorporateSectionHeading>

            <p
              className="
                leading-[1.45]
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
              Early-career candidate
              focused on applying
              academic knowledge,
              technical capability,
              project experience, and
              professional skills in a
              structured business
              environment.
            </p>
          </section>
        )}

        {/* Competencies */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Core Competencies
            </CorporateSectionHeading>

            <div
              className="
                grid
                grid-cols-4
                gap-1.5
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
                      border
                      border-zinc-200
                      bg-zinc-50
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
                            5.2,
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
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Key Projects
            </CorporateSectionHeading>

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
                    <article
                      key={
                        project.id
                      }
                      className="
                        grid
                        grid-cols-[25%_1fr]
                        gap-4
                      "
                    >
                      <div>
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

                        {(project.projectUrl ||
                          project.githubUrl) && (
                          <p
                            className="
                              mt-1
                              font-bold
                              uppercase
                              tracking-[0.08em]
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
                            {project.projectUrl &&
                              "Live"}

                            {project.projectUrl &&
                              project.githubUrl &&
                              " · "}

                            {project.githubUrl &&
                              "Code"}
                          </p>
                        )}
                      </div>

                      <div>
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
      leading-[1.4]
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
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </CorporateSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-6
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
                              5.8,
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
                                5.2,
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
                            font-medium
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
                                5.1,
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

        {/* Additional */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <CorporateSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Professional Development
            </CorporateSectionHeading>

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
                          4.6,
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
                                    5.4,
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
                                    4.9,
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
                          4.6,
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
                                font-bold
                                leading-[1.25]
                                text-zinc-800
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
                                      4.7,
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

        {!hasResumeContent && (
          <div
            className="
              mt-3
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
                    6.2,
                    fontScale
                  ),
              }}
            >
              Add your resume
              information to see your
              live Corporate preview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateTemplate;