import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useEffect,
  useRef,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import FormField from "../../ui/FormField";

import {
  personalInfoSchema,
} from "../../../schemas/personalInfoSchema";

import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Phone Helpers
======================================== */

const PHONE_PREFIX = "+91";

const getPhoneDigits = (
  value = ""
) => {
  if (!value) {
    return "";
  }

  const stringValue =
    String(value).trim();

  /*
   * Stored resume values use:
   * +91 98765 43210
   *
   * Remove the actual +91 prefix
   * before extracting the editable
   * 10-digit mobile number.
   *
   * This works even while the user
   * has entered only a few digits.
   */
  const valueWithoutPrefix =
    stringValue.startsWith(
      PHONE_PREFIX
    )
      ? stringValue.slice(
          PHONE_PREFIX.length
        )
      : stringValue;

  return valueWithoutPrefix
    .replace(/\D/g, "")
    .slice(0, 10);
};

const formatStoredPhone = (
  digits = ""
) => {
  if (!digits) {
    return "";
  }

  const safeDigits =
    String(digits)
      .replace(/\D/g, "")
      .slice(0, 10);

  if (!safeDigits) {
    return "";
  }

  if (
    safeDigits.length <= 5
  ) {
    return `${PHONE_PREFIX} ${safeDigits}`;
  }

  return `${PHONE_PREFIX} ${safeDigits.slice(
    0,
    5
  )} ${safeDigits.slice(5)}`;
};

/* ========================================
   Component
======================================== */

const PersonalInfoForm = ({
  resume,
}) => {
  const isResettingRef =
    useRef(false);

  const updatePersonalInfo =
    useResumeStore(
      (state) =>
        state.updatePersonalInfo
    );

  const resumeId =
    resume.id;

  const firstName =
    resume.personalInfo
      ?.firstName || "";

  const lastName =
    resume.personalInfo
      ?.lastName || "";

  const jobTitle =
    resume.personalInfo
      ?.jobTitle || "";

  const email =
    resume.personalInfo
      ?.email || "";

  const phone =
    resume.personalInfo
      ?.phone || "";

  const phoneDigits =
    getPhoneDigits(phone);

  const location =
    resume.personalInfo
      ?.location || "";

  const website =
    resume.personalInfo
      ?.website || "";

  const linkedin =
    resume.personalInfo
      ?.linkedin || "";

  const github =
    resume.personalInfo
      ?.github || "";

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
        personalInfoSchema
      ),

    mode:
      "onChange",

    defaultValues: {
      firstName,
      lastName,
      jobTitle,
      email,

      /*
       * React Hook Form keeps only
       * the editable 10-digit number.
       *
       * Example:
       * 9876543210
       *
       * +91 formatting is applied
       * only when saving.
       */
      phone:
        phoneDigits,

      location,
      website,
      linkedin,
      github,
    },
  });

  const watchedValues =
    useWatch({
      control,
    });

  const watchedFirstName =
    watchedValues.firstName ||
    "";

  const watchedLastName =
    watchedValues.lastName ||
    "";

  const watchedJobTitle =
    watchedValues.jobTitle ||
    "";

  const watchedEmail =
    watchedValues.email ||
    "";

  const watchedPhone =
    watchedValues.phone ||
    "";

  const watchedLocation =
    watchedValues.location ||
    "";

  const watchedWebsite =
    watchedValues.website ||
    "";

  const watchedLinkedin =
    watchedValues.linkedin ||
    "";

  const watchedGithub =
    watchedValues.github ||
    "";

  /* ========================================
     Reset When Resume Changes
  ======================================== */

  useEffect(() => {
    isResettingRef.current =
      true;

    reset({
      firstName,
      lastName,
      jobTitle,
      email,

      phone:
        phoneDigits,

      location,
      website,
      linkedin,
      github,
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
    firstName,
    lastName,
    jobTitle,
    email,
    phoneDigits,
    location,
    website,
    linkedin,
    github,
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

    const storedPhone =
      formatStoredPhone(
        watchedPhone
      );

    const unchanged =
      watchedFirstName ===
        firstName &&
      watchedLastName ===
        lastName &&
      watchedJobTitle ===
        jobTitle &&
      watchedEmail ===
        email &&
      storedPhone ===
        phone &&
      watchedLocation ===
        location &&
      watchedWebsite ===
        website &&
      watchedLinkedin ===
        linkedin &&
      watchedGithub ===
        github;

    if (unchanged) {
      return;
    }

    updatePersonalInfo(
      resumeId,
      {
        firstName:
          watchedFirstName,

        lastName:
          watchedLastName,

        jobTitle:
          watchedJobTitle,

        email:
          watchedEmail,

        phone:
          storedPhone,

        location:
          watchedLocation,

        website:
          watchedWebsite,

        linkedin:
          watchedLinkedin,

        github:
          watchedGithub,
      }
    );
  }, [
    watchedFirstName,
    watchedLastName,
    watchedJobTitle,
    watchedEmail,
    watchedPhone,
    watchedLocation,
    watchedWebsite,
    watchedLinkedin,
    watchedGithub,
    resumeId,
    firstName,
    lastName,
    jobTitle,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
    updatePersonalInfo,
  ]);

  /* ========================================
     Phone Input
  ======================================== */

  const handlePhoneChange =
    (event) => {
      const digits =
        event.target.value
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            10
          );

      setValue(
        "phone",
        digits,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
    };

  const handlePhonePaste =
    (event) => {
      event.preventDefault();

      const pastedValue =
        event.clipboardData.getData(
          "text"
        );

      let digits =
        pastedValue.replace(
          /\D/g,
          ""
        );

      /*
       * Support pasting a complete
       * Indian number such as:
       *
       * +91 98765 43210
       * 919876543210
       */
      if (
        digits.startsWith(
          "91"
        ) &&
        digits.length > 10
      ) {
        digits =
          digits.slice(2);
      }

      digits =
        digits.slice(
          0,
          10
        );

      setValue(
        "phone",
        digits,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
    };

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
          Personal Details
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
          Personal Information
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
          Add the contact and
          professional details
          recruiters should see at
          the top of your resume.
        </p>
      </div>

      {/* =====================================
          Form
      ===================================== */}

      <div
        className="
          mt-8

          grid
          gap-5

          md:grid-cols-2
        "
      >
        <FormField
          label="First Name"
          name="firstName"
          placeholder="Alex"
          register={register}
          error={
            errors.firstName
          }
          autoComplete="given-name"
        />

        <FormField
          label="Last Name"
          name="lastName"
          placeholder="Morgan"
          register={register}
          error={
            errors.lastName
          }
          autoComplete="family-name"
        />

        <div
          className="
            md:col-span-2
          "
        >
          <FormField
            label="Professional Title"
            name="jobTitle"
            placeholder="Frontend Developer"
            register={register}
            error={
              errors.jobTitle
            }
            autoComplete="organization-title"
            helperText="Use the title you want employers to associate with your profile."
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="alex@example.com"
          register={register}
          error={
            errors.email
          }
          autoComplete="email"
        />

        {/* =================================
            Phone
        ================================= */}

        <div
          className="
            flex
            min-w-0
            flex-col
          "
        >
          <label
            htmlFor="field-phone"
            className="
              flex
              h-4
              shrink-0
              items-center
              gap-1

              text-xs
              font-black
              leading-4

              text-zinc-700
              dark:text-zinc-300
            "
          >
            Phone
          </label>

          <div
            className={`
              mt-2

              flex
              h-12
              w-full
              min-w-0
              shrink-0
              items-stretch

              overflow-hidden

              rounded-xl

              border

              bg-white
              dark:bg-zinc-950

              transition-all

              ${
                errors.phone
                  ? `
                      border-rose-400

                      focus-within:border-rose-500
                      focus-within:ring-4
                      focus-within:ring-rose-500/10

                      dark:border-rose-700
                    `
                  : `
                      border-stone-200
                      dark:border-zinc-800

                      hover:border-stone-300
                      dark:hover:border-zinc-700

                      focus-within:border-violet-500
                      focus-within:ring-4
                      focus-within:ring-violet-500/10
                    `
              }
            `}
          >
            <div
              className="
                flex
                shrink-0
                items-center

                border-r
                border-stone-200
                dark:border-zinc-800

                bg-stone-50
                dark:bg-zinc-900

                px-3.5

                text-sm
                font-bold

                text-zinc-700
                dark:text-zinc-300
              "
              aria-hidden="true"
            >
              +91
            </div>

            <input
              id="field-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={
                watchedPhone
              }
              maxLength={10}
              aria-invalid={
                Boolean(
                  errors.phone
                )
              }
              aria-describedby={
                errors.phone
                  ? "field-phone-error"
                  : undefined
              }
              onChange={
                handlePhoneChange
              }
              onPaste={
                handlePhonePaste
              }
              className="
                min-w-0
                flex-1

                border-0

                bg-transparent

                px-3.5

                text-sm

                text-zinc-950
                dark:text-white

                outline-none

                placeholder:text-zinc-400
                dark:placeholder:text-zinc-600
              "
            />
          </div>

          {errors.phone && (
            <p
              id="field-phone-error"
              role="alert"
              className="
                mt-1.5

                text-xs
                font-semibold

                text-rose-600
                dark:text-rose-400
              "
            >
              {
                errors.phone
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
            autoComplete="address-level2"
          />
        </div>

        <div
          className="
            md:col-span-2
          "
        >
          <FormField
            label="Portfolio / Website"
            name="website"
            type="url"
            placeholder="https://yourportfolio.com"
            register={register}
            error={
              errors.website
            }
            autoComplete="url"
          />
        </div>

        <FormField
          label="LinkedIn"
          name="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/username"
          register={register}
          error={
            errors.linkedin
          }
        />

        <FormField
          label="GitHub"
          name="github"
          type="url"
          placeholder="https://github.com/username"
          register={register}
          error={
            errors.github
          }
        />
      </div>

      {/* =====================================
          Autosave Note
      ===================================== */}

      <div
        className="
          mt-8

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
          Your changes are saved
          automatically while you
          work.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;