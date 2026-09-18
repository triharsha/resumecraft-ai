import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  getDocumentMock,
} = vi.hoisted(() => ({
  getDocumentMock:
    vi.fn(),
}));

vi.mock(
  "pdfjs-dist",
  () => ({
    GlobalWorkerOptions: {
      workerSrc: "",
    },

    getDocument:
      getDocumentMock,
  })
);

vi.mock(
  "pdfjs-dist/build/pdf.worker.min.mjs?url",
  () => ({
    default:
      "mock-pdf-worker.js",
  })
);

import {
  extractTextFromPdf,
  PdfImportError,
} from "../pdfTextExtractor";

/* ========================================
   Helpers
======================================== */

const createPdfFile = ({
  name = "resume.pdf",
  type = "application/pdf",
  size = 1024,
} = {}) => ({
  name,
  type,
  size,

  arrayBuffer:
    vi.fn().mockResolvedValue(
      new ArrayBuffer(8)
    ),
});

const createTextItem = (
  str,
  y
) => ({
  str,

  transform: [
    1,
    0,
    0,
    1,
    0,
    y,
  ],
});

const createPage = (
  items
) => ({
  getTextContent:
    vi.fn().mockResolvedValue({
      items,
    }),

  cleanup:
    vi.fn(),
});

const createPdfDocument = (
  pages
) => ({
  numPages:
    pages.length,

  getPage:
    vi.fn(
      async (
        pageNumber
      ) =>
        pages[
          pageNumber - 1
        ]
    ),

  destroy:
    vi.fn().mockResolvedValue(
      undefined
    ),
});

const mockPdfDocument = (
  pdfDocument
) => {
  getDocumentMock.mockReturnValue({
    promise:
      Promise.resolve(
        pdfDocument
      ),
  });
};

/* ========================================
   Validation
======================================== */

describe("extractTextFromPdf validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects missing file", async () => {
    await expect(
      extractTextFromPdf(null)
    ).rejects.toMatchObject({
      name:
        "PdfImportError",

      code:
        "PDF_FILE_MISSING",
    });
  });

  it("rejects non-PDF files", async () => {
    const file =
      createPdfFile({
        name: "resume.txt",
        type: "text/plain",
      });

    await expect(
      extractTextFromPdf(file)
    ).rejects.toMatchObject({
      code:
        "INVALID_PDF_TYPE",
    });
  });

  it("accepts a .pdf extension even when MIME type is missing", async () => {
    const file =
      createPdfFile({
        name: "resume.pdf",
        type: "",
      });

    const page =
      createPage([
        createTextItem(
          "Alex Morgan",
          100
        ),

        createTextItem(
          "Software Developer",
          90
        ),

        createTextItem(
          "alex@example.com",
          80
        ),
      ]);

    mockPdfDocument(
      createPdfDocument([
        page,
      ])
    );

    await expect(
      extractTextFromPdf(file)
    ).resolves.toBeDefined();
  });

  it("rejects PDFs larger than 10 MB", async () => {
    const file =
      createPdfFile({
        size:
          10 *
            1024 *
            1024 +
          1,
      });

    await expect(
      extractTextFromPdf(file)
    ).rejects.toMatchObject({
      code:
        "PDF_TOO_LARGE",
    });
  });
});

/* ========================================
   Extraction
======================================== */

