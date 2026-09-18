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

import Settings from "../Settings";

import {
  getTemplatesByCategory,
  templateCategories,
} from "../../components/builder/templates/templateRegistry";

import useResumeStore from "../../stores/resumeStore";
import useUIStore from "../../stores/uiStore";

import {
  downloadResumeBackup,
  parseResumeBackup,
} from "../../utils/resumeBackup";

/* ========================================
   Resume Backup Mocks
======================================== */

vi.mock(
  "../../utils/resumeBackup",
  async () => {
    const actual =
      await vi.importActual(
        "../../utils/resumeBackup"
      );

    return {
      ...actual,

      downloadResumeBackup:
        vi.fn(),

      parseResumeBackup:
        vi.fn(),
    };
  }
);

/* ========================================
   Test Resume
======================================== */

const createTestResume = ({
  id = "resume-1",
  title = "Frontend Resume",
} = {}) => ({
  id,

  title,

  templateId:
    "modern",

  isFresher:
    false,

  createdAt:
    "2026-09-01T10:00:00.000Z",

  updatedAt:
    "2026-09-02T10:00:00.000Z",

  personalInfo: {
    firstName:
      "Triharsha",

    lastName:
      "",

    jobTitle:
      "Frontend Developer",

    email:
      "test@example.com",

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

  skills: [
    "React",
    "JavaScript",
  ],

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

const resumeOne =
  createTestResume();

const resumeTwo =
  createTestResume({
    id:
      "resume-2",

    title:
      "Backend Resume",
  });

/* ========================================
   Helpers
======================================== */

const renderSettings =
  () =>
    render(
      <Settings />
    );

const setResumeState =
  (
    resumes = [],
    activeResumeId =
      resumes[0]?.id ??
      null
  ) => {
    useResumeStore.setState({
      resumes,
      activeResumeId,
    });
  };

const resetUIState =
  () => {
    useUIStore.setState({
      theme:
        "light",

      reducedMotion:
        false,

      defaultTemplate:
        "modern",

      defaultAccentColor:
        "#7c3aed",
    });
  };

/*
 * The backup input is intentionally hidden,
 * so querying the DOM directly is appropriate
 * for simulating browser file selection.
 */
const getBackupInput =
  (container) =>
    container.querySelector(
      'input[type="file"]'
    );

/* ========================================
   Setup
======================================== */

beforeEach(() => {
  vi.clearAllMocks();

  window.localStorage.clear();

  setResumeState([]);

  resetUIState();

  downloadResumeBackup
    .mockImplementation(
      () => {}
    );

  parseResumeBackup
    .mockImplementation(
      (rawText) => {
        const parsed =
          JSON.parse(
            rawText
          );

        return (
          parsed.state ??
          parsed
        );
      }
    );
});

/* ========================================
   Rendering
======================================== */

describe(
  "Settings rendering",
  () => {
    it(
      "renders the settings page",
      () => {
        renderSettings();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Make ResumeCraft work your way.",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Appearance",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Resume Defaults",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Data & Privacy",
            }
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the current theme as selected",
      () => {
        useUIStore.setState({
          theme:
            "dark",
        });

        renderSettings();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                /Dark Comfortable low-light workspace/i,
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "true"
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                /Light Bright, focused workspace/i,
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "false"
        );
      }
    );
  }
);

/* ========================================
   Theme
======================================== */

describe(
  "Settings theme",
  () => {
    it(
      "changes the theme to dark",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /Dark Comfortable low-light workspace/i,
            }
          )
        );

        expect(
          useUIStore
            .getState()
            .theme
        ).toBe(
          "dark"
        );
      }
    );

    it(
      "changes the theme to system",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /System Follow your device preference/i,
            }
          )
        );

        expect(
          useUIStore
            .getState()
            .theme
        ).toBe(
          "system"
        );
      }
    );

    it(
      "changes the theme back to light",
      async () => {
        const user =
          userEvent.setup();

        useUIStore.setState({
          theme:
            "dark",
        });

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /Light Bright, focused workspace/i,
            }
          )
        );

        expect(
          useUIStore
            .getState()
            .theme
        ).toBe(
          "light"
        );
      }
    );
  }
);

/* ========================================
   Reduced Motion
======================================== */

describe(
  "Settings reduced motion",
  () => {
    it(
      "enables reduced motion",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        const toggle =
          screen.getByRole(
            "switch",
            {
              name:
                "Toggle reduced motion",
            }
          );

        expect(
          toggle
        ).toHaveAttribute(
          "aria-checked",
          "false"
        );

        await user.click(
          toggle
        );

        expect(
          useUIStore
            .getState()
            .reducedMotion
        ).toBe(
          true
        );

        expect(
          toggle
        ).toHaveAttribute(
          "aria-checked",
          "true"
        );
      }
    );

    it(
      "disables reduced motion",
      async () => {
        const user =
          userEvent.setup();

        useUIStore.setState({
          reducedMotion:
            true,
        });

        renderSettings();

        const toggle =
          screen.getByRole(
            "switch",
            {
              name:
                "Toggle reduced motion",
            }
          );

        expect(
          toggle
        ).toHaveAttribute(
          "aria-checked",
          "true"
        );

        await user.click(
          toggle
        );

        expect(
          useUIStore
            .getState()
            .reducedMotion
        ).toBe(
          false
        );
      }
    );
  }
);

/* ========================================
   Resume Defaults
======================================== */

describe(
  "Settings resume defaults",
  () => {
    it(
      "changes the default template",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        const templateSelect =
          screen.getByRole(
            "combobox"
          );

        expect(
          templateSelect
        ).toHaveValue(
          "modern"
        );

        await user.selectOptions(
          templateSelect,
          "professional"
        );

        expect(
          useUIStore
            .getState()
            .defaultTemplate
        ).toBe(
          "professional"
        );

        expect(
          templateSelect
        ).toHaveValue(
          "professional"
        );
      }
    );

    it(
  "renders all supported template choices",
  () => {
    renderSettings();

    const options =
      screen.getAllByRole(
        "option"
      );

    const expectedTemplates =
      templateCategories.flatMap(
        (category) =>
          getTemplatesByCategory(
            category
          ).filter(
            (template) =>
              template.available
          )
      );

    expect(
      options
    ).toHaveLength(
      expectedTemplates.length
    );

    expect(
      options.map(
        (option) =>
          option.value
      )
    ).toEqual(
      expectedTemplates.map(
        (template) =>
          template.id
      )
    );

    expect(
      options.map(
        (option) =>
          option.textContent
      )
    ).toEqual(
      expectedTemplates.map(
        (template) =>
          template.name
      )
    );
  }
);

    it(
      "changes the default accent color",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        const blueButton =
          screen.getByRole(
            "button",
            {
              name:
                "Use Blue as the default resume accent",
            }
          );

        await user.click(
          blueButton
        );

        expect(
          useUIStore
            .getState()
            .defaultAccentColor
        ).toBe(
          "#2563eb"
        );

        expect(
          blueButton
        ).toHaveAttribute(
          "aria-pressed",
          "true"
        );
      }
    );

    it(
      "marks the current accent as selected",
      () => {
        useUIStore.setState({
          defaultAccentColor:
            "#059669",
        });

        renderSettings();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Use Emerald as the default resume accent",
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "true"
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Use Violet as the default resume accent",
            }
          )
        ).toHaveAttribute(
          "aria-pressed",
          "false"
        );
      }
    );
  }
);

/* ========================================
   Backup Export
======================================== */

describe(
  "Settings backup export",
  () => {
    it(
      "disables export when there are no resumes",
      () => {
        renderSettings();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                /Export Backup/i,
            }
          )
        ).toBeDisabled();

        expect(
          screen.getByText(
            "Create a resume before exporting a backup."
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "enables export when resumes exist",
      () => {
        setResumeState([
          resumeOne,
        ]);

        renderSettings();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                /Export Backup/i,
            }
          )
        ).toBeEnabled();
      }
    );

    it(
      "exports the current resume workspace",
      async () => {
        const user =
          userEvent.setup();

        setResumeState(
          [
            resumeOne,
            resumeTwo,
          ],
          "resume-2"
        );

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /Export Backup/i,
            }
          )
        );

        expect(
          downloadResumeBackup
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          downloadResumeBackup
        ).toHaveBeenCalledWith({
          resumes: [
            resumeOne,
            resumeTwo,
          ],

          activeResumeId:
            "resume-2",

          theme:
            "light",

          reducedMotion:
            false,

          defaultTemplate:
            "modern",

          defaultAccentColor:
            "#7c3aed",
        });

        expect(
          screen.getByRole(
            "status"
          )
        ).toHaveTextContent(
          "Backup downloaded successfully."
        );
      }
    );

    it(
      "shows an export error",
      async () => {
        const user =
          userEvent.setup();

        setResumeState([
          resumeOne,
        ]);

        downloadResumeBackup
          .mockImplementation(
            () => {
              throw new Error(
                "Backup download failed."
              );
            }
          );

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /Export Backup/i,
            }
          )
        );

        expect(
          screen.getByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Backup download failed."
        );
      }
    );
  }
);

