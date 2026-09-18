/* ========================================
   PDF Constants
======================================== */

const A4_WIDTH_MM = 210;

const A4_HEIGHT_MM = 297;

const OVERFLOW_TOLERANCE_PX = 2;

/*
 * Logical document dimensions used by
 * BuilderPreview.
 *
 * The Builder may visually scale this
 * paper on smaller screens, but PDF
 * export must always capture the
 * unscaled document.
 */

const EXPORT_DOCUMENT_WIDTH =
  420;

const EXPORT_DOCUMENT_HEIGHT =
  EXPORT_DOCUMENT_WIDTH *
  1.414;

/*
 * 192 DPI gives us a good balance:
 *
 * - much sharper than scale: 2
 * - still reasonable for browser memory
 * - good quality for text-based resumes
 *
 * A4 width at 192 DPI is roughly
 * 1587 pixels.
 */

const TARGET_DPI = 192;

const MM_PER_INCH = 25.4;

const TARGET_A4_WIDTH_PX =
  Math.round(
    (A4_WIDTH_MM /
      MM_PER_INCH) *
      TARGET_DPI
  );

/* ========================================
   Lazy PDF Dependencies
======================================== */

/*
 * html2canvas-pro and jsPDF are large
 * dependencies.
 *
 * They are needed only when the user
 * actually exports a resume.
 *
 * Loading them dynamically prevents
 * them from becoming part of the
 * initial application bundle.
 */

let pdfLibrariesPromise =
  null;

const loadPdfLibraries =
  async () => {
    if (
      !pdfLibrariesPromise
    ) {
      pdfLibrariesPromise =
        Promise.all([
          import(
            "html2canvas-pro"
          ),

          import(
            "jspdf"
          ),
        ])
          .then(
            ([
              html2canvasModule,
              jsPdfModule,
            ]) => {
              return {
                html2canvas:
                  html2canvasModule.default,

                jsPDF:
                  jsPdfModule.default,
              };
            }
          )
          .catch(
            (error) => {
              /*
               * Reset the cached promise
               * if loading fails so the
               * user can retry later.
               */

              pdfLibrariesPromise =
                null;

              throw error;
            }
          );
    }

    return pdfLibrariesPromise;
  };

/* ========================================
   Safe Filename
======================================== */

const sanitizeFilenamePart = (
  value = ""
) => {
  return String(value)
    .trim()
    .replace(
      /[^a-zA-Z0-9-_ ]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    );
};

/* ========================================
   Resume Person Name
======================================== */

