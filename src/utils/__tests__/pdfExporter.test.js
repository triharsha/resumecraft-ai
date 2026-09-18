import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/* ========================================
   Hoisted Mocks
======================================== */

const mocks =
  vi.hoisted(() => ({
    html2canvas:
      vi.fn(),

    setProperties:
      vi.fn(),

    addImage:
      vi.fn(),

    link:
      vi.fn(),

    getNumberOfPages:
      vi.fn(),

    save:
      vi.fn(),

    constructorCalls: [],
  }));

/* ========================================
   html2canvas Mock
======================================== */

vi.mock(
  "html2canvas-pro",
  () => ({
    default:
      mocks.html2canvas,
  })
);

/* ========================================
   jsPDF Mock

   Production uses:

   new jsPDF(...)

   Therefore the mock must be a real
   constructable class in Vitest 4.
======================================== */

vi.mock(
  "jspdf",
  () => {
    class MockJsPDF {
      constructor(options) {
        mocks.constructorCalls.push(
          options
        );
      }

      setProperties(
        properties
      ) {
        return mocks.setProperties(
          properties
        );
      }

      addImage(
        ...args
      ) {
        return mocks.addImage(
          ...args
        );
      }

      link(
        ...args
      ) {
        return mocks.link(
          ...args
        );
      }

      getNumberOfPages() {
        return mocks.getNumberOfPages();
      }

      save(
        filename
      ) {
        return mocks.save(
          filename
        );
      }
    }

    return {
      default:
        MockJsPDF,
    };
  }
);

/* ========================================
   Production Imports
======================================== */

import {
  exportResumeToPdf,
  getResumePdfFilename,
  measureResumeOverflow,
  validateResumeForExport,
} from "../pdfExporter";

/* ========================================
   Helpers
======================================== */

const createResume = (
  overrides = {}
) => ({
  title:
    "Software Developer Resume",

  personalInfo: {
    firstName: "Alex",
    lastName: "Morgan",
  },

  ...overrides,
});

const setDimension = (
  object,
  property,
  value
) => {
  Object.defineProperty(
    object,
    property,
    {
      configurable: true,
      value,
    }
  );
};

const createPaper = ({
  width = 794,
  height = 1123,
} = {}) => {
  const element =
    document.createElement(
      "div"
    );

  element.setAttribute(
    "data-resume-export",
    ""
  );

  setDimension(
    element,
    "clientWidth",
    width
  );

  setDimension(
    element,
    "clientHeight",
    height
  );

  element.getBoundingClientRect =
    vi.fn(() => ({
      left: 0,
      top: 0,
      width,
      height,
      right: width,
      bottom: height,
    }));

  return element;
};

const createContent = ({
  height = 1000,
} = {}) => {
  const element =
    document.createElement(
      "div"
    );

  setDimension(
    element,
    "scrollHeight",
    height
  );

  return element;
};

const setupPdfMock = ({
  pageCount = 1,
} = {}) => {
  mocks.getNumberOfPages
    .mockReturnValue(
      pageCount
    );
};

const setupCanvas = ({
  width = 1587,
  height = 2245,
} = {}) => {
  const canvas = {
    width,
    height,

    toDataURL:
      vi.fn(() =>
        "data:image/png;base64,test"
      ),
  };

  mocks.html2canvas
    .mockResolvedValue(
      canvas
    );

  return canvas;
};

/* ========================================
   Browser Timing
======================================== */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.constructorCalls.length =
    0;

  vi.stubGlobal(
    "requestAnimationFrame",
    (callback) => {
      callback();

      return 1;
    }
  );

  setupPdfMock();

  setupCanvas();
});

/* ========================================
   Filename
======================================== */

