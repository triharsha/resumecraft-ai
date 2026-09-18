import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";

import ImportPreview from "./ImportPreview";

const ResumeImportDialog = ({
  open,
  fileName = "",
  parsedResult = null,
  onCancel,
  onImport,
}) => {
  if (!open || !parsedResult) {
    return null;
  }

  const {
    resume,
    confidence,
  } = parsedResult;

  const importCoverage =
    confidence?.score ?? 0;

  const detectedCount =
    confidence?.checks?.filter(
      (check) =>
        check.detected
    ).length ?? 0;

  const totalCount =
    confidence?.checks?.length ??
    0;

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]

        flex
        items-end
        justify-center

        bg-black/50
        p-0

        backdrop-blur-sm

        sm:items-center
        sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-import-title"
    >
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-4xl
          flex-col

          overflow-hidden

          rounded-t-[28px]
          border
          border-zinc-200

          bg-[#f8f7f4]

          shadow-2xl

          dark:border-zinc-800
          dark:bg-[#111113]

          sm:rounded-[28px]
        "
      >
        {/* =================================
            Header
        ================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4

            border-b
            border-zinc-200

            bg-white

            px-5
            py-5

            dark:border-zinc-800
            dark:bg-zinc-950

            sm:px-7
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
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                rounded-2xl

                bg-violet-100
                text-violet-700

                dark:bg-violet-950/50
                dark:text-violet-300
              "
            >
              <FileText
                size={20}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="resume-import-title"
                className="
                  text-lg
                  font-black
                  text-zinc-950

                  dark:text-white

                  sm:text-xl
                "
              >
                Review imported resume
              </h2>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-semibold
                  text-zinc-500

                  dark:text-zinc-400
                "
              >
                {fileName ||
                  "Selected resume PDF"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close import preview"
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

              hover:bg-zinc-100
              hover:text-zinc-700

              dark:hover:bg-zinc-800
              dark:hover:text-white
            "
          >
            <X
              size={18}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* =================================
            Scrollable Body
        ================================= */}

        <div
          className="
            flex-1
            overflow-y-auto

            px-5
            py-5

            sm:px-7
            sm:py-6
          "
        >
          {/* =================================
              Import Coverage
          ================================= */}

          <div
            className="
              mb-5
              grid
              gap-3

              sm:grid-cols-[auto_1fr]
              sm:items-stretch
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-violet-200

                bg-violet-50

                p-4

                dark:border-violet-900/60
                dark:bg-violet-950/30

                sm:min-w-44
              "
            >
              <p
                className="
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.1em]

                  text-violet-600
                  dark:text-violet-300
                "
              >
                Import coverage
              </p>

              <p
                className="
                  mt-2
                  text-3xl
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                {importCoverage}%
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                {detectedCount} of{" "}
                {totalCount} sections
                detected
              </p>
            </div>

            <div
              className="
                flex
                items-start
                gap-3

                rounded-2xl
                border
                border-amber-200

                bg-amber-50

                p-4

                dark:border-amber-900/60
                dark:bg-amber-950/20
              "
            >
              <AlertTriangle
                size={18}
                className="
                  mt-0.5
                  shrink-0
                  text-amber-600
                  dark:text-amber-400
                "
                aria-hidden="true"
              />

              <div>
                <p
                  className="
                    text-sm
                    font-black

                    text-zinc-900
                    dark:text-zinc-100
                  "
                >
                  Review before importing
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5

                    text-zinc-600
                    dark:text-zinc-400
                  "
                >
                  ResumeCraft extracted
                  this information from
                  your PDF. PDF layouts
                  vary, so some fields may
                  need adjustment after
                  import.
                </p>
              </div>
            </div>
          </div>

          {/* =================================
              Parsed Resume
          ================================= */}

          <ImportPreview
            resume={resume}
          />
        </div>

        {/* =================================
            Footer
        ================================= */}

        <div
          className="
            border-t
            border-zinc-200

            bg-white

            px-5
            py-4

            dark:border-zinc-800
            dark:bg-zinc-950

            sm:px-7
          "
        >
          <div
            className="
              flex
              flex-col-reverse
              gap-3

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-center
                text-[11px]
                font-semibold
                leading-5

                text-zinc-400

                sm:max-w-sm
                sm:text-left
              "
            >
              Importing will create a new
              resume. Your existing
              resumes will not be changed.
            </p>

            <div
              className="
                flex
                flex-col-reverse
                gap-2

                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={onCancel}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center

                  rounded-xl
                  border
                  border-zinc-200

                  bg-white

                  px-5

                  text-sm
                  font-black
                  text-zinc-700

                  transition

                  hover:bg-zinc-50

                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:text-zinc-200
                  dark:hover:bg-zinc-800
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onImport}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-zinc-950

                  px-5

                  text-sm
                  font-black
                  text-white

                  transition

                  hover:bg-zinc-800

                  dark:bg-white
                  dark:text-zinc-950
                  dark:hover:bg-zinc-200
                "
              >
                <CheckCircle2
                  size={17}
                  aria-hidden="true"
                />

                Import Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeImportDialog;