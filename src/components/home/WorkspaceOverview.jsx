import {
  Activity,
  BriefcaseBusiness,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import useResumeStore from "../../stores/resumeStore";

const WorkspaceOverview = () => {
  const resumes =
    useResumeStore(
      (state) =>
        state.resumes
    );

  const activeResumeId =
    useResumeStore(
      (state) =>
        state.activeResumeId
    );

  /* ========================================
     Total Resumes
  ======================================== */

  const totalResumes =
    resumes.length;

  /* ========================================
     Average Resume Health
  ======================================== */

  const analyzedResumes =
    resumes.filter(
      (resume) =>
        Number(
          resume.analysis
            ?.overallScore
        ) > 0
    );

  const averageHealth =
    analyzedResumes.length > 0
      ? Math.round(
          analyzedResumes.reduce(
            (
              total,
              resume
            ) =>
              total +
              Number(
                resume.analysis
                  ?.overallScore ||
                  0
              ),
            0
          ) /
            analyzedResumes.length
        )
      : 0;

  /* ========================================
     Tailored Roles
  ======================================== */

  const tailoredRoles =
    resumes.filter(
      (resume) =>
        resume.jobTarget
          ?.jobTitle
          ?.trim()
    ).length;

  /* ========================================
     Primary Resume Target
  ======================================== */

  const activeResume =
    activeResumeId
      ? resumes.find(
          (resume) =>
            resume.id ===
            activeResumeId
        )
      : null;

  const mostRecentResume =
    [...resumes].sort(
      (a, b) =>
        new Date(
          b.updatedAt
        ).getTime() -
        new Date(
          a.updatedAt
        ).getTime()
    )[0] ?? null;

  const targetResume =
    activeResume ||
    mostRecentResume;

  /* ========================================
     Overview Cards
  ======================================== */

  const stats = [
    {
      id: "resumes",
      label:
        "Total Resumes",
      value:
        totalResumes,
      description:
        totalResumes === 0
          ? "Create your first professional resume."
          : `${totalResumes} ${
              totalResumes === 1
                ? "resume"
                : "resumes"
            } in your workspace.`,
      action:
        "View resumes",
      to: "/resumes",
      icon: FileText,
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
    },

    {
      id: "health",
      label:
        "Average Resume Health",
      value:
        averageHealth,
      suffix: "/100",
      description:
        analyzedResumes.length ===
        0
          ? "Analyze a resume to unlock your score."
          : `Based on ${analyzedResumes.length} ${
              analyzedResumes.length ===
              1
                ? "analyzed resume"
                : "analyzed resumes"
            }.`,
      action:
        "Start analysis",
      to:
        targetResume?.id
          ? `/builder/${targetResume.id}?section=analysis`
          : "/builder/new?section=analysis",
      icon: Activity,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    },

    {
      id: "roles",
      label:
        "Tailored Roles",
      value:
        tailoredRoles,
      description:
        tailoredRoles === 0
          ? "Optimize a resume for a target job."
          : `${tailoredRoles} ${
              tailoredRoles === 1
                ? "resume is"
                : "resumes are"
            } tailored for target roles.`,
      action:
        "Tailor resume",
      to:
        targetResume?.id
          ? `/builder/${targetResume.id}?section=job-target`
          : "/builder/new?section=job-target",
      icon:
        BriefcaseBusiness,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    },
  ];

  return (
    <section
      className="
        border-b
        border-stone-200
        dark:border-zinc-800

        bg-[#faf9f6]
        dark:bg-zinc-950
      "
    >
      <div
        className="
          container-shell

          py-12
          sm:py-14
          lg:py-16
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2

                text-xs
                font-black
                uppercase
                tracking-[0.15em]

                text-violet-600
                dark:text-violet-400
              "
            >
              <Sparkles
                size={13}
                aria-hidden="true"
              />

              Your Workspace
            </div>

            <h2
              className="
                mt-3

                text-2xl
                font-black
                tracking-[-0.04em]

                text-zinc-950
                dark:text-white

                sm:text-3xl
              "
            >
              Workspace overview
            </h2>

            <p
              className="
                mt-2

                max-w-xl

                text-sm
                leading-6

                text-zinc-500
                dark:text-zinc-400
              "
            >
              A quick view of your
              resumes, overall
              quality, and
              job-specific
              tailoring activity.
            </p>
          </div>

          <Link
            to="/builder/new"
            className="
              inline-flex
              w-fit
              items-center
              gap-2

              text-sm
              font-black

              text-zinc-950
              dark:text-white

              transition-colors

              hover:text-violet-600
              dark:hover:text-violet-400
            "
          >
            <Plus
              size={15}
              aria-hidden="true"
            />

            New Resume
          </Link>
        </div>

        {/* =====================================
            Stats
        ===================================== */}

        <div
          className="
            mt-8

            grid
            gap-4

            md:grid-cols-3
          "
        >
          {stats.map(
            (stat) => {
              const Icon =
                stat.icon;

              return (
                <article
                  key={
                    stat.id
                  }
                  className="
                    group

                    flex
                    min-w-0
                    flex-col

                    rounded-3xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-white
                    dark:bg-zinc-900

                    p-5

                    shadow-sm

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-stone-300
                    hover:shadow-lg
                    hover:shadow-zinc-900/5

                    dark:hover:border-zinc-700
                    dark:hover:shadow-black/20

                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        ${stat.iconClass}
                      `}
                    >
                      <Icon
                        size={17}
                        aria-hidden="true"
                      />
                    </div>

                    <span
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.14em]

                        text-zinc-300
                        dark:text-zinc-600
                      "
                    >
                      Overview
                    </span>
                  </div>

                  <div
                    className="
                      mt-7
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        gap-1
                      "
                    >
                      <span
                        className="
                          text-3xl
                          font-black
                          tracking-[-0.05em]

                          text-zinc-950
                          dark:text-white
                        "
                      >
                        {
                          stat.value
                        }
                      </span>

                      {stat.suffix && (
                        <span
                          className="
                            mb-1

                            text-xs
                            font-bold

                            text-zinc-400
                            dark:text-zinc-500
                          "
                        >
                          {
                            stat.suffix
                          }
                        </span>
                      )}
                    </div>

                    <h3
                      className="
                        mt-2

                        text-sm
                        font-black

                        text-zinc-950
                        dark:text-white
                      "
                    >
                      {
                        stat.label
                      }
                    </h3>

                    <p
                      className="
                        mt-2

                        min-h-10

                        text-xs
                        leading-5

                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      {
                        stat.description
                      }
                    </p>
                  </div>

                  <Link
                    to={stat.to}
                    className="
                      mt-6

                      border-t
                      border-stone-100
                      dark:border-zinc-800

                      pt-4

                      text-xs
                      font-black

                      text-zinc-950
                      dark:text-white

                      transition-colors

                      hover:text-violet-600
                      dark:hover:text-violet-400
                    "
                  >
                    {
                      stat.action
                    }{" "}
                    →
                  </Link>
                </article>
              );
            }
          )}
        </div>

        {/* =====================================
            Workspace Status
        ===================================== */}

        <div
          className="
            mt-4

            flex
            flex-col
            gap-4

            rounded-2xl

            border
            border-stone-200
            dark:border-zinc-800

            bg-white
            dark:bg-zinc-900

            px-5
            py-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-3
            "
          >
            <div
              className="
                mt-0.5

                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-lg

                bg-violet-50
                dark:bg-violet-950/30

                text-violet-600
                dark:text-violet-400
              "
            >
              <FileText
                size={14}
                aria-hidden="true"
              />
            </div>

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-xs
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                {totalResumes ===
                0
                  ? "Your workspace is ready."
                  : `${totalResumes} ${
                      totalResumes ===
                      1
                        ? "resume"
                        : "resumes"
                    } in your workspace.`}
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  leading-5

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {totalResumes ===
                0
                  ? "Create your first resume and ResumeCraft will begin tracking your progress here."
                  : "Continue building, analyzing, and tailoring your resumes from one workspace."}
              </p>
            </div>
          </div>

          <Link
            to={
              totalResumes > 0
                ? "/resumes"
                : "/builder/new"
            }
            className="
              shrink-0

              text-xs
              font-black

              text-zinc-950
              dark:text-white

              transition-colors

              hover:text-violet-600
              dark:hover:text-violet-400
            "
          >
            {totalResumes > 0
              ? "View resumes"
              : "Get started"}{" "}
            →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceOverview;