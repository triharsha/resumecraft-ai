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

const HorizonSectionHeading = ({
  children,
  accentColor,
  fontScale,
}) => {
  return (
    <div
      className="
        mb-2
        flex
        items-end
        gap-3
      "
    >
      <h3
        className="
          shrink-0
          font-black
          uppercase
          leading-none
          tracking-[0.16em]
          text-zinc-950
        "
        style={{
          fontSize:
            scaledFontSize(
              7.2,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <div
        className="
          mb-[2px]
          h-[2px]
          flex-1
        "
        style={{
          backgroundColor:
            accentColor,
        }}
      />
    </div>
  );
};

/* ========================================
   Contact Item
======================================== */

const ContactItem = ({
  label,
  value,
  fontScale,
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <span
        className="
          mr-1
          font-black
          uppercase
          tracking-[0.1em]
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
        {label}
      </span>

      <span
        className="
          break-all
          font-semibold
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
        {value}
      </span>
    </div>
  );
};

/* ========================================
   Horizon Template
======================================== */

const HorizonTemplate = ({
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
        11,
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
        px-7
        py-6
        text-zinc-900
        sm:px-8
      "
    >
      {/* =====================================
          Header
      ===================================== */}

      <header>
        <div
          className="
            flex
            items-end
            justify-between
            gap-5
          "
        >
          <div className="min-w-0">
            <p
              className="
                mb-1.5
                font-black
                uppercase
                leading-none
                tracking-[0.22em]
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
              Curriculum Vitae
            </p>

            <h2
              className="
                font-black
                leading-[0.9]
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
          </div>

          {personalInfo.jobTitle && (
            <div
              className="
                max-w-[40%]
                shrink-0
                text-right
              "
            >
              <p
                className="
                  font-black
                  leading-[1.15]
                  text-zinc-700
                "
                style={{
                  fontSize:
                    scaledFontSize(
                      8,
                      fontScale
                    ),
                }}
              >
                {
                  personalInfo.jobTitle
                }
              </p>
            </div>
          )}
        </div>

        {/* Horizon Accent */}

        <div
          className="
            mt-4
            flex
            h-2
            overflow-hidden
            rounded-full
            bg-zinc-100
          "
          aria-hidden="true"
        >
          <div
            className="w-[38%]"
            style={{
              backgroundColor:
                accentColor,
            }}
          />

          <div
            className="
              w-[12%]
              bg-zinc-900
            "
          />
        </div>

        {/* Contact Band */}

        {hasContactInfo && (
          <div
            className="
              mt-3
              grid
              grid-cols-3
              gap-x-4
              gap-y-1.5
              border-b
              border-zinc-200
              pb-3
            "
          >
            <ContactItem
              label="Email"
              value={
                personalInfo.email
              }
              fontScale={
                fontScale
              }
            />

            <ContactItem
              label="Phone"
              value={
                personalInfo.phone
              }
              fontScale={
                fontScale
              }
            />

            <ContactItem
              label="Location"
              value={
                personalInfo.location
              }
              fontScale={
                fontScale
              }
            />

            <ContactItem
              label="Web"
              value={
                personalInfo.website
              }
              fontScale={
                fontScale
              }
            />

            <ContactItem
              label="LinkedIn"
              value={
                personalInfo.linkedin
              }
              fontScale={
                fontScale
              }
            />

            <ContactItem
              label="GitHub"
              value={
                personalInfo.github
              }
              fontScale={
                fontScale
              }
            />
          </div>
        )}
      </header>

      {/* =====================================
          Summary
      ===================================== */}

      {resume.summary && (
        <section
          style={sectionStyle}
        >
          <div
            className="
              grid
              grid-cols-[22%_1fr]
              gap-5
            "
          >
            <HorizonSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </HorizonSectionHeading>

            <p
              className="
                whitespace-pre-line
                leading-[1.45]
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
          <HorizonSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Experience
          </HorizonSectionHeading>

          <div className="space-y-2.5">
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
                    className="
                      grid
                      grid-cols-[22%_1fr]
                      gap-5
                    "
                  >
                    <div>
                      {dateRange && (
                        <p
                          className="
                            font-black
                            leading-[1.3]
                          "
                          style={{
                            color:
                              accentColor,

                            fontSize:
                              scaledFontSize(
                                5.7,
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
                                5.3,
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
                      <p
                        className="
                          font-black
                          leading-[1.25]
                          text-zinc-950
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              7.1,
                              fontScale
                            ),
                        }}
                      >
                        {experience.jobTitle ||
                          "Job Title"}
                      </p>

                      <p
                        className="
                          mt-0.5
                          font-semibold
                          leading-[1.3]
                          text-zinc-500
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              5.9,
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
                            leading-[1.4]
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
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* =====================================
          Fresher Focus
      ===================================== */}

      {isFresher &&
        visibleExperiences.length ===
          0 && (
        <section
          style={sectionStyle}
        >
          <HorizonSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Career Focus
          </HorizonSectionHeading>

          <div
            className="
              grid
              grid-cols-[22%_1fr]
              gap-5
            "
          >
            <p
              className="
                font-black
                uppercase
                leading-[1.3]
                tracking-[0.12em]
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
              Early Career
            </p>

            <p
              className="
                border-l
                border-zinc-200
                pl-4
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
              Education, projects,
              technical skills,
              internships, and
              certifications form the
              primary evidence of
              capability for this
              profile.
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
          <HorizonSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Projects
          </HorizonSectionHeading>

          <div
            className="
              grid
              grid-cols-2
              gap-x-5
              gap-y-2.5
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
                  <div
                    key={
                      project.id
                    }
                    className="
                      border-t
                      border-zinc-200
                      pt-2
                    "
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
                          leading-[1.25]
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
                        {project.name ||
                          "Project"}
                      </p>

                      {(project.projectUrl ||
                        project.githubUrl) && (
                        <p
                          className="
                            shrink-0
                            font-black
                            uppercase
                            leading-none
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
                          {project.projectUrl &&
                            "Live"}

                          {project.projectUrl &&
                            project.githubUrl &&
                            " · "}

                          {project.githubUrl &&
                            "Code"}
                        </p>
                      )}
                    </div>

                    {technologies.length >
                      0 && (
                      <p
                        className="
                          mt-1
                          font-bold
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
                          text-zinc-700
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              5.9,
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

      {/* =====================================
          Skills
      ===================================== */}

      {skills.length > 0 && (
        <section
          style={sectionStyle}
        >
          <HorizonSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Core Skills
          </HorizonSectionHeading>

          <div
            className="
              grid
              grid-cols-4
              overflow-hidden
              rounded-lg
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
                  className="
                    border-b
                    border-r
                    border-zinc-200
                    px-2
                    py-1.5
                  "
                >
                  <p
                    className="
                      font-bold
                      leading-[1.2]
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
                    {skill}
                  </p>
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
          <HorizonSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Education
          </HorizonSectionHeading>

          <div
            className="
              grid
              grid-cols-2
              gap-x-5
              gap-y-2
            "
          >
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
                    .join(" · ");

                return (
                  <div
                    key={
                      education.id
                    }
                  >
                    <p
                      className="
                        font-black
                        leading-[1.25]
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
                      {qualification ||
                        "Qualification"}
                    </p>

                    {education.institution && (
                      <p
                        className="
                          mt-0.5
                          font-semibold
                          leading-[1.3]
                          text-zinc-500
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              5.6,
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

                    {dateRange && (
                      <p
                        className="
                          mt-1
                          font-bold
                        "
                        style={{
                          color:
                            accentColor,

                          fontSize:
                            scaledFontSize(
                              5.1,
                              fontScale
                            ),
                        }}
                      >
                        {dateRange}
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
                              5.5,
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
          <HorizonSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Additional
          </HorizonSectionHeading>

          <div
            className="
              grid
              grid-cols-2
              gap-5
            "
          >
            {visibleCertifications.length >
              0 && (
              <div>
                <p
                  className="
                    mb-1.5
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        5,
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
                              font-black
                              leading-[1.25]
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
                            {certification.name ||
                              "Certification"}
                          </p>

                          <p
                            className="
                              mt-0.5
                              leading-[1.3]
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
                            {[
                              certification.issuer,
                              issueDate,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
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
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-zinc-400
                  "
                  style={{
                    fontSize:
                      scaledFontSize(
                        5,
                        fontScale
                      ),
                  }}
                >
                  Languages
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-x-3
                    gap-y-1.5
                  "
                >
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
                              font-black
                              leading-[1.25]
                              text-zinc-800
                            "
                            style={{
                              fontSize:
                                scaledFontSize(
                                  5.7,
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
                                leading-[1.25]
                                text-zinc-400
                              "
                              style={{
                                fontSize:
                                  scaledFontSize(
                                    5,
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
            mt-5
            rounded-lg
            border
            border-dashed
            border-zinc-200
            p-4
            text-center
          "
        >
          <p
            className="
              leading-[1.4]
              text-zinc-400
            "
            style={{
              fontSize:
                scaledFontSize(
                  6.5,
                  fontScale
                ),
            }}
          >
            Add your resume
            information to see your
            live Horizon preview.
          </p>
        </div>
      )}
    </div>
  );
};

export default HorizonTemplate;