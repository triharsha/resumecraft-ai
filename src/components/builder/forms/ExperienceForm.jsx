import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  AlertTriangle,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
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

import FormField from "../../ui/FormField";
import ConfirmDialog from "../../ui/ConfirmDialog";

import {
  experienceSchema,
} from "../../../schemas/experienceSchema";

import {
  createEmptyExperience,
  employmentTypes,
  fresherFriendlyTypes,
  getEmploymentTypeLabel,
} from "../../../utils/resume";

import useResumeStore from "../../../stores/resumeStore";

import {
  improveExperience,
} from "../../../services/aiService";

/* ========================================
   Date Helpers
======================================== */

const getCurrentMonth =
  () => {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    return `${year}-${month}`;
  };

const isFutureMonth = (
  value
) => {
  if (!value) {
    return false;
  }

  return (
    value >
    getCurrentMonth()
  );
};

/* ========================================
   Single Experience Editor
======================================== */

const ExperienceEditor = ({
  resume,
  resumeId,
  experience,
  index,
  isFresher,
  currentRoleCount,
}) => {
  const [
    isExpanded,
    setIsExpanded,
  ] = useState(
    index === 0
  );

  const updateSectionItem =
    useResumeStore(
      (state) =>
        state.updateSectionItem
    );

  const removeSectionItem =
    useResumeStore(
      (state) =>
        state.removeSectionItem
    );

  const isResettingRef =
    useRef(false);

  const [
    isImproving,
    setIsImproving,
  ] = useState(false);

  const [
    aiSuggestion,
    setAiSuggestion,
  ] = useState("");

  const [
    aiError,
    setAiError,
  ] = useState("");

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const experienceId =
    experience.id;

  const experienceJobTitle =
    experience.jobTitle || "";

  const experienceCompany =
    experience.company || "";

  const experienceEmploymentType =
    experience.employmentType ||
    "full-time";

  const experienceLocation =
    experience.location || "";

  const experienceStartDate =
    experience.startDate || "";

  const experienceEndDate =
    experience.endDate || "";

  const experienceCurrent =
    Boolean(
      experience.current
    );

  const experienceDescription =
    experience.description || "";

  const {
    register,
    reset,
    setValue,
    control,

    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(
        experienceSchema
      ),

    mode:
      "onChange",

    defaultValues: {
      jobTitle:
        experienceJobTitle,

      company:
        experienceCompany,

      employmentType:
        experienceEmploymentType,

      location:
        experienceLocation,

      startDate:
        experienceStartDate,

      endDate:
        experienceEndDate,

      current:
        experienceCurrent,

      description:
        experienceDescription,
    },
  });

  /* ========================================
     Watched Values
  ======================================== */

  const formValues =
    useWatch({
      control,
    });

  const jobTitle =
    formValues.jobTitle || "";

  const company =
    formValues.company || "";

  const employmentType =
    formValues.employmentType ||
    "full-time";

  const location =
    formValues.location || "";

  const startDate =
    formValues.startDate || "";

  const endDate =
    formValues.endDate || "";

  const current =
    Boolean(
      formValues.current
    );

  const description =
    formValues.description || "";

  /* ========================================
     Fresher Validation
  ======================================== */

  const fresherConflict =
    isFresher &&
    employmentType ===
      "full-time";

  /* ========================================
     Future Date Detection
  ======================================== */

  const hasFutureStartDate =
    isFutureMonth(
      startDate
    );

  const hasFutureEndDate =
    !current &&
    isFutureMonth(
      endDate
    );

  /* ========================================
     Multiple Current Roles Detection
  ======================================== */

  const hasMultipleCurrentRoles =
    current &&
    currentRoleCount > 1;

  /* ========================================
     Reset Entry
  ======================================== */

  useEffect(() => {
    isResettingRef.current =
      true;

    reset({
      jobTitle:
        experienceJobTitle,

      company:
        experienceCompany,

      employmentType:
        experienceEmploymentType,

      location:
        experienceLocation,

      startDate:
        experienceStartDate,

      endDate:
        experienceEndDate,

      current:
        experienceCurrent,

      description:
        experienceDescription,
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
    experienceId,
    experienceJobTitle,
    experienceCompany,
    experienceEmploymentType,
    experienceLocation,
    experienceStartDate,
    experienceEndDate,
    experienceCurrent,
    experienceDescription,
    reset,
  ]);

  /* ========================================
     Current Role
  ======================================== */

  useEffect(() => {
    if (
      !current ||
      !endDate
    ) {
      return;
    }

    setValue(
      "endDate",
      "",
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  }, [
    current,
    endDate,
    setValue,
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

    const normalizedEndDate =
      current
        ? ""
        : endDate;

    const unchanged =
      jobTitle ===
        experienceJobTitle &&
      company ===
        experienceCompany &&
      employmentType ===
        experienceEmploymentType &&
      location ===
        experienceLocation &&
      startDate ===
        experienceStartDate &&
      normalizedEndDate ===
        experienceEndDate &&
      current ===
        experienceCurrent &&
      description ===
        experienceDescription;

    if (unchanged) {
      return;
    }

    updateSectionItem(
      resumeId,
      "experience",
      experienceId,
      {
        jobTitle,
        company,
        employmentType,
        location,
        startDate,
        endDate:
          normalizedEndDate,
        current,
        description,
      }
    );
  }, [
    jobTitle,
    company,
    employmentType,
    location,
    startDate,
    endDate,
    current,
    description,
    resumeId,
    experienceId,
    experienceJobTitle,
    experienceCompany,
    experienceEmploymentType,
    experienceLocation,
    experienceStartDate,
    experienceEndDate,
    experienceCurrent,
    experienceDescription,
    updateSectionItem,
  ]);

  /* ========================================
     AI Experience Improvement
  ======================================== */

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

  const handleAiImprove =
    async () => {
      if (
        !description.trim() ||
        errors.description
      ) {
        return;
      }

      setIsImproving(true);
      setAiError("");
      setAiSuggestion("");

      try {
        const suggestion =
          await improveExperience({
            description:
              description.trim(),

            jobTitle:
              jobTitle.trim(),

            company:
              company.trim(),

            employmentType,

            targetJobTitle:
              resume.jobTarget
                ?.jobTitle || "",

            targetJobDescription:
              resume.jobTarget
                ?.jobDescription ||
              "",

            skills:
              resume.skills || [],

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
            : "Unable to improve the experience right now."
        );
      } finally {
        setIsImproving(false);
      }
    };

  const handleApplySuggestion =
    () => {
      if (!aiSuggestion) {
        return;
      }

      setValue(
        "description",
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
     Display Information
  ======================================== */

  const displayTitle =
    experience.jobTitle ||
    `Experience ${index + 1}`;

  const displayCompany =
    experience.company ||
    "Add organisation details";

  const displayType =
    getEmploymentTypeLabel(
      experienceEmploymentType
    );

  /* ========================================
     Remove Experience
  ======================================== */

  const handleRemoveRequest =
    () => {
      setDeleteDialogOpen(true);
    };

  const handleCancelRemove =
    () => {
      setDeleteDialogOpen(false);
    };

  const handleConfirmRemove =
    () => {
      setAiSuggestion("");
      setAiError("");

      removeSectionItem(
        resumeId,
        "experience",
        experienceId
      );

      setDeleteDialogOpen(false);
    };

  /* ========================================
     Accessibility IDs
  ======================================== */

  const editorId =
    `experience-editor-${experienceId}`;

  const employmentTypeErrorId =
    `employment-type-${experienceId}-error`;

  const descriptionId =
    `experience-description-${experienceId}`;

  const descriptionErrorId =
    `${descriptionId}-error`;

  return (
    <>
      <article
        className="
          overflow-hidden

          rounded-2xl

          border
          border-stone-200
          dark:border-zinc-800

          bg-[#faf9f6]
          dark:bg-zinc-950
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4

            px-4
            py-4

            sm:px-5
          "
        >
          <button
            type="button"
            onClick={() =>
              setIsExpanded(
                (currentState) =>
                  !currentState
              )
            }
            aria-expanded={
              isExpanded
            }
            aria-controls={
              editorId
            }
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-3

              text-left
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

                bg-violet-50
                dark:bg-violet-950/30

                text-violet-600
                dark:text-violet-400
              "
            >
              <BriefcaseBusiness
                size={17}
                aria-hidden="true"
              />
            </div>

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  truncate

                  text-sm
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                {displayTitle}
              </p>

              <p
                className="
                  mt-0.5
                  truncate

                  text-xs

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {displayCompany}
                {" · "}
                {displayType}
              </p>
            </div>
          </button>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={
                handleRemoveRequest
              }
              aria-label={`Delete ${displayTitle}`}
              title="Delete experience"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-rose-200
                dark:border-rose-900/40

                bg-white
                dark:bg-zinc-900

                text-rose-500
                dark:text-rose-400

                transition-all

                hover:border-rose-300
                hover:bg-rose-50
                hover:text-rose-600

                dark:hover:border-rose-800
                dark:hover:bg-rose-950/20

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-rose-500/15
              "
            >
              <Trash2
                size={15}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setIsExpanded(
                  (currentState) =>
                    !currentState
                )
              }
              aria-label={
                isExpanded
                  ? "Collapse experience"
                  : "Expand experience"
              }
              aria-expanded={
                isExpanded
              }
              aria-controls={
                editorId
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center

                rounded-xl

                border
                border-stone-200
                dark:border-zinc-800

                text-zinc-500
                dark:text-zinc-400

                transition-colors

                hover:bg-white
                dark:hover:bg-zinc-900

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-violet-500/15
              "
            >
              {isExpanded ? (
                <ChevronUp
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>

        {/* =====================================
            Editor
        ===================================== */}

        {isExpanded && (
          <div
            id={editorId}
            className="
              border-t
              border-stone-200
              dark:border-zinc-800

              bg-white
              dark:bg-zinc-900

              p-4

              sm:p-5
            "
          >
            <div
              className="
                grid
                gap-5

                md:grid-cols-2
              "
            >
              <FormField
                label="Job Title"
                name="jobTitle"
                placeholder="Software Developer Intern"
                register={register}
                error={
                  errors.jobTitle
                }
              />

              <FormField
                label="Company / Organisation"
                name="company"
                placeholder="Acme Technologies"
                register={register}
                error={
                  errors.company
                }
              />

              <div
                className="
                  md:col-span-2
                "
              >
                <label
                  htmlFor={`employment-type-${experienceId}`}
                  className="
                    text-xs
                    font-black

                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  Employment Type
                </label>

                <select
                  id={`employment-type-${experienceId}`}
                  aria-invalid={
                    Boolean(
                      errors.employmentType
                    )
                  }
                  aria-describedby={
                    errors.employmentType
                      ? employmentTypeErrorId
                      : undefined
                  }
                  {...register(
                    "employmentType"
                  )}
                  className="
                    mt-2

                    w-full

                    rounded-xl

                    border
                    border-stone-200
                    dark:border-zinc-800

                    bg-white
                    dark:bg-zinc-950

                    px-3.5
                    py-3

                    text-sm

                    text-zinc-950
                    dark:text-white

                    outline-none

                    transition-all

                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-500/10
                  "
                >
                  {employmentTypes.map(
                    (type) => (
                      <option
                        key={
                          type.value
                        }
                        value={
                          type.value
                        }
                      >
                        {
                          type.label
                        }
                      </option>
                    )
                  )}
                </select>

                {errors.employmentType && (
                  <p
                    id={
                      employmentTypeErrorId
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
                      errors
                        .employmentType
                        .message
                    }
                  </p>
                )}
              </div>

              <div
                className="
                  md:col-span-2
                "
              >
                <FormField
                  label="Location"
                  name="location"
                  placeholder="Hyderabad, Telangana"
                  register={register}
                  error={
                    errors.location
                  }
                />
              </div>

              <FormField
                label="Start Date"
                name="startDate"
                type="month"
                register={register}
                error={
                  errors.startDate
                }
              />

              <FormField
                label="End Date"
                name="endDate"
                type="month"
                register={register}
                error={
                  errors.endDate
                }
              />

              {(
                hasFutureStartDate ||
                hasFutureEndDate
              ) && (
                <div
                  className="
                    md:col-span-2

                    flex
                    items-start
                    gap-3

                    rounded-xl

                    border
                    border-amber-200
                    dark:border-amber-900/50

                    bg-amber-50
                    dark:bg-amber-950/10

                    px-4
                    py-3
                  "
                >
                  <AlertTriangle
                    size={16}
                    aria-hidden="true"
                    className="
                      mt-0.5
                      shrink-0

                      text-amber-600
                      dark:text-amber-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-black

                        text-amber-800
                        dark:text-amber-300
                      "
                    >
                      Future employment
                      date
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
                      {hasFutureStartDate &&
                      hasFutureEndDate
                        ? "Both the start and end dates are in the future. Confirm that these dates are correct."
                        : hasFutureStartDate
                          ? "The start date is in the future. Confirm that this date is correct."
                          : "The end date is in the future. Confirm that this date is correct."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <label
              className="
                mt-5

                flex
                cursor-pointer
                items-start
                gap-3

                rounded-xl

                border
                border-stone-200
                dark:border-zinc-800

                bg-[#faf9f6]
                dark:bg-zinc-950

                px-4
                py-3
              "
            >
              <input
                type="checkbox"
                {...register(
                  "current"
                )}
                className="
                  mt-0.5

                  h-4
                  w-4

                  accent-violet-600
                "
              />

              <div>
                <p
                  className="
                    text-sm
                    font-black

                    text-zinc-800
                    dark:text-zinc-200
                  "
                >
                  I currently work
                  here
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
                  ResumeCraft will
                  display this
                  experience as
                  Present.
                </p>
              </div>
            </label>

            {current && (
              <p
                className="
                  mt-2

                  text-xs
                  font-semibold

                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                End date is not
                required for a
                current role.
              </p>
            )}

            {hasMultipleCurrentRoles && (
              <div
                className="
                  mt-5

                  flex
                  items-start
                  gap-3

                  rounded-xl

                  border
                  border-amber-200
                  dark:border-amber-900/50

                  bg-amber-50
                  dark:bg-amber-950/10

                  px-4
                  py-3
                "
              >
                <AlertTriangle
                  size={16}
                  aria-hidden="true"
                  className="
                    mt-0.5
                    shrink-0

                    text-amber-600
                    dark:text-amber-400
                  "
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-black

                      text-amber-800
                      dark:text-amber-300
                    "
                  >
                    Multiple current
                    roles detected
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
                    You have{" "}
                    {currentRoleCount}{" "}
                    experiences marked
                    as current. This can
                    be valid for
                    freelance,
                    part-time, or
                    concurrent roles,
                    but confirm that
                    these entries are
                    intentional.
                  </p>
                </div>
              </div>
            )}

            {fresherConflict && (
              <div
                className="
                  mt-5

                  flex
                  items-start
                  gap-3

                  rounded-xl

                  border
                  border-amber-200
                  dark:border-amber-900/50

                  bg-amber-50
                  dark:bg-amber-950/10

                  px-4
                  py-3
                "
              >
                <AlertTriangle
                  size={16}
                  aria-hidden="true"
                  className="
                    mt-0.5
                    shrink-0

                    text-amber-600
                    dark:text-amber-400
                  "
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-black

                      text-amber-800
                      dark:text-amber-300
                    "
                  >
                    Fresher profile
                    inconsistency
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
                    This entry is
                    marked as
                    Full-time while
                    Fresher mode is
                    enabled. Confirm
                    that your profile
                    type is correct.
                  </p>
                </div>
              </div>
            )}

            {/* =================================
                Description
            ================================= */}

            <div
              className="
                mt-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <label
                  htmlFor={
                    descriptionId
                  }
                  className="
                    text-xs
                    font-black

                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  Experience
                  Description
                </label>

                <span
                  aria-hidden="true"
                  className="
                    text-xs
                    font-bold

                    text-zinc-400
                    dark:text-zinc-500
                  "
                >
                  {
                    description.length
                  }
                  /1200
                </span>
              </div>

              <textarea
                id={
                  descriptionId
                }
                rows={7}
                maxLength={1200}
                placeholder="Describe your responsibilities, achievements, technologies, and measurable impact..."
                aria-invalid={
                  Boolean(
                    errors.description
                  )
                }
                aria-describedby={
                  errors.description
                    ? descriptionErrorId
                    : undefined
                }
                {...register(
                  "description"
                )}
                className={`
                  mt-2

                  min-h-[170px]
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

                  ${
                    errors.description
                      ? `
                          border-rose-400

                          focus:border-rose-500
                          focus:ring-4
                          focus:ring-rose-500/10
                        `
                      : `
                          border-stone-200
                          dark:border-zinc-800

                          focus:border-violet-500
                          focus:ring-4
                          focus:ring-violet-500/10
                        `
                  }
                `}
              />

              {errors.description && (
                <p
                  id={
                    descriptionErrorId
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
                    errors.description
                      .message
                  }
                </p>
              )}
            </div>

            {/* =================================
                AI Experience Improvement
            ================================= */}

            <div
              className="
                mt-5

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
                      Strengthen this
                      experience using your
                      role, skills,
                      projects, and target
                      job while preserving
                      your real experience.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleAiImprove
                  }
                  disabled={
                    isImproving ||
                    !description.trim() ||
                    Boolean(
                      errors.description
                    )
                  }
                  aria-busy={
                    isImproving
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

                  {isImproving
                    ? "Improving..."
                    : "AI Improve"}
                </button>
              </div>

              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {isImproving
                  ? "AI is improving this experience description."
                  : aiSuggestion
                    ? "AI experience suggestion is ready for review."
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

                      whitespace-pre-wrap

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
                    Your existing
                    description stays
                    unchanged until you
                    apply this suggestion.
                  </p>
                </div>
              )}

              {!aiSuggestion &&
                !aiError && (
                  <p
                    className="
                      mt-3

                      text-[10px]
                      font-semibold
                      leading-4

                      text-violet-500
                      dark:text-violet-400
                    "
                  >
                    Tip: include what you
                    worked on, how you
                    contributed, and any
                    real measurable impact
                    before asking AI to
                    improve it.
                  </p>
                )}
            </div>
          </div>
        )}
      </article>

      {/* =====================================
          Delete Confirmation
      ===================================== */}

      <ConfirmDialog
        open={
          deleteDialogOpen
        }
        title="Delete Experience?"
        description={`"${displayTitle}" will be removed from your resume. This action cannot be undone.`}
        confirmLabel="Delete Experience"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={
          handleConfirmRemove
        }
        onCancel={
          handleCancelRemove
        }
      />
    </>
  );
};

/* ========================================
   Experience Form
======================================== */

const ExperienceForm = ({
  resume,
}) => {
  const updateResume =
    useResumeStore(
      (state) =>
        state.updateResume
    );

  const addSectionItem =
    useResumeStore(
      (state) =>
        state.addSectionItem
    );

  const isFresher =
    Boolean(
      resume.isFresher
    );

  const experiences =
    Array.isArray(
      resume.experience
    )
      ? resume.experience
      : [];

  const completedExperiences =
    experiences.filter(
      (experience) =>
        experience.jobTitle ||
        experience.company ||
        experience.description
    );

  const fresherFriendlyCount =
    completedExperiences.filter(
      (experience) =>
        fresherFriendlyTypes.includes(
          experience.employmentType
        )
    ).length;

  /* ========================================
     Current Role Count
  ======================================== */

  const currentRoleCount =
    experiences.filter(
      (experience) =>
        Boolean(
          experience.current
        )
    ).length;

  /* ========================================
     Fresher Mode
  ======================================== */

  const handleFresherChange =
    (event) => {
      updateResume(
        resume.id,
        {
          isFresher:
            event.target
              .checked,
        }
      );
    };

  /* ========================================
     Add Experience
  ======================================== */

  const handleAddExperience =
    () => {
      const newExperience =
        createEmptyExperience();

      if (isFresher) {
        newExperience.employmentType =
          "internship";
      }

      addSectionItem(
        resume.id,
        "experience",
        newExperience
      );
    };

  return (
    <div>
      {/* =====================================
          Header
      ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-5

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
            Career History
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
            Work Experience
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
            Add jobs,
            internships,
            freelance work,
            apprenticeships, and
            other professional
            experience relevant to
            your career.
          </p>
        </div>

        {/* =================================
            Add Button
            Only shown when entries exist
        ================================= */}

        {experiences.length > 0 && (
          <button
            type="button"
            onClick={
              handleAddExperience
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
              dark:bg-white

              px-4
              py-2.5

              text-sm
              font-black

              shadow-sm

              transition-all

              hover:-translate-y-0.5
              hover:shadow-md

              sm:w-auto
            "
          >
            <Plus
              size={15}
              aria-hidden="true"
              className="
                shrink-0
                text-white
                dark:text-zinc-950
              "
            />

            <span
              className="
                text-white
                dark:text-zinc-950
              "
            >
              Add Experience
            </span>
          </button>
        )}
      </div>

      {/* =====================================
          Fresher Mode
      ===================================== */}

      <label
        className={`
          mt-7

          flex
          cursor-pointer
          items-start
          gap-4

          rounded-2xl

          border

          p-4

          transition-colors

          ${
            isFresher
              ? `
                  border-violet-300
                  bg-violet-50

                  dark:border-violet-800
                  dark:bg-violet-950/20
                `
              : `
                  border-stone-200
                  bg-[#faf9f6]

                  dark:border-zinc-800
                  dark:bg-zinc-950
                `
          }
        `}
      >
        <input
          type="checkbox"
          checked={
            isFresher
          }
          onChange={
            handleFresherChange
          }
          className="
            mt-1

            h-4
            w-4

            shrink-0

            accent-violet-600
          "
        />

        <div
          className="
            flex
            min-w-0
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

              bg-white
              dark:bg-zinc-900

              text-violet-600
              dark:text-violet-400
            "
          >
            <UserRound
              size={16}
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
              I’m a fresher /
              I don’t have
              full-time
              professional
              experience yet
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
              You can still add
              internships,
              freelance work,
              part-time work,
              apprenticeships,
              or volunteering.
            </p>
          </div>
        </div>
      </label>

      {/* =====================================
          Fresher Guidance
      ===================================== */}

      {isFresher && (
        <div
          className="
            mt-4

            rounded-2xl

            border
            border-violet-200
            dark:border-violet-900/40

            bg-violet-50/50
            dark:bg-violet-950/10

            px-4
            py-3
          "
        >
          <p
            className="
              text-xs
              font-black

              text-violet-700
              dark:text-violet-300
            "
          >
            Fresher profile enabled
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
            {fresherFriendlyCount >
            0
              ? `${fresherFriendlyCount} fresher-friendly experience ${
                  fresherFriendlyCount ===
                  1
                    ? "entry is"
                    : "entries are"
                } available for your resume.`
              : "Add internships, freelance projects, volunteer work, apprenticeships, or part-time experience if you have any."}
          </p>
        </div>
      )}

      {/* =====================================
          Experience Entries
      ===================================== */}

      {experiences.length >
      0 ? (
        <div
          className="
            mt-8
            space-y-4
          "
        >
          {experiences.map(
            (
              experience,
              index
            ) => (
              <ExperienceEditor
                key={
                  experience.id
                }
                resume={
                  resume
                }
                resumeId={
                  resume.id
                }
                experience={
                  experience
                }
                index={index}
                isFresher={
                  isFresher
                }
                currentRoleCount={
                  currentRoleCount
                }
              />
            )
          )}
        </div>
      ) : (
        /* ===================================
           Empty State
        =================================== */

        <div
          className="
            mt-8

            rounded-2xl

            border
            border-dashed
            border-stone-300
            dark:border-zinc-700

            bg-[#faf9f6]
            dark:bg-zinc-950

            px-5
            py-10

            text-center
          "
        >
          <div
            className="
              mx-auto

              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-2xl

              bg-violet-50
              dark:bg-violet-950/30

              text-violet-500
              dark:text-violet-400
            "
          >
            <BriefcaseBusiness
              size={20}
              aria-hidden="true"
            />
          </div>

          <h3
            className="
              mt-4

              text-sm
              font-black

              text-zinc-950
              dark:text-white
            "
          >
            No experience added
          </h3>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm

              text-xs
              leading-5

              text-zinc-500
              dark:text-zinc-400
            "
          >
            No experience entries yet.
            Add a job, internship,
            freelance role,
            apprenticeship, volunteer
            experience, or other relevant
            work when you&apos;re ready.
          </p>

          <button
            type="button"
            onClick={
              handleAddExperience
            }
            className="
              mt-5

              inline-flex
              items-center
              justify-center
              gap-2

              whitespace-nowrap

              rounded-xl

              border
              border-stone-200
              dark:border-zinc-700

              bg-white
              dark:bg-zinc-900

              px-4
              py-2.5

              text-xs
              font-black

              text-zinc-800
              dark:text-zinc-200

              transition-all

              hover:border-violet-200
              hover:bg-violet-50
              hover:text-violet-700

              dark:hover:border-violet-900
              dark:hover:bg-violet-950/20
              dark:hover:text-violet-300

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-violet-500/15
            "
          >
            <Plus
              size={14}
              aria-hidden="true"
              className="
                shrink-0
              "
            />

            <span>
              Add Experience
            </span>
          </button>
        </div>
      )}

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
          Experience entries and
          profile preferences are
          saved automatically.
        </p>
      </div>
    </div>
  );
};

export default ExperienceForm;