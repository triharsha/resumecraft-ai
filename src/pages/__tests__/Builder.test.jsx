import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Builder from "../Builder";

/* ========================================
   Hoisted Mocks
======================================== */

const mocks =
  vi.hoisted(() => ({
    addResume:
      vi.fn(),

    setActiveResume:
      vi.fn(),

    exportResumeToPdf:
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
   Resume Store
======================================== */

vi.mock(
  "../../stores/resumeStore",
  () => {
    const useResumeStore =
      (selector) =>
        selector({
          resumes:
            mocks.resumeState
              .resumes,

          addResume:
            mocks.addResume,

          setActiveResume:
            mocks.setActiveResume,
        });

    useResumeStore.getState =
      () => ({
        resumes:
          mocks.resumeState
            .resumes,

        addResume:
          mocks.addResume,

        setActiveResume:
          mocks.setActiveResume,
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
  "../../stores/uiStore",
  () => ({
    default:
      (selector) =>
        selector(
          mocks.uiState
        ),
  })
);

/* ========================================
   PDF Exporter
======================================== */

vi.mock(
  "../../utils/pdfExporter",
  () => ({
    exportResumeToPdf:
      mocks.exportResumeToPdf,
  })
);

/* ========================================
   Builder Child Components
======================================== */

vi.mock(
  "../../components/builder/BuilderHeader",
  () => ({
    default:
      ({ resume }) => (
        <header
          data-testid="builder-header"
        >
          Header:{" "}
          {resume.title}
        </header>
      ),
  })
);

vi.mock(
  "../../components/builder/BuilderSidebar",
  () => ({
    default:
      ({
        activeSection,
        onSectionChange,
      }) => (
        <aside>
          <p
            data-testid="sidebar-active-section"
          >
            {activeSection}
          </p>

          <button
            type="button"
            onClick={() =>
              onSectionChange(
                "summary"
              )
            }
          >
            Sidebar Summary
          </button>

          <button
            type="button"
            onClick={() =>
              onSectionChange(
                "analysis"
              )
            }
          >
            Sidebar Analysis
          </button>
        </aside>
      ),
  })
);

vi.mock(
  "../../components/builder/BuilderWorkspace",
  () => ({
    default:
      ({
        activeSection,
        resume,
        onSectionChange,
        showReturnToAnalysis,
        onReturnToAnalysis,
      }) => (
        <main>
          <p
            data-testid="workspace-resume-id"
          >
            {resume.id}
          </p>

          <p
            data-testid="workspace-active-section"
          >
            {activeSection}
          </p>

          <p
            data-testid="return-to-analysis-state"
          >
            {showReturnToAnalysis
              ? "visible"
              : "hidden"}
          </p>

          <button
            type="button"
            onClick={() =>
              onSectionChange(
                "skills"
              )
            }
          >
            Workspace Skills
          </button>

          <button
            type="button"
            onClick={() =>
              onSectionChange(
                "job-target",
                {
                  fromAnalysis:
                    true,
                }
              )
            }
          >
            Tailor From Analysis
          </button>

          <button
            type="button"
            onClick={
              onReturnToAnalysis
            }
          >
            Return To Analysis
          </button>
        </main>
      ),
  })
);

vi.mock(
  "../../components/builder/BuilderPreview",
  () => ({
    default:
      ({
        resume,
        onOverflowChange,
        onDownloadPdf,
        isExporting,
        exportError,
      }) => (
        <section>
          <p
            data-testid="preview-resume-id"
          >
            {resume.id}
          </p>

          <p
            data-testid="exporting-state"
          >
            {isExporting
              ? "exporting"
              : "idle"}
          </p>

          {exportError && (
            <p role="alert">
              {exportError}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              onOverflowChange(
                true
              )
            }
          >
            Set Overflow
          </button>

          <button
            type="button"
            onClick={() =>
              onOverflowChange(
                false
              )
            }
          >
            Clear Overflow
          </button>

          <button
            type="button"
            onClick={() =>
              onDownloadPdf({
                paperElement: {
                  nodeType: 1,
                },

                contentElement: {
                  nodeType: 1,
                },
              })
            }
          >
            Download Test PDF
          </button>

          <button
            type="button"
            onClick={() =>
              onDownloadPdf({
                paperElement:
                  null,

                contentElement:
                  null,
              })
            }
          >
            Download Without Preview
          </button>
        </section>
      ),
  })
);

/* ========================================
   Test Data
======================================== */

const resumeOne = {
  id:
    "resume-1",

  title:
    "Frontend Resume",

  templateId:
    "modern",

  customization: {
    accentColor:
      "#7c3aed",
  },
};

const resumeTwo = {
  id:
    "resume-2",

  title:
    "Backend Resume",

  templateId:
    "professional",

  customization: {
    accentColor:
      "#2563eb",
  },
};

/* ========================================
   Location Probe
======================================== */

const LocationProbe =
  () => {
    const location =
      useLocation();

    return (
      <p data-testid="location">
        {location.pathname}
        {location.search}
      </p>
    );
  };

/* ========================================
   Render Helper
======================================== */

const renderBuilder =
  (
    initialEntry =
      "/builder/resume-1"
  ) =>
    render(
      <MemoryRouter
        initialEntries={[
          initialEntry,
        ]}
      >
        <LocationProbe />

        <Routes>
          <Route
            path="/builder"
            element={
              <Builder />
            }
          />

          <Route
            path="/builder/:resumeId"
            element={
              <Builder />
            }
          />

          <Route
            path="/resumes"
            element={
              <div>
                Resumes Page
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    );

/* ========================================
   Setup
======================================== */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.resumeState.resumes =
    [
      resumeOne,
      resumeTwo,
    ];

  mocks.uiState.defaultTemplate =
    "modern";

  mocks.uiState.defaultAccentColor =
    "#7c3aed";

  mocks.addResume
    .mockImplementation(
      (options = {}) => {
        const newResume = {
          id:
            "resume-new",

          title:
            "Untitled Resume",

          templateId:
            options.templateId ||
            "modern",

          customization: {
            accentColor:
              options.accentColor ||
              "#7c3aed",
          },
        };

        mocks.resumeState.resumes =
          [
            newResume,
            ...mocks.resumeState
              .resumes,
          ];

        return newResume;
      }
    );

  mocks.exportResumeToPdf
    .mockResolvedValue({
      filename:
        "resume.pdf",

      pageCount:
        1,
    });

  vi.spyOn(
    console,
    "error"
  ).mockImplementation(
    () => {}
  );
});

/* ========================================
   Existing Resume
======================================== */

describe(
  "Builder existing resume",
  () => {
    it(
      "loads the requested resume",
      () => {
        renderBuilder();

        expect(
          screen.getByTestId(
            "builder-header"
          )
        ).toHaveTextContent(
          "Frontend Resume"
        );

        expect(
          screen.getByTestId(
            "workspace-resume-id"
          )
        ).toHaveTextContent(
          "resume-1"
        );

        expect(
          screen.getByTestId(
            "preview-resume-id"
          )
        ).toHaveTextContent(
          "resume-1"
        );
      }
    );

    it(
      "sets the loaded resume as active",
      async () => {
        renderBuilder();

        await waitFor(
          () => {
            expect(
              mocks.setActiveResume
            ).toHaveBeenCalledWith(
              "resume-1"
            );
          }
        );
      }
    );

    it(
      "does not create a new resume when loading an existing resume",
      () => {
        renderBuilder();

        expect(
          mocks.addResume
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "loads another existing resume by route id",
      async () => {
        renderBuilder(
          "/builder/resume-2"
        );

        expect(
          screen.getByTestId(
            "builder-header"
          )
        ).toHaveTextContent(
          "Backend Resume"
        );

        await waitFor(
          () => {
            expect(
              mocks.setActiveResume
            ).toHaveBeenCalledWith(
              "resume-2"
            );
          }
        );
      }
    );
  }
);

/* ========================================
   Requested Section
======================================== */

describe(
  "Builder requested section",
  () => {
    it(
      "defaults to personal when no section is requested",
      () => {
        renderBuilder();

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "personal"
        );

        expect(
          screen.getByTestId(
            "sidebar-active-section"
          )
        ).toHaveTextContent(
          "personal"
        );
      }
    );

    it(
      "opens a valid requested section",
      () => {
        renderBuilder(
          "/builder/resume-1?section=analysis"
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "analysis"
        );

        expect(
          screen.getByTestId(
            "sidebar-active-section"
          )
        ).toHaveTextContent(
          "analysis"
        );
      }
    );

    it(
      "opens the job target section from the URL",
      () => {
        renderBuilder(
          "/builder/resume-1?section=job-target"
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "job-target"
        );
      }
    );

    it(
      "falls back to personal for an invalid requested section",
      () => {
        renderBuilder(
          "/builder/resume-1?section=unknown"
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "personal"
        );
      }
    );
  }
);

/* ========================================
   Section Navigation
======================================== */

describe(
  "Builder section navigation",
  () => {
    it(
      "changes sections from the sidebar",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sidebar Summary",
            }
          )
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "summary"
        );

        expect(
          screen.getByTestId(
            "sidebar-active-section"
          )
        ).toHaveTextContent(
          "summary"
        );
      }
    );

    it(
      "changes sections from the workspace",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Workspace Skills",
            }
          )
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "skills"
        );
      }
    );

    it(
      "tracks a return to analysis when tailoring starts from analysis",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder(
          "/builder/resume-1?section=analysis"
        );

        expect(
          screen.getByTestId(
            "return-to-analysis-state"
          )
        ).toHaveTextContent(
          "hidden"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Tailor From Analysis",
            }
          )
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "job-target"
        );

        expect(
          screen.getByTestId(
            "return-to-analysis-state"
          )
        ).toHaveTextContent(
          "visible"
        );
      }
    );

    it(
      "returns to analysis and clears the return state",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder(
          "/builder/resume-1?section=analysis"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Tailor From Analysis",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Return To Analysis",
            }
          )
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "analysis"
        );

        expect(
          screen.getByTestId(
            "return-to-analysis-state"
          )
        ).toHaveTextContent(
          "hidden"
        );
      }
    );

    it(
      "clears the return state when analysis is selected directly",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder(
          "/builder/resume-1?section=analysis"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Tailor From Analysis",
            }
          )
        );

        expect(
          screen.getByTestId(
            "return-to-analysis-state"
          )
        ).toHaveTextContent(
          "visible"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sidebar Analysis",
            }
          )
        );

        expect(
          screen.getByTestId(
            "workspace-active-section"
          )
        ).toHaveTextContent(
          "analysis"
        );

        expect(
          screen.getByTestId(
            "return-to-analysis-state"
          )
        ).toHaveTextContent(
          "hidden"
        );
      }
    );
  }
);

