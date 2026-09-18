import {
  FilePlus2,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const ResumeEmptyState =
  () => {
    return (
      <div
        className="
          rounded-3xl

          border
          border-dashed
          border-stone-300
          dark:border-zinc-700

          bg-white/50
          dark:bg-zinc-900/40

          px-6
          py-16

          text-center

          sm:px-10
          sm:py-20
        "
      >
        {/* =====================================
            Icon
        ===================================== */}

        <div
          className="
            mx-auto

            flex
            h-14
            w-14
            items-center
            justify-center

            rounded-2xl

            bg-violet-50
            dark:bg-violet-950/30

            text-violet-700
            dark:text-violet-300
          "
        >
          <FilePlus2
            size={24}
            aria-hidden="true"
          />
        </div>

        {/* =====================================
            Content
        ===================================== */}

        <h2
          className="
            mt-6

            text-2xl
            font-black
            tracking-[-0.03em]

            text-zinc-950
            dark:text-white
          "
        >
          Create your first
          resume
        </h2>

        <p
          className="
            mx-auto
            mt-3

            max-w-md

            text-sm
            leading-7

            text-zinc-500
            dark:text-zinc-400
          "
        >
          Start building a
          professional resume and
          use ResumeCraft AI to
          improve, analyze, and
          tailor it for your target
          roles.
        </p>

        {/* =====================================
            Create Resume
        ===================================== */}

        <Link
          to="/builder/new"
          className="
            mt-7

            inline-flex
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-zinc-950
            dark:bg-white

            px-5
            py-3

            text-sm
            font-black

            shadow-sm

            transition-all
            duration-200

            hover:-translate-y-0.5
            hover:bg-zinc-800
            hover:shadow-md

            dark:hover:bg-zinc-100
          "
        >
          <Sparkles
            size={15}
            aria-hidden="true"
            className="
              shrink-0

              text-violet-300
              dark:text-violet-600
            "
          />

          <span
            className="
              whitespace-nowrap

              text-white
              dark:text-zinc-950
            "
          >
            Create Resume
          </span>
        </Link>
      </div>
    );
  };

export default ResumeEmptyState;