const getResumePersonName = (
  resume
) => {
  const firstName =
    sanitizeFilenamePart(
      resume?.personalInfo
        ?.firstName
    );

  const lastName =
    sanitizeFilenamePart(
      resume?.personalInfo
        ?.lastName
    );

  return [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");
};

/* ========================================
   Resume Filename
======================================== */

export const getResumePdfFilename =
  (resume) => {
    const firstName =
      sanitizeFilenamePart(
        resume?.personalInfo
          ?.firstName
      );

    const lastName =
      sanitizeFilenamePart(
        resume?.personalInfo
          ?.lastName
      );

    const fullName = [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join("-");

    if (fullName) {
      return `${fullName}-Resume.pdf`;
    }

    const title =
      sanitizeFilenamePart(
        resume?.title
      );

    if (title) {
      return `${title}.pdf`;
    }

    return "Resume.pdf";
  };

/* ========================================
   Wait For Fonts
======================================== */

const waitForFonts =
  async () => {
    if (
      document.fonts?.ready
    ) {
      await document.fonts.ready;
    }
  };

/* ========================================
   Wait For Browser Layout
======================================== */

const waitForPaint =
  () =>
    new Promise(
      (resolve) => {
        requestAnimationFrame(
          () => {
            requestAnimationFrame(
              resolve
            );
          }
        );
      }
    );

/* ========================================
   Export Scale
======================================== */

const getExportScale = (
  element
) => {
  const width =
    element?.clientWidth ||
    1;

  /*
   * Calculate the scale needed
   * to reach our target A4
   * pixel width.
   */

  const calculatedScale =
    TARGET_A4_WIDTH_PX /
    width;

  /*
   * Prevent excessively small or
   * excessively large captures.
   */

  return Math.min(
    Math.max(
      calculatedScale,
      2
    ),
    4.5
  );
};

/* ========================================
   One-Page Measurement
======================================== */

export const measureResumeOverflow =
  ({
    paperElement,
    contentElement,
  }) => {
    if (
      !paperElement ||
      !contentElement
    ) {
      return false;
    }

    const paperHeight =
      paperElement.clientHeight;

    const contentHeight =
      contentElement.scrollHeight;

    return (
      contentHeight >
      paperHeight +
        OVERFLOW_TOLERANCE_PX
    );
  };

/* ========================================
   Final Export Validation
======================================== */

export const validateResumeForExport =
  async ({
    paperElement,
    contentElement,
  }) => {
    if (!paperElement) {
      throw new Error(
        "Resume preview is not available."
      );
    }

    if (!contentElement) {
      throw new Error(
        "Resume content is not ready."
      );
    }

    /*
     * Font loading can change:
     *
     * - line wrapping
     * - element heights
     * - total resume height
     *
     * Always wait before the final
     * one-page measurement.
     */

    await waitForFonts();

    await waitForPaint();

    const overflowing =
      measureResumeOverflow({
        paperElement,
        contentElement,
      });

    return {
      overflowing,

      paperWidth:
        paperElement.clientWidth,

      paperHeight:
        paperElement.clientHeight,

      contentHeight:
        contentElement.scrollHeight,
    };
  };

/* ========================================
   PDF Metadata
======================================== */

const applyPdfMetadata = (
  pdf,
  resume
) => {
  const personName =
    getResumePersonName(
      resume
    );

  const resumeTitle =
    String(
      resume?.title ||
        ""
    ).trim();

  const title =
    personName
      ? `${personName} Resume`
      : resumeTitle ||
        "Resume";

  pdf.setProperties({
    title,

    subject:
      "Professional Resume",

    author:
      personName ||
      undefined,

    creator:
      "ResumeCraft AI",

    keywords:
      "resume, cv, professional resume",
  });
};

/* ========================================
   Supported Link
======================================== */

const isSupportedPdfLink = (
  href
) => {
  if (!href) {
    return false;
  }

  const normalized =
    href
      .trim()
      .toLowerCase();

  return (
    normalized.startsWith(
      "https://"
    ) ||
    normalized.startsWith(
      "http://"
    ) ||
    normalized.startsWith(
      "mailto:"
    ) ||
    normalized.startsWith(
      "tel:"
    )
  );
};

/* ========================================
   Add Clickable PDF Links
======================================== */

const addClickableLinks = ({
  pdf,
  element,
}) => {
  const links =
    element.querySelectorAll(
      "a[href]"
    );

  if (!links.length) {
    return;
  }

  const paperRect =
    element.getBoundingClientRect();

  if (
    !paperRect.width ||
    !paperRect.height
  ) {
    return;
  }

  const scaleX =
    A4_WIDTH_MM /
    paperRect.width;

  const scaleY =
    A4_HEIGHT_MM /
    paperRect.height;

  links.forEach(
    (link) => {
      const href =
        link.getAttribute(
          "href"
        );

      if (
        !isSupportedPdfLink(
          href
        )
      ) {
        return;
      }

      const rect =
        link.getBoundingClientRect();

      if (
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return;
      }

      /*
       * Convert DOM coordinates
       * into A4 millimetres.
       */

      let x =
        (rect.left -
          paperRect.left) *
        scaleX;

      let y =
        (rect.top -
          paperRect.top) *
        scaleY;

      let width =
        rect.width *
        scaleX;

      let height =
        rect.height *
        scaleY;

      /*
       * Ignore links completely
       * outside the resume paper.
       */

      if (
        x >= A4_WIDTH_MM ||
        y >=
          A4_HEIGHT_MM ||
        x + width <= 0 ||
        y + height <= 0
      ) {
        return;
      }

      /*
       * Clip annotations to the
       * physical page boundaries.
       */

      if (x < 0) {
        width += x;

        x = 0;
      }

      if (y < 0) {
        height += y;

        y = 0;
      }

      width =
        Math.min(
          width,
          A4_WIDTH_MM - x
        );

      height =
        Math.min(
          height,
          A4_HEIGHT_MM - y
        );

      if (
        width <= 0 ||
        height <= 0
      ) {
        return;
      }

      pdf.link(
        x,
        y,
        width,
        height,
        {
          url:
            href,
        }
      );
    }
  );
};

/* ========================================
   Export Resume
======================================== */

export const exportResumeToPdf =
  async ({
    element,
    contentElement,
    resume,
  }) => {
    if (!element) {
      throw new Error(
        "Resume preview is not available."
      );
    }

    /* =====================================
       Final One-Page Validation
    ===================================== */

    const validation =
      await validateResumeForExport({
        paperElement:
          element,

        contentElement,
      });

    if (
      validation.overflowing
    ) {
      const error =
        new Error(
          "Resume exceeds one A4 page."
        );

      error.code =
        "RESUME_OVERFLOW";

      throw error;
    }

    /* =====================================
       Load PDF Dependencies
    ===================================== */

    /*
     * Only now do we download/load
     * html2canvas-pro and jsPDF.
     *
     * Normal ResumeCraft navigation,
     * editing and analysis do not need
     * these libraries.
     */

    const {
      html2canvas,
      jsPDF,
    } =
      await loadPdfLibraries();

    /* =====================================
       Calculate Export Resolution
    ===================================== */

    const exportScale =
      getExportScale(
        element
      );

    /* =====================================
       Capture Resume
    ===================================== */

    const canvas =
      await html2canvas(
        element,
        {
          backgroundColor:
            "#ffffff",

          scale:
            exportScale,

          useCORS:
            true,

          allowTaint:
            false,

          logging:
            false,

          removeContainer:
            true,

          imageTimeout:
            15000,

          /*
           * Always capture the logical
           * A4 document dimensions.
           *
           * Do not use the visually
           * transformed mobile size.
           */

          width:
            EXPORT_DOCUMENT_WIDTH,

          height:
            EXPORT_DOCUMENT_HEIGHT,

          scrollX:
            0,

          scrollY:
            -window.scrollY,

          /*
           * Use a stable export viewport
           * instead of the current mobile
           * browser width.
           *
           * This prevents responsive
           * Builder layout from changing
           * the cloned A4 document.
           */

          windowWidth:
            EXPORT_DOCUMENT_WIDTH,

          windowHeight:
            EXPORT_DOCUMENT_HEIGHT,

          onclone: (
            clonedDocument
          ) => {
            const clonedPaper =
              clonedDocument.querySelector(
                "[data-resume-export]"
              );

            if (
              !clonedPaper
            ) {
              return;
            }

            /*
             * Export-only cleanup.
             *
             * The PDF represents a
             * physical sheet of paper,
             * not the Builder UI card.
             */

            clonedPaper.style.backgroundColor =
              "#ffffff";

            clonedPaper.style.boxShadow =
              "none";

            clonedPaper.style.borderRadius =
              "0";

            clonedPaper.style.border =
              "none";

            clonedPaper.style.outline =
              "none";

            clonedPaper.style.overflow =
              "hidden";

            /*
             * BuilderPreview keeps the
             * resume at its logical
             * 420px A4 width and visually
             * scales it on small screens.
             *
             * html2canvas must capture
             * the unscaled document.
             */

            clonedPaper.style.width =
              `${EXPORT_DOCUMENT_WIDTH}px`;

            clonedPaper.style.height =
              `${EXPORT_DOCUMENT_HEIGHT}px`;

            clonedPaper.style.transform =
              "none";

            clonedPaper.style.transformOrigin =
              "top left";

            /*
             * The live preview paper is
             * absolutely positioned.
             *
             * For the isolated export
             * clone, make it a normal
             * document box at 0,0.
             */

            clonedPaper.style.position =
              "relative";

            clonedPaper.style.left =
              "0";

            clonedPaper.style.top =
              "0";
          },
        }
      );

    /* =====================================
       Validate Canvas
    ===================================== */

    if (
      !canvas.width ||
      !canvas.height
    ) {
      throw new Error(
        "Resume capture produced an empty canvas."
      );
    }

    /* =====================================
       Verify Aspect Ratio
    ===================================== */

    const canvasRatio =
      canvas.width /
      canvas.height;

    const a4Ratio =
      A4_WIDTH_MM /
      A4_HEIGHT_MM;

    const ratioDifference =
      Math.abs(
        canvasRatio -
          a4Ratio
      );

    /*
     * Minor browser rounding is normal.
     * Larger differences should be
     * visible during development.
     */

    if (
      ratioDifference >
      0.02
    ) {
      console.warn(
        "Resume preview differs from the expected A4 aspect ratio.",
        {
          canvasRatio,
          a4Ratio,
        }
      );
    }

    /* =====================================
       Convert Canvas
    ===================================== */

    /*
     * PNG is intentionally used here.
     *
     * Resume documents contain small
     * text and thin typography.
     * JPEG would reduce file size but
     * can introduce visible compression
     * around characters.
     */

    const imageData =
      canvas.toDataURL(
        "image/png"
      );

    /* =====================================
       Create A4 PDF
    ===================================== */

    const pdf =
      new jsPDF({
        orientation:
          "portrait",

        unit:
          "mm",

        format:
          "a4",

        compress:
          true,
      });

    /* =====================================
       Metadata
    ===================================== */

    applyPdfMetadata(
      pdf,
      resume
    );

    /* =====================================
       Resume Image
    ===================================== */

    pdf.addImage(
      imageData,
      "PNG",
      0,
      0,
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
      undefined,
      "FAST"
    );

    /* =====================================
       Clickable Links
    ===================================== */

    addClickableLinks({
      pdf,
      element,
    });

    /* =====================================
       One Page Safety
    ===================================== */

    const pageCount =
      pdf.getNumberOfPages();

    if (
      pageCount !== 1
    ) {
      throw new Error(
        "Resume PDF must contain exactly one page."
      );
    }

    /* =====================================
       Download
    ===================================== */

    const filename =
      getResumePdfFilename(
        resume
      );

    pdf.save(
      filename
    );

    return {
      filename,

      pageCount,

      canvasWidth:
        canvas.width,

      canvasHeight:
        canvas.height,

      exportScale,
    };
  }; 