import {
  Copy,
  Edit3,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import useResumeStore from "../../stores/resumeStore";

import ConfirmDialog from "../ui/ConfirmDialog";

const ResumeCard = ({
  resume,
}) => {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const [
    isRenaming,
    setIsRenaming,
  ] = useState(false);

  const [
    showDeleteDialog,
    setShowDeleteDialog,
  ] = useState(false);

  const [
    title,
    setTitle,
  ] = useState(
    resume.title
  );

  const menuRef =
    useRef(null);

  /*
   * Prevent accidental rapid
   * duplicate actions.
   */
  const duplicateStartedRef =
    useRef(false);

  const renameResume =
    useResumeStore(
      (state) =>
        state.renameResume
    );

  const duplicateResume =
    useResumeStore(
      (state) =>
        state.duplicateResume
    );

  const deleteResume =
    useResumeStore(
      (state) =>
        state.deleteResume
    );

  /* ========================================
     Close Menu Outside
  ======================================== */

  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target
          )
        ) {
          setIsMenuOpen(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ========================================
     Date
  ======================================== */

  const formattedDate =
    resume.updatedAt
      ? new Intl.DateTimeFormat(
          "en",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        ).format(
          new Date(
            resume.updatedAt
          )
        )
      : "Recently";

  /* ========================================
     Rename
  ======================================== */

  const startRename =
    () => {
      setTitle(
        resume.title
      );

      setIsRenaming(
        true
      );

      setIsMenuOpen(
        false
      );
    };

  const saveRename =
    () => {
      const cleanTitle =
        title.trim();

      if (cleanTitle) {
        renameResume(
          resume.id,
          cleanTitle
        );
      } else {
        setTitle(
          resume.title
        );
      }

      setIsRenaming(
        false
      );
    };

  const handleTitleKeyDown =
    (event) => {
      if (
        event.key ===
        "Enter"
      ) {
        saveRename();
      }

      if (
        event.key ===
        "Escape"
      ) {
        setTitle(
          resume.title
        );

        setIsRenaming(
          false
        );
      }
    };

  /* ========================================
     Duplicate
  ======================================== */

  const handleDuplicate =
    () => {
      /*
       * Prevent multiple copies from
       * accidental rapid clicks.
       */

      if (
        duplicateStartedRef.current
      ) {
        return;
      }

      duplicateStartedRef.current =
        true;

      duplicateResume(
        resume.id
      );

      setIsMenuOpen(
        false
      );

      /*
       * Allow an intentional duplicate
       * action again after the short
       * protection window.
       */

      window.setTimeout(
        () => {
          duplicateStartedRef.current =
            false;
        },
        500
      );
    };

  /* ========================================
     Delete
  ======================================== */

  const handleDelete =
    () => {
      setIsMenuOpen(
        false
      );

      setShowDeleteDialog(
        true
      );
    };

  const confirmDelete =
    () => {
      deleteResume(
        resume.id
      );

      setShowDeleteDialog(
        false
      );
    };

  return (
    <article
      className="
        group

        min-w-0

        overflow-visible

        rounded-3xl

        border
        border-stone-200
        dark:border-zinc-800

        bg-white
        dark:bg-zinc-900

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-stone-300
        hover:shadow-lg
        hover:shadow-zinc-900/5

        dark:hover:border-zinc-700
        dark:hover:shadow-black/20
      "
    >
      {/* =====================================
          Resume Preview
      ===================================== */}

      <Link
        to={`/builder/${resume.id}`}
        className="
          block

          overflow-hidden

          rounded-t-3xl

          bg-[#f5f3ef]
          dark:bg-zinc-950

          p-6
        "
      >
        <div
          className="
            mx-auto

            aspect-[1/1.414]
            w-full
            max-w-[210px]

            overflow-hidden

            rounded-lg

            border
            border-stone-200

            bg-white

            p-5

            shadow-md

            transition-transform
            duration-300

            group-hover:scale-[1.015]
          "
        >
          {/* Name */}

          <div
            className="
              border-b
              border-zinc-200

              pb-3
            "
          >
            <div
              className="
                h-3
                w-24

                rounded-full

                bg-zinc-900
              "
            />

            <div
              className="
                mt-2

                h-1.5
                w-16

                rounded-full

                bg-violet-500
              "
            />
          </div>

          {/* Summary */}

          <div
            className="
              mt-4
            "
          >
            <div
              className="
                h-1.5
                w-14

                rounded-full

                bg-zinc-700
              "
            />

            <div
              className="
                mt-3
                space-y-1.5
              "
            >
              <div
                className="
                  h-1
                  w-full

                  rounded-full

                  bg-zinc-200
                "
              />

              <div
                className="
                  h-1
                  w-[90%]

                  rounded-full

                  bg-zinc-200
                "
              />

              <div
                className="
                  h-1
                  w-[72%]

                  rounded-full

                  bg-zinc-200
                "
              />
            </div>
          </div>

          {/* Experience */}

          <div
            className="
              mt-5
            "
          >
            <div
              className="
                h-1.5
                w-16

                rounded-full

                bg-zinc-700
              "
            />

            <div
              className="
                mt-3
                space-y-4
              "
            >
              {[1, 2].map(
                (item) => (
                  <div
                    key={item}
                  >
                    <div
                      className="
                        h-1.5
                        w-20

                        rounded-full

                        bg-zinc-400
                      "
                    />

                    <div
                      className="
                        mt-2
                        space-y-1.5
                      "
                    >
                      <div
                        className="
                          h-1
                          w-full

                          rounded-full

                          bg-zinc-200
                        "
                      />

                      <div
                        className="
                          h-1
                          w-[82%]

                          rounded-full

                          bg-zinc-200
                        "
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* =====================================
          Resume Information
      ===================================== */}

      <div
        className="
          relative

          p-5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
          <div
            className="
              min-w-0
              flex-1
            "
          >
            {isRenaming ? (
              <input
                type="text"
                value={title}
                autoFocus
                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target
                      .value
                  )
                }
                onBlur={
                  saveRename
                }
                onKeyDown={
                  handleTitleKeyDown
                }
                aria-label="Resume title"
                className="
                  w-full
                  min-w-0

                  rounded-lg

                  border
                  border-violet-300
                  dark:border-violet-800

                  bg-white
                  dark:bg-zinc-950

                  px-2.5
                  py-1.5

                  text-sm
                  font-black

                  text-zinc-950
                  dark:text-white

                  outline-none

                  focus:ring-2
                  focus:ring-violet-500/20
                "
              />
            ) : (
              <h2
                title={
                  resume.title
                }
                className="
                  min-h-12

                  line-clamp-2

                  text-base
                  font-black
                  leading-6
                  tracking-[-0.02em]

                  text-zinc-950
                  dark:text-white
                "
              >
                {resume.title}
              </h2>
            )}

            <p
              className="
                mt-1

                text-xs
                font-medium

                text-zinc-400
                dark:text-zinc-500
              "
            >
              Updated{" "}
              {formattedDate}
            </p>
          </div>

          {/* Menu */}

          <div
            ref={menuRef}
            className="
              relative
              shrink-0
            "
          >
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(
                  (current) =>
                    !current
                )
              }
              aria-label={`Actions for ${resume.title}`}
              aria-expanded={
                isMenuOpen
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center

                rounded-xl

                border
                border-stone-200
                dark:border-zinc-800

                text-zinc-500
                dark:text-zinc-400

                transition-colors

                hover:bg-stone-100
                hover:text-zinc-950

                dark:hover:bg-zinc-800
                dark:hover:text-white
              "
            >
              <MoreVertical
                size={16}
                aria-hidden="true"
              />
            </button>

            {isMenuOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-11
                  z-30

                  w-44

                  overflow-hidden

                  rounded-xl

                  border
                  border-stone-200
                  dark:border-zinc-800

                  bg-white
                  dark:bg-zinc-900

                  p-1.5

                  shadow-xl
                  shadow-zinc-900/10

                  dark:shadow-black/30
                "
              >
                <button
                  type="button"
                  onClick={
                    startRename
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3

                    rounded-lg

                    px-3
                    py-2.5

                    text-left
                    text-sm
                    font-semibold

                    text-zinc-700
                    dark:text-zinc-300

                    transition-colors

                    hover:bg-stone-100
                    dark:hover:bg-zinc-800
                  "
                >
                  <Pencil
                    size={14}
                    aria-hidden="true"
                  />

                  Rename
                </button>

                <button
                  type="button"
                  onClick={
                    handleDuplicate
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3

                    rounded-lg

                    px-3
                    py-2.5

                    text-left
                    text-sm
                    font-semibold

                    text-zinc-700
                    dark:text-zinc-300

                    transition-colors

                    hover:bg-stone-100
                    dark:hover:bg-zinc-800
                  "
                >
                  <Copy
                    size={14}
                    aria-hidden="true"
                  />

                  Duplicate
                </button>

                <div
                  className="
                    my-1

                    border-t
                    border-stone-100
                    dark:border-zinc-800
                  "
                />

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3

                    rounded-lg

                    px-3
                    py-2.5

                    text-left
                    text-sm
                    font-semibold

                    text-rose-600
                    dark:text-rose-400

                    transition-colors

                    hover:bg-rose-50
                    dark:hover:bg-rose-950/20
                  "
                >
                  <Trash2
                    size={14}
                    aria-hidden="true"
                  />

                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit */}

        <Link
          to={`/builder/${resume.id}`}
          className="
            mt-5

            inline-flex
            w-full
            items-center
            justify-center
            gap-2

            rounded-xl

            border
            border-stone-200
            dark:border-zinc-800

            px-4
            py-2.5

            text-sm
            font-bold

            text-zinc-700
            dark:text-zinc-200

            transition-colors

            hover:border-violet-300
            hover:bg-violet-50
            hover:text-violet-700

            dark:hover:border-violet-800
            dark:hover:bg-violet-950/20
            dark:hover:text-violet-300
          "
        >
          <Edit3
            size={15}
            aria-hidden="true"
          />

          Edit Resume
        </Link>
      </div>

      {/* =====================================
          Delete Confirmation
      ===================================== */}

      <ConfirmDialog
        open={
          showDeleteDialog
        }
        title="Delete this resume?"
        description={`"${resume.title}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete Resume"
        onCancel={() =>
          setShowDeleteDialog(
            false
          )
        }
        onConfirm={
          confirmDelete
        }
      />
    </article>
  );
};

export default ResumeCard;