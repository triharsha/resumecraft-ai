import {
  ArrowLeft,
} from "lucide-react";

import AnalysisDashboard from "./analysis/AnalysisDashboard";

import CertificationsForm from "./forms/CertificationsForm";
import EducationForm from "./forms/EducationForm";
import ExperienceForm from "./forms/ExperienceForm";
import JobTargetForm from "./forms/JobTargetForm";
import LanguagesForm from "./forms/LanguagesForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ProjectsForm from "./forms/ProjectsForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";

/* ========================================
   Workspace Shell
======================================== */

const WorkspaceShell = ({
  children,
  showReturnToAnalysis,
  onReturnToAnalysis,
}) => {
  return (
    <main
      id="builder-workspace"
      tabIndex={-1}
      className="
        min-w-0

        p-4

        sm:p-6
        lg:p-8
      "
    >
      {/* =====================================
          Return To Analysis
      ===================================== */}

      {showReturnToAnalysis && (
        <div
          role="status"
          aria-label="Resume tailoring workflow"
          className="
            mb-4

            flex
            flex-col
            gap-3

            rounded-2xl

            border
            border-violet-200

            bg-violet-50/70

            px-4
            py-3

            dark:border-violet-900/40
            dark:bg-violet-950/20

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-xs
                font-black

                text-violet-800

                dark:text-violet-200
              "
            >
              Tailoring your resume
            </p>

            <p
              className="
                mt-0.5

                text-[11px]
                leading-4

                text-violet-600

                dark:text-violet-300
              "
            >
              Make your changes, then
              return to Analysis to see
              the updated result.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onReturnToAnalysis
            }
            className="
              inline-flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-violet-600

              px-3.5
              py-2.5

              text-xs
              font-black

              text-white

              transition-colors

              hover:bg-violet-700

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-violet-500
              focus-visible:ring-offset-2

              dark:focus-visible:ring-violet-400
              dark:focus-visible:ring-offset-zinc-900

              sm:w-auto
            "
          >
            <ArrowLeft
              size={14}
              aria-hidden="true"
            />

            <span>
              Return to Analysis
            </span>
          </button>
        </div>
      )}

      {/* =====================================
          Workspace Card
      ===================================== */}

      <div
        className="
          min-w-0

          rounded-3xl

          border
          border-stone-200

          bg-white

          p-5

          shadow-sm

          dark:border-zinc-800
          dark:bg-zinc-900

          sm:p-6
          lg:p-8
        "
      >
        {children}
      </div>
    </main>
  );
};

/* ========================================
   Analysis Shell
======================================== */

const AnalysisShell = ({
  children,
}) => {
  return (
    <main
      id="builder-workspace"
      tabIndex={-1}
      className="
        min-w-0

        p-4

        sm:p-6
        lg:p-8
      "
    >
      {children}
    </main>
  );
};

/* ========================================
   Builder Workspace
======================================== */

const BuilderWorkspace = ({
  activeSection,
  resume,
  onSectionChange,
  showReturnToAnalysis = false,
  onReturnToAnalysis,
}) => {
  /* ========================================
     Personal Information
  ======================================== */

  if (
    activeSection ===
    "personal"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <PersonalInfoForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Summary
  ======================================== */

  if (
    activeSection ===
    "summary"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <SummaryForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Experience
  ======================================== */

  if (
    activeSection ===
    "experience"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <ExperienceForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Education
  ======================================== */

  if (
    activeSection ===
    "education"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <EducationForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Skills
  ======================================== */

  if (
    activeSection ===
    "skills"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <SkillsForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Projects
  ======================================== */

  if (
    activeSection ===
    "projects"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <ProjectsForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Certifications
  ======================================== */

  if (
    activeSection ===
    "certifications"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <CertificationsForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Languages
  ======================================== */

  if (
    activeSection ===
    "languages"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <LanguagesForm
          resume={resume}
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Job Target
  ======================================== */

  if (
    activeSection ===
    "job-target"
  ) {
    return (
      <WorkspaceShell
        showReturnToAnalysis={
          showReturnToAnalysis
        }
        onReturnToAnalysis={
          onReturnToAnalysis
        }
      >
        <JobTargetForm
          resume={resume}
          onSectionChange={
            onSectionChange
          }
        />
      </WorkspaceShell>
    );
  }

  /* ========================================
     Analysis
  ======================================== */

  if (
    activeSection ===
    "analysis"
  ) {
    return (
      <AnalysisShell>
        <AnalysisDashboard
          resume={resume}
          onSectionChange={
            onSectionChange
          }
        />
      </AnalysisShell>
    );
  }

  /* ========================================
     Fallback
  ======================================== */

  return (
    <WorkspaceShell
      showReturnToAnalysis={
        false
      }
    >
      <div
        className="
          py-12
          text-center
        "
      >
        <p
          className="
            text-sm
            font-semibold

            text-zinc-500

            dark:text-zinc-400
          "
        >
          Select a resume section to
          start editing.
        </p>
      </div>
    </WorkspaceShell>
  );
};

export default BuilderWorkspace;
