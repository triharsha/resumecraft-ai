import {
  AlertCircle,
  Lightbulb,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import useResumeStore from "../../../stores/resumeStore";

import {
  recommendSkills,
} from "../../../services/aiService";

/* ========================================
   Constants
======================================== */

const MAX_SKILL_LENGTH = 40;
const MAX_SKILLS = 30;

const SKILL_ALIASES = {
  "react.js": "React",
  reactjs: "React",
  "react js": "React",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  "node.js": "Node.js",
  nodejs: "Node.js",
  "node js": "Node.js",
  springboot: "Spring Boot",
  "spring boot": "Spring Boot",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  aws: "AWS",
  "amazon web services": "AWS",
  gcp: "Google Cloud",
  "google cloud platform": "Google Cloud",
  "google cloud": "Google Cloud",
  rest: "REST APIs",
  "rest api": "REST APIs",
  "rest APIs": "REST APIs",
  restful: "REST APIs",
  "restful api": "REST APIs",
  html5: "HTML",
  css3: "CSS",
  git: "Git",
  github: "GitHub",
  docker: "Docker",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  cicd: "CI/CD",
  "ci/cd": "CI/CD",
};

const normalizeWhitespace = (
  value = ""
) =>
  String(value)
    .trim()
    .replace(/\s+/g, " ");

const normalizeSkillKey = (
  value = ""
) => {
  const normalized =
    normalizeWhitespace(
      value
    ).toLowerCase();

  return (
    SKILL_ALIASES[
      normalized
    ]?.toLowerCase() ||
    normalized
  );
};

/* ========================================
   Skills Form
======================================== */

const SkillsForm = ({
  resume,
}) => {
  const [
    skillInput,
    setSkillInput,
  ] = useState("");

  const [
    inputError,
    setInputError,
  ] = useState("");

  const [
    isAiLoading,
    setIsAiLoading,
  ] = useState(false);

  const [
    aiRecommendations,
    setAiRecommendations,
  ] = useState([]);

  const [
    aiError,
    setAiError,
  ] = useState("");

  const [
    discardedAiSkills,
    setDiscardedAiSkills,
  ] = useState([]);

  const updateResume =
    useResumeStore(
      (state) =>
        state.updateResume
    );

  const skills =
    Array.isArray(
      resume.skills
    )
      ? resume.skills
      : [];

  /* ========================================
     Update Skills
  ======================================== */

  const saveSkills = (
    nextSkills
  ) => {
    updateResume(
      resume.id,
      {
        skills:
          nextSkills,
      }
    );
  };

  /* ========================================
     Add Skill
  ======================================== */

  const handleAddSkill = (
    value = skillInput
  ) => {
    const trimmedSkill =
      normalizeWhitespace(
        value
      );

    setInputError("");

    if (!trimmedSkill) {
      return;
    }

    if (
      trimmedSkill.length >
      MAX_SKILL_LENGTH
    ) {
      setInputError(
        `Skill names must be ${MAX_SKILL_LENGTH} characters or less.`
      );

      return;
    }

    if (
      skills.length >=
      MAX_SKILLS
    ) {
      setInputError(
        `You can add up to ${MAX_SKILLS} skills.`
      );

      return;
    }

    const alreadyExists =
      skills.some(
        (skill) =>
          normalizeSkillKey(
            skill
          ) ===
          normalizeSkillKey(
            trimmedSkill
          )
      );

    if (alreadyExists) {
      setInputError(
        `"${trimmedSkill}" is already in your skills.`
      );

      return;
    }

    saveSkills([
      ...skills,
      trimmedSkill,
    ]);

    setSkillInput("");
  };

  /* ========================================
     Remove Skill
  ======================================== */

  const handleRemoveSkill = (
    skillToRemove
  ) => {
    const nextSkills =
      skills.filter(
        (skill) =>
          skill !==
          skillToRemove
      );

    saveSkills(
      nextSkills
    );

    // Clear temporary AI state that may have
    // been based on the removed skill.
    setInputError("");
    setAiError("");
    setAiRecommendations([]);
    setDiscardedAiSkills([]);
  };

  /* ========================================
     AI Skill Recommendations
  ======================================== */

  const handleRecommendSkills =
    async () => {
      if (isAiLoading) {
        return;
      }

      setIsAiLoading(
        true
      );

      setAiError("");

      setAiRecommendations(
        []
      );

      setDiscardedAiSkills(
        []
      );

      try {
        const focusSkill =
          skills.length > 0
            ? skills[
                skills.length -
                  1
              ]
            : "";

        if (!focusSkill) {
          setAiError(
            "Add at least one skill before asking AI for recommendations."
          );

          return;
        }

        const result =
          await recommendSkills(
            {
              resume,

              focusSkill,

              targetJobTitle:
                resume
                  ?.jobTarget
                  ?.jobTitle ||
                "",

              targetCompany:
                resume
                  ?.jobTarget
                  ?.company ||
                "",

              targetJobDescription:
                resume
                  ?.jobTarget
                  ?.jobDescription ||
                "",
            }
          );

        const recommendations =
          Array.isArray(
            result?.skills
          )
            ? result.skills
            : [];

        setAiRecommendations(
          recommendations
        );
      } catch (error) {
        setAiError(
          error instanceof
            Error
            ? error.message
            : "Unable to recommend skills right now."
        );
      } finally {
        setIsAiLoading(
          false
        );
      }
    };

  const handleDiscardAiSkill =
    (skillName) => {
      setDiscardedAiSkills(
        (current) => [
          ...current,
          skillName,
        ]
      );
    };

  const availableAiRecommendations =
    aiRecommendations.filter(
      (recommendation) => {
        const skillName =
          recommendation?.skill ||
          "";

        if (!skillName) {
          return false;
        }

        const discarded =
          discardedAiSkills.some(
            (skill) =>
              normalizeSkillKey(
                skill
              ) ===
              normalizeSkillKey(
                skillName
              )
          );

        if (discarded) {
          return false;
        }

        const alreadyAdded =
          skills.some(
            (skill) =>
              normalizeSkillKey(
                skill
              ) ===
              normalizeSkillKey(
                skillName
              )
          );

        return !alreadyAdded;
      }
    );

  /* ========================================
     Keyboard
  ======================================== */

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key !==
      "Enter"
    ) {
      return;
    }

    event.preventDefault();

    handleAddSkill();
  };

  /* ========================================
     Accessibility IDs
  ======================================== */

  const skillInputHelpId =
    "skill-input-help";

  const skillInputErrorId =
    "skill-input-error";

  const skillInputDescribedBy =
    inputError
      ? `${skillInputHelpId} ${skillInputErrorId}`
      : skillInputHelpId;

  return (
    <div>
      {/* =====================================
          Header
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
          Core Strengths
        </p>

        <h2
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
          Skills
        </h2>

        <p
          className="
            mt-3
            max-w-2xl

            text-sm
            leading-6

            text-zinc-500
            dark:text-zinc-400
          "
        >
          Add your strongest and
          most relevant technical
          or professional skills.
          Focus on skills that
          match the roles you want
          to apply for.
        </p>
      </div>

      {/* =====================================
          Skills Guidance
      ===================================== */}

      <div
        className="
          mt-7

          flex
          items-start
          gap-4

          rounded-2xl

          border
          border-stone-200

          bg-[#faf9f6]

          p-4

          dark:border-zinc-800
          dark:bg-zinc-950
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

            dark:bg-violet-950/30
            dark:text-violet-400
          "
        >
          <Lightbulb
            size={17}
            aria-hidden="true"
          />
        </div>

        <div>
          <p
            className="
              text-sm
              font-black

              text-zinc-950
              dark:text-white
            "
          >
            Prioritize relevant
            skills
          </p>

          <p
            className="
              mt-1

              text-xs
              leading-5

              text-zinc-500
              dark:text-zinc-400
            "
          >
            A focused skills list
            is stronger than
            adding every
            technology you have
            encountered.
            Prioritize the tools,
            languages,
            frameworks, and
            strengths most
            relevant to your
            target role.
          </p>
        </div>
      </div>

      {/* =====================================
          Skill Input
      ===================================== */}

      <div
        className="
          mt-8

          rounded-2xl

          border
          border-stone-200

          bg-[#faf9f6]

          p-4

          dark:border-zinc-800
          dark:bg-zinc-950

          sm:p-5
        "
      >
        <label
          htmlFor="skill-input"
          className="
            text-xs
            font-black

            text-zinc-700
            dark:text-zinc-300
          "
        >
          Add a skill
        </label>

        <div
          className="
            mt-2

            flex
            flex-col
            gap-2

            sm:flex-row
          "
        >
          <input
            id="skill-input"
            type="text"
            value={
              skillInput
            }
            maxLength={
              MAX_SKILL_LENGTH
            }
            placeholder="Example: React"
            onChange={(
              event
            ) => {
              setSkillInput(
                event.target
                  .value
              );

              if (
                inputError
              ) {
                setInputError(
                  ""
                );
              }
            }}
            onKeyDown={
              handleKeyDown
            }
            aria-invalid={
              Boolean(
                inputError
              )
            }
            aria-describedby={
              skillInputDescribedBy
            }
            className="
              min-w-0
              flex-1

              rounded-xl

              border
              border-stone-200

              bg-white

              px-4
              py-3

              text-sm
              text-zinc-950

              outline-none
              transition-all

              placeholder:text-zinc-400

              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-500/10

              dark:border-zinc-800
              dark:bg-zinc-900
              dark:text-white
              dark:placeholder:text-zinc-600
            "
          />

          <button
            type="button"
            onClick={() =>
              handleAddSkill()
            }
            disabled={
              !skillInput.trim()
            }
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-zinc-950

              px-4
              py-3

              text-sm
              font-black

              shadow-sm

              transition-all

              hover:-translate-y-0.5
              hover:shadow-md

              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:translate-y-0

              dark:bg-white
            "
          >
            <Plus
              size={15}
              aria-hidden="true"
              className="
                text-white
                dark:text-zinc-950
              "
            />

            <span
              className="
                text-white
                dark:text-zinc-950
              "
            >
              Add Skill
            </span>
          </button>
        </div>

        <div
          className="
            mt-2

            flex
            items-center
            justify-between
            gap-3
          "
        >
          <p
            id={
              skillInputHelpId
            }
            className="
              text-[11px]
              text-zinc-400
              dark:text-zinc-500
            "
          >
            Press Enter to add
          </p>

          <p
            aria-hidden="true"
            className="
              text-[11px]
              font-bold
              text-zinc-400
              dark:text-zinc-500
            "
          >
            {skillInput.length}
            /{MAX_SKILL_LENGTH}
          </p>
        </div>

        {inputError && (
          <div
            id={
              skillInputErrorId
            }
            role="alert"
            className="
              mt-3

              flex
              items-start
              gap-2

              rounded-xl

              border
              border-rose-200

              bg-rose-50

              px-3
              py-2.5

              dark:border-rose-900/40
              dark:bg-rose-950/10
            "
          >
            <AlertCircle
              size={14}
              aria-hidden="true"
              className="
                mt-0.5
                shrink-0

                text-rose-600
                dark:text-rose-400
              "
            />

            <p
              className="
                text-xs
                font-semibold
                leading-5

                text-rose-700
                dark:text-rose-300
              "
            >
              {inputError}
            </p>
          </div>
        )}
      </div>

      {/* =====================================
          Added Skills
      ===================================== */}

      <div className="mt-7">
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <div>
            <h3
              className="
                text-sm
                font-black

                text-zinc-950
                dark:text-white
              "
            >
              Your Skills
            </h3>

            <p
              className="
                mt-1

                text-xs

                text-zinc-500
                dark:text-zinc-400
              "
            >
              {skills.length} of{" "}
              {MAX_SKILLS} skills
              added
            </p>
          </div>
        </div>

        {skills.length >
        0 ? (
          <div
            className="
              mt-4

              flex
              flex-wrap
              gap-2
            "
          >
            {skills.map(
              (skill) => (
                <div
                  key={
                    skill
                  }
                  className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-violet-200

                    bg-violet-50

                    px-3
                    py-1.5

                    text-xs
                    font-bold

                    text-violet-700

                    dark:border-violet-900/50
                    dark:bg-violet-950/20
                    dark:text-violet-300
                  "
                >
                  <span
                    className="
                      max-w-[220px]
                      truncate
                    "
                  >
                    {skill}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSkill(
                        skill
                      )
                    }
                    aria-label={`Remove ${skill}`}
                    className="
                      flex
                      h-4
                      w-4
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      text-violet-500

                      transition-colors

                      hover:bg-violet-200
                      hover:text-violet-800

                      dark:hover:bg-violet-900/60
                      dark:hover:text-violet-200
                    "
                  >
                    <X
                      size={11}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className="
              mt-4

              rounded-2xl

              border
              border-dashed
              border-stone-300

              px-5
              py-8

              text-center

              dark:border-zinc-700
            "
          >
            <Sparkles
              size={22}
              aria-hidden="true"
              className="
                mx-auto

                text-zinc-300
                dark:text-zinc-600
              "
            />

            <p
              className="
                mt-3

                text-sm
                font-black

                text-zinc-950
                dark:text-white
              "
            >
              No skills added yet
            </p>

            <p
              className="
                mx-auto
                mt-1

                max-w-sm

                text-xs
                leading-5

                text-zinc-500
                dark:text-zinc-400
              "
            >
              Start with the
              technologies and
              strengths most
              important for your
              target role.
            </p>
          </div>
        )}
      </div>

      {/* =====================================
          AI Skill Recommendations
      ===================================== */}

      <div
        className="
          mt-7

          rounded-2xl

          border
          border-violet-200

          bg-violet-50/40

          p-4

          dark:border-violet-900/50
          dark:bg-violet-950/10
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
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-xl

                bg-violet-600
                text-white

                dark:bg-violet-500
              "
            >
              <Sparkles
                size={16}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-black

                  text-zinc-950
                  dark:text-white
                "
              >
                AI Skill
                Recommendations
              </p>

              <p
                className="
                  mt-1
                  max-w-xl

                  text-xs
                  leading-5

                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Get optional
                skills related
                to your most
                recently added
                skill, refined
                using your
                resume and
                target job
                context.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleRecommendSkills
            }
            disabled={
              isAiLoading ||
              skills.length === 0
            }
            aria-busy={
              isAiLoading
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
              border-violet-200
              dark:border-violet-900

              bg-white
              dark:bg-zinc-900

              px-4
              py-2.5

              text-xs
              font-black

              text-violet-600
              dark:text-violet-400

              transition-all

              hover:border-violet-300
              hover:bg-violet-50
              dark:hover:border-violet-800
              dark:hover:bg-violet-950/30

              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-violet-500/20

              disabled:cursor-not-allowed
              disabled:opacity-50

              sm:w-auto
            "
          >
            <Sparkles
              size={13}
              aria-hidden="true"
            />

            {isAiLoading
              ? "Finding Skills..."
              : aiRecommendations
                    .length >
                  0
                ? "Generate Again"
                : "Recommend with AI"}
          </button>
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {isAiLoading
            ? "AI is finding related skill recommendations."
            : aiRecommendations
                  .length >
                0
              ? "AI skill recommendations are ready for review."
              : ""}
        </div>

        {aiError && (
          <div
            role="alert"
            className="
              mt-4

              rounded-xl

              border
              border-rose-200

              bg-rose-50

              px-3
              py-2.5

              dark:border-rose-900/40
              dark:bg-rose-950/10
            "
          >
            <p
              className="
                text-xs
                font-semibold
                leading-5

                text-rose-700
                dark:text-rose-300
              "
            >
              {aiError}
            </p>
          </div>
        )}

        {!isAiLoading &&
          !aiError &&
          aiRecommendations
            .length > 0 &&
          availableAiRecommendations
            .length === 0 && (
            <div
              className="
                mt-4

                rounded-xl

                border
                border-emerald-200

                bg-emerald-50

                px-3
                py-3

                dark:border-emerald-900/40
                dark:bg-emerald-950/10
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  leading-5

                  text-emerald-700
                  dark:text-emerald-300
                "
              >
                All AI
                recommendations
                have been added
                or reviewed.
              </p>
            </div>
          )}

        {availableAiRecommendations
          .length > 0 && (
          <div
            className="
              mt-4
              space-y-3
            "
          >
            {availableAiRecommendations.map(
              (
                recommendation
              ) => (
                <div
                  key={
                    recommendation.skill
                  }
                  className="
                    rounded-xl

                    border
                    border-stone-200

                    bg-white

                    p-4

                    dark:border-zinc-800
                    dark:bg-zinc-900
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-3

                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          text-sm
                          font-black

                          text-zinc-950
                          dark:text-white
                        "
                      >
                        {
                          recommendation.skill
                        }
                      </p>

                      {recommendation.reason && (
                        <p
                          className="
                            mt-1

                            text-xs
                            leading-5

                            text-zinc-500
                            dark:text-zinc-400
                          "
                        >
                          {
                            recommendation.reason
                          }
                        </p>
                      )}
                    </div>

                    <div
                      className="
                        flex
                        shrink-0
                        flex-wrap
                        gap-2
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleAddSkill(
                            recommendation.skill
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5

                          rounded-lg

                          bg-zinc-950

                          px-3
                          py-2

                          text-xs
                          font-black
                          text-white

                          transition

                          hover:bg-zinc-800

                          focus-visible:outline-none
                          focus-visible:ring-4
                          focus-visible:ring-zinc-500/15

                          dark:bg-white
                          dark:text-zinc-950
                          dark:hover:bg-zinc-200
                        "
                      >
                        <Plus
                          size={12}
                          aria-hidden="true"
                        />

                        Add Skill
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDiscardAiSkill(
                            recommendation.skill
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5

                          rounded-lg

                          border
                          border-stone-200

                          bg-white

                          px-3
                          py-2

                          text-xs
                          font-black

                          text-zinc-600

                          transition

                          hover:bg-stone-50

                          focus-visible:outline-none
                          focus-visible:ring-4
                          focus-visible:ring-zinc-500/10

                          dark:border-zinc-700
                          dark:bg-zinc-900
                          dark:text-zinc-300
                          dark:hover:bg-zinc-800
                        "
                      >
                        <X
                          size={12}
                          aria-hidden="true"
                        />

                        Discard
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* =====================================
          Autosave
      ===================================== */}

      <div
        className="
          mt-6

          rounded-2xl

          border
          border-emerald-200

          bg-emerald-50/60

          px-4
          py-3

          dark:border-emerald-900/40
          dark:bg-emerald-950/10
        "
      >
        <p
          className="
            text-xs
            font-semibold
            leading-5

            text-emerald-700
            dark:text-emerald-400
          "
        >
          Skills are saved
          automatically whenever
          you add or remove one.
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;