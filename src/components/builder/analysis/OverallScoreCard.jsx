import {
  CheckCircle2,
  CircleAlert,
  Sparkles,
} from "lucide-react";

/* ========================================
   Score Metadata
======================================== */

const getScoreMeta = (
  score,
  hasJobDescription
) => {
  /*
   * Without a job description, the score
   * represents general resume quality.
   */

  if (!hasJobDescription) {
    if (score >= 80) {
      return {
        label: "Strong Resume",
        message:
          "Your resume is structurally strong with solid content and measurable impact.",
        Icon: CheckCircle2,
        badgeClass:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      };
    }

    if (score >= 60) {
      return {
        label: "Good Progress",
        message:
          "Your resume has a solid foundation, with a few areas that could be strengthened.",
        Icon: Sparkles,
        badgeClass:
          "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
      };
    }

    return {
      label: "Needs Improvement",
      message:
        "Strengthening your resume structure, content quality and measurable impact can improve this score.",
      Icon: CircleAlert,
      badgeClass:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    };
  }

  /*
   * With a job description, job alignment
   * contributes to the analysis.
   */

  if (score >= 80) {
    return {
      label: "Strong Match",
      message:
        "Your resume is structurally strong and shows strong alignment with the target role.",
      Icon: CheckCircle2,
      badgeClass:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    };
  }

  if (score >= 60) {
    return {
      label: "Good Match",
      message:
        "Your resume shows solid alignment with the target role, with some opportunities to improve relevance and impact.",
      Icon: Sparkles,
      badgeClass:
        "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    };
  }

  return {
    label: "Needs Tailoring",
    message:
      "Improve relevant content, measurable impact and truthful alignment with the target role to strengthen this score.",
    Icon: CircleAlert,
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  };
};

/* ========================================
   Overall Score Card
======================================== */

const OverallScoreCard = ({
  score = 0,
  hasJobDescription = false,
}) => {
  const meta =
    getScoreMeta(
      score,
      hasJobDescription
    );

  const Icon =
    meta.Icon;

  return (
    <section
      className="
        rounded-3xl

        border
        border-stone-200

        bg-white

        p-5

        shadow-sm

        dark:border-zinc-800
        dark:bg-zinc-900

        sm:p-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* =====================================
            Score Information
        ===================================== */}

        <div className="min-w-0">
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.15em]

              text-violet-600

              dark:text-violet-400
            "
          >
            {hasJobDescription
              ? "Resume + Job Analysis"
              : "Resume Analysis"}
          </p>

          <div
            className="
              mt-3

              flex
              items-end
              gap-3
            "
          >
            <span
              className="
                text-5xl
                font-black
                tracking-[-0.06em]

                text-zinc-950

                dark:text-white

                sm:text-6xl
              "
            >
              {score}
            </span>

            <span
              className="
                pb-1

                text-sm
                font-bold

                text-zinc-400
              "
            >
              / 100
            </span>
          </div>

          {/* =====================================
              Status
          ===================================== */}

          <div
            className="
              mt-4

              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <span
              className={`
                inline-flex
                items-center
                gap-2

                rounded-full

                px-3
                py-1.5

                text-xs
                font-black

                ${meta.badgeClass}
              `}
            >
              <Icon
                size={14}
                aria-hidden="true"
              />

              {meta.label}
            </span>

            {!hasJobDescription && (
              <span
                className="
                  text-xs
                  font-bold

                  text-amber-600

                  dark:text-amber-400
                "
              >
                Job alignment not included
              </span>
            )}
          </div>

          {/* =====================================
              Description
          ===================================== */}

          <p
            className="
              mt-4
              max-w-xl

              text-sm
              leading-6

              text-zinc-500

              dark:text-zinc-400
            "
          >
            {meta.message}
          </p>

          {/* =====================================
              Analysis Context
          ===================================== */}

          {!hasJobDescription && (
            <p
              className="
                mt-3
                max-w-xl

                text-xs
                leading-5

                text-zinc-400

                dark:text-zinc-500
              "
            >
              Add a job description in
              Job Target to include
              keyword relevance and
              target-role alignment in
              your analysis.
            </p>
          )}
        </div>

        {/* =====================================
            Score Circle
        ===================================== */}

        <div
          className="
            flex
            h-32
            w-32
            shrink-0
            items-center
            justify-center

            rounded-full

            border-[10px]
            border-violet-100

            bg-violet-50

            dark:border-violet-950/60
            dark:bg-violet-950/20
          "
        >
          <div className="text-center">
            <p
              className="
                text-3xl
                font-black

                text-violet-700

                dark:text-violet-300
              "
            >
              {score}
            </p>

            <p
              className="
                mt-1

                text-[10px]
                font-black
                uppercase
                tracking-[0.14em]

                text-violet-500
              "
            >
              Overall
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverallScoreCard;