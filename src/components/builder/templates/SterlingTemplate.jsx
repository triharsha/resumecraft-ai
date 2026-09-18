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

const SterlingSectionHeading = ({
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
          gap-3
        "
      >
        <h3
          className="
            shrink-0
            font-bold
            uppercase
            leading-none
            tracking-[0.18em]
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
          {children}
        </h3>

        <div className="flex flex-1 items-center">
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
    </div>
  );
};

const SterlingTemplate = ({
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
      {/* Premium Header */}

      <header
        className="
          px-9
          pb-4
          pt-7
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
            <p
              className="
                mb-2
                font-semibold
                uppercase
                leading-none
                tracking-[0.26em]
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
              Professional Resume
            </p>

            <h2
              className="
                font-serif
                font-semibold
                leading-[0.95]
                tracking-[-0.025em]
                text-zinc-950
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
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
                  font-medium
                  leading-[1.3]
                  tracking-[0.02em]
                  text-zinc-500
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

          {personalInfo.location && (
            <div
              className="
                shrink-0
                border-l
                border-zinc-200
                pl-4
                text-right
              "
            >
              <p
                className="
                  font-semibold
                  uppercase
                  tracking-[0.1em]
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
                Based in
              </p>

              <p
                className="
                  mt-1
                  font-semibold
                  text-zinc-700
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
                  personalInfo.location
                }
              </p>
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
            className="h-0.5 w-20"
            style={{
              backgroundColor:
                accentColor,
            }}
          />

          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        {/* Contact Line */}

        {hasContactInfo && (
          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-x-4
              gap-y-1
            "
          >
            {personalInfo.email && (
              <span
                className="
                  break-all
                  font-medium
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
                  personalInfo.email
                }
              </span>
            )}

            {personalInfo.phone && (
              <span
                className="
                  font-medium
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
                  personalInfo.phone
                }
              </span>
            )}

            {personalInfo.linkedin && (
              <span
                className="
                  break-all
                  font-medium
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
                  personalInfo.linkedin
                }
              </span>
            )}

            {personalInfo.website && (
              <span
                className="
                  break-all
                  font-medium
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
                  personalInfo.website
                }
              </span>
            )}

            {personalInfo.github && (
              <span
                className="
                  break-all
                  font-medium
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
                  personalInfo.github
                }
              </span>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}

      <main
        className="
          px-9
          pb-7
        "
      >
        {/* Profile */}

        {resume.summary && (
          <section>
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </SterlingSectionHeading>

            <div
              className="
                grid
                grid-cols-[20%_1fr]
                gap-5
              "
            >
              <p
                className="
                  font-serif
                  italic
                  leading-[1.35]
                  text-zinc-400
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize:
                    scaledFontSize(
                      5.2,
                      fontScale
                    ),
                }}
              >
                Professional
                perspective
              </p>

              <p
                className="
                  whitespace-pre-line
                  leading-[1.5]
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
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </SterlingSectionHeading>

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
                        grid-cols-[24%_1fr]
                        gap-5
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-semibold
                              uppercase
                              tracking-[0.08em]
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
                            {dateRange}
                          </p>
                        )}

                        {experience.location && (
                          <p
                            className="
                              mt-1
                              leading-[1.35]
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
                          <div>
                            <h4
                              className="
                                font-serif
                                font-semibold
                                leading-[1.2]
                                text-zinc-950
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",
                                fontSize:
                                  scaledFontSize(
                                    6.8,
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
                              {experience.company ||
                                "Organisation"}

                              {employmentType &&
                                ` · ${employmentType}`}
                            </p>
                          </div>

                          <span
                            className="
                              mt-1
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
                        </div>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-1.5
                              leading-[1.45]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.7,
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
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Direction
            </SterlingSectionHeading>

            <div
              className="
                grid
                grid-cols-[20%_1fr]
                gap-5
              "
            >
              <p
                className="
                  font-serif
                  italic
                  text-zinc-400
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize:
                    scaledFontSize(
                      5.1,
                      fontScale
                    ),
                }}
              >
                Early career
              </p>

              <p
                className="
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
                Motivated
                early-career
                professional seeking
                opportunities to
                contribute strong
                technical,
                analytical, and
                collaborative skills
                within a progressive
                organisation.
              </p>
            </div>
          </section>
        )}

        {/* Skills */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Expertise
            </SterlingSectionHeading>

            <div
              className="
                grid
                grid-cols-3
                gap-x-6
                gap-y-1.5
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

                    <span
                      className="
                        font-medium
                        leading-[1.3]
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
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Selected Work
            </SterlingSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-7
                gap-y-3
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
                        border-t
                        border-zinc-200
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
                            font-serif
                            font-semibold
                            leading-[1.2]
                            text-zinc-950
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            fontSize:
                              scaledFontSize(
                                6.1,
                                fontScale
                              ),
                          }}
                        >
                          {project.name ||
                            "Project"}
                        </h4>

                        <span
                          className="
                            mt-1
                            h-px
                            w-5
                            shrink-0
                          "
                          style={{
                            backgroundColor:
                              accentColor,
                          }}
                        />
                      </div>

                      {technologies.length >
                        0 && (
                        <p
                          className="
                            mt-1
                            font-semibold
                            uppercase
                            leading-[1.3]
                            tracking-[0.06em]
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

                      {(project.projectUrl ||
                        project.githubUrl) && (
                        <p
                          className="
                            mt-1
                            font-semibold
                            uppercase
                            tracking-[0.08em]
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
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </SterlingSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-8
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
                      .join(" — ");

                  return (
                    <article
                      key={
                        education.id
                      }
                    >
                      <h4
                        className="
                          font-serif
                          font-semibold
                          leading-[1.25]
                          text-zinc-950
                        "
                        style={{
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          fontSize:
                            scaledFontSize(
                              5.9,
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
            <SterlingSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Credentials
            </SterlingSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-8
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
                      tracking-[0.14em]
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
                                font-semibold
                                leading-[1.3]
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
                                    4.7,
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
                      tracking-[0.14em]
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
                                font-semibold
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
                                      4.6,
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
              border-y
              border-zinc-200
              py-5
              text-center
            "
          >
            <p
              className="
                font-serif
                italic
                leading-[1.4]
                text-zinc-400
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontSize:
                  scaledFontSize(
                    6.1,
                    fontScale
                  ),
              }}
            >
              Add your resume
              details to see the
              Sterling template.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SterlingTemplate;