import {
  Check,
  LayoutTemplate,
  Search,
  X,
} from "lucide-react";

import {
  createPortal,
} from "react-dom";

import {
  getAvailableTemplates,
  getTemplateOption,
  getTemplatesByCategory,
  ResumeTemplateRenderer,
  templateCategories,
} from "./templateRegistry";

import ResumeCustomizationWrapper from "./ResumeCustomizationWrapper";

import useResumeStore from "../../../stores/resumeStore";

import templatePreviewResume from "../../../data/templatePreviewResume";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ========================================
   Template Design Preview

   Important:
   This intentionally previews the design
   at a useful readable scale instead of
   shrinking an entire desktop-sized A4
   canvas into an unreadable thumbnail.
======================================== */

const TemplatePreview = ({
  template,
  active = false,
}) => {
  const previewResume =
    useMemo(
      () => ({
        ...templatePreviewResume,

        templateId:
          template.id,
      }),
      [
        template.id,
      ]
    );

  return (
    <div
      className={`
        relative

        h-[390px]

        overflow-hidden

        rounded-xl

        border

        bg-[#ebe8e1]

        ${
          active
            ? `
                border-violet-500

                ring-2
                ring-violet-500/15
              `
            : `
                border-stone-200

                dark:border-zinc-700
              `
        }

        dark:bg-zinc-950

        sm:h-[420px]
        lg:h-[450px]
      `}
    >
      {/* =====================================
          Readable Design Preview
      ===================================== */}

      <div
        className="
          absolute
          inset-0

          flex
          items-start
          justify-center

          overflow-hidden

          px-5
          pt-5

          sm:px-6
          sm:pt-6
        "
      >
        <div
          className="
            aspect-[1/1.414]

            w-full
            max-w-[360px]

            origin-top

            overflow-hidden

            rounded-t-md

            bg-white

            shadow-xl
          "
        >
          <ResumeCustomizationWrapper
            resume={
              previewResume
            }
          >
            <ResumeTemplateRenderer
              templateId={
                template.id
              }
              resume={
                previewResume
              }
            />
          </ResumeCustomizationWrapper>
        </div>
      </div>

      {/* =====================================
          Subtle Hover Tint
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          inset-0

          z-10

          bg-violet-500/0

          transition-colors
          duration-300

          group-hover:bg-violet-500/[0.02]
        "
      />

      {/* =====================================
          Selected Badge
      ===================================== */}

      {active && (
        <div
          className="
            absolute
            right-4
            top-4
            z-20

            flex
            h-8
            w-8
            items-center
            justify-center

            rounded-full

            bg-violet-600

            text-white

            shadow-lg
          "
        >
          <Check
            size={15}
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

/* ========================================
   Template Modal
======================================== */

const TemplateModal = ({
  open,
  onClose,
  activeTemplateId,
  onSelectTemplate,
}) => {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const searchInputRef =
    useRef(null);

  const dialogRef =
    useRef(null);

  const previouslyFocusedRef =
    useRef(null);

  const availableTemplates =
    useMemo(
      () =>
        getAvailableTemplates(),
      []
    );

  const categories =
    useMemo(
      () => [
        "All",
        ...templateCategories,
      ],
      []
    );

  /* ========================================
     Focus Restoration
  ======================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedRef.current =
      document.activeElement;

    return () => {
      previouslyFocusedRef.current
        ?.focus?.();
    };
  }, [open]);

  /* ========================================
     Reset Modal State
  ======================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setSearchQuery("");
          setActiveCategory("All");

          searchInputRef
            .current
            ?.focus();
        },
        50
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [open]);

  /* ========================================
     Escape Handling
  ======================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          event.preventDefault();
          onClose();
          return;
        }

        if (
          event.key !== "Tab"
        ) {
          return;
        }

        const dialog =
          dialogRef.current;

        if (!dialog) {
          return;
        }

        const focusableElements =
          Array.from(
            dialog.querySelectorAll(
              [
                "button:not([disabled])",
                "input:not([disabled])",
                "select:not([disabled])",
                "textarea:not([disabled])",
                "[href]",
                '[tabindex]:not([tabindex="-1"])',
              ].join(",")
            )
          ).filter(
            (element) =>
              !element.hasAttribute(
                "hidden"
              ) &&
              element.getAttribute(
                "aria-hidden"
              ) !== "true"
          );

        if (
          focusableElements.length === 0
        ) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
            focusableElements.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement ===
            firstElement
        ) {
          event.preventDefault();
          lastElement.focus();
          return;
        }

        if (
          !event.shiftKey &&
          document.activeElement ===
            lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    onClose,
  ]);

  /* ========================================
     Lock Background Scroll
  ======================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    const previousPaddingRight =
      document.body.style
        .paddingRight;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement
        .clientWidth;

    document.body.style.overflow =
      "hidden";

    if (
      scrollbarWidth > 0
    ) {
      document.body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.body.style.paddingRight =
        previousPaddingRight;
    };
  }, [open]);

  /* ========================================
     Filter Templates
  ======================================== */

  const filteredTemplates =
    useMemo(
      () => {
        const categoryTemplates =
          activeCategory ===
          "All"
            ? availableTemplates
            : getTemplatesByCategory(
                activeCategory
              ).filter(
                (template) =>
                  template.available
              );

        const query =
          searchQuery
            .trim()
            .toLowerCase();

        if (!query) {
          return categoryTemplates;
        }

        return categoryTemplates.filter(
          (template) => {
            const searchableText =
              [
                template.name,
                template.category,
                template.description,
                ...(template.tags ||
                  []),
              ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
              query
            );
          }
        );
      },
      [
        activeCategory,
        availableTemplates,
        searchQuery,
      ]
    );

  if (
    !open ||
    typeof document ===
      "undefined"
  ) {
    return null;
  }

  /* ========================================
     Modal Portal
  ======================================== */

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]

        flex
        items-start
        justify-center

        overflow-y-auto
        overscroll-contain

        bg-zinc-950/60

        p-3

        backdrop-blur-[3px]

        sm:p-5
        lg:p-6
      "
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        id="template-selector-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-modal-title"
        aria-describedby="template-modal-description"
        tabIndex={-1}
        className="
          flex

          max-h-[calc(100dvh-1.5rem)]
          w-full
          max-w-6xl
          flex-col

          overflow-hidden

          rounded-2xl

          border
          border-stone-200

          bg-[#f8f7f4]

          shadow-2xl

          dark:border-zinc-800
          dark:bg-[#111113]

          sm:max-h-[calc(100dvh-2.5rem)]
          sm:rounded-3xl

          lg:max-h-[calc(100dvh-3rem)]
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4

            border-b
            border-stone-200

            bg-white

            px-4
            py-4

            dark:border-zinc-800
            dark:bg-zinc-900

            sm:px-6
            sm:py-5
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
              <LayoutTemplate
                size={18}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="template-modal-title"
                className="
                  text-lg
                  font-black
                  tracking-[-0.025em]

                  text-zinc-950

                  dark:text-white

                  sm:text-xl
                "
              >
                Choose a Template
              </h2>

              <p
                id="template-modal-description"
                className="
                  mt-1

                  max-w-2xl

                  text-xs
                  leading-5

                  text-zinc-500

                  dark:text-zinc-400

                  sm:text-sm
                "
              >
                Compare designs and
                choose the one that
                best fits your resume.
                Your content stays
                unchanged.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close template selector"
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

              transition-colors
              duration-200

              hover:bg-stone-100
              hover:text-zinc-950

              focus:outline-none
              focus:ring-2
              focus:ring-violet-500/30

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-400
              dark:hover:bg-zinc-800
              dark:hover:text-white
            "
          >
            <X
              size={17}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* =====================================
            Search / Count / Categories
        ===================================== */}

        <div
          className="
            shrink-0

            border-b
            border-stone-200

            bg-white

            px-4
            py-4

            dark:border-zinc-800
            dark:bg-zinc-900

            sm:px-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                relative

                w-full

                lg:max-w-md
              "
            >
              <Search
                size={16}
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute
                  left-3.5
                  top-1/2

                  -translate-y-1/2

                  text-zinc-400
                "
              />

              <input
                ref={
                  searchInputRef
                }
                type="search"
                value={
                  searchQuery
                }
                onChange={(
                  event
                ) =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                placeholder="Search templates..."
                aria-label="Search resume templates"
                className="
                  w-full

                  rounded-xl

                  border
                  border-stone-200

                  bg-[#faf9f6]

                  py-2.5
                  pl-10
                  pr-4

                  text-sm

                  text-zinc-900

                  outline-none

                  transition

                  placeholder:text-zinc-400

                  focus:border-violet-400
                  focus:ring-2
                  focus:ring-violet-500/10

                  dark:border-zinc-700
                  dark:bg-zinc-950
                  dark:text-white
                  dark:focus:border-violet-700
                "
              />
            </div>

            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="
                shrink-0

                text-xs
                font-bold

                text-zinc-400

                dark:text-zinc-500
              "
            >
              {
                filteredTemplates.length
              }{" "}
              of{" "}
              {
                availableTemplates.length
              }{" "}
              templates
            </p>
          </div>

          <div
            className="
              mt-4

              flex
              gap-2

              overflow-x-auto

              pb-1

              [scrollbar-width:none]

              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map(
              (category) => {
                const isActive =
                  activeCategory ===
                  category;

                return (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                    aria-pressed={
                      isActive
                    }
                    className={`
                      shrink-0

                      rounded-full

                      border

                      px-3.5
                      py-2

                      text-xs
                      font-black

                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                              border-zinc-950
                              bg-zinc-950
                              text-white

                              dark:border-white
                              dark:bg-white
                              dark:text-zinc-950
                            `
                          : `
                              border-stone-200
                              bg-white
                              text-zinc-500

                              hover:-translate-y-0.5
                              hover:border-violet-300
                              hover:bg-violet-50
                              hover:text-violet-600

                              dark:border-zinc-700
                              dark:bg-zinc-900
                              dark:text-zinc-400
                              dark:hover:border-violet-800
                              dark:hover:bg-violet-950/20
                              dark:hover:text-violet-400
                            `
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* =====================================
            Gallery
        ===================================== */}

        <div
          className="
            min-h-0
            flex-1

            overflow-y-auto
            overscroll-contain

            bg-[#f8f7f4]

            p-4

            [scrollbar-width:thin]

            dark:bg-[#111113]

            sm:p-5
            lg:p-6
          "
        >
          {filteredTemplates.length >
          0 ? (
            <div
              className="
                grid
                items-stretch
                gap-5

                md:grid-cols-2
              "
            >
              {filteredTemplates.map(
                (
                  template
                ) => {
                  const isActive =
                    activeTemplateId ===
                    template.id;

                  return (
                    <button
                      key={
                        template.id
                      }
                      type="button"
                      onClick={() =>
                        onSelectTemplate(
                          template
                        )
                      }
                      aria-pressed={
                        isActive
                      }
                      aria-label={`${template.name} resume template${
                        isActive
                          ? ", selected"
                          : ""
                      }`}
                      className={`
                        group

                        flex
                        h-full
                        min-w-0
                        flex-col

                        overflow-hidden

                        rounded-2xl

                        border

                        bg-white

                        p-3

                        text-left

                        transition-[transform,border-color,box-shadow]
                        duration-300
                        ease-in-out

                        ${
                          isActive
                            ? `
                                border-violet-500

                                ring-2
                                ring-violet-500/15

                                shadow-md
                              `
                            : `
                                border-stone-200

                                hover:-translate-y-0.5
                                hover:border-violet-300
                                hover:shadow-lg

                                dark:border-zinc-800
                                dark:hover:border-violet-800
                              `
                        }

                        dark:bg-zinc-900

                        focus:outline-none
                        focus:ring-2
                        focus:ring-violet-500/30
                      `}
                    >
                      <TemplatePreview
                        template={
                          template
                        }
                        active={
                          isActive
                        }
                      />

                      <div
                        className="
                          flex
                          flex-1
                          flex-col

                          px-1
                          pb-1
                          pt-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.1em]

                                text-violet-600

                                dark:text-violet-400
                              "
                            >
                              {
                                template.category
                              }
                            </p>

                            <h3
                              className="
                                mt-1

                                truncate

                                text-base
                                font-black

                                text-zinc-950

                                dark:text-white
                              "
                            >
                              {
                                template.name
                              }
                            </h3>
                          </div>

                          {isActive && (
                            <span
                              className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-1

                                rounded-full

                                bg-violet-50

                                px-2
                                py-1

                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.06em]

                                text-violet-700

                                dark:bg-violet-950/30
                                dark:text-violet-300
                              "
                            >
                              <Check
                                size={10}
                                strokeWidth={3}
                                aria-hidden="true"
                              />

                              Selected
                            </span>
                          )}
                        </div>

                        <p
                          className="
                            mt-2

                            line-clamp-2

                            text-xs
                            leading-5

                            text-zinc-500

                            dark:text-zinc-400
                          "
                        >
                          {
                            template.description
                          }
                        </p>

                        <div
                          className="
                            mt-3

                            flex
                            flex-wrap
                            gap-1.5
                          "
                        >
                          {(
                            template.tags ||
                            []
                          )
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                tag
                              ) => (
                                <span
                                  key={
                                    tag
                                  }
                                  className="
                                    rounded-full

                                    bg-stone-100

                                    px-2
                                    py-1

                                    text-[9px]
                                    font-bold

                                    text-zinc-500

                                    dark:bg-zinc-800
                                    dark:text-zinc-300
                                  "
                                >
                                  {
                                    tag
                                  }
                                </span>
                              )
                            )}
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-[340px]
                flex-col
                items-center
                justify-center

                px-6

                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-stone-100

                  text-zinc-400

                  dark:bg-zinc-800
                  dark:text-zinc-500
                "
              >
                <Search
                  size={20}
                  aria-hidden="true"
                />
              </div>

              <h3
                className="
                  mt-4

                  text-base
                  font-black

                  text-zinc-950

                  dark:text-white
                "
              >
                No templates found
              </h3>

              <p
                className="
                  mt-1

                  max-w-sm

                  text-sm
                  leading-6

                  text-zinc-500

                  dark:text-zinc-400
                "
              >
                Try another search
                or choose a
                different category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ========================================
   Template Selector
======================================== */

const TemplateSelector = ({
  resume,
}) => {
  const updateResume =
    useResumeStore(
      (state) =>
        state.updateResume
    );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const activeTemplateId =
    resume.templateId ||
    "modern";

  const activeTemplate =
    getTemplateOption(
      activeTemplateId
    );

  const availableTemplateCount =
    getAvailableTemplates().length;

  const handleSelectTemplate = (
    template
  ) => {
    if (
      !template.available
    ) {
      return;
    }

    if (
      template.id !==
      activeTemplateId
    ) {
      updateResume(
        resume.id,
        {
          templateId:
            template.id,
        }
      );
    }

    setModalOpen(false);
  };

  return (
    <>
      <section>
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
            <LayoutTemplate
              size={17}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-sm
                font-black

                text-zinc-950

                dark:text-white
              "
            >
              Resume Template
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
              Change the visual
              design without
              changing your resume
              content.
            </p>

            <p
              className="
                mt-1.5

                text-[10px]
                font-bold
                uppercase
                tracking-[0.08em]

                text-zinc-400

                dark:text-zinc-500
              "
            >
              {
                availableTemplateCount
              }{" "}
              templates available
            </p>
          </div>
        </div>

        <div
          className="
            mt-5

            rounded-2xl

            border
            border-stone-200

            bg-white

            p-4

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.1em]

                text-violet-600

                dark:text-violet-400
              "
            >
              Current Template
            </p>

            <div
              className="
                mt-1

                flex
                items-center
                gap-2
              "
            >
              <h3
                className="
                  truncate

                  text-lg
                  font-black
                  tracking-[-0.02em]

                  text-zinc-950

                  dark:text-white
                "
              >
                {
                  activeTemplate.name
                }
              </h3>

              <span
                className="
                  inline-flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-violet-600

                  text-white
                "
                aria-label="Selected template"
              >
                <Check
                  size={11}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
            </div>

            <p
              className="
                mt-1

                text-[10px]
                font-black
                uppercase
                tracking-[0.08em]

                text-zinc-400

                dark:text-zinc-500
              "
            >
              {
                activeTemplate.category
              }
            </p>

            <p
              className="
                mt-2

                line-clamp-2

                text-xs
                leading-5

                text-zinc-500

                dark:text-zinc-400
              "
            >
              {
                activeTemplate.description
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setModalOpen(
                true
              )
            }
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            aria-controls="template-selector-dialog"
            className="
              mt-4

              inline-flex
              w-full
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-zinc-950

              px-4
              py-2.5

              text-xs
              font-black

              text-white

              transition-colors
              duration-200

              hover:bg-violet-600

              focus:outline-none
              focus:ring-2
              focus:ring-violet-500/30

              dark:bg-white
              dark:text-zinc-950
              dark:hover:bg-violet-400
            "
          >
            <LayoutTemplate
              size={14}
              aria-hidden="true"
            />

            Change Template
          </button>
        </div>
      </section>

      <TemplateModal
        open={
          modalOpen
        }
        onClose={() =>
          setModalOpen(
            false
          )
        }
        activeTemplateId={
          activeTemplateId
        }
        onSelectTemplate={
          handleSelectTemplate
        }
      />
    </>
  );
};

export default TemplateSelector;