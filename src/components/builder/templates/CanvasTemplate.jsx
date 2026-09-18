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

const CanvasSectionHeading = ({
  number,
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        flex
        items-end
        gap-2.5
        border-b
        border-zinc-300
        pb-1.5
      "
    >
      <span
        className="
          font-black
          leading-none
        "
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              8,
              fontScale
            ),
        }}
      >
        {number}
      </span>

      <h3
        className="
          font-bold
          uppercase
          leading-none
          tracking-[0.14em]
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
        {children}
      </h3>
    </div>
  );
};

/* ========================================
   Canvas Template
======================================== */

const CanvasTemplate = ({
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
      {/* =====================================
          Accent Canvas
      ===================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[7px]
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <div
        className="
          absolute
          right-0
          top-0
          h-24
          w-[18%]
          opacity-[0.08]
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <div
        className="
          relative
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
              grid-cols-[1fr_31%]
              gap-8
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
                    h-[3px]
                    w-8
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />

                <p
                  className="
                    font-bold
                    uppercase
                    tracking-[0.2em]
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
                  Creative Profile
                </p>
              </div>

              <h2
                className="
                  max-w-[95%]
                  font-black
                  leading-[0.86]
                  tracking-[-0.055em]
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      22,
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
                    max-w-[90%]
                    font-medium
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
                self-start
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
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5,
                      fontScale
                    ),
                }}
              >
                Contact
              </p>

              {hasContactInfo ? (
                <div className="mt-2 space-y-1">
                  {personalInfo.email && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
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
                    </p>
                  )}

                  {personalInfo.phone && (
                    <p
                      className="
                        leading-[1.3]
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
                    </p>
                  )}

                  {personalInfo.location && (
                    <p
                      className="
                        leading-[1.3]
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
                        personalInfo.location
                      }
                    </p>
                  )}

                  {personalInfo.website && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
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
                    </p>
                  )}

                  {personalInfo.linkedin && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
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
                    </p>
                  )}

                  {personalInfo.github && (
                    <p
                      className="
                        break-all
                        leading-[1.3]
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
                    </p>
                  )}
                </div>
              ) : (
                <p
                  className="
                    mt-2
                    leading-[1.4]
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        4.9,
                        fontScale
                      ),
                  }}
                >
                  Your contact details
                  appear here.
                </p>
              )}
            </div>
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-[64%_1fr]
              gap-2
            "
          >
            <div
              className="h-[5px]"
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div className="h-[5px] bg-zinc-950" />
          </div>
        </header>

        {/* =====================================
            Main Editorial Grid
        ===================================== */}

        <div
          className="
            grid
            grid-cols-[32%_1fr]
            gap-8
          "
          style={{
            marginTop:
              scaledSpacing(
                10,
                spacingScale
              ),
          }}
        >
          {/* ===================================
              Left Column
          =================================== */}

          <aside>
            {/* Profile */}

            {resume.summary && (
              <section>
                <CanvasSectionHeading
                  number="01"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Profile
                </CanvasSectionHeading>

                <p
                  className="
                    mt-2.5
                    whitespace-pre-line
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
                >
                  {resume.summary}
                </p>
              </section>
            )}

            {/* Skills */}

            {skills.length > 0 && (
              <section
                style={sectionStyle}
              >
                <CanvasSectionHeading
                  number="02"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Skills
                </CanvasSectionHeading>

                <div className="mt-2.5 space-y-1.5">
                  {skills.map(
                    (
                      skill,
                      index
                    ) => (
                      <div
                        key={`${skill}-${index}`}
                        className="
                          grid
                          grid-cols-[18px_1fr]
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className="
                            font-black
                            leading-none
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
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span
                          className="
                            border-b
                            border-zinc-200
                            pb-1
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

            {/* Education */}

            {visibleEducations.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <CanvasSectionHeading
                  number="03"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Education
                </CanvasSectionHeading>

                <div className="mt-2.5 space-y-3">
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
                          .filter(
                            Boolean
                          )
                          .join(" – ");

                      const qualification =
                        [
                          education.degree,
                          education.fieldOfStudy,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(", ");

                      return (
                        <article
                          key={
                            education.id
                          }
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
                                font-medium
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

                          {(dateRange ||
                            education.location) && (
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
                                dateRange,
                                education.location,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " · "
                                )}
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
                        </article>
                      );
                    }
                  )}
                </div>
              </section>
            )}

            {/* Languages */}

            {visibleLanguages.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <CanvasSectionHeading
                  number="04"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Languages
                </CanvasSectionHeading>

                <div className="mt-2.5 space-y-1.5">
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
                          <span
                            className="
                              font-semibold
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
                            {
                              language.name
                            }
                          </span>

                          {proficiency && (
                            <span
                              className="
                                text-right
                                leading-[1.25]
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
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            )}
          </aside>

          {/* ===================================
              Right Column
          =================================== */}

          <main>
            {/* Experience */}

            {visibleExperiences.length >
              0 && (
              <section>
                <CanvasSectionHeading
                  number="05"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Experience
                </CanvasSectionHeading>

                <div className="mt-2.5">
                  {visibleExperiences.map(
                    (
                      experience,
                      index
                    ) => {
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
                          .filter(
                            Boolean
                          )
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
                            relative
                            pl-5
                          "
                          style={{
                            paddingBottom:
                              scaledSpacing(
                                index ===
                                  visibleExperiences.length -
                                    1
                                  ? 0
                                  : 8,
                                spacingScale
                              ),

                            marginBottom:
                              scaledSpacing(
                                index ===
                                  visibleExperiences.length -
                                    1
                                  ? 0
                                  : 8,
                                spacingScale
                              ),

                            borderLeft:
                              `2px solid ${
                                index ===
                                0
                                  ? accentColor
                                  : "rgb(228 228 231)"
                              }`,
                          }}
                        >
                          <span
                            className="
                              absolute
                              -left-[5px]
                              top-1
                              h-2
                              w-2
                              bg-white
                            "
                            style={{
                              border:
                                `2px solid ${accentColor}`,
                            }}
                            aria-hidden="true"
                          />

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
                                  font-black
                                  leading-[1.15]
                                  tracking-[-0.015em]
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
                                      5.3,
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

                            {dateRange && (
                              <p
                                className="
                                  shrink-0
                                  text-right
                                  font-medium
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
                                {dateRange}
                              </p>
                            )}
                          </div>

                          {experience.location && (
                            <p
                              className="
                                mt-0.5
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
              <section>
                <CanvasSectionHeading
                  number="05"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Direction
                </CanvasSectionHeading>

                <div
                  className="
                    mt-2.5
                    border-l-2
                    pl-5
                  "
                  style={{
                    borderColor:
                      accentColor,
                  }}
                >
                  <p
                    className="
                      font-bold
                      leading-[1.3]
                      text-zinc-950
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          6,
                          fontScale
                        ),
                    }}
                  >
                    Creative Career
                    Objective
                  </p>

                  <p
                    className="
                      mt-1
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
                  >
                    Ready to transform
                    academic knowledge,
                    practical projects,
                    and developing
                    expertise into
                    meaningful
                    professional work.
                  </p>
                </div>
              </section>
            )}

            {/* Projects */}

            {visibleProjects.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <CanvasSectionHeading
                  number="06"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Selected Work
                </CanvasSectionHeading>

                <div
                  className="
                    mt-2.5
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  {visibleProjects.map(
                    (
                      project,
                      index
                    ) => {
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
                            relative
                            border
                            border-zinc-200
                            p-3
                          "
                        >
                          <span
                            className="
                              absolute
                              right-2
                              top-2
                              font-black
                              leading-none
                              text-zinc-200
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  10,
                                  fontScale
                                ),
                            }}
                            aria-hidden="true"
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <h4
                            className="
                              relative
                              pr-7
                              font-black
                              leading-[1.2]
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

                          {technologies.length >
                            0 && (
                            <p
                              className="
                                relative
                                mt-1
                                font-semibold
                                leading-[1.3]
                              "
                              style={{
                                color:
                                  accentColor,

                                fontSize:
                                  scaledFontSize(
                                    4.7,
                                    fontScale
                                  ),
                              }}
                            >
                              {technologies.join(
                                " / "
                              )}
                            </p>
                          )}

                          {project.description && (
                          <ResumeDescription
                            description={
                              project.description
                            }
                            className="
                              relative
                              mt-1.5
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
                                relative
                                mt-1.5
                                font-medium
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
                              {project.projectUrl &&
                                "View Project"}

                              {project.projectUrl &&
                                project.githubUrl &&
                                " · "}

                              {project.githubUrl &&
                                "Source"}
                            </p>
                          )}
                        </article>
                      );
                    }
                  )}
                </div>
              </section>
            )}

            {/* Certifications */}

            {visibleCertifications.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <CanvasSectionHeading
                  number="07"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Credentials
                </CanvasSectionHeading>

                <div
                  className="
                    mt-2.5
                    grid
                    grid-cols-2
                    gap-x-5
                    gap-y-2
                  "
                >
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
                          className="
                            border-l-2
                            pl-2.5
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

                          {(certification.issuer ||
                            issueDate) && (
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
              </section>
            )}
          </main>
        </div>

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-8
              grid
              grid-cols-[32%_1fr]
              gap-8
              border-t
              border-zinc-300
              pt-5
            "
          >
            <p
              className="
                font-black
                uppercase
                tracking-[0.16em]
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
              Blank Canvas
            </p>

            <p
              className="
                leading-[1.5]
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
              Add your experience,
              skills, projects, and
              education to shape your
              professional story.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasTemplate;