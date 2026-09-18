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

const AirSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        mb-2.5
        flex
        items-center
        gap-3
      "
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          backgroundColor:
            accentColor,
        }}
      />

      <h3
        className="
          font-medium
          uppercase
          leading-none
          tracking-[0.2em]
          text-zinc-500
        "
        style={{
          fontSize:
            scaledFontSize(
              4.6,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <div className="h-px flex-1 bg-zinc-100" />
    </div>
  );
};

const AirTemplate = ({
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
        11,
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
      <main
        className="
          px-11
          pb-8
          pt-10
        "
      >
        {/* Header */}

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
              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2.5
                "
              >
                <span
                  className="
                    h-px
                    w-8
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />

                <p
                  className="
                    font-medium
                    uppercase
                    tracking-[0.22em]
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
                  Personal Resume
                </p>
              </div>

              <h2
                className="
                  font-light
                  leading-[0.98]
                  tracking-[-0.04em]
                  text-zinc-900
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
                    font-normal
                    leading-[1.35]
                    tracking-[0.01em]
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
                  {
                    personalInfo.jobTitle
                  }
                </p>
              )}
            </div>

            {personalInfo.location && (
              <div
                className="
                  max-w-[28%]
                  pt-1
                  text-right
                "
              >
                <p
                  className="
                    mb-1
                    uppercase
                    tracking-[0.16em]
                    text-zinc-300
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.8,
                        fontScale
                      ),
                  }}
                >
                  Based in
                </p>

                <p
                  className="
                    leading-[1.35]
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
                    personalInfo.location
                  }
                </p>
              </div>
            )}
          </div>

          {contactItems.length >
            0 && (
            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-1
                border-y
                border-zinc-100
                py-2
              "
            >
              {contactItems.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={`${item}-${index}`}
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >
                    {index > 0 && (
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
                    )}

                    <span
                      className="
                        break-all
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
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </header>

        {/* Profile */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </AirSectionHeading>

            <p
              className="
                max-w-[94%]
                whitespace-pre-line
                font-light
                leading-[1.6]
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
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </AirSectionHeading>

            <div className="space-y-3.5">
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
                        grid-cols-[1fr_auto]
                        gap-x-6
                        gap-y-1
                      "
                    >
                      <div className="min-w-0">
                        <h4
                          className="
                            font-medium
                            leading-[1.25]
                            text-zinc-800
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

                        <p
                          className="
                            mt-0.5
                            leading-[1.35]
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
                            pt-0.5
                            text-right
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

                      {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              col-span-2
                              mt-1
                              max-w-[95%]
                              whitespace-pre-line
                              font-light
                              leading-[1.5]
                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.3,
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
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Objective
            </AirSectionHeading>

            <p
              className="
                max-w-[94%]
                font-light
                leading-[1.6]
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
              Early-career
              professional seeking
              an opportunity to
              contribute academic,
              technical, and project
              experience while
              continuing to grow in
              a collaborative
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
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Skills
            </AirSectionHeading>

            <div
              className="
                flex
                flex-wrap
                gap-x-5
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
                        font-light
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
          </section>
        )}

        {/* Projects */}

        {visibleProjects.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Projects
            </AirSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-8
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
                        border-zinc-100
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
                            font-medium
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
                          {project.name ||
                            "Project"}
                        </h4>

                        {(project.projectUrl ||
                          project.githubUrl) && (
                          <span
                            className="
                              shrink-0
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
                            {project.projectUrl
                              ? "View"
                              : "Code"}
                          </span>
                        )}
                      </div>

                      {technologies.length >
                        0 && (
                        <p
                          className="
                            mt-1
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
                              font-light
                              leading-[1.45]
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
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </AirSectionHeading>

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
                        grid-cols-[1fr_auto]
                        gap-x-6
                        gap-y-1
                      "
                    >
                      <div>
                        <h4
                          className="
                            font-medium
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
                          {qualification ||
                            "Qualification"}
                        </h4>

                        {education.institution && (
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
                            {
                              education.institution
                            }

                            {education.location &&
                              ` · ${education.location}`}
                          </p>
                        )}
                      </div>

                      {dateRange && (
                        <p
                          className="
                            shrink-0
                            text-right
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
                            col-span-2
                            mt-0.5
                            whitespace-pre-line
                            font-light
                            leading-[1.45]
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
            <AirSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Additional
            </AirSectionHeading>

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
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-zinc-300
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          3.9,
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
                                font-light
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
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-zinc-300
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          3.9,
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
                                  text-right
                                  font-light
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
              border-zinc-100
              pt-5
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
                    5.5,
                    fontScale
                  ),
              }}
            >
              Add your resume
              information to begin
              shaping the Air
              template.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AirTemplate;