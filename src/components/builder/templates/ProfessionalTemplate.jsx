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
   Main Heading
======================================== */

const MainSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        mb-1.5
        border-b
        pb-1
      "
      style={{
        borderColor:
          accentColor,
      }}
    >
      <h3
        className="
          font-black
          uppercase
          leading-none
          tracking-[0.13em]
        "
        style={{
          fontSize:
            scaledFontSize(
              7.3,
              fontScale
            ),

          color:
            accentColor,
        }}
      >
        {children}
      </h3>
    </div>
  );
};

/* ========================================
   Sidebar Heading
======================================== */

const SidebarSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <h3
      className="
        mb-1.5
        font-black
        uppercase
        leading-none
        tracking-[0.13em]
      "
      style={{
        fontSize:
          scaledFontSize(
            6.7,
            fontScale
          ),

        color:
          accentColor,
      }}
    >
      {children}
    </h3>
  );
};

/* ========================================
   Professional Template
======================================== */

const ProfessionalTemplate = ({
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

  const hasContact =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location ||
    personalInfo.website ||
    personalInfo.linkedin ||
    personalInfo.github;

  const sectionStyle = {
    marginTop:
      scaledSpacing(
        12,
        spacingScale
      ),
  };

  return (
    <div
      ref={contentRef}
      className="
        absolute
        inset-0
        bg-white
      "
    >
      {/* Header */}

      <header
        className="
          border-b
          border-zinc-200
          px-6
          pb-3
          pt-5

          sm:px-7
          sm:pt-6
        "
      >
        <h2
          className="
            font-black
            uppercase
            leading-none
            tracking-[0.025em]
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
              mt-1
              font-bold
              leading-tight
              tracking-[0.02em]
            "
            style={{
              fontSize:
                scaledFontSize(
                  8,
                  fontScale
                ),

              color:
                accentColor,
            }}
          >
            {
              personalInfo.jobTitle
            }
          </p>
        )}
      </header>

      {/* Two Columns */}

      <div
        className="
          grid
          grid-cols-[31%_69%]
        "
        style={{
          minHeight:
            "calc(100% - 76px)",
        }}
      >
        {/* Sidebar */}

        <aside
          className="
            min-w-0
            bg-zinc-100
            px-4
            py-4

            sm:px-5
          "
        >
          {hasContact && (
            <section>
              <SidebarSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Contact
              </SidebarSectionHeading>

              <div
                className="
                  space-y-1
                  break-all
                  leading-[1.35]
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
                {personalInfo.email && (
                  <p>
                    {
                      personalInfo.email
                    }
                  </p>
                )}

                {personalInfo.phone && (
                  <p>
                    {
                      personalInfo.phone
                    }
                  </p>
                )}

                {personalInfo.location && (
                  <p>
                    {
                      personalInfo.location
                    }
                  </p>
                )}

                {personalInfo.website && (
                  <p>
                    {
                      personalInfo.website
                    }
                  </p>
                )}

                {personalInfo.linkedin && (
                  <p>
                    {
                      personalInfo.linkedin
                    }
                  </p>
                )}

                {personalInfo.github && (
                  <p>
                    {
                      personalInfo.github
                    }
                  </p>
                )}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section
              style={
                hasContact
                  ? sectionStyle
                  : undefined
              }
            >
              <SidebarSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Skills
              </SidebarSectionHeading>

              <div
                className="
                  flex
                  flex-wrap
                  gap-1
                "
              >
                {skills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="
                        rounded
                        bg-white
                        px-1.5
                        py-0.5
                        font-semibold
                        leading-[1.3]
                        text-zinc-700
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            5.6,
                            fontScale
                          ),
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </section>
          )}

          {visibleCertifications.length >
            0 && (
            <section style={sectionStyle}>
              <SidebarSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Certifications
              </SidebarSectionHeading>

              <div className="space-y-2">
                {visibleCertifications.map(
                  (certification) => (
                    <div
                      key={
                        certification.id
                      }
                    >
                      <p
                        className="
                          font-bold
                          leading-[1.3]
                          text-zinc-800
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              6,
                              fontScale
                            ),
                        }}
                      >
                        {certification.name ||
                          "Certification"}
                      </p>

                      {certification.issuer && (
                        <p
                          className="
                            mt-0.5
                            leading-[1.3]
                            text-zinc-500
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.5,
                                fontScale
                              ),
                          }}
                        >
                          {
                            certification.issuer
                          }
                        </p>
                      )}

                      {certification.issueDate && (
                        <p
                          className="
                            mt-0.5
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.3,
                                fontScale
                              ),
                          }}
                        >
                          {formatMonth(
                            certification.issueDate
                          )}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {visibleLanguages.length >
            0 && (
            <section style={sectionStyle}>
              <SidebarSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Languages
              </SidebarSectionHeading>

              <div className="space-y-1.5">
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
                      >
                        <p
                          className="
                            font-bold
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
                                  5.2,
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

        {/* Main */}

        <main
          className="
            min-w-0
            px-5
            py-4

            sm:px-6
          "
        >
          {resume.summary && (
            <section>
              <MainSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Professional Summary
              </MainSectionHeading>

              <p
                className="
                  whitespace-pre-line
                  leading-[1.4]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6.5,
                      fontScale
                    ),
                }}
              >
                {resume.summary}
              </p>
            </section>
          )}

          {visibleExperiences.length >
            0 && (
            <section
              style={
                resume.summary
                  ? sectionStyle
                  : undefined
              }
            >
              <MainSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Experience
              </MainSectionHeading>

              <div className="space-y-2">
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
                      <div
                        key={
                          experience.id
                        }
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >
                          <p
                            className="
                              min-w-0
                              font-black
                              leading-[1.3]
                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  7,
                                  fontScale
                                ),
                            }}
                          >
                            {experience.jobTitle ||
                              "Job Title"}
                          </p>

                          {dateRange && (
                            <p
                              className="
                                shrink-0
                                text-right
                                font-semibold
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    5.3,
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
                          {experience.company ||
                            "Organisation"}

                          {employmentType &&
                            ` • ${employmentType}`}

                          {experience.location &&
                            ` • ${experience.location}`}
                        </p>

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-1
                              leading-[1.38]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.2,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

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
                <MainSectionHeading
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Profile
                </MainSectionHeading>

                <p
                  className="
                    leading-[1.4]
                    text-zinc-600
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        6.2,
                        fontScale
                      ),
                  }}
                >
                  Fresher profile.
                  Education, technical
                  skills, projects,
                  internships, and
                  certifications can
                  be highlighted as
                  primary resume
                  strengths.
                </p>
              </section>
            )}

          {visibleEducations.length >
            0 && (
            <section style={sectionStyle}>
              <MainSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Education
              </MainSectionHeading>

              <div className="space-y-2">
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
                        .join(" — ");

                    return (
                      <div
                        key={
                          education.id
                        }
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >
                          <p
                            className="
                              min-w-0
                              font-black
                              text-zinc-950
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.8,
                                  fontScale
                                ),
                            }}
                          >
                            {qualification ||
                              "Qualification"}
                          </p>

                          {dateRange && (
                            <p
                              className="
                                shrink-0
                                font-semibold
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    5.3,
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
                            education.institution
                          }

                          {education.location &&
                            ` • ${education.location}`}
                        </p>

                        {education.description && (
                          <p
                            className="
                              mt-1
                              whitespace-pre-line
                              leading-[1.38]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.2,
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
                    );
                  }
                )}
              </div>
            </section>
          )}

          {visibleProjects.length >
            0 && (
            <section style={sectionStyle}>
              <MainSectionHeading
                accentColor={
                  accentColor
                }
                fontScale={
                  fontScale
                }
              >
                Projects
              </MainSectionHeading>

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
                      <div
                        key={
                          project.id
                        }
                      >
                        <p
                          className="
                            font-black
                            text-zinc-950
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6.8,
                                fontScale
                              ),
                          }}
                        >
                          {project.name ||
                            "Project"}
                        </p>

                        {technologies.length >
                          0 && (
                          <p
                            className="
                              mt-0.5
                              font-semibold
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.7,
                                  fontScale
                                ),

                              color:
                                accentColor,
                            }}
                          >
                            {technologies.join(
                              " • "
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
                              leading-[1.38]
                              text-zinc-700
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  6.2,
                                  fontScale
                                ),
                            }}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;