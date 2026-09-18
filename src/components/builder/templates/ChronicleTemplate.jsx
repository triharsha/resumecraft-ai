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

const ChronicleSectionHeading = ({
  children,
  accentColor,
  fontScale,
  label,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[17%_1fr]
        items-end
        gap-4
        border-b
        border-zinc-300
        pb-1.5
      "
    >
      <span
        className="
          font-semibold
          uppercase
          leading-none
          tracking-[0.16em]
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
        {label}
      </span>

      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <h3
          className="
            font-serif
            font-bold
            leading-none
            tracking-[-0.015em]
            text-zinc-950
          "
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",

            fontSize:
              scaledFontSize(
                8,
                fontScale
              ),
          }}
        >
          {children}
        </h3>

        <span
          className="
            h-[3px]
            w-7
            shrink-0
          "
          style={{
            backgroundColor:
              accentColor,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

/* ========================================
   Chronicle Template
======================================== */

const ChronicleTemplate = ({
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
          px-9
          pb-8
          pt-8
        "
      >
        {/* =====================================
            Editorial Masthead
        ===================================== */}

        <header>
          <div
            className="
              flex
              items-center
              justify-between
              border-y
              border-zinc-950
              py-1.5
            "
          >
            <span
              className="
                font-semibold
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
              style={{
                fontSize:
                  scaledFontSize(
                    4.4,
                    fontScale
                  ),
              }}
            >
              Professional Chronicle
            </span>

            {personalInfo.location && (
              <span
                className="
                  font-serif
                  italic
                  text-zinc-500
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
                {
                  personalInfo.location
                }
              </span>
            )}
          </div>

          <div
            className="
              grid
              grid-cols-[1fr_34%]
              gap-7
              py-4
            "
          >
            <div className="min-w-0">
              <h2
                className="
                  font-serif
                  font-bold
                  leading-[0.88]
                  tracking-[-0.04em]
                  text-zinc-950
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

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
                    font-serif
                    italic
                    leading-[1.2]
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",

                    color:
                      accentColor,

                    fontSize:
                      scaledFontSize(
                        7.2,
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
                border-l
                border-zinc-300
                pl-4
              "
            >
              <p
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
                      5.8,
                      fontScale
                    ),
                }}
              >
                Contact Record
              </p>

              {hasContactInfo ? (
                <div className="mt-1.5 space-y-0.5">
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
                    mt-1.5
                    font-serif
                    italic
                    leading-[1.35]
                    text-zinc-400
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",

                    fontSize:
                      scaledFontSize(
                        4.9,
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

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1
                w-1
                shrink-0
              "
              style={{
                backgroundColor:
                  accentColor,
              }}
            />

            <div
              className="
                h-[3px]
                flex-1
                bg-zinc-950
              "
            />
          </div>
        </header>

        {/* =====================================
            Profile
        ===================================== */}

        {resume.summary && (
          <section
            style={sectionStyle}
          >
            <ChronicleSectionHeading
              label="Editorial"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </ChronicleSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-[17%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-serif
                  italic
                  leading-[1.45]
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
                  font-serif
                  leading-[1.5]
                  text-zinc-700
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
                {resume.summary}
              </p>
            </div>
          </section>
        )}

        {/* =====================================
            Career Chronicle
        ===================================== */}

        {visibleExperiences.length >
          0 && (
          <section
            style={sectionStyle}
          >
            <ChronicleSectionHeading
              label="Record"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Chronicle
            </ChronicleSectionHeading>

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
                        grid-cols-[17%_1fr]
                        gap-4
                      "
                      style={{
                        paddingBottom:
                          scaledSpacing(
                            index ===
                              visibleExperiences.length -
                                1
                              ? 0
                              : 7,
                            spacingScale
                          ),

                        marginBottom:
                          scaledSpacing(
                            index ===
                              visibleExperiences.length -
                                1
                              ? 0
                              : 7,
                            spacingScale
                          ),

                        borderBottom:
                          index ===
                          visibleExperiences.length -
                            1
                            ? "none"
                            : "1px solid rgb(244 244 245)",
                      }}
                    >
                      <div>
                        {dateRange && (
                          <p
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
                                  5.4,
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
                            {
                              experience.location
                            }
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          border-l
                          border-zinc-300
                          pl-4
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
                                5.4,
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
                              mt-1.5
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
            <ChronicleSectionHeading
              label="Opening"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Career Beginning
            </ChronicleSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-[17%_1fr]
                gap-4
              "
            >
              <p
                className="
                  font-serif
                  font-bold
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
                Present
              </p>

              <p
                className="
                  border-l
                  border-zinc-300
                  pl-4
                  font-serif
                  leading-[1.5]
                  text-zinc-700
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize:
                    scaledFontSize(
                      5.9,
                      fontScale
                    ),
                }}
              >
                Beginning a professional
                career with academic
                preparation, practical
                projects, certifications,
                and a strong commitment
                to continued growth.
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
            <ChronicleSectionHeading
              label="Works"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Selected Works
            </ChronicleSectionHeading>

            <div
              className="
                mt-2.5
                grid
                grid-cols-2
                gap-x-6
                gap-y-3
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
                      key={project.id}
                      className="
                        border-t
                        border-zinc-300
                        pt-2
                      "
                    >
                      <p
                        className="
                          mb-1
                          font-semibold
                          uppercase
                          tracking-[0.14em]
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
                        Work{" "}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

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
                              6.3,
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
            Skills
        ===================================== */}

        {skills.length > 0 && (
          <section
            style={sectionStyle}
          >
            <ChronicleSectionHeading
              label="Index"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Skills Index
            </ChronicleSectionHeading>

            <div
              className="
                mt-2.5
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
                      items-baseline
                      gap-2
                    "
                  >
                    <span
                      className="
                        shrink-0
                        font-serif
                        italic
                      "
                      style={{
                        color:
                          accentColor,

                        fontFamily:
                          "Georgia, 'Times New Roman', serif",

                        fontSize:
                          scaledFontSize(
                            4.5,
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
                        leading-[1.35]
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
                      {skill}
                    </span>
                  </div>
                )
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
            <ChronicleSectionHeading
              label="Study"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Education Record
            </ChronicleSectionHeading>

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
                        grid-cols-[17%_1fr]
                        gap-4
                      "
                    >
                      <div>
                        {dateRange && (
                          <p
                            className="
                              font-serif
                              font-bold
                              leading-[1.3]
                              text-zinc-600
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

                      <div
                        className="
                          border-l
                          border-zinc-300
                          pl-4
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
                                  5.3,
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
            <ChronicleSectionHeading
              label="Notes"
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Credentials
            </ChronicleSectionHeading>

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
                      font-semibold
                      uppercase
                      tracking-[0.13em]
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
                      font-semibold
                      uppercase
                      tracking-[0.13em]
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
              mt-7
              border-y
              border-zinc-950
              py-5
            "
          >
            <p
              className="
                text-center
                font-serif
                italic
                leading-[1.5]
                text-zinc-500
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
              Add your professional
              history to begin your
              Chronicle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChronicleTemplate;