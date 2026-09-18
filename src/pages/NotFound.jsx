import {
  ArrowLeft,
  FileText,
  Home,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const NotFound = () => {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="container-shell flex min-h-screen items-center justify-center py-10 sm:py-16">
        <section className="w-full max-w-2xl text-center">
          {/* Brand Icon */}
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
            <FileText
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          {/* Brand */}
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-600">
            ResumeCraft AI
          </p>

          {/* Error Code */}
          <p className="mt-5 text-7xl font-black tracking-tight text-zinc-200 sm:text-8xl dark:text-zinc-800">
            404
          </p>

          {/* Heading */}
          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
            This page couldn&apos;t be found.
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base dark:text-zinc-400">
            The page may have moved, the
            link may be incorrect, or the
            content may no longer be
            available.
          </p>

          {/* Actions */}
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-bold !text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:bg-white dark:!text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Home
                className="h-4 w-4"
                aria-hidden="true"
              />

              Back to Home
            </Link>

            <Link
              to="/resumes"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-800 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
            >
              <ArrowLeft
                className="h-4 w-4"
                aria-hidden="true"
              />

              My Resumes
            </Link>
          </div>

          {/* Recovery Card */}
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-zinc-200 bg-white/70 p-5 text-left dark:border-zinc-800 dark:bg-zinc-900/70">
            <p className="text-sm font-black text-zinc-900 dark:text-white">
              Looking for your resume?
            </p>

            <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Return to your resume
              workspace to continue editing
              an existing resume or create a
              new one.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default NotFound;