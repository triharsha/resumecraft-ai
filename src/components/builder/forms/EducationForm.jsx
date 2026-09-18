import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Info,
  Plus,
  Sparkles,
  Trash2,
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
  educationSchema,
} from "../../../schemas/educationSchema";

import {
  createEmptyEducation,
} from "../../../utils/resume";

import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Current Month Helper
======================================== */

const getCurrentMonth = () => {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  return `${year}-${month}`;
};

/* ========================================
   Single Education Editor
======================================== */

const EducationEditor = ({
  resumeId,
  education,
  index,
}) => {
  const [
    isExpanded,
    setIsExpanded,
  ] = useState(
    index === 0
  );

  const isResettingRef =
    useRef(false);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

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

  /* ========================================
     Store Values
  ======================================== */

  const educationId =
    education.id;

  const educationInstitution =
    education.institution ||
    "";

  const educationDegree =
    education.degree ||
    "";

  const educationFieldOfStudy =
    education.fieldOfStudy ||
    "";

  const educationLocation =
    education.location ||
    "";

  const educationStartDate =
    education.startDate ||
    "";

  const educationEndDate =
    education.endDate ||
    "";

  const educationCurrent =
    Boolean(
      education.current
    );

  const educationDescription =
    education.description ||
    "";

  /* ========================================
     React Hook Form
  ======================================== */

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
        educationSchema
      ),

    mode: "onChange",

    defaultValues: {
      institution:
        educationInstitution,

      degree:
        educationDegree,

      fieldOfStudy:
        educationFieldOfStudy,

      location:
        educationLocation,

      startDate:
        educationStartDate,

      endDate:
        educationEndDate,

      current:
        educationCurrent,

      description:
        educationDescription,
    },
  });

  /* ========================================
     Watched Form Values
  ======================================== */

  const formValues =
    useWatch({
      control,
    });

  const institution =
    formValues.institution ||
    "";

  const degree =
    formValues.degree ||
    "";

  const fieldOfStudy =
    formValues.fieldOfStudy ||
    "";

  const location =
    formValues.location ||
    "";

  const startDate =
    formValues.startDate ||
    "";

  const endDate =
    formValues.endDate ||
    "";

  const current =
    Boolean(
      formValues.current
    );

  const description =
    formValues.description ||
    "";

  /* ========================================
     Education Date Intelligence
  ======================================== */

  const currentMonth =
    getCurrentMonth();

  const startsInFuture =
    Boolean(
      startDate &&
        startDate >
          currentMonth
    );

  const endsInFuture =
    Boolean(
      !current &&
        endDate &&
        endDate >
          currentMonth
    );

  const hasInvalidDateRange =
    Boolean(
      !current &&
        startDate &&
        endDate &&
        endDate <
          startDate
    );

  /* ========================================
     Reset Education Entry
  ======================================== */

  useEffect(() => {
    isResettingRef.current =
      true;

    reset({
      institution:
        educationInstitution,

      degree:
        educationDegree,

      fieldOfStudy:
        educationFieldOfStudy,

      location:
        educationLocation,

      startDate:
        educationStartDate,

      endDate:
        educationEndDate,

      current:
        educationCurrent,

      description:
        educationDescription,
    });

    /*
     * Keep autosave paused until
     * React Hook Form has propagated
     * the reset values through
     * useWatch.
     */

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
    educationId,
    educationInstitution,
    educationDegree,
    educationFieldOfStudy,
    educationLocation,
    educationStartDate,
    educationEndDate,
    educationCurrent,
    educationDescription,
    reset,
  ]);

  /* ========================================
     Current Education
  ======================================== */

  useEffect(() => {
    if (
      !current ||
      !endDate
    ) {
      return;
    }

    /*
     * A current education entry
     * should never retain an end
     * date.
     */

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
      institution ===
        educationInstitution &&
      degree ===
        educationDegree &&
      fieldOfStudy ===
        educationFieldOfStudy &&
      location ===
        educationLocation &&
      startDate ===
        educationStartDate &&
      normalizedEndDate ===
        educationEndDate &&
      current ===
        educationCurrent &&
      description ===
        educationDescription;

    /*
     * Do not write the same values
     * back to Zustand. This avoids
     * unnecessary resume updates and
     * reset/autosave loops.
     */

    if (unchanged) {
      return;
    }

    updateSectionItem(
      resumeId,
      "education",
      educationId,
      {
        institution,
        degree,
        fieldOfStudy,
        location,
        startDate,

        endDate:
          normalizedEndDate,

        current,
        description,
      }
    );
  }, [
    institution,
    degree,
    fieldOfStudy,
    location,
    startDate,
    endDate,
    current,
    description,
    resumeId,
    educationId,
    educationInstitution,
    educationDegree,
    educationFieldOfStudy,
    educationLocation,
    educationStartDate,
    educationEndDate,
    educationCurrent,
    educationDescription,
    updateSectionItem,
  ]);

  /* ========================================
     Display Information
  ======================================== */

  const displayTitle =
    educationDegree ||
    educationFieldOfStudy ||
    `Education ${index + 1}`;

  const displayInstitution =
    educationInstitution ||
    "Add institution details";

  /* ========================================
     Delete Education
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
      removeSectionItem(
        resumeId,
        "education",
        educationId
      );

      setDeleteDialogOpen(false);
    };

  /* ========================================
     Accessibility IDs
  ======================================== */

  const editorId =
    `education-editor-${educationId}`;

  const descriptionId =
    `education-description-${educationId}`;

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
        bg-[#faf9f6]

        dark:border-zinc-800
        dark:bg-zinc-950
      "
    >
      {/* =====================================
          Education Header
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
              text-violet-600

              dark:bg-violet-950/30
              dark:text-violet-400
            "
          >
            <GraduationCap
              size={17}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
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
              {displayInstitution}
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
            title="Delete education"
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
                ? "Collapse education"
                : "Expand education"
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
              text-zinc-500
              transition-colors
              hover:bg-white

              dark:border-zinc-800
              dark:text-zinc-400
              dark:hover:bg-zinc-900
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
          Education Editor
      ===================================== */}

      {isExpanded && (
        <div
          id={editorId}
          className="
            border-t
            border-stone-200
            bg-white
            p-4

            dark:border-zinc-800
            dark:bg-zinc-900

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
            <div className="md:col-span-2">
              <FormField
                label="Institution"
                name="institution"
                placeholder="Jawaharlal Nehru Technological University"
                register={register}
                error={
                  errors.institution
                }
              />
            </div>

            <FormField
              label="Degree"
              name="degree"
              placeholder="Bachelor of Technology"
              register={register}
              error={
                errors.degree
              }
            />

            <FormField
              label="Field of Study"
              name="fieldOfStudy"
              placeholder="Computer Science and Engineering"
              register={register}
              error={
                errors.fieldOfStudy
              }
            />

            <div className="md:col-span-2">
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
              disabled={
                current
              }
            />
          </div>

          {/* =================================
              Currently Studying
          ================================= */}

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
              bg-[#faf9f6]
              px-4
              py-3

              dark:border-zinc-800
              dark:bg-zinc-950
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
                shrink-0
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
                I currently study here
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
                education as
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
              required while you
              are currently
              studying.
            </p>
          )}

          {/* =================================
              Date Intelligence
          ================================= */}

          {startsInFuture && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                px-4
                py-3

                dark:border-amber-900/40
                dark:bg-amber-950/10
              "
            >
              <CalendarClock
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
                    text-amber-700
                    dark:text-amber-300
                  "
                >
                  Future education start date
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
                  This education
                  starts in the
                  future. Confirm
                  that this is an
                  upcoming program
                  or qualification.
                </p>
              </div>
            </div>
          )}

          {endsInFuture &&
            !startsInFuture &&
            !hasInvalidDateRange && (
              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-sky-200
                  bg-sky-50
                  px-4
                  py-3

                  dark:border-sky-900/40
                  dark:bg-sky-950/10
                "
              >
                <Info
                  size={16}
                  aria-hidden="true"
                  className="
                    mt-0.5
                    shrink-0
                    text-sky-600
                    dark:text-sky-400
                  "
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      text-sky-700
                      dark:text-sky-300
                    "
                  >
                    Future graduation date detected
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
                    Your end date is
                    in the future. If
                    you are still
                    enrolled in this
                    program, consider
                    selecting
                    &quot;I currently
                    study here&quot;.
                    Otherwise, keep
                    the future date if
                    it represents an
                    expected
                    completion date.
                  </p>
                </div>
              </div>
            )}

          {/* =================================
              Description
          ================================= */}

          <div className="mt-5">
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <label
                htmlFor={descriptionId}
                className="
                  text-xs
                  font-black
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Education Description
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
                {description.length}
                /1000
              </span>
            </div>

            <textarea
              id={descriptionId}
              rows={6}
              maxLength={1000}
              placeholder="Add academic achievements, relevant coursework, activities, honours, GPA, or other useful details..."
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
                min-h-[150px]
                w-full
                resize-y
                rounded-2xl
                border
                bg-white
                px-4
                py-3.5
                text-sm
                leading-7
                text-zinc-950
                outline-none
                transition-all

                dark:bg-zinc-950
                dark:text-white

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
                        focus:border-violet-500
                        focus:ring-4
                        focus:ring-violet-500/10

                        dark:border-zinc-800
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
              Education Tip
          ================================= */}

          <div
            className="
              mt-5
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-violet-200
              bg-violet-50/60
              px-4
              py-3

              dark:border-violet-900/40
              dark:bg-violet-950/10
            "
          >
            <Sparkles
              size={15}
              aria-hidden="true"
              className="
                mt-0.5
                shrink-0
                text-violet-600
                dark:text-violet-400
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-black
                  text-violet-700
                  dark:text-violet-300
                "
              >
                Education tip
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
                Include academic
                achievements,
                relevant coursework,
                honours, or
                activities when
                they strengthen your
                resume. You do not
                need to list every
                subject you studied.
              </p>
            </div>
          </div>

          {/* =================================
              Validation Reminder
          ================================= */}

          {errors.endDate && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-rose-200
                bg-rose-50
                px-4
                py-3

                dark:border-rose-900/40
                dark:bg-rose-950/10
              "
            >
              <AlertTriangle
                size={16}
                aria-hidden="true"
                className="
                  mt-0.5
                  shrink-0
                  text-rose-600
                  dark:text-rose-400
                "
              />

              <div>
                <p
                  className="
                    text-xs
                    font-black
                    text-rose-700
                    dark:text-rose-300
                  "
                >
                  Check your education dates
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
                  {
                    errors.endDate
                      .message
                  }
                </p>
              </div>
            </div>
          )}
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
        title="Delete Education?"
        description={`"${displayTitle}" at "${displayInstitution}" will be removed from your resume. This action cannot be undone.`}
        confirmLabel="Delete Education"
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
   Education Form
======================================== */

const EducationForm = ({
  resume,
}) => {
  const addSectionItem =
    useResumeStore(
      (state) =>
        state.addSectionItem
    );

  const educations =
    Array.isArray(
      resume.education
    )
      ? resume.education
      : [];

  /* ========================================
     Add Education
  ======================================== */

  const handleAddEducation =
    () => {
      addSectionItem(
        resume.id,
        "education",
        createEmptyEducation()
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
            Academic Background
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
            Education
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
            Add your degrees,
            diplomas,
            certifications from
            educational
            institutions, or other
            relevant academic
            qualifications.
          </p>
        </div>

        {educations.length > 0 && (
          <button
            type="button"
            onClick={
              handleAddEducation
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
              py-2.5
              text-sm
              font-black
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md

              dark:bg-white
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
              Add Education
            </span>
          </button>
        )}
      </div>

      {/* =====================================
          Education Guidance
      ===================================== */}

      <div
        className="
          mt-7
          flex
          items-start
          gap-4
          rounded-2xl
          border
          border-stone-200
          bg-[#faf9f6]
          p-4

          dark:border-zinc-800
          dark:bg-zinc-950
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
            text-violet-600

            dark:bg-violet-950/30
            dark:text-violet-400
          "
        >
          <BookOpen
            size={17}
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
            Start with your most
            relevant qualification
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
            You can add multiple
            education entries.
            College, university,
            diploma, postgraduate,
            and other relevant
            academic qualifications
            can all be included.
          </p>
        </div>
      </div>

      {/* =====================================
          Education Entries
      ===================================== */}

      {educations.length >
      0 ? (
        <div
          className="
            mt-8
            space-y-4
          "
        >
          {educations.map(
            (
              education,
              index
            ) => (
              <EducationEditor
                key={
                  education.id
                }
                resumeId={
                  resume.id
                }
                education={
                  education
                }
                index={index}
              />
            )
          )}
        </div>
      ) : (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-dashed
            border-stone-300
            px-5
            py-10
            text-center

            dark:border-zinc-700
          "
        >
          <GraduationCap
            size={24}
            aria-hidden="true"
            className="
              mx-auto
              text-zinc-300
              dark:text-zinc-600
            "
          />

          <h3
            className="
              mt-3
              text-sm
              font-black
              text-zinc-950
              dark:text-white
            "
          >
            No education added
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
            Add your education to
            show employers your
            academic background
            and qualifications.
          </p>

          <button
            type="button"
            onClick={
              handleAddEducation
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
              bg-white
              px-4
              py-2.5
              text-xs
              font-black
              text-zinc-800
              transition-all

              hover:border-violet-200
              hover:bg-violet-50
              hover:text-violet-700

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-violet-500/15

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-200
              dark:hover:border-violet-900
              dark:hover:bg-violet-950/20
              dark:hover:text-violet-300
            "
          >
            <Plus
              size={14}
              aria-hidden="true"
              className="shrink-0"
            />

            <span>
              Add Education
            </span>
          </button>
        </div>
      )}

      {/* =====================================
          Autosave Status
      ===================================== */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-emerald-200
          bg-emerald-50/60
          px-4
          py-3

          dark:border-emerald-900/40
          dark:bg-emerald-950/10
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
          Education entries are
          saved automatically as
          you type.
        </p>
      </div>
    </div>
  );
};

export default EducationForm;