import {
  ArrowRight,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import ResumeImportAction from "../ui/ResumeImportAction";

const HeroSection = () => {
  return (
    <>
      {/* ========================================
          Hero
      ======================================== */}

      <section
        className="
          container-shell

          grid
          gap-12

          py-12

          lg:grid-cols-[1.05fr_0.95fr]
          lg:items-center
          lg:py-20
        "
      >
        {/* =====================================
            Hero Content
        ===================================== */}

        <div
          className="
            min-w-0
            max-w-2xl
          "
        >
          <div
            className="
              inline-flex
              max-w-full
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

              text-[10px]
              font-black
              uppercase
              tracking-[0.12em]

              text-violet-700
              dark:text-violet-300

              sm:text-xs
              sm:tracking-[0.14em]
            "
          >
            <Sparkles
              size={13}
              aria-hidden="true"
              className="
                shrink-0
              "
            />

            <span
              className="
                truncate
              "
            >
              AI Resume Intelligence
            </span>
          </div>

          <h1
            className="
              mt-6

              max-w-3xl

              text-4xl
              font-black
              leading-[1]
              tracking-[-0.05em]

              text-zinc-950
              dark:text-white

              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            Build a resume
            that gets you
            noticed.
          </h1>

          <p
            className="
              mt-6

              max-w-xl

              text-sm
              leading-7

              text-zinc-600
              dark:text-zinc-400

              sm:text-base
              lg:text-lg
            "
          >
            Create polished
            resumes, improve
            your writing with AI,
            analyze ATS readiness,
            and tailor your
            experience for the
            roles you actually
            want.
          </p>

          {/* =====================================
              Hero Actions
          ===================================== */}

          <div
            className="
              mt-8

              flex
              flex-col
              gap-3

              sm:flex-row
            "
          >
            <Link
              to="/builder/new"
              className="
                inline-flex
                min-w-0
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-zinc-950
                dark:bg-white

                px-5
                py-3

                text-sm
                font-bold

                text-white
                dark:text-zinc-950

                shadow-sm

                transition-all

                hover:-translate-y-0.5
                hover:bg-zinc-800
                hover:shadow-md

                dark:hover:bg-zinc-100
              "
            >
              <Sparkles
                size={16}
                aria-hidden="true"
                className="
                  shrink-0

                  text-violet-300
                  dark:text-violet-600
                "
              />

              <span
                className="
                  truncate

                  text-white
                  dark:text-zinc-950
                "
              >
                Create New Resume
              </span>

              <ArrowRight
                size={16}
                aria-hidden="true"
                className="
                  shrink-0
                "
              />
            </Link>

            <ResumeImportAction>
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
                    inline-flex
                    min-w-0
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-white
                    dark:bg-zinc-900

                    px-5
                    py-3

                    text-sm
                    font-bold

                    text-zinc-800
                    dark:text-zinc-200

                    transition-colors

                    hover:border-violet-300
                    hover:text-violet-700

                    dark:hover:border-violet-800
                    dark:hover:text-violet-300

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <Upload
                    size={16}
                    aria-hidden="true"
                    className="
                      shrink-0
                    "
                  />

                  <span
                    className="
                      truncate
                    "
                  >
                    {isProcessing
                      ? "Reading PDF..."
                      : "Import Resume"}
                  </span>
                </button>
              )}
            </ResumeImportAction>
          </div>

          {/* =====================================
              Hero Highlights
          ===================================== */}

          <div
            className="
              mt-8

              flex
              flex-col
              gap-2

              text-xs
              font-semibold

              text-zinc-500
              dark:text-zinc-400

              sm:flex-row
              sm:flex-wrap
              sm:gap-x-6
              sm:gap-y-3
              sm:text-sm
            "
          >
            <span>
              ✓ ATS-aware analysis
            </span>

            <span>
              ✓ AI writing assistance
            </span>

            <span>
              ✓ Professional PDF export
            </span>
          </div>
        </div>

        {/* =====================================
            Resume Preview
        ===================================== */}

        <div
          className="
            relative

            mx-auto

            w-full
            max-w-xl

            px-2

            sm:px-4
            lg:px-0
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              -z-10

              rounded-[2rem]

              bg-gradient-to-br
              from-violet-100
              via-transparent
              to-emerald-50

              blur-2xl

              dark:from-violet-950/30
              dark:to-emerald-950/20
            "
          />

          {/* =====================================
              Resume Paper
          ===================================== */}

          <div
            className="
              resume-paper

              relative

              mx-auto

              aspect-[1/1.414]
              w-full
              max-w-[430px]

              overflow-hidden

              rounded-xl

              p-5

              sm:p-8
            "
          >
            <div
              className="
                border-b
                border-zinc-200

                pb-4

                sm:pb-5
              "
            >
              <h2
                className="
                  text-xl
                  font-black
                  tracking-[-0.04em]

                  text-zinc-950

                  sm:text-2xl
                "
              >
                Alex Morgan
              </h2>

              <p
                className="
                  mt-1

                  text-xs
                  font-bold

                  text-violet-700

                  sm:text-sm
                "
              >
                Frontend Developer
              </p>

              <p
                className="
                  mt-2

                  text-[8px]
                  leading-4

                  text-zinc-500

                  sm:text-[10px]
                  sm:leading-5
                "
              >
                alex@example.com
                {" • "}
                Hyderabad
                {" • "}
                github.com/alex
              </p>
            </div>

            {/* Summary */}

            <div
              className="
                mt-4

                sm:mt-5
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]

                  text-zinc-950

                  sm:text-[10px]
                  sm:tracking-[0.14em]
                "
              >
                Professional Summary
              </p>

              <div
                className="
                  mt-3
                  space-y-2
                "
              >
                <div
                  className="
                    h-1.5
                    w-full

                    rounded-full

                    bg-zinc-200

                    sm:h-2
                  "
                />

                <div
                  className="
                    h-1.5
                    w-[92%]

                    rounded-full

                    bg-zinc-200

                    sm:h-2
                  "
                />

                <div
                  className="
                    h-1.5
                    w-[75%]

                    rounded-full

                    bg-zinc-200

                    sm:h-2
                  "
                />
              </div>
            </div>

            {/* Experience */}

            <div
              className="
                mt-5

                sm:mt-6
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]

                  text-zinc-950

                  sm:text-[10px]
                  sm:tracking-[0.14em]
                "
              >
                Experience
              </p>

              <div
                className="
                  mt-3
                  space-y-4

                  sm:mt-4
                "
              >
                {[1, 2].map(
                  (item) => (
                    <div
                      key={item}
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
                            h-2
                            w-24

                            rounded-full

                            bg-zinc-800

                            sm:h-2.5
                            sm:w-28
                          "
                        />

                        <div
                          className="
                            h-1.5
                            w-12

                            rounded-full

                            bg-zinc-200

                            sm:h-2
                            sm:w-16
                          "
                        />
                      </div>

                      <div
                        className="
                          mt-2
                          space-y-1.5

                          sm:mt-3
                          sm:space-y-2
                        "
                      >
                        <div
                          className="
                            h-1.5
                            w-full

                            rounded-full

                            bg-zinc-200

                            sm:h-2
                          "
                        />

                        <div
                          className="
                            h-1.5
                            w-[88%]

                            rounded-full

                            bg-zinc-200

                            sm:h-2
                          "
                        />

                        <div
                          className="
                            h-1.5
                            w-[68%]

                            rounded-full

                            bg-zinc-200

                            sm:h-2
                          "
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Skills */}

            <div
              className="
                mt-5

                sm:mt-6
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]

                  text-zinc-950

                  sm:text-[10px]
                  sm:tracking-[0.14em]
                "
              >
                Skills
              </p>

              <div
                className="
                  mt-3

                  flex
                  flex-wrap
                  gap-1.5

                  sm:gap-2
                "
              >
                {[
                  "React",
                  "JavaScript",
                  "REST APIs",
                  "Git",
                  "CSS",
                ].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="
                        rounded-md

                        bg-zinc-100

                        px-1.5
                        py-1

                        text-[7px]
                        font-bold

                        text-zinc-700

                        sm:px-2
                        sm:text-[9px]
                      "
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* =====================================
              Resume Health
          ===================================== */}

          <div
            className="
              absolute
              left-3
              top-4
              z-10

              rounded-xl

              border
              border-emerald-200
              dark:border-emerald-900

              bg-white
              dark:bg-zinc-900

              px-3
              py-2.5

              shadow-lg

              sm:left-6
              sm:top-8
              sm:rounded-2xl
              sm:px-4
              sm:py-3

              lg:-left-8
            "
          >
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.10em]

                text-zinc-400

                sm:text-[10px]
                sm:tracking-[0.12em]
              "
            >
              Resume Health
            </p>

            <div
              className="
                mt-1

                flex
                items-end
                gap-1
              "
            >
              <span
                className="
                  text-xl
                  font-black

                  text-emerald-600
                  dark:text-emerald-400

                  sm:text-2xl
                "
              >
                92
              </span>

              <span
                className="
                  mb-1

                  text-[10px]
                  font-bold

                  text-zinc-400

                  sm:text-xs
                "
              >
                /100
              </span>
            </div>
          </div>

          {/* =====================================
              AI Suggestion
          ===================================== */}

          <div
            className="
              absolute
              bottom-12
              right-3
              z-10

              max-w-[145px]

              rounded-xl

              border
              border-violet-200
              dark:border-violet-900

              bg-white
              dark:bg-zinc-900

              p-3

              shadow-lg

              sm:bottom-16
              sm:right-6
              sm:max-w-[190px]
              sm:rounded-2xl
              sm:p-4

              lg:-right-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Sparkles
                size={12}
                aria-hidden="true"
                className="
                  shrink-0

                  text-violet-600
                  dark:text-violet-400

                  sm:size-[14px]
                "
              />

              <p
                className="
                  text-[10px]
                  font-black

                  text-zinc-950
                  dark:text-white

                  sm:text-xs
                "
              >
                AI Suggestion
              </p>
            </div>

            <p
              className="
                mt-2

                text-[9px]
                leading-4

                text-zinc-500
                dark:text-zinc-400

                sm:text-[11px]
                sm:leading-5
              "
            >
              Add measurable
              impact to strengthen
              this experience
              bullet.
            </p>
          </div>

          {/* =====================================
              ATS Ready
          ===================================== */}

          <div
            className="
              absolute
              bottom-3
              left-1/2
              z-10

              -translate-x-1/2

              inline-flex
              items-center
              gap-2

              whitespace-nowrap

              rounded-full

              border
              border-emerald-200
              dark:border-emerald-900

              bg-white
              dark:bg-zinc-900

              px-3
              py-1.5

              text-[9px]
              font-black

              text-emerald-700
              dark:text-emerald-400

              shadow-md

              sm:bottom-4
              sm:px-4
              sm:py-2
              sm:text-xs
            "
          >
            <span
              className="
                h-1.5
                w-1.5

                rounded-full

                bg-emerald-500

                sm:h-2
                sm:w-2
              "
            />

            ATS Ready
          </div>
        </div>
      </section>

      {/* ========================================
          Build / Analyze / Tailor
      ======================================== */}

      <section
        className="
          border-y
          border-stone-200
          dark:border-zinc-800

          bg-white/50
          dark:bg-zinc-900/30
        "
      >
        <div
          className="
            container-shell

            grid

            sm:grid-cols-3
          "
        >
          <div
            className="
              border-b
              border-stone-200
              dark:border-zinc-800

              py-5

              sm:border-b-0
              sm:border-r
              sm:px-5
              sm:py-8

              sm:first:pl-0
            "
          >
            <p
              className="
                text-xl
                font-black

                text-zinc-950
                dark:text-white

                sm:text-2xl
              "
            >
              Build
            </p>

            <p
              className="
                mt-1

                text-sm

                text-zinc-500
                dark:text-zinc-400
              "
            >
              Create structured,
              professional resumes.
            </p>
          </div>

          <div
            className="
              border-b
              border-stone-200
              dark:border-zinc-800

              py-5

              sm:border-b-0
              sm:border-r
              sm:px-5
              sm:py-8
            "
          >
            <p
              className="
                text-xl
                font-black

                text-violet-700
                dark:text-violet-300

                sm:text-2xl
              "
            >
              Analyze
            </p>

            <p
              className="
                mt-1

                text-sm

                text-zinc-500
                dark:text-zinc-400
              "
            >
              Understand resume
              health and ATS
              readiness.
            </p>
          </div>

          <div
            className="
              py-5

              sm:px-5
              sm:py-8

              sm:last:pr-0
            "
          >
            <p
              className="
                text-xl
                font-black

                text-emerald-700
                dark:text-emerald-400

                sm:text-2xl
              "
            >
              Tailor
            </p>

            <p
              className="
                mt-1

                text-sm

                text-zinc-500
                dark:text-zinc-400
              "
            >
              Adapt your resume
              intelligently for
              target roles.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;