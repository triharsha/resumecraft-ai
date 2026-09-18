import {
  useState,
} from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleAlert,
  FileText,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import {
  tailorResume,
} from "../../../services/aiService";

import useResumeStore from "../../../stores/resumeStore";

/* ========================================
   Helpers
======================================== */

const getPriorityStyles = (
  priority
) => {
  if (priority === "high") {
    return `
      border-red-200
      bg-red-50
      text-red-700

      dark:border-red-900/50
      dark:bg-red-950/30
      dark:text-red-300
    `;
  }

  if (priority === "medium") {
    return `
      border-amber-200
      bg-amber-50
      text-amber-700

      dark:border-amber-900/50
      dark:bg-amber-950/30
      dark:text-amber-300
    `;
  }

  return `
    border-stone-200
    bg-stone-50
    text-zinc-600

    dark:border-zinc-700
    dark:bg-zinc-800
    dark:text-zinc-300
  `;
};

const getTypeLabel = (
  type
) => {
  if (type === "technical") {
    return "Technical";
  }

  if (type === "soft-skill") {
    return "Soft Skill";
  }

  return "Domain";
};

const getSectionLabel = (
  section
) => {
  const labels = {
    skills: "Skills",
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
  };

  return (
    labels[section] ||
    "Resume"
  );
};

const getSkillName = (
  skill
) => {
  if (
    typeof skill === "string"
  ) {
    return skill.trim();
  }

  if (
    skill &&
    typeof skill === "object"
  ) {
    return String(
      skill.name || ""
    ).trim();
  }

  return "";
};

const createSkill = (
  skills,
  skillName
) => {
  const usesObjects =
    skills.some(
      (skill) =>
        skill &&
        typeof skill ===
          "object" &&
        !Array.isArray(skill)
    );

  if (!usesObjects) {
    return skillName;
  }

  return {
    id:
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
        ? crypto.randomUUID()
        : `skill-${Date.now()}`,

    name: skillName,
  };
};

/* ========================================
   Recommendation Card
======================================== */

