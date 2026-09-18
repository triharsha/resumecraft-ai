import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ResumeImportAction from "../ResumeImportAction";

/* ========================================
   Hoisted Mocks
======================================== */

const mocks =
  vi.hoisted(() => ({
    navigate:
      vi.fn(),

    extractTextFromPdf:
      vi.fn(),

    parseResumeText:
      vi.fn(),

    createImportedResumeData:
      vi.fn(),

    addResume:
      vi.fn(),

    updateResume:
      vi.fn(),

    deleteResume:
      vi.fn(),

    resumeState: {
      resumes: [],
    },

    uiState: {
      defaultTemplate:
        "modern",

      defaultAccentColor:
        "#7c3aed",
    },
  }));

/* ========================================
   Router
======================================== */

vi.mock(
  "react-router-dom",
  () => ({
    useNavigate:
      () =>
        mocks.navigate,
  })
);

/* ========================================
   Resume Store
======================================== */

vi.mock(
  "../../../stores/resumeStore",
  () => {
    const useResumeStore =
      (selector) =>
        selector({
          addResume:
            mocks.addResume,

          updateResume:
            mocks.updateResume,

          deleteResume:
            mocks.deleteResume,

          resumes:
            mocks.resumeState
              .resumes,
        });

    useResumeStore.getState =
      () => ({
        addResume:
          mocks.addResume,

        updateResume:
          mocks.updateResume,

        deleteResume:
          mocks.deleteResume,

        resumes:
          mocks.resumeState
            .resumes,
      });

    return {
      default:
        useResumeStore,
    };
  }
);

/* ========================================
   UI Store
======================================== */

vi.mock(
  "../../../stores/uiStore",
  () => ({
    default:
      (selector) =>
        selector(
          mocks.uiState
        ),
  })
);

/* ========================================
   PDF Utilities
======================================== */

vi.mock(
  "../../../utils/resumeImport/pdfTextExtractor",
  () => ({
    extractTextFromPdf:
      mocks.extractTextFromPdf,
  })
);

vi.mock(
  "../../../utils/resumeImport/resumeTextParser",
  () => ({
    parseResumeText:
      mocks.parseResumeText,
  })
);

vi.mock(
  "../../../utils/resumeImport/importResume",
  () => ({
    createImportedResumeData:
      mocks.createImportedResumeData,
  })
);

/* ========================================
   Test Data
======================================== */

const parsedResume = {
  personalInfo: {
    firstName:
      "Alex",

    lastName:
      "Morgan",

    jobTitle:
      "Frontend Developer",

    email:
      "alex@example.com",

    phone:
      "9876543210",

    location:
      "Hyderabad",

    website:
      "",

    linkedin:
      "",

    github:
      "",
  },

  summary:
    "Frontend developer building accessible React applications.",

  experience: [
    {
      id:
        "experience-1",

      jobTitle:
        "Frontend Developer",

      company:
        "Acme",

      description:
        "Built reusable React interfaces.",
    },
  ],

  education: [
    {
      id:
        "education-1",

      degree:
        "B.Tech",

      fieldOfStudy:
        "Computer Science",

      institution:
        "Example University",

      startDate:
        "2020",

      endDate:
        "2024",
    },
  ],

  skills: [
    "React",
    "JavaScript",
  ],

  projects: [
    {
      id:
        "project-1",

      name:
        "ResumeCraft AI",

      description:
        "AI-assisted resume builder.",

      technologies: [
        "React",
      ],

      projectUrl:
        "",

      githubUrl:
        "",
    },
  ],

  certifications: [
    {
      id:
        "certification-1",

      name:
        "React Certification",

      issuer:
        "Example Academy",
    },
  ],

  languages: [
    {
      id:
        "language-1",

      name:
        "English",

      proficiency:
        "",
    },
  ],
};

const parsedResult = {
  resume:
    parsedResume,

  confidence: {
    score: 85,

    checks: [
      {
        key:
          "personalInfo",

        detected:
          true,
      },

      {
        key:
          "summary",

        detected:
          true,
      },

      {
        key:
          "experience",

        detected:
          true,
      },

      {
        key:
          "education",

        detected:
          true,
      },

      {
        key:
          "skills",

        detected:
          true,
      },

      {
        key:
          "projects",

        detected:
          true,
      },

      {
        key:
          "certifications",

        detected:
          true,
      },

      {
        key:
          "languages",

        detected:
          false,
      },
    ],
  },
};

const importedData = {
  title:
    "Alex Morgan Resume",

  templateId:
    "modern",

  isFresher:
    false,

  personalInfo:
    parsedResume.personalInfo,

  summary:
    parsedResume.summary,

  experience:
    parsedResume.experience,

  education:
    parsedResume.education,

  skills:
    parsedResume.skills,

  projects:
    parsedResume.projects,

  certifications:
    parsedResume.certifications,

  languages:
    parsedResume.languages,

  jobTarget: {
    jobTitle: "",
    company: "",
    jobDescription: "",
  },

  analysis: {
    overallScore: 0,
    atsScore: 0,
    contentScore: 0,
    impactScore: 0,
    keywordScore: 0,
    missingKeywords: [],
    matchedKeywords: [],
    suggestions: [],
  },

  customization: {
    fontFamily:
      "Inter",

    fontSize:
      "medium",

    accentColor:
      "#7c3aed",

    spacing:
      "normal",
  },
};