/* ========================================
   Backup Restore File Selection
======================================== */

describe(
  "Settings backup restore file selection",
  () => {
    it(
      "opens the hidden backup file picker",
      async () => {
        const user =
          userEvent.setup();

        const {
          container,
        } =
          renderSettings();

        const fileInput =
          getBackupInput(
            container
          );

        const clickSpy =
          vi.spyOn(
            fileInput,
            "click"
          );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /Restore Backup/i,
            }
          )
        );

        expect(
          clickSpy
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "rejects a non-JSON backup file",
      async () => {
        const {
          container,
        } =
          renderSettings();

        const fileInput =
          getBackupInput(
            container
          );

        const file =
          new File(
            [
              "not json",
            ],
            "resume.txt",
            {
              type:
                "text/plain",
            }
          );

        fireEvent.change(
          fileInput,
          {
            target: {
              files: [
                file,
              ],
            },
          }
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Choose a ResumeCraft JSON backup file."
        );

        expect(
          parseResumeBackup
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "accepts a file with the json extension",
      async () => {
        const {
          container,
        } =
          renderSettings();

        const restoredState = {
          resumes: [
            resumeOne,
          ],

          activeResumeId:
            "resume-1",
        };

        parseResumeBackup
          .mockReturnValue(
            restoredState
          );

        const file =
          new File(
            [
              JSON.stringify(
                restoredState
              ),
            ],
            "backup.json",
            {
              type:
                "text/plain",
            }
          );

        fireEvent.change(
          getBackupInput(
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

        expect(
          await screen.findByRole(
            "alertdialog"
          )
        ).toBeInTheDocument();

        expect(
          parseResumeBackup
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "accepts application/json files",
      async () => {
        const {
          container,
        } =
          renderSettings();

        parseResumeBackup
          .mockReturnValue({
            resumes: [
              resumeOne,
            ],

            activeResumeId:
              "resume-1",
          });

        const file =
          new File(
            [
              "{}",
            ],
            "backup.data",
            {
              type:
                "application/json",
            }
          );

        fireEvent.change(
          getBackupInput(
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

        expect(
          await screen.findByRole(
            "alertdialog"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows parser errors for invalid backup content",
      async () => {
        const {
          container,
        } =
          renderSettings();

        parseResumeBackup
          .mockImplementation(
            () => {
              throw new Error(
                "The selected file is not valid JSON."
              );
            }
          );

        const file =
          new File(
            [
              "broken-json",
            ],
            "backup.json",
            {
              type:
                "application/json",
            }
          );

        fireEvent.change(
          getBackupInput(
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

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "The selected file is not valid JSON."
        );

        expect(
          screen.queryByRole(
            "alertdialog"
          )
        ).not.toBeInTheDocument();
      }
    );
  }
);

/* ========================================
   Backup Restore Confirmation
======================================== */

describe(
  "Settings backup restore confirmation",
  () => {
    const restoredState = {
      resumes: [
        resumeOne,
        resumeTwo,
      ],

      activeResumeId:
        "resume-2",
    };

    const selectBackup =
      async (
        container
      ) => {
        parseResumeBackup
          .mockReturnValue(
            restoredState
          );

        const file =
          new File(
            [
              JSON.stringify(
                restoredState
              ),
            ],
            "resumecraft-backup.json",
            {
              type:
                "application/json",
            }
          );

        fireEvent.change(
          getBackupInput(
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
          "alertdialog"
        );
      };

    it(
      "asks for confirmation before replacing the workspace",
      async () => {
        const {
          container,
        } =
          renderSettings();

        await selectBackup(
          container
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Restore this backup?",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /replace your current resume workspace with 2 resumes/
          )
        ).toBeInTheDocument();

        expect(
          useResumeStore
            .getState()
            .resumes
        ).toHaveLength(
          0
        );
      }
    );

    it(
      "cancels backup restoration without changing resumes",
      async () => {
        const user =
          userEvent.setup();

        setResumeState([
          createTestResume({
            id:
              "existing-resume",

            title:
              "Existing Resume",
          }),
        ]);

        const {
          container,
        } =
          renderSettings();

        await selectBackup(
          container
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

        const state =
          useResumeStore.getState();

        expect(
          state.resumes
        ).toHaveLength(
          1
        );

        expect(
          state.resumes[0].id
        ).toBe(
          "existing-resume"
        );
      }
    );

    it(
      "restores the selected backup after confirmation",
      async () => {
        const user =
          userEvent.setup();

        setResumeState([
          createTestResume({
            id:
              "existing-resume",

            title:
              "Existing Resume",
          }),
        ]);

        const {
          container,
        } =
          renderSettings();

        await selectBackup(
          container
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Restore Backup",
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

        const state =
          useResumeStore.getState();

        expect(
          state.resumes.map(
            (resume) =>
              resume.id
          )
        ).toEqual([
          "resume-1",
          "resume-2",
        ]);

        expect(
          state.activeResumeId
        ).toBe(
          "resume-2"
        );

        expect(
          screen.getByRole(
            "status"
          )
        ).toHaveTextContent(
          "2 resumes restored successfully."
        );

        expect(
          screen.queryByRole(
            "alertdialog"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "shows the singular success message for one restored resume",
      async () => {
        const user =
          userEvent.setup();

        parseResumeBackup
          .mockReturnValue({
            resumes: [
              resumeOne,
            ],

            activeResumeId:
              "resume-1",
          });

        const {
          container,
        } =
          renderSettings();

        const file =
          new File(
            [
              "{}",
            ],
            "backup.json",
            {
              type:
                "application/json",
            }
          );

        fireEvent.change(
          getBackupInput(
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
          "alertdialog"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Restore Backup",
            }
          )
        );

        expect(
          await screen.findByRole(
            "status"
          )
        ).toHaveTextContent(
          "1 resume restored successfully."
        );
      }
    );
  }
);

/* ========================================
   Reset Settings
======================================== */

describe(
  "Settings reset",
  () => {
    beforeEach(() => {
      useUIStore.setState({
        theme:
          "dark",

        reducedMotion:
          true,

        defaultTemplate:
          "professional",

        defaultAccentColor:
          "#2563eb",
      });

      setResumeState([
        resumeOne,
        resumeTwo,
      ]);
    });

    it(
      "asks for confirmation before resetting settings",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset Settings",
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
                "Reset all settings?",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Your resumes will not be deleted/
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "cancels settings reset",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset Settings",
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

        expect(
          screen.queryByRole(
            "alertdialog"
          )
        ).not.toBeInTheDocument();

        const settings =
          useUIStore.getState();

        expect(
          settings.theme
        ).toBe(
          "dark"
        );

        expect(
          settings.reducedMotion
        ).toBe(
          true
        );

        expect(
          settings.defaultTemplate
        ).toBe(
          "professional"
        );

        expect(
          settings.defaultAccentColor
        ).toBe(
          "#2563eb"
        );
      }
    );

    it(
      "resets all preferences to their defaults",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        /*
         * First click the page-level
         * Reset Settings action.
         */
        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset Settings",
            }
          )
        );

        expect(
          screen.getByRole(
            "alertdialog"
          )
        ).toBeInTheDocument();

        /*
         * After the dialog opens there are
         * two buttons named Reset Settings:
         *
         * 1. the original page action
         * 2. the confirmation action
         *
         * The confirmation button is rendered
         * after the page button.
         */
        const resetButtons =
          screen.getAllByRole(
            "button",
            {
              name:
                "Reset Settings",
            }
          );

        expect(
          resetButtons
        ).toHaveLength(
          2
        );

        await user.click(
          resetButtons[
            resetButtons.length -
              1
          ]
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

        const settings =
          useUIStore.getState();

        expect(
          settings.theme
        ).toBe(
          "light"
        );

        expect(
          settings.reducedMotion
        ).toBe(
          false
        );

        expect(
          settings.defaultTemplate
        ).toBe(
          "modern"
        );

        expect(
          settings.defaultAccentColor
        ).toBe(
          "#7c3aed"
        );

        expect(
          screen.getByRole(
            "status"
          )
        ).toHaveTextContent(
          "Settings reset to defaults."
        );
      }
    );

    it(
      "preserves resumes when settings are reset",
      async () => {
        const user =
          userEvent.setup();

        renderSettings();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Reset Settings",
            }
          )
        );

        const resetButtons =
          screen.getAllByRole(
            "button",
            {
              name:
                "Reset Settings",
            }
          );

        await user.click(
          resetButtons[
            resetButtons.length -
              1
          ]
        );

        const resumeState =
          useResumeStore.getState();

        expect(
          resumeState.resumes
        ).toHaveLength(
          2
        );

        expect(
          resumeState.resumes.map(
            (resume) =>
              resume.id
          )
        ).toEqual([
          "resume-1",
          "resume-2",
        ]);

        expect(
          resumeState.activeResumeId
        ).toBe(
          "resume-1"
        );
      }
    );
  }
);