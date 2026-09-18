import {
  ArrowRight,
  Clock3,
  FilePlus2,
  FileText,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import useResumeStore from "../../stores/resumeStore";

const RecentResumes = () => {
  const resumes =
    useResumeStore(
      (state) =>
        state.resumes
    );

  /* ========================================
     Recent Resumes
  ======================================== */

  const recentResumes = [
    ...resumes,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.updatedAt
        ).getTime() -
        new Date(
          a.updatedAt
        ).getTime()
    )
    .slice(0, 3);

  /* ========================================
     Format Date
  ======================================== */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Recently";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Recently";
    }

    return new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(
      parsedDate
    );
  };

  return (
    <section
      className="
        border-b
        border-stone-200
        dark:border-zinc-800

        bg-[#f8f7f4]
        dark:bg-[#111113]
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
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.15em]

                text-zinc-400
                dark:text-zinc-500
              "
            >
              Continue your work
            </p>

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
              Recent resumes
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
              Pick up where you
              left off or start
              something new.
            </p>
          </div>

          {resumes.length >
            0 && (
            <Link
              to="/resumes"
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
              View all resumes

              <ArrowRight
                size={15}
                aria-hidden="true"
              />
            </Link>
          )}
        </div>

        {/* =====================================
            Empty State
        ===================================== */}

        {recentResumes.length ===
        0 ? (
          <div
            className="
              mt-8

              rounded-3xl

              border
              border-dashed
              border-stone-300
              dark:border-zinc-700

              bg-white/50
              dark:bg-zinc-900/40

              px-6
              py-12

              text-center

              sm:px-10
              sm:py-14
            "
          >
            <div
              className="
                mx-auto

                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-violet-50
                dark:bg-violet-950/30

                text-violet-700
                dark:text-violet-300
              "
            >
              <FilePlus2
                size={24}
                aria-hidden="true"
              />
            </div>

            <h3
              className="
                mt-5

                text-xl
                font-black
                tracking-[-0.03em]

                text-zinc-950
                dark:text-white
              "
            >
              No resumes yet
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md

                text-sm
                leading-6

                text-zinc-500
                dark:text-zinc-400
              "
            >
              Your recently edited
              resumes will appear
              here once you start
              building.
            </p>

            <Link
              to="/builder/new"
              className="
                mt-6

                inline-flex
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-zinc-950
                dark:bg-white

                px-5
                py-3

                text-sm
                font-black

                shadow-sm

                transition-all

                hover:-translate-y-0.5
                hover:bg-zinc-800
                hover:shadow-md

                dark:hover:bg-zinc-100
              "
            >
              <FilePlus2
                size={15}
                aria-hidden="true"
                className="
                  text-white
                  dark:text-zinc-950
                "
              />

              <span
                className="
                  text-white
                  dark:text-zinc-950
                "
              >
                Create Resume
              </span>
            </Link>
          </div>
        ) : (
          /* =====================================
             Resume Cards
          ===================================== */

          <div
            className="
              mt-8

              grid
              gap-5

              md:grid-cols-3
            "
          >
            {recentResumes.map(
              (resume) => {
                const score =
                  Number(
                    resume
                      .analysis
                      ?.overallScore
                  ) || 0;

                const hasAnalyzed =
                  resume
                    .analysis
                    ?.hasAnalyzed ===
                  true;

                return (
                  <Link
                    key={
                      resume.id
                    }
                    to={`/builder/${resume.id}`}
                    className="
                      group

                      min-w-0

                      overflow-hidden

                      rounded-3xl

                      border
                      border-stone-200
                      dark:border-zinc-800

                      bg-white
                      dark:bg-zinc-900

                      shadow-sm

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-stone-300
                      hover:shadow-lg
                      hover:shadow-zinc-900/5

                      dark:hover:border-zinc-700
                      dark:hover:shadow-black/20
                    "
                  >
                    {/* ===========================
                        Mini Resume Preview
                    =========================== */}

                    <div
                      className="
                        bg-[#f3f1ec]
                        dark:bg-zinc-950

                        px-8
                        py-7
                      "
                    >
                      <div
                        className="
                          mx-auto

                          aspect-[1/1.414]
                          w-full
                          max-w-[175px]

                          overflow-hidden

                          rounded-md

                          border
                          border-stone-200

                          bg-white

                          p-4

                          shadow-md

                          transition-transform
                          duration-300

                          group-hover:scale-[1.015]
                        "
                      >
                        <div
                          className="
                            border-b
                            border-zinc-200

                            pb-3
                          "
                        >
                          <div
                            className="
                              h-2.5
                              w-20

                              rounded-full

                              bg-zinc-900
                            "
                          />

                          <div
                            className="
                              mt-2

                              h-1.5
                              w-14

                              rounded-full

                              bg-violet-500
                            "
                          />
                        </div>

                        <div
                          className="
                            mt-4
                            space-y-1.5
                          "
                        >
                          <div
                            className="
                              h-1
                              w-full

                              rounded-full

                              bg-zinc-200
                            "
                          />

                          <div
                            className="
                              h-1
                              w-[90%]

                              rounded-full

                              bg-zinc-200
                            "
                          />

                          <div
                            className="
                              h-1
                              w-[70%]

                              rounded-full

                              bg-zinc-200
                            "
                          />
                        </div>

                        <div
                          className="
                            mt-5
                          "
                        >
                          <div
                            className="
                              h-1.5
                              w-14

                              rounded-full

                              bg-zinc-700
                            "
                          />

                          <div
                            className="
                              mt-3
                              space-y-3
                            "
                          >
                            {[1, 2].map(
                              (
                                item
                              ) => (
                                <div
                                  key={
                                    item
                                  }
                                >
                                  <div
                                    className="
                                      h-1.5
                                      w-16

                                      rounded-full

                                      bg-zinc-400
                                    "
                                  />

                                  <div
                                    className="
                                      mt-2
                                      space-y-1.5
                                    "
                                  >
                                    <div
                                      className="
                                        h-1
                                        w-full

                                        rounded-full

                                        bg-zinc-200
                                      "
                                    />

                                    <div
                                      className="
                                        h-1
                                        w-[80%]

                                        rounded-full

                                        bg-zinc-200
                                      "
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ===========================
                        Resume Information
                    =========================== */}

                    <div
                      className="
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div
                          className="
                            min-w-0
                          "
                        >
                          <h3
                            className="
                              truncate

                              text-base
                              font-black
                              tracking-[-0.02em]

                              text-zinc-950
                              dark:text-white
                            "
                          >
                            {
                              resume.title
                            }
                          </h3>

                          <div
                            className="
                              mt-2

                              flex
                              items-center
                              gap-1.5

                              text-xs
                              font-medium

                              text-zinc-400
                              dark:text-zinc-500
                            "
                          >
                            <Clock3
                              size={
                                12
                              }
                              aria-hidden="true"
                              className="
                                shrink-0
                              "
                            />

                            Updated{" "}
                            {formatDate(
                              resume.updatedAt
                            )}
                          </div>
                        </div>

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            bg-stone-100
                            dark:bg-zinc-800

                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          <FileText
                            size={
                              15
                            }
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div
                        className="
                          mt-5

                          flex
                          items-center
                          justify-between
                          gap-3

                          border-t
                          border-stone-100
                          dark:border-zinc-800

                          pt-4
                        "
                      >
                        <span
                          className="
                            text-xs
                            font-bold

                            text-zinc-400
                            dark:text-zinc-500
                          "
                        >
                          Resume health
                        </span>

                        <span
                          className={`
                            text-xs
                            font-black

                            ${
                              hasAnalyzed
                                ? `
                                    text-emerald-600
                                    dark:text-emerald-400
                                  `
                                : `
                                    text-zinc-400
                                    dark:text-zinc-500
                                  `
                            }
                          `}
                        >
                          {hasAnalyzed
                            ? `${score}/100`
                            : "Not analyzed"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}

        {/* =====================================
            New Resume Shortcut
        ===================================== */}

        {recentResumes.length >
          0 && (
          <div
            className="
              mt-5

              flex
              justify-center
            "
          >
            <Link
              to="/builder/new"
              className="
                inline-flex
                items-center
                gap-2

                rounded-xl

                px-4
                py-2.5

                text-xs
                font-black

                text-zinc-500
                dark:text-zinc-400

                transition-colors

                hover:bg-white
                hover:text-violet-600

                dark:hover:bg-zinc-900
                dark:hover:text-violet-400
              "
            >
              <FilePlus2
                size={14}
                aria-hidden="true"
              />

              Create another
              resume
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentResumes;