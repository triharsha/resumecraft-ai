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
   Section Header
======================================== */

const EngineerSectionHeading = ({
  code,
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[58px_1fr]
        items-end
        gap-3
        border-b
        border-zinc-300
        pb-1.5
      "
    >
      <span
        className="
          font-mono
          font-bold
          uppercase
          tracking-[0.08em]
        "
        style={{
          color: accentColor,
          fontSize:
            scaledFontSize(
              4,
              fontScale
            ),
        }}
      >
        {code}
      </span>

      <h3
        className="
          font-bold
          uppercase
          leading-none
          tracking-[0.08em]
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
   Engineer Template
======================================== */

const EngineerTemplate = ({
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
          Technical Border System
      ===================================== */}

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
            accentColor,
        }}
        aria-hidden="true"
      />

      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-px
          bg-zinc-200
        "
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
              grid-cols-[1fr_31%]
              gap-8
            "
          >
            {/* Identity */}

            <div>
              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    font-mono
                    font-bold
                    uppercase
                    tracking-[0.14em]
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
                  Engineering Record
                </span>

                <span className="h-px w-12 bg-zinc-300" />

                <span
                  className="
                    font-mono
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.8,
                        fontScale
                      ),
                  }}
                >
                  PROFILE / 01
                </span>
              </div>

              <h2
                className="
                  font-black
                  uppercase
                  leading-[0.92]
                  tracking-[-0.035em]
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      16.5,
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
                    leading-[1.2]
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
                    personalInfo.jobTitle
                  }
                </p>
              )}
            </div>

            {/* Record Metadata */}

            <div
              className="
                border
                border-zinc-300
              "
            >
              <div
                className="
                  grid
                  grid-cols-[38%_1fr]
                  border-b
                  border-zinc-300
                "
              >
                <div
                  className="
                    bg-zinc-950
                    px-2.5
                    py-2
                    font-mono
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-white
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.8,
                        fontScale
                      ),
                  }}
                >
                  Record
                </div>

                <div
                  className="
                    px-2.5
                    py-2
                    font-mono
                    text-zinc-500
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.9,
                        fontScale
                      ),
                  }}
                >
                  ENG-PROFILE
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-[38%_1fr]
                  border-b
                  border-zinc-200
                "
              >
                <div
                  className="
                    px-2.5
                    py-1.5
                    font-mono
                    uppercase
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.7,
                        fontScale
                      ),
                  }}
                >
                  Status
                </div>

                <div
                  className="
                    px-2.5
                    py-1.5
                    font-mono
                    font-semibold
                    text-zinc-700
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.9,
                        fontScale
                      ),
                  }}
                >
                  Professional
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-[38%_1fr]
                "
              >
                <div
                  className="
                    px-2.5
                    py-1.5
                    font-mono
                    uppercase
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.7,
                        fontScale
                      ),
                  }}
                >
                  Location
                </div>

                <div
                  className="
                    px-2.5
                    py-1.5
                    font-mono
                    text-zinc-700
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.9,
                        fontScale
                      ),
                  }}
                >
                  {personalInfo.location ||
                    "Available"}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Strip */}

          <div
            className="
              mt-5
              grid
              grid-cols-[110px_1fr]
              border-y
              border-zinc-300
            "
          >
            <div
              className="
                flex
                items-center
                bg-zinc-100
                px-3
                py-2
              "
            >
              <span
                className="
                  font-mono
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      3.9,
                      fontScale
                    ),
                }}
              >
                Contact
              </span>
            </div>

            {hasContactInfo ? (
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-1
                  px-3
                  py-2
                "
              >
                {[
                  personalInfo.email,
                  personalInfo.phone,
                  personalInfo.location,
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
                            font-mono
                            leading-[1.3]
                            text-zinc-600
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.1,
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
            ) : (
              <div
                className="
                  px-3
                  py-2
                  font-mono
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
                Contact information
              </div>
            )}
          </div>
        </header>

        {/* =====================================
            Engineering Profile
        ===================================== */}

        {resume.summary && (
          <section
            style={{
              marginTop:
                scaledSpacing(
                  9,
                  spacingScale
                ),
            }}
          >
            <EngineerSectionHeading
              code="SEC-01"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Engineering Profile
            </EngineerSectionHeading>

            <div
              className="
                mt-3
                grid
                grid-cols-[21%_1fr]
                gap-4
              "
            >
              <div>
                <p
                  className="
                    font-mono
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
                  Overview
                </p>

                <div
                  className="
                    mt-1.5
                    h-[4px]
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
                      5.4,
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
            Main Technical Grid
        ===================================== */}

        <div
          className="
            grid
            grid-cols-[1fr_30%]
            gap-7
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
              Main Column
          =================================== */}

          <main>
            {/* Experience */}

            {visibleExperiences.length >
              0 && (
              <section>
                <EngineerSectionHeading
                  code="SEC-02"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Engineering Experience
                </EngineerSectionHeading>

                <div className="mt-3 space-y-3">
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
                            border
                            border-zinc-200
                          "
                        >
                          {/* Record Header */}

                          <div
                            className="
                              grid
                              grid-cols-[48px_1fr_auto]
                              items-center
                              border-b
                              border-zinc-200
                              bg-zinc-50
                            "
                          >
                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                                border-r
                                border-zinc-200
                                font-mono
                                font-bold
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
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <div className="px-3 py-2">
                              <h4
                                className="
                                  font-bold
                                  leading-[1.2]
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
                                {experience.jobTitle ||
                                  "Role"}
                              </h4>

                              <p
                                className="
                                  mt-0.5
                                  font-semibold
                                  leading-[1.25]
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
                                {experience.company ||
                                  "Organisation"}
                              </p>
                            </div>

                            {dateRange && (
                              <div
                                className="
                                  px-3
                                  py-2
                                  text-right
                                  font-mono
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4,
                                      fontScale
                                    ),
                                }}
                              >
                                {dateRange}
                              </div>
                            )}
                          </div>

                          {/* Record Body */}

                          <div
                            className="
                              grid
                              grid-cols-[27%_1fr]
                            "
                          >
                            <div
                              className="
                                border-r
                                border-zinc-200
                                px-3
                                py-2.5
                              "
                            >
                              <p
                                className="
                                  font-mono
                                  uppercase
                                  tracking-[0.07em]
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.6,
                                      fontScale
                                    ),
                                }}
                              >
                                Classification
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  font-mono
                                  leading-[1.3]
                                  text-zinc-600
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4,
                                      fontScale
                                    ),
                                }}
                              >
                                {employmentType ||
                                  "Professional"}
                              </p>

                              {experience.location && (
                                <>
                                  <p
                                    className="
                                      mt-2
                                      font-mono
                                      uppercase
                                      tracking-[0.07em]
                                      text-zinc-400
                                    "
                                    style={{
                                      fontSize:
                                        scaledFontSize(
                                          3.6,
                                          fontScale
                                        ),
                                    }}
                                  >
                                    Location
                                  </p>

                                  <p
                                    className="
                                      mt-0.5
                                      font-mono
                                      leading-[1.3]
                                      text-zinc-600
                                    "
                                    style={{
                                      fontSize:
                                        scaledFontSize(
                                          4,
                                          fontScale
                                        ),
                                    }}
                                  >
                                    {
                                      experience.location
                                    }
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="px-3 py-2.5">
                              {experience.description ? (
                                <ResumeDescription
                                  description={
                                    experience.description
                                  }
                                  className="
                                    leading-[1.43]
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
                              ) : (
                                <p
                                  className="
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
                                  Engineering
                                  responsibilities
                                  and outcomes.
                                </p>
                              )}
                            </div>
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
                <EngineerSectionHeading
                  code="SEC-02"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Engineering Objective
                </EngineerSectionHeading>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-[27%_1fr]
                    border
                    border-zinc-200
                  "
                >
                  <div
                    className="
                      border-r
                      border-zinc-200
                      bg-zinc-50
                      p-3
                    "
                  >
                    <p
                      className="
                        font-mono
                        uppercase
                        tracking-[0.08em]
                        text-zinc-400
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            3.7,
                            fontScale
                          ),
                      }}
                    >
                      Career Stage
                    </p>

                    <p
                      className="
                        mt-1
                        font-bold
                        text-zinc-800
                      "
                      style={{
                        fontSize:
                          scaledFontSize(
                            4.8,
                            fontScale
                          ),
                      }}
                    >
                      Entry Level
                    </p>

                    <div
                      className="
                        mt-2
                        h-[4px]
                        w-8
                      "
                      style={{
                        backgroundColor:
                          accentColor,
                      }}
                    />
                  </div>

                  <div className="p-3">
                    <p
                      className="
                        font-semibold
                        leading-[1.35]
                        text-zinc-800
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
                      technical
                      foundations to
                      real engineering
                      challenges.
                    </p>

                    <p
                      className="
                        mt-1
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
                    >
                      Bringing
                      academic
                      knowledge,
                      project
                      experience,
                      analytical
                      thinking, and a
                      disciplined
                      approach to
                      learning and
                      problem solving.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Projects */}

            {visibleProjects.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <EngineerSectionHeading
                  code="SEC-03"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Systems & Projects
                </EngineerSectionHeading>

                <div className="mt-3 space-y-2.5">
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
                            grid-cols-[72px_1fr]
                            border-b
                            border-zinc-200
                            pb-2.5
                          "
                        >
                          <div>
                            <p
                              className="
                                font-mono
                                font-bold
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
                              {`PRJ-${String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}`}
                            </p>

                            {(project.projectUrl ||
                              project.githubUrl) && (
                              <p
                                className="
                                  mt-1
                                  font-mono
                                  uppercase
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.6,
                                      fontScale
                                    ),
                                }}
                              >
                                {project.projectUrl &&
                                  "LIVE"}

                                {project.projectUrl &&
                                  project.githubUrl &&
                                  " / "}

                                {project.githubUrl &&
                                  "SOURCE"}
                              </p>
                            )}
                          </div>

                          <div>
                            <h4
                              className="
                                font-bold
                                leading-[1.2]
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
                              {project.name ||
                                "Project"}
                            </h4>

                            {technologies.length >
                              0 && (
                              <p
                                className="
                                  mt-0.5
                                  font-mono
                                  leading-[1.3]
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      4,
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
      mt-1
      leading-[1.4]
      text-zinc-600
    "
    style={{
      fontSize:
                                    scaledFontSize(
                                      4.8,
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
          </main>

          {/* ===================================
              Technical Sidebar
          =================================== */}

          <aside>
            {/* Skills */}

            {skills.length > 0 && (
              <section>
                <EngineerSectionHeading
                  code="SPEC"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Competencies
                </EngineerSectionHeading>

                <div
                  className="
                    mt-3
                    border
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
                        className={`
                          grid
                          grid-cols-[34px_1fr]
                          ${
                            index !==
                            skills.length -
                              1
                              ? "border-b border-zinc-200"
                              : ""
                          }
                        `}
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            border-r
                            border-zinc-200
                            bg-zinc-50
                            font-mono
                            font-bold
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                3.7,
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
                            px-2.5
                            py-1.5
                            font-medium
                            leading-[1.3]
                            text-zinc-700
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.5,
                                fontScale
                              ),
                          }}
                        >
                          {skill}
                        </div>
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
                <EngineerSectionHeading
                  code="EDU"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Education
                </EngineerSectionHeading>

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
                                  4.9,
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
                                    4.3,
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
                                font-mono
                                leading-[1.3]
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.8,
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
                                    4.5,
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

            {/* Certifications */}

            {visibleCertifications.length >
              0 && (
              <section
                style={sectionStyle}
              >
                <EngineerSectionHeading
                  code="CERT"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Credentials
                </EngineerSectionHeading>

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
                            border-b
                            border-zinc-200
                            pb-2
                          "
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
                                  4.6,
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
                                font-mono
                                leading-[1.3]
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.8,
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
                <EngineerSectionHeading
                  code="LANG"
                  accentColor={
                    accentColor
                  }
                  fontScale={
                    fontScale
                  }
                >
                  Languages
                </EngineerSectionHeading>

                <div className="mt-3 space-y-1.5">
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
                            gap-2
                            border-b
                            border-zinc-100
                            pb-1.5
                          "
                        >
                          <span
                            className="
                              font-medium
                              text-zinc-700
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
                              language.name
                            }
                          </span>

                          {proficiency && (
                            <span
                              className="
                                text-right
                                font-mono
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    3.5,
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
        </div>

        {/* =====================================
            Empty State
        ===================================== */}

        {!hasResumeContent && (
          <div
            className="
              mt-8
              border
              border-zinc-300
            "
          >
            <div
              className="
                grid
                grid-cols-[120px_1fr]
                border-b
                border-zinc-300
              "
            >
              <div
                className="
                  bg-zinc-950
                  px-3
                  py-2
                  font-mono
                  font-bold
                  uppercase
                  text-white
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      3.9,
                      fontScale
                    ),
                }}
              >
                Status
              </div>

              <div
                className="
                  px-3
                  py-2
                  font-mono
                  text-zinc-500
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      4,
                      fontScale
                    ),
                }}
              >
                Awaiting profile data
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-[120px_1fr]
              "
            >
              <div
                className="
                  border-r
                  border-zinc-300
                  bg-zinc-50
                  px-3
                  py-4
                "
              >
                <div
                  className="
                    h-[5px]
                    w-9
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />
              </div>

              <div className="p-4">
                <h3
                  className="
                    font-bold
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
                  Initialize your
                  engineering record.
                </h3>

                <p
                  className="
                    mt-1
                    leading-[1.45]
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
                  Add experience,
                  competencies,
                  projects, education,
                  certifications, and
                  languages to build
                  your professional
                  profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================
            Footer
        ===================================== */}

        {hasResumeContent && (
          <div
            className="
              mt-5
              grid
              grid-cols-[auto_1fr_auto]
              items-center
              gap-3
              border-t
              border-zinc-200
              pt-2
            "
          >
            <span
              className="
                font-mono
                font-bold
              "
              style={{
                color:
                  accentColor,
                fontSize:
                  scaledFontSize(
                    3.7,
                    fontScale
                  ),
              }}
            >
              ENG / PROFILE
            </span>

            <span className="h-px bg-zinc-100" />

            <span
              className="
                font-mono
                uppercase
                tracking-[0.08em]
                text-zinc-400
              "
              style={{
                fontSize:
                  scaledFontSize(
                    3.5,
                    fontScale
                  ),
              }}
            >
              Technical Record
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineerTemplate;