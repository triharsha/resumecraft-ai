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

import Resumes from "../Resumes";

import useResumeStore from "../../stores/resumeStore";

/* ========================================
   Test Data
======================================== */

const createTestResume = ({
  id,
  title,
  updatedAt =
    "2026-09-01T10:00:00.000Z",
}) => ({
  id,

  title,

  templateId:
    "modern",

  isFresher:
    false,

  createdAt:
    "2026-08-01T10:00:00.000Z",

  updatedAt,

  personalInfo: {
    firstName:
      "",

    lastName:
      "",

    jobTitle:
      "",

    email:
      "",

    phone:
      "",

    location:
      "",

    website:
      "",

    linkedin:
      "",

    github:
      "",
  },

  summary:
    "",

  experience:
    [],

  education:
    [],

  skills:
    [],

  projects:
    [],

  certifications:
    [],

  languages:
    [],

  jobTarget: {
    jobTitle:
      "",

    company:
      "",

    jobDescription:
      "",
  },

  analysis: {
    overallScore:
      0,

    atsScore:
      0,

    contentScore:
      0,

    impactScore:
      0,

    keywordScore:
      0,

    missingKeywords:
      [],

    matchedKeywords:
      [],

    suggestions:
      [],
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
});

const frontendResume =
  createTestResume({
    id:
      "resume-1",

    title:
      "Frontend Developer Resume",

    updatedAt:
      "2026-09-01T10:00:00.000Z",
  });

const backendResume =
  createTestResume({
    id:
      "resume-2",

    title:
      "Backend Java Resume",

    updatedAt:
      "2026-08-28T10:00:00.000Z",
  });

const fullStackResume =
  createTestResume({
    id:
      "resume-3",

    title:
      "Full Stack Resume",

    updatedAt:
      "2026-08-25T10:00:00.000Z",
  });

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

const renderResumes =
  (
    initialEntry =
      "/resumes"
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
            path="/resumes"
            element={
              <Resumes />
            }
          />

          <Route
            path="/builder/new"
            element={
              <div>
                New Resume Builder
              </div>
            }
          />

          <Route
            path="/builder/:resumeId"
            element={
              <div>
                Resume Builder
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    );

/* ========================================
   Store Helpers
======================================== */

const setResumes =
  (resumes) => {
    useResumeStore.setState({
      resumes,

      activeResumeId:
        resumes[0]?.id ??
        null,
    });
  };

/* ========================================
   Setup
======================================== */

beforeEach(() => {
  vi.clearAllMocks();

  window.localStorage.clear();

  useResumeStore.setState({
    resumes:
      [],

    activeResumeId:
      null,
  });
});

/* ========================================
   Page Rendering
======================================== */

describe(
  "Resumes page rendering",
  () => {
    it(
      "renders the page heading",
      () => {
        renderResumes();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "My Resumes",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders the main new resume action",
      () => {
        renderResumes();

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "New Resume",
            }
          )
        ).toHaveAttribute(
          "href",
          "/builder/new"
        );
      }
    );

    it(
      "shows the empty state when there are no resumes",
      () => {
        renderResumes();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Create your first resume",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "Create Resume",
            }
          )
        ).toHaveAttribute(
          "href",
          "/builder/new"
        );
      }
    );

    it(
      "does not show the search toolbar when there are no resumes",
      () => {
        renderResumes();

        expect(
          screen.queryByPlaceholderText(
            "Search resumes..."
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "renders stored resumes",
      () => {
        setResumes([
          frontendResume,
          backendResume,
          fullStackResume,
        ]);

        renderResumes();

        expect(
          screen.getByText(
            "Frontend Developer Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Backend Java Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Full Stack Resume"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the correct plural resume count",
      () => {
        setResumes([
          frontendResume,
          backendResume,
          fullStackResume,
        ]);

        renderResumes();

        expect(
          screen.getByText(
            "3 resumes"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the singular resume count",
      () => {
        setResumes([
          frontendResume,
        ]);

        renderResumes();

        expect(
          screen.getByText(
            "1 resume"
          )
        ).toBeInTheDocument();
      }
    );
  }
);

/* ========================================
   Search
======================================== */

describe(
  "Resumes search",
  () => {
    beforeEach(() => {
      setResumes([
        frontendResume,
        backendResume,
        fullStackResume,
      ]);
    });

    it(
      "filters resumes by title",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        const searchInput =
          screen.getByPlaceholderText(
            "Search resumes..."
          );

        await user.type(
          searchInput,
          "Backend"
        );

        expect(
          screen.getByText(
            "Backend Java Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Frontend Developer Resume"
          )
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "Full Stack Resume"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "searches case-insensitively",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.type(
          screen.getByPlaceholderText(
            "Search resumes..."
          ),
          "frontend"
        );

        expect(
          screen.getByText(
            "Frontend Developer Resume"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "trims search whitespace",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.type(
          screen.getByPlaceholderText(
            "Search resumes..."
          ),
          "   Full Stack   "
        );

        expect(
          screen.getByText(
            "Full Stack Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Backend Java Resume"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "shows the search empty state when no resume matches",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.type(
          screen.getByPlaceholderText(
            "Search resumes..."
          ),
          "DevOps Resume"
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "No resumes found",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Try searching with another resume name."
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "restores all resumes after clearing search",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        const searchInput =
          screen.getByPlaceholderText(
            "Search resumes..."
          );

        await user.type(
          searchInput,
          "Backend"
        );

        expect(
          screen.queryByText(
            "Frontend Developer Resume"
          )
        ).not.toBeInTheDocument();

        await user.clear(
          searchInput
        );

        expect(
          screen.getByText(
            "Frontend Developer Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Backend Java Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Full Stack Resume"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "keeps the total resume count while search is active",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.type(
          screen.getByPlaceholderText(
            "Search resumes..."
          ),
          "Backend"
        );

        expect(
          screen.getByText(
            "3 resumes"
          )
        ).toBeInTheDocument();
      }
    );
  }
);

/* ========================================
   Navigation
======================================== */

describe(
  "Resumes navigation",
  () => {
    it(
      "opens the new resume builder from the header action",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "link",
            {
              name:
                "New Resume",
            }
          )
        );

        expect(
          screen.getByText(
            "New Resume Builder"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "location"
          )
        ).toHaveTextContent(
          "/builder/new"
        );
      }
    );

    it(
      "opens the new resume builder from the empty state",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "link",
            {
              name:
                "Create Resume",
            }
          )
        );

        expect(
          screen.getByText(
            "New Resume Builder"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "location"
          )
        ).toHaveTextContent(
          "/builder/new"
        );
      }
    );

    it(
      "opens an existing resume from Edit Resume",
      async () => {
        const user =
          userEvent.setup();

        setResumes([
          frontendResume,
        ]);

        renderResumes();

        await user.click(
          screen.getByRole(
            "link",
            {
              name:
                "Edit Resume",
            }
          )
        );

        expect(
          screen.getByText(
            "Resume Builder"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "location"
          )
        ).toHaveTextContent(
          "/builder/resume-1"
        );
      }
    );
  }
);

/* ========================================
   Action Menu
======================================== */

describe(
  "ResumeCard action menu",
  () => {
    beforeEach(() => {
      setResumes([
        frontendResume,
      ]);
    });

    it(
      "opens the resume action menu",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        const actionButton =
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          );

        expect(
          actionButton
        ).toHaveAttribute(
          "aria-expanded",
          "false"
        );

        await user.click(
          actionButton
        );

        expect(
          actionButton
        ).toHaveAttribute(
          "aria-expanded",
          "true"
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Duplicate",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "toggles the action menu closed",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        const actionButton =
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          );

        await user.click(
          actionButton
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        ).toBeInTheDocument();

        await user.click(
          actionButton
        );

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "closes the action menu after clicking outside",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole(
            "heading",
            {
              name:
                "My Resumes",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              screen.queryByRole(
                "button",
                {
                  name:
                    "Rename",
                }
              )
            ).not.toBeInTheDocument();
          }
        );
      }
    );
  }
);

/* ========================================
   Rename
======================================== */

describe(
  "ResumeCard rename",
  () => {
    beforeEach(() => {
      setResumes([
        frontendResume,
      ]);
    });

    it(
      "enters rename mode from the action menu",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        );

        const input =
          screen.getByRole(
            "textbox",
            {
              name:
                "Resume title",
            }
          );

        expect(
          input
        ).toBeInTheDocument();

        expect(
          input
        ).toHaveValue(
          "Frontend Developer Resume"
        );

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Duplicate",
            }
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "renames a resume with Enter",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        );

        const input =
          screen.getByRole(
            "textbox",
            {
              name:
                "Resume title",
            }
          );

        await user.clear(
          input
        );

        await user.type(
          input,
          "React Developer Resume{Enter}"
        );

        await waitFor(
          () => {
            expect(
              screen.getByText(
                "React Developer Resume"
              )
            ).toBeInTheDocument();
          }
        );

        expect(
          useResumeStore
            .getState()
            .resumes[0]
            .title
        ).toBe(
          "React Developer Resume"
        );
      }
    );

    it(
      "trims whitespace when renaming",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        );

        const input =
          screen.getByRole(
            "textbox",
            {
              name:
                "Resume title",
            }
          );

        await user.clear(
          input
        );

        await user.type(
          input,
          "   React Engineer Resume   {Enter}"
        );

        await waitFor(
          () => {
            expect(
              useResumeStore
                .getState()
                .resumes[0]
                .title
            ).toBe(
              "React Engineer Resume"
            );
          }
        );
      }
    );

    it(
      "cancels rename with Escape",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        );

        const input =
          screen.getByRole(
            "textbox",
            {
              name:
                "Resume title",
            }
          );

        await user.clear(
          input
        );

        await user.type(
          input,
          "Changed title"
        );

        await user.keyboard(
          "{Escape}"
        );

        expect(
          screen.queryByRole(
            "textbox",
            {
              name:
                "Resume title",
            }
          )
        ).not.toBeInTheDocument();

        expect(
          screen.getByText(
            "Frontend Developer Resume"
          )
        ).toBeInTheDocument();

        expect(
          useResumeStore
            .getState()
            .resumes[0]
            .title
        ).toBe(
          "Frontend Developer Resume"
        );
      }
    );

    it(
      "does not save an empty resume title",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Rename",
            }
          )
        );

        const input =
          screen.getByRole(
            "textbox",
            {
              name:
                "Resume title",
            }
          );

        await user.clear(
          input
        );

        await user.keyboard(
          "{Enter}"
        );

        expect(
          screen.getByText(
            "Frontend Developer Resume"
          )
        ).toBeInTheDocument();

        expect(
          useResumeStore
            .getState()
            .resumes[0]
            .title
        ).toBe(
          "Frontend Developer Resume"
        );
      }
    );
  }
);

