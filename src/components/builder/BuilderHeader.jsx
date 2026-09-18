import {
  ArrowLeft,
  Check,
  FileText,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const BuilderHeader = ({
  resume,
}) => {
  return (
    <header
      className="
        relative
        z-40

        lg:sticky
        lg:top-0

        border-b
        border-stone-200
        dark:border-zinc-800

        bg-white/95
        dark:bg-zinc-900/95

        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          justify-between
          gap-4

          px-4
          py-3

          sm:px-6
        "
      >
        {/* =====================================
            Left Side
        ===================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* Back */}

          <Link
            to="/resumes"
            aria-label="Back to resumes"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-xl

              border
              border-stone-200
              dark:border-zinc-800

              bg-white
              dark:bg-zinc-900

              text-zinc-500
              dark:text-zinc-400

              transition-colors

              hover:bg-stone-100
              hover:text-zinc-950

              dark:hover:bg-zinc-800
              dark:hover:text-white
            "
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />
          </Link>

          {/* Resume identity */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                hidden

                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-xl

                bg-violet-50
                dark:bg-violet-950/30

                text-violet-600
                dark:text-violet-400

                sm:flex
              "
            >
              <FileText
                size={16}
                aria-hidden="true"
              />
            </div>

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  max-w-[160px]
                  truncate

                  text-sm
                  font-black

                  text-zinc-950
                  dark:text-white

                  sm:max-w-xs
                  md:max-w-md
                "
              >
                {resume.title}
              </p>

              <p
                className="
                  mt-0.5

                  hidden

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]

                  text-zinc-400
                  dark:text-zinc-500

                  sm:block
                "
              >
                Resume Builder
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            Saved Status
        ===================================== */}

        <div
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5

            rounded-full

            bg-emerald-50
            dark:bg-emerald-950/20

            px-3
            py-1.5

            text-xs
            font-bold

            text-emerald-700
            dark:text-emerald-400
          "
        >
          <Check
            size={13}
            aria-hidden="true"
          />

          <span>
            Saved
          </span>
        </div>
      </div>
    </header>
  );
};

export default BuilderHeader;