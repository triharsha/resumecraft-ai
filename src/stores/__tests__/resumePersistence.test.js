import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import useResumeStore from "../resumeStore";

import {
  createResume,
} from "../../utils/resume";

const STORAGE_KEY =
  "resumecraft_resumes";

/* ========================================
   Helpers
======================================== */

const resetStore = () => {
  useResumeStore.setState({
    resumes: [],
    activeResumeId: null,
  });

  window.localStorage.clear();
};

const readPersistedState = () => {
  const raw =
    window.localStorage.getItem(
      STORAGE_KEY
    );

  return raw
    ? JSON.parse(raw)
    : null;
};

const writePersistedState = (
  state,
  version = 1
) => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      state,
      version,
    })
  );
};

/* ========================================
   Persistence Tests
======================================== */

describe("resumeStore persistence", () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();

    window.localStorage.clear();

    useResumeStore.setState({
      resumes: [],
      activeResumeId: null,
    });

    window.localStorage.clear();
  });

  /* ========================================
     Persisted Structure
  ======================================== */

  describe("persisted structure", () => {
    it("persists resumes and activeResumeId", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume({
            title:
              "Persistent Resume",
          });

      const persisted =
        readPersistedState();

      expect(
        persisted
      ).not.toBeNull();

      expect(
        persisted.version
      ).toBe(1);

      expect(
        persisted.state.resumes
      ).toHaveLength(1);

      expect(
        persisted.state
          .resumes[0].id
      ).toBe(resume.id);

      expect(
        persisted.state
          .activeResumeId
      ).toBe(resume.id);
    });

    it("does not persist store action functions", () => {
      useResumeStore
        .getState()
        .addResume();

      const persisted =
        readPersistedState();

      expect(
        persisted.state
          .addResume
      ).toBeUndefined();

      expect(
        persisted.state
          .updateResume
      ).toBeUndefined();

      expect(
        persisted.state
          .deleteResume
      ).toBeUndefined();
    });

    it("persists resume updates", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .updateSummary(
          resume.id,
          "Persisted summary"
        );

      const persisted =
        readPersistedState();

      expect(
        persisted.state
          .resumes[0].summary
      ).toBe(
        "Persisted summary"
      );
    });

    it("persists resume deletion", () => {
      const resume =
        useResumeStore
          .getState()
          .addResume();

      useResumeStore
        .getState()
        .deleteResume(
          resume.id
        );

      const persisted =
        readPersistedState();

      expect(
        persisted.state.resumes
      ).toEqual([]);

      expect(
        persisted.state
          .activeResumeId
      ).toBeNull();
    });
  });

  /* ========================================
     Rehydration
  ======================================== */

  describe("rehydration", () => {
    it("rehydrates valid persisted resumes", async () => {
      const resume =
        createResume({
          title:
            "Rehydrated Resume",
        });

      /*
       * Clear the current runtime state
       * before writing the persisted
       * snapshot.
       *
       * Zustand persist can write whenever
       * setState is called, so the storage
       * snapshot must be written last.
       */

      useResumeStore.setState({
        resumes: [],
        activeResumeId: null,
      });

      writePersistedState({
        resumes: [
          resume,
        ],

        activeResumeId:
          resume.id,
      });

      await useResumeStore
        .persist
        .rehydrate();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].title
      ).toBe(
        "Rehydrated Resume"
      );

      expect(
        state.activeResumeId
      ).toBe(resume.id);
    });

    it("recovers from a stale activeResumeId", async () => {
      const first =
        createResume({
          title: "First",
        });

      const second =
        createResume({
          title: "Second",
        });

      /*
       * Reset runtime state first so it
       * cannot overwrite the snapshot we
       * want to rehydrate.
       */

      useResumeStore.setState({
        resumes: [],
        activeResumeId: null,
      });

      writePersistedState({
        resumes: [
          first,
          second,
        ],

        activeResumeId:
          "deleted-resume",
      });

      await useResumeStore
        .persist
        .rehydrate();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(2);

      expect(
        state.activeResumeId
      ).toBe(first.id);
    });

    it("uses null activeResumeId when persisted resumes are empty", async () => {
      writePersistedState({
        resumes: [],
        activeResumeId:
          "missing-resume",
      });

      await useResumeStore
        .persist
        .rehydrate();

      expect(
        useResumeStore.getState()
          .activeResumeId
      ).toBeNull();
    });

    it("normalizes malformed resume fields during rehydration", async () => {
      writePersistedState({
        resumes: [
          {
            id:
              "resume-malformed",

            title: 123,

            templateId:
              "invalid-template",

            skills: "React",

            experience: null,

            customization: {
              fontSize:
                "huge",

              spacing:
                "massive",
            },
          },
        ],

        activeResumeId:
          "resume-malformed",
      });

      await useResumeStore
        .persist
        .rehydrate();

      const resume =
        useResumeStore
          .getState()
          .resumes[0];

      expect(resume.title).toBe(
        "Untitled Resume"
      );

      expect(
        resume.templateId
      ).toBe("modern");

      expect(
        resume.skills
      ).toEqual([]);

      expect(
        resume.experience
      ).toEqual([]);

      expect(
        resume.customization
          .fontSize
      ).toBe("medium");

      expect(
        resume.customization
          .spacing
      ).toBe("normal");
    });

    it("filters invalid resume entries during rehydration", async () => {
      const validResume =
        createResume({
          title:
            "Valid Resume",
        });

      writePersistedState({
        resumes: [
          null,
          "invalid",
          123,
          validResume,
        ],

        activeResumeId:
          validResume.id,
      });

      await useResumeStore
        .persist
        .rehydrate();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].id
      ).toBe(
        validResume.id
      );
    });
  });

  /* ========================================
     Invalid Storage
  ======================================== */

  describe("invalid persisted storage", () => {
    it("recovers safely when persisted state has invalid collections", async () => {
      writePersistedState({
        resumes: {
          invalid: true,
        },

        activeResumeId: 123,
      });

      await useResumeStore
        .persist
        .rehydrate();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toEqual([]);

      expect(
        state.activeResumeId
      ).toBeNull();
    });

    it("recovers safely when persisted state is null", async () => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          state: null,
          version: 1,
        })
      );

      await useResumeStore
        .persist
        .rehydrate();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toEqual([]);

      expect(
        state.activeResumeId
      ).toBeNull();
    });
  });

  /* ========================================
     Migration
  ======================================== */

  describe("migration", () => {
    it("normalizes older persisted state during migration", async () => {
      const resume =
        createResume({
          title:
            "Old Resume",
        });

      /*
       * Version 0 forces Zustand to run
       * the store migration function.
       */

      writePersistedState(
        {
          resumes: [
            {
              ...resume,

              templateId:
                "old-template",

              customization: {
                ...resume
                  .customization,

                fontSize:
                  "invalid-size",
              },
            },
          ],

          activeResumeId:
            resume.id,
        },
        0
      );

      await useResumeStore
        .persist
        .rehydrate();

      const state =
        useResumeStore.getState();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0]
          .templateId
      ).toBe("modern");

      expect(
        state.resumes[0]
          .customization
          .fontSize
      ).toBe("medium");

      expect(
        state.activeResumeId
      ).toBe(resume.id);
    });
  });

  /* ========================================
     Runtime Resilience
  ======================================== */

  describe("runtime resilience", () => {
    it("keeps Zustand state usable even when persistence cannot save", () => {
      const setItemSpy =
        vi.spyOn(
          Storage.prototype,
          "setItem"
        );

      setItemSpy.mockImplementation(
        () => {
          throw new Error(
            "Storage quota exceeded"
          );
        }
      );

      /*
       * The production safe-storage
       * adapter catches the write error.
       *
       * The resume must still be created
       * successfully in Zustand memory.
       */

      const resume =
        useResumeStore
          .getState()
          .addResume({
            title:
              "Memory Resume",
          });

      const state =
        useResumeStore.getState();

      expect(resume).toBeDefined();

      expect(
        state.resumes
      ).toHaveLength(1);

      expect(
        state.resumes[0].title
      ).toBe(
        "Memory Resume"
      );

      expect(
        state.activeResumeId
      ).toBe(resume.id);
    });
  });
});