/* ========================================
   Helpers
======================================== */

const createPdfFile =
  () =>
    new File(
      [
        "fake pdf bytes",
      ],
      "alex-resume.pdf",
      {
        type:
          "application/pdf",
      }
    );

const createInvalidFile =
  () =>
    new File(
      [
        "plain text",
      ],
      "resume.txt",
      {
        type:
          "text/plain",
      }
    );

const renderImportAction =
  () =>
    render(
      <ResumeImportAction>
        {({
          openFilePicker,
          isProcessing,
          isImporting,
        }) => (
          <button
            type="button"
            onClick={
              openFilePicker
            }
          >
            {isProcessing
              ? "Processing"
              : isImporting
                ? "Importing"
                : "Choose PDF"}
          </button>
        )}
      </ResumeImportAction>
    );

const getFileInput =
  (container) =>
    container.querySelector(
      'input[type="file"]'
    );

/* ========================================
   Setup
======================================== */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.resumeState.resumes =
    [];

  mocks.uiState.defaultTemplate =
    "modern";

  mocks.uiState.defaultAccentColor =
    "#7c3aed";

  mocks.extractTextFromPdf
    .mockResolvedValue({
      text:
        "Alex Morgan\nFrontend Developer",
    });

  mocks.parseResumeText
    .mockReturnValue(
      parsedResult
    );

  mocks.createImportedResumeData
    .mockReturnValue(
      importedData
    );

  mocks.addResume
    .mockImplementation(
      () => {
        const resume = {
          id:
            "resume-imported-1",

          ...importedData,
        };

        mocks.resumeState.resumes =
          [
            resume,
            ...mocks.resumeState
              .resumes,
          ];

        return resume;
      }
    );

  mocks.updateResume
    .mockImplementation(
      (
        id,
        updates
      ) => {
        mocks.resumeState.resumes =
          mocks.resumeState.resumes.map(
            (resume) =>
              resume.id === id
                ? {
                    ...resume,
                    ...updates,
                  }
                : resume
          );
      }
    );

  mocks.deleteResume
    .mockImplementation(
      (id) => {
        mocks.resumeState.resumes =
          mocks.resumeState.resumes.filter(
            (resume) =>
              resume.id !== id
          );
      }
    );

  vi.spyOn(
    console,
    "error"
  ).mockImplementation(
    () => {}
  );
});

/* ========================================
   Trigger
======================================== */

describe(
  "ResumeImportAction trigger",
  () => {
    it(
      "renders the supplied trigger",
      () => {
        renderImportAction();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Choose PDF",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders a hidden PDF file input",
      () => {
        const {
          container,
        } =
          renderImportAction();

        const input =
          getFileInput(
            container
          );

        expect(
          input
        ).toBeInTheDocument();

        expect(
          input
        ).toHaveAttribute(
          "accept",
          ".pdf,application/pdf"
        );
      }
    );

    it(
      "opens the native file picker from the trigger",
      async () => {
        const user =
          userEvent.setup();

        const {
          container,
        } =
          renderImportAction();

        const input =
          getFileInput(
            container
          );

        const clickSpy =
          vi.spyOn(
            input,
            "click"
          );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Choose PDF",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              clickSpy
            ).toHaveBeenCalledTimes(
              1
            );
          }
        );
      }
    );
  }
);

/* ========================================
   File Validation
======================================== */

describe(
  "ResumeImportAction file validation",
  () => {
    it(
      "rejects non-PDF files before extraction",
      async () => {
        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createInvalidFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Please select a PDF resume."
        );

        expect(
          mocks.extractTextFromPdf
        ).not.toHaveBeenCalled();

        expect(
          mocks.parseResumeText
        ).not.toHaveBeenCalled();

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "shows extraction failures without creating a resume",
      async () => {
        mocks.extractTextFromPdf
          .mockRejectedValue(
            new Error(
              "Unable to read PDF."
            )
          );

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Unable to read PDF."
        );

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();

        expect(
          mocks.navigate
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "rejects extracted PDFs with no readable text",
      async () => {
        mocks.extractTextFromPdf
          .mockResolvedValue({
            text:
              "   ",
          });

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "ResumeCraft could not find readable text in this PDF."
        );

        expect(
          mocks.parseResumeText
        ).not.toHaveBeenCalled();

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "rejects parser results without resume data",
      async () => {
        mocks.parseResumeText
          .mockReturnValue({
            resume:
              null,
          });

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "ResumeCraft could not detect resume information in this PDF."
        );

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();
      }
    );
  }
);

/* ========================================
   Preview
======================================== */

