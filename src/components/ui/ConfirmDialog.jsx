import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
} from "react";

import {
  createPortal,
} from "react-dom";

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef =
    useRef(null);

  const confirmationStartedRef =
    useRef(false);

  /* ========================================
     Reset Confirmation Guard
  ======================================== */

  useEffect(() => {
    if (open) {
      confirmationStartedRef.current =
        false;
    }
  }, [open]);

  /* ========================================
     Keyboard + Focus
  ======================================== */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousActiveElement =
      document.activeElement;

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        onCancel();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const frameId =
      requestAnimationFrame(
        () => {
          cancelButtonRef.current
            ?.focus();
        }
      );

    return () => {
      cancelAnimationFrame(
        frameId
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousActiveElement
        ?.focus?.();
    };
  }, [
    open,
    onCancel,
  ]);

  /* ========================================
     Confirm
  ======================================== */

  const handleConfirm =
    () => {
      if (
        confirmationStartedRef.current
      ) {
        return;
      }

      confirmationStartedRef.current =
        true;

      onConfirm();
    };

  /* ========================================
     Hidden State
  ======================================== */

  if (
    !open ||
    typeof document ===
      "undefined"
  ) {
    return null;
  }

  const isDanger =
    tone === "danger";

  /* ========================================
     Dialog
  ======================================== */

  const dialog = (
    <div
      className="
        fixed
        inset-0
        z-[100]

        flex
        items-center
        justify-center

        bg-zinc-950/50

        p-4

        backdrop-blur-[2px]
      "
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="
          w-full
          max-w-md

          rounded-3xl

          border
          border-stone-200

          bg-white

          p-5

          shadow-2xl

          dark:border-zinc-800
          dark:bg-zinc-900

          sm:p-6
        "
      >
        {/* =====================================
            Header
        ===================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-3
            "
          >
            <div
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                ${
                  isDanger
                    ? `
                        bg-rose-50
                        text-rose-600

                        dark:bg-rose-950/30
                        dark:text-rose-400
                      `
                    : `
                        bg-violet-50
                        text-violet-600

                        dark:bg-violet-950/30
                        dark:text-violet-400
                      `
                }
              `}
            >
              <AlertTriangle
                size={18}
                aria-hidden="true"
              />
            </div>

            <div
              className="
                min-w-0
                pt-0.5
              "
            >
              <h2
                id="confirm-dialog-title"
                className="
                  text-base
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                {title}
              </h2>

              <p
                id="confirm-dialog-description"
                className="
                  mt-1.5

                  text-sm
                  leading-6

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onCancel
            }
            aria-label="Close confirmation dialog"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-xl

              text-zinc-400

              transition-colors

              hover:bg-stone-100
              hover:text-zinc-700

              focus:outline-none
              focus:ring-2
              focus:ring-violet-500

              dark:hover:bg-zinc-800
              dark:hover:text-zinc-200
            "
          >
            <X
              size={17}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* =====================================
            Actions
        ===================================== */}

        <div
          className="
            mt-6

            flex
            flex-col-reverse
            gap-2.5

            sm:flex-row
            sm:justify-end
          "
        >
          <button
            ref={
              cancelButtonRef
            }
            type="button"
            onClick={
              onCancel
            }
            className="
              inline-flex
              items-center
              justify-center

              rounded-xl

              border
              border-stone-200

              bg-white

              px-4
              py-2.5

              text-sm
              font-bold

              text-zinc-700

              transition-colors

              hover:bg-stone-50

              focus:outline-none
              focus:ring-2
              focus:ring-violet-500
              focus:ring-offset-2

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-200
              dark:hover:bg-zinc-800
              dark:focus:ring-offset-zinc-900
            "
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={
              handleConfirm
            }
            className={`
              inline-flex
              items-center
              justify-center

              rounded-xl

              px-4
              py-2.5

              text-sm
              font-black

              text-white

              transition-colors

              focus:outline-none
              focus:ring-2
              focus:ring-offset-2

              dark:focus:ring-offset-zinc-900

              ${
                isDanger
                  ? `
                      bg-rose-600

                      hover:bg-rose-700

                      focus:ring-rose-500
                    `
                  : `
                      bg-violet-600

                      hover:bg-violet-700

                      focus:ring-violet-500
                    `
              }
            `}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  /* ========================================
     Portal
  ======================================== */

  return createPortal(
    dialog,
    document.body
  );
};

export default ConfirmDialog;