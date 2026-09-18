import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
} from "lucide-react";

const priorityStyles = {
  high: {
    label: "High Priority",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900",
  },

  medium: {
    label: "Medium Priority",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",
  },

  low: {
    label: "Low Priority",
    className:
      "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
};

const SuggestionsPanel = ({
  suggestions = [],
  onSectionChange,
}) => {
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
      {/* Header */}

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
            shrink-0
            items-center
            justify-center

            rounded-xl

            bg-amber-50

            text-amber-600

            dark:bg-amber-950/30
            dark:text-amber-400
          "
        >
          <Lightbulb
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
            Recommendations
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
            Suggested Improvements
          </h3>
        </div>
      </div>

      {/* Suggestions */}

      {suggestions.length > 0 ? (
        <div
          className="
            mt-5
            space-y-3
          "
        >
          {suggestions.map(
            (
              suggestion,
              index
            ) => {
              const priority =
                priorityStyles[
                  suggestion.priority
                ] ||
                priorityStyles.medium;

              return (
                <article
                  key={
                    suggestion.id ||
                    `${suggestion.message}-${index}`
                  }
                  className="
                    rounded-2xl

                    border
                    border-stone-200

                    bg-stone-50

                    p-4

                    dark:border-zinc-800
                    dark:bg-zinc-800/50
                  "
                >
                  <div
                    className="
                      flex
                      gap-3
                    "
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center

                        rounded-full

                        bg-white

                        text-xs
                        font-black

                        text-zinc-700

                        shadow-sm

                        dark:bg-zinc-900
                        dark:text-zinc-300
                      "
                    >
                      {index + 1}
                    </span>

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className="
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.08em]

                            text-zinc-500

                            dark:text-zinc-400
                          "
                        >
                          {
                            suggestion.category
                          }
                        </span>

                        <span
                          className={`
                            rounded-full

                            border

                            px-2.5
                            py-1

                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.07em]

                            ${priority.className}
                          `}
                        >
                          {
                            priority.label
                          }
                        </span>
                      </div>

                      <p
                        className="
                          mt-2

                          text-sm
                          leading-6

                          text-zinc-600

                          dark:text-zinc-300
                        "
                      >
                        {
                          suggestion.message
                        }
                      </p>

                      {suggestion.targetSection &&
                        suggestion.actionLabel && (
                          <button
                            type="button"
                            onClick={() =>
                              onSectionChange?.(
                                suggestion.targetSection,
                                {
                                  fromAnalysis:
                                    true,
                                }
                              )
                            }
                            className="
                              mt-3

                              inline-flex
                              items-center
                              gap-1.5

                              text-sm
                              font-black

                              text-violet-600

                              transition-colors

                              hover:text-violet-700

                              dark:text-violet-400
                              dark:hover:text-violet-300
                            "
                          >
                            {
                              suggestion.actionLabel
                            }

                            <ArrowRight
                              size={15}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      ) : (
        <div
          className="
            mt-5

            flex
            items-start
            gap-3

            rounded-2xl

            bg-emerald-50

            p-4

            dark:bg-emerald-950/20
          "
        >
          <CheckCircle2
            size={18}
            className="
              mt-0.5
              shrink-0

              text-emerald-600

              dark:text-emerald-400
            "
            aria-hidden="true"
          />

          <div>
            <p
              className="
                text-sm
                font-black

                text-emerald-700

                dark:text-emerald-300
              "
            >
              Looking strong
            </p>

            <p
              className="
                mt-1

                text-xs
                leading-5

                text-emerald-700/80

                dark:text-emerald-300/80
              "
            >
              No major improvements are
              currently detected.
            </p>
          </div>
        </div>
      )}

      {suggestions.some(
        (suggestion) =>
          suggestion.priority ===
          "high"
      ) && (
        <div
          className="
            mt-5

            flex
            items-start
            gap-2

            rounded-2xl

            border
            border-violet-100

            bg-violet-50/60

            px-4
            py-3

            dark:border-violet-950
            dark:bg-violet-950/20
          "
        >
          <CircleAlert
            size={15}
            className="
              mt-0.5
              shrink-0

              text-violet-600

              dark:text-violet-400
            "
            aria-hidden="true"
          />

          <p
            className="
              text-xs
              leading-5

              text-zinc-600

              dark:text-zinc-400
            "
          >
            Start with high-priority
            recommendations. Changes to
            your resume are automatically
            reflected in the analysis.
          </p>
        </div>
      )}
    </section>
  );
};

export default SuggestionsPanel;