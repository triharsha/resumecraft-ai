import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  LoaderCircle,
  SlidersHorizontal,
} from "lucide-react";

import {
  getTemplateOption,
  ResumeTemplateRenderer,
} from "./templates/templateRegistry";

import TemplateSelector from "./templates/TemplateSelector";

import CustomizationPanel from "./customization/CustomizationPanel";

import ResumeCustomizationWrapper from "./templates/ResumeCustomizationWrapper";

import {
  measureResumeOverflow,
} from "../../utils/pdfExporter";

/* ========================================
   Builder Preview
======================================== */

const PREVIEW_DOCUMENT_WIDTH =
  420;

const PREVIEW_DOCUMENT_HEIGHT =
  PREVIEW_DOCUMENT_WIDTH *
  1.414;

const BuilderPreview = ({
  resume,
  onOverflowChange,
  onDownloadPdf,
  isExporting = false,
  exportError = "",
}) => {
  const paperRef =
    useRef(null);

  const contentRef =
    useRef(null);

  const previewViewportRef =
    useRef(null);

  const [
    previewScale,
    setPreviewScale,
  ] = useState(1);

  const [
    exceedsOnePage,
    setExceedsOnePage,
  ] = useState(false);

  const [
    showTemplates,
    setShowTemplates,
  ] = useState(false);

  const [
    showCustomization,
    setShowCustomization,
  ] = useState(false);

  /* ========================================
     Responsive Preview Scale
  ======================================== */

  useEffect(() => {
    const viewport =
      previewViewportRef.current;

    if (!viewport) {
      return;
    }

    let animationFrameId;

    const updatePreviewScale =
      () => {
        cancelAnimationFrame(
          animationFrameId
        );

        animationFrameId =
          requestAnimationFrame(
            () => {
              const availableWidth =
                viewport.clientWidth;

              if (!availableWidth) {
                return;
              }

              const nextScale =
                Math.min(
                  availableWidth /
                    PREVIEW_DOCUMENT_WIDTH,
                  1
                );

              setPreviewScale(
                nextScale
              );
            }
          );
      };

    updatePreviewScale();

    const resizeObserver =
      new ResizeObserver(
        updatePreviewScale
      );

    resizeObserver.observe(
      viewport
    );

    return () => {
      resizeObserver.disconnect();

      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, []);

  /* ========================================
     Active Template
  ======================================== */

  const templateId =
    resume.templateId ||
    "modern";

  const activeTemplate =
    getTemplateOption(
      templateId
    );

  /* ========================================
     One-Page Overflow Detection
  ======================================== */

  useEffect(() => {
    const paper =
      paperRef.current;

    const content =
      contentRef.current;

    if (
      !paper ||
      !content
    ) {
      return;
    }

    let animationFrameId;

    const checkOverflow =
      () => {
        const overflowing =
          measureResumeOverflow({
            paperElement:
              paper,

            contentElement:
              content,
          });

        setExceedsOnePage(
          overflowing
        );

        onOverflowChange?.(
          overflowing
        );
      };

    /*
     * Schedule the measurement after
     * browser layout has completed.
     */

    const scheduleCheck =
      () => {
        cancelAnimationFrame(
          animationFrameId
        );

        animationFrameId =
          requestAnimationFrame(
            checkOverflow
          );
      };

    /*
     * Initial measurement.
     */

    checkOverflow();

    /*
     * Measure again after browser paint.
     */

    scheduleCheck();

    /*
     * Watch both the physical A4 paper
     * and the rendered template content.
     *
     * This covers:
     *
     * - content edits
     * - font changes
     * - spacing changes
     * - template switching
     * - responsive resizing
     */

    const resizeObserver =
      new ResizeObserver(
        scheduleCheck
      );

    resizeObserver.observe(
      paper
    );

    resizeObserver.observe(
      content
    );

    /*
     * Fonts can alter line wrapping
     * after the initial render.
     */

    if (
      document.fonts?.ready
    ) {
      document.fonts.ready.then(
        scheduleCheck
      );
    }

    return () => {
      resizeObserver.disconnect();

      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, [
    resume,
    templateId,
    onOverflowChange,
  ]);

  /* ========================================
     Download PDF
  ======================================== */

  const handleDownloadClick =
    () => {
      if (
        isExporting ||
        exceedsOnePage
      ) {
        return;
      }

      onDownloadPdf?.({
        paperElement:
          paperRef.current,

        contentElement:
          contentRef.current,
      });
    };

  return (
    <aside
      className="
        min-w-0

        border-t
        border-stone-200

        bg-[#efede8]

        p-4

        dark:border-zinc-800
        dark:bg-zinc-950

        sm:p-6

        lg:border-l
        lg:border-t-0
      "
    >
      <div
        className="
          sticky
          top-24
          min-w-0
        "
      >
        {/* =====================================
            Template Control
        ===================================== */}

        <div
          className="
            mb-3

            rounded-2xl

            border
            border-stone-200

            bg-white

            p-3

            shadow-sm

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowTemplates(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              showTemplates
            }
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4

              text-left
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.12em]

                  text-zinc-400

                  dark:text-zinc-500
                "
              >
                Template
              </p>

              <p
                className="
                  mt-1

                  truncate

                  text-sm
                  font-black

                  text-zinc-950

                  dark:text-white
                "
              >
                {
                  activeTemplate.name
                }
              </p>
            </div>

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-stone-200

                text-zinc-500

                dark:border-zinc-700
                dark:text-zinc-400
              "
            >
              {showTemplates ? (
                <ChevronUp
                  size={15}
                  aria-hidden="true"
                />
              ) : (
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                />
              )}
            </div>
          </button>

          {showTemplates && (
            <div
              className="
                mt-4

                border-t
                border-stone-200

                pt-4

                dark:border-zinc-800
              "
            >
              <TemplateSelector
                resume={resume}
              />
            </div>
          )}
        </div>

        {/* =====================================
            Customization Control
        ===================================== */}

        <div
          className="
            mb-4

            rounded-2xl

            border
            border-stone-200

            bg-white

            p-3

            shadow-sm

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowCustomization(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              showCustomization
            }
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4

              text-left
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
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
                  size={14}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]

                    text-zinc-400

                    dark:text-zinc-500
                  "
                >
                  Appearance
                </p>

                <p
                  className="
                    mt-1

                    truncate

                    text-sm
                    font-black

                    text-zinc-950

                    dark:text-white
                  "
                >
                  Customize Resume
                </p>
              </div>
            </div>

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-stone-200

                text-zinc-500

                dark:border-zinc-700
                dark:text-zinc-400
              "
            >
              {showCustomization ? (
                <ChevronUp
                  size={15}
                  aria-hidden="true"
                />
              ) : (
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                />
              )}
            </div>
          </button>

          {showCustomization && (
            <div
              className="
                mt-4

                border-t
                border-stone-200

                pt-4

                dark:border-zinc-800
              "
            >
              <CustomizationPanel
                resume={resume}
              />
            </div>
          )}
        </div>

        {/* =====================================
            Preview Header + Download
        ===================================== */}

        <div
          className="
            mb-4

            flex
            flex-col
            gap-3

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.13em]

                text-zinc-500

                dark:text-zinc-400
              "
            >
              Live Preview
            </p>

            {exceedsOnePage ? (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-full

                  border
                  border-amber-200

                  bg-amber-50

                  px-2.5
                  py-1

                  text-[9px]
                  font-black

                  text-amber-700

                  dark:border-amber-900/50
                  dark:bg-amber-950/20
                  dark:text-amber-300
                "
              >
                <AlertTriangle
                  size={11}
                  aria-hidden="true"
                />

                Exceeds one page
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-full

                  border
                  border-emerald-200

                  bg-emerald-50

                  px-2.5
                  py-1

                  text-[9px]
                  font-black

                  text-emerald-700

                  dark:border-emerald-900/50
                  dark:bg-emerald-950/20
                  dark:text-emerald-300
                "
              >
                <CheckCircle2
                  size={11}
                  aria-hidden="true"
                />

                Fits one page
              </span>
            )}

            <span
              className="
                text-[10px]
                font-bold

                text-zinc-400

                dark:text-zinc-500
              "
            >
              A4
            </span>
          </div>

          <button
            type="button"
            onClick={
              handleDownloadClick
            }
            disabled={
              isExporting ||
              exceedsOnePage
            }
            className="
              inline-flex
              min-h-10
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

              shadow-sm

              transition

              hover:bg-violet-600

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-violet-500
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:bg-white
              dark:text-zinc-950
              dark:hover:bg-violet-400

              sm:w-auto
            "
          >
            {isExporting ? (
              <>
                <LoaderCircle
                  size={14}
                  aria-hidden="true"
                  className="
                    animate-spin
                  "
                />

                Generating PDF...
              </>
            ) : (
              <>
                <Download
                  size={14}
                  aria-hidden="true"
                />

                Download PDF
              </>
            )}
          </button>
        </div>

        {/* =====================================
            Export Error
        ===================================== */}

        {exportError && (
          <div
            role="alert"
            className="
              mb-4

              flex
              items-start
              gap-2.5

              rounded-xl

              border
              border-red-200

              bg-red-50

              px-3
              py-2.5

              dark:border-red-900/50
              dark:bg-red-950/20
            "
          >
            <AlertCircle
              size={14}
              aria-hidden="true"
              className="
                mt-0.5
                shrink-0

                text-red-600

                dark:text-red-400
              "
            />

            <p
              className="
                text-[10px]
                leading-4

                text-red-700

                dark:text-red-300
              "
            >
              {exportError}
            </p>
          </div>
        )}

        {/* =====================================
            Overflow Guidance
        ===================================== */}

        {exceedsOnePage && (
          <div
            className="
              mb-4

              flex
              items-start
              gap-2.5

              rounded-xl

              border
              border-amber-200

              bg-amber-50

              px-3
              py-2.5

              dark:border-amber-900/50
              dark:bg-amber-950/20
            "
          >
            <AlertTriangle
              size={14}
              aria-hidden="true"
              className="
                mt-0.5
                shrink-0

                text-amber-600

                dark:text-amber-400
              "
            />

            <p
              className="
                text-[10px]
                leading-4

                text-amber-800

                dark:text-amber-300
              "
            >
              Your resume exceeds
              one A4 page. PDF export
              is disabled until it
              fits. Try Compact font
              size or Compact
              spacing, shorten less
              relevant descriptions,
              or remove less
              important content.
            </p>
          </div>
        )}

        {/* =====================================
            A4 Resume Paper
        ===================================== */}

        <div
          ref={previewViewportRef}
          className="
            mx-auto
            w-full
            max-w-[420px]
          "
        >
          <div
            className="
              relative
              w-full
              overflow-hidden
            "
            style={{
              height:
                PREVIEW_DOCUMENT_HEIGHT *
                previewScale,
            }}
          >
            <div
              ref={paperRef}
              data-resume-export
              className="
                resume-paper
                absolute
                left-0
                top-0

                overflow-hidden

                rounded-md

                bg-white
              "
              style={{
                width:
                  PREVIEW_DOCUMENT_WIDTH,

                height:
                  PREVIEW_DOCUMENT_HEIGHT,

                transform: `scale(${previewScale})`,

                transformOrigin:
                  "top left",
              }}
            >
              <ResumeCustomizationWrapper
                resume={resume}
              >
                <ResumeTemplateRenderer
                  templateId={
                    templateId
                  }
                  resume={resume}
                  contentRef={
                    contentRef
                  }
                />
              </ResumeCustomizationWrapper>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BuilderPreview;