const RecommendationCard = ({
  recommendation,
  onSectionChange,
}) => {
  return (
    <div
      className="
        rounded-2xl

        border
        border-stone-200

        bg-white

        p-4

        dark:border-zinc-800
        dark:bg-zinc-900

        sm:p-5
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
          sm:justify-between
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
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              rounded-xl

              bg-violet-50

              text-violet-600

              dark:bg-violet-950/40
              dark:text-violet-300
            "
          >
            <Target
              size={17}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <p
                className="
                  break-words

                  text-sm
                  font-black

                  text-zinc-950

                  dark:text-white
                "
              >
                {
                  recommendation.keyword
                }
              </p>

              <span
                className={`
                  rounded-full

                  border

                  px-2
                  py-1

                  text-[10px]
                  font-black
                  uppercase
                  tracking-wide

                  ${getPriorityStyles(
                    recommendation.priority
                  )}
                `}
              >
                {
                  recommendation.priority
                }
              </span>

              <span
                className="
                  rounded-full

                  border
                  border-stone-200

                  bg-stone-50

                  px-2
                  py-1

                  text-[10px]
                  font-bold

                  text-zinc-500

                  dark:border-zinc-700
                  dark:bg-zinc-800
                  dark:text-zinc-400
                "
              >
                {getTypeLabel(
                  recommendation.keywordType
                )}
              </span>
            </div>

            <p
              className="
                mt-2

                text-xs
                leading-5

                text-zinc-600

                dark:text-zinc-400
              "
            >
              {
                recommendation.message
              }
            </p>

            <div
              className="
                mt-3

                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2

                text-[11px]
                font-bold

                text-zinc-400

                dark:text-zinc-500
              "
            >
              <span>
                Best section:{" "}
                <span
                  className="
                    text-zinc-600

                    dark:text-zinc-300
                  "
                >
                  {getSectionLabel(
                    recommendation
                      .targetSection
                  )}
                </span>
              </span>

              {recommendation.frequency >
                1 && (
                <span>
                  Mentioned{" "}
                  {
                    recommendation.frequency
                  }
                  × in job description
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onSectionChange?.(
              recommendation.targetSection,
              {
                fromAnalysis: true,
              }
            )
          }
          className="
            inline-flex
            w-full
            shrink-0
            items-center
            justify-center
            gap-2

            rounded-xl

            border
            border-stone-200

            bg-white

            px-3.5
            py-2.5

            text-xs
            font-black

            text-zinc-700

            transition-colors

            hover:border-violet-200
            hover:bg-violet-50
            hover:text-violet-700

            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-zinc-300
            dark:hover:border-violet-900
            dark:hover:bg-violet-950/30
            dark:hover:text-violet-300

            sm:w-auto
          "
        >
          {
            recommendation.actionLabel
          }

          <ArrowRight
            size={14}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

/* ========================================
   AI Tailoring Status
======================================== */

const AITailoringStatus = ({
  aiResult,
}) => {
  if (!aiResult) {
    return null;
  }

  const hasSummary =
    Boolean(
      aiResult?.summary
        ?.suggested?.trim()
    );

  const experiences =
    Array.isArray(
      aiResult.experiences
    )
      ? aiResult.experiences.length
      : 0;

  const projects =
    Array.isArray(
      aiResult.projects
    )
      ? aiResult.projects.length
      : 0;

  const skills =
    Array.isArray(
      aiResult.skills
    )
      ? aiResult.skills.length
      : 0;

  const suggestions =
    Array.isArray(
      aiResult.suggestions
    )
      ? aiResult.suggestions.length
      : 0;

  const rewrites =
    (hasSummary ? 1 : 0) +
    experiences +
    projects;

  return (
    <div
      className="
        mt-4

        rounded-2xl

        border
        border-emerald-200

        bg-emerald-50

        p-4

        dark:border-emerald-900/40
        dark:bg-emerald-950/20
      "
      role="status"
      aria-live="polite"
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <CheckCircle2
          size={18}
          className="
            mt-0.5
            shrink-0

            text-emerald-600

            dark:text-emerald-300
          "
          aria-hidden="true"
        />

        <div>
          <p
            className="
              text-sm
              font-black

              text-emerald-800

              dark:text-emerald-200
            "
          >
            AI tailoring suggestions
            are ready
          </p>

          <p
            className="
              mt-1

              text-xs
              leading-5

              text-emerald-700

              dark:text-emerald-300
            "
          >
            ResumeCraft generated{" "}
            {rewrites}{" "}
            {rewrites === 1
              ? "rewrite"
              : "rewrites"}
            , {skills}{" "}
            {skills === 1
              ? "skill"
              : "skills"}{" "}
            to consider and{" "}
            {suggestions} general{" "}
            {suggestions === 1
              ? "suggestion"
              : "suggestions"}.
          </p>

          <p
            className="
              mt-2

              text-[11px]
              font-bold

              text-emerald-600

              dark:text-emerald-400
            "
          >
            Nothing is applied
            automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ========================================
   AI Rewrite Card
======================================== */

const AIRewriteCard = ({
  title,
  original,
  suggested,
  reason,
  applied,
  onApply,
  onDiscard,
}) => {
  if (!suggested?.trim()) {
    return null;
  }

  return (
    <div
      className="
        rounded-2xl

        border
        border-stone-200

        bg-white

        p-4

        dark:border-zinc-800
        dark:bg-zinc-900

        sm:p-5
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

            bg-violet-50

            text-violet-600

            dark:bg-violet-950/40
            dark:text-violet-300
          "
        >
          <FileText
            size={16}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-2
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
              {title}
            </p>

            {applied && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1

                  rounded-full

                  border
                  border-emerald-200

                  bg-emerald-50

                  px-2.5
                  py-1

                  text-[10px]
                  font-black

                  text-emerald-700

                  dark:border-emerald-900/40
                  dark:bg-emerald-950/20
                  dark:text-emerald-300
                "
              >
                <Check
                  size={12}
                  aria-hidden="true"
                />

                Applied
              </span>
            )}
          </div>

          {original?.trim() && (
            <div className="mt-4">
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wide

                  text-zinc-400
                "
              >
                Current
              </p>

              <div
                className="
                  mt-2

                  rounded-xl

                  border
                  border-stone-200

                  bg-stone-50

                  p-3

                  text-xs
                  leading-5

                  text-zinc-600

                  dark:border-zinc-700
                  dark:bg-zinc-800/70
                  dark:text-zinc-300
                "
              >
                {original}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-wide

                text-violet-600

                dark:text-violet-400
              "
            >
              AI Suggestion
            </p>

            <div
              className="
                mt-2

                rounded-xl

                border
                border-violet-200

                bg-violet-50/70

                p-3

                text-xs
                leading-5

                text-violet-900

                dark:border-violet-900/40
                dark:bg-violet-950/30
                dark:text-violet-200
              "
            >
              {suggested}
            </div>
          </div>

          {reason?.trim() && (
            <div
              className="
                mt-3

                flex
                items-start
                gap-2

                text-[11px]
                leading-5

                text-zinc-500

                dark:text-zinc-400
              "
            >
              <Lightbulb
                size={14}
                className="
                  mt-0.5
                  shrink-0
                "
                aria-hidden="true"
              />

              <span>
                {reason}
              </span>
            </div>
          )}

          {!applied && (
            <div
              className="
                mt-4

                flex
                flex-col
                gap-2

                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={onApply}
                className="
                  inline-flex
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
                "
              >
                <Check
                  size={14}
                  aria-hidden="true"
                />

                Apply
              </button>

              <button
                type="button"
                onClick={onDiscard}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  border
                  border-stone-200

                  bg-white

                  px-3.5
                  py-2.5

                  text-xs
                  font-black

                  text-zinc-600

                  transition-colors

                  hover:bg-stone-50

                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:text-zinc-300
                  dark:hover:bg-zinc-800
                "
              >
                <X
                  size={14}
                  aria-hidden="true"
                />

                Discard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================
   AI Skill Card
======================================== */

const AISkillCard = ({
  skill,
  applied,
  onApply,
  onDiscard,
}) => {
  const name =
    skill?.skill?.trim();

  if (!name) {
    return null;
  }

  return (
    <div
      className="
        rounded-2xl

        border
        border-stone-200

        bg-stone-50

        p-4

        dark:border-zinc-700
        dark:bg-zinc-800/70
      "
    >
      <div
        className="
          flex
          items-start
          gap-2
        "
      >
        <CheckCircle2
          size={15}
          className="
            mt-0.5
            shrink-0

            text-emerald-600

            dark:text-emerald-400
          "
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-2
            "
          >
            <p
              className="
                text-xs
                font-black

                text-zinc-900

                dark:text-white
              "
            >
              {name}
            </p>

            {applied && (
              <span
                className="
                  rounded-full

                  border
                  border-emerald-200

                  bg-emerald-50

                  px-2
                  py-1

                  text-[10px]
                  font-black

                  text-emerald-700

                  dark:border-emerald-900/40
                  dark:bg-emerald-950/20
                  dark:text-emerald-300
                "
              >
                Added
              </span>
            )}
          </div>

          {skill.reason && (
            <p
              className="
                mt-1

                text-[11px]
                leading-5

                text-zinc-500

                dark:text-zinc-400
              "
            >
              {skill.reason}
            </p>
          )}

          {!applied && (
            <div
              className="
                mt-3

                flex
                flex-wrap
                gap-2
              "
            >
              <button
                type="button"
                onClick={onApply}
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-lg

                  bg-violet-600

                  px-3
                  py-2

                  text-[11px]
                  font-black

                  text-white

                  hover:bg-violet-700
                "
              >
                <Check
                  size={13}
                  aria-hidden="true"
                />

                Add Skill
              </button>

              <button
                type="button"
                onClick={onDiscard}
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-lg

                  border
                  border-stone-200

                  bg-white

                  px-3
                  py-2

                  text-[11px]
                  font-black

                  text-zinc-600

                  hover:bg-stone-50

                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:text-zinc-300
                  dark:hover:bg-zinc-800
                "
              >
                <X
                  size={13}
                  aria-hidden="true"
                />

                Discard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================
   AI Tailoring Review
======================================== */

const AITailoringReview = ({
  resume,
  aiResult,
  onApplySummary,
  onApplyExperience,
  onApplyProject,
  onApplySkill,
  onReviewStateChange,
}) => {
  const reviewState =
    aiResult?._reviewState || {};

  const discardedSummary =
    reviewState.discardedSummary === true;

  const discardedExperiences =
    Array.isArray(
      reviewState.discardedExperiences
    )
      ? reviewState.discardedExperiences
      : [];

  const discardedProjects =
    Array.isArray(
      reviewState.discardedProjects
    )
      ? reviewState.discardedProjects
      : [];

  const discardedSkills =
    Array.isArray(
      reviewState.discardedSkills
    )
      ? reviewState.discardedSkills
      : [];

  const appliedSummary =
    reviewState.appliedSummary === true;

  const appliedExperiences =
    Array.isArray(
      reviewState.appliedExperiences
    )
      ? reviewState.appliedExperiences
      : [];

  const appliedProjects =
    Array.isArray(
      reviewState.appliedProjects
    )
      ? reviewState.appliedProjects
      : [];

  const appliedSkills =
    Array.isArray(
      reviewState.appliedSkills
    )
      ? reviewState.appliedSkills
      : [];

  const updateReviewState =
    (updates) => {
      onReviewStateChange?.({
        ...reviewState,
        ...updates,
      });
    };

  if (!aiResult) {
    return null;
  }

  const summary =
    aiResult?.summary || {};

  const experiences =
    Array.isArray(
      aiResult?.experiences
    )
      ? aiResult.experiences
      : [];

  const projects =
    Array.isArray(
      aiResult?.projects
    )
      ? aiResult.projects
      : [];

  const currentSkillNames =
    new Set(
      (Array.isArray(resume?.skills)
        ? resume.skills
        : []
      )
        .map((skill) =>
          getSkillName(skill)
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    );

  const skills =
    Array.isArray(
      aiResult?.skills
    )
      ? aiResult.skills.filter(
          (skill) => {
            const name =
              getSkillName(skill)
                .trim()
                .toLowerCase();

            return (
              name &&
              !currentSkillNames.has(
                name
              )
            );
          }
        )
      : [];

  const suggestions =
    Array.isArray(
      aiResult?.suggestions
    )
      ? aiResult.suggestions
      : [];

  const visibleSummary =
    Boolean(
      summary?.suggested?.trim()
    ) &&
    !discardedSummary;

  const visibleExperiences =
    experiences.filter(
      (
        experience,
        arrayIndex
      ) => {
        const key =
          Number.isInteger(
            experience.index
          )
            ? experience.index
            : arrayIndex;

        return (
          !discardedExperiences.includes(
            key
          )
        );
      }
    );

  const visibleProjects =
    projects.filter(
      (
        project,
        arrayIndex
      ) => {
        const key =
          Number.isInteger(
            project.index
          )
            ? project.index
            : arrayIndex;

        return (
          !discardedProjects.includes(
            key
          )
        );
      }
    );

  const visibleSkills =
    skills.filter((skill) => {
      const key =
        skill?.skill
          ?.trim()
          ?.toLowerCase();

      return (
        key &&
        !discardedSkills.includes(
          key
        )
      );
    });

  const hasContent =
    visibleSummary ||
    visibleExperiences.length >
      0 ||
    visibleProjects.length > 0 ||
    visibleSkills.length > 0 ||
    suggestions.length > 0;

  if (!hasContent) {
    return (
      <div
        className="
          mt-5

          rounded-2xl

          border
          border-emerald-200

          bg-emerald-50

          p-4

          dark:border-emerald-900/40
          dark:bg-emerald-950/20
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <CheckCircle2
            size={17}
            className="
              mt-0.5
              shrink-0

              text-emerald-600

              dark:text-emerald-300
            "
            aria-hidden="true"
          />

          <p
            className="
              text-xs
              font-bold

              text-emerald-700

              dark:text-emerald-300
            "
          >
            All AI tailoring
            suggestions have been
            reviewed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        mt-5

        rounded-3xl

        border
        border-stone-200

        bg-white

        p-4

        dark:border-zinc-800
        dark:bg-zinc-900

        sm:p-5
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
            h-10
            w-10
            shrink-0
            items-center
            justify-center

            rounded-xl

            bg-violet-100

            text-violet-700

            dark:bg-violet-950/50
            dark:text-violet-300
          "
        >
          <ListChecks
            size={17}
            aria-hidden="true"
          />
        </div>

        <div>
          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.14em]

              text-violet-600

              dark:text-violet-400
            "
          >
            AI Review
          </p>

          <h4
            className="
              mt-1

              text-base
              font-black

              text-zinc-950

              dark:text-white
            "
          >
            Review tailoring suggestions
          </h4>

          <p
            className="
              mt-1
              max-w-2xl

              text-xs
              leading-5

              text-zinc-500

              dark:text-zinc-400
            "
          >
            Apply only suggestions that
            accurately represent your
            background. Discarding a
            suggestion never modifies
            your resume.
          </p>
        </div>
      </div>

      {/* Summary */}

      {visibleSummary && (
        <div className="mt-5">
          <p
            className="
              mb-3

              text-xs
              font-black
              uppercase
              tracking-wide

              text-zinc-500

              dark:text-zinc-400
            "
          >
            Professional Summary
          </p>

          <AIRewriteCard
            title="Summary Rewrite"
            original={
              summary.original || ""
            }
            suggested={
              summary.suggested || ""
            }
            applied={
              appliedSummary
            }
            onApply={() => {
              const success =
                onApplySummary(
                  summary.suggested
                );

              if (success) {
                updateReviewState({
                  appliedSummary: true,
                });
              }
            }}
            onDiscard={() =>
              updateReviewState({
                discardedSummary: true,
              })
            }
          />
        </div>
      )}

      {/* Experience */}

      {visibleExperiences.length >
        0 && (
        <div className="mt-6">
          <div
            className="
              mb-3

              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-wide

                text-zinc-500

                dark:text-zinc-400
              "
            >
              Experience
            </p>

            <span
              className="
                rounded-full

                bg-stone-100

                px-2.5
                py-1

                text-[10px]
                font-black

                text-zinc-500

                dark:bg-zinc-800
                dark:text-zinc-400
              "
            >
              {
                visibleExperiences.length
              }
            </span>
          </div>

          <div className="space-y-3">
            {visibleExperiences.map(
              (
                experience,
                arrayIndex
              ) => {
                const index =
                  Number.isInteger(
                    experience.index
                  )
                    ? experience.index
                    : arrayIndex;

                return (
                  <AIRewriteCard
                    key={`experience-${index}`}
                    title={`Experience ${
                      index + 1
                    }`}
                    original={
                      experience.original ||
                      ""
                    }
                    suggested={
                      experience.suggested ||
                      ""
                    }
                    reason={
                      experience.reason ||
                      ""
                    }
                    applied={
                      appliedExperiences
                        .includes(
                          index
                        )
                    }
                    onApply={() => {
                      const success =
                        onApplyExperience(
                          index,
                          experience.suggested
                        );

                      if (success) {
                        updateReviewState({
                          appliedExperiences: [
                            ...new Set([
                              ...appliedExperiences,
                              index,
                            ]),
                          ],
                        });
                      }
                    }}
                    onDiscard={() =>
                      updateReviewState({
                        discardedExperiences: [
                          ...new Set([
                            ...discardedExperiences,
                            index,
                          ]),
                        ],
                      })
                    }
                  />
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Projects */}

      {visibleProjects.length >
        0 && (
        <div className="mt-6">
          <div
            className="
              mb-3

              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-wide

                text-zinc-500

                dark:text-zinc-400
              "
            >
              Projects
            </p>

            <span
              className="
                rounded-full

                bg-stone-100

                px-2.5
                py-1

                text-[10px]
                font-black

                text-zinc-500

                dark:bg-zinc-800
                dark:text-zinc-400
              "
            >
              {
                visibleProjects.length
              }
            </span>
          </div>

          <div className="space-y-3">
            {visibleProjects.map(
              (
                project,
                arrayIndex
              ) => {
                const index =
                  Number.isInteger(
                    project.index
                  )
                    ? project.index
                    : arrayIndex;

                return (
                  <AIRewriteCard
                    key={`project-${index}`}
                    title={`Project ${
                      index + 1
                    }`}
                    original={
                      project.original ||
                      ""
                    }
                    suggested={
                      project.suggested ||
                      ""
                    }
                    reason={
                      project.reason ||
                      ""
                    }
                    applied={
                      appliedProjects
                        .includes(
                          index
                        )
                    }
                    onApply={() => {
                      const success =
                        onApplyProject(
                          index,
                          project.suggested
                        );

                      if (success) {
                        updateReviewState({
                          appliedProjects: [
                            ...new Set([
                              ...appliedProjects,
                              index,
                            ]),
                          ],
                        });
                      }
                    }}
                    onDiscard={() =>
                      updateReviewState({
                        discardedProjects: [
                          ...new Set([
                            ...discardedProjects,
                            index,
                          ]),
                        ],
                      })
                    }
                  />
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Skills */}

      {visibleSkills.length >
        0 && (
        <div className="mt-6">
          <p
            className="
              mb-3

              text-xs
              font-black
              uppercase
              tracking-wide

              text-zinc-500

              dark:text-zinc-400
            "
          >
            Supported Skills
          </p>

          <div
            className="
              grid
              gap-3

              sm:grid-cols-2
            "
          >
            {visibleSkills.map(
              (
                skill,
                index
              ) => {
                const key =
                  skill.skill
                    ?.trim()
                    ?.toLowerCase();

                return (
                  <AISkillCard
                    key={`${key}-${index}`}
                    skill={skill}
                    applied={
                      appliedSkills.includes(
                        key
                      )
                    }
                    onApply={() => {
                      const success =
                        onApplySkill(
                          skill.skill
                        );

                      if (success) {
                        updateReviewState({
                          appliedSkills: [
                            ...new Set([
                              ...appliedSkills,
                              key,
                            ]),
                          ],
                        });
                      }
                    }}
                    onDiscard={() =>
                      updateReviewState({
                        discardedSkills: [
                          ...new Set([
                            ...discardedSkills,
                            key,
                          ]),
                        ],
                      })
                    }
                  />
                );
              }
            )}
          </div>

          <p
            className="
              mt-3

              text-[11px]
              leading-5

              text-zinc-400

              dark:text-zinc-500
            "
          >
            Only add a suggested skill
            if it genuinely represents
            your background.
          </p>
        </div>
      )}

      {/* General Suggestions */}

      {suggestions.length > 0 && (
        <div className="mt-6">
          <p
            className="
              mb-3

              text-xs
              font-black
              uppercase
              tracking-wide

              text-zinc-500

              dark:text-zinc-400
            "
          >
            General Suggestions
          </p>

          <div className="space-y-2">
            {suggestions.map(
              (
                suggestion,
                index
              ) => (
                <div
                  key={`suggestion-${index}`}
                  className="
                    flex
                    items-start
                    gap-3

                    rounded-2xl

                    border
                    border-violet-100

                    bg-violet-50/50

                    p-3

                    dark:border-violet-900/30
                    dark:bg-violet-950/20
                  "
                >
                  <Lightbulb
                    size={15}
                    className="
                      mt-0.5
                      shrink-0

                      text-violet-600

                      dark:text-violet-300
                    "
                    aria-hidden="true"
                  />

                  <p
                    className="
                      text-xs
                      leading-5

                      text-violet-800

                      dark:text-violet-200
                    "
                  >
                    {suggestion}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div
        className="
          mt-6

          flex
          items-start
          gap-3

          rounded-2xl

          border
          border-amber-200

          bg-amber-50

          p-4

          dark:border-amber-900/40
          dark:bg-amber-950/20
        "
      >
        <CircleAlert
          size={16}
          className="
            mt-0.5
            shrink-0

            text-amber-600

            dark:text-amber-300
          "
          aria-hidden="true"
        />

        <p
          className="
            text-[11px]
            leading-5

            text-amber-800

            dark:text-amber-200
          "
        >
          ResumeCraft changes your
          resume only when you explicitly
          choose Apply or Add Skill.
          General suggestions remain
          informational.
        </p>
      </div>
    </div>
  );
};

/* ========================================
   Tailoring Recommendations
======================================== */

const TailoringRecommendations = ({
  resume,
  tailoring,
  onSectionChange,
}) => {
  const updateSummary =
    useResumeStore(
      (state) =>
        state.updateSummary
    );

  const updateSectionItem =
    useResumeStore(
      (state) =>
        state.updateSectionItem
    );

  const setSkills =
    useResumeStore(
      (state) =>
        state.setSkills
    );

  const aiResult =
    useResumeStore(
      (state) =>
        resume?.id
          ? state
              .aiTailoringResults[
                resume.id
              ] ?? null
          : null
    );

  const setAiTailoringResult =
    useResumeStore(
      (state) =>
        state.setAiTailoringResult
    );

  const clearAiTailoringResult =
    useResumeStore(
      (state) =>
        state.clearAiTailoringResult
    );

  const updateAnalysis =
    useResumeStore(
      (state) =>
        state.updateAnalysis
    );

  const [
    aiResultVersion,
    setAiResultVersion,
  ] = useState(0);

  const [
    aiError,
    setAiError,
  ] = useState("");

  const [
    isAiLoading,
    setIsAiLoading,
  ] = useState(false);

  const recommendations =
    tailoring?.recommendations ||
    [];

  const summary =
    tailoring?.summary || {};

  const highPriorityCount =
    summary.highPriorityCount ||
    0;

  const hasHighPriority =
    highPriorityCount > 0;

  const targetJobTitle =
    resume?.jobTarget
      ?.jobTitle || "";

  const targetCompany =
    resume?.jobTarget
      ?.company || "";

  const targetJobDescription =
    resume?.jobTarget
      ?.jobDescription || "";

  /* ========================================
     AI Resume Tailoring
  ======================================== */

  const handleAiTailor =
    async () => {
      if (
        !targetJobDescription.trim() ||
        isAiLoading
      ) {
        return;
      }

      setAiError("");

      clearAiTailoringResult(
        resume.id
      );

      setIsAiLoading(true);

      try {
        const result =
          await tailorResume({
            resume,

            targetJobTitle,

            targetCompany,

            targetJobDescription,
          });

        setAiTailoringResult(
          resume.id,
          result
        );

        updateAnalysis(
          resume.id,
          {
            hasAnalyzed: true,

            analyzedAt:
              new Date().toISOString(),
          }
        );

        setAiResultVersion(
          (current) =>
            current + 1
        );
      } catch (error) {
        setAiError(
          error instanceof Error
            ? error.message
            : "Unable to tailor the resume right now."
        );
      } finally {
        setIsAiLoading(false);
      }
    };

  /* ========================================
     Apply Summary
  ======================================== */

  const handleApplySummary =
    (suggestedSummary) => {
      if (
        !resume?.id ||
        !suggestedSummary
          ?.trim()
      ) {
        return false;
      }

      updateSummary(
        resume.id,
        suggestedSummary.trim()
      );

      return true;
    };

  /* ========================================
     Apply Experience
  ======================================== */

  const handleApplyExperience =
    (
      index,
      suggestedDescription
    ) => {
      if (
        !resume?.id ||
        !Number.isInteger(index) ||
        !suggestedDescription
          ?.trim()
      ) {
        return false;
      }

      const experienceItems =
        Array.isArray(
          resume?.experience
        )
          ? resume.experience
          : Array.isArray(
                resume?.experiences
              )
            ? resume.experiences
            : [];

      const item =
        experienceItems[index];

      if (!item?.id) {
        return false;
      }

      const section =
        Array.isArray(
          resume?.experience
        )
          ? "experience"
          : "experiences";

      updateSectionItem(
        resume.id,
        section,
        item.id,
        {
          description:
            suggestedDescription.trim(),
        }
      );

      return true;
    };

  /* ========================================
     Apply Project
  ======================================== */

  const handleApplyProject =
    (
      index,
      suggestedDescription
    ) => {
      if (
        !resume?.id ||
        !Number.isInteger(index) ||
        !suggestedDescription
          ?.trim()
      ) {
        return false;
      }

      const projects =
        Array.isArray(
          resume?.projects
        )
          ? resume.projects
          : [];

      const project =
        projects[index];

      if (!project?.id) {
        return false;
      }

      updateSectionItem(
        resume.id,
        "projects",
        project.id,
        {
          description:
            suggestedDescription.trim(),
        }
      );

      return true;
    };

  /* ========================================
     Apply Skill
  ======================================== */

  const handleApplySkill =
    (skillName) => {
      if (
        !resume?.id ||
        !skillName?.trim()
      ) {
        return false;
      }

      const cleanSkill =
        skillName.trim();

      const currentSkills =
        Array.isArray(
          resume?.skills
        )
          ? resume.skills
          : [];

      const alreadyExists =
        currentSkills.some(
          (skill) =>
            getSkillName(
              skill
            ).toLowerCase() ===
            cleanSkill.toLowerCase()
        );

      if (alreadyExists) {
        return true;
      }

      const newSkill =
        createSkill(
          currentSkills,
          cleanSkill
        );

      setSkills(
        resume.id,
        [
          ...currentSkills,
          newSkill,
        ]
      );

      return true;
    };

  /* ========================================
     Persist AI Review State
  ======================================== */

  const handleReviewStateChange =
    (reviewState) => {
      if (
        !resume?.id ||
        !aiResult
      ) {
        return;
      }

      setAiTailoringResult(
        resume.id,
        {
          ...aiResult,
          _reviewState:
            reviewState,
        }
      );
    };

  /* ========================================
     Missing Job Target
  ======================================== */

  if (!tailoring?.hasJobTarget) {
    return (
      <section
        className="
          rounded-3xl

          border
          border-stone-200

          bg-white

          p-5

          shadow-sm

          dark:border-zinc-800
          dark:bg-zinc-900

          sm:p-6
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
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              rounded-xl

              bg-amber-50

              text-amber-600

              dark:bg-amber-950/30
              dark:text-amber-300
            "
          >
            <CircleAlert
              size={17}
              aria-hidden="true"
            />
          </div>

          <div>
            <h3
              className="
                text-base
                font-black

                text-zinc-950

                dark:text-white
              "
            >
              Tailoring Recommendations
            </h3>

            <p
              className="
                mt-1

                text-sm
                leading-6

                text-zinc-500

                dark:text-zinc-400
              "
            >
              Add a target job
              description before
              generating role-specific
              tailoring guidance.
            </p>

            <button
              type="button"
              onClick={() =>
                onSectionChange?.(
                  "job-target"
                )
              }
              className="
                mt-4

                inline-flex
                items-center
                gap-2

                text-xs
                font-black

                text-violet-600

                hover:text-violet-700

                dark:text-violet-400
                dark:hover:text-violet-300
              "
            >
              Add Job Target

              <ArrowRight
                size={14}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-3xl

        border
        border-stone-200

        bg-stone-50/70

        p-5

        shadow-sm

        dark:border-zinc-800
        dark:bg-zinc-950/40

        sm:p-6
      "
    >
      {/* =====================================
          Header
      ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
          sm:justify-between
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
            <Sparkles
              size={18}
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.14em]

                text-violet-600

                dark:text-violet-400
              "
            >
              Job Tailoring
            </p>

            <h3
              className="
                mt-1

                text-lg
                font-black
                tracking-[-0.03em]

                text-zinc-950

                dark:text-white
              "
            >
              Tailoring Recommendations
            </h3>

            <p
              className="
                mt-1
                max-w-2xl

                text-xs
                leading-5

                text-zinc-500

                dark:text-zinc-400
              "
            >
              Use these recommendations
              as editing guidance. Only
              add skills, terminology or
              examples that truthfully
              represent your experience.
            </p>
          </div>
        </div>

        <div
          className="
            shrink-0

            rounded-2xl

            border
            border-stone-200

            bg-white

            px-4
            py-3

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-wide

              text-zinc-400
            "
          >
            Keyword Match
          </p>

          <p
            className="
              mt-1

              text-xl
              font-black

              text-zinc-950

              dark:text-white
            "
          >
            {summary.matchScore ||
              0}
            %
          </p>
        </div>
      </div>

      {/* =====================================
          Target Context
      ===================================== */}

      {(tailoring.jobTitle ||
        tailoring.company) && (
        <div
          className="
            mt-5

            flex
            flex-wrap
            items-center
            gap-2

            rounded-2xl

            border
            border-stone-200

            bg-white

            px-4
            py-3

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <BriefcaseBusiness
            size={15}
            className="
              shrink-0
              text-zinc-400
            "
            aria-hidden="true"
          />

          <span
            className="
              text-xs
              font-bold

              text-zinc-600

              dark:text-zinc-300
            "
          >
            Tailoring for
          </span>

          {tailoring.jobTitle && (
            <span
              className="
                text-xs
                font-black

                text-zinc-950

                dark:text-white
              "
            >
              {tailoring.jobTitle}
            </span>
          )}

          {tailoring.company && (
            <span
              className="
                text-xs
                font-bold

                text-zinc-400
              "
            >
              at{" "}
              {tailoring.company}
            </span>
          )}
        </div>
      )}

      {/* =====================================
          Summary Stats
      ===================================== */}

      <div
        className="
          mt-5

          grid
          gap-3

          sm:grid-cols-3
        "
      >
        <div
          className="
            rounded-2xl

            border
            border-stone-200

            bg-white

            p-4

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-wide

              text-zinc-400
            "
          >
            Recommendations
          </p>

          <p
            className="
              mt-2

              text-xl
              font-black

              text-zinc-950

              dark:text-white
            "
          >
            {
              summary.recommendationCount ||
              0
            }
          </p>
        </div>

        <div
          className={`
            rounded-2xl

            border

            p-4

            ${
              hasHighPriority
                ? `
                  border-red-200
                  bg-red-50

                  dark:border-red-900/40
                  dark:bg-red-950/20
                `
                : `
                  border-emerald-200
                  bg-emerald-50

                  dark:border-emerald-900/40
                  dark:bg-emerald-950/20
                `
            }
          `}
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-2
            "
          >
            <p
              className={`
                text-[10px]
                font-black
                uppercase
                tracking-wide

                ${
                  hasHighPriority
                    ? `
                      text-red-500

                      dark:text-red-400
                    `
                    : `
                      text-emerald-600

                      dark:text-emerald-400
                    `
                }
              `}
            >
              High Priority
            </p>

            {!hasHighPriority && (
              <CheckCircle2
                size={15}
                className="
                  text-emerald-600

                  dark:text-emerald-300
                "
                aria-hidden="true"
              />
            )}
          </div>

          <p
            className={`
              mt-2

              text-xl
              font-black

              ${
                hasHighPriority
                  ? `
                    text-red-700

                    dark:text-red-300
                  `
                  : `
                    text-emerald-700

                    dark:text-emerald-300
                  `
              }
            `}
          >
            {highPriorityCount}
          </p>
        </div>

        <div
          className="
            rounded-2xl

            border
            border-emerald-200

            bg-emerald-50

            p-4

            dark:border-emerald-900/40
            dark:bg-emerald-950/20
          "
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-wide

              text-emerald-600

              dark:text-emerald-400
            "
          >
            Matched Keywords
          </p>

          <p
            className="
              mt-2

              text-xl
              font-black

              text-emerald-700

              dark:text-emerald-300
            "
          >
            {
              summary.matchedCount ||
              0
            }
          </p>
        </div>
      </div>

      {/* =====================================
          AI Resume Tailoring
      ===================================== */}

      <div
        className="
          mt-5

          rounded-2xl

          border
          border-violet-200

          bg-violet-50/70

          p-4

          dark:border-violet-900/40
          dark:bg-violet-950/20

          sm:p-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
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
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                bg-violet-100

                text-violet-700

                dark:bg-violet-950/60
                dark:text-violet-300
              "
            >
              <Sparkles
                size={17}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-black

                  text-violet-950

                  dark:text-violet-100
                "
              >
                AI Resume Tailoring
              </p>

              <p
                className="
                  mt-1

                  text-xs
                  leading-5

                  text-violet-700

                  dark:text-violet-300
                "
              >
                Generate truthful,
                role-specific suggestions
                for your summary,
                experience, projects and
                supported skills.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleAiTailor
            }
            disabled={
              isAiLoading ||
              !targetJobDescription.trim()
            }
            className="
              inline-flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-stone-200

              bg-white

              px-4
              py-3

              text-xs
              font-black

              text-zinc-700

              transition-colors

              hover:border-violet-200
              hover:bg-violet-50
              hover:text-violet-700

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-300

              dark:hover:border-violet-900
              dark:hover:bg-violet-950/30
              dark:hover:text-violet-300

              sm:w-auto
            "
          >
            {isAiLoading ? (
              <>
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />

                Tailoring...
              </>
            ) : (
              <>
                <Sparkles
                  size={15}
                  aria-hidden="true"
                />

                {aiResult
                  ? "Generate Again"
                  : "Tailor with AI"}
              </>
            )}
          </button>
        </div>

        {aiError && (
          <div
            role="alert"
            aria-live="assertive"
            className="
              mt-4

              flex
              items-start
              gap-2

              rounded-xl

              border
              border-red-200

              bg-red-50

              p-3

              text-xs
              font-bold
              leading-5

              text-red-700

              dark:border-red-900/40
              dark:bg-red-950/30
              dark:text-red-300
            "
          >
            <CircleAlert
              size={16}
              className="
                mt-0.5
                shrink-0
              "
              aria-hidden="true"
            />

            <span>
              {aiError}
            </span>
          </div>
        )}

        <AITailoringStatus
          aiResult={aiResult}
        />
      </div>

      {/* =====================================
          AI Review
      ===================================== */}

      <AITailoringReview
        key={aiResultVersion}
        resume={resume}
        aiResult={aiResult}
        onReviewStateChange={
          handleReviewStateChange
        }
        onApplySummary={
          handleApplySummary
        }
        onApplyExperience={
          handleApplyExperience
        }
        onApplyProject={
          handleApplyProject
        }
        onApplySkill={
          handleApplySkill
        }
      />

      {/* =====================================
          ATS Recommendations
      ===================================== */}

      {recommendations.length >
      0 ? (
        <div
          className="
            mt-5
            space-y-3
          "
        >
          {recommendations.map(
            (recommendation) => (
              <RecommendationCard
                key={
                  recommendation.id
                }
                recommendation={
                  recommendation
                }
                onSectionChange={
                  onSectionChange
                }
              />
            )
          )}
        </div>
      ) : (
        <div
          className="
            mt-5

            flex
            items-start
            gap-3

            rounded-2xl

            border
            border-emerald-200

            bg-emerald-50

            p-4

            dark:border-emerald-900/40
            dark:bg-emerald-950/20
          "
        >
          <CheckCircle2
            size={18}
            className="
              mt-0.5
              shrink-0

              text-emerald-600

              dark:text-emerald-300
            "
            aria-hidden="true"
          />

          <div>
            <p
              className="
                text-sm
                font-black

                text-emerald-800

                dark:text-emerald-200
              "
            >
              No keyword-based
              tailoring changes detected
            </p>

            <p
              className="
                mt-1

                text-xs
                leading-5

                text-emerald-700

                dark:text-emerald-300
              "
            >
              Your resume currently
              covers all target keywords
              identified from this job
              description. Keep the
              wording accurate and
              natural rather than adding
              unnecessary repetition.
            </p>
          </div>
        </div>
      )}

      {/* =====================================
          Truthfulness Reminder
      ===================================== */}

      <div
        className="
          mt-5

          flex
          items-start
          gap-3

          rounded-2xl

          border
          border-violet-200

          bg-violet-50/70

          p-4

          dark:border-violet-900/40
          dark:bg-violet-950/20
        "
      >
        <Lightbulb
          size={17}
          className="
            mt-0.5
            shrink-0

            text-violet-600

            dark:text-violet-300
          "
          aria-hidden="true"
        />

        <p
          className="
            text-xs
            leading-5

            text-violet-800

            dark:text-violet-200
          "
        >
          A missing keyword is not an
          instruction to add it. Use a
          recommendation only when the
          skill or experience genuinely
          applies to your background.
        </p>
      </div>
    </section>
  );
};

export default TailoringRecommendations;