describe(
  "ResumeImportAction preview",
  () => {
    it(
      "extracts and parses a selected PDF",
      async () => {
        const file =
          createPdfFile();

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                file,
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        expect(
          mocks.extractTextFromPdf
        ).toHaveBeenCalledWith(
          file
        );

        expect(
          mocks.parseResumeText
        ).toHaveBeenCalledWith(
          "Alex Morgan\nFrontend Developer"
        );
      }
    );

    it(
      "shows the selected filename",
      async () => {
        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByText(
            "alex-resume.pdf"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows import coverage",
      async () => {
        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByText(
            "85%"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "7 of 8 sections detected"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows parsed resume information",
      async () => {
        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        expect(
          await screen.findByText(
            "Alex Morgan"
          )
        ).toBeInTheDocument();

        expect(
          screen.getAllByText(
            "Frontend Developer"
          )
        ).toHaveLength(
          2
        );

        expect(
          screen.getByText(
            "React"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "ResumeCraft AI"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "does not create a resume before confirmation",
      async () => {
        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();

        expect(
          mocks.updateResume
        ).not.toHaveBeenCalled();

        expect(
          mocks.navigate
        ).not.toHaveBeenCalled();
      }
    );
  }
);

/* ========================================
   Cancel
======================================== */

describe(
  "ResumeImportAction cancellation",
  () => {
    it(
      "closes preview without creating a resume",
      async () => {
        const user =
          userEvent.setup();

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Cancel",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              screen.queryByRole(
                "dialog"
              )
            ).not.toBeInTheDocument();
          }
        );

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();

        expect(
          mocks.navigate
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "closes preview from the close button",
      async () => {
        const user =
          userEvent.setup();

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Close import preview",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              screen.queryByRole(
                "dialog"
              )
            ).not.toBeInTheDocument();
          }
        );

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();
      }
    );
  }
);

/* ========================================
   Successful Import
======================================== */

describe(
  "ResumeImportAction successful import",
  () => {
    it(
      "uses the configured template and accent defaults",
      async () => {
        const user =
          userEvent.setup();

        mocks.uiState.defaultTemplate =
          "professional";

        mocks.uiState.defaultAccentColor =
          "#2563eb";

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Import Resume",
            }
          )
        );

        expect(
          mocks.createImportedResumeData
        ).toHaveBeenCalledWith(
          parsedResume,
          {
            templateId:
              "professional",

            accentColor:
              "#2563eb",
          }
        );
      }
    );

    it(
      "creates and populates the imported resume",
      async () => {
        const user =
          userEvent.setup();

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Import Resume",
            }
          )
        );

        expect(
          mocks.addResume
        ).toHaveBeenCalledWith({
          title:
            "Alex Morgan Resume",

          templateId:
            "modern",

          accentColor:
            "#7c3aed",
        });

        expect(
          mocks.updateResume
        ).toHaveBeenCalledWith(
          "resume-imported-1",
          expect.objectContaining({
            title:
              "Alex Morgan Resume",

            templateId:
              "modern",

            isFresher:
              false,

            personalInfo:
              parsedResume.personalInfo,

            summary:
              parsedResume.summary,

            skills:
              parsedResume.skills,

            customization:
              importedData.customization,
          })
        );
      }
    );

    it(
      "navigates to the imported resume builder",
      async () => {
        const user =
          userEvent.setup();

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Import Resume",
            }
          )
        );

        expect(
          mocks.navigate
        ).toHaveBeenCalledWith(
          "/builder/resume-imported-1"
        );
      }
    );
  }
);

/* ========================================
   Transactional Rollback
======================================== */

describe(
  "ResumeImportAction rollback",
  () => {
    it(
      "does not navigate when resume creation fails",
      async () => {
        const user =
          userEvent.setup();

        mocks.addResume
          .mockReturnValue(
            null
          );

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Import Resume",
            }
          )
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "ResumeCraft could not create the imported resume."
        );

        expect(
          mocks.updateResume
        ).not.toHaveBeenCalled();

        expect(
          mocks.navigate
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "rolls back a resume when population fails",
      async () => {
        const user =
          userEvent.setup();

        mocks.updateResume
          .mockImplementation(
            () => {
              throw new Error(
                "Unable to save imported content."
              );
            }
          );

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Import Resume",
            }
          )
        );

        expect(
          mocks.deleteResume
        ).toHaveBeenCalledWith(
          "resume-imported-1"
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Unable to save imported content."
        );

        expect(
          mocks.navigate
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "rolls back when the created resume cannot be verified",
      async () => {
        const user =
          userEvent.setup();

        mocks.addResume
          .mockImplementation(
            () => ({
              id:
                "resume-imported-1",

              ...importedData,
            })
          );

        const {
          container,
        } =
          renderImportAction();

        fireEvent.change(
          getFileInput(
            container
          ),
          {
            target: {
              files: [
                createPdfFile(),
              ],
            },
          }
        );

        await screen.findByRole(
          "dialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Import Resume",
            }
          )
        );

        expect(
          mocks.deleteResume
        ).toHaveBeenCalledWith(
          "resume-imported-1"
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "ResumeCraft could not save the imported resume."
        );

        expect(
          mocks.navigate
        ).not.toHaveBeenCalled();
      }
    );
  }
);