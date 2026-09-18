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
        font-bold
        uppercase
        leading-none
        tracking-[0.16em]
      "
      style={{
        fontSize:
          scaledFontSize(
            7,
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
   Minimal Template
======================================== */

const MinimalTemplate = ({
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
      <header>
        <h2
          className="
            font-semibold
            leading-none
            tracking-[-0.035em]
            text-zinc-950
          "
          style={{
            fontSize:
              scaledFontSize(
                18,
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
              font-medium
              leading-tight
              text-zinc-500
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
      </header>

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
                            font-semibold
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
                            font-medium
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
              be highlighted as
              primary resume
              strengths.
            </p>
          </section>
        )}

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
                            font-semibold
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
                        font-semibold
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
                          font-medium
                          leading-[1.35]
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
                        font-semibold
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
              .join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;