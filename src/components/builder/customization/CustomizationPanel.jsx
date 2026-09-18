import {
  Check,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Type,
} from "lucide-react";

import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Customization Options
======================================== */

const fontOptions = [
  {
    value: "Inter",
    label: "Inter",
    description: "Clean & modern",
  },

  {
    value: "Arial",
    label: "Arial",
    description: "Simple & universal",
  },

  {
    value: "Georgia",
    label: "Georgia",
    description: "Traditional serif",
  },

  {
    value: "Times New Roman",
    label: "Times",
    description: "Classic resume",
  },
];

const fontSizeOptions = [
  {
    value: "small",
    label: "Compact",
  },

  {
    value: "medium",
    label: "Standard",
  },

  {
    value: "large",
    label: "Large",
  },
];

const spacingOptions = [
  {
    value: "compact",
    label: "Compact",
  },

  {
    value: "normal",
    label: "Normal",
  },

  {
    value: "relaxed",
    label: "Relaxed",
  },
];

const accentColors = [
  {
    value: "#7c3aed",
    label: "Violet",
  },

  {
    value: "#2563eb",
    label: "Blue",
  },

  {
    value: "#0891b2",
    label: "Cyan",
  },

  {
    value: "#059669",
    label: "Emerald",
  },

  {
    value: "#dc2626",
    label: "Red",
  },

  {
    value: "#d97706",
    label: "Amber",
  },

  {
    value: "#18181b",
    label: "Ink",
  },
];

/* ========================================
   Defaults
======================================== */

const defaultCustomization = {
  fontFamily: "Inter",
  fontSize: "medium",
  accentColor: "#7c3aed",
  spacing: "normal",
};

/* ========================================
   Customization Panel
======================================== */