/* ========================================
   Invalid Resume
======================================== */

describe(
  "Builder invalid resume",
  () => {
    it(
      "redirects an unknown resume id to the resumes page",
      async () => {
        renderBuilder(
          "/builder/missing-resume"
        );

        expect(
          await screen.findByText(
            "Resumes Page"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "location"
          )
        ).toHaveTextContent(
          "/resumes"
        );

        expect(
          mocks.setActiveResume
        ).not.toHaveBeenCalled();
      }
    );
  }
);

/* ========================================
   New Resume
======================================== */

describe(
  "Builder new resume",
  () => {
    it(
      "creates a resume using the configured defaults",
      async () => {
        mocks.uiState.defaultTemplate =
          "professional";

        mocks.uiState.defaultAccentColor =
          "#2563eb";

        renderBuilder(
          "/builder"
        );

        await waitFor(
          () => {
            expect(
              mocks.addResume
            ).toHaveBeenCalledTimes(
              1
            );
          }
        );

        expect(
          mocks.addResume
        ).toHaveBeenCalledWith({
          templateId:
            "professional",

          accentColor:
            "#2563eb",
        });

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "location"
              )
            ).toHaveTextContent(
              "/builder/resume-new"
            );
          }
        );
      }
    );

    it(
      "navigates to the newly created resume",
      async () => {
        renderBuilder(
          "/builder"
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "location"
              )
            ).toHaveTextContent(
              "/builder/resume-new"
            );
          }
        );

        expect(
          mocks.addResume
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "preserves a valid requested section when creating a resume",
      async () => {
        renderBuilder(
          "/builder?section=analysis"
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "location"
              )
            ).toHaveTextContent(
              "/builder/resume-new?section=analysis"
            );
          }
        );
      }
    );

    it(
      "drops an invalid requested section when creating a resume",
      async () => {
        renderBuilder(
          "/builder?section=invalid-section"
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "location"
              )
            ).toHaveTextContent(
              "/builder/resume-new"
            );
          }
        );

        expect(
          screen.getByTestId(
            "location"
          ).textContent
        ).not.toContain(
          "section="
        );
      }
    );

    it(
      "guards against duplicate creation during rerenders",
      async () => {
        renderBuilder(
          "/builder"
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "location"
              )
            ).toHaveTextContent(
              "/builder/resume-new"
            );
          }
        );

        expect(
          mocks.addResume
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );
  }
);

