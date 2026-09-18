/* ========================================
   PDF Import Error
======================================== */

export class PdfImportError extends Error {
  constructor(
    message,
    code =
      "PDF_IMPORT_ERROR"
  ) {
    super(message);

    this.name =
      "PdfImportError";

    this.code =
      code;
  }
}

/* ========================================
   Lazy PDF.js Loader
======================================== */

/*
 * PDF.js is one of the largest dependencies
 * in ResumeCraft.
 *
 * It is required only when the user selects
 * a PDF to import, so we load it on demand
 * rather than including it in the normal
 * application bundle.
 */

let pdfJsPromise =
  null;

const loadPdfJs =
  async () => {
    if (!pdfJsPromise) {
      pdfJsPromise =
        Promise.all([
          import(
            "pdfjs-dist"
          ),

          import(
            "pdfjs-dist/build/pdf.worker.min.mjs?url"
          ),
        ])
          .then(
            ([
              pdfJsModule,
              workerModule,
            ]) => {
              const {
                GlobalWorkerOptions,
                getDocument,
              } =
                pdfJsModule;

              const pdfWorkerUrl =
                workerModule.default;

              GlobalWorkerOptions.workerSrc =
                pdfWorkerUrl;

              return {
                getDocument,
              };
            }
          )
          .catch(
            (error) => {
              /*
               * Reset the promise so a
               * temporary chunk/network
               * failure can be retried.
               */

              pdfJsPromise =
                null;

              throw error;
            }
          );
    }

    return pdfJsPromise;
  };

/* ========================================
   Normalize Extracted Text
======================================== */

const normalizePdfText = (
  text
) =>
  String(
    text || ""
  )
    .replace(
      /\u00a0/g,
      " "
    )
    .replace(
      /[ \t]+/g,
      " "
    )
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();

/* ========================================
   Extract Page Text
======================================== */

const extractPageText =
  async (page) => {
    const textContent =
      await page.getTextContent();

    if (
      !Array.isArray(
        textContent.items
      )
    ) {
      return "";
    }

    const lines = [];

    let currentLine = [];

    let previousY =
      null;

    for (
      const item of
      textContent.items
    ) {
      if (
        typeof item?.str !==
        "string"
      ) {
        continue;
      }

      const text =
        item.str.trim();

      if (!text) {
        continue;
      }

      const transform =
        Array.isArray(
          item.transform
        )
          ? item.transform
          : [];

      const currentY =
        Number(
          transform[5]
        );

      /*
       * PDF text items usually contain
       * their vertical position in
       * transform[5].
       *
       * When that position changes
       * enough, treat it as a new line.
       */

      if (
        Number.isFinite(
          currentY
        ) &&
        Number.isFinite(
          previousY
        ) &&
        Math.abs(
          currentY -
            previousY
        ) > 3
      ) {
        if (
          currentLine.length >
          0
        ) {
          lines.push(
            currentLine.join(
              " "
            )
          );

          currentLine =
            [];
        }
      }

      currentLine.push(
        text
      );

      if (
        Number.isFinite(
          currentY
        )
      ) {
        previousY =
          currentY;
      }
    }

    if (
      currentLine.length >
      0
    ) {
      lines.push(
        currentLine.join(
          " "
        )
      );
    }

    return normalizePdfText(
      lines.join(
        "\n"
      )
    );
  };

/* ========================================
   Validate PDF File
======================================== */

const validatePdfFile = (
  file
) => {
  if (
    !file ||
    typeof file !==
      "object"
  ) {
    throw new PdfImportError(
      "No PDF file was selected.",
      "PDF_FILE_MISSING"
    );
  }

  const fileName =
    String(
      file.name ||
        ""
    ).toLowerCase();

  const looksLikePdf =
    file.type ===
      "application/pdf" ||
    fileName.endsWith(
      ".pdf"
    );

  if (!looksLikePdf) {
    throw new PdfImportError(
      "Please select a PDF resume.",
      "INVALID_PDF_TYPE"
    );
  }

  /*
   * 10 MB is more than enough for
   * normal one-to-few-page resumes
   * while protecting the browser
   * from unnecessarily huge files.
   */

  const MAX_FILE_SIZE =
    10 *
    1024 *
    1024;

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    throw new PdfImportError(
      "This PDF is too large. Please choose a resume PDF smaller than 10 MB.",
      "PDF_TOO_LARGE"
    );
  }
};

/* ========================================
   Extract PDF Resume Text
======================================== */

export const extractTextFromPdf =
  async (file) => {
    /*
     * Validate before loading PDF.js.
     *
     * Invalid file selections therefore
     * do not cause the browser to download
     * the large PDF parser bundle.
     */

    validatePdfFile(
      file
    );

    let documentTask;

    let pdfDocument;

    try {
      const {
        getDocument,
      } =
        await loadPdfJs();

      const arrayBuffer =
        await file.arrayBuffer();

      documentTask =
        getDocument({
          data:
            new Uint8Array(
              arrayBuffer
            ),
        });

      pdfDocument =
        await documentTask.promise;

      if (
        !pdfDocument ||
        pdfDocument.numPages <
          1
      ) {
        throw new PdfImportError(
          "This PDF does not contain any readable pages.",
          "PDF_NO_PAGES"
        );
      }

      const pages = [];

      for (
        let pageNumber =
          1;

        pageNumber <=
        pdfDocument.numPages;

        pageNumber +=
          1
      ) {
        const page =
          await pdfDocument.getPage(
            pageNumber
          );

        const pageText =
          await extractPageText(
            page
          );

        pages.push({
          pageNumber,

          text:
            pageText,
        });

        page.cleanup();
      }

      const text =
        normalizePdfText(
          pages
            .map(
              (page) =>
                page.text
            )
            .filter(
              Boolean
            )
            .join(
              "\n\n"
            )
        );

      /*
       * Image-only/scanned resumes
       * often produce almost no
       * extractable text.
       */

      if (
        text.length <
        20
      ) {
        throw new PdfImportError(
          "We could not detect enough readable text in this PDF. Please use a text-based resume PDF.",
          "PDF_NO_READABLE_TEXT"
        );
      }

      return {
        text,

        pages,

        pageCount:
          pdfDocument.numPages,

        fileName:
          file.name,

        fileSize:
          file.size,
      };
    } catch (error) {
      if (
        error instanceof
        PdfImportError
      ) {
        throw error;
      }

      console.error(
        "PDF text extraction failed:",
        error
      );

      throw new PdfImportError(
        "We could not read this PDF. The file may be corrupted or unsupported.",
        "PDF_READ_FAILED"
      );
    } finally {
      try {
        await pdfDocument?.destroy?.();
      } catch {
        /*
         * Cleanup failure should not
         * interrupt the import flow.
         */
      }
    }
  };