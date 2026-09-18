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

const StudioSectionHeading = ({
  label,
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[54px_1fr]
        items-end
        gap-3
        border-b
        border-zinc-300
        pb-1.5
      "
    >
      <span
        className="
          font-black
          uppercase
          leading-none
          tracking-[0.14em]
        "
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              4.1,
              fontScale
            ),
        }}
      >
        {label}
      </span>

      <h3
        className="
          font-black
          uppercase
          leading-none
          tracking-[-0.015em]
          text-zinc-950
        "
        style={{
          fontSize:
            scaledFontSize(
              6.3,
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
   Studio Template
======================================== */

const StudioTemplate = ({
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
          Studio Accent Rail
      ===================================== */}

      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-[5px]
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
          pt-8
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <header>
          <div
            className="
              grid
              grid-cols-[18%_1fr_30%]
              gap-5
            "
          >
            {/* Studio label */}

            <div>
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  border-2
                  font-black
                  uppercase
                  tracking-[-0.04em]
                "
                style={{
                  borderColor:
                    accentColor,
                  color:
                    accentColor,
                  fontSize:
                    scaledFontSize(
                      6.5,
                      fontScale
                    ),
                }}
              >
                CV
              </div>

              <p
                className="
                  mt-2
                  font-bold
                  uppercase
                  leading-[1.35]
                  tracking-[0.16em]
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
                Studio
                <br />
                Profile
              </p>
            </div>

            {/* Identity */}

            <div className="min-w-0">
              <p
                className="
                  mb-1.5
                  font-semibold
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
                Professional
                Portfolio
              </p>

              <h2
                className="
                  max-w-[98%]
                  font-black
                  uppercase
                  leading-[0.86]
                  tracking-[-0.055em]
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
                    font-semibold
                    leading-[1.25]
                  "
                  style={{
                    color:
                      accentColor,
                    fontSize:
                      scaledFontSize(
                        6.1,
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
                border-l
                border-zinc-300
                pl-4
              "
            >
              <p
                className="
                  font-black
                  uppercase
                  tracking-[0.15em]
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
                Contact
              </p>

              {hasContactInfo ? (
                <div className="mt-2 space-y-0.5">
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

          {/* Graphic divider */}

          <div
            className="
              mt-5
              grid
              grid-cols-[18%_1fr]
              gap-5
            "
          >
            <div
              className="h-[7px]"
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div className="grid grid-cols-[1fr_70px] gap-2">
              <div className="h-[7px] bg-zinc-950" />
              <div className="h-[7px] bg-zinc-200" />
            </div>
          </div>
        </header>

        {/* =====================================
            Profile
        ===================================== */}

        {resume.summary && (
          <section
            className="
              grid
              grid-cols-[18%_1fr]
              gap-5
            "
            style={{
              marginTop:
                scaledSpacing(
                  10,
                  spacingScale
                ),
            }}
          >
            <div>
              <p
                className="
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4.7,
                      fontScale
                    ),
                }}
              >
                Profile
              </p>

              <p
                className="
                  mt-1
                  leading-[1.35]
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
                Brief /
                Introduction
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-[5px_1fr]
                gap-4
              "
            >
              <div
                style={{
                  backgroundColor:
                    accentColor,
                }}
              />

              <p
                className="
                  whitespace-pre-line
                  leading-[1.5]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.7,
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
            Project Showcase
        ===================================== */}

        {visibleProjects.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <StudioSectionHeading
              label="Work"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Selected Projects
            </StudioSectionHeading>

            <div
              className="
                mt-3
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
                        overflow-hidden
                        border
                        border-zinc-200
                        p-3
                      "
                    >
                      <div
                        className="
                          mb-2
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <span
                          className="
                            font-black
                            uppercase
                            tracking-[0.12em]
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
                          Project{" "}
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span
                          className="
                            h-2
                            w-2
                            shrink-0
                          "
                          style={{
                            backgroundColor:
                              accentColor,
                          }}
                          aria-hidden="true"
                        />
                      </div>

                      <h4
                        className="
                          font-black
                          uppercase
                          leading-[1.1]
                          tracking-[-0.02em]
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
                        {project.name ||
                          "Project"}
                      </h4>

                      {technologies.length >
                        0 && (
                        <p
                          className="
                            mt-1
                            font-semibold
                            leading-[1.3]
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
                        <div
                          className="
                            mt-2
                            border-t
                            border-zinc-200
                            pt-1.5
                          "
                        >
                          <p
                            className="
                              font-bold
                              uppercase
                              tracking-[0.08em]
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
                            {project.projectUrl &&
                              "Live"}

                            {project.projectUrl &&
                              project.githubUrl &&
                              " · "}

                            {project.githubUrl &&
                              "Source"}
                          </p>
                        </div>
                      )}

                      <div
                        className="
                          absolute
                          bottom-0
                          right-0
                          h-[4px]
                          w-12
                        "
                        style={{
                          backgroundColor:
                            accentColor,
                        }}
                        aria-hidden="true"
                      />
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Main Studio Grid
        ===================================== */}

        <div
          className="
            grid
            grid-cols-[1fr_31%]
            gap-7
          "
          style={sectionStyle}
        >
          {/* ===================================
              Left / Experience
          =================================== */}

          <main>
            {visibleExperiences.length >
              0 && (
              <section>
                <StudioSectionHeading
                  label="Career"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Experience
                </StudioSectionHeading>

                <div className="mt-3">
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
                            grid
                            grid-cols-[29%_1fr]
                            gap-4
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

                            borderBottom:
                              index ===
                              visibleExperiences.length -
                                1
                                ? "none"
                                : "1px solid rgb(228 228 231)",
                          }}
                        >
                          <div>
                            {dateRange && (
                              <p
                                className="
                                  font-black
                                  uppercase
                                  leading-[1.3]
                                  text-zinc-950
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
                                      4.3,
                                      fontScale
                                    ),
                                }}
                              >
                                {
                                  experience.location
                                }
                              </p>
                            )}

                            {employmentType && (
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
                                {employmentType}
                              </p>
                            )}
                          </div>

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
                              {experience.company ||
                                "Organisation"}
                            </p>

                            {experience.description && (
                              <ResumeDescription
                                description={
                                  experience.description
                                }
                                className="
                                  mt-1.5
                                  leading-[1.43]
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

            {/* Fresher */}

            {isFresher &&
              visibleExperiences.length ===
                0 && (
              <section>
                <StudioSectionHeading
                  label="Start"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Career Direction
                </StudioSectionHeading>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-[29%_1fr]
                    gap-4
                  "
                >
                  <p
                    className="
                      font-black
                      uppercase
                      leading-[1.35]
                      tracking-[0.08em]
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
                    Emerging
                    Professional
                  </p>

                  <p
                    className="
                      leading-[1.45]
                      text-zinc-600
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          5.3,
                          fontScale
                        ),
                    }}
                  >
                    Ready to apply
                    academic knowledge,
                    practical projects,
                    and growing
                    capabilities in a
                    professional
                    environment while
                    continuing to learn
                    and contribute.
                  </p>
                </div>
              </section>
            )}

            {/* Education */}

            {visibleEducations.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <StudioSectionHeading
                  label="Study"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Education
                </StudioSectionHeading>

                <div className="mt-3 space-y-3">
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
                            grid
                            grid-cols-[29%_1fr]
                            gap-4
                          "
                        >
                          <div>
                            <p
                              className="
                                font-bold
                                leading-[1.3]
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
                              {dateRange ||
                                "Education"}
                            </p>

                            {education.location && (
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
                                {
                                  education.location
                                }
                              </p>
                            )}
                          </div>

                          <div>
                            <h4
                              className="
                                font-bold
                                leading-[1.25]
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
                                      4.8,
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
          </main>

          {/* ===================================
              Right / Capabilities
          =================================== */}

          <aside>
            {/* Skills */}

            {skills.length > 0 && (
              <section>
                <StudioSectionHeading
                  label="Tools"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Capabilities
                </StudioSectionHeading>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    border-l
                    border-t
                    border-zinc-200
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
                          min-h-9
                          border-b
                          border-r
                          border-zinc-200
                          p-2
                        "
                      >
                        <span
                          className="
                            mb-1
                            block
                            font-black
                            leading-none
                          "
                          style={{
                            color:
                              accentColor,
                            fontSize:
                              scaledFontSize(
                                3.9,
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
                            block
                            font-semibold
                            leading-[1.25]
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
                          {skill}
                        </span>
                      </div>
                    )
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
                <StudioSectionHeading
                  label="Proof"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Credentials
                </StudioSectionHeading>

                <div className="mt-3 space-y-2">
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
                                    4.2,
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
              </section>
            )}

            {/* Languages */}

            {visibleLanguages.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <StudioSectionHeading
                  label="Speak"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Languages
                </StudioSectionHeading>

                <div className="mt-3 space-y-2">
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
                            grid
                            grid-cols-[1fr_auto]
                            items-start
                            gap-2
                            border-b
                            border-zinc-200
                            pb-1.5
                          "
                        >
                          <p
                            className="
                              font-semibold
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
                            {
                              language.name
                            }
                          </p>

                          {proficiency && (
                            <p
                              className="
                                text-right
                                leading-[1.25]
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
        </div>

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-8
              grid
              grid-cols-[18%_1fr]
              gap-5
              border-y
              border-zinc-300
              py-5
            "
          >
            <p
              className="
                font-black
                uppercase
                leading-[1.2]
                tracking-[0.12em]
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
              New
              <br />
              Studio
            </p>

            <div>
              <h3
                className="
                  font-black
                  uppercase
                  leading-[1.1]
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
                Build your
                professional
                portfolio
              </h3>

              <p
                className="
                  mt-1.5
                  leading-[1.45]
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
                Add your projects,
                experience, skills,
                education, and
                credentials to create
                your Studio resume.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioTemplate;