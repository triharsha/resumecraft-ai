import {
  Award,
  BriefcaseBusiness,
  Check,
  Code2,
  FileText,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

const EMPTY_TEXT = "Not detected";

const SectionCard = ({
  icon: Icon,
  title,
  detected = true,
  children,
}) => {
  return (
    <section
      className="
        rounded-2xl
        border
        border-zinc-200
        bg-white
        p-4

        dark:border-zinc-800
        dark:bg-zinc-900
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl

              bg-violet-50
              text-violet-700

              dark:bg-violet-950/40
              dark:text-violet-300
            "
          >
            <Icon
              size={17}
              aria-hidden="true"
            />
          </div>

          <h3
            className="
              truncate
              text-sm
              font-black
              text-zinc-950
              dark:text-white
            "
          >
            {title}
          </h3>
        </div>

        <div
          className={`
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-full
            px-2.5
            py-1
            text-[11px]
            font-black

            ${
              detected
                ? `
                  bg-emerald-50
                  text-emerald-700
                  dark:bg-emerald-950/40
                  dark:text-emerald-300
                `
                : `
                  bg-zinc-100
                  text-zinc-500
                  dark:bg-zinc-800
                  dark:text-zinc-400
                `
            }
          `}
        >
          {detected && (
            <Check
              size={12}
              strokeWidth={3}
              aria-hidden="true"
            />
          )}

          {detected
            ? "Detected"
            : "Not found"}
        </div>
      </div>

      {detected && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </section>
  );
};

/* ========================================
   Personal Information
======================================== */

const PersonalPreview = ({
  personalInfo,
}) => {
  const fullName = [
    personalInfo?.firstName,
    personalInfo?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const detected = Boolean(
    fullName ||
      personalInfo?.email ||
      personalInfo?.phone
  );

  return (
    <SectionCard
      icon={UserRound}
      title="Personal details"
      detected={detected}
    >
      <div className="space-y-3">
        <div>
          <p
            className="
              text-base
              font-black
              text-zinc-950
              dark:text-white
            "
          >
            {fullName ||
              EMPTY_TEXT}
          </p>

          {personalInfo?.jobTitle && (
            <p
              className="
                mt-1
                text-sm
                font-medium
                text-zinc-500
                dark:text-zinc-400
              "
            >
              {
                personalInfo.jobTitle
              }
            </p>
          )}
        </div>

        <div
          className="
            grid
            gap-2
            sm:grid-cols-2
          "
        >
          {personalInfo?.email && (
            <div
              className="
                flex
                min-w-0
                items-start
                gap-2
                text-sm
                text-zinc-600
                dark:text-zinc-300
              "
            >
              <Mail
                size={15}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span
                className="
                  min-w-0
                  break-all
                "
              >
                {
                  personalInfo.email
                }
              </span>
            </div>
          )}

          {personalInfo?.phone && (
            <div
              className="
                flex
                items-start
                gap-2
                text-sm
                text-zinc-600
                dark:text-zinc-300
              "
            >
              <Phone
                size={15}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {
                  personalInfo.phone
                }
              </span>
            </div>
          )}

          {personalInfo?.location && (
            <div
              className="
                flex
                items-start
                gap-2
                text-sm
                text-zinc-600
                dark:text-zinc-300
              "
            >
              <MapPin
                size={15}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {
                  personalInfo.location
                }
              </span>
            </div>
          )}
        </div>

        {(personalInfo?.linkedin ||
          personalInfo?.github ||
          personalInfo?.website) && (
          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {personalInfo.linkedin && (
              <span
                className="
                  max-w-full
                  truncate
                  rounded-lg
                  bg-zinc-100
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-zinc-600

                  dark:bg-zinc-800
                  dark:text-zinc-300
                "
              >
                LinkedIn detected
              </span>
            )}

            {personalInfo.github && (
              <span
                className="
                  rounded-lg
                  bg-zinc-100
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-zinc-600

                  dark:bg-zinc-800
                  dark:text-zinc-300
                "
              >
                GitHub detected
              </span>
            )}

            {personalInfo.website && (
              <span
                className="
                  rounded-lg
                  bg-zinc-100
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-zinc-600

                  dark:bg-zinc-800
                  dark:text-zinc-300
                "
              >
                Website detected
              </span>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

/* ========================================
   Summary
======================================== */

const SummaryPreview = ({
  summary,
}) => (
  <SectionCard
    icon={FileText}
    title="Summary"
    detected={Boolean(summary)}
  >
    <p
      className="
        text-sm
        leading-6
        text-zinc-600
        dark:text-zinc-300
      "
    >
      {summary}
    </p>
  </SectionCard>
);

/* ========================================
   Experience
======================================== */

const ExperiencePreview = ({
  experience,
}) => (
  <SectionCard
    icon={BriefcaseBusiness}
    title="Experience"
    detected={
      experience?.length > 0
    }
  >
    <div className="space-y-4">
      {experience?.map(
        (item) => (
          <div
            key={item.id}
            className="
              border-b
              border-zinc-100
              pb-4
              last:border-0
              last:pb-0

              dark:border-zinc-800
            "
          >
            <p
              className="
                text-sm
                font-black
                text-zinc-900
                dark:text-zinc-100
              "
            >
              {item.jobTitle ||
                "Untitled experience"}
            </p>

            {item.company && (
              <p
                className="
                  mt-1
                  text-xs
                  font-bold
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {item.company}
              </p>
            )}

            {item.description && (
              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-zinc-600
                  dark:text-zinc-300
                "
              >
                {item.description}
              </p>
            )}
          </div>
        )
      )}
    </div>
  </SectionCard>
);

/* ========================================
   Education
======================================== */

const EducationPreview = ({
  education,
}) => (
  <SectionCard
    icon={GraduationCap}
    title="Education"
    detected={
      education?.length > 0
    }
  >
    <div className="space-y-4">
      {education?.map(
        (item) => (
          <div
            key={item.id}
            className="
              border-b
              border-zinc-100
              pb-4
              last:border-0
              last:pb-0

              dark:border-zinc-800
            "
          >
            <p
              className="
                text-sm
                font-black
                text-zinc-900
                dark:text-zinc-100
              "
            >
              {[
                item.degree,
                item.fieldOfStudy,
              ]
                .filter(Boolean)
                .join(" · ") ||
                "Education"}
            </p>

            {item.institution && (
              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {item.institution}
              </p>
            )}

            {(item.startDate ||
              item.endDate) && (
              <p
                className="
                  mt-1
                  text-xs
                  text-zinc-400
                "
              >
                {item.startDate}
                {item.startDate &&
                  item.endDate &&
                  " – "}
                {item.endDate}
              </p>
            )}
          </div>
        )
      )}
    </div>
  </SectionCard>
);

/* ========================================
   Skills
======================================== */

const SkillsPreview = ({
  skills,
}) => (
  <SectionCard
    icon={Code2}
    title="Skills"
    detected={skills?.length > 0}
  >
    <div
      className="
        flex
        flex-wrap
        gap-2
      "
    >
      {skills?.map((skill) => (
        <span
          key={skill}
          className="
            rounded-lg
            bg-zinc-100
            px-2.5
            py-1.5
            text-xs
            font-bold
            text-zinc-700

            dark:bg-zinc-800
            dark:text-zinc-300
          "
        >
          {skill}
        </span>
      ))}
    </div>
  </SectionCard>
);

/* ========================================
   Projects
======================================== */

const ProjectsPreview = ({
  projects,
}) => (
  <SectionCard
    icon={Code2}
    title="Projects"
    detected={
      projects?.length > 0
    }
  >
    <div className="space-y-4">
      {projects?.map(
        (project) => (
          <div
            key={project.id}
            className="
              border-b
              border-zinc-100
              pb-4
              last:border-0
              last:pb-0

              dark:border-zinc-800
            "
          >
            <p
              className="
                text-sm
                font-black
                text-zinc-900
                dark:text-zinc-100
              "
            >
              {project.name ||
                "Untitled project"}
            </p>

            {project.description && (
              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-zinc-600
                  dark:text-zinc-300
                "
              >
                {
                  project.description
                }
              </p>
            )}
          </div>
        )
      )}
    </div>
  </SectionCard>
);

/* ========================================
   Certifications
======================================== */

const CertificationsPreview = ({
  certifications,
}) => (
  <SectionCard
    icon={Award}
    title="Certifications"
    detected={
      certifications?.length >
      0
    }
  >
    <div className="space-y-3">
      {certifications?.map(
        (item) => (
          <div
            key={item.id}
            className="
              text-sm
              text-zinc-700
              dark:text-zinc-300
            "
          >
            <span className="font-bold">
              {item.name}
            </span>

            {item.issuer && (
              <span
                className="
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {" "}
                · {item.issuer}
              </span>
            )}
          </div>
        )
      )}
    </div>
  </SectionCard>
);

/* ========================================
   Languages
======================================== */

const LanguagesPreview = ({
  languages,
}) => (
  <SectionCard
    icon={Languages}
    title="Languages"
    detected={
      languages?.length > 0
    }
  >
    <div
      className="
        flex
        flex-wrap
        gap-2
      "
    >
      {languages?.map(
        (language) => (
          <span
            key={language.id}
            className="
              rounded-lg
              bg-zinc-100
              px-2.5
              py-1.5
              text-xs
              font-bold
              text-zinc-700

              dark:bg-zinc-800
              dark:text-zinc-300
            "
          >
            {language.name}
          </span>
        )
      )}
    </div>
  </SectionCard>
);

/* ========================================
   Main Preview
======================================== */

const ImportPreview = ({
  resume,
}) => {
  if (!resume) {
    return null;
  }

  return (
    <div
      className="
        grid
        gap-4
      "
    >
      <PersonalPreview
        personalInfo={
          resume.personalInfo
        }
      />

      <SummaryPreview
        summary={resume.summary}
      />

      <ExperiencePreview
        experience={
          resume.experience
        }
      />

      <EducationPreview
        education={
          resume.education
        }
      />

      <SkillsPreview
        skills={resume.skills}
      />

      <ProjectsPreview
        projects={
          resume.projects
        }
      />

      <CertificationsPreview
        certifications={
          resume.certifications
        }
      />

      <LanguagesPreview
        languages={
          resume.languages
        }
      />
    </div>
  );
};

export default ImportPreview;