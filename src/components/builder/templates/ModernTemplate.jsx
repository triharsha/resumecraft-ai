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

const ResumeSectionHeading = ({
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
        tracking-[0.14em]
      "
      style={{
        fontSize:
          scaledFontSize(
            7.5,
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
   Modern Template
======================================== */

const ModernTemplate = ({
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
        px-6
        py-5

        sm:px-7
        sm:py-6
      "
    >
      {/* Header */}

      <header>
        <h2
          className="
            font-black
            leading-none
            tracking-[-0.05em]
            text-zinc-950
          "
          style={{
            fontSize:
              scaledFontSize(
                19,
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

        <div
          className="
            mt-2
            flex
            flex-wrap
            gap-x-2
            gap-y-0.5
            leading-[1.3]
            text-zinc-500
          "
          style={{
            fontSize:
              scaledFontSize(
                6.2,
                fontScale
              ),
          }}
        >
          {personalInfo.email && (
            <span>
              {
                personalInfo.email
              }
            </span>
          )}

          {personalInfo.phone && (
            <span>
              {
                personalInfo.phone
              }
            </span>
          )}

          {personalInfo.location && (
            <span>
              {
                personalInfo.location
              }
            </span>
          )}
        </div>

        {(personalInfo.website ||
          personalInfo.linkedin ||
          personalInfo.github) && (
          <div
            className="
              mt-1
              flex
              flex-wrap
              gap-x-2
              gap-y-0.5
              break-all
              leading-[1.25]
              text-zinc-400
            "
            style={{
              fontSize:
                scaledFontSize(
                  5.7,
                  fontScale
                ),
            }}
          >
            {personalInfo.website && (
              <span>
                {
                  personalInfo.website
                }
              </span>
            )}

            {personalInfo.linkedin && (
              <span>
                {
                  personalInfo.linkedin
                }
              </span>
            )}

            {personalInfo.github && (
              <span>
                {
                  personalInfo.github
                }
              </span>
            )}
          </div>
        )}
      </header>

      {/* Summary */}

      {resume.summary && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Summary
          </ResumeSectionHeading>

          <p
            className="
              whitespace-pre-line
              leading-[1.45]
              text-zinc-700
            "
            style={{
              fontSize:
                scaledFontSize(
                  6.7,
                  fontScale
                ),
            }}
          >
            {resume.summary}
          </p>
        </section>
      )}

      {/* Experience */}

      {visibleExperiences.length >
        0 && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Experience
          </ResumeSectionHeading>

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
                        gap-3
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            font-black
                            leading-[1.3]
                            text-zinc-950
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                7.3,
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
                            leading-[1.3]
                            text-zinc-500
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6.2,
                                fontScale
                              ),
                          }}
                        >
                          {experience.company ||
                            "Organisation"}

                          {employmentType &&
                            ` · ${employmentType}`}

                          {experience.location &&
                            ` · ${experience.location}`}
                        </p>
                      </div>

                      {dateRange && (
                        <p
                          className="
                            shrink-0
                            text-right
                            font-semibold
                            leading-[1.3]
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.8,
                                fontScale
                              ),
                          }}
                        >
                          {dateRange}
                        </p>
                      )}
                    </div>

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
                              6.5,
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

      {/* Fresher */}

      {isFresher &&
        visibleExperiences.length ===
          0 && (
          <section style={sectionStyle}>
            <ResumeSectionHeading
              accentColor={
                accentColor
              }
              fontScale={
                fontScale
              }
            >
              Profile
            </ResumeSectionHeading>

            <p
              className="
                leading-[1.4]
                text-zinc-600
              "
              style={{
                fontSize:
                  scaledFontSize(
                    6.5,
                    fontScale
                  ),
              }}
            >
              Fresher profile.
              Education, skills,
              projects, internships,
              and certifications can
              be highlighted as the
              primary resume sections.
            </p>
          </section>
        )}

      {/* Education */}

      {visibleEducations.length >
        0 && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Education
          </ResumeSectionHeading>

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
                    .join(" · ");

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
                        gap-3
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            font-black
                            leading-[1.3]
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
                          {qualification ||
                            "Qualification"}
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
                                6.2,
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
                      </div>

                      {dateRange && (
                        <p
                          className="
                            shrink-0
                            text-right
                            font-semibold
                            leading-[1.3]
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.8,
                                fontScale
                              ),
                          }}
                        >
                          {dateRange}
                        </p>
                      )}
                    </div>

                    {education.description && (
                      <p
                        className="
                          mt-1
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

      {/* Skills */}

      {skills.length > 0 && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Technical Skills
          </ResumeSectionHeading>

          <p
            className="
              leading-[1.5]
              text-zinc-700
            "
            style={{
              fontSize:
                scaledFontSize(
                  6.6,
                  fontScale
                ),
            }}
          >
            {skills.join(" • ")}
          </p>
        </section>
      )}

      {/* Projects */}

      {visibleProjects.length >
        0 && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Projects
          </ResumeSectionHeading>

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
                  <div key={project.id}>
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
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
                              7.2,
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
                            font-semibold
                            text-zinc-400
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                5.6,
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
                            "GitHub"}
                        </p>
                      )}
                    </div>

                    {technologies.length >
                      0 && (
                      <p
                        className="
                          mt-0.5
                          font-semibold
                          leading-[1.35]
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              6,
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
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Certifications */}

      {visibleCertifications.length >
        0 && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Certifications
          </ResumeSectionHeading>

          <div className="space-y-1.5">
            {visibleCertifications.map(
              (certification) => {
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
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          font-black
                          leading-[1.3]
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
                                6,
                                fontScale
                              ),
                          }}
                        >
                          {
                            certification.issuer
                          }
                        </p>
                      )}
                    </div>

                    {issueDate && (
                      <p
                        className="
                          shrink-0
                          font-semibold
                          text-zinc-400
                        "
                        style={{
                          fontSize:
                            scaledFontSize(
                              5.7,
                              fontScale
                            ),
                        }}
                      >
                        {issueDate}
                      </p>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Languages */}

      {visibleLanguages.length >
        0 && (
        <section style={sectionStyle}>
          <ResumeSectionHeading
            accentColor={
              accentColor
            }
            fontScale={
              fontScale
            }
          >
            Languages
          </ResumeSectionHeading>

          <p
            className="
              leading-[1.5]
              text-zinc-700
            "
            style={{
              fontSize:
                scaledFontSize(
                  6.6,
                  fontScale
                ),
            }}
          >
            {visibleLanguages
              .map(
                (language) => {
                  const proficiency =
                    languageProficiencyLabels[
                      language.proficiency
                    ];

                  return proficiency
                    ? `${language.name} — ${proficiency}`
                    : language.name;
                }
              )
              .join(" • ")}
          </p>
        </section>
      )}

      {/* Empty */}

      {!resume.summary &&
        visibleExperiences.length ===
          0 &&
        visibleEducations.length ===
          0 &&
        skills.length === 0 &&
        visibleProjects.length ===
          0 &&
        visibleCertifications.length ===
          0 &&
        visibleLanguages.length ===
          0 &&
        !isFresher && (
          <div
            className="
              mt-4
              rounded-lg
              border
              border-dashed
              border-zinc-200
              p-3
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
                    6.6,
                    fontScale
                  ),
              }}
            >
              Add your resume
              information to see
              your live preview.
            </p>
          </div>
        )}
    </div>
  );
};

export default ModernTemplate;