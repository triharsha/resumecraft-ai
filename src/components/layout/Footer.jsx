import {
  FileText,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const Footer = () => {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer
      className="
        border-t
        border-stone-200
        dark:border-zinc-800

        bg-[#f2f0eb]
        dark:bg-[#0d0d0f]
      "
    >
      <div
        className="
          container-shell

          grid
          gap-10

          py-12

          md:grid-cols-[1.5fr_1fr_1.2fr]
        "
      >
        {/* =====================================
            Brand
        ===================================== */}

        <div>
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-2xl

                bg-violet-600

                text-white

                shadow-sm
                shadow-violet-500/20
              "
            >
              <FileText
                size={18}
                aria-hidden="true"
              />
            </div>

            <div>
              <p
                className="
                  text-base
                  font-black
                  tracking-[-0.03em]

                  text-zinc-950
                  dark:text-white
                "
              >
                ResumeCraft AI
              </p>

              <p
                className="
                  mt-0.5

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]

                  text-zinc-400
                  dark:text-zinc-500
                "
              >
                Resume Intelligence Workspace
              </p>
            </div>
          </Link>

          <p
            className="
              mt-5
              max-w-md

              text-sm
              leading-7

              text-zinc-600
              dark:text-zinc-400
            "
          >
            Create polished resumes,
            analyze content quality,
            tailor your experience to
            target roles, and export
            professional documents from
            one focused workspace.
          </p>
        </div>

        {/* =====================================
            Workspace Links
        ===================================== */}

        <div>
          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.14em]

              text-zinc-500
              dark:text-zinc-400
            "
          >
            Workspace
          </p>

          <div
            className="
              mt-5

              flex
              flex-col
              gap-3
            "
          >
            {[
              {
                label:
                  "My Resumes",
                to: "/resumes",
              },
              {
                label:
                  "Templates",
                to: "/templates",
              },
              {
                label:
                  "Create Resume",
                to: "/builder/new",
              },
              {
                label:
                  "Settings",
                to: "/settings",
              },
            ].map(
              ({
                label,
                to,
              }) => (
                <Link
                  key={to}
                  to={to}
                  className="
                    w-fit

                    text-sm
                    font-semibold

                    text-zinc-700
                    dark:text-zinc-300

                    transition-colors

                    hover:text-violet-700
                    dark:hover:text-violet-300
                  "
                >
                  {label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* =====================================
            AI Coach
        ===================================== */}

        <div
          className="
            rounded-2xl

            border
            border-violet-200
            dark:border-violet-900/50

            bg-white
            dark:bg-zinc-900/60

            p-5

            shadow-sm
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
              size={16}
              aria-hidden="true"
              className="
                text-violet-600
                dark:text-violet-300
              "
            />

            <p
              className="
                text-sm
                font-black

                text-zinc-950
                dark:text-white
              "
            >
              ResumeCraft AI Coach
            </p>
          </div>

          <p
            className="
              mt-3

              text-sm
              leading-6

              text-zinc-600
              dark:text-zinc-400
            "
          >
            Get intelligent guidance
            for stronger summaries,
            experience bullets,
            keywords, ATS readiness,
            and job-specific tailoring.
          </p>

          <div
            className="
              mt-4

              flex
              items-center
              gap-2

              text-xs
              font-bold

              text-emerald-700
              dark:text-emerald-400
            "
          >
            <span
              className="
                h-2
                w-2

                rounded-full

                bg-emerald-600
              "
            />

            ATS-aware guidance
          </div>
        </div>
      </div>

      {/* =====================================
          Bottom
      ===================================== */}

      <div
        className="
          border-t
          border-stone-200
          dark:border-zinc-800
        "
      >
        <div
          className="
            container-shell

            flex
            flex-col
            gap-2

            py-5

            text-xs

            text-zinc-500
            dark:text-zinc-500

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {currentYear} ResumeCraft AI
          </p>

          <p>
            Build • Analyze • Tailor • Export
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;