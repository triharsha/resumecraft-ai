import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleAlert,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import {
  z,
} from "zod";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Validation
======================================== */

const jobTargetSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .max(
      100,
      "Job title must be 100 characters or less."
    ),

  company: z
    .string()
    .trim()
    .max(
      100,
      "Company must be 100 characters or less."
    ),

  jobDescription: z
    .string()
    .trim()
    .max(
      10000,
      "Job description must be 10,000 characters or less."
    ),
});

/* ========================================
   Defaults
======================================== */

const defaultJobTarget = {
  jobTitle: "",
  company: "",
  jobDescription: "",
};

/* ========================================
   Job Target Form
======================================== */

const JobTargetForm = ({
  resume,
  onSectionChange,
}) => {
  const updateResume =
    useResumeStore(
      (state) =>
        state.updateResume
    );

  const isResettingRef =
    useRef(false);

  const resumeId =
    resume.id;

  const storedJobTitle =
    resume.jobTarget?.jobTitle ||
    "";

  const storedCompany =
    resume.jobTarget?.company ||
    "";

  const storedJobDescription =
    resume.jobTarget
      ?.jobDescription || "";

  const jobTarget =
    useMemo(
      () => ({
        jobTitle:
          storedJobTitle,

        company:
          storedCompany,

        jobDescription:
          storedJobDescription,
      }),
      [
        storedJobTitle,
        storedCompany,
        storedJobDescription,
      ]
    );

  const {
    register,
    reset,
    control,
    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(
        jobTargetSchema
      ),

    defaultValues:
      jobTarget,

    mode: "onChange",
  });

  const watchedValues =
    useWatch({
      control,
    });

  const watchedJobTitle =
    watchedValues.jobTitle ||
    "";

  const watchedCompany =
    watchedValues.company ||
    "";

  const watchedJobDescription =
    watchedValues
      .jobDescription || "";

  /* ========================================
     Sync when resume changes
  ======================================== */

  useEffect(() => {
    isResettingRef.current =
      true;

    reset(jobTarget);

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
    jobTarget,
    reset,
  ]);

  /* ========================================
     Autosave
  ======================================== */

  useEffect(() => {
    if (
      isResettingRef.current
    ) {
      return;
    }

    const parsed =
      jobTargetSchema.safeParse({
        jobTitle:
          watchedJobTitle,
        company:
          watchedCompany,
        jobDescription:
          watchedJobDescription,
      });

    if (!parsed.success) {
      return;
    }

    const next =
      parsed.data;

    const unchanged =
      storedJobTitle ===
        next.jobTitle &&
      storedCompany ===
        next.company &&
      storedJobDescription ===
        next.jobDescription;

    if (unchanged) {
      return;
    }

    updateResume(
      resumeId,
      {
        jobTarget: next,
      }
    );
  }, [
    watchedJobTitle,
    watchedCompany,
    watchedJobDescription,
    resumeId,
    storedJobTitle,
    storedCompany,
    storedJobDescription,
    updateResume,
  ]);

  /* ========================================
     Clear Target
  ======================================== */

  const handleClearTarget =
    () => {
      reset(
        defaultJobTarget
      );

      updateResume(
        resumeId,
        {
          jobTarget:
            defaultJobTarget,
        }
      );
    };

  /* ========================================
     Workflow State
  ======================================== */

  const descriptionLength =
    watchedJobDescription
      ?.length || 0;

  const hasJobDescription =
    Boolean(
      watchedJobDescription
        ?.trim()
    );

  const hasJobTitle =
    Boolean(
      watchedJobTitle
        ?.trim()
    );

  const isReadyForAnalysis =
    hasJobDescription &&
    !errors.jobDescription;

  const jobTitleErrorId =
    "job-title-error";

  const companyErrorId =
    "company-error";

  const jobDescriptionHelpId =
    "job-description-help";

  const jobDescriptionErrorId =
    "job-description-error";

  const jobDescriptionDescribedBy =
    errors.jobDescription
      ? `${jobDescriptionHelpId} ${jobDescriptionErrorId}`
      : jobDescriptionHelpId;

  const handleAnalyzeResume =
    () => {
      if (
        !isReadyForAnalysis
      ) {
        return;
      }

      onSectionChange?.(
        "analysis"
      );
    };

  return (
    <div>
      {/* =====================================
          Heading
      ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
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

              text-violet-600

              dark:text-violet-400
            "
          >
            ATS Target
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
            Job Target
          </h2>

          <p
            className="
              mt-2
              max-w-2xl

              text-sm
              leading-6

              text-zinc-500

              dark:text-zinc-400
            "
          >
            Add the role and job
            description you want to
            target. ResumeCraft uses
            this information to compare
            your resume against the role,
            measure keyword alignment
            and generate ATS-focused
            recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleClearTarget
          }
          disabled={
            !hasJobDescription &&
            !hasJobTitle &&
            !watchedCompany
              ?.trim()
          }
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            gap-2

            rounded-xl

            border
            border-stone-200

            bg-white

            px-3.5
            py-2.5

            text-xs
            font-black

            text-zinc-600

            transition-colors

            hover:bg-stone-50

            disabled:cursor-not-allowed
            disabled:opacity-40

            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-zinc-300
            dark:hover:bg-zinc-800
          "
        >
          <RotateCcw
            size={14}
            aria-hidden="true"
          />

          Clear Target
        </button>
      </div>

      {/* =====================================
          Guidance Card
      ===================================== */}

      <div
        className="
          mt-6

          flex
          items-start
          gap-3

          rounded-2xl

          border
          border-violet-200

          bg-violet-50/70

          p-4

          dark:border-violet-900/50
          dark:bg-violet-950/20
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

            bg-white

            text-violet-600

            shadow-sm

            dark:bg-zinc-900
            dark:text-violet-400
          "
        >
          <Target
            size={16}
            aria-hidden="true"
          />
        </div>

        <div>
          <p
            className="
              text-sm
              font-black

              text-zinc-900

              dark:text-white
            "
          >
            Why add a job target?
          </p>

          <p
            className="
              mt-1

              text-xs
              leading-5

              text-zinc-600

              dark:text-zinc-400
            "
          >
            ATS analysis works best
            when your resume is
            compared against a real
            job description instead
            of relying on a generic
            resume score.
          </p>
        </div>
      </div>

      {/* =====================================
          Form
      ===================================== */}

      <div
        className="
          mt-7
          space-y-6
        "
      >
        {/* Job Title + Company */}

        <div
          className="
            grid
            gap-5

            md:grid-cols-2
          "
        >
          <div>
            <label
              htmlFor="jobTitle"
              className="
                text-sm
                font-black

                text-zinc-800

                dark:text-zinc-200
              "
            >
              Target Job Title
            </label>

            <div
              className="
                relative
                mt-2
              "
            >
              <Target
                size={16}
                aria-hidden="true"
                className="
                  absolute
                  left-4
                  top-1/2

                  -translate-y-1/2

                  text-zinc-400
                "
              />

              <input
                id="jobTitle"
                type="text"
                placeholder="e.g. Frontend Developer"
                {...register(
                  "jobTitle"
                )}
                aria-invalid={Boolean(
                  errors.jobTitle
                )}
                aria-describedby={
                  errors.jobTitle
                    ? jobTitleErrorId
                    : undefined
                }
                className="
                  w-full

                  rounded-xl

                  border
                  border-stone-200

                  bg-white

                  py-3
                  pl-11
                  pr-4

                  text-sm

                  text-zinc-950

                  outline-none

                  transition

                  placeholder:text-zinc-400

                  focus:border-violet-400
                  focus:ring-4
                  focus:ring-violet-100

                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:text-white
                  dark:focus:border-violet-500
                  dark:focus:ring-violet-950/50
                "
              />
            </div>

            {errors.jobTitle && (
              <p
                id={jobTitleErrorId}
                role="alert"
                className="
                  mt-2

                  text-xs
                  font-bold

                  text-red-600

                  dark:text-red-400
                "
              >
                {
                  errors.jobTitle
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="company"
              className="
                text-sm
                font-black

                text-zinc-800

                dark:text-zinc-200
              "
            >
              Target Company

              <span
                className="
                  ml-1

                  font-medium

                  text-zinc-400
                "
              >
                Optional
              </span>
            </label>

            <div
              className="
                relative
                mt-2
              "
            >
              <Building2
                size={16}
                aria-hidden="true"
                className="
                  absolute
                  left-4
                  top-1/2

                  -translate-y-1/2

                  text-zinc-400
                "
              />

              <input
                id="company"
                type="text"
                placeholder="e.g. Google"
                {...register(
                  "company"
                )}
                aria-invalid={Boolean(
                  errors.company
                )}
                aria-describedby={
                  errors.company
                    ? companyErrorId
                    : undefined
                }
                className="
                  w-full

                  rounded-xl

                  border
                  border-stone-200

                  bg-white

                  py-3
                  pl-11
                  pr-4

                  text-sm

                  text-zinc-950

                  outline-none

                  transition

                  placeholder:text-zinc-400

                  focus:border-violet-400
                  focus:ring-4
                  focus:ring-violet-100

                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:text-white
                  dark:focus:border-violet-500
                  dark:focus:ring-violet-950/50
                "
              />
            </div>

            {errors.company && (
              <p
                id={companyErrorId}
                role="alert"
                className="
                  mt-2

                  text-xs
                  font-bold

                  text-red-600

                  dark:text-red-400
                "
              >
                {
                  errors.company
                    .message
                }
              </p>
            )}
          </div>
        </div>

        {/* Job Description */}

        <div>
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <label
              htmlFor="jobDescription"
              className="
                text-sm
                font-black

                text-zinc-800

                dark:text-zinc-200
              "
            >
              Job Description
            </label>

            <span
              aria-hidden="true"
              className={`
                text-xs
                font-bold

                ${
                  descriptionLength >
                  9500
                    ? `
                        text-amber-600

                        dark:text-amber-400
                      `
                    : `
                        text-zinc-400

                        dark:text-zinc-500
                      `
                }
              `}
            >
              {descriptionLength}
              /10000
            </span>
          </div>

          <textarea
            id="jobDescription"
            rows={12}
            maxLength={10000}
            placeholder="Paste the complete job description here..."
            aria-invalid={Boolean(
              errors.jobDescription
            )}
            aria-describedby={
              jobDescriptionDescribedBy
            }
            {...register(
              "jobDescription"
            )}
            className="
              mt-2

              min-h-[280px]
              w-full

              resize-y

              rounded-2xl

              border
              border-stone-200

              bg-white

              p-4

              text-sm
              leading-6

              text-zinc-950

              outline-none

              transition

              placeholder:text-zinc-400

              focus:border-violet-400
              focus:ring-4
              focus:ring-violet-100

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-white
              dark:focus:border-violet-500
              dark:focus:ring-violet-950/50
            "
          />

          {errors.jobDescription && (
            <p
              id={jobDescriptionErrorId}
              role="alert"
              className="
                mt-2

                text-xs
                font-bold

                text-red-600

                dark:text-red-400
              "
            >
              {
                errors.jobDescription
                  .message
              }
            </p>
          )}

          <p
            id={jobDescriptionHelpId}
            className="
              mt-2

              text-xs
              leading-5

              text-zinc-400

              dark:text-zinc-500
            "
          >
            Paste the original job
            posting whenever possible.
            ResumeCraft extracts
            relevant technologies,
            skills and recurring terms
            from the description and
            compares them against your
            resume.
          </p>
        </div>
      </div>

      {/* =====================================
          Tailoring Workflow
      ===================================== */}

      <div
        className="
          mt-7

          rounded-3xl

          border
          border-stone-200

          bg-stone-50

          p-4

          dark:border-zinc-800
          dark:bg-zinc-950/40

          sm:p-5
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
              min-w-0
              items-start
              gap-3
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
                  isReadyForAnalysis
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
              {isReadyForAnalysis ? (
                <CheckCircle2
                  size={17}
                  aria-hidden="true"
                />
              ) : (
                <CircleAlert
                  size={17}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-black

                  text-zinc-900

                  dark:text-white
                "
              >
                {isReadyForAnalysis
                  ? "Ready for ATS analysis"
                  : "Add a job description to continue"}
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
                {isReadyForAnalysis
                  ? "Review keyword coverage, ATS readiness, content quality and tailored improvement suggestions."
                  : "Once you paste the target job description, ResumeCraft can compare it against your resume."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleAnalyzeResume
            }
            disabled={
              !isReadyForAnalysis
            }
            className="
              inline-flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-zinc-950

              px-4
              py-3

              text-xs
              font-black

              text-white

              transition

              hover:bg-zinc-800

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:bg-white
              dark:text-zinc-950
              dark:hover:bg-zinc-200

              sm:w-auto
            "
          >
            <Sparkles
              size={15}
              aria-hidden="true"
            />

            Analyze & Tailor

            <ArrowRight
              size={14}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* =====================================
          Save Status
      ===================================== */}

      <div
        className="
          mt-4

          rounded-2xl

          border
          border-emerald-200

          bg-emerald-50

          px-4
          py-3

          text-xs
          font-bold

          text-emerald-700

          dark:border-emerald-900/50
          dark:bg-emerald-950/20
          dark:text-emerald-300
        "
      >
        Your job target is saved
        automatically with this
        resume.
      </div>
    </div>
  );
};

export default JobTargetForm;