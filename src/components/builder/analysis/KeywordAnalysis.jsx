import {
  Check,
  CircleAlert,
  KeyRound,
  Target,
  X,
} from "lucide-react";

/* ========================================
   Importance Styles
======================================== */

const importanceStyles = {
  high: {
    label: "High",

    badge: `
      border-red-200
      bg-red-50
      text-red-700

      dark:border-red-900
      dark:bg-red-950/20
      dark:text-red-300
    `,
  },

  medium: {
    label: "Medium",

    badge: `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-900
      dark:bg-amber-950/20
      dark:text-amber-300
    `,
  },

  low: {
    label: "Low",

    badge: `
      border-stone-200
      bg-stone-50
      text-zinc-600

      dark:border-zinc-700
      dark:bg-zinc-800
      dark:text-zinc-300
    `,
  },
};

/* ========================================
   Keyword Type Labels
======================================== */

const keywordTypeLabels = {
  technical:
    "Technical",

  "soft-skill":
    "Soft Skill",

  domain:
    "Domain",
};

/* ========================================
   Keyword Analysis
======================================== */

const KeywordAnalysis = ({
  score = 0,

  matchedKeywords = [],
  missingKeywords = [],

  keywordDetails = [],

  highPriorityMissing = [],

  matchedCount = 0,
  missingCount = 0,
  totalKeywords = 0,

  hasJobDescription = false,
}) => {
  /* ======================================
     No Job Description
  ====================================== */

  if (!hasJobDescription) {
    return (
      <section
        className="
          rounded-3xl

          border
          border-dashed
          border-amber-300

          bg-amber-50/60

          p-5

          dark:border-amber-900
          dark:bg-amber-950/20

          sm:p-6
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <CircleAlert
            size={20}
            className="
              mt-0.5
              shrink-0

              text-amber-600

              dark:text-amber-400
            "
          />

          <div>
            <h3
              className="
                font-black

                text-zinc-900

                dark:text-white
              "
            >
              Add a Job Description
            </h3>

            <p
              className="
                mt-1

                text-sm
                leading-6

                text-zinc-600

                dark:text-zinc-400
              "
            >
              Add a target job description
              to unlock keyword matching,
              priority analysis and missing
              keyword intelligence.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ======================================
     Priority Keywords
  ====================================== */

  const priorityKeywords =
    [...keywordDetails]
      .sort(
        (a, b) => {
          const priorityOrder = {
            high: 3,
            medium: 2,
            low: 1,
          };

          const priorityDifference =
            priorityOrder[
              b.importance
            ] -
            priorityOrder[
              a.importance
            ];

          if (
            priorityDifference !==
            0
          ) {
            return priorityDifference;
          }

          return (
            b.frequency -
            a.frequency
          );
        }
      )
      .slice(0, 8);

  return (
    <section
      className="
        rounded-3xl

        border
        border-stone-200

        bg-white

        p-5

        dark:border-zinc-800
        dark:bg-zinc-900

        sm:p-6
      "
    >
      {/* ===================================
          Header
      =================================== */}

      <div
        className="
          flex
          flex-col
          gap-5

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            flex
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

              rounded-xl

              bg-violet-50

              text-violet-600

              dark:bg-violet-950/30
              dark:text-violet-400
            "
          >
            <KeyRound
              size={17}
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.13em]

                text-zinc-400
              "
            >
              Job Match
            </p>

            <h3
              className="
                mt-1

                text-lg
                font-black

                text-zinc-950

                dark:text-white
              "
            >
              Keyword Intelligence
            </h3>
          </div>
        </div>

        {/* Coverage */}

        <div
          className="
            shrink-0

            rounded-2xl

            border
            border-violet-100

            bg-violet-50/70

            px-4
            py-3

            dark:border-violet-900/50
            dark:bg-violet-950/20
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
                text-2xl
                font-black

                tracking-[-0.04em]

                text-violet-700

                dark:text-violet-300
              "
            >
              {score}
            </span>

            <span
              className="
                pb-1

                text-xs
                font-black

                text-violet-500
              "
            >
              %
            </span>
          </div>

          <p
            className="
              mt-1

              text-[10px]
              font-black
              uppercase
              tracking-[0.1em]

              text-violet-500
            "
          >
            Keyword Coverage
          </p>
        </div>
      </div>

      {/* ===================================
          Stats
      =================================== */}

      <div
        className="
          mt-6

          grid
          grid-cols-3
          gap-3
        "
      >
        <KeywordStat
          label="Matched"
          value={
            matchedCount
          }
          className="
            text-emerald-700

            dark:text-emerald-300
          "
        />

        <KeywordStat
          label="Missing"
          value={
            missingCount
          }
          className="
            text-amber-700

            dark:text-amber-300
          "
        />

        <KeywordStat
          label="Analyzed"
          value={
            totalKeywords
          }
          className="
            text-zinc-900

            dark:text-white
          "
        />
      </div>

      {/* ===================================
          Priority Keywords
      =================================== */}

      {priorityKeywords.length >
        0 && (
        <div className="mt-7">
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Target
              size={15}
              className="
                text-violet-600

                dark:text-violet-400
              "
            />

            <h4
              className="
                text-sm
                font-black

                text-zinc-950

                dark:text-white
              "
            >
              Priority Keywords
            </h4>
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
            Important terms detected from
            the target job description.
          </p>

          <div
            className="
              mt-4

              grid
              gap-2

              sm:grid-cols-2
            "
          >
            {priorityKeywords.map(
              (item) => (
                <PriorityKeyword
                  key={
                    item.keyword
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        </div>
      )}

      {/* ===================================
          High-Priority Missing Focus
      =================================== */}

      {highPriorityMissing.length >
        0 && (
        <div
          className="
            mt-6

            rounded-2xl

            border
            border-red-200

            bg-red-50/70

            p-4

            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <CircleAlert
              size={17}
              className="
                mt-0.5
                shrink-0

                text-red-600

                dark:text-red-400
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.1em]

                  text-red-600

                  dark:text-red-400
                "
              >
                Focus First
              </p>

              <p
                className="
                  mt-1

                  text-sm
                  font-bold
                  leading-6

                  text-red-900

                  dark:text-red-200
                "
              >
                {
                  highPriorityMissing.join(
                    ", "
                  )
                }{" "}
                {highPriorityMissing.length ===
                1
                  ? "is"
                  : "are"}{" "}
                high-priority{" "}
                {highPriorityMissing.length ===
                1
                  ? "term"
                  : "terms"}{" "}
                from this job description
                that currently{" "}
                {highPriorityMissing.length ===
                1
                  ? "does"
                  : "do"}{" "}
                not appear in your resume.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================
          Matched / Missing
      =================================== */}

      <div
        className="
          mt-7

          grid
          gap-6

          lg:grid-cols-2
        "
      >
        {/* Matched */}

        <div>
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-sm
                font-black

                text-emerald-700

                dark:text-emerald-300
              "
            >
              Matched Keywords
            </p>

            <span
              className="
                rounded-full

                bg-emerald-100

                px-2.5
                py-1

                text-xs
                font-black

                text-emerald-700

                dark:bg-emerald-950/40
                dark:text-emerald-300
              "
            >
              {
                matchedKeywords.length
              }
            </span>
          </div>

          <div
            className="
              mt-3

              flex
              flex-wrap
              gap-2
            "
          >
            {matchedKeywords.length >
            0 ? (
              matchedKeywords.map(
                (keyword) => (
                  <span
                    key={
                      keyword
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5

                      rounded-full

                      border
                      border-emerald-200

                      bg-emerald-50

                      px-3
                      py-1.5

                      text-xs
                      font-bold

                      text-emerald-700

                      dark:border-emerald-900
                      dark:bg-emerald-950/20
                      dark:text-emerald-300
                    "
                  >
                    <Check
                      size={12}
                    />

                    {keyword}
                  </span>
                )
              )
            ) : (
              <p
                className="
                  text-xs
                  leading-5

                  text-zinc-500

                  dark:text-zinc-400
                "
              >
                No target keywords are
                currently matched.
              </p>
            )}
          </div>
        </div>

        {/* Missing */}

        <div>
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-sm
                font-black

                text-amber-700

                dark:text-amber-300
              "
            >
              Missing Keywords
            </p>

            <span
              className="
                rounded-full

                bg-amber-100

                px-2.5
                py-1

                text-xs
                font-black

                text-amber-700

                dark:bg-amber-950/40
                dark:text-amber-300
              "
            >
              {
                missingKeywords.length
              }
            </span>
          </div>

          <div
            className="
              mt-3

              flex
              flex-wrap
              gap-2
            "
          >
            {missingKeywords.length >
            0 ? (
              missingKeywords.map(
                (keyword) => (
                  <span
                    key={
                      keyword
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5

                      rounded-full

                      border
                      border-amber-200

                      bg-amber-50

                      px-3
                      py-1.5

                      text-xs
                      font-bold

                      text-amber-700

                      dark:border-amber-900
                      dark:bg-amber-950/20
                      dark:text-amber-300
                    "
                  >
                    <X
                      size={11}
                    />

                    {keyword}
                  </span>
                )
              )
            ) : (
              <p
                className="
                  text-xs
                  leading-5

                  text-zinc-500

                  dark:text-zinc-400
                "
              >
                Nice — there are no
                extracted keywords
                currently missing.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===================================
          Guidance
      =================================== */}

      <div
        className="
          mt-6

          rounded-2xl

          bg-stone-50

          px-4
          py-3

          text-xs
          leading-5

          text-zinc-500

          dark:bg-zinc-800/60
          dark:text-zinc-400
        "
      >
        Only add missing keywords that
        truthfully represent your actual
        skills or experience. ResumeCraft
        does not automatically insert
        missing job-description terms.
      </div>
    </section>
  );
};

/* ========================================
   Keyword Stat
======================================== */

const KeywordStat = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div
      className="
        rounded-2xl

        border
        border-stone-200

        bg-stone-50

        px-3
        py-3

        text-center

        dark:border-zinc-800
        dark:bg-zinc-950/40
      "
    >
      <p
        className={`
          text-xl
          font-black
          tracking-[-0.03em]

          ${className}
        `}
      >
        {value}
      </p>

      <p
        className="
          mt-1

          text-[10px]
          font-black
          uppercase
          tracking-[0.08em]

          text-zinc-400
        "
      >
        {label}
      </p>
    </div>
  );
};

/* ========================================
   Priority Keyword
======================================== */

const PriorityKeyword = ({
  item,
}) => {
  const importance =
    importanceStyles[
      item.importance
    ] ||
    importanceStyles.low;

  const typeLabel =
    keywordTypeLabels[
      item.type
    ] ||
    "Domain";

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3

        rounded-2xl

        border
        border-stone-200

        bg-stone-50

        px-3
        py-3

        dark:border-zinc-800
        dark:bg-zinc-950/40
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
          className={`
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center

            rounded-lg

            ${
              item.matched
                ? `
                  bg-emerald-100
                  text-emerald-700

                  dark:bg-emerald-950/40
                  dark:text-emerald-300
                `
                : `
                  bg-amber-100
                  text-amber-700

                  dark:bg-amber-950/40
                  dark:text-amber-300
                `
            }
          `}
        >
          {item.matched ? (
            <Check
              size={12}
            />
          ) : (
            <X
              size={12}
            />
          )}
        </div>

        <div className="min-w-0">
          <p
            className="
              truncate

              text-xs
              font-black

              text-zinc-900

              dark:text-white
            "
          >
            {item.keyword}
          </p>

          <p
            className="
              mt-0.5

              text-[10px]
              font-semibold

              text-zinc-400
            "
          >
            {typeLabel}

            {item.frequency >
              1 &&
              ` • ${item.frequency}× in job description`}
          </p>
        </div>
      </div>

      <span
        className={`
          shrink-0

          rounded-full

          border

          px-2
          py-1

          text-[9px]
          font-black
          uppercase
          tracking-[0.07em]

          ${importance.badge}
        `}
      >
        {importance.label}
      </span>
    </div>
  );
};

export default KeywordAnalysis;