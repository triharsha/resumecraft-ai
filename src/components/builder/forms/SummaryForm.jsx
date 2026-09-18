import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import {
  summarySchema,
} from "../../../schemas/summarySchema";

import useResumeStore from "../../../stores/resumeStore";

import {
  rewriteSummary,
} from "../../../services/aiService";

const MAX_CHARACTERS = 700;
const RECOMMENDED_MIN = 250;
const RECOMMENDED_MAX = 500;

const SummaryForm = ({
  resume,
}) => {
  const updateSummary =
    useResumeStore(
      (state) =>
        state.updateSummary
    );

  const isResettingRef =
    useRef(false);

  const [
    isRewriting,
    setIsRewriting,
  ] = useState(false);

  const [
    aiSuggestion,
    setAiSuggestion,
  ] = useState("");

  const [
    aiError,
    setAiError,
  ] = useState("");

  const resumeId =
    resume.id;

  const storedSummary =
    resume.summary || "";

  const targetJobTitle =
    resume.jobTarget
      ?.jobTitle?.trim() || "";

  const targetJobDescription =
    resume.jobTarget
      ?.jobDescription?.trim() || "";

  const hasJobTarget =
    Boolean(
      targetJobTitle ||
        targetJobDescription
    );

  const {
    register,
    reset,
    control,
    setValue,

    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(
        summarySchema
      ),

    mode:
      "onChange",

    defaultValues: {
      summary:
        storedSummary,
    },
  });

  const watchedSummary =
    useWatch({
      control,
      name: "summary",
    });

  const summary =
    watchedSummary || "";

  /* ========================================
     Reset When Resume Changes
  ======================================== */

  useEffect(() => {
    isResettingRef.current =
      true;

    reset({
      summary:
        storedSummary,
    });

    const frameId =
      requestAnimationFrame(
        () => {
          isResettingRef.current =
            false;
        }
      );

    return () => {
      cancelAnimationFrame(
        frameId
      );

      isResettingRef.current =
        false;
    };
  }, [
    resumeId,
    storedSummary,
    reset,
  ]);

  /* ========================================
     Autosave
  ======================================== */

  useEffect(() => {
    if (
      isResettingRef.current ||
      summary === storedSummary
    ) {
      return;
    }

    updateSummary(
      resumeId,
      summary
    );
  }, [
    summary,
    storedSummary,
    resumeId,
    updateSummary,
  ]);

  /* ========================================
     AI Rewrite
  ======================================== */

  const buildExperienceContext =
    () =>
      (resume.experience || [])
        .filter(
          (item) =>
            item.jobTitle ||
            item.company ||
            item.description
        )
        .map(
          (item) =>
            [
              item.jobTitle,
              item.company,
              item.description,
            ]
              .filter(Boolean)
              .join(" — ")
        )
        .join("\n");

  const buildProjectsContext =
    () =>
      (resume.projects || [])
        .filter(
          (item) =>
            item.name ||
            item.description ||
            item.technologies
              ?.length
        )
        .map(
          (item) =>
            [
              item.name,
              item.description,
              item.technologies
                ?.length
                ? `Technologies: ${item.technologies.join(
                    ", "
                  )}`
                : "",
            ]
              .filter(Boolean)
              .join(" — ")
        )
        .join("\n");

  const handleAiRewrite =
    async () => {
      if (
        !summary.trim() ||
        errors.summary
      ) {
        return;
      }

      setIsRewriting(true);
      setAiError("");
      setAiSuggestion("");

      try {
        const suggestion =
          await rewriteSummary({
            summary:
              summary.trim(),
            jobTitle:
              resume.jobTarget
                ?.jobTitle || "",
            jobDescription:
              resume.jobTarget
                ?.jobDescription ||
              "",
            skills:
              resume.skills || [],
            experience:
              buildExperienceContext(),
            projects:
              buildProjectsContext(),
          });

        setAiSuggestion(
          suggestion
        );
      } catch (error) {
        setAiError(
          error instanceof Error
            ? error.message
            : "Unable to rewrite the summary right now."
        );
      } finally {
        setIsRewriting(false);
      }
    };

  const handleApplySuggestion =
    () => {
      if (!aiSuggestion) {
        return;
      }

      setValue(
        "summary",
        aiSuggestion,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      setAiSuggestion("");
      setAiError("");
    };

  const handleDiscardSuggestion =
    () => {
      setAiSuggestion("");
      setAiError("");
    };

  /* ========================================
     Character Guidance
  ======================================== */

  const characterCount =
    summary.length;

  const isWithinRecommendedRange =
    characterCount >=
      RECOMMENDED_MIN &&
    characterCount <=
      RECOMMENDED_MAX;

  const isTooShort =
    characterCount > 0 &&
    characterCount <
      RECOMMENDED_MIN;

  const isLong =
    characterCount >
    RECOMMENDED_MAX;

  const getGuidance = () => {
    if (
      characterCount === 0
    ) {
      return "Aim for 3–5 concise sentences highlighting your experience, strengths, and target role.";
    }

    if (isTooShort) {
      return "Good start. Add a little more detail about your experience, skills, and professional value.";
    }

    if (
      isWithinRecommendedRange
    ) {
      return "Strong length. Keep the content specific, achievement-focused, and relevant to your target role.";
    }

    if (isLong) {
      return "Consider tightening the summary so recruiters can understand your value quickly.";
    }

    return "";
  };

  const summaryErrorId =
    "professional-summary-error";

  const summaryDescriptionId =
    "professional-summary-description";

  const summaryDescribedBy =
    errors.summary
      ? `${summaryDescriptionId} ${summaryErrorId}`
      : summaryDescriptionId;

  return (
    <div>
      {/* =====================================
          Header
      ===================================== */}

      <div>
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
          Profile Introduction
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
          Professional Summary
        </h2>

        <p
          className="
            mt-3

            max-w-2xl

            text-sm
            leading-6

            text-zinc-500
            dark:text-zinc-400
          "
        >
          Write a concise overview
          of your experience,
          strongest skills, and the
          value you bring to a
          role.
        </p>
      </div>

      {/* =====================================
          Editor
      ===================================== */}

      <div
        className="
          mt-8
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
          <label
            htmlFor="professional-summary"
            className="
              text-xs
              font-black

              text-zinc-700
              dark:text-zinc-300
            "
          >
            Professional Summary
          </label>

          <span
            aria-hidden="true"
            className={`
              text-xs
              font-bold

              ${
                characterCount >
                MAX_CHARACTERS
                  ? `
                      text-rose-600
                      dark:text-rose-400
                    `
                  : `
                      text-zinc-400
                      dark:text-zinc-500
                    `
              }
            `}
          >
            {characterCount}
            /{MAX_CHARACTERS}
          </span>
        </div>

        <p
          id={
            summaryDescriptionId
          }
          className="sr-only"
        >
          Maximum 700 characters.
          A strong professional
          summary is typically
          between 250 and 500
          characters.
        </p>

        <textarea
          id="professional-summary"
          rows={9}
          maxLength={
            MAX_CHARACTERS
          }
          placeholder="Frontend developer with experience building responsive, user-focused web applications using React, JavaScript, and modern frontend tooling..."
          aria-invalid={
            Boolean(
              errors.summary
            )
          }
          aria-describedby={
            summaryDescribedBy
          }
          {...register(
            "summary"
          )}
          className={`
            mt-2

            min-h-[220px]
            w-full
            resize-y

            rounded-2xl

            border

            bg-white
            dark:bg-zinc-950

            px-4
            py-3.5

            text-sm
            leading-7

            text-zinc-950
            dark:text-white

            outline-none

            transition-all

            placeholder:text-zinc-400
            dark:placeholder:text-zinc-600

            ${
              errors.summary
                ? `
                    border-rose-400

                    focus:border-rose-500
                    focus:ring-4
                    focus:ring-rose-500/10

                    dark:border-rose-700
                  `
                : `
                    border-stone-200
                    dark:border-zinc-800

                    hover:border-stone-300
                    dark:hover:border-zinc-700

                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-500/10
                  `
            }
          `}
        />

        {errors.summary && (
          <p
            id={
              summaryErrorId
            }
            role="alert"
            className="
              mt-2

              text-xs
              font-semibold

              text-rose-600
              dark:text-rose-400
            "
          >
            {
              errors.summary
                .message
            }
          </p>
        )}
      </div>

      {/* =====================================
          Guidance
      ===================================== */}

      <div
        className="
          mt-4

          rounded-2xl

          border
          border-stone-200
          dark:border-zinc-800

          bg-[#faf9f6]
          dark:bg-zinc-950

          px-4
          py-3
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            aria-hidden="true"
            className={`
              mt-0.5

              h-2
              w-2
              shrink-0

              rounded-full

              ${
                isWithinRecommendedRange
                  ? `
                      bg-emerald-500
                    `
                  : isLong
                  ? `
                      bg-amber-500
                    `
                  : `
                      bg-violet-500
                    `
              }
            `}
          />

          <div>
            <p
              className="
                text-xs
                font-black

                text-zinc-700
                dark:text-zinc-300
              "
            >
              Writing guidance
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
              {getGuidance()}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          AI Rewrite
      ===================================== */}

      <div
        className="
          mt-6

          rounded-2xl

          border
          border-violet-200
          dark:border-violet-900/40

          bg-violet-50/60
          dark:bg-violet-950/10

          p-4
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-xl

                bg-violet-600

                text-white
              "
            >
              <Sparkles
                size={15}
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
                Improve with AI
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
                {hasJobTarget
                  ? `AI Rewrite will use your resume and current Job Target${
                      targetJobTitle
                        ? ` (${targetJobTitle})`
                        : ""
                    } to make the summary more relevant while preserving your real experience.`
                  : "AI Rewrite will use your current resume. You can also set a Job Target later for a more role-specific rewrite."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleAiRewrite
            }
            disabled={
              isRewriting ||
              !summary.trim() ||
              Boolean(
                errors.summary
              )
            }
            aria-busy={
              isRewriting
            }
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-violet-200
              dark:border-violet-900

              bg-white
              dark:bg-zinc-900

              px-4
              py-2.5

              text-xs
              font-black

              text-violet-600
              dark:text-violet-400

              transition-all

              hover:border-violet-300
              hover:bg-violet-50
              dark:hover:border-violet-800
              dark:hover:bg-violet-950/30

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-violet-500/20

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Sparkles
              size={13}
              aria-hidden="true"
            />

            {isRewriting
              ? "Rewriting..."
              : "AI Rewrite"}
          </button>
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {isRewriting
            ? "AI is rewriting your professional summary."
            : aiSuggestion
              ? "AI rewrite is ready for review."
              : ""}
        </div>

        {aiError && (
          <p
            role="alert"
            className="
              mt-4

              rounded-xl

              border
              border-rose-200
              dark:border-rose-900/50

              bg-rose-50
              dark:bg-rose-950/20

              px-3
              py-2.5

              text-xs
              font-semibold
              leading-5

              text-rose-700
              dark:text-rose-400
            "
          >
            {aiError}
          </p>
        )}

        {aiSuggestion && (
          <div
            className="
              mt-4

              rounded-2xl

              border
              border-violet-200
              dark:border-violet-900/50

              bg-white
              dark:bg-zinc-950

              p-4
            "
          >
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.12em]

                text-violet-600
                dark:text-violet-400
              "
            >
              AI Suggested
            </p>

            <p
              className="
                mt-2

                text-sm
                leading-6

                text-zinc-800
                dark:text-zinc-200
              "
            >
              {aiSuggestion}
            </p>

            <div
              className="
                mt-4

                flex
                flex-col
                gap-2

                border-t
                border-stone-200
                pt-4

                dark:border-zinc-800

                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={
                  handleDiscardSuggestion
                }
                className="
                  inline-flex
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-stone-200
                  dark:border-zinc-800

                  bg-white
                  dark:bg-zinc-900

                  px-4
                  py-2.5

                  text-xs
                  font-black

                  text-zinc-600
                  dark:text-zinc-300

                  transition-all

                  hover:bg-stone-50
                  dark:hover:bg-zinc-800

                  focus-visible:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-zinc-500/10
                "
              >
                Discard
              </button>

              <button
                type="button"
                onClick={
                  handleApplySuggestion
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-violet-600

                  px-4
                  py-2.5

                  text-xs
                  font-black

                  text-white

                  transition-all

                  hover:bg-violet-700

                  focus-visible:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-violet-500/25
                "
              >
                <Sparkles
                  size={13}
                  aria-hidden="true"
                />

                Apply Suggestion
              </button>
            </div>

            <p
              className="
                mt-3

                text-[10px]
                font-semibold
                leading-4

                text-zinc-400
                dark:text-zinc-500
              "
            >
              Your original summary stays
              unchanged until you apply
              this suggestion.
            </p>
          </div>
        )}
      </div>

      {/* =====================================
          Autosave
      ===================================== */}

      <div
        className="
          mt-6

          rounded-2xl

          border
          border-emerald-200
          dark:border-emerald-900/40

          bg-emerald-50/60
          dark:bg-emerald-950/10

          px-4
          py-3
        "
      >
        <p
          className="
            text-xs
            font-semibold
            leading-5

            text-emerald-700
            dark:text-emerald-400
          "
        >
          Summary changes are
          saved automatically and
          reflected in the live
          preview.
        </p>
      </div>
    </div>
  );
};

export default SummaryForm;