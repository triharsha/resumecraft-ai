import {
  useEffect,
} from "react";

import {
  analyzeResume,
} from "../../../utils/ats";

import {
  analyzeTailoring,
} from "../../../utils/ats/tailoringAnalyzer";

import useResumeStore from "../../../stores/resumeStore";

import KeywordAnalysis from "./KeywordAnalysis";
import OverallScoreCard from "./OverallScoreCard";
import ScoreBreakdown from "./ScoreBreakdown";
import SuggestionsPanel from "./SuggestionsPanel";
import TailoringRecommendations from "./TailoringRecommendations";

const AnalysisDashboard = ({
  resume,
  onSectionChange,
}) => {
  const analysis =
    analyzeResume(resume);

  const updateAnalysis =
    useResumeStore(
      (state) =>
        state.updateAnalysis
    );

  useEffect(() => {
    if (
      resume?.analysis
        ?.hasAnalyzed !== true
    ) {
      return;
    }

    const storedScore =
      Number(
        resume?.analysis
          ?.overallScore
      ) || 0;

    if (
      storedScore ===
      analysis.overallScore
    ) {
      return;
    }

    updateAnalysis(
      resume.id,
      {
        overallScore:
          analysis.overallScore,
      }
    );
  }, [
    resume.id,
    resume?.analysis
      ?.hasAnalyzed,
    resume?.analysis
      ?.overallScore,
    analysis.overallScore,
    updateAnalysis,
  ]);

  const tailoring =
    analyzeTailoring(resume);

  const hasJobDescription =
    Boolean(
      resume?.jobTarget
        ?.jobDescription?.trim()
    );

  const headingId =
    "resume-analysis-heading";

  const descriptionId =
    "resume-analysis-description";

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      className="space-y-6"
    >
      {/* =====================================
          Analysis Header
      ===================================== */}

      <div>
        <p
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.15em]

            text-violet-600

            dark:text-violet-400
          "
        >
          ATS Intelligence
        </p>

        <h2
          id={headingId}
          className="
            mt-3

            text-2xl
            font-black
            tracking-[-0.04em]

            text-zinc-950

            dark:text-white

            sm:text-3xl
          "
        >
          Resume Analysis
        </h2>

        <p
          id={descriptionId}
          className="
            mt-2
            max-w-2xl

            text-sm
            leading-6

            text-zinc-500

            dark:text-zinc-400
          "
        >
          Review resume structure,
          content strength, measurable
          impact and alignment with your
          target job description.
        </p>
      </div>

      {/* =====================================
          Overall Score
      ===================================== */}

      <OverallScoreCard
        score={
          analysis.overallScore
        }
        hasJobDescription={
          hasJobDescription
        }
      />

      {/* =====================================
          Score Breakdown
      ===================================== */}

      <ScoreBreakdown
        analysis={analysis}
        hasJobDescription={
          hasJobDescription
        }
      />

      {/* =====================================
          Keyword Intelligence
      ===================================== */}

      <KeywordAnalysis
        score={
          analysis.keywordScore
        }
        matchedKeywords={
          analysis.matchedKeywords
        }
        missingKeywords={
          analysis.missingKeywords
        }
        keywordDetails={
          analysis.keywordDetails
        }
        highPriorityMissing={
          analysis.highPriorityMissing
        }
        matchedCount={
          analysis.matchedCount
        }
        missingCount={
          analysis.missingCount
        }
        totalKeywords={
          analysis.totalKeywords
        }
        hasJobDescription={
          hasJobDescription
        }
      />

      {/* =====================================
          Job Tailoring
      ===================================== */}

      <TailoringRecommendations
        resume={resume}
        tailoring={tailoring}
        onSectionChange={
          onSectionChange
        }
      />

      {/* =====================================
          General ATS Suggestions
      ===================================== */}

      <SuggestionsPanel
        suggestions={
          analysis.suggestions
        }
        onSectionChange={
          onSectionChange
        }
      />
    </section>
  );
};

export default AnalysisDashboard;