describe(
  "getResumePdfFilename",
  () => {
    it(
      "uses first and last name",
      () => {
        expect(
          getResumePdfFilename(
            createResume()
          )
        ).toBe(
          "Alex-Morgan-Resume.pdf"
        );
      }
    );

    it(
      "supports first name only",
      () => {
        expect(
          getResumePdfFilename(
            createResume({
              personalInfo: {
                firstName:
                  "Alex",

                lastName:
                  "",
              },
            })
          )
        ).toBe(
          "Alex-Resume.pdf"
        );
      }
    );

    it(
      "supports last name only",
      () => {
        expect(
          getResumePdfFilename(
            createResume({
              personalInfo: {
                firstName:
                  "",

                lastName:
                  "Morgan",
              },
            })
          )
        ).toBe(
          "Morgan-Resume.pdf"
        );
      }
    );

    it(
      "falls back to resume title",
      () => {
        expect(
          getResumePdfFilename({
            title:
              "Frontend Developer",

            personalInfo:
              {},
          })
        ).toBe(
          "Frontend-Developer.pdf"
        );
      }
    );

    it(
      "sanitizes unsafe filename characters",
      () => {
        expect(
          getResumePdfFilename({
            title:
              "My Resume: React / Java?",

            personalInfo:
              {},
          })
        ).toBe(
          "My-Resume-React-Java.pdf"
        );
      }
    );

    it(
      "falls back to Resume.pdf",
      () => {
        expect(
          getResumePdfFilename(
            {}
          )
        ).toBe(
          "Resume.pdf"
        );
      }
    );
  }
);

/* ========================================
   Overflow Measurement
======================================== */

describe(
  "measureResumeOverflow",
  () => {
    it(
      "returns false when elements are missing",
      () => {
        expect(
          measureResumeOverflow({
            paperElement:
              null,

            contentElement:
              null,
          })
        ).toBe(false);
      }
    );

    it(
      "returns false when content fits",
      () => {
        expect(
          measureResumeOverflow({
            paperElement:
              createPaper({
                height:
                  1000,
              }),

            contentElement:
              createContent({
                height:
                  1000,
              }),
          })
        ).toBe(false);
      }
    );

    it(
      "allows the two pixel overflow tolerance",
      () => {
        expect(
          measureResumeOverflow({
            paperElement:
              createPaper({
                height:
                  1000,
              }),

            contentElement:
              createContent({
                height:
                  1002,
              }),
          })
        ).toBe(false);
      }
    );

    it(
      "detects content beyond the tolerance",
      () => {
        expect(
          measureResumeOverflow({
            paperElement:
              createPaper({
                height:
                  1000,
              }),

            contentElement:
              createContent({
                height:
                  1003,
              }),
          })
        ).toBe(true);
      }
    );
  }
);

/* ========================================
   Export Validation
======================================== */

describe(
  "validateResumeForExport",
  () => {
    it(
      "rejects missing preview",
      async () => {
        await expect(
          validateResumeForExport({
            paperElement:
              null,

            contentElement:
              createContent(),
          })
        ).rejects.toThrow(
          "Resume preview is not available."
        );
      }
    );

    it(
      "rejects missing content",
      async () => {
        await expect(
          validateResumeForExport({
            paperElement:
              createPaper(),

            contentElement:
              null,
          })
        ).rejects.toThrow(
          "Resume content is not ready."
        );
      }
    );

    it(
      "returns measured dimensions",
      async () => {
        const result =
          await validateResumeForExport({
            paperElement:
              createPaper({
                width:
                  800,

                height:
                  1100,
              }),

            contentElement:
              createContent({
                height:
                  900,
              }),
          });

        expect(
          result
        ).toEqual({
          overflowing:
            false,

          paperWidth:
            800,

          paperHeight:
            1100,

          contentHeight:
            900,
        });
      }
    );
  }
);

/* ========================================
   Full Export
======================================== */

