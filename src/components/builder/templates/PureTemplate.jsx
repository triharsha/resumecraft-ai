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

const PureSectionHeading = ({
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
        gap-2.5
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

      <h3
        className="
          font-bold
          uppercase
          leading-none
          tracking-[0.18em]
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
        {children}
      </h3>
    </div>
  );
};

const PureTemplate = ({
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
        11,
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
      <main
        className="
          px-10
          pb-8
          pt-8
        "
      >
        {/* Identity */}

        <header>
          <div
            className="
              flex
              items-start
              justify-between
              gap-8
            "
          >
            <div className="min-w-0">
              <h2
                className="
                  font-light
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-zinc-950
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
                    mt-2
                    font-medium
                    leading-[1.3]
                    tracking-[0.015em]
                    text-zinc-500
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        6.5,
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
                mt-1
                flex
                shrink-0
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                "
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <span
                className="
                  font-semibold
                  uppercase
                  tracking-[0.16em]
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
                Resume
              </span>
            </div>
          </div>

          {/* Contact */}

          {hasContactInfo && (
            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-x-3
                gap-y-1
                border-y
                border-zinc-200
                py-2
              "
            >
              {personalInfo.email && (
                <span
                  className="
                    break-all
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
                  {
                    personalInfo.email
                  }
                </span>
              )}

              {personalInfo.phone && (
                <span
                  className="text-zinc-500"
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
                </span>
              )}

              {personalInfo.location && (
                <span
                  className="text-zinc-500"
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
                </span>
              )}

              {personalInfo.linkedin && (
                <span
                  className="
                    break-all
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
                  {
                    personalInfo.linkedin
                  }
                </span>
              )}

              {personalInfo.website && (
                <span
                  className="
                    break-all
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
                  {
                    personalInfo.website
                  }
                </span>
              )}

              {personalInfo.github && (
                <span
                  className="
                    break-all
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
                  {
                    personalInfo.github
                  }
                </span>
              )}
            </div>
          )}
        </header>

        {/* Summary */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </PureSectionHeading>

            <p
              className="
                whitespace-pre-line
                leading-[1.55]
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
              {resume.summary}
            </p>
          </section>
        )}

        {/* Experience */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </PureSectionHeading>

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
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-5
                        "
                      >
                        <div className="min-w-0">
                          <h4
                            className="
                              font-semibold
                              leading-[1.25]
                              text-zinc-900
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.2,
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
                                  5.2,
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
                              font-medium
                              leading-[1.3]
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
                      </div>

                      {experience.description && (
                        <ResumeDescription
                          description={
                            experience.description
                          }
                          className="
                            mt-1.5
                            leading-[1.5]
                            text-zinc-600
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
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Objective
            </PureSectionHeading>

            <p
              className="
                leading-[1.55]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.9,
                    fontScale
                  ),
              }}
            >
              Early-career
              professional seeking
              an opportunity to apply
              academic knowledge,
              technical skills, and
              project experience in a
              collaborative
              professional
              environment.
            </p>
          </section>
        )}

        {/* Skills */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Skills
            </PureSectionHeading>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-2
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
                        font-medium
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
                      {skill}
                    </span>

                    {index <
                      skills.length -
                        1 && (
                      <span
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-zinc-300
                        "
                      />
                    )}
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
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Projects
            </PureSectionHeading>

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
                        {project.name ||
                          "Project"}
                      </h4>

                      {technologies.length >
                        0 && (
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
                            font-semibold
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
                            "Live"}

                          {project.projectUrl &&
                            project.githubUrl &&
                            " · "}

                          {project.githubUrl &&
                            "Code"}
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
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </PureSectionHeading>

            <div className="space-y-2.5">
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
                      className="
                        flex
                        items-start
                        justify-between
                        gap-5
                      "
                    >
                      <div className="min-w-0">
                        <h4
                          className="
                            font-semibold
                            leading-[1.25]
                            text-zinc-900
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

                      {dateRange && (
                        <p
                          className="
                            shrink-0
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
                      )}
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* Certifications + Languages */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <PureSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Additional
            </PureSectionHeading>

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
                                    4.5,
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
                                font-medium
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
              mt-8
              border-t
              border-zinc-200
              pt-5
              text-center
            "
          >
            <p
              className="
                font-light
                leading-[1.5]
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
              Pure template.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PureTemplate;