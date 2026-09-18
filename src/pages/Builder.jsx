import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import BuilderHeader from "../components/builder/BuilderHeader";
import BuilderPreview from "../components/builder/BuilderPreview";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import BuilderWorkspace from "../components/builder/BuilderWorkspace";

import useResumeStore from "../stores/resumeStore";
import useUIStore from "../stores/uiStore";

import {
  exportResumeToPdf,
} from "../utils/pdfExporter";

const VALID_SECTIONS =
  new Set([
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "job-target",
    "analysis",
  ]);

const getRequestedSection = (
  section
) =>
  VALID_SECTIONS.has(
    section
  )
    ? section
    : "personal";

/* ========================================
   Builder Content

   This component is keyed by the current
   resume + requested section.

   When either changes, React creates a
   fresh BuilderContent instance, so the
   section state starts from the correct
   URL value without synchronizing local
   state from an effect.
======================================== */

const BuilderContent = ({
  resume,
  initialSection,
}) => {
  const [
    activeSection,
    setActiveSection,
  ] = useState(
    initialSection
  );

  const [
    tailoringReturnSection,
    setTailoringReturnSection,
  ] = useState(null);

  const [
    resumeExceedsOnePage,
    setResumeExceedsOnePage,
  ] = useState(false);

  const [
    isExporting,
    setIsExporting,
  ] = useState(false);

  const [
    exportError,
    setExportError,
  ] = useState("");

  const setActiveResume =
    useResumeStore(
      (state) =>
        state.setActiveResume
    );

  /* ========================================
     Set Active Resume
  ======================================== */

  useEffect(() => {
    if (!resume?.id) {
      return;
    }

    setActiveResume(
      resume.id
    );
  }, [
    resume?.id,
    setActiveResume,
  ]);

  /* ========================================
     Preview Overflow State
  ======================================== */

  const handleOverflowChange =
    useCallback(
      (overflowing) => {
        setResumeExceedsOnePage(
          overflowing
        );

        if (!overflowing) {
          setExportError(
            ""
          );
        }
      },
      []
    );

  /* ========================================
     Download PDF
  ======================================== */

  const handleDownloadPdf =
    async ({
      paperElement,
      contentElement,
    }) => {
      if (isExporting) {
        return;
      }

      /*
       * Fast UI guard based on the
       * preview's latest measurement.
       *
       * The exporter will still perform
       * its own final validation.
       */

      if (
        resumeExceedsOnePage
      ) {
        setExportError(
          "Your resume exceeds one A4 page. Shorten the content or use compact customization before exporting."
        );

        return;
      }

      if (
        !paperElement ||
        !contentElement
      ) {
        setExportError(
          "The resume preview is not ready yet. Please try again."
        );

        return;
      }

      setExportError("");

      setIsExporting(
        true
      );

      try {
        await exportResumeToPdf({
          element:
            paperElement,

          contentElement,

          resume,
        });
      } catch (error) {
        console.error(
          "Resume PDF export failed.",
          error
        );

        if (
          error?.code ===
          "RESUME_OVERFLOW"
        ) {
          setResumeExceedsOnePage(
            true
          );

          setExportError(
            "Your resume changed and now exceeds one A4 page. Adjust the content or customization before exporting."
          );

          return;
        }

        setExportError(
          "We could not generate the PDF. Please try again."
        );
      } finally {
        setIsExporting(
          false
        );
      }
    };

  /* ========================================
     Section Navigation
  ======================================== */

  const handleSectionChange = (
    section,
    options = {}
  ) => {
    const {
      fromAnalysis = false,
    } = options;

    if (fromAnalysis) {
      setTailoringReturnSection(
        "analysis"
      );
    }

    if (
      section ===
      "analysis"
    ) {
      setTailoringReturnSection(
        null
      );
    }

    setActiveSection(
      section
    );
  };

  const handleReturnToAnalysis =
    () => {
      setActiveSection(
        "analysis"
      );

      setTailoringReturnSection(
        null
      );
    };

  /* ========================================
     Builder
  ======================================== */

  return (
    <div
      className="
        min-h-screen

        bg-[#f8f7f4]
        dark:bg-[#111113]
      "
    >
      <BuilderHeader
        resume={resume}
      />

      <div
        className="
          grid
          min-w-0

          lg:grid-cols-[220px_minmax(0,1fr)_minmax(360px,0.9fr)]

          xl:grid-cols-[230px_minmax(0,1fr)_460px]
        "
      >
        <BuilderSidebar
          activeSection={
            activeSection
          }
          onSectionChange={
            handleSectionChange
          }
        />

        <BuilderWorkspace
          activeSection={
            activeSection
          }
          resume={resume}
          onSectionChange={
            handleSectionChange
          }
          showReturnToAnalysis={
            Boolean(
              tailoringReturnSection
            )
          }
          onReturnToAnalysis={
            handleReturnToAnalysis
          }
        />

        <BuilderPreview
          resume={resume}
          onOverflowChange={
            handleOverflowChange
          }
          onDownloadPdf={
            handleDownloadPdf
          }
          isExporting={
            isExporting
          }
          exportError={
            exportError
          }
        />
      </div>
    </div>
  );
};

const Builder = () => {
  const navigate =
    useNavigate();

  const {
    resumeId,
  } =
    useParams();

  const [
    searchParams,
  ] =
    useSearchParams();

  const requestedSection =
    searchParams.get(
      "section"
    );

  const resolvedRequestedSection =
    getRequestedSection(
      requestedSection
    );

  const creationStartedRef =
    useRef(false);

  const resumes =
    useResumeStore(
      (state) =>
        state.resumes
    );

  const addResume =
    useResumeStore(
      (state) =>
        state.addResume
    );

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
     Create New Resume
  ======================================== */

  useEffect(() => {
    if (resumeId) {
      return;
    }

    if (
      creationStartedRef.current
    ) {
      return;
    }

    creationStartedRef.current =
      true;

    const newResume =
      addResume({
        templateId:
          defaultTemplate,

        accentColor:
          defaultAccentColor,
      });

    const sectionQuery =
      VALID_SECTIONS.has(
        requestedSection
      )
        ? `?section=${encodeURIComponent(
            requestedSection
          )}`
        : "";

    navigate(
      `/builder/${newResume.id}${sectionQuery}`,
      {
        replace: true,
      }
    );
  }, [
    resumeId,
    requestedSection,
    addResume,
    navigate,
    defaultTemplate,
    defaultAccentColor,
  ]);

  /* ========================================
     Current Resume
  ======================================== */

  const resume =
    resumeId
      ? resumes.find(
          (item) =>
            item.id ===
            resumeId
        )
      : null;

  /* ========================================
     Creating State
  ======================================== */

  if (!resumeId) {
    return (
      <section
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center

          bg-[#f8f7f4]
          dark:bg-[#111113]

          px-4
          py-12
        "
      >
        <div
          className="
            text-center
          "
        >
          <div
            className="
              mx-auto

              h-9
              w-9

              animate-spin

              rounded-full

              border-2
              border-stone-200
              border-t-violet-600

              dark:border-zinc-800
              dark:border-t-violet-400
            "
          />

          <p
            className="
              mt-4

              text-sm
              font-semibold

              text-zinc-500
              dark:text-zinc-400
            "
          >
            Preparing your resume...
          </p>
        </div>
      </section>
    );
  }

  /* ========================================
     Invalid Resume
  ======================================== */

  if (!resume) {
    return (
      <Navigate
        to="/resumes"
        replace
      />
    );
  }

  /*
   * Changing the resume or URL-requested
   * section intentionally creates a fresh
   * BuilderContent instance.
   */

  return (
    <BuilderContent
      key={`${resume.id}:${resolvedRequestedSection}`}
      resume={resume}
      initialSection={
        resolvedRequestedSection
      }
    />
  );
};

export default Builder;