describe(
  "exportResumeToPdf",
  () => {
    it(
      "rejects missing preview element",
      async () => {
        await expect(
          exportResumeToPdf({
            element:
              null,

            contentElement:
              createContent(),

            resume:
              createResume(),
          })
        ).rejects.toThrow(
          "Resume preview is not available."
        );

        expect(
          mocks.html2canvas
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "rejects overflowing resumes before capture",
      async () => {
        const element =
          createPaper({
            height:
              1000,
          });

        const contentElement =
          createContent({
            height:
              1100,
          });

        let caughtError =
          null;

        try {
          await exportResumeToPdf({
            element,

            contentElement,

            resume:
              createResume(),
          });
        } catch (
          error
        ) {
          caughtError =
            error;
        }

        expect(
          caughtError
        ).toBeInstanceOf(
          Error
        );

        expect(
          caughtError.message
        ).toBe(
          "Resume exceeds one A4 page."
        );

        expect(
          caughtError.code
        ).toBe(
          "RESUME_OVERFLOW"
        );

        expect(
          mocks.html2canvas
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "captures the resume with a white export background",
      async () => {
        const element =
          createPaper();

        await exportResumeToPdf({
          element,

          contentElement:
            createContent(),

          resume:
            createResume(),
        });

        expect(
          mocks.html2canvas
        ).toHaveBeenCalledOnce();

        const options =
          mocks
            .html2canvas
            .mock
            .calls[0][1];

        expect(
          options.backgroundColor
        ).toBe(
          "#ffffff"
        );

        expect(
          options.useCORS
        ).toBe(true);

        expect(
          options.allowTaint
        ).toBe(false);

        expect(
          options.logging
        ).toBe(false);

        expect(
          options.removeContainer
        ).toBe(true);
      }
    );

    it(
      "creates a portrait A4 PDF",
      async () => {
        await exportResumeToPdf({
          element:
            createPaper(),

          contentElement:
            createContent(),

          resume:
            createResume(),
        });

        expect(
          mocks.constructorCalls
        ).toHaveLength(1);

        expect(
          mocks.constructorCalls[0]
        ).toEqual({
          orientation:
            "portrait",

          unit:
            "mm",

          format:
            "a4",

          compress:
            true,
        });
      }
    );

    it(
      "adds the resume image as a full A4 page",
      async () => {
        await exportResumeToPdf({
          element:
            createPaper(),

          contentElement:
            createContent(),

          resume:
            createResume(),
        });

        expect(
          mocks.addImage
        ).toHaveBeenCalledWith(
          "data:image/png;base64,test",
          "PNG",
          0,
          0,
          210,
          297,
          undefined,
          "FAST"
        );
      }
    );

    it(
      "adds ResumeCraft PDF metadata",
      async () => {
        await exportResumeToPdf({
          element:
            createPaper(),

          contentElement:
            createContent(),

          resume:
            createResume(),
        });

        expect(
          mocks.setProperties
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            title:
              "Alex Morgan Resume",

            subject:
              "Professional Resume",

            author:
              "Alex Morgan",

            creator:
              "ResumeCraft AI",

            keywords:
              "resume, cv, professional resume",
          })
        );
      }
    );

    it(
      "rejects an empty canvas",
      async () => {
        setupCanvas({
          width:
            0,

          height:
            0,
        });

        await expect(
          exportResumeToPdf({
            element:
              createPaper(),

            contentElement:
              createContent(),

            resume:
              createResume(),
          })
        ).rejects.toThrow(
          "Resume capture produced an empty canvas."
        );

        expect(
          mocks.save
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "requires exactly one PDF page",
      async () => {
        setupPdfMock({
          pageCount:
            2,
        });

        await expect(
          exportResumeToPdf({
            element:
              createPaper(),

            contentElement:
              createContent(),

            resume:
              createResume(),
          })
        ).rejects.toThrow(
          "Resume PDF must contain exactly one page."
        );

        expect(
          mocks.save
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "saves using the generated filename",
      async () => {
        const result =
          await exportResumeToPdf({
            element:
              createPaper(),

            contentElement:
              createContent(),

            resume:
              createResume(),
          });

        expect(
          mocks.save
        ).toHaveBeenCalledWith(
          "Alex-Morgan-Resume.pdf"
        );

        expect(
          result.filename
        ).toBe(
          "Alex-Morgan-Resume.pdf"
        );

        expect(
          result.pageCount
        ).toBe(1);
      }
    );

    it(
      "returns capture information",
      async () => {
        setupCanvas({
          width:
            1587,

          height:
            2245,
        });

        const result =
          await exportResumeToPdf({
            element:
              createPaper(),

            contentElement:
              createContent(),

            resume:
              createResume(),
          });

        expect(
          result.canvasWidth
        ).toBe(1587);

        expect(
          result.canvasHeight
        ).toBe(2245);

        expect(
          result.exportScale
        ).toBeGreaterThanOrEqual(
          2
        );

        expect(
          result.exportScale
        ).toBeLessThanOrEqual(
          4.5
        );
      }
    );
  }
);