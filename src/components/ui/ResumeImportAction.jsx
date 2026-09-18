import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import ResumeImportDialog from "../import/ResumeImportDialog";

import useResumeStore from "../../stores/resumeStore";
import useUIStore from "../../stores/uiStore";

import {
  extractTextFromPdf,
} from "../../utils/resumeImport/pdfTextExtractor";

import {
  parseResumeText,
} from "../../utils/resumeImport/resumeTextParser";

import {
  createImportedResumeData,
} from "../../utils/resumeImport/importResume";

const ResumeImportAction = ({
  children,
}) => {
  const navigate =
    useNavigate();

  const inputRef =
    useRef(null);

  /* ========================================
     Resume Store
  ======================================== */

  const addResume =
    useResumeStore(
      (state) =>
        state.addResume
    );

  const updateResume =
    useResumeStore(
      (state) =>
        state.updateResume
    );

  const deleteResume =
    useResumeStore(
      (state) =>
        state.deleteResume
    );

  /* ========================================
     Resume Defaults
  ======================================== */

  const defaultTemplate =
    useUIStore(
      (state) =>
        state.defaultTemplate
    );

  const defaultAccentColor =
    useUIStore(
      (state) =>
        state.defaultAccentColor
    );

  /* ========================================
     State
  ======================================== */

  const [
    parsedResult,
    setParsedResult,
  ] = useState(null);

  const [
    fileName,
    setFileName,
  ] = useState("");

  const [
    importError,
    setImportError,
  ] = useState("");

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  const [
    isImporting,
    setIsImporting,
  ] = useState(false);

  const [
    filePickerRequest,
    setFilePickerRequest,
  ] = useState(0);

  /* ========================================
     Auto Hide Error
  ======================================== */

  useEffect(() => {
    if (!importError) {
      return undefined;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          setImportError("");
        },
        6000
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    importError,
  ]);

  /* ========================================
     Reset File Input
  ======================================== */

  const resetInput =
    () => {
      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    };

  /* ========================================
     Request PDF Picker

     This callback is safe to pass through
     the render prop because it does not
     access the input ref.
  ======================================== */

  const openFilePicker =
    () => {
      if (
        isProcessing ||
        isImporting
      ) {
        return;
      }

      setImportError("");

      setFilePickerRequest(
        (current) =>
          current + 1
      );
    };

  /* ========================================
     Open Native PDF Picker

     Ref access happens after rendering,
     inside an effect rather than through
     the render-prop invocation.
  ======================================== */

  useEffect(() => {
    if (
      filePickerRequest === 0
    ) {
      return;
    }

    if (
      !inputRef.current
    ) {
      return;
    }

    inputRef.current.value =
      "";

    inputRef.current.click();
  }, [
    filePickerRequest,
  ]);

  /* ========================================
     Read + Parse PDF
  ======================================== */

  const handleFileChange =
    async (event) => {
      const file =
        event.target
          .files?.[0];

      if (!file) {
        return;
      }

      setImportError("");

      setParsedResult(
        null
      );

      setFileName(
        file.name
      );

      setIsProcessing(
        true
      );

      try {
        /* =====================================
           Validate PDF
        ===================================== */

        const isPdf =
          file.type ===
            "application/pdf" ||
          file.name
            .toLowerCase()
            .endsWith(
              ".pdf"
            );

        if (!isPdf) {
          throw new Error(
            "Please select a PDF resume."
          );
        }

        /* =====================================
           Extract Text
        ===================================== */

        const extracted =
          await extractTextFromPdf(
            file
          );

        if (
          !extracted
            ?.text
            ?.trim()
        ) {
          throw new Error(
            "ResumeCraft could not find readable text in this PDF."
          );
        }

        /* =====================================
           Parse Resume
        ===================================== */

        const parsed =
          parseResumeText(
            extracted.text
          );

        if (
          !parsed?.resume
        ) {
          throw new Error(
            "ResumeCraft could not detect resume information in this PDF."
          );
        }

        /*
         * Nothing is saved yet.
         *
         * The user first reviews
         * the extracted information.
         */

        setParsedResult(
          parsed
        );
      } catch (error) {
        console.error(
          "Resume PDF import failed.",
          error
        );

        setParsedResult(
          null
        );

        setFileName("");

        setImportError(
          error?.message ||
            "ResumeCraft could not read this resume PDF."
        );
      } finally {
        setIsProcessing(
          false
        );

        resetInput();
      }
    };

  /* ========================================
     Cancel Preview
  ======================================== */

  const handleCancel =
    () => {
      if (isImporting) {
        return;
      }

      setParsedResult(
        null
      );

      setFileName("");

      setImportError("");

      resetInput();
    };

  /* ========================================
     Import Resume
  ======================================== */

  const handleImport =
    () => {
      if (
        !parsedResult?.resume ||
        isImporting
      ) {
        return;
      }

      setIsImporting(
        true
      );

      setImportError("");

      /*
       * Tracks the newly-created resume.
       *
       * If anything fails after creation,
       * the catch block removes it so the
       * import behaves transactionally.
       */

      let createdResumeId =
        null;

      try {
        /* =====================================
           Build Complete Resume Data

           Settings defaults affect only:
           - template
           - starting accent

           Parsed PDF content remains untouched.
        ===================================== */

        const importedData =
          createImportedResumeData(
            parsedResult.resume,
            {
              templateId:
                defaultTemplate,

              accentColor:
                defaultAccentColor,
            }
          );

        /* =====================================
           Create Resume
        ===================================== */

        const newResume =
          addResume({
            title:
              importedData.title,

            templateId:
              importedData.templateId,

            accentColor:
              importedData
                .customization
                .accentColor,
          });

        if (!newResume?.id) {
          throw new Error(
            "ResumeCraft could not create the imported resume."
          );
        }

        createdResumeId =
          newResume.id;

        /* =====================================
           Populate Parsed Content
        ===================================== */

        updateResume(
          newResume.id,
          {
            title:
              importedData.title,

            templateId:
              importedData.templateId,

            isFresher:
              importedData.isFresher,

            personalInfo:
              importedData.personalInfo,

            summary:
              importedData.summary,

            experience:
              importedData.experience,

            education:
              importedData.education,

            skills:
              importedData.skills,

            projects:
              importedData.projects,

            certifications:
              importedData.certifications,

            languages:
              importedData.languages,

            jobTarget:
              importedData.jobTarget,

            analysis:
              importedData.analysis,

            customization:
              importedData.customization,
          }
        );

        /* =====================================
           Verify Stored Resume
        ===================================== */

        const storedResume =
          useResumeStore
            .getState()
            .resumes.find(
              (resume) =>
                resume.id ===
                newResume.id
            );

        if (!storedResume) {
          throw new Error(
            "ResumeCraft could not save the imported resume."
          );
        }

        /* =====================================
           Clear Import UI
        ===================================== */

        setParsedResult(
          null
        );

        setFileName("");

        /* =====================================
           Open Builder
        ===================================== */

        navigate(
          `/builder/${newResume.id}`
        );
      } catch (error) {
        console.error(
          "Imported resume creation failed.",
          error
        );

        /* =====================================
           Roll Back Partial Import
        ===================================== */

        if (
          createdResumeId
        ) {
          deleteResume(
            createdResumeId
          );
        }

        setImportError(
          error?.message ||
            "ResumeCraft could not create the imported resume."
        );

        setIsImporting(
          false
        );
      }
    };

  /* ========================================
     Render
  ======================================== */

  return (
    <>
      {/* =====================================
          Existing Trigger
      ===================================== */}

      {children({
        openFilePicker,
        isProcessing,
        isImporting,
      })}

      {/* =====================================
          Hidden PDF Input
      ===================================== */}

      <input
        ref={
          inputRef
        }
        type="file"
        accept=".pdf,application/pdf"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      {/* =====================================
          Processing Toast
      ===================================== */}

      {isProcessing && (
        <div
          role="status"
          aria-live="polite"
          className="
            fixed
            bottom-4
            left-4
            right-4
            z-[140]

            rounded-2xl

            border
            border-violet-200

            bg-white

            p-4

            shadow-2xl

            dark:border-violet-900/60
            dark:bg-zinc-900

            sm:bottom-6
            sm:left-auto
            sm:right-6
            sm:w-[360px]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                h-5
                w-5
                shrink-0

                animate-spin

                rounded-full

                border-2
                border-violet-200
                border-t-violet-600

                dark:border-violet-900
                dark:border-t-violet-300
              "
              aria-hidden="true"
            />

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  text-sm
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                Reading your resume
              </p>

              <p
                className="
                  mt-0.5

                  text-xs
                  font-medium

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Extracting and
                analyzing PDF
                content...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          Error Toast
      ===================================== */}

      {importError &&
        !isProcessing && (
          <div
            role="alert"
            aria-live="assertive"
            className="
              fixed
              bottom-4
              left-4
              right-4
              z-[140]

              rounded-2xl

              border
              border-rose-200

              bg-white

              p-4

              shadow-2xl

              dark:border-rose-900/60
              dark:bg-zinc-900

              sm:bottom-6
              sm:left-auto
              sm:right-6
              sm:w-[420px]
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-rose-50
                  text-rose-600

                  dark:bg-rose-950/40
                  dark:text-rose-400
                "
              >
                <AlertCircle
                  size={17}
                  aria-hidden="true"
                />
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-sm
                    font-black

                    text-zinc-950
                    dark:text-white
                  "
                >
                  Import failed
                </p>

                <p
                  className="
                    mt-1

                    text-xs
                    font-medium
                    leading-5

                    text-zinc-600
                    dark:text-zinc-400
                  "
                >
                  {
                    importError
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setImportError(
                    ""
                  )
                }
                aria-label="Dismiss import error"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center

                  rounded-lg

                  text-zinc-400

                  transition-colors

                  hover:bg-zinc-100
                  hover:text-zinc-700

                  dark:hover:bg-zinc-800
                  dark:hover:text-zinc-200
                "
              >
                <X
                  size={16}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        )}

      {/* =====================================
          Import Preview
      ===================================== */}

      <ResumeImportDialog
        open={Boolean(
          parsedResult
        )}
        fileName={
          fileName
        }
        parsedResult={
          parsedResult
        }
        onCancel={
          handleCancel
        }
        onImport={
          handleImport
        }
      />
    </>
  );
};

export default ResumeImportAction;