import {
  Activity,
  FileCheck2,
  Target,
  TrendingUp,
} from "lucide-react";

/* ========================================
   Score Card
======================================== */

const ScoreCard = ({
  label,
  description,
  score,
  Icon,
  unavailable = false,
  unavailableLabel = "N/A",
}) => {
  const safeScore =
    typeof score === "number"
      ? Math.max(
          0,
          Math.min(
            100,
            score
          )
        )
      : 0;

  return (
    <div
      className={`
        rounded-2xl

        border

        p-4

        ${
          unavailable
            ? `
              border-stone-200
              bg-stone-50/70

              dark:border-zinc-800
              dark:bg-zinc-900/60
            `
            : `
              border-stone-200
              bg-white

              dark:border-zinc-800
              dark:bg-zinc-900
            `
        }
      `}
    >
      {/* =====================================
          Icon + Score
      ===================================== */}

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

            ${
              unavailable
                ? `
                  bg-stone-100
                  text-zinc-400

                  dark:bg-zinc-800
                  dark:text-zinc-500
                `
                : `
                  bg-violet-50
                  text-violet-600

                  dark:bg-violet-950/30
                  dark:text-violet-400
                `
            }
          `}
        >
          <Icon
            size={17}
            aria-hidden="true"
          />
        </div>

        <span
          className={`
            text-2xl
            font-black

            ${
              unavailable
                ? `
                  text-zinc-400

                  dark:text-zinc-500
                `
                : `
                  text-zinc-950

                  dark:text-white
                `
            }
          `}
        >
          {unavailable
            ? unavailableLabel
            : safeScore}
        </span>
      </div>

      {/* =====================================
          Description
      ===================================== */}

      <div className="mt-4">
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <p
            className="
              text-sm
              font-black

              text-zinc-900

              dark:text-white
            "
          >
            {label}
          </p>

          {unavailable && (
            <span
              className="
                rounded-full

                bg-amber-100

                px-2
                py-1

                text-[9px]
                font-black
                uppercase
                tracking-wide

                text-amber-700

                dark:bg-amber-950/40
                dark:text-amber-300
              "
            >
              Job target required
            </span>
          )}
        </div>

        <p
          className="
            mt-1

            text-xs
            leading-5

            text-zinc-500

            dark:text-zinc-400
          "
        >
          {description}
        </p>
      </div>

      {/* =====================================
          Progress
      ===================================== */}

      <div
        className="
          mt-4
          h-2
          overflow-hidden
          rounded-full

          bg-stone-100

          dark:bg-zinc-800
        "
      >
        {!unavailable && (
          <div
            className="
              h-full
              rounded-full

              bg-violet-600

              transition-all
              duration-500
            "
            style={{
              width: `${safeScore}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ========================================
   Score Breakdown
======================================== */

const ScoreBreakdown = ({
  analysis,
  hasJobDescription = false,
}) => {
  const scores = [
    {
      label:
        "ATS Readiness",

      description:
        "Core structure, contact details, sections and resume completeness.",

      score:
        analysis.atsScore,

      Icon:
        FileCheck2,

      unavailable:
        false,
    },

    {
      label:
        "Content Quality",

      description:
        "Strength and completeness of summaries, experience, projects and skills.",

      score:
        analysis.contentScore,

      Icon:
        Activity,

      unavailable:
        false,
    },

    {
      label:
        "Impact",

      description:
        "Action verbs, measurable outcomes and accomplishment-focused writing.",

      score:
        analysis.impactScore,

      Icon:
        TrendingUp,

      unavailable:
        false,
    },

    {
      label:
        "Keyword Match",

      description:
        hasJobDescription
          ? "How closely your resume reflects relevant terms from the target job description."
          : "Add a job description in Job Target to measure keyword relevance and role alignment.",

      score:
        analysis.keywordScore,

      Icon:
        Target,

      unavailable:
        !hasJobDescription,
    },
  ];

  return (
    <section>
      {/* =====================================
          Header
      ===================================== */}

      <div>
        <p
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.14em]

            text-zinc-400
          "
        >
          Score Breakdown
        </p>

        <h3
          className="
            mt-2

            text-xl
            font-black
            tracking-[-0.03em]

            text-zinc-950

            dark:text-white
          "
        >
          Where your score comes from
        </h3>

        <p
          className="
            mt-2
            max-w-2xl

            text-xs
            leading-5

            text-zinc-500

            dark:text-zinc-400
          "
        >
          Resume quality scores are
          available immediately. Keyword
          matching is evaluated only when
          a target job description is
          provided.
        </p>
      </div>

      {/* =====================================
          Score Cards
      ===================================== */}

      <div
        className="
          mt-5

          grid
          gap-4

          sm:grid-cols-2
        "
      >
        {scores.map(
          ({
            label,
            description,
            score,
            Icon,
            unavailable,
          }) => (
            <ScoreCard
              key={label}
              label={label}
              description={
                description
              }
              score={score}
              Icon={Icon}
              unavailable={
                unavailable
              }
            />
          )
        )}
      </div>
    </section>
  );
};

export default ScoreBreakdown;