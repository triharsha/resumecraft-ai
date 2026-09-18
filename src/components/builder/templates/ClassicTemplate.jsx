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
    <div
      className="
        mb-1.5
        flex
        items-center
        gap-2
      "
    >
      <span
        className="
          h-px
          flex-1
        "
        style={{
          backgroundColor:
            accentColor,
        }}
      />

      <h3
        className="
          shrink-0
          font-serif
          font-bold
          uppercase
          leading-none
          tracking-[0.12em]
          text-zinc-900
        "
        style={{
          fontSize:
            scaledFontSize(
              7.5,
              fontScale
            ),
        }}
      >
        {children}
      </h3>

      <span
        className="
          h-px
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
   Classic Template
======================================== */

const ClassicTemplate = ({
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

      <header className="text-center">
        <h2
          className="
            font-serif
            font-bold
            uppercase
            leading-none
            tracking-[0.08em]
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
              font-serif
              font-semibold
              leading-tight
              text-zinc-600
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
        )}

        <div
          className="
            mt-2
            flex
            flex-wrap
            justify-center
            gap-x-2
            gap-y-0.5
            leading-[1.3]
            text-zinc-500
          "
          style={{
            fontSize:
              scaledFontSize(
                6.1,
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
              justify-center
              gap-x-2
              gap-y-0.5
              break-all
              leading-[1.2]
              text-zinc-400
            "
            style={{
              fontSize:
                scaledFontSize(
                  5.5,
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

        <div
          className="mt-2 h-px"
          style={{
            backgroundColor:
              accentColor,
          }}
        />
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
              text-center
              leading-[1.45]
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
                            font-serif
                            font-bold
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
                            text-zinc-600
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6.1,
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
                            font-serif
                            italic
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
                text-center
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
              be emphasized as core
              strengths.
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
                            font-serif
                            font-bold
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
                            text-zinc-600
                          "
                          style={{
                            fontSize:
                              scaledFontSize(
                                6.1,
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
                            font-serif
                            italic
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
            Skills
          </ResumeSectionHeading>

          <p
            className="
              text-center
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
            {skills.join(" · ")}
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
                    <p
                      className="
                        font-serif
                        font-bold
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

                    {technologies.length >
                      0 && (
                      <p
                        className="
                          mt-0.5
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
              (certification) => (
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
                  <div>
                    <p
                      className="
                        font-serif
                        font-bold
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

                  {certification.issueDate && (
                    <p
                      className="
                        shrink-0
                        font-serif
                        italic
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
              text-center
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
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;