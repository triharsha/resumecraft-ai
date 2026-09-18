import {
  FileText,
  Plus,
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import ResumeCard from "../components/resumes/ResumeCard";
import ResumeEmptyState from "../components/resumes/ResumeEmptyState";

import useResumeStore from "../stores/resumeStore";

const Resumes = () => {
  const resumes =
    useResumeStore(
      (state) =>
        state.resumes
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  /* ========================================
     Search
  ======================================== */

  const filteredResumes =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return resumes;
      }

      return resumes.filter(
        (resume) =>
          resume.title
            .toLowerCase()
            .includes(
              query
            )
      );
    }, [
      resumes,
      searchTerm,
    ]);

  return (
    <section
      className="
        container-shell

        py-10
        sm:py-12
        lg:py-14
      "
    >
      {/* =====================================
          Header
      ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-6

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div
          className="
            min-w-0
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2

              text-xs
              font-black
              uppercase
              tracking-[0.15em]

              text-violet-600
              dark:text-violet-400
            "
          >
            <FileText
              size={14}
              aria-hidden="true"
            />

            Resume Workspace
          </div>

          <h1
            className="
              mt-3

              text-3xl
              font-black
              tracking-[-0.04em]

              text-zinc-950
              dark:text-white

              sm:text-4xl
            "
          >
            My Resumes
          </h1>

          <p
            className="
              mt-3

              max-w-2xl

              text-sm
              leading-7

              text-zinc-500
              dark:text-zinc-400

              sm:text-base
            "
          >
            Manage your resumes,
            continue editing your
            work, or create a new
            version for another
            opportunity.
          </p>
        </div>

        {/* =====================================
            New Resume
        ===================================== */}

        <Link
          to="/builder/new"
          className="
            inline-flex
            w-full
            shrink-0
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

            sm:w-auto
          "
        >
          <Plus
            size={16}
            aria-hidden="true"
            className="
              shrink-0

              text-white
              dark:text-zinc-950
            "
          />

          <span
            className="
              whitespace-nowrap

              text-white
              dark:text-zinc-950
            "
          >
            New Resume
          </span>
        </Link>
      </div>

      {/* =====================================
          Toolbar
      ===================================== */}

      {resumes.length >
        0 && (
        <div
          className="
            mt-9

            flex
            flex-col
            gap-4

            rounded-2xl

            border
            border-stone-200
            dark:border-zinc-800

            bg-white
            dark:bg-zinc-900

            p-4

            shadow-sm

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              relative

              w-full

              sm:max-w-sm
            "
          >
            <Search
              size={16}
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                left-3.5
                top-1/2

                -translate-y-1/2

                text-zinc-400
              "
            />

            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event
              ) =>
                setSearchTerm(
                  event.target
                    .value
                )
              }
              placeholder="Search resumes..."
              className="
                w-full

                rounded-xl

                border
                border-stone-200
                dark:border-zinc-800

                bg-[#faf9f6]
                dark:bg-zinc-950

                py-2.5
                pl-10
                pr-4

                text-sm

                text-zinc-950
                dark:text-white

                outline-none

                placeholder:text-zinc-400
                dark:placeholder:text-zinc-600

                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-500/10

                dark:focus:border-violet-700
              "
            />
          </div>

          <p
            className="
              shrink-0

              text-xs
              font-bold

              text-zinc-400
              dark:text-zinc-500
            "
          >
            {resumes.length}{" "}
            {resumes.length ===
            1
              ? "resume"
              : "resumes"}
          </p>
        </div>
      )}

      {/* =====================================
          Content
      ===================================== */}

      <div
        className="
          mt-7
        "
      >
        {resumes.length ===
        0 ? (
          <ResumeEmptyState />
        ) : filteredResumes.length ===
          0 ? (
          /* =====================================
             Search Empty State
          ===================================== */

          <div
            className="
              rounded-3xl

              border
              border-dashed
              border-stone-300
              dark:border-zinc-700

              bg-white/40
              dark:bg-zinc-900/30

              px-6
              py-16

              text-center
            "
          >
            <Search
              size={24}
              aria-hidden="true"
              className="
                mx-auto

                text-zinc-300
                dark:text-zinc-600
              "
            />

            <h2
              className="
                mt-4

                text-lg
                font-black

                text-zinc-950
                dark:text-white
              "
            >
              No resumes found
            </h2>

            <p
              className="
                mt-2

                text-sm

                text-zinc-500
                dark:text-zinc-400
              "
            >
              Try searching with
              another resume name.
            </p>
          </div>
        ) : (
          /* =====================================
             Resume Grid
          ===================================== */

          <div
            className="
              grid
              gap-5

              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {filteredResumes.map(
              (resume) => (
                <ResumeCard
                  key={
                    resume.id
                  }
                  resume={
                    resume
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Resumes;