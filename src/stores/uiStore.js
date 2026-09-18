import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

/* ========================================
   Defaults
======================================== */

const DEFAULT_SETTINGS = {
  theme: "light",

  reducedMotion: false,

  defaultTemplate:
    "modern",

  defaultAccentColor:
    "#7c3aed",
};

/* ========================================
   UI Store
======================================== */

const useUIStore =
  create(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,

        setTheme: (
          theme
        ) => {
          set({
            theme,
          });
        },

        setReducedMotion: (
          reducedMotion
        ) => {
          set({
            reducedMotion,
          });
        },

        setDefaultTemplate: (
          defaultTemplate
        ) => {
          set({
            defaultTemplate,
          });
        },

        setDefaultAccentColor: (
          defaultAccentColor
        ) => {
          set({
            defaultAccentColor,
          });
        },

        resetSettings: () => {
          set({
            ...DEFAULT_SETTINGS,
          });
        },
      }),

      {
        name:
          "resumecraft_settings",
      }
    )
  );

export default useUIStore;
