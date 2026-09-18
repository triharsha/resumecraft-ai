import {
  create,
} from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import {
  createResume,
  duplicateResumeData,
  getCurrentTimestamp,
  normalizeResumes,
} from "../utils/resume";

/* ========================================
   Helpers
======================================== */

const findResumeIndex = (
  resumes,
  resumeId
) =>
  resumes.findIndex(
    (resume) =>
      resume.id ===
      resumeId
  );

/* ========================================
   Resume Title Helpers
======================================== */

const getFullName = (
  personalInfo = {}
) => {
  const firstName =
    String(
      personalInfo.firstName ||
        ""
    ).trim();

  const lastName =
    String(
      personalInfo.lastName ||
        ""
    ).trim();

  return [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");
};

/*
 * Creates the next available automatic
 * resume title for a person's name.
 *
 * Examples:
 *
 * Mattaparthi Triharsha Resume
 * Mattaparthi Triharsha Resume 2
 * Mattaparthi Triharsha Resume 3
 *
 * The current resume can be excluded so
 * changing its own name does not conflict
 * with itself.
 */

const getUniqueResumeTitle = (
  resumes,
  fullName,
  currentResumeId = null
) => {
  const cleanName =
    String(
      fullName || ""
    ).trim();

  if (!cleanName) {
    return "Untitled Resume";
  }

  const baseTitle =
    `${cleanName} Resume`;

  const existingTitles =
    new Set(
      resumes
        .filter(
          (resume) =>
            resume.id !==
            currentResumeId
        )
        .map((resume) =>
          String(
            resume.title || ""
          ).trim()
        )
    );

  if (
    !existingTitles.has(
      baseTitle
    )
  ) {
    return baseTitle;
  }

  let number = 2;

  while (
    existingTitles.has(
      `${baseTitle} ${number}`
    )
  ) {
    number += 1;
  }

  return `${baseTitle} ${number}`;
};

/*
 * Checks whether a title looks like one
 * of ResumeCraft's automatically generated
 * name-based titles.
 *
 * Examples:
 *
 * Rahul Sharma Resume
 * Rahul Sharma Resume 2
 * Rahul Sharma Resume 3
 */

const isAutoResumeTitle = (
  title,
  fullName
) => {
  const cleanTitle =
    String(
      title || ""
    ).trim();

  const cleanName =
    String(
      fullName || ""
    ).trim();

  if (!cleanName) {
    return (
      cleanTitle ===
      "Untitled Resume"
    );
  }

  const baseTitle =
    `${cleanName} Resume`;

  if (
    cleanTitle ===
    baseTitle
  ) {
    return true;
  }

  if (
    !cleanTitle.startsWith(
      `${baseTitle} `
    )
  ) {
    return false;
  }

  const suffix =
    cleanTitle
      .slice(
        baseTitle.length + 1
      )
      .trim();

  return (
    /^\d+$/.test(suffix) &&
    Number(suffix) >= 2
  );
};

/*
 * Checks whether a title is one of
 * ResumeCraft's automatically generated
 * starter titles.
 *
 * This includes:
 *
 * Untitled Resume
 * Modern Resume
 * Terminal Resume
 * Professional Resume
 * Developer Resume
 * etc.
 *
 * This allows both newly created and
 * existing template-created resumes to
 * switch to a person's name automatically.
 */

const isStarterResumeTitle = (
  title
) => {
  const cleanTitle =
    String(
      title || ""
    ).trim();

  if (
    cleanTitle ===
    "Untitled Resume"
  ) {
    return true;
  }

  return /^[A-Za-z]+ Resume$/.test(
    cleanTitle
  );
};

/* ========================================
   Safe Local Storage
======================================== */

/*
 * Zustand persistence should never make
 * the application unusable.
 *
 * Browser storage can fail because of:
 * - privacy restrictions
 * - disabled storage
 * - storage quota
 * - browser/runtime problems
 *
 * When persistence fails, ResumeCraft
 * continues working with Zustand's
 * in-memory state for the current session.
 */

const safeLocalStorage = {
  getItem: (name) => {
    try {
      if (
        typeof window ===
        "undefined"
      ) {
        return null;
      }

      return window.localStorage.getItem(
        name
      );
    } catch (error) {
      console.error(
        "ResumeCraft could not read resume storage:",
        error
      );

      return null;
    }
  },

  setItem: (
    name,
    value
  ) => {
    try {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      window.localStorage.setItem(
        name,
        value
      );
    } catch (error) {
      console.error(
        "ResumeCraft could not save resume storage:",
        error
      );
    }
  },

  removeItem: (name) => {
    try {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      window.localStorage.removeItem(
        name
      );
    } catch (error) {
      console.error(
        "ResumeCraft could not remove resume storage:",
        error
      );
    }
  },
};

/* ========================================
   Normalize Persisted State
======================================== */

const normalizePersistedState = (
  persistedState
) => {
  const safeState =
    persistedState &&
    typeof persistedState ===
      "object" &&
    !Array.isArray(
      persistedState
    )
      ? persistedState
      : {};

  /*
   * First normalize the saved resumes.
   */

  const normalizedResumes =
    normalizeResumes(
      safeState.resumes
    );

  /*
   * Repair existing automatically named
   * resumes when personal information
   * already contains a person's name.
   *
   * This handles older resumes such as:
   *
   * Untitled Resume
   * Terminal Resume
   * Modern Resume
   *
   * Existing custom/manual titles remain
   * untouched.
   *
   * Resumes are processed one by one so
   * duplicate names receive unique titles.
   */

  const resumes = [];

  normalizedResumes.forEach(
    (resume) => {
      const fullName =
        getFullName(
          resume.personalInfo
        );

      if (!fullName) {
        resumes.push(
          resume
        );

        return;
      }

      const shouldRepairTitle =
        isStarterResumeTitle(
          resume.title
        );

      if (!shouldRepairTitle) {
        resumes.push(
          resume
        );

        return;
      }

      const uniqueTitle =
        getUniqueResumeTitle(
          resumes,
          fullName,
          resume.id
        );

      resumes.push({
        ...resume,

        title:
          uniqueTitle,
      });
    }
  );

  const requestedActiveId =
    typeof safeState.activeResumeId ===
    "string"
      ? safeState.activeResumeId
      : null;

  const activeResumeExists =
    requestedActiveId
      ? resumes.some(
          (resume) =>
            resume.id ===
            requestedActiveId
        )
      : false;

  return {
    resumes,

    activeResumeId:
      activeResumeExists
        ? requestedActiveId
        : resumes[0]?.id ??
          null,
  };
};

/* ========================================
   Store
======================================== */

const useResumeStore =
  create(
    persist(
      (
        set,
        get
      ) => ({
        /* =====================================
           State
        ===================================== */

        resumes: [],

        activeResumeId:
          null,

        /*
         * AI tailoring results are intentionally
         * session-only.
         *
         * They survive navigation between builder
         * sections because they live in Zustand,
         * but they are excluded from partialize()
         * so they are not written to localStorage.
         */

        aiTailoringResults: {},

        /* =====================================
           Session AI Tailoring
        ===================================== */

        setAiTailoringResult: (
          resumeId,
          result
        ) => {
          if (!resumeId) {
            return;
          }

          set(
            (state) => ({
              aiTailoringResults: {
                ...state.aiTailoringResults,

                [resumeId]:
                  result,
              },
            })
          );
        },

        clearAiTailoringResult: (
          resumeId
        ) => {
          if (!resumeId) {
            return;
          }

          set(
            (state) => {
              const nextResults = {
                ...state.aiTailoringResults,
              };

              delete nextResults[
                resumeId
              ];

              return {
                aiTailoringResults:
                  nextResults,
              };
            }
          );
        },

        /* =====================================
           Create Resume
        ===================================== */

        addResume: (
          options = {}
        ) => {
          const resume =
            createResume(
              options
            );

          set(
            (state) => ({
              resumes: [
                resume,
                ...state.resumes,
              ],

              activeResumeId:
                resume.id,
            })
          );

          return resume;
        },

        /* =====================================
           Restore Backup
        ===================================== */

        restoreBackup: ({
          resumes,
          activeResumeId,
        }) => {
          const normalized =
            normalizePersistedState({
              resumes,
              activeResumeId,
            });

          set({
            resumes:
              normalized.resumes,

            activeResumeId:
              normalized.activeResumeId,
          });
        },

        /* =====================================
           Active Resume
        ===================================== */

        setActiveResume: (
          resumeId
        ) => {
          const exists =
            get().resumes.some(
              (resume) =>
                resume.id ===
                resumeId
            );

          set({
            activeResumeId:
              exists
                ? resumeId
                : null,
          });
        },

        clearActiveResume:
          () => {
            set({
              activeResumeId:
                null,
            });
          },

        /* =====================================
           Update Entire Resume
        ===================================== */

        updateResume: (
          resumeId,
          updates
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    return {
                      ...resume,
                      ...updates,

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Rename Resume
        ===================================== */

        renameResume: (
          resumeId,
          title
        ) => {
          const cleanTitle =
            String(
              title || ""
            ).trim();

          if (!cleanTitle) {
            return;
          }

          get().updateResume(
            resumeId,
            {
              title:
                cleanTitle,
            }
          );
        },

        /* =====================================
           Personal Info
        ===================================== */

        updatePersonalInfo: (
          resumeId,
          updates
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    const previousPersonalInfo =
                      resume.personalInfo ||
                      {};

                    const previousFullName =
                      getFullName(
                        previousPersonalInfo
                      );

                    const nextPersonalInfo = {
                      ...previousPersonalInfo,
                      ...updates,
                    };

                    const nextFullName =
                      getFullName(
                        nextPersonalInfo
                      );

                    /*
                     * Automatic naming is allowed
                     * while the resume still has:
                     *
                     * - a starter/template title
                     * - an automatically generated
                     *   name-based title
                     *
                     * A manually renamed resume
                     * remains untouched.
                     */

                    const shouldAutoRename =
                      isStarterResumeTitle(
                        resume.title
                      ) ||
                      isAutoResumeTitle(
                        resume.title,
                        previousFullName
                      );

                    let nextTitle =
                      resume.title;

                    if (
                      shouldAutoRename &&
                      nextFullName
                    ) {
                      nextTitle =
                        getUniqueResumeTitle(
                          state.resumes,
                          nextFullName,
                          resumeId
                        );
                    }

                    return {
                      ...resume,

                      title:
                        nextTitle,

                      personalInfo:
                        nextPersonalInfo,

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Summary
        ===================================== */

        updateSummary: (
          resumeId,
          summary
        ) => {
          get().updateResume(
            resumeId,
            {
              summary,
            }
          );
        },

        /* =====================================
           Generic Section Item Update
        ===================================== */

        updateSectionItem: (
          resumeId,
          section,
          itemId,
          updates
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    const sectionItems =
                      Array.isArray(
                        resume[
                          section
                        ]
                      )
                        ? resume[
                            section
                          ]
                        : [];

                    return {
                      ...resume,

                      [section]:
                        sectionItems.map(
                          (
                            item
                          ) =>
                            item.id ===
                            itemId
                              ? {
                                  ...item,
                                  ...updates,
                                }
                              : item
                        ),

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Add Section Item
        ===================================== */

        addSectionItem: (
          resumeId,
          section,
          item
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    const sectionItems =
                      Array.isArray(
                        resume[
                          section
                        ]
                      )
                        ? resume[
                            section
                          ]
                        : [];

                    return {
                      ...resume,

                      [section]: [
                        ...sectionItems,
                        item,
                      ],

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Remove Section Item
        ===================================== */

        removeSectionItem: (
          resumeId,
          section,
          itemId
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    const sectionItems =
                      Array.isArray(
                        resume[
                          section
                        ]
                      )
                        ? resume[
                            section
                          ]
                        : [];

                    return {
                      ...resume,

                      [section]:
                        sectionItems.filter(
                          (
                            item
                          ) =>
                            item.id !==
                            itemId
                        ),

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Skills
        ===================================== */

        setSkills: (
          resumeId,
          skills
        ) => {
          get().updateResume(
            resumeId,
            {
              skills:
                Array.isArray(
                  skills
                )
                  ? skills
                  : [],
            }
          );
        },

        /* =====================================
           Job Target
        ===================================== */

        updateJobTarget: (
          resumeId,
          updates
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    return {
                      ...resume,

                      jobTarget: {
                        ...resume.jobTarget,
                        ...updates,
                      },

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Analysis
        ===================================== */

        updateAnalysis: (
          resumeId,
          updates
        ) => {
          set(
            (state) => ({
              resumes:
                state.resumes.map(
                  (
                    resume
                  ) => {
                    if (
                      resume.id !==
                      resumeId
                    ) {
                      return resume;
                    }

                    return {
                      ...resume,

                      analysis: {
                        ...resume.analysis,
                        ...updates,
                      },

                      updatedAt:
                        getCurrentTimestamp(),
                    };
                  }
                ),
            })
          );
        },

        /* =====================================
           Customization
        ===================================== */

        updateCustomization:
          (
            resumeId,
            updates
          ) => {
            set(
              (state) => ({
                resumes:
                  state.resumes.map(
                    (
                      resume
                    ) => {
                      if (
                        resume.id !==
                        resumeId
                      ) {
                        return resume;
                      }

                      return {
                        ...resume,

                        customization: {
                          ...resume.customization,
                          ...updates,
                        },

                        updatedAt:
                          getCurrentTimestamp(),
                      };
                    }
                  ),
              })
            );
          },

        /* =====================================
           Duplicate Resume
        ===================================== */

        duplicateResume: (
          resumeId
        ) => {
          const original =
            get().resumes.find(
              (resume) =>
                resume.id ===
                resumeId
            );

          if (!original) {
            return null;
          }

          const duplicated =
            duplicateResumeData(
              original
            );

          set(
            (state) => ({
              resumes: [
                duplicated,
                ...state.resumes,
              ],

              activeResumeId:
                duplicated.id,
            })
          );

          return duplicated;
        },

        /* =====================================
           Delete Resume
        ===================================== */

        deleteResume: (
          resumeId
        ) => {
          const {
            resumes,
            activeResumeId,
          } = get();

          const index =
            findResumeIndex(
              resumes,
              resumeId
            );

          if (
            index === -1
          ) {
            return;
          }

          const remaining =
            resumes.filter(
              (resume) =>
                resume.id !==
                resumeId
            );

          let nextActiveId =
            activeResumeId;

          if (
            activeResumeId ===
            resumeId
          ) {
            nextActiveId =
              remaining[0]
                ?.id ??
              null;
          }

          set(
            (state) => {
              const nextAiTailoringResults = {
                ...state.aiTailoringResults,
              };

              delete nextAiTailoringResults[
                resumeId
              ];

              return {
                resumes:
                  remaining,

                activeResumeId:
                  nextActiveId,

                aiTailoringResults:
                  nextAiTailoringResults,
              };
            }
          );
        },

        /* =====================================
           Clear Resumes
        ===================================== */

        clearResumes: () => {
          set({
            resumes: [],

            activeResumeId:
              null,

            aiTailoringResults: {},
          });
        },
      }),

      {
        /* =====================================
           Persistence
        ===================================== */

        name:
          "resumecraft_resumes",

        version: 1,

        /*
         * Safe JSON storage protects the
         * application from browser storage
         * failures while keeping Zustand's
         * normal persist serialization.
         */

        storage:
          createJSONStorage(
            () =>
              safeLocalStorage
          ),

        /* =====================================
           Migration
        ===================================== */

        migrate: (
          persistedState
        ) =>
          normalizePersistedState(
            persistedState
          ),

        /* =====================================
           Safe Hydration Merge
        ===================================== */

        merge: (
          persistedState,
          currentState
        ) => {
          const normalized =
            normalizePersistedState(
              persistedState
            );

          return {
            ...currentState,

            resumes:
              normalized.resumes,

            activeResumeId:
              normalized.activeResumeId,
          };
        },

        /* =====================================
           Persisted State
        ===================================== */

        /*
         * Do NOT add aiTailoringResults here.
         *
         * AI tailoring recommendations should
         * survive internal builder navigation,
         * but should not be permanently stored
         * in localStorage.
         */

        partialize: (
          state
        ) => ({
          resumes:
            state.resumes,

          activeResumeId:
            state.activeResumeId,
        }),
      }
    )
  );

/* ========================================
   Selectors
======================================== */

export const selectResumes = (
  state
) => state.resumes;

export const selectActiveResumeId =
  (state) =>
    state.activeResumeId;

export const selectActiveResume = (
  state
) =>
  state.resumes.find(
    (resume) =>
      resume.id ===
      state.activeResumeId
  ) ?? null;

export const selectResumeCount = (
  state
) =>
  state.resumes.length;

export default useResumeStore;