/* ========================================
   PDF Export Guards
======================================== */

describe(
  "Builder PDF export guards",
  () => {
    it(
      "prevents export when the preview exceeds one page",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Set Overflow",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Download Test PDF",
            }
          )
        );

        expect(
          mocks.exportResumeToPdf
        ).not.toHaveBeenCalled();

        expect(
          screen.getByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Your resume exceeds one A4 page."
        );
      }
    );

    it(
      "reports when the preview is not ready",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Download Without Preview",
            }
          )
        );

        expect(
          mocks.exportResumeToPdf
        ).not.toHaveBeenCalled();

        expect(
          screen.getByRole(
            "alert"
          )
        ).toHaveTextContent(
          "The resume preview is not ready yet."
        );
      }
    );

    it(
      "exports a valid one-page resume",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Download Test PDF",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              mocks.exportResumeToPdf
            ).toHaveBeenCalledTimes(
              1
            );
          }
        );

        expect(
          mocks.exportResumeToPdf
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            resume:
              resumeOne,

            element:
              expect.any(
                Object
              ),

            contentElement:
              expect.any(
                Object
              ),
          })
        );
      }
    );

    it(
      "handles exporter overflow errors",
      async () => {
        const user =
          userEvent.setup();

        const error =
          new Error(
            "Resume overflow"
          );

        error.code =
          "RESUME_OVERFLOW";

        mocks.exportResumeToPdf
          .mockRejectedValue(
            error
          );

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Download Test PDF",
            }
          )
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Your resume changed and now exceeds one A4 page."
        );
      }
    );

    it(
      "handles general PDF export failures",
      async () => {
        const user =
          userEvent.setup();

        mocks.exportResumeToPdf
          .mockRejectedValue(
            new Error(
              "Export failed"
            )
          );

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Download Test PDF",
            }
          )
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "We could not generate the PDF. Please try again."
        );
      }
    );

    it(
      "clears an overflow export error when overflow is resolved",
      async () => {
        const user =
          userEvent.setup();

        renderBuilder();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Set Overflow",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Download Test PDF",
            }
          )
        );

        expect(
          screen.getByRole(
            "alert"
          )
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Clear Overflow",
            }
          )
        );

        expect(
          screen.queryByRole(
            "alert"
          )
        ).not.toBeInTheDocument();
      }
    );
  }
);