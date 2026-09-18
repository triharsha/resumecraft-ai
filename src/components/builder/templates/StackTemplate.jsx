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
   Layer Heading
======================================== */

const StackLayerHeading = ({
  layer,
  title,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[72px_1fr]
        items-stretch
        border
        border-zinc-200
      "
    >
      <div
        className="
          flex
          items-center
          border-r
          border-zinc-200
          bg-zinc-50
          px-2.5
          py-1.5
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
                3.7,
                fontScale
              ),
          }}
        >
          {layer}
        </span>
      </div>

      <div
        className="
          flex
          items-center
          gap-3
          px-3
          py-1.5
        "
      >
        <h3
          className="
            font-bold
            uppercase
            leading-none
            tracking-[0.07em]
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
          {title}
        </h3>

        <span className="h-px flex-1 bg-zinc-200" />

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
        />
      </div>
    </div>
  );
};

/* ========================================
   Stack Template
======================================== */

const StackTemplate = ({
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

  const sectionStyle = {
    marginTop:
      scaledSpacing(
        9,
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
      {/* =====================================
          Stack Spine
      ===================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[6px]
          bg-zinc-950
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute
          left-[6px]
          top-0
          h-[88px]
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
          relative
          px-10
          pb-7
          pt-8
        "
      >
        {/* =====================================
            Header Layer
        ===================================== */}

        <header>
          <div
            className="
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
                    3.9,
                    fontScale
                  ),
              }}
            >
              Technology Stack
            </span>

            <span className="h-px w-16 bg-zinc-300" />

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
              Professional Profile
            </span>
          </div>

          <div
            className="
              mt-3
              grid
              grid-cols-[1fr_35%]
              gap-8
            "
          >
            {/* Identity */}

            <div>
              <h2
                className="
                  font-black
                  uppercase
                  leading-[0.9]
                  tracking-[-0.045em]
                  text-zinc-950
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      16,
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
                  {
                    personalInfo.jobTitle
                  }
                </p>
              )}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-1
                "
              >
                <span
                  className="
                    h-[5px]
                    w-14
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />

                <span className="h-[5px] w-10 bg-zinc-950" />
                <span className="h-[5px] w-7 bg-zinc-300" />
                <span className="h-[5px] w-4 bg-zinc-200" />
              </div>
            </div>

            {/* Contact Stack */}

            <div
              className="
                border
                border-zinc-200
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-zinc-200
                  bg-zinc-50
                  px-3
                  py-1.5
                "
              >
                <span
                  className="
                    font-mono
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-zinc-700
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.7,
                        fontScale
                      ),
                  }}
                >
                  Identity Layer
                </span>

                <span
                  className="
                    font-mono
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        3.4,
                        fontScale
                      ),
                  }}
                >
                  L0
                </span>
              </div>

              {hasContactInfo ? (
                <div className="p-3">
                  {[
                    [
                      "MAIL",
                      personalInfo.email,
                    ],
                    [
                      "TEL",
                      personalInfo.phone,
                    ],
                    [
                      "LOC",
                      personalInfo.location,
                    ],
                    [
                      "WEB",
                      personalInfo.website,
                    ],
                    [
                      "IN",
                      personalInfo.linkedin,
                    ],
                    [
                      "GIT",
                      personalInfo.github,
                    ],
                  ]
                    .filter(
                      ([, value]) =>
                        Boolean(value)
                    )
                    .map(
                      ([
                        label,
                        value,
                      ]) => (
                        <div
                          key={label}
                          className="
                            grid
                            grid-cols-[34px_1fr]
                            gap-2
                            border-b
                            border-zinc-100
                            py-1
                            last:border-b-0
                          "
                        >
                          <span
                            className="
                              font-mono
                              font-bold
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
                            {label}
                          </span>

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
                                  3.9,
                                  fontScale
                                ),
                            }}
                          >
                            {value}
                          </span>
                        </div>
                      )
                    )}
                </div>
              ) : (
                <p
                  className="
                    p-3
                    font-mono
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
                  Contact layer empty
                </p>
              )}
            </div>
          </div>
        </header>

        {/* =====================================
            Profile Layer
        ===================================== */}

        {resume.summary && (
          <section
            style={{
              marginTop:
                scaledSpacing(
                  8,
                  spacingScale
                ),
            }}
          >
            <StackLayerHeading
              layer="L1"
              title="Profile Layer"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                grid
                grid-cols-[72px_1fr]
                border-x
                border-b
                border-zinc-200
              "
            >
              <div
                className="
                  border-r
                  border-zinc-200
                  bg-zinc-50
                  px-2.5
                  py-3
                "
              >
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
                        3.4,
                        fontScale
                      ),
                  }}
                >
                  Context
                </span>
              </div>

              <p
                className="
                  whitespace-pre-line
                  px-3
                  py-3
                  leading-[1.48]
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
                {resume.summary}
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Technology Stack
        ===================================== */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <StackLayerHeading
              layer="L2"
              title="Technology Stack"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                grid
                grid-cols-[72px_1fr]
                border-x
                border-b
                border-zinc-200
              "
            >
              <div
                className="
                  border-r
                  border-zinc-200
                  bg-zinc-50
                  px-2.5
                  py-3
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
                        3.4,
                        fontScale
                      ),
                  }}
                >
                  Core
                </p>

                <div
                  className="
                    mt-2
                    space-y-1
                  "
                  aria-hidden="true"
                >
                  <span
                    className="
                      block
                      h-[3px]
                      w-full
                    "
                    style={{
                      backgroundColor:
                        accentColor,
                    }}
                  />

                  <span className="block h-[3px] w-4/5 bg-zinc-800" />
                  <span className="block h-[3px] w-3/5 bg-zinc-300" />
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-x-3
                  gap-y-2
                  p-3
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
                        border-b
                        border-zinc-100
                        pb-1.5
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
                              4.3,
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
            </div>
          </section>
        )}

        {/* =====================================
            Professional Layer
        ===================================== */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <StackLayerHeading
              layer="L3"
              title="Professional Layer"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                border-x
                border-b
                border-zinc-200
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
                      className={`
                        grid
                        grid-cols-[72px_1fr]
                        ${
                          index !==
                          visibleExperiences.length -
                            1
                            ? "border-b border-zinc-200"
                            : ""
                        }
                      `}
                    >
                      {/* Layer Rail */}

                      <div
                        className="
                          relative
                          border-r
                          border-zinc-200
                          bg-zinc-50
                          px-2.5
                          py-3
                        "
                      >
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
                                3.7,
                                fontScale
                              ),
                          }}
                        >
                          {`L3.${index + 1}`}
                        </p>

                        {dateRange && (
                          <p
                            className="
                              mt-1
                              font-mono
                              leading-[1.3]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  3.4,
                                  fontScale
                                ),
                            }}
                          >
                            {dateRange}
                          </p>
                        )}

                        <span
                          className="
                            absolute
                            -right-[4px]
                            top-4
                            h-[7px]
                            w-[7px]
                            bg-white
                            ring-1
                            ring-zinc-300
                          "
                        />
                      </div>

                      {/* Experience */}

                      <div className="p-3">
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >
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
                                    5.4,
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
                              {experience.company ||
                                "Organisation"}
                            </p>
                          </div>

                          <span
                            className="
                              shrink-0
                              font-mono
                              uppercase
                              tracking-[0.06em]
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  3.4,
                                  fontScale
                                ),
                            }}
                          >
                            Runtime
                          </span>
                        </div>

                        {(employmentType ||
                          experience.location) && (
                          <div
                            className="
                              mt-1.5
                              flex
                              flex-wrap
                              gap-x-3
                              gap-y-1
                            "
                          >
                            {employmentType && (
                              <span
                                className="
                                  font-mono
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.7,
                                      fontScale
                                    ),
                                }}
                              >
                                {
                                  employmentType
                                }
                              </span>
                            )}

                            {experience.location && (
                              <span
                                className="
                                  font-mono
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.7,
                                      fontScale
                                    ),
                                }}
                              >
                                {
                                  experience.location
                                }
                              </span>
                            )}
                          </div>
                        )}

                        {experience.description && (
                          <ResumeDescription
                            description={
                              experience.description
                            }
                            className="
                              mt-2
                              leading-[1.42]
                              text-zinc-600
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  4.7,
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
            Fresher Professional Layer
        ===================================== */}

        {isFresher &&
          visibleExperiences.length ===
            0 && (
          <section
            style={sectionStyle}
          >
            <StackLayerHeading
              layer="L3"
              title="Professional Layer"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                grid
                grid-cols-[72px_1fr]
                border-x
                border-b
                border-zinc-200
              "
            >
              <div
                className="
                  border-r
                  border-zinc-200
                  bg-zinc-50
                  px-2.5
                  py-3
                "
              >
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
                        3.7,
                        fontScale
                      ),
                  }}
                >
                  L3.0
                </p>

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
                        3.3,
                        fontScale
                      ),
                  }}
                >
                  Initial
                </p>
              </div>

              <div className="p-3">
                <p
                  className="
                    font-bold
                    leading-[1.3]
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
                  Professional layer
                  ready for deployment.
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
                        4.6,
                        fontScale
                      ),
                  }}
                >
                  Bringing technical
                  foundations,
                  hands-on projects,
                  problem-solving, and
                  continuous learning
                  into the first
                  professional role.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================
            Build Layer / Projects
        ===================================== */}

        {visibleProjects.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <StackLayerHeading
              layer="L4"
              title="Build Layer / Selected Systems"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                grid
                grid-cols-2
                border-x
                border-b
                border-zinc-200
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
                      className={`
                        relative
                        p-3
                        ${
                          index % 2 ===
                          0
                            ? "border-r border-zinc-200"
                            : ""
                        }
                        ${
                          index <
                          visibleProjects.length -
                            2
                            ? "border-b border-zinc-200"
                            : ""
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-2
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
                          {`BUILD.${String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}`}
                        </span>

                        {(project.projectUrl ||
                          project.githubUrl) && (
                          <span
                            className="
                              font-mono
                              uppercase
                              text-zinc-400
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  3.3,
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
                          </span>
                        )}
                      </div>

                      <h4
                        className="
                          mt-1
                          font-bold
                          leading-[1.2]
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
                        {project.name ||
                          "Project"}
                      </h4>

                      {technologies.length >
                        0 && (
                        <div
                          className="
                            mt-2
                            flex
                            flex-wrap
                            gap-1
                          "
                        >
                          {technologies.map(
                            (
                              technology,
                              technologyIndex
                            ) => (
                              <span
                                key={`${technology}-${technologyIndex}`}
                                className="
                                  border
                                  border-zinc-200
                                  bg-zinc-50
                                  px-1.5
                                  py-0.5
                                  font-mono
                                  text-zinc-500
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.4,
                                      fontScale
                                    ),
                                }}
                              >
                                {
                                  technology
                                }
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {project.description && (
                        <ResumeDescription
                          description={
                            project.description
                          }
                          className="
                            mt-2
                            leading-[1.4]
                            text-zinc-600
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                4.4,
                                fontScale
                              ),
                          }}
                        />
                      )}

                      <div
                        className="
                          absolute
                          bottom-0
                          left-3
                          h-[3px]
                          w-8
                        "
                        style={{
                          backgroundColor:
                            accentColor,
                        }}
                      />
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =====================================
            Foundation / Support Layers
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
            <StackLayerHeading
              layer="L5"
              title="Foundation & Support Layers"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            />

            <div
              className="
                grid
                grid-cols-3
                border-x
                border-b
                border-zinc-200
              "
            >
              {/* Education */}

              <div
                className="
                  border-r
                  border-zinc-200
                  p-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    border-b
                    border-zinc-200
                    pb-1.5
                  "
                >
                  <h4
                    className="
                      font-bold
                      uppercase
                      tracking-[0.06em]
                      text-zinc-800
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.1,
                          fontScale
                        ),
                    }}
                  >
                    Education
                  </h4>

                  <span
                    className="
                      font-mono
                      text-zinc-400
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          3.3,
                          fontScale
                        ),
                    }}
                  >
                    BASE
                  </span>
                </div>

                {visibleEducations.length >
                0 ? (
                  <div className="mt-2 space-y-2.5">
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
                            .join(
                              " – "
                            );

                        const qualification =
                          [
                            education.degree,
                            education.fieldOfStudy,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            );

                        return (
                          <article
                            key={
                              education.id
                            }
                          >
                            <h5
                              className="
                                font-semibold
                                leading-[1.25]
                                text-zinc-800
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.3,
                                    fontScale
                                  ),
                              }}
                            >
                              {qualification ||
                                "Qualification"}
                            </h5>

                            {education.institution && (
                              <p
                                className="
                                  mt-0.5
                                  font-medium
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
                                      3.4,
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
                ) : (
                  <p
                    className="
                      mt-2
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
                    —
                  </p>
                )}
              </div>

              {/* Certifications */}

              <div
                className="
                  border-r
                  border-zinc-200
                  p-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    border-b
                    border-zinc-200
                    pb-1.5
                  "
                >
                  <h4
                    className="
                      font-bold
                      uppercase
                      tracking-[0.06em]
                      text-zinc-800
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.1,
                          fontScale
                        ),
                    }}
                  >
                    Certifications
                  </h4>

                  <span
                    className="
                      font-mono
                      text-zinc-400
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          3.3,
                          fontScale
                        ),
                    }}
                  >
                    EXT
                  </span>
                </div>

                {visibleCertifications.length >
                0 ? (
                  <div className="mt-2 space-y-2.5">
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
                                    4.1,
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
                                      3.4,
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
                ) : (
                  <p
                    className="
                      mt-2
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
                    —
                  </p>
                )}
              </div>

              {/* Languages */}

              <div className="p-3">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    border-b
                    border-zinc-200
                    pb-1.5
                  "
                >
                  <h4
                    className="
                      font-bold
                      uppercase
                      tracking-[0.06em]
                      text-zinc-800
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          4.1,
                          fontScale
                        ),
                    }}
                  >
                    Languages
                  </h4>

                  <span
                    className="
                      font-mono
                      text-zinc-400
                    "
                    style={{
                      fontSize:
                        scaledFontSize(
                          3.3,
                          fontScale
                        ),
                    }}
                  >
                    IO
                  </span>
                </div>

                {visibleLanguages.length >
                0 ? (
                  <div className="mt-2 space-y-2">
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
                                font-semibold
                                text-zinc-700
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    4.1,
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
                                  font-mono
                                  text-zinc-400
                                "
                                style={{
                                  fontSize:
                                    scaledFontSize(
                                      3.4,
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
                ) : (
                  <p
                    className="
                      mt-2
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
                    —
                  </p>
                )}
              </div>
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
              border
              border-zinc-300
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-zinc-300
                bg-zinc-50
                px-4
                py-2
              "
            >
              <span
                className="
                  font-mono
                  font-bold
                  uppercase
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
                Stack Status
              </span>

              <span className="h-px flex-1 bg-zinc-300" />

              <span
                className="
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
                EMPTY
              </span>
            </div>

            <div className="p-4">
              <div
                className="
                  mb-3
                  flex
                  gap-1
                "
                aria-hidden="true"
              >
                <span
                  className="
                    h-[5px]
                    w-14
                  "
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                />
                <span className="h-[5px] w-10 bg-zinc-950" />
                <span className="h-[5px] w-7 bg-zinc-300" />
                <span className="h-[5px] w-4 bg-zinc-200" />
              </div>

              <h3
                className="
                  font-bold
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
                Build your professional
                stack.
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
                      4.7,
                      fontScale
                    ),
                }}
              >
                Add your profile,
                technologies,
                professional
                experience, projects,
                education,
                certifications, and
                languages to assemble
                each layer.
              </p>
            </div>
          </div>
        )}

        {/* =====================================
            Footer
        ===================================== */}

        {hasResumeContent && (
          <footer
            className="
              mt-5
              flex
              items-center
              gap-2
              border-t
              border-zinc-200
              pt-2
            "
          >
            <span
              className="
                h-[5px]
                w-8
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <span className="h-[5px] w-6 bg-zinc-950" />
            <span className="h-[5px] w-4 bg-zinc-300" />

            <span
              className="
                ml-1
                font-mono
                font-bold
                uppercase
                tracking-[0.08em]
                text-zinc-500
              "
              style={{
                fontSize:
                  scaledFontSize(
                    3.5,
                    fontScale
                  ),
              }}
            >
              Professional Stack
            </span>

            <span className="h-px flex-1 bg-zinc-200" />

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
                    3.4,
                    fontScale
                  ),
              }}
            >
              Layers Complete
            </span>
          </footer>
        )}
      </div>
    </div>
  );
};

export default StackTemplate;