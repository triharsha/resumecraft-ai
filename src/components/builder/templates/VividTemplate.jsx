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

const VividSectionHeading = ({
  label,
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
      "
    >
      <div
        className="
          flex
          h-6
          min-w-6
          items-center
          justify-center
          px-1.5
          font-black
          uppercase
          tracking-[0.08em]
          text-white
        "
        style={{
          backgroundColor:
            "#18181b",
          fontSize:
            scaledFontSize(
              3.8,
              fontScale
            ),
        }}
      >
        {label}
      </div>

      <h3
        className="
          font-black
          uppercase
          leading-none
          tracking-[-0.02em]
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
        {children}
      </h3>

      <div className="flex flex-1 items-center">
        <span
          className="
            h-[4px]
            w-9
          "
          style={{
            backgroundColor:
              accentColor,
          }}
        />

        <span className="h-px flex-1 bg-zinc-200" />
      </div>
    </div>
  );
};

/* ========================================
   Vivid Template
======================================== */

const VividTemplate = ({
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
          Header
      ===================================== */}

      <header
        className="
          relative
          overflow-hidden
          px-10
          pb-6
          pt-8
        "
      >
        {/* Large accent field */}

        <div
          className="
            absolute
            right-0
            top-0
            h-full
            w-[29%]
            opacity-[0.12]
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
            right-[24%]
            top-0
            h-full
            w-[12px]
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
            right-[29%]
            top-0
            h-[42%]
            w-10
            bg-zinc-950
          "
          aria-hidden="true"
        />

        <div
          className="
            relative
            grid
            grid-cols-[1fr_30%]
            gap-8
          "
        >
          {/* Identity */}

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
                  h-2
                  w-2
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
                  tracking-[0.2em]
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
                Creative Profile
              </p>
            </div>

            <h2
              className="
                max-w-[94%]
                font-black
                uppercase
                leading-[0.84]
                tracking-[-0.06em]
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
                  max-w-[88%]
                  font-bold
                  leading-[1.2]
                "
                style={{
                  color:
                    accentColor,
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

          {/* Contact */}

          <div
            className="
              relative
              self-end
              border-t-2
              border-zinc-950
              pt-2.5
            "
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
                    4.4,
                    fontScale
                  ),
              }}
            >
              Connect
            </p>

            {hasContactInfo ? (
              <div className="mt-1.5 space-y-0.5">
                {personalInfo.email && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-700
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
                    className="
                      leading-[1.3]
                      text-zinc-700
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
                      personalInfo.phone
                    }
                  </p>
                )}

                {personalInfo.location && (
                  <p
                    className="
                      leading-[1.3]
                      text-zinc-700
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
                      personalInfo.location
                    }
                  </p>
                )}

                {personalInfo.website && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-700
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

                {personalInfo.linkedin && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-700
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

                {personalInfo.github && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-700
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
            ) : (
              <p
                className="
                  mt-1.5
                  leading-[1.4]
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
                Contact details
                appear here.
              </p>
            )}
          </div>
        </div>
      </header>

      {/* =====================================
          Accent Ribbon
      ===================================== */}

      <div
        className="
          grid
          grid-cols-[22%_48%_1fr]
          px-10
        "
        aria-hidden="true"
      >
        <div
          className="h-[7px]"
          style={{
            backgroundColor:
              accentColor,
          }}
        />

        <div className="h-[7px] bg-zinc-950" />

        <div className="h-[7px] bg-zinc-200" />
      </div>

      {/* =====================================
          Main Content
      ===================================== */}

      <div
        className="
          px-10
          pb-8
          pt-5
        "
      >
        {/* =====================================
            Summary + Skills
        ===================================== */}

        {(resume.summary ||
          skills.length > 0) && (
          <div
            className="
              grid
              grid-cols-[1fr_34%]
              gap-7
            "
          >
            {/* Summary */}

            {resume.summary && (
              <section>
                <VividSectionHeading
                  label="01"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Profile
                </VividSectionHeading>

                <p
                  className="
                    mt-2.5
                    whitespace-pre-line
                    leading-[1.5]
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
                  {resume.summary}
                </p>
              </section>
            )}

            {/* Skills */}

            {skills.length > 0 && (
              <section>
                <VividSectionHeading
                  label="02"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Skills
                </VividSectionHeading>

                <div
                  className="
                    mt-2.5
                    flex
                    flex-wrap
                    gap-1.5
                  "
                >
                  {skills.map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        key={`${skill}-${index}`}
                        className="
                          border
                          border-zinc-300
                          px-2
                          py-1
                          font-bold
                          leading-[1.2]
                          text-zinc-700
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              4.7,
                              fontScale
                            ),

                          borderBottomColor:
                            accentColor,

                          borderBottomWidth:
                            "2px",
                        }}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* =====================================
            Experience
        ===================================== */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <VividSectionHeading
              label="03"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </VividSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-x-5
                gap-y-3
              "
            >
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
                        relative
                        overflow-hidden
                        border
                        border-zinc-200
                        p-3
                      "
                    >
                      <div
                        className="
                          absolute
                          left-0
                          top-0
                          h-full
                          w-[5px]
                        "
                        style={{
                          backgroundColor:
                            index % 2 ===
                            0
                              ? accentColor
                              : "#18181b",
                        }}
                        aria-hidden="true"
                      />

                      <div className="pl-1.5">
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
                              leading-[1.15]
                              tracking-[-0.015em]
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
                            {experience.jobTitle ||
                              "Job Title"}
                          </h4>

                          {dateRange && (
                            <p
                              className="
                                shrink-0
                                text-right
                                font-bold
                                uppercase
                                leading-[1.25]
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
                              {dateRange}
                            </p>
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
                                4.9,
                                fontScale
                              ),
                          }}
                        >
                          {experience.company ||
                            "Organisation"}
                        </p>

                        {(employmentType ||
                          experience.location) && (
                          <p
                            className="
                              mt-0.5
                              uppercase
                              tracking-[0.07em]
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
                            {[
                              employmentType,
                              experience.location,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(" · ")}
                          </p>
                        )}

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
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
            <VividSectionHeading
              label="03"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Launch
            </VividSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-[34%_1fr]
                border
                border-zinc-200
              "
            >
              <div
                className="
                  bg-zinc-950
                  p-4
                  text-white
                "
              >
                <p
                  className="
                    font-black
                    uppercase
                    leading-[1.1]
                    tracking-[-0.02em]
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        6,
                        fontScale
                      ),
                  }}
                >
                  Ready to
                  make an
                  impact.
                </p>

                <div
                  className="
                    mt-2
                    h-[4px]
                    w-10
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />
              </div>

              <p
                className="
                  p-4
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
              >
                An emerging
                professional bringing
                academic knowledge,
                practical projects,
                curiosity, and
                developing expertise
                into the next stage of
                a professional career.
              </p>
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
            <VividSectionHeading
              label="04"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Featured Work
            </VividSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-4
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
                        grid
                        grid-cols-[42px_1fr]
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          font-black
                          text-white
                        "
                        style={{
                          backgroundColor:
                            index % 2 ===
                            0
                              ? accentColor
                              : "#18181b",

                          fontSize:
                            scaledFontSize(
                              5,
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
                      </div>

                      <div
                        className="
                          border-t
                          border-zinc-300
                          pt-2
                        "
                      >
                        <h4
                          className="
                            font-black
                            uppercase
                            leading-[1.15]
                            text-zinc-950
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.6,
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
                              font-semibold
                              leading-[1.3]
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
                              mt-1.5
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
                          />
                        )}

                        {(project.projectUrl ||
                          project.githubUrl) && (
                          <p
                            className="
                              mt-1
                              font-bold
                              uppercase
                              tracking-[0.08em]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  3.9,
                                  fontScale
                                ),
                            }}
                          >
                            {project.projectUrl &&
                              "View"}

                            {project.projectUrl &&
                              project.githubUrl &&
                              " · "}

                            {project.githubUrl &&
                              "Source"}
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
            Education / Credentials / Languages
        ===================================== */}

        {(visibleEducations.length >
          0 ||
          visibleCertifications.length >
            0 ||
          visibleLanguages.length >
            0) && (
          <section
            style={sectionStyle}
          >
            <VividSectionHeading
              label="05"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Background
            </VividSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-[1.15fr_0.9fr_0.75fr]
                gap-5
              "
            >
              {/* Education */}

              {visibleEducations.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-2
                      font-black
                      uppercase
                      tracking-[0.12em]
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
                    Education
                  </p>

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
                            className="
                              border-l-2
                              pl-2.5
                            "
                            style={{
                              borderColor:
                                accentColor,
                            }}
                          >
                            <h4
                              className="
                                font-bold
                                leading-[1.25]
                                text-zinc-900
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    5.1,
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
                                      4.6,
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
                                      4.2,
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
                                  leading-[1.35]
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
                                  education.description
                                }
                              </p>
                            )}
                          </article>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}

              {visibleCertifications.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-2
                      font-black
                      uppercase
                      tracking-[0.12em]
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
                    Certifications
                  </p>

                  <div className="space-y-2">
                    {visibleCertifications.map(
                      (
                        certification
                      ) => {
                        const issueDate =
                          formatMonth(
                            certification.issueDate
                          );

                        return (
                          <article
                            key={
                              certification.id
                            }
                            className="
                              border-t
                              border-zinc-200
                              pt-1.5
                            "
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
                                    4.9,
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
                                      4.1,
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
                          </article>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Languages */}

              {visibleLanguages.length >
                0 && (
                <div>
                  <p
                    className="
                      mb-2
                      font-black
                      uppercase
                      tracking-[0.12em]
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
                    Languages
                  </p>

                  <div className="space-y-2">
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
                              border-b
                              border-zinc-200
                              pb-1.5
                            "
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
                                  mt-0.5
                                  leading-[1.3]
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

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-7
              grid
              grid-cols-[34%_1fr]
              overflow-hidden
              border
              border-zinc-200
            "
          >
            <div
              className="
                bg-zinc-950
                p-5
              "
            >
              <div
                className="
                  mb-3
                  h-[5px]
                  w-10
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
                  leading-[1.05]
                  tracking-[-0.02em]
                  text-white
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      6.5,
                      fontScale
                    ),
                }}
              >
                Make it
                vivid.
              </p>
            </div>

            <div className="p-5">
              <p
                className="
                  font-bold
                  leading-[1.3]
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
                Your professional
                story starts here.
              </p>

              <p
                className="
                  mt-1.5
                  leading-[1.5]
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
                Add your experience,
                skills, projects,
                education, and
                credentials to create
                your resume.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VividTemplate;