describe("extractTextFromPdf extraction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts readable text from a PDF", async () => {
    const file =
      createPdfFile();

    const page =
      createPage([
        createTextItem(
          "Alex",
          100
        ),

        createTextItem(
          "Morgan",
          100
        ),

        createTextItem(
          "Software Developer",
          90
        ),

        createTextItem(
          "alex@example.com",
          80
        ),
      ]);

    const pdfDocument =
      createPdfDocument([
        page,
      ]);

    mockPdfDocument(
      pdfDocument
    );

    const result =
      await extractTextFromPdf(
        file
      );

    expect(result.text).toContain(
      "Alex Morgan"
    );

    expect(result.text).toContain(
      "Software Developer"
    );

    expect(
      result.pageCount
    ).toBe(1);

    expect(
      result.fileName
    ).toBe("resume.pdf");

    expect(
      result.fileSize
    ).toBe(1024);
  });

  it("joins multiple pages", async () => {
    const file =
      createPdfFile();

    const pageOne =
      createPage([
        createTextItem(
          "Alex Morgan Software Developer",
          100
        ),
      ]);

    const pageTwo =
      createPage([
        createTextItem(
          "Experience at Example Company",
          100
        ),
      ]);

    mockPdfDocument(
      createPdfDocument([
        pageOne,
        pageTwo,
      ])
    );

    const result =
      await extractTextFromPdf(
        file
      );

    expect(
      result.pages
    ).toHaveLength(2);

    expect(
      result.pageCount
    ).toBe(2);

    expect(result.text).toContain(
      "Alex Morgan Software Developer"
    );

    expect(result.text).toContain(
      "Experience at Example Company"
    );
  });

  it("groups text items on the same line", async () => {
    const file =
      createPdfFile();

    const page =
      createPage([
        createTextItem(
          "Alex",
          100
        ),

        createTextItem(
          "Morgan",
          100
        ),

        createTextItem(
          "Software Developer",
          90
        ),
      ]);

    mockPdfDocument(
      createPdfDocument([
        page,
      ])
    );

    const result =
      await extractTextFromPdf(
        file
      );

    expect(result.text).toContain(
      "Alex Morgan"
    );
  });

  it("cleans up every loaded page", async () => {
    const file =
      createPdfFile();

    const pageOne =
      createPage([
        createTextItem(
          "Alex Morgan Software Developer",
          100
        ),
      ]);

    const pageTwo =
      createPage([
        createTextItem(
          "Experience and Education",
          100
        ),
      ]);

    mockPdfDocument(
      createPdfDocument([
        pageOne,
        pageTwo,
      ])
    );

    await extractTextFromPdf(
      file
    );

    expect(
      pageOne.cleanup
    ).toHaveBeenCalledOnce();

    expect(
      pageTwo.cleanup
    ).toHaveBeenCalledOnce();
  });

  it("destroys the PDF document after extraction", async () => {
    const file =
      createPdfFile();

    const page =
      createPage([
        createTextItem(
          "Alex Morgan Software Developer",
          100
        ),
      ]);

    const pdfDocument =
      createPdfDocument([
        page,
      ]);

    mockPdfDocument(
      pdfDocument
    );

    await extractTextFromPdf(
      file
    );

    expect(
      pdfDocument.destroy
    ).toHaveBeenCalledOnce();
  });
});

/* ========================================
   Failure Handling
======================================== */

describe("extractTextFromPdf failures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects PDFs with no pages", async () => {
    const file =
      createPdfFile();

    const pdfDocument = {
      numPages: 0,

      destroy:
        vi.fn(),
    };

    mockPdfDocument(
      pdfDocument
    );

    await expect(
      extractTextFromPdf(file)
    ).rejects.toMatchObject({
      code:
        "PDF_NO_PAGES",
    });
  });

  it("rejects PDFs with too little readable text", async () => {
    const file =
      createPdfFile();

    const page =
      createPage([
        createTextItem(
          "Tiny",
          100
        ),
      ]);

    mockPdfDocument(
      createPdfDocument([
        page,
      ])
    );

    await expect(
      extractTextFromPdf(file)
    ).rejects.toMatchObject({
      code:
        "PDF_NO_READABLE_TEXT",
    });
  });

  it("converts unexpected PDF.js errors into PdfImportError", async () => {
    const file =
      createPdfFile();

    getDocumentMock.mockReturnValue({
      promise:
        Promise.reject(
          new Error(
            "Corrupted PDF"
          )
        ),
    });

    await expect(
      extractTextFromPdf(file)
    ).rejects.toMatchObject({
      name:
        "PdfImportError",

      code:
        "PDF_READ_FAILED",
    });
  });

  it("exports PdfImportError as an Error subclass", () => {
    const error =
      new PdfImportError(
        "Test",
        "TEST_CODE"
      );

    expect(
      error
    ).toBeInstanceOf(Error);

    expect(
      error.name
    ).toBe(
      "PdfImportError"
    );

    expect(
      error.code
    ).toBe(
      "TEST_CODE"
    );
  });
});