const CustomizationPanel = ({
  resume,
}) => {
  const updateResume =
    useResumeStore(
      (state) =>
        state.updateResume
    );

  const customization = {
    ...defaultCustomization,
    ...(resume.customization ||
      {}),
  };

  /* ========================================
     Update Helper
  ======================================== */

  const updateCustomization = (
    key,
    value
  ) => {
    updateResume(
      resume.id,
      {
        customization: {
          ...customization,
          [key]: value,
        },
      }
    );
  };

  /* ========================================
     Reset
  ======================================== */

  const handleReset = () => {
    updateResume(
      resume.id,
      {
        customization: {
          ...defaultCustomization,
        },
      }
    );
  };

  return (
    <section>
      {/* =====================================
          Header
      ===================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
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
            <SlidersHorizontal
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
              Customize Resume
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
              Fine-tune the visual
              style without
              changing your resume
              content.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            handleReset
          }
          title="Reset customization"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center

            rounded-xl

            border
            border-stone-200

            bg-white

            text-zinc-500

            transition

            hover:border-violet-300
            hover:text-violet-600

            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-zinc-400
            dark:hover:border-violet-800
            dark:hover:text-violet-400
          "
        >
          <RotateCcw
            size={14}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* =====================================
          Font Family
      ===================================== */}

      <div className="mt-6">
        <div
          className="
            mb-3
            flex
            items-center
            gap-2
          "
        >
          <Type
            size={14}
            className="
              text-zinc-400
            "
            aria-hidden="true"
          />

          <p
            className="
              text-xs
              font-black

              text-zinc-800

              dark:text-zinc-200
            "
          >
            Font Family
          </p>
        </div>

        <div
          className="
            grid
            gap-2

            sm:grid-cols-2
          "
        >
          {fontOptions.map(
            (font) => {
              const isActive =
                customization.fontFamily ===
                font.value;

              return (
                <button
                  key={
                    font.value
                  }
                  type="button"
                  onClick={() =>
                    updateCustomization(
                      "fontFamily",
                      font.value
                    )
                  }
                  className={`
                    flex
                    items-center
                    justify-between
                    gap-3

                    rounded-xl

                    border

                    px-3
                    py-2.5

                    text-left

                    transition

                    ${
                      isActive
                        ? `
                            border-violet-500
                            bg-violet-50/60

                            dark:bg-violet-950/20
                          `
                        : `
                            border-stone-200
                            bg-white

                            hover:border-violet-300

                            dark:border-zinc-800
                            dark:bg-zinc-900
                            dark:hover:border-violet-800
                          `
                    }
                  `}
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-xs
                        font-black

                        text-zinc-900

                        dark:text-white
                      "
                      style={{
                        fontFamily:
                          font.value,
                      }}
                    >
                      {
                        font.label
                      }
                    </p>

                    <p
                      className="
                        mt-0.5

                        text-[10px]

                        text-zinc-400
                      "
                    >
                      {
                        font.description
                      }
                    </p>
                  </div>

                  {isActive && (
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="
                        shrink-0
                        text-violet-600

                        dark:text-violet-400
                      "
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================
          Font Size
      ===================================== */}

      <div className="mt-6">
        <p
          className="
            mb-3
            text-xs
            font-black

            text-zinc-800

            dark:text-zinc-200
          "
        >
          Font Size
        </p>

        <div
          className="
            grid
            grid-cols-3
            gap-2
          "
        >
          {fontSizeOptions.map(
            (option) => {
              const isActive =
                customization.fontSize ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    updateCustomization(
                      "fontSize",
                      option.value
                    )
                  }
                  className={`
                    rounded-xl

                    border

                    px-2
                    py-2.5

                    text-[10px]
                    font-black

                    transition

                    ${
                      isActive
                        ? `
                            border-violet-500
                            bg-violet-50
                            text-violet-700

                            dark:bg-violet-950/20
                            dark:text-violet-300
                          `
                        : `
                            border-stone-200
                            bg-white
                            text-zinc-500

                            hover:border-violet-300

                            dark:border-zinc-800
                            dark:bg-zinc-900
                            dark:text-zinc-400
                            dark:hover:border-violet-800
                          `
                    }
                  `}
                >
                  {
                    option.label
                  }
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================
          Spacing
      ===================================== */}

      <div className="mt-6">
        <p
          className="
            mb-3
            text-xs
            font-black

            text-zinc-800

            dark:text-zinc-200
          "
        >
          Section Spacing
        </p>

        <div
          className="
            grid
            grid-cols-3
            gap-2
          "
        >
          {spacingOptions.map(
            (option) => {
              const isActive =
                customization.spacing ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  onClick={() =>
                    updateCustomization(
                      "spacing",
                      option.value
                    )
                  }
                  className={`
                    rounded-xl

                    border

                    px-2
                    py-2.5

                    text-[10px]
                    font-black

                    transition

                    ${
                      isActive
                        ? `
                            border-violet-500
                            bg-violet-50
                            text-violet-700

                            dark:bg-violet-950/20
                            dark:text-violet-300
                          `
                        : `
                            border-stone-200
                            bg-white
                            text-zinc-500

                            hover:border-violet-300

                            dark:border-zinc-800
                            dark:bg-zinc-900
                            dark:text-zinc-400
                            dark:hover:border-violet-800
                          `
                    }
                  `}
                >
                  {
                    option.label
                  }
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================
          Accent Color
      ===================================== */}

      <div className="mt-6">
        <div
          className="
            mb-3
            flex
            items-center
            gap-2
          "
        >
          <Palette
            size={14}
            className="
              text-zinc-400
            "
            aria-hidden="true"
          />

          <p
            className="
              text-xs
              font-black

              text-zinc-800

              dark:text-zinc-200
            "
          >
            Accent Color
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-2.5
          "
        >
          {accentColors.map(
            (color) => {
              const isActive =
                customization.accentColor ===
                color.value;

              return (
                <button
                  key={
                    color.value
                  }
                  type="button"
                  onClick={() =>
                    updateCustomization(
                      "accentColor",
                      color.value
                    )
                  }
                  aria-label={`Use ${color.label} accent`}
                  title={
                    color.label
                  }
                  className={`
                    relative

                    flex
                    h-8
                    w-8
                    items-center
                    justify-center

                    rounded-full

                    border-2

                    transition

                    hover:scale-110

                    ${
                      isActive
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
                      h-6
                      w-6
                      items-center
                      justify-center

                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        color.value,
                    }}
                  >
                    {isActive && (
                      <Check
                        size={12}
                        strokeWidth={3}
                        className="text-white"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div
          className="
            mt-3

            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-3
              w-3

              rounded-full
            "
            style={{
              backgroundColor:
                customization.accentColor,
            }}
          />

          <p
            className="
              text-[10px]
              font-semibold

              text-zinc-400
            "
          >
            {
              customization.accentColor
            }
          </p>
        </div>
      </div>

      {/* =====================================
          Autosave Message
      ===================================== */}

      <div
        className="
          mt-6

          rounded-xl

          border
          border-stone-200

          bg-stone-50

          px-3
          py-2.5

          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >
        <p
          className="
            text-[10px]
            leading-4

            text-zinc-500

            dark:text-zinc-400
          "
        >
          Customization changes
          are saved automatically
          with this resume.
        </p>
      </div>
    </section>
  );
};

export default CustomizationPanel;