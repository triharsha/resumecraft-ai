import {
  useEffect,
} from "react";

import AppRoutes from "./routes/AppRoutes";

import useUIStore from "./stores/uiStore";

const App = () => {
  const theme =
    useUIStore(
      (state) =>
        state.theme
    );

  const reducedMotion =
    useUIStore(
      (state) =>
        state.reducedMotion
    );

  /* ========================================
     Apply Theme Globally
  ======================================== */

  useEffect(() => {
    const root =
      document.documentElement;

    const systemDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const applyTheme = () => {
      const shouldUseDark =
        theme === "dark" ||
        (
          theme === "system" &&
          systemDark.matches
        );

      root.classList.toggle(
        "dark",
        shouldUseDark
      );

      root.style.colorScheme =
        shouldUseDark
          ? "dark"
          : "light";
    };

    applyTheme();

    if (
      theme !== "system"
    ) {
      return undefined;
    }

    systemDark.addEventListener(
      "change",
      applyTheme
    );

    return () => {
      systemDark.removeEventListener(
        "change",
        applyTheme
      );
    };
  }, [
    theme,
  ]);

  /* ========================================
     Apply Reduced Motion Globally
  ======================================== */

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "reduce-motion",
      reducedMotion
    );
  }, [
    reducedMotion,
  ]);

  return <AppRoutes />;
};

export default App;