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

  fluent:
    "Fluent",

  professional:
    "Professional Working",

  intermediate:
    "Intermediate",

  basic:
    "Basic",
};

/* ========================================
   Section Heading
======================================== */

const ExecutiveSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div className="mb-2">
      <h3
        className="
          font-bold
          uppercase
          leading-none
          tracking-[0.18em]
          text-zinc-950
        "
        style={{
          fontSize:
            scaledFontSize(
              6.7,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <div
        className="
          mt-1.5
          flex
          items-center
        "
      >
        <span
          className="h-[2px] w-9"
          style={{
            backgroundColor:
              accentColor,
          }}
        />

        <span
          className="
            h-px
            flex-1
            bg-zinc-200
          "
        />
      </div>
    </div>
  );
};

/* ========================================
   Executive Template
======================================== */

const ExecutiveTemplate = ({
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
        text-zinc-900
      "
    >
      {/* =====================================
          Executive Header
      ===================================== */}

      <header
        className="
          border-b
          border-zinc-200
          px-8
          pb-4
          pt-6
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-6
          "
        >
          <div className="min-w-0">
            <p
              className="
                mb-2
                font-bold
                uppercase
                leading-none
                tracking-[0.22em]
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
              Executive Resume
            </p>

            <h2
              className="
                font-semibold
                leading-[0.95]
                tracking-[-0.035em]
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
                  font-semibold
                  leading-[1.25]
                  text-zinc-600
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      7.1,
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
            <p
              className="
                shrink-0
                pb-0.5
                text-right
                font-medium
                leading-[1.3]
                text-zinc-500
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
          )}
        </div>
      </header>

      {/* =====================================
          Contact Line
      ===================================== */}

      {hasContactInfo && (
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-2
            gap-y-1

            bg-zinc-50

            px-8
            py-2
          "
          style={{
            fontSize:
              scaledFontSize(
                5,
                fontScale
              ),
          }}
        >
          {personalInfo.email && (
            <span
              className="
                break-all
                font-medium
                text-zinc-600
              "
            >
              {personalInfo.email}
            </span>
          )}

          {personalInfo.email &&
            personalInfo.phone && (
              <span
                style={{
                  color:
                    accentColor,
                }}
              >
                •
              </span>
            )}

          {personalInfo.phone && (
            <span
              className="
                font-medium
                text-zinc-600
              "
            >
              {personalInfo.phone}
            </span>
          )}

          {(personalInfo.email ||
            personalInfo.phone) &&
            personalInfo.linkedin && (
              <span
                style={{
                  color:
                    accentColor,
                }}
              >
                •
              </span>
            )}

          {personalInfo.linkedin && (
            <span
              className="
                break-all
                font-medium
                text-zinc-600
              "
            >
              {
                personalInfo.linkedin
              }
            </span>
          )}

          {(personalInfo.email ||
            personalInfo.phone ||
            personalInfo.linkedin) &&
            personalInfo.website && (
              <span
                style={{
                  color:
                    accentColor,
                }}
              >
                •
              </span>
            )}

          {personalInfo.website && (
            <span
              className="
                break-all
                font-medium
                text-zinc-600
              "
            >
              {
                personalInfo.website
              }
            </span>
          )}

          {(personalInfo.email ||
            personalInfo.phone ||
            personalInfo.linkedin ||
            personalInfo.website) &&
            personalInfo.github && (
              <span
                style={{
                  color:
                    accentColor,
                }}
              >
                •
              </span>
            )}

          {personalInfo.github && (
            <span
              className="
                break-all
                font-medium
                text-zinc-600
              "
            >
              {
                personalInfo.github
              }
            </span>
          )}
        </div>
      )}

      {/* =====================================
          Resume Body
      ===================================== */}

      <div
        className="
          px-8
          pb-6
          pt-4
        "
      >
        {/* Executive Profile */}

        {resume.summary && (
          <section>
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Executive Profile
            </ExecutiveSectionHeading>

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
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Professional Experience
            </ExecutiveSectionHeading>

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
                        grid
                        grid-cols-[23%_1fr]
                        gap-5
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
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

                      <div
                        className="
                          border-l
                          border-zinc-200
                          pl-4
                        "
                      >
                        <h4
                          className="
                            font-bold
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
                                5.2,
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

        {/* =====================================
            Fresher
        ===================================== */}

        {isFresher &&
          visibleExperiences.length ===
            0 && (
          <section
            style={sectionStyle}
          >
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Objective
            </ExecutiveSectionHeading>

            <p
              className="
                leading-[1.5]
                text-zinc-700
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
              professional seeking an
              opportunity to apply
              academic, technical, and
              project experience while
              contributing to a
              collaborative
              professional team.
            </p>
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
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education
            </ExecutiveSectionHeading>

            <div className="space-y-2.5">
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
                        grid-cols-[23%_1fr]
                        gap-5
                      "
                    >
                      <div>
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
                                  4.9,
                                  fontScale
                                ),
                            }}
                          >
                            {dateRange}
                          </p>
                        )}

                        {education.location && (
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
                              education.location
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
                        <h4
                          className="
                            font-bold
                            leading-[1.25]
                            text-zinc-950
                          "
                          style={{
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
                            "
                            style={{
                              color:
                                accentColor,

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
                      </div>
                    </article>
                  );
                }
              )}
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
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Core Competencies
            </ExecutiveSectionHeading>

            <div
              className="
                grid
                grid-cols-3
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
                        h-1.5
                        w-1.5
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
                            5.1,
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
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Selected Projects
            </ExecutiveSectionHeading>

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
                        grid-cols-[23%_1fr]
                        gap-5
                      "
                    >
                      <div>
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
                                4.5,
                                fontScale
                              ),
                          }}
                        >
                          Project
                        </p>

                        {technologies.length >
                          0 && (
                          <p
                            className="
                              mt-1
                              leading-[1.35]
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
                            {technologies.join(
                              " · "
                            )}
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
                            font-bold
                            leading-[1.25]
                            text-zinc-950
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.9,
                                fontScale
                              ),
                          }}
                        >
                          {project.name ||
                            "Project"}
                        </h4>

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

        {/* =====================================
            Certifications
        ===================================== */}

        {visibleCertifications.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Certifications
            </ExecutiveSectionHeading>

            <div
              className="
                grid
                grid-cols-2
                gap-x-6
                gap-y-2
              "
            >
              {visibleCertifications.map(
                (certification) => (
                  <div
                    key={
                      certification.id
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
                    <p
                      className="
                        font-bold
                        leading-[1.25]
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
                      {
                        certification.name
                      }
                    </p>

                    {(certification.issuer ||
                      certification.issueDate) && (
                      <p
                        className="
                          mt-0.5
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
                        {[
                          certification.issuer,
                          formatMonth(
                            certification.issueDate
                          ),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Languages
        ===================================== */}

        {visibleLanguages.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <ExecutiveSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Languages
            </ExecutiveSectionHeading>

            <div
              className="
                flex
                flex-wrap
                gap-x-6
                gap-y-1.5
              "
            >
              {visibleLanguages.map(
                (language) => {
                  const proficiency =
                    languageProficiencyLabels[
                      language.proficiency
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
                        gap-2
                      "
                    >
                      <span
                        className="
                          font-bold
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
                        {language.name}
                      </span>

                      {proficiency && (
                        <span
                          className="
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
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Empty Resume State
        ===================================== */}

        {!hasResumeContent && (
          <section
            className="
              mt-12
              border
              border-dashed
              border-zinc-300
              px-6
              py-8
              text-center
            "
          >
            <p
              className="
                font-semibold
                text-zinc-500
              "
              style={{
                fontSize:
                  scaledFontSize(
                    6,
                    fontScale
                  ),
              }}
            >
              Start adding your
              professional information
              to build your resume.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;