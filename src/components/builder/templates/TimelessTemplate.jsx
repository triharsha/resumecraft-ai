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

const TimelessSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        border-b
        border-zinc-200
        pb-1.5
      "
    >
      <span
        className="
          h-2
          w-[3px]
          shrink-0
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <h3
        className="
          font-semibold
          uppercase
          leading-none
          tracking-[0.16em]
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
        {children}
      </h3>
    </div>
  );
};

/* ========================================
   Timeless Template
======================================== */

const TimelessTemplate = ({
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
      <div
        className="
          px-10
          pb-8
          pt-9
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <header>
          <div
            className="
              grid
              grid-cols-[1fr_36%]
              items-end
              gap-7
            "
          >
            <div className="min-w-0">
              <p
                className="
                  mb-2
                  font-medium
                  uppercase
                  leading-none
                  tracking-[0.22em]
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
                Professional Resume
              </p>

              <h2
                className="
                  font-serif
                  font-normal
                  leading-[0.95]
                  tracking-[-0.025em]
                  text-zinc-950
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize:
                    scaledFontSize(
                      21,
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
                    leading-[1.25]
                  "
                  style={{
                    color:
                      accentColor,

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
                  border-l
                  border-zinc-200
                  pl-4
                "
              >
                <p
                  className="
                    font-medium
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
                  Location
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    leading-[1.3]
                    text-zinc-700
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",

                    fontSize:
                      scaledFontSize(
                        5.6,
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
              className="
                h-[3px]
                w-16
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div
              className="
                h-px
                flex-1
                bg-zinc-300
              "
            />
          </div>

          {/* Contact Line */}

          {hasContactInfo && (
            <div
              className="
                mt-2.5
                flex
                flex-wrap
                items-center
                gap-x-2
                gap-y-1
              "
            >
              {[
                personalInfo.email,
                personalInfo.phone,
                personalInfo.website,
                personalInfo.linkedin,
                personalInfo.github,
              ]
                .filter(Boolean)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item}-${index}`}
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      {index > 0 && (
                        <span
                          className="
                            h-1
                            w-1
                            rounded-full
                            bg-zinc-300
                          "
                          aria-hidden="true"
                        />
                      )}

                      <span
                        className="
                          break-all
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
                        {item}
                      </span>
                    </div>
                  )
                )}
            </div>
          )}
        </header>

        {/* =====================================
            Profile
        ===================================== */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </TimelessSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-[20%_1fr]
                gap-5
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
                      5,
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

        {/* =====================================
            Experience
        ===================================== */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </TimelessSectionHeading>

            <div className="mt-2.5 space-y-3">
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
                        grid-cols-[20%_1fr]
                        gap-5
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-serif
                              italic
                              leading-[1.3]
                              text-zinc-500
                            "
                            style={{
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",

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

                      <div>
                        <div
                          className="
                            flex
                            items-baseline
                            justify-between
                            gap-3
                          "
                        >
                          <h4
                            className="
                              font-serif
                              font-bold
                              leading-[1.2]
                              text-zinc-950
                            "
                            style={{
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",

                              fontSize:
                                scaledFontSize(
                                  6.6,
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
                                font-medium
                                uppercase
                                tracking-[0.08em]
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
                              {
                                employmentType
                              }
                            </span>
                          )}
                        </div>

                        <p
                          className="
                            mt-0.5
                            font-semibold
                            leading-[1.3]
                          "
                          style={{
                            color:
                              accentColor,

                            fontSize:
                              scaledFontSize(
                                5.4,
                                fontScale
                              ),
                          }}
                        >
                          {experience.company ||
                            "Organisation"}
                        </p>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-1
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

        {/* =====================================
            Fresher
        ===================================== */}

        {isFresher &&
          visibleExperiences.length ===
            0 && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Objective
            </TimelessSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-[20%_1fr]
                gap-5
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
                      5,
                      fontScale
                    ),
                }}
              >
                Early Career
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
                Motivated early-career
                professional ready to
                contribute academic
                knowledge, project
                experience, technical
                skills, and a strong
                willingness to learn.
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Skills
        ===================================== */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Expertise
            </TimelessSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-4
                gap-x-4
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
                        font-medium
                        leading-[1.3]
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
                      {skill}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Projects
        ===================================== */}

        {visibleProjects.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Selected Projects
            </TimelessSectionHeading>

            <div
              className="
                mt-2.5
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
                      key={project.id}
                      className="
                        border-t
                        border-zinc-200
                        pt-2
                      "
                    >
                      <h4
                        className="
                          font-serif
                          font-bold
                          leading-[1.25]
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

                      {technologies.length >
                        0 && (
                        <p
                          className="
                            mt-0.5
                            font-medium
                            leading-[1.3]
                          "
                          style={{
                            color:
                              accentColor,

                            fontSize:
                              scaledFontSize(
                                4.9,
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
                                5.4,
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
                            font-serif
                            italic
                            leading-[1.3]
                            text-zinc-400
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",

                            fontSize:
                              scaledFontSize(
                                4.7,
                                fontScale
                              ),
                          }}
                        >
                          {project.projectUrl &&
                            "Project Link"}

                          {project.projectUrl &&
                            project.githubUrl &&
                            " · "}

                          {project.githubUrl &&
                            "Source Code"}
                        </p>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Education
        ===================================== */}

        {visibleEducations.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </TimelessSectionHeading>

            <div className="mt-2.5 space-y-2.5">
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
                      .join(", ");

                  return (
                    <article
                      key={
                        education.id
                      }
                      className="
                        grid
                        grid-cols-[20%_1fr]
                        gap-5
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-serif
                              italic
                              leading-[1.3]
                              text-zinc-500
                            "
                            style={{
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",

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
                      </div>

                      <div>
                        <h4
                          className="
                            font-serif
                            font-bold
                            leading-[1.25]
                            text-zinc-950
                          "
                          style={{
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",

                            fontSize:
                              scaledFontSize(
                                6,
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
                              font-medium
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
                                  5.2,
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

        {/* =====================================
            Credentials
        ===================================== */}

        {(visibleCertifications.length >
          0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <TimelessSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Credentials
            </TimelessSectionHeading>

            <div
              className="
                mt-2.5
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
                      font-medium
                      uppercase
                      tracking-[0.13em]
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
                                font-serif
                                font-bold
                                leading-[1.25]
                                text-zinc-800
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",

                                fontSize:
                                  scaledFontSize(
                                    5.5,
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
                                  .filter(
                                    Boolean
                                  )
                                  .join(
                                    " · "
                                  )}
                              </p>
                            )}
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
                      tracking-[0.13em]
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
                                font-serif
                                font-bold
                                leading-[1.25]
                                text-zinc-800
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",

                                fontSize:
                                  scaledFontSize(
                                    5.4,
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
                                  shrink-0
                                  font-serif
                                  italic
                                  leading-[1.25]
                                  text-zinc-400
                                "
                                style={{
                                  fontFamily:
                                    "Georgia, 'Times New Roman', serif",

                                  fontSize:
                                    scaledFontSize(
                                      4.8,
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

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-8
              border-y
              border-zinc-200
              py-5
            "
          >
            <p
              className="
                text-center
                font-serif
                italic
                leading-[1.5]
                text-zinc-400
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  scaledFontSize(
                    6,
                    fontScale
                  ),
              }}
            >
              Add your resume
              information to begin
              your Timeless profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelessTemplate;