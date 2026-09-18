import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Gauge,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const AIWorkspace = () => {
  const capabilities = [
    {
      id: "writing",
      title:
        "Improve your writing",
      description:
        "Turn rough summaries and experience bullets into stronger, professional resume content.",
      icon: WandSparkles,
      color:
        "violet",
    },
    {
      id: "ats",
      title:
        "Check ATS readiness",
      description:
        "Identify missing sections, weak content, formatting risks, and opportunities to strengthen your resume.",
      icon: Gauge,
      color:
        "emerald",
    },
    {
      id: "tailoring",
      title:
        "Tailor to a job",
      description:
        "Compare your resume against a target job description and discover relevant keywords and gaps.",
      icon: FileSearch,
      color:
        "amber",
    },
  ];

  const getIconClass = (
    color
  ) => {
    if (
      color === "emerald"
    ) {
      return `
        bg-emerald-50
        dark:bg-emerald-950/30

        text-emerald-700
        dark:text-emerald-400
      `;
    }

    if (
      color === "amber"
    ) {
      return `
        bg-amber-50
        dark:bg-amber-950/30

        text-amber-700
        dark:text-amber-400
      `;
    }

    return `
      bg-violet-50
      dark:bg-violet-950/30

      text-violet-700
      dark:text-violet-300
    `;
  };

  return (
    <section
      className="
        border-t
        border-stone-200
        dark:border-zinc-800
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
            grid
            gap-8

            lg:grid-cols-[0.8fr_1.2fr]
            lg:items-end
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
              <BrainCircuit
                size={14}
                aria-hidden="true"
              />

              ResumeCraft AI
            </div>

            <h2
              className="
                mt-3

                max-w-xl

                text-3xl
                font-black
                tracking-[-0.04em]

                text-zinc-950
                dark:text-white

                sm:text-4xl
              "
            >
              Intelligent help,
              exactly where your
              resume needs it.
            </h2>
          </div>

          <p
            className="
              max-w-2xl

              text-sm
              leading-7

              text-zinc-500
              dark:text-zinc-400

              sm:text-base
            "
          >
            ResumeCraft combines
            structured analysis with
            AI-assisted writing so you
            can improve your resume
            without giving up control
            of your real experience.
          </p>
        </div>

        {/* =====================================
            AI Workspace
        ===================================== */}

        <div
          className="
            mt-9

            grid
            overflow-hidden

            rounded-3xl

            border
            border-violet-200
            dark:border-violet-900/40

            bg-white
            dark:bg-zinc-900

            shadow-sm

            lg:grid-cols-[1.1fr_0.9fr]
          "
        >
          {/* =================================
              Left — AI Coach
          ================================= */}

          <div
            className="
              relative
              overflow-hidden

              border-b
              border-violet-100
              dark:border-violet-900/30

              p-6

              sm:p-8

              lg:border-b-0
              lg:border-r
              lg:p-10
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                -left-16
                -top-16

                h-52
                w-52

                rounded-full

                bg-violet-100/80
                dark:bg-violet-950/20

                blur-3xl
              "
            />

            <div
              className="
                relative
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-violet-200
                  dark:border-violet-900/50

                  bg-violet-50
                  dark:bg-violet-950/20

                  px-3
                  py-1.5

                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.13em]

                  text-violet-700
                  dark:text-violet-300
                "
              >
                <Sparkles
                  size={12}
                  aria-hidden="true"
                />

                AI Coach Preview
              </div>

              <h3
                className="
                  mt-6

                  text-2xl
                  font-black
                  tracking-[-0.03em]

                  text-zinc-950
                  dark:text-white

                  sm:text-3xl
                "
              >
                Your resume is
                strong — but there
                are a few ways to
                make it better.
              </h3>

              <p
                className="
                  mt-3

                  max-w-xl

                  text-sm
                  leading-7

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                ResumeCraft AI will
                surface focused
                suggestions instead
                of rewriting your
                entire resume without
                context.
              </p>

              {/* Suggestions */}

              <div
                className="
                  mt-7
                  space-y-3
                "
              >
                <div
                  className="
                    flex
                    gap-3

                    rounded-2xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-[#faf9f6]
                    dark:bg-zinc-950

                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-lg

                      bg-violet-100
                      dark:bg-violet-950/40

                      text-violet-700
                      dark:text-violet-300
                    "
                  >
                    <Sparkles
                      size={14}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black

                        text-zinc-950
                        dark:text-white
                      "
                    >
                      Strengthen your
                      summary
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
                      Your current
                      summary is clear,
                      but it could
                      highlight your
                      strongest
                      technical value
                      sooner.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    gap-3

                    rounded-2xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-[#faf9f6]
                    dark:bg-zinc-950

                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-lg

                      bg-emerald-100
                      dark:bg-emerald-950/40

                      text-emerald-700
                      dark:text-emerald-400
                    "
                  >
                    <CheckCircle2
                      size={14}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black

                        text-zinc-950
                        dark:text-white
                      "
                    >
                      Add measurable
                      impact
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
                      Two experience
                      bullets could be
                      stronger with real
                      outcomes or metrics.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    gap-3

                    rounded-2xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-[#faf9f6]
                    dark:bg-zinc-950

                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-lg

                      bg-amber-100
                      dark:bg-amber-950/40

                      text-amber-700
                      dark:text-amber-400
                    "
                  >
                    <FileSearch
                      size={14}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black

                        text-zinc-950
                        dark:text-white
                      "
                    >
                      Match the target
                      role
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
                      Compare your
                      resume with a job
                      description to
                      identify relevant
                      skills and missing
                      keywords.
                    </p>
                  </div>
                </div>
              </div>

              <p
                className="
                  mt-6

                  text-[11px]
                  leading-5

                  text-zinc-400
                  dark:text-zinc-500
                "
              >
                AI suggestions always
                remain under your
                control. ResumeCraft
                will never silently
                replace your content.
              </p>
            </div>
          </div>

          {/* =================================
              Right — Capabilities
          ================================= */}

          <div
            className="
              bg-violet-50/30
              dark:bg-violet-950/5

              p-6

              sm:p-8
              lg:p-10
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.14em]

                text-zinc-400
                dark:text-zinc-500
              "
            >
              Intelligence Tools
            </p>

            <div
              className="
                mt-5
                space-y-4
              "
            >
              {capabilities.map(
                ({
                  id,
                  title,
                  description,
                  icon: Icon,
                  color,
                }) => (
                  <article
                    key={id}
                    className="
                      group

                      rounded-2xl

                      border
                      border-stone-200
                      dark:border-zinc-800

                      bg-white
                      dark:bg-zinc-900

                      p-5

                      transition-all

                      hover:-translate-y-0.5
                      hover:shadow-md
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
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

                          ${getIconClass(
                            color
                          )}
                        `}
                      >
                        <Icon
                          size={17}
                          aria-hidden="true"
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <h3
                          className="
                            text-sm
                            font-black

                            text-zinc-950
                            dark:text-white
                          "
                        >
                          {title}
                        </h3>

                        <p
                          className="
                            mt-1

                            text-xs
                            leading-5

                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          {
                            description
                          }
                        </p>
                      </div>

                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="
                          mt-1
                          shrink-0

                          text-zinc-300
                          dark:text-zinc-600

                          transition-transform

                          group-hover:translate-x-1
                          group-hover:text-violet-500
                        "
                      />
                    </div>
                  </article>
                )
              )}
            </div>

            {/* Score preview */}

            <div
              className="
                mt-6

                rounded-2xl

                border
                border-emerald-200
                dark:border-emerald-900/50

                bg-emerald-50/70
                dark:bg-emerald-950/10

                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.13em]

                      text-emerald-700
                      dark:text-emerald-400
                    "
                  >
                    Resume Health
                  </p>

                  <p
                    className="
                      mt-1

                      text-xs

                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    Content quality
                    preview
                  </p>
                </div>

                <div
                  className="
                    text-right
                  "
                >
                  <span
                    className="
                      text-3xl
                      font-black

                      text-emerald-700
                      dark:text-emerald-400
                    "
                  >
                    92
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold

                      text-zinc-400
                    "
                  >
                    /100
                  </span>
                </div>
              </div>

              <div
                className="
                  mt-4

                  h-2
                  overflow-hidden

                  rounded-full

                  bg-emerald-100
                  dark:bg-emerald-950/50
                "
              >
                <div
                  className="
                    h-full
                    w-[92%]

                    rounded-full

                    bg-emerald-600
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIWorkspace;