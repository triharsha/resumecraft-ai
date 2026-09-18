import {
  Languages,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  createEmptyLanguage,
} from "../../../utils/resume";

import ConfirmDialog from "../../ui/ConfirmDialog";
import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Proficiency Options
======================================== */

const proficiencyOptions = [
  {
    value: "native-bilingual",
    label: "Native / Bilingual",
  },
  {
    value: "fluent",
    label: "Fluent",
  },
  {
    value: "professional",
    label: "Professional Working",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "basic",
    label: "Basic",
  },
];

/* ========================================
   Proficiency Helper
======================================== */

const getProficiencyLabel = (
  value
) => {
  const option =
    proficiencyOptions.find(
      (item) =>
        item.value === value
    );

  return (
    option?.label ||
    "Intermediate"
  );
};

/* ========================================
   Languages Form
======================================== */

const LanguagesForm = ({
  resume,
}) => {
  const [languageName, setLanguageName] =
    useState("");

  const [
    proficiency,
    setProficiency,
  ] = useState("intermediate");

  const [inputError, setInputError] =
    useState("");

  const [
    languagePendingDelete,
    setLanguagePendingDelete,
  ] = useState(null);

  const languageInputId =
    "new-language";

  const languageInputHelpId =
    "new-language-help";

  const languageInputErrorId =
    "new-language-error";

  const languageInputDescribedBy =
    inputError
      ? `${languageInputHelpId} ${languageInputErrorId}`
      : languageInputHelpId;

  const proficiencyInputId =
    "new-language-proficiency";

  const addSectionItem =
    useResumeStore(
      (state) =>
        state.addSectionItem
    );

  const removeSectionItem =
    useResumeStore(
      (state) =>
        state.removeSectionItem
    );

  const updateSectionItem =
    useResumeStore(
      (state) =>
        state.updateSectionItem
    );

  const visibleLanguages =
    useMemo(() => {
      const languages =
        Array.isArray(
          resume.languages
        )
          ? resume.languages
          : [];

      return languages.filter(
        (language) =>
          language.name
      );
    }, [
      resume.languages,
    ]);

  /* ========================================
     Add Language
  ======================================== */

  const handleAddLanguage = () => {
    const trimmedName =
      languageName.trim();

    setInputError("");

    if (!trimmedName) {
      setInputError(
        "Enter a language before adding it."
      );

      return;
    }

    if (
      trimmedName.length > 80
    ) {
      setInputError(
        "Language name must be 80 characters or less."
      );

      return;
    }

    const duplicateExists =
      visibleLanguages.some(
        (language) =>
          language.name
            .trim()
            .toLowerCase() ===
          trimmedName.toLowerCase()
      );

    if (duplicateExists) {
      setInputError(
        "This language is already added."
      );

      return;
    }

    const newLanguage =
      createEmptyLanguage();

    newLanguage.name =
      trimmedName;

    newLanguage.proficiency =
      proficiency;

    addSectionItem(
      resume.id,
      "languages",
      newLanguage
    );

    setLanguageName("");

    setProficiency(
      "intermediate"
    );
  };

  /* ========================================
     Keyboard Add
  ======================================== */

  const handleKeyDown = (
    event
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    handleAddLanguage();
  };

  /* ========================================
     Delete Language
  ======================================== */

  const handleRemoveLanguage = (
    language
  ) => {
    setLanguagePendingDelete(
      language
    );
  };

  const handleCancelRemoveLanguage =
    () => {
      setLanguagePendingDelete(
        null
      );
    };

  const handleConfirmRemoveLanguage =
    () => {
      if (
        !languagePendingDelete
      ) {
        return;
      }

      removeSectionItem(
        resume.id,
        "languages",
        languagePendingDelete.id
      );

      setInputError("");
      setLanguagePendingDelete(
        null
      );
    };

  /* ========================================
     Update Proficiency
  ======================================== */

  const handleProficiencyChange = (
    language,
    value
  ) => {
    updateSectionItem(
      resume.id,
      "languages",
      language.id,
      {
        proficiency: value,
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
          Communication
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
          Languages
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
          Add languages you can
          communicate in and choose
          the proficiency level that
          best reflects your ability.
        </p>
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
            Keep proficiency realistic
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
            Include languages that
            strengthen your application
            and avoid overstating your
            speaking or writing ability.
          </p>
        </div>
      </div>

      {/* =====================================
          Existing Languages
      ===================================== */}

      {visibleLanguages.length >
      0 ? (
        <div
          className="
            mt-8
            overflow-hidden

            rounded-2xl

            border
            border-stone-200

            bg-white

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          {visibleLanguages.map(
            (
              language,
              index
            ) => (
              <div
                key={
                  language.id
                }
                className={`
                  flex
                  flex-col
                  gap-4

                  px-4
                  py-4

                  sm:flex-row
                  sm:items-center
                  sm:justify-between

                  sm:px-5

                  ${
                    index !==
                    visibleLanguages.length -
                      1
                      ? `
                          border-b
                          border-stone-200

                          dark:border-zinc-800
                        `
                      : ""
                  }
                `}
              >
                {/* =================================
                    Language Name
                ================================= */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3

                    sm:flex-1
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

                      bg-violet-50
                      text-violet-600

                      dark:bg-violet-950/30
                      dark:text-violet-400
                    "
                  >
                    <Languages
                      size={15}
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
                      {
                        language.name
                      }
                    </p>

                    <p
                      className="
                        mt-0.5

                        text-xs

                        text-zinc-500

                        dark:text-zinc-400
                      "
                    >
                      {getProficiencyLabel(
                        language.proficiency
                      )}
                    </p>
                  </div>
                </div>

                {/* =================================
                    Controls
                ================================= */}

                <div
                  className="
                    flex
                    w-full
                    items-center
                    gap-2

                    sm:w-auto
                  "
                >
                  <select
                    value={
                      language.proficiency ||
                      "intermediate"
                    }
                    onChange={(
                      event
                    ) =>
                      handleProficiencyChange(
                        language,
                        event.target
                          .value
                      )
                    }
                    aria-label={`Proficiency for ${language.name}`}
                    className="
                      min-w-0
                      flex-1

                      rounded-xl

                      border
                      border-stone-200

                      bg-white

                      px-3
                      py-2.5

                      text-xs
                      font-semibold

                      text-zinc-700

                      outline-none
                      transition-all

                      focus:border-violet-500
                      focus:ring-4
                      focus:ring-violet-500/10

                      dark:border-zinc-700
                      dark:bg-zinc-950
                      dark:text-zinc-200

                      sm:w-[190px]
                      sm:flex-none
                    "
                  >
                    {proficiencyOptions.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveLanguage(
                        language
                      )
                    }
                    aria-label={`Remove ${language.name}`}
                    title={`Remove ${language.name}`}
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
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
                </div>
              </div>
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
            py-8

            text-center

            dark:border-zinc-700
          "
        >
          <Languages
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
            No languages added
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
            Add a language below and
            select your proficiency
            level.
          </p>
        </div>
      )}

      {/* =====================================
          Quick Add
      ===================================== */}

      <div
        className="
          mt-6

          rounded-2xl

          border
          border-stone-200

          bg-[#faf9f6]

          p-4

          dark:border-zinc-800
          dark:bg-zinc-950

          sm:p-5
        "
      >
        <p
          className="
            text-sm
            font-black

            text-zinc-950

            dark:text-white
          "
        >
          {visibleLanguages.length > 0
            ? "Add another language"
            : "Add a language"}
        </p>

        <p
          id={languageInputHelpId}
          className="
            mt-1

            text-xs
            leading-5

            text-zinc-500

            dark:text-zinc-400
          "
        >
          Type a language, choose
          your level, and press Enter
          or use the Add button.
        </p>

        <div
          className="
            mt-4

            grid
            gap-3

            sm:grid-cols-[minmax(0,1fr)_220px_auto]
            sm:items-end
          "
        >
          {/* =================================
              Language Input
          ================================= */}

          <div>
            <label
              htmlFor={languageInputId}
              className="
                text-xs
                font-black

                text-zinc-700

                dark:text-zinc-300
              "
            >
              Language
            </label>

            <input
              id={languageInputId}
              type="text"
              value={
                languageName
              }
              onChange={(
                event
              ) => {
                setLanguageName(
                  event.target.value
                );

                if (
                  inputError
                ) {
                  setInputError("");
                }
              }}
              onKeyDown={
                handleKeyDown
              }
              placeholder="English"
              maxLength={80}
              aria-invalid={Boolean(inputError)}
              aria-describedby={languageInputDescribedBy}
              className={`
                mt-2
                w-full

                rounded-xl

                border

                bg-white

                px-4
                py-3

                text-sm
                text-zinc-950

                outline-none
                transition-all

                dark:bg-zinc-900
                dark:text-white

                ${
                  inputError
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

                        dark:border-zinc-700
                      `
                }
              `}
            />
          </div>

          {/* =================================
              New Proficiency
          ================================= */}

          <div>
            <label
              htmlFor={proficiencyInputId}
              className="
                text-xs
                font-black

                text-zinc-700

                dark:text-zinc-300
              "
            >
              Proficiency
            </label>

            <select
              id={proficiencyInputId}
              value={
                proficiency
              }
              onChange={(
                event
              ) =>
                setProficiency(
                  event.target.value
                )
              }
              className="
                mt-2
                w-full

                rounded-xl

                border
                border-stone-200

                bg-white

                px-4
                py-3

                text-sm
                text-zinc-950

                outline-none
                transition-all

                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-500/10

                dark:border-zinc-700
                dark:bg-zinc-900
                dark:text-white
              "
            >
              {proficiencyOptions.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* =================================
              Add Button
          ================================= */}

          <button
            type="button"
            onClick={
              handleAddLanguage
            }
            className="
              inline-flex
              h-[46px]
              w-full
              items-center
              justify-center
              gap-2
              whitespace-nowrap

              rounded-xl

              bg-zinc-950

              px-5

              text-sm
              font-black
              text-white

              shadow-sm
              transition-all

              hover:-translate-y-0.5
              hover:shadow-md

              dark:bg-white
              dark:text-zinc-950

              sm:w-auto
            "
          >
            <Plus
              size={15}
              aria-hidden="true"
              className="shrink-0"
            />

            Add
          </button>
        </div>

        {/* =====================================
            Validation
        ===================================== */}

        {inputError && (
          <p
            id={languageInputErrorId}
            role="alert"
            className="
              mt-3

              text-xs
              font-semibold

              text-rose-600

              dark:text-rose-400
            "
          >
            {inputError}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(languagePendingDelete)}
        title="Delete Language?"
        description={
          languagePendingDelete
            ? `"${languagePendingDelete.name}" will be removed from your resume. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Language"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleConfirmRemoveLanguage}
        onCancel={handleCancelRemoveLanguage}
      />

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
          Languages are saved
          automatically as you edit
          them.
        </p>
      </div>
    </div>
  );
};

export default LanguagesForm;