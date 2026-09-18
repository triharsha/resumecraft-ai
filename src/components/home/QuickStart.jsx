import {
  ArrowRight,
  FilePlus2,
  FileUp,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import ResumeImportAction from "../ui/ResumeImportAction";

const QuickStart = () => {
  const options = [
    {
      id: "scratch",
      number: "01",
      title:
        "Start from scratch",
      description:
        "Create a clean resume and build each section step by step with ResumeCraft guidance.",
      icon: FilePlus2,
      action:
        "Create Resume",
      to: "/builder/new",
      accent:
        "violet",
    },
    {
      id: "template",
      number: "02",
      title:
        "Choose a template",
      description:
        "Begin with a professionally designed, ATS-conscious resume layout.",
      icon: LayoutTemplate,
      action:
        "Browse Templates",
      to: "/templates",
      accent:
        "emerald",
    },
    {
      id: "import",
      number: "03",
      title:
        "Import your resume",
      description:
        "Import an existing text-based PDF resume, review the detected content, and continue editing in Builder.",
      icon: FileUp,
      action:
        "Import Resume",
      to: null,
      accent:
        "amber",
    },
  ];

  const getAccentClasses = (
    accent
  ) => {
    if (
      accent === "emerald"
    ) {
      return {
        icon: `
          bg-emerald-50
          dark:bg-emerald-950/30

          text-emerald-700
          dark:text-emerald-400
        `,
        number:
          "text-emerald-600 dark:text-emerald-400",
      };
    }

    if (
      accent === "amber"
    ) {
      return {
        icon: `
          bg-amber-50
          dark:bg-amber-950/30

          text-amber-700
          dark:text-amber-400
        `,
        number:
          "text-amber-600 dark:text-amber-400",
      };
    }

    return {
      icon: `
        bg-violet-50
        dark:bg-violet-950/30

        text-violet-700
        dark:text-violet-300
      `,
      number:
        "text-violet-600 dark:text-violet-400",
    };
  };

  return (
    <section
      className="
        border-t
        border-stone-200
        dark:border-zinc-800

        bg-white/40
        dark:bg-zinc-900/20
      "
    >
      <div
        className="
          container-shell

          py-14
          sm:py-16
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

              Quick Start
            </div>

            <h2
              className="
                mt-3

                text-3xl
                font-black
                tracking-[-0.04em]

                text-zinc-950
                dark:text-white

                sm:text-4xl
              "
            >
              Start your next
              resume your way.
            </h2>

            <p
              className="
                mt-3
                max-w-2xl

                text-sm
                leading-7

                text-zinc-500
                dark:text-zinc-400

                sm:text-base
              "
            >
              Begin with a blank
              workspace, choose a
              professional template,
              or import an existing
              PDF resume.
            </p>
          </div>
        </div>

        {/* =====================================
            Options
        ===================================== */}

        <div
          className="
            mt-8

            grid
            gap-4

            lg:grid-cols-3
          "
        >
          {options.map(
            ({
              id,
              number,
              title,
              description,
              icon: Icon,
              action,
              to,
              accent,
            }) => {
              const styles =
                getAccentClasses(
                  accent
                );

              const content = (
                <>
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
                        h-11
                        w-11
                        items-center
                        justify-center

                        rounded-2xl

                        ${styles.icon}
                      `}
                    >
                      <Icon
                        size={19}
                        aria-hidden="true"
                      />
                    </div>

                    <span
                      className={`
                        text-xs
                        font-black
                        tracking-[0.12em]

                        ${styles.number}
                      `}
                    >
                      {number}
                    </span>
                  </div>

                  <h3
                    className="
                      mt-8

                      text-xl
                      font-black
                      tracking-[-0.03em]

                      text-zinc-950
                      dark:text-white
                    "
                  >
                    {title}
                  </h3>

                  <p
                    className="
                      mt-3

                      min-h-20

                      text-sm
                      leading-7

                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    {description}
                  </p>

                  <div
                    className="
                      mt-6

                      flex
                      items-center
                      justify-between

                      border-t
                      border-stone-100
                      dark:border-zinc-800

                      pt-4
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-black

                        text-zinc-700
                        dark:text-zinc-300
                      "
                    >
                      {action}
                    </span>

                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="
                        text-zinc-400

                        transition-transform

                        group-hover:translate-x-1
                        group-hover:text-violet-600

                        dark:group-hover:text-violet-400
                      "
                    />
                  </div>
                </>
              );

              if (!to) {
                return (
                  <ResumeImportAction
                    key={id}
                  >
                    {({
                      openFilePicker,
                      isProcessing,
                    }) => (
                      <button
                        type="button"
                        onClick={
                          openFilePicker
                        }
                        disabled={
                          isProcessing
                        }
                        className="
                          group

                          w-full

                          rounded-3xl

                          border
                          border-stone-200
                          dark:border-zinc-800

                          bg-white
                          dark:bg-zinc-900

                          p-6

                          text-left

                          shadow-sm

                          transition-all
                          duration-300

                          hover:-translate-y-1
                          hover:border-stone-300
                          hover:shadow-lg
                          hover:shadow-zinc-900/5

                          dark:hover:border-zinc-700
                          dark:hover:shadow-black/20

                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >
                        {content}
                      </button>
                    )}
                  </ResumeImportAction>
                );
              }

              return (
                <Link
                  key={id}
                  to={to}
                  className="
                    group

                    rounded-3xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-white
                    dark:bg-zinc-900

                    p-6

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
                  {content}
                </Link>
              );
            }
          )}
        </div>

        {/* =====================================
            Bottom CTA
        ===================================== */}

        <div
          className="
            mt-8

            overflow-hidden

            rounded-3xl

            bg-zinc-950
            dark:bg-white
          "
        >
          <div
            className="
              relative

              flex
              flex-col
              gap-6

              px-6
              py-8

              sm:px-8

              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-10
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -right-16
                -top-20

                h-52
                w-52

                rounded-full

                bg-violet-500/20
                dark:bg-violet-300/20

                blur-3xl
              "
            />

            <div
              className="
                relative

                max-w-2xl
              "
            >
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.14em]

                  text-violet-300
                  dark:text-violet-600
                "
              >
                Your next opportunity
                starts here
              </p>

              <h3
                className="
                  mt-2

                  text-2xl
                  font-black
                  tracking-[-0.03em]

                  text-white
                  dark:text-zinc-950

                  sm:text-3xl
                "
              >
                Build a stronger resume
                before your next
                application.
              </h3>
            </div>

            <Link
              to="/builder/new"
              className="
                relative

                inline-flex
                w-fit
                shrink-0
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-white
                dark:bg-zinc-950

                px-5
                py-3

                text-sm
                font-black

                text-zinc-950
                dark:text-white

                transition-all

                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >
              <Sparkles
                size={15}
                aria-hidden="true"
                className="
                  text-violet-600
                  dark:text-violet-300
                "
              />

              Create Resume

              <ArrowRight
                size={15}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickStart;