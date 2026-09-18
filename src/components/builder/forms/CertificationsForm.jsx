import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Award,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import ConfirmDialog from "../../ui/ConfirmDialog";
import FormField from "../../ui/FormField";

import { certificationSchema } from "../../../schemas/certificationSchema";

import {
  createEmptyCertification,
} from "../../../utils/resume";

import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Date Helpers
======================================== */

const getCurrentMonthValue = () => {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
};

/* ========================================
   Single Certification Editor
======================================== */

const CertificationEditor = ({
  resumeId,
  certification,
  index,
}) => {
  const [
    isExpanded,
    setIsExpanded,
  ] = useState(
    index === 0
  );

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const isResettingRef =
    useRef(false);

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
        certificationSchema
      ),

    mode: "onChange",

    defaultValues: {
      name:
        certification.name ||
        "",

      issuer:
        certification.issuer ||
        "",

      issueDate:
        certification.issueDate ||
        "",

      credentialUrl:
        certification.credentialUrl ||
        "",
    },
  });

  /* ========================================
     Watched Form Values
  ======================================== */

  const formValues =
    useWatch({
      control,
    });

  const issueDate =
    formValues.issueDate ||
    "";

  /* ========================================
     Certification Values
  ======================================== */

  const certificationId =
    certification.id;

  const certificationName =
    certification.name ||
    "";

  const certificationIssuer =
    certification.issuer ||
    "";

  const certificationIssueDate =
    certification.issueDate ||
    "";

  const certificationCredentialUrl =
    certification.credentialUrl ||
    "";

  /* ========================================
     Reset When Store Entry Changes
  ======================================== */

  useEffect(() => {
    isResettingRef.current =
      true;

    reset({
      name:
        certificationName,

      issuer:
        certificationIssuer,

      issueDate:
        certificationIssueDate,

      credentialUrl:
        certificationCredentialUrl,
    });

    /*
     * useWatch receives the reset values
     * during the next render.
     *
     * Keep the reset guard active until
     * that render/effect cycle completes.
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
    certificationId,
    certificationName,
    certificationIssuer,
    certificationIssueDate,
    certificationCredentialUrl,
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

    const values = {
      name:
        formValues.name ||
        "",

      issuer:
        formValues.issuer ||
        "",

      issueDate:
        formValues.issueDate ||
        "",

      credentialUrl:
        formValues.credentialUrl ||
        "",
    };

    /*
     * Avoid writing identical data back
     * into Zustand.
     *
     * This is important because the store
     * update causes the resume to render
     * again.
     */

    const unchanged =
      values.name ===
        certificationName &&
      values.issuer ===
        certificationIssuer &&
      values.issueDate ===
        certificationIssueDate &&
      values.credentialUrl ===
        certificationCredentialUrl;

    if (unchanged) {
      return;
    }

    updateSectionItem(
      resumeId,
      "certifications",
      certificationId,
      values
    );
  }, [
    formValues.name,
    formValues.issuer,
    formValues.issueDate,
    formValues.credentialUrl,
    resumeId,
    certificationId,
    certificationName,
    certificationIssuer,
    certificationIssueDate,
    certificationCredentialUrl,
    updateSectionItem,
  ]);

  /* ========================================
     Future Date Warning
  ======================================== */

  const hasFutureIssueDate =
    useMemo(() => {
      if (!issueDate) {
        return false;
      }

      return (
        issueDate >
        getCurrentMonthValue()
      );
    }, [
      issueDate,
    ]);

  /* ========================================
     Delete
  ======================================== */

  const handleRemoveRequest = () => {
    setDeleteDialogOpen(true);
  };

  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmRemove = () => {
    removeSectionItem(
      resumeId,
      "certifications",
      certificationId
    );

    setDeleteDialogOpen(false);
  };

  /* ========================================
     Card Information
  ======================================== */

  const displayTitle =
    certificationName ||
    `Certification ${index + 1}`;

  const displaySubtitle =
    certificationIssuer ||
    "Add certification details";

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
            <Award
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
              {displaySubtitle}
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
            title="Delete certification"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-xl
              border
              border-rose-200

              text-rose-500

              transition-colors

              hover:bg-rose-50

              dark:border-rose-900/40
              dark:text-rose-400
              dark:hover:bg-rose-950/20
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
                ? "Collapse certification"
                : "Expand certification"
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
          Editor
      ===================================== */}

      {isExpanded && (
        <div
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
                label="Certification Name"
                name="name"
                placeholder="AWS Certified Cloud Practitioner"
                register={register}
                error={
                  errors.name
                }
              />
            </div>

            <FormField
              label="Issuing Organization"
              name="issuer"
              placeholder="Amazon Web Services"
              register={register}
              error={
                errors.issuer
              }
            />

            {/* =================================
                Issue Date
            ================================= */}

            <div>
              <label
                htmlFor={`certification-date-${certificationId}`}
                className="
                  text-xs
                  font-black

                  text-zinc-700

                  dark:text-zinc-300
                "
              >
                Issue Date
              </label>

              <div className="relative mt-2">
                <input
                  id={`certification-date-${certificationId}`}
                  type="month"
                  {...register(
                    "issueDate"
                  )}
                  className={`
                    w-full

                    rounded-xl
                    border

                    bg-white

                    px-4
                    py-3
                    pr-10

                    text-sm
                    text-zinc-950

                    outline-none
                    transition-all

                    dark:bg-zinc-950
                    dark:text-white

                    ${
                      errors.issueDate
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

                <CalendarDays
                  size={15}
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute
                    right-3
                    top-1/2

                    -translate-y-1/2

                    text-zinc-400
                  "
                />
              </div>

              {errors.issueDate && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-semibold

                    text-rose-600

                    dark:text-rose-400
                  "
                >
                  {
                    errors.issueDate
                      .message
                  }
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Credential URL"
                name="credentialUrl"
                placeholder="https://www.credly.com/badges/..."
                register={register}
                error={
                  errors.credentialUrl
                }
              />
            </div>
          </div>

          {/* =================================
              Future Date Warning
          ================================= */}

          {hasFutureIssueDate && (
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

                dark:border-amber-900/50
                dark:bg-amber-950/20
              "
            >
              <CalendarDays
                size={15}
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
                  Future issue date
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5

                    text-amber-700

                    dark:text-amber-400
                  "
                >
                  This certification
                  has an issue date in
                  the future. Verify
                  the date before
                  exporting your
                  resume.
                </p>
              </div>
            </div>
          )}

          {/* =================================
              Credential Tip
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
            <ExternalLink
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
                Credential tip
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
                Add the official
                verification URL
                when your
                certification
                provider gives you
                one.
              </p>
            </div>
          </div>
        </div>
      )}
      </article>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Certification?"
        description={`"${displayTitle}"${
          certificationIssuer
            ? ` from "${certificationIssuer}"`
            : ""
        } will be removed from your resume. This action cannot be undone.`}
        confirmLabel="Delete Certification"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </>
  );
};

/* ========================================
   Certifications Form
======================================== */

const CertificationsForm = ({
  resume,
}) => {
  const addSectionItem =
    useResumeStore(
      (state) =>
        state.addSectionItem
    );

  const certifications =
    Array.isArray(
      resume.certifications
    )
      ? resume.certifications
      : [];

  const handleAddCertification =
    () => {
      addSectionItem(
        resume.id,
        "certifications",
        createEmptyCertification()
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
            Credentials
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
            Certifications
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
            Add relevant
            professional
            certifications,
            credentials, or
            industry qualifications.
          </p>
        </div>

        {certifications.length > 0 && (
          <button
          type="button"
          onClick={
            handleAddCertification
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
            Add Certification
          </span>
          </button>
        )}
      </div>

      {/* =====================================
          Guidance
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
          <Lightbulb
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
            Prioritize relevant
            certifications
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
            Include certifications
            that support the role
            you are targeting.
            Avoid filling your
            one-page resume with
            unrelated credentials.
          </p>
        </div>
      </div>

      {/* =====================================
          Entries
      ===================================== */}

      {certifications.length >
      0 ? (
        <div
          className="
            mt-8
            space-y-4
          "
        >
          {certifications.map(
            (
              certification,
              index
            ) => (
              <CertificationEditor
                key={
                  certification.id
                }
                resumeId={
                  resume.id
                }
                certification={
                  certification
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
          <Award
            size={25}
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
            No certifications added
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
            Add a certification if
            it helps demonstrate
            relevant technical or
            professional knowledge.
          </p>

          <button
            type="button"
            onClick={
              handleAddCertification
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

              transition-colors

              hover:bg-stone-50

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-200
              dark:hover:bg-zinc-800
            "
          >
            <Plus
              size={14}
              aria-hidden="true"
              className="shrink-0"
            />

            Add Certification
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
          Certifications are saved
          automatically as you edit
          them.
        </p>
      </div>
    </div>
  );
};

export default CertificationsForm;