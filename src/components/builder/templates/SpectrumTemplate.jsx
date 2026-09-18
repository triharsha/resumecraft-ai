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

const SpectrumSectionHeading = ({
  children,
  accentColor,
  fontScale,
  light = false,
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
      "
    >
      <span
        className="
          h-2
          w-2
          shrink-0
          rotate-45
        "
        style={{
          backgroundColor:
            accentColor,
        }}
        aria-hidden="true"
      />

      <h3
        className={`
          font-bold
          uppercase
          leading-none
          tracking-[0.16em]
          ${
            light
              ? "text-white"
              : "text-zinc-950"
          }
        `}
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

      <div
        className={`
          h-px
          flex-1
          ${
            light
              ? "bg-white/30"
              : "bg-zinc-200"
          }
        `}
      />
    </div>
  );
};

/* ========================================
   Spectrum Template
======================================== */

const SpectrumTemplate = ({
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
          bg-zinc-950
          px-10
          pb-7
          pt-8
          text-white
        "
      >
        {/* Accent shapes */}

        <div
          className="
            absolute
            -right-10
            -top-14
            h-40
            w-40
            rotate-12
            opacity-90
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
            right-24
            top-0
            h-full
            w-12
            -skew-x-12
            opacity-20
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
            bottom-0
            left-0
            h-[5px]
            w-[58%]
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
            grid
            grid-cols-[1fr_35%]
            gap-8
          "
        >
          <div className="min-w-0">
            <p
              className="
                mb-2
                font-semibold
                uppercase
                tracking-[0.22em]
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
              Creative Resume
            </p>

            <h2
              className="
                max-w-[95%]
                font-black
                leading-[0.88]
                tracking-[-0.045em]
                text-white
              "
              style={{
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
                  max-w-[90%]
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

          <div
            className="
              relative
              self-end
              border-l
              border-white/20
              pl-4
            "
          >
            <p
              className="
                font-bold
                uppercase
                tracking-[0.14em]
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
              Details
            </p>

            {hasContactInfo ? (
              <div className="mt-1.5 space-y-0.5">
                {personalInfo.email && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-200
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
                  </p>
                )}

                {personalInfo.phone && (
                  <p
                    className="
                      leading-[1.3]
                      text-zinc-200
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
                      personalInfo.phone
                    }
                  </p>
                )}

                {personalInfo.location && (
                  <p
                    className="
                      leading-[1.3]
                      text-zinc-200
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
                )}

                {personalInfo.website && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-200
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
                  </p>
                )}

                {personalInfo.linkedin && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-200
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
                  </p>
                )}

                {personalInfo.github && (
                  <p
                    className="
                      break-all
                      leading-[1.3]
                      text-zinc-200
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
                      4.8,
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
          Profile Band
      ===================================== */}

      {resume.summary && (
        <section
          className="
            grid
            grid-cols-[24%_1fr]
            gap-6
            bg-zinc-100
            px-10
            py-4
          "
        >
          <div>
            <p
              className="
                font-black
                uppercase
                leading-[1.1]
                tracking-[0.15em]
                text-zinc-950
              "
              style={{
                fontSize:
                  scaledFontSize(
                    5.5,
                    fontScale
                  ),
              }}
            >
              Profile
            </p>

            <div
              className="
                mt-1.5
                h-[3px]
                w-9
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
            />
          </div>

          <p
            className="
              whitespace-pre-line
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
            {resume.summary}
          </p>
        </section>
      )}

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
            Experience
        ===================================== */}

        {visibleExperiences.length >
          0 && (
          <section>
            <SpectrumSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Experience
            </SpectrumSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-x-7
                gap-y-4
              "
            >
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
                        border-t-2
                        pt-2.5
                      "
                      style={{
                        borderColor:
                          accentColor,
                      }}
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div className="min-w-0">
                          <h4
                            className="
                              font-black
                              leading-[1.2]
                              tracking-[-0.01em]
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
                        </div>

                        {dateRange && (
                          <p
                            className="
                              shrink-0
                              text-right
                              font-medium
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
                            {dateRange}
                          </p>
                        )}
                      </div>

                      {(employmentType ||
                        experience.location) && (
                        <p
                          className="
                            mt-1
                            font-medium
                            uppercase
                            tracking-[0.07em]
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
                            leading-[1.42]
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

        {/* =====================================
            Fresher
        ===================================== */}

        {isFresher &&
          visibleExperiences.length ===
            0 && (
          <section>
            <SpectrumSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Direction
            </SpectrumSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-[30%_1fr]
                overflow-hidden
                border
                border-zinc-200
              "
            >
              <div
                className="
                  flex
                  items-center
                  px-4
                  py-3
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-white
                "
                style={{
                  backgroundColor:
                    accentColor,

                  fontSize:
                    scaledFontSize(
                      5,
                      fontScale
                    ),
                }}
              >
                New Perspective
              </div>

              <p
                className="
                  px-4
                  py-3
                  leading-[1.45]
                  text-zinc-600
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.5,
                      fontScale
                    ),
                }}
              >
                Early-career
                professional prepared
                to turn academic
                knowledge, practical
                projects, and growing
                expertise into
                meaningful
                contributions.
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Skills Matrix
        ===================================== */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <SpectrumSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Competency Spectrum
            </SpectrumSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-4
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
                      relative
                      min-h-10
                      border-b
                      border-r
                      border-zinc-200
                      px-2.5
                      py-2
                    "
                  >
                    <span
                      className="
                        absolute
                        right-1.5
                        top-1
                        font-black
                        leading-none
                        text-zinc-200
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            7,
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

                    <span
                      className="
                        relative
                        block
                        max-w-[82%]
                        font-semibold
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
                      {skill}
                    </span>

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        w-5
                      "
                      style={{
                        backgroundColor:
                          accentColor,
                      }}
                      aria-hidden="true"
                    />
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
            <SpectrumSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Project Showcase
            </SpectrumSectionHeading>

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
                        relative
                        overflow-hidden
                        bg-zinc-100
                        p-3.5
                      "
                    >
                      <div
                        className="
                          absolute
                          left-0
                          top-0
                          h-full
                          w-[4px]
                        "
                        style={{
                          backgroundColor:
                            accentColor,
                        }}
                        aria-hidden="true"
                      />

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

                        <span
                          className="
                            shrink-0
                            font-black
                            leading-none
                            text-zinc-300
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                8,
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
                      </div>

                      {technologies.length >
                        0 && (
                        <p
                          className="
                            mt-1
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
                            mt-1.5
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
                            mt-1.5
                            font-semibold
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
                            "Project"}

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

        {/* =====================================
            Lower Information Band
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
            <SpectrumSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Background
            </SpectrumSectionHeading>

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
                                    5.3,
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
                                      4.4,
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
                          <div
                            key={
                              certification.id
                            }
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
                                    5,
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
                                      4.4,
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
                                  leading-[1.3]
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
              mt-6
              overflow-hidden
              border
              border-zinc-200
            "
          >
            <div
              className="h-2"
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div
              className="
                grid
                grid-cols-[28%_1fr]
                gap-5
                p-5
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
                      5.1,
                      fontScale
                    ),
                }}
              >
                Your Spectrum
              </p>

              <p
                className="
                  leading-[1.5]
                  text-zinc-500
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      5.7,
                      fontScale
                    ),
                }}
              >
                Add your experience,
                skills, projects, and
                education to build your
                professional spectrum.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpectrumTemplate;