import {
  Check,
  Database,
  Download,
  FileText,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sun,
  Upload,
} from "lucide-react";

import {
  useRef,
  useState,
} from "react";

import ConfirmDialog from "../components/ui/ConfirmDialog";

import {
  getTemplatesByCategory,
  templateCategories,
} from "../components/builder/templates/templateRegistry";

import useResumeStore from "../stores/resumeStore";
import useUIStore from "../stores/uiStore";

import {
  downloadResumeBackup,
  parseResumeBackup,
} from "../utils/resumeBackup";

/* ========================================
   Constants
======================================== */

const ACCENT_OPTIONS = [
  {
    value: "#7c3aed",
    label: "Violet",
  },
  {
    value: "#4f46e5",
    label: "Indigo",
  },
  {
    value: "#2563eb",
    label: "Blue",
  },
  {
    value: "#059669",
    label: "Emerald",
  },
  {
    value: "#e11d48",
    label: "Rose",
  },
  {
    value: "#475569",
    label: "Slate",
  },
];

/* ========================================
   Reusable Setting Row
======================================== */

const SettingRow = ({
  title,
  description,
  children,
}) => {
  return (
    <div
      className="
        flex
        flex-col
        gap-4

        border-b
        border-stone-200

        py-6

        last:border-b-0

        dark:border-zinc-800

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div
        className="
          max-w-xl
        "
      >
        <h3
          className="
            text-sm
            font-black

            text-zinc-950
            dark:text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1

            text-sm
            leading-6

            text-zinc-500
            dark:text-zinc-400
          "
        >
          {description}
        </p>
      </div>

      <div
        className="
          shrink-0
        "
      >
        {children}
      </div>
    </div>
  );
};

/* ========================================
   Toggle
======================================== */

const Toggle = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={
        checked
      }
      aria-label={
        label
      }
      onClick={() =>
        onChange(
          !checked
        )
      }
      className={`
        relative

        inline-flex
        h-8
        w-14
        shrink-0
        items-center

        rounded-full

        border

        p-1

        transition-colors

        focus:outline-none
        focus:ring-2
        focus:ring-violet-500
        focus:ring-offset-2

        dark:focus:ring-offset-zinc-900

        ${
          checked
            ? `
                border-violet-600
                bg-violet-600
              `
            : `
                border-stone-300
                bg-stone-100

                dark:border-zinc-700
                dark:bg-zinc-800
              `
        }
      `}
    >
      <span
        aria-hidden="true"
        className={`
          flex
          h-6
          w-6
          items-center
          justify-center

          rounded-full

          bg-white

          shadow-sm

          transition-transform

          ${
            checked
              ? `
                  translate-x-5
                `
              : `
                  translate-x-0
                `
          }
        `}
      >
        {checked && (
          <Check
            size={13}
            strokeWidth={3}
            className="
              text-violet-600
            "
          />
        )}
      </span>
    </button>
  );
};

/* ========================================
   Status Message
======================================== */

const StatusMessage = ({
  status,
}) => {
  if (!status?.message) {
    return null;
  }

  const isSuccess =
    status.type ===
    "success";

  return (
    <div
      role={
        isSuccess
          ? "status"
          : "alert"
      }
      className={`
        mt-4

        rounded-2xl

        border

        px-4
        py-3

        text-sm
        font-semibold
        leading-6

        ${
          isSuccess
            ? `
                border-emerald-200
                bg-emerald-50
                text-emerald-800

                dark:border-emerald-900/50
                dark:bg-emerald-950/20
                dark:text-emerald-300
              `
            : `
                border-rose-200
                bg-rose-50
                text-rose-700

                dark:border-rose-900/50
                dark:bg-rose-950/20
                dark:text-rose-300
              `
        }
      `}
    >
      {status.message}
    </div>
  );
};

/* ========================================
   Settings Page
======================================== */

const Settings = () => {
  const fileInputRef =
    useRef(null);

  const [
    showResetDialog,
    setShowResetDialog,
  ] = useState(false);

  const [
    showRestoreDialog,
    setShowRestoreDialog,
  ] = useState(false);

  const [
    pendingBackup,
    setPendingBackup,
  ] = useState(null);

  const [
    status,
    setStatus,
  ] = useState(null);

  const {
    theme,
    reducedMotion,
    defaultTemplate,
    defaultAccentColor,

    setTheme,
    setReducedMotion,
    setDefaultTemplate,
    setDefaultAccentColor,

    resetSettings,
  } = useUIStore();

  const resumes =
    useResumeStore(
      (state) =>
        state.resumes
    );

  const activeResumeId =
    useResumeStore(
      (state) =>
        state.activeResumeId
    );

  const restoreBackup =
    useResumeStore(
      (state) =>
        state.restoreBackup
    );

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      description:
        "Bright, focused workspace.",
      icon: Sun,
    },

    {
      id: "dark",
      label: "Dark",
      description:
        "Comfortable low-light workspace.",
      icon: Moon,
    },

    {
      id: "system",
      label: "System",
      description:
        "Follow your device preference.",
      icon: Monitor,
    },
  ];

  /* ========================================
     Export Backup
  ======================================== */

  const handleExportBackup =
    () => {
      setStatus(null);

      try {
        downloadResumeBackup({
          resumes,
          activeResumeId,

          theme,
          reducedMotion,
          defaultTemplate,
          defaultAccentColor,
        });

        setStatus({
          type: "success",
          message:
            "Backup downloaded successfully.",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error?.message ||
            "We could not export your backup.",
        });
      }
    };

  /* ========================================
     Restore Backup File
  ======================================== */

  const handleBackupFileChange =
    async (event) => {
      const file =
        event.target
          .files?.[0];

      event.target.value =
        "";

      if (!file) {
        return;
      }

      setStatus(null);

      const validFile =
        file.type ===
          "application/json" ||
        file.name
          .toLowerCase()
          .endsWith(
            ".json"
          );

      if (!validFile) {
        setStatus({
          type: "error",
          message:
            "Choose a ResumeCraft JSON backup file.",
        });

        return;
      }

      try {
        const rawText =
          await file.text();

        const parsedBackup =
          parseResumeBackup(
            rawText
          );

        setPendingBackup(
          parsedBackup
        );

        setShowRestoreDialog(
          true
        );
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error?.message ||
            "We could not read this backup.",
        });
      }
    };

  /* ========================================
     Confirm Restore
  ======================================== */

  const handleConfirmRestore =
    () => {
      if (!pendingBackup) {
        setShowRestoreDialog(
          false
        );

        return;
      }

      restoreBackup(
        pendingBackup
      );

      /*
       * Version 2 backups can
       * contain workspace
       * preferences.
       *
       * Older backups return
       * preferences as null, so
       * the user's current
       * settings remain unchanged.
       */
      const preferences =
        pendingBackup.preferences;

      if (preferences) {
        if (
          preferences.theme !==
          undefined
        ) {
          setTheme(
            preferences.theme
          );
        }

        if (
          preferences.reducedMotion !==
          undefined
        ) {
          setReducedMotion(
            preferences.reducedMotion
          );
        }

        if (
          preferences.defaultTemplate !==
          undefined
        ) {
          setDefaultTemplate(
            preferences.defaultTemplate
          );
        }

        if (
          preferences.defaultAccentColor !==
          undefined
        ) {
          setDefaultAccentColor(
            preferences.defaultAccentColor
          );
        }
      }

      const restoredCount =
        pendingBackup
          .resumes.length;

      setPendingBackup(
        null
      );

      setShowRestoreDialog(
        false
      );

      setStatus({
        type: "success",
        message:
          `${restoredCount} ${
            restoredCount === 1
              ? "resume"
              : "resumes"
          } restored successfully.`,
      });
    };

  return (
    <section
      className="
        container-shell

        py-10

        sm:py-12
        lg:py-16
      "
    >
      {/* =====================================
          Header
      ===================================== */}

      <div
        className="
          max-w-2xl
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-2

            text-xs
            font-black
            uppercase
            tracking-[0.16em]

            text-violet-600
            dark:text-violet-400
          "
        >
          <Settings2
            size={14}
            aria-hidden="true"
          />

          Workspace Settings
        </div>

        <h1
          className="
            mt-4

            text-4xl
            font-black
            tracking-[-0.04em]

            text-zinc-950
            dark:text-white

            sm:text-5xl
          "
        >
          Make ResumeCraft
          work your way.
        </h1>

        <p
          className="
            mt-4

            max-w-xl

            text-base
            leading-7

            text-zinc-600
            dark:text-zinc-400
          "
        >
          Customize your
          workspace, resume
          defaults, and local
          data preferences.
        </p>
      </div>

      {/* =====================================
          Appearance
      ===================================== */}

      <div
        className="
          mt-12

          overflow-hidden

          rounded-3xl

          border
          border-stone-200

          bg-white

          shadow-sm

          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >
        <div
          className="
            border-b
            border-stone-200

            px-6
            py-5

            dark:border-zinc-800

            sm:px-8
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
              <Palette
                size={18}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                Appearance
              </h2>

              <p
                className="
                  mt-0.5

                  text-sm

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Personalize your
                ResumeCraft
                workspace.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            px-6
            py-6

            sm:px-8
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
            Theme
          </p>

          <p
            className="
              mt-1

              text-sm

              text-zinc-500
              dark:text-zinc-400
            "
          >
            Choose how the
            application interface
            looks.
          </p>

          <div
            className="
              mt-5

              grid
              gap-3

              md:grid-cols-3
            "
          >
            {themeOptions.map(
              ({
                id,
                label,
                description,
                icon: Icon,
              }) => {
                const selected =
                  theme === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setTheme(
                        id
                      )
                    }
                    aria-pressed={
                      selected
                    }
                    className={`
                      relative

                      flex
                      items-start
                      gap-4

                      rounded-2xl

                      border

                      p-4

                      text-left

                      transition-all

                      ${
                        selected
                          ? `
                              border-violet-500

                              bg-violet-50

                              ring-1
                              ring-violet-500

                              dark:bg-violet-950/20
                            `
                          : `
                              border-stone-200

                              bg-[#faf9f6]

                              hover:border-stone-300

                              dark:border-zinc-700
                              dark:bg-zinc-950
                              dark:hover:border-zinc-600
                            `
                      }
                    `}
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
                          selected
                            ? `
                                bg-violet-600

                                text-white
                              `
                            : `
                                bg-white

                                text-zinc-600

                                dark:bg-zinc-900
                                dark:text-zinc-300
                              `
                        }
                      `}
                    >
                      <Icon
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
                        {label}
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
                        {
                          description
                        }
                      </p>
                    </div>

                    {selected && (
                      <span
                        className="
                          absolute
                          right-3
                          top-3

                          flex
                          h-5
                          w-5
                          items-center
                          justify-center

                          rounded-full

                          bg-violet-600

                          text-white
                        "
                      >
                        <Check
                          size={12}
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>

          <SettingRow
            title="Reduced motion"
            description="Reduce interface animations and movement throughout the application."
          >
            <Toggle
              checked={
                reducedMotion
              }
              onChange={
                setReducedMotion
              }
              label="Toggle reduced motion"
            />
          </SettingRow>
        </div>
      </div>

      {/* =====================================
          Resume Defaults
      ===================================== */}

      <div
        className="
          mt-6

          overflow-hidden

          rounded-3xl

          border
          border-stone-200

          bg-white

          shadow-sm

          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >
        <div
          className="
            border-b
            border-stone-200

            px-6
            py-5

            dark:border-zinc-800

            sm:px-8
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

                bg-emerald-50

                text-emerald-700

                dark:bg-emerald-950/30
                dark:text-emerald-400
              "
            >
              <FileText
                size={18}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                Resume Defaults
              </h2>

              <p
                className="
                  mt-0.5

                  text-sm

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Choose how future
                resumes start.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            px-6

            sm:px-8
          "
        >
          <SettingRow
            title="Default template"
            description="Choose the template automatically selected for new resumes. Existing resumes are not changed."
          >
            <select
              value={
                defaultTemplate
              }
              onChange={(
                event
              ) =>
                setDefaultTemplate(
                  event
                    .target
                    .value
                )
              }
              className="
                min-w-44

                rounded-xl

                border
                border-stone-200

                bg-[#faf9f6]

                px-4
                py-2.5

                text-sm
                font-semibold

                text-zinc-800

                outline-none

                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-500/20

                dark:border-zinc-700
                dark:bg-zinc-950
                dark:text-zinc-200
              "
            >
              {templateCategories.map(
                (category) => {
                  const categoryTemplates =
                    getTemplatesByCategory(
                      category
                    ).filter(
                      (template) =>
                        template.available
                    );

                  if (
                    categoryTemplates.length ===
                    0
                  ) {
                    return null;
                  }

                  return (
                    <optgroup
                      key={category}
                      label={category}
                    >
                      {categoryTemplates.map(
                        (template) => (
                          <option
                            key={
                              template.id
                            }
                            value={
                              template.id
                            }
                          >
                            {
                              template.name
                            }
                          </option>
                        )
                      )}
                    </optgroup>
                  );
                }
              )}
            </select>
          </SettingRow>

          <SettingRow
            title="Default accent color"
            description="Choose the starting accent for future resumes. Each resume can still be customized independently."
          >
            <div
              className="
                flex
                max-w-[260px]
                flex-wrap
                justify-start
                gap-2

                sm:justify-end
              "
            >
              {ACCENT_OPTIONS.map(
                (option) => {
                  const selected =
                    defaultAccentColor ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        setDefaultAccentColor(
                          option.value
                        )
                      }
                      aria-label={
                        `Use ${option.label} as the default resume accent`
                      }
                      aria-pressed={
                        selected
                      }
                      title={
                        option.label
                      }
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-xl

                        border-2

                        transition-transform

                        hover:scale-105

                        focus:outline-none
                        focus:ring-2
                        focus:ring-violet-500
                        focus:ring-offset-2

                        dark:focus:ring-offset-zinc-900

                        ${
                          selected
                            ? `
                                border-zinc-950
                                dark:border-white
                              `
                            : `
                                border-transparent
                              `
                        }
                      `}
                    >
                      <span
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center

                          rounded-lg

                          shadow-sm
                        "
                        style={{
                          backgroundColor:
                            option.value,
                        }}
                      >
                        {selected && (
                          <Check
                            size={14}
                            className="
                              text-white
                            "
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </SettingRow>
        </div>
      </div>

      {/* =====================================
          Data & Privacy
      ===================================== */}

      <div
        className="
          mt-6

          overflow-hidden

          rounded-3xl

          border
          border-stone-200

          bg-white

          shadow-sm

          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >
        <div
          className="
            border-b
            border-stone-200

            px-6
            py-5

            dark:border-zinc-800

            sm:px-8
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

                bg-stone-100

                text-zinc-700

                dark:bg-zinc-800
                dark:text-zinc-300
              "
            >
              <Database
                size={18}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                Data & Privacy
              </h2>

              <p
                className="
                  mt-0.5

                  text-sm

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Manage local
                ResumeCraft data
                and backups.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            p-6

            sm:p-8
          "
        >
          <input
            ref={
              fileInputRef
            }
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={
              handleBackupFileChange
            }
          />

          <div
            className="
              grid
              gap-4

              sm:grid-cols-2
            "
          >
            <button
              type="button"
              onClick={
                handleExportBackup
              }
              disabled={
                resumes.length ===
                0
              }
              className="
                flex
                items-center
                gap-4

                rounded-2xl

                border
                border-stone-200

                bg-[#faf9f6]

                p-4

                text-left

                transition-colors

                hover:border-violet-300

                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:border-stone-200

                dark:border-zinc-700
                dark:bg-zinc-950
                dark:hover:border-violet-800
                dark:disabled:hover:border-zinc-700
              "
            >
              <Download
                size={18}
                className="
                  shrink-0

                  text-violet-600
                  dark:text-violet-400
                "
                aria-hidden="true"
              />

              <div>
                <p
                  className="
                    text-sm
                    font-black

                    text-zinc-950
                    dark:text-white
                  "
                >
                  Export Backup
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
                  {resumes.length >
                  0
                    ? "Download all resume and preference data as JSON."
                    : "Create a resume before exporting a backup."}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                fileInputRef
                  .current
                  ?.click()
              }
              className="
                flex
                items-center
                gap-4

                rounded-2xl

                border
                border-stone-200

                bg-[#faf9f6]

                p-4

                text-left

                transition-colors

                hover:border-violet-300

                dark:border-zinc-700
                dark:bg-zinc-950
                dark:hover:border-violet-800
              "
            >
              <Upload
                size={18}
                className="
                  shrink-0

                  text-violet-600
                  dark:text-violet-400
                "
                aria-hidden="true"
              />

              <div>
                <p
                  className="
                    text-sm
                    font-black

                    text-zinc-950
                    dark:text-white
                  "
                >
                  Restore Backup
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
                  Restore a saved
                  ResumeCraft JSON
                  backup.
                </p>
              </div>
            </button>
          </div>

          <StatusMessage
            status={status}
          />
        </div>

        <div
          className="
            border-t
            border-stone-200

            px-6
            py-5

            dark:border-zinc-800

            sm:px-8
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <ShieldCheck
              size={17}
              className="
                mt-0.5
                shrink-0

                text-emerald-600
                dark:text-emerald-400
              "
              aria-hidden="true"
            />

            <p
              className="
                text-sm
                leading-6

                text-zinc-500
                dark:text-zinc-400
              "
            >
              ResumeCraft v1.0
              stores resume and
              preference data
              locally in your
              browser. Cloud
              accounts and
              synchronization are
              future full-stack
              features.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          Reset
      ===================================== */}

      <div
        className="
          mt-6

          flex
          flex-col
          gap-4

          rounded-3xl

          border
          border-rose-200

          bg-rose-50/40

          p-6

          dark:border-rose-900/40
          dark:bg-rose-950/10

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-sm
              font-black

              text-zinc-950
              dark:text-white
            "
          >
            Reset preferences
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-zinc-500
              dark:text-zinc-400
            "
          >
            Restore all
            ResumeCraft settings
            to their original
            defaults.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowResetDialog(
              true
            )
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2

            rounded-xl

            border
            border-rose-200

            bg-white

            px-4
            py-2.5

            text-sm
            font-bold

            text-rose-600

            transition-colors

            hover:bg-rose-50

            dark:border-rose-900
            dark:bg-zinc-900
            dark:text-rose-400
            dark:hover:bg-rose-950/20
          "
        >
          <RotateCcw
            size={15}
            aria-hidden="true"
          />

          Reset Settings
        </button>
      </div>

      {/* =====================================
          About
      ===================================== */}

      <div
        className="
          mt-10

          flex
          items-center
          justify-center
          gap-2

          text-xs

          text-zinc-400
          dark:text-zinc-500
        "
      >
        <ShieldCheck
          size={13}
          aria-hidden="true"
        />

        ResumeCraft AI
        v1.0 • Local-first
        workspace
      </div>

      {/* =====================================
          Restore Confirmation
      ===================================== */}

      <ConfirmDialog
        open={
          showRestoreDialog
        }
        title="Restore this backup?"
        description={`This will replace your current resume workspace with ${
          pendingBackup
            ?.resumes
            ?.length ?? 0
        } ${
          pendingBackup
            ?.resumes
            ?.length === 1
            ? "resume"
            : "resumes"
        } from the selected backup. If this backup contains workspace preferences, those settings will also be restored. This action cannot be undone unless you export your current data first.`}
        confirmLabel="Restore Backup"
        cancelLabel="Cancel"
        onCancel={() => {
          setShowRestoreDialog(
            false
          );

          setPendingBackup(
            null
          );
        }}
        onConfirm={
          handleConfirmRestore
        }
      />

      {/* =====================================
          Reset Confirmation
      ===================================== */}

      <ConfirmDialog
        open={
          showResetDialog
        }
        title="Reset all settings?"
        description="This will restore your ResumeCraft preferences to their default values. Your resumes will not be deleted."
        confirmLabel="Reset Settings"
        onCancel={() =>
          setShowResetDialog(
            false
          )
        }
        onConfirm={() => {
          resetSettings();

          setShowResetDialog(
            false
          );

          setStatus({
            type: "success",
            message:
              "Settings reset to defaults.",
          });
        }}
      />
    </section>
  );
};

export default Settings;