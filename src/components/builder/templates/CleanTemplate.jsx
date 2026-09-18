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

const CleanSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        mb-2
        grid
        grid-cols-[22%_1fr]
        items-center
        gap-4
      "
    >
      <h3
        className="
          font-bold
          uppercase
          leading-none
          tracking-[0.16em]
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
        {children}
      </h3>

      <div className="flex items-center">
        <div
          className="h-px w-8"
          style={{
            backgroundColor:
              accentColor,
          }}
        />

        <div className="h-px flex-1 bg-zinc-200" />
      </div>
    </div>
  );
};

const CleanTemplate = ({
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
        9,
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
          pt-7
        "
      >
        {/* Header */}

        <header>
          <div
            className="
              grid
              grid-cols-[1fr_31%]
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
                    h-px
                    w-7
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />

                <p
                  className="
                    font-semibold
                    uppercase
                    leading-none
                    tracking-[0.2em]
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
                  Curriculum Vitae
                </p>
              </div>

              <h2
                className="
                  font-semibold
                  leading-[0.95]
                  tracking-[-0.035em]
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      19,
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
                    font-medium
                    leading-[1.3]
                    text-zinc-500
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        6.3,
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

            {hasContactInfo && (
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
                    font-semibold
                    uppercase
                    tracking-[0.14em]
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
                  Contact
                </p>

                <div className="space-y-1">
                  {personalInfo.email && (
                    <p
                      className="
                        break-all
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
                      {
                        personalInfo.email
                      }
                    </p>
                  )}

                  {personalInfo.phone && (
                    <p
                      className="text-zinc-600"
                      style={{
                        fontSize:
                          scaledFontSize(
                            4.7,
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
                      className="text-zinc-600"
                      style={{
                        fontSize:
                          scaledFontSize(
                            4.7,
                            fontScale
                          ),
                      }}
                    >
                      {
                        personalInfo.location
                      }
                    </p>
                  )}

                  {personalInfo.linkedin && (
                    <p
                      className="
                        break-all
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
                      {
                        personalInfo.linkedin
                      }
                    </p>
                  )}

                  {personalInfo.website && (
                    <p
                      className="
                        break-all
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
                      {
                        personalInfo.website
                      }
                    </p>
                  )}

                  {personalInfo.github && (
                    <p
                      className="
                        break-all
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
                      {
                        personalInfo.github
                      }
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="
              mt-4
              flex
              items-center
            "
          >
            <div
              className="h-0.5 w-14"
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div className="h-px flex-1 bg-zinc-200" />
          </div>
        </header>

        {/* Summary */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </CleanSectionHeading>

            <div
              className="
                grid
                grid-cols-[22%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-medium
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
                Professional
                overview
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

        {/* Experience */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </CleanSectionHeading>

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

                      <div className="min-w-0">
                        <h4
                          className="
                            font-semibold
                            leading-[1.2]
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
                          {experience.jobTitle ||
                            "Job Title"}
                        </h4>

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
                              leading-[1.45]
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
          <section
            style={sectionStyle}
          >
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Objective
            </CleanSectionHeading>

            <div
              className="
                grid
                grid-cols-[22%_1fr]
                gap-4
              "
            >
              <p
                className="
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
                Career focus
              </p>

              <p
                className="
                  leading-[1.5]
                  text-zinc-600
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.7,
                      fontScale
                    ),
                }}
              >
                Early-career
                professional seeking
                an opportunity to
                apply technical,
                academic, and project
                experience while
                developing within a
                collaborative
                professional team.
              </p>
            </div>
          </section>
        )}

        {/* Skills */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Skills
            </CleanSectionHeading>

            <div
              className="
                grid
                grid-cols-[22%_1fr]
                gap-4
              "
            >
              <p
                className="
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
                Core capabilities
              </p>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-x-4
                  gap-y-1
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
                          h-px
                          w-3
                          shrink-0
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
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Projects
            </CleanSectionHeading>

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
                        <h4
                          className="
                            font-semibold
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
                          {project.name ||
                            "Project"}
                        </h4>

                        {(project.projectUrl ||
                          project.githubUrl) && (
                          <p
                            className="
                              mt-1
                              font-semibold
                              uppercase
                              tracking-[0.07em]
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
                              font-medium
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
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </CleanSectionHeading>

            <div className="space-y-2">
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
                      className="
                        grid
                        grid-cols-[22%_1fr]
                        gap-4
                      "
                    >
                      <p
                        className="
                          border-r
                          border-zinc-200
                          pr-3
                          font-medium
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
                        {dateRange}
                      </p>

                      <div>
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
                          {qualification ||
                            "Qualification"}
                        </h4>

                        {education.institution && (
                          <p
                            className="
                              mt-0.5
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
                            {
                              education.institution
                            }

                            {education.location &&
                              ` · ${education.location}`}
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
            <CleanSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Additional
            </CleanSectionHeading>

            <div
              className="
                grid
                grid-cols-[22%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-medium
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
                Credentials &
                languages
              </p>

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
                        font-semibold
                        uppercase
                        tracking-[0.12em]
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
                                      4.9,
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
                        font-semibold
                        uppercase
                        tracking-[0.12em]
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
                              className="
                                flex
                                items-baseline
                                justify-between
                                gap-3
                              "
                            >
                              <p
                                className="
                                  font-medium
                                  text-zinc-700
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
                                  language.name
                                }
                              </p>

                              {proficiency && (
                                <p
                                  className="
                                    text-right
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
              text-center
            "
          >
            <p
              className="
                font-medium
                leading-[1.4]
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.8,
                    fontScale
                  ),
              }}
            >
              Add your resume
              information to see the
              Clean template.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CleanTemplate;