/* ========================================
   Duplicate
======================================== */

describe(
  "ResumeCard duplicate",
  () => {
    beforeEach(() => {
      setResumes([
        frontendResume,
      ]);
    });

    it(
      "duplicates a resume from the action menu",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Duplicate",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              useResumeStore
                .getState()
                .resumes
            ).toHaveLength(
              2
            );
          }
        );

        expect(
          screen.getByText(
            "Frontend Developer Resume Copy"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "2 resumes"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "creates the duplicate with a different id",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Duplicate",
            }
          )
        );

        const resumes =
          useResumeStore
            .getState()
            .resumes;

        expect(
          resumes
        ).toHaveLength(
          2
        );

        expect(
          resumes[0].id
        ).not.toBe(
          "resume-1"
        );

        expect(
          resumes[1].id
        ).toBe(
          "resume-1"
        );
      }
    );

    it(
      "activates the newly duplicated resume",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Duplicate",
            }
          )
        );

        const state =
          useResumeStore.getState();

        expect(
          state.activeResumeId
        ).toBe(
          state.resumes[0].id
        );

        expect(
          state.activeResumeId
        ).not.toBe(
          "resume-1"
        );
      }
    );
  }
);

/* ========================================
   Delete
======================================== */

describe(
  "ResumeCard delete",
  () => {
    beforeEach(() => {
      setResumes([
        frontendResume,
        backendResume,
      ]);
    });

    it(
      "opens a confirmation dialog before deleting",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        expect(
          screen.getByRole(
            "alertdialog"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Delete this resume?",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Frontend Developer Resume.*will be permanently deleted/
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "does not delete when confirmation is cancelled",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
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
                "alertdialog"
              )
            ).not.toBeInTheDocument();
          }
        );

        expect(
          useResumeStore
            .getState()
            .resumes
        ).toHaveLength(
          2
        );

        expect(
          screen.getByText(
            "Frontend Developer Resume"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "deletes a resume after confirmation",
      async () => {
        const user =
          userEvent.setup();

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Resume",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              screen.queryByText(
                "Frontend Developer Resume"
              )
            ).not.toBeInTheDocument();
          }
        );

        expect(
          useResumeStore
            .getState()
            .resumes
        ).toHaveLength(
          1
        );

        expect(
          screen.getByText(
            "Backend Java Resume"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "1 resume"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "falls back to another resume when the active resume is deleted",
      async () => {
        const user =
          userEvent.setup();

        useResumeStore.setState({
          activeResumeId:
            "resume-1",
        });

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Resume",
            }
          )
        );

        await waitFor(
          () => {
            expect(
              useResumeStore
                .getState()
                .activeResumeId
            ).toBe(
              "resume-2"
            );
          }
        );
      }
    );

    it(
      "shows the empty state after deleting the final resume",
      async () => {
        const user =
          userEvent.setup();

        setResumes([
          frontendResume,
        ]);

        renderResumes();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Actions for Frontend Developer Resume",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete",
            }
          )
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Resume",
            }
          )
        );

        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "Create your first resume",
            }
          )
        ).toBeInTheDocument();

        expect(
          useResumeStore
            .getState()
            .resumes
        ).toHaveLength(
          0
        );

        expect(
          useResumeStore
            .getState()
            .activeResumeId
        ).toBeNull();
      }
    );
  }
);