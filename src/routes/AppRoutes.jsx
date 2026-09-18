import {
  lazy,
  Suspense,
} from "react";

import {
  Route,
  Routes,
} from "react-router-dom";

import BuilderLayout from "../components/layout/BuilderLayout";
import MainLayout from "../components/layout/MainLayout";

/* ========================================
   Lazy Pages
======================================== */

const Home =
  lazy(() =>
    import("../pages/Home")
  );

const Resumes =
  lazy(() =>
    import(
      "../pages/Resumes"
    )
  );

const Templates =
  lazy(() =>
    import(
      "../pages/Templates"
    )
  );

const Settings =
  lazy(() =>
    import(
      "../pages/Settings"
    )
  );

const Builder =
  lazy(() =>
    import(
      "../pages/Builder"
    )
  );

const NotFound =
  lazy(() =>
    import(
      "../pages/NotFound"
    )
  );

/* ========================================
   Route Loading Screen
======================================== */

const RouteLoader = () => {
  return (
    <div
      className="
        flex
        min-h-[40vh]
        items-center
        justify-center
        px-6
      "
      role="status"
      aria-live="polite"
    >
      <div
        className="
          flex
          items-center
          gap-3

          text-sm
          font-semibold

          text-zinc-500
          dark:text-zinc-400
        "
      >
        <span
          className="
            h-5
            w-5

            animate-spin

            rounded-full

            border-2
            border-zinc-300
            border-t-violet-600

            dark:border-zinc-700
            dark:border-t-violet-400
          "
          aria-hidden="true"
        />

        Loading...
      </div>
    </div>
  );
};

/* ========================================
   App Routes
======================================== */

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <RouteLoader />
      }
    >
      <Routes>
        {/* ========================================
            Main Application
        ======================================== */}

        <Route
          element={
            <MainLayout />
          }
        >
          <Route
            path="/"
            element={
              <Home />
            }
          />

          <Route
            path="/resumes"
            element={
              <Resumes />
            }
          />

          <Route
            path="/templates"
            element={
              <Templates />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings />
            }
          />
        </Route>

        {/* ========================================
            Focused Resume Builder
        ======================================== */}

        <Route
          element={
            <BuilderLayout />
          }
        >
          <Route
            path="/builder/new"
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
        </Route>

        {/* ========================================
            Not Found
        ======================================== */}

        <Route
          path="*"
          element={
            <NotFound />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;