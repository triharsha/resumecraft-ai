import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Lightbulb,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import ConfirmDialog from "../../ui/ConfirmDialog";
import FormField from "../../ui/FormField";
import { projectSchema } from "../../../schemas/projectSchema";
import { improveProject } from "../../../services/aiService";
import { createEmptyProject } from "../../../utils/resume";
import useResumeStore from "../../../stores/resumeStore";

const MAX_TECHNOLOGIES = 20;
const MAX_TECH_LENGTH = 40;

/* ========================================
   Single Project Editor
======================================== */

const ProjectEditor = ({
  resumeId,
  resume,
  project,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const [technologyInput, setTechnologyInput] = useState("");
  const [technologyError, setTechnologyError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiError, setAiError] = useState("");

  const updateSectionItem = useResumeStore(
    (state) => state.updateSectionItem
  );

  const removeSectionItem = useResumeStore(
    (state) => state.removeSectionItem
  );

  const isResettingRef = useRef(false);

  const projectId = project.id;
  const projectName = project.name || "";
  const projectDescription = project.description || "";
  const projectTechnologies = useMemo(
    () =>
      Array.isArray(project.technologies)
        ? project.technologies
        : [],
    [project.technologies]
  );

  const projectUrl = project.projectUrl || "";
  const githubUrl = project.githubUrl || "";

  const {
    register,
    reset,
    setValue,
    control,

    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(projectSchema),

    mode: "onChange",

    defaultValues: {
      name: projectName,
      description: projectDescription,
      technologies: projectTechnologies,
      projectUrl,
      githubUrl,
    },
  });

  const formValues = useWatch({
    control,
  });

  const name = formValues.name || "";

  const description = formValues.description || "";

  const technologies = useMemo(
    () =>
      Array.isArray(formValues.technologies)
        ? formValues.technologies
        : [],
    [formValues.technologies]
  );

  const watchedProjectUrl = formValues.projectUrl || "";

  const watchedGithubUrl = formValues.githubUrl || "";

  /* ========================================
     Reset Project
  ======================================== */

  useEffect(() => {
    isResettingRef.current = true;

    reset({
      name: projectName,
      description: projectDescription,
      technologies: projectTechnologies,
      projectUrl,
      githubUrl,
    });

    const frameId = requestAnimationFrame(() => {
      isResettingRef.current = false;
    });

    return () => {
      cancelAnimationFrame(frameId);

      isResettingRef.current = false;
    };
  }, [
    projectId,
    projectName,
    projectDescription,
    projectTechnologies,
    projectUrl,
    githubUrl,
    reset,
  ]);

  /* ========================================
     Autosave
  ======================================== */

  useEffect(() => {
    if (isResettingRef.current) {
      return;
    }

    const sameTechnologies =
      technologies.length === projectTechnologies.length &&
      technologies.every(
        (technology, technologyIndex) =>
          technology === projectTechnologies[technologyIndex]
      );

    const unchanged =
      name === projectName &&
      description === projectDescription &&
      sameTechnologies &&
      watchedProjectUrl === projectUrl &&
      watchedGithubUrl === githubUrl;

    if (unchanged) {
      return;
    }

    updateSectionItem(
      resumeId,
      "projects",
      projectId,
      {
        name,
        description,
        technologies,
        projectUrl: watchedProjectUrl,
        githubUrl: watchedGithubUrl,
      }
    );
  }, [
    name,
    description,
    technologies,
    watchedProjectUrl,
    watchedGithubUrl,
    resumeId,
    projectId,
    projectName,
    projectDescription,
    projectTechnologies,
    projectUrl,
    githubUrl,
    updateSectionItem,
  ]);

  /* ========================================
     Add Technology
  ======================================== */

  const handleAddTechnology = (
    value = technologyInput
  ) => {
    const trimmed = value.trim();

    setTechnologyError("");

    if (!trimmed) {
      return;
    }

    if (trimmed.length > MAX_TECH_LENGTH) {
      setTechnologyError(
        `Technology names must be ${MAX_TECH_LENGTH} characters or less.`
      );

      return;
    }

    if (technologies.length >= MAX_TECHNOLOGIES) {
      setTechnologyError(
        `You can add up to ${MAX_TECHNOLOGIES} technologies.`
      );

      return;
    }

    const duplicate = technologies.some(
      (technology) =>
        technology.trim().toLowerCase() ===
        trimmed.toLowerCase()
    );

    if (duplicate) {
      setTechnologyError(
        `"${trimmed}" has already been added.`
      );

      return;
    }

    setValue(
      "technologies",
      [...technologies, trimmed],
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );

    setTechnologyInput("");
  };

  /* ========================================
     Remove Technology
  ======================================== */

  const handleRemoveTechnology = (
    technologyToRemove
  ) => {
    const nextTechnologies = technologies.filter(
      (technology) =>
        technology !== technologyToRemove
    );

    setValue(
      "technologies",
      nextTechnologies,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );

    setTechnologyError("");
  };

  /* ========================================
     Technology Keyboard
  ======================================== */

  const handleTechnologyKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    handleAddTechnology();
  };

  /* ========================================
     AI Project Improvement
  ======================================== */

  const buildExperienceContext = () => {
    const experiences = Array.isArray(resume?.experience)
      ? resume.experience
      : Array.isArray(resume?.experiences)
        ? resume.experiences
        : [];

    return experiences
      .map((item) => {
        const parts = [
          item?.jobTitle,
          item?.company,
          item?.description,
        ]
          .filter(Boolean)
          .join(" - ");

        return parts.trim();
      })
      .filter(Boolean)
      .join("\n");
  };

  const handleAiImprove = async () => {
    if (!description.trim() || errors.description) {
      return;
    }

    setIsImproving(true);
    setAiError("");
    setAiSuggestion("");

    try {
      const suggestion = await improveProject({
        description,
        projectName: name,
        technologies,
        targetJobTitle:
          resume?.jobTarget?.jobTitle || "",
        targetJobDescription:
          resume?.jobTarget?.jobDescription || "",
        skills: Array.isArray(resume?.skills)
          ? resume.skills
              .map((skill) =>
                typeof skill === "string"
                  ? skill
                  : skill?.name
              )
              .filter(Boolean)
          : [],
        experience: buildExperienceContext(),
      });

      setAiSuggestion(suggestion);
    } catch (error) {
      setAiError(
        error?.message ||
          "Unable to improve the project right now."
      );
    } finally {
      setIsImproving(false);
    }
  };

  const handleApplySuggestion = () => {
    if (!aiSuggestion) {
      return;
    }

    setValue(
      "description",
      aiSuggestion,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );

    setAiSuggestion("");
    setAiError("");
  };

  const handleDiscardSuggestion = () => {
    setAiSuggestion("");
    setAiError("");
  };

  /* ========================================
     Delete Project
  ======================================== */

  const handleRemove = () => {
    setShowDeleteDialog(true);
  };

  const confirmRemove = () => {
    setAiSuggestion("");
    setAiError("");
    setTechnologyError("");
    setTechnologyInput("");

    removeSectionItem(
      resumeId,
      "projects",
      projectId
    );

    setShowDeleteDialog(false);
  };

  /* ========================================
     Display Information
  ======================================== */

  const displayTitle =
    project.name || `Project ${index + 1}`;

  const displaySubtitle =
    Array.isArray(project.technologies) &&
    project.technologies.length > 0
      ? project.technologies
          .slice(0, 3)
          .join(" • ")
      : "Add project details";

  const editorId =
    `project-editor-${projectId}`;

  const technologyInputId =
    `technology-${projectId}`;

  const technologyHelpId =
    `${technologyInputId}-help`;

  const technologyErrorId =
    `${technologyInputId}-error`;

  const technologyDescribedBy =
    technologyError
      ? `${technologyHelpId} ${technologyErrorId}`
      : technologyHelpId;

  const descriptionId =
    `project-description-${projectId}`;

  const descriptionErrorId =
    `${descriptionId}-error`;

  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-stone-200
        bg-[#faf9f6]

        dark:border-zinc-800
        dark:bg-zinc-950
      "
    >
      {/* =====================================
          Project Header
      ===================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4

          px-4
          py-4

          sm:px-5
        "
      >
        <button
          type="button"
          onClick={() =>
            setIsExpanded(
              (currentState) =>
                !currentState
            )
          }
          aria-expanded={isExpanded}
          aria-controls={editorId}
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-3
            text-left
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
            <Code2
              size={17}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-black
                text-zinc-950

                dark:text-white
              "
            >
              {displayTitle}
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-xs
                text-zinc-500

                dark:text-zinc-400
              "
            >
              {displaySubtitle}
            </p>
          </div>
        </button>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${displayTitle}`}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-xl
              border
              border-rose-200

              text-rose-500

              transition-colors

              hover:bg-rose-50

              dark:border-rose-900/40
              dark:text-rose-400
              dark:hover:bg-rose-950/20
            "
          >
            <Trash2
              size={15}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setIsExpanded(
                (currentState) =>
                  !currentState
              )
            }
            aria-label={
              isExpanded
                ? "Collapse project"
                : "Expand project"
            }
            aria-expanded={isExpanded}
            aria-controls={editorId}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-xl
              border
              border-stone-200

              text-zinc-500

              transition-colors

              hover:bg-white

              dark:border-zinc-800
              dark:text-zinc-400
              dark:hover:bg-zinc-900
            "
          >
            {isExpanded ? (
              <ChevronUp
                size={16}
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                size={16}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      {/* =====================================
          Project Editor
      ===================================== */}

      {isExpanded && (
        <div
          id={editorId}
          className="
            border-t
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
              grid
              gap-5

              md:grid-cols-2
            "
          >
            <div className="md:col-span-2">
              <FormField
                label="Project Name"
                name="name"
                placeholder="ResumeCraft AI"
                register={register}
                error={errors.name}
              />
            </div>

            <FormField
              label="Live Project URL"
              name="projectUrl"
              placeholder="https://yourproject.com"
              register={register}
              error={errors.projectUrl}
            />

            <FormField
              label="GitHub URL"
              name="githubUrl"
              placeholder="https://github.com/username/project"
              register={register}
              error={errors.githubUrl}
            />
          </div>

          {/* =================================
              Technologies
          ================================= */}

          <div className="mt-5">
            <label
              htmlFor={technologyInputId}
              className="
                text-xs
                font-black
                text-zinc-700

                dark:text-zinc-300
              "
            >
              Technologies Used
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
                id={technologyInputId}
                type="text"
                value={technologyInput}
                maxLength={MAX_TECH_LENGTH}
                placeholder="Example: React"
                onChange={(event) => {
                  setTechnologyInput(
                    event.target.value
                  );

                  if (technologyError) {
                    setTechnologyError("");
                  }
                }}
                onKeyDown={handleTechnologyKeyDown}
                aria-invalid={
                  Boolean(technologyError)
                }
                aria-describedby={
                  technologyDescribedBy
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
                  dark:bg-zinc-950
                  dark:text-white
                "
              />

              <button
                type="button"
                onClick={() =>
                  handleAddTechnology()
                }
                disabled={
                  !technologyInput.trim()
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

                  text-xs
                  font-black

                  transition-all

                  hover:-translate-y-0.5

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:hover:translate-y-0

                  dark:bg-white
                "
              >
                <Plus
                  size={14}
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
                  Add
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
                id={technologyHelpId}
                className="
                  text-[11px]
                  text-zinc-400
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
                "
              >
                {technologies.length}/
                {MAX_TECHNOLOGIES}
              </p>
            </div>

            {technologyError && (
              <div
                id={technologyErrorId}
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
                  {technologyError}
                </p>
              </div>
            )}

            {technologies.length > 0 && (
              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {technologies.map(
                  (technology) => (
                    <div
                      key={technology}
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
                      <span className="truncate">
                        {technology}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTechnology(
                            technology
                          )
                        }
                        aria-label={`Remove ${technology}`}
                        className="
                          flex
                          h-4
                          w-4
                          shrink-0
                          items-center
                          justify-center

                          rounded-full

                          transition-colors

                          hover:bg-violet-200

                          dark:hover:bg-violet-900/60
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
            )}
          </div>

          {/* =================================
              Description
          ================================= */}

          <div className="mt-5">
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <label
                htmlFor={descriptionId}
                className="
                  text-xs
                  font-black
                  text-zinc-700

                  dark:text-zinc-300
                "
              >
                Project Description
              </label>

              <span
                aria-hidden="true"
                className="
                  text-xs
                  font-bold
                  text-zinc-400

                  dark:text-zinc-500
                "
              >
                {description.length}/1200
              </span>
            </div>

            <textarea
              id={descriptionId}
              rows={6}
              maxLength={1200}
              placeholder="Describe what you built, the problem it solves, your contribution, and the most important result or feature..."
              aria-invalid={
                Boolean(errors.description)
              }
              aria-describedby={
                errors.description
                  ? descriptionErrorId
                  : undefined
              }
              {...register("description")}
              className={`
                mt-2
                min-h-[150px]
                w-full
                resize-y

                rounded-2xl
                border

                bg-white

                px-4
                py-3.5

                text-sm
                leading-7
                text-zinc-950

                outline-none
                transition-all

                dark:bg-zinc-950
                dark:text-white

                ${
                  errors.description
                    ? `
                      border-rose-400
                      focus:border-rose-500
                      focus:ring-4
                      focus:ring-rose-500/10
                    `
                    : `
                      border-stone-200
                      focus:border-violet-500
                      focus:ring-4
                      focus:ring-violet-500/10

                      dark:border-zinc-800
                    `
                }
              `}
            />

            {errors.description && (
              <p
                id={descriptionErrorId}
                role="alert"
                className="
                  mt-2
                  text-xs
                  font-semibold

                  text-rose-600

                  dark:text-rose-400
                "
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* =================================
              AI Project Improvement
          ================================= */}

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-violet-200
              bg-violet-50/60
              p-4

              dark:border-violet-900/40
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
                    Improve with AI
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
                    Strengthen this project description while
                    preserving your original facts and technologies.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiImprove}
                disabled={
                  isImproving ||
                  !description.trim() ||
                  Boolean(
                    errors.description
                  )
                }
                aria-busy={isImproving}
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

                {isImproving
                  ? "Improving..."
                  : "AI Improve"}
              </button>
            </div>

            <span
              className="sr-only"
              aria-live="polite"
            >
              {isImproving
                ? "AI is improving the project description."
                : ""}
            </span>

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

                  text-xs
                  font-semibold
                  leading-5
                  text-rose-700

                  dark:border-rose-900/40
                  dark:bg-rose-950/10
                  dark:text-rose-300
                "
              >
                {aiError}
              </div>
            )}

            {aiSuggestion && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-violet-200
                  bg-white
                  p-4

                  dark:border-violet-900/50
                  dark:bg-zinc-950
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    text-violet-700

                    dark:text-violet-300
                  "
                >
                  AI Suggested
                </p>

                <p
                  className="
                    mt-2
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                    text-zinc-700

                    dark:text-zinc-300
                  "
                >
                  {aiSuggestion}
                </p>

                <p
                  className="
                    mt-3
                    text-[11px]
                    leading-5
                    text-zinc-400

                    dark:text-zinc-500
                  "
                >
                  Your current description stays
                  unchanged until you apply this
                  suggestion.
                </p>

                <div
                  className="
                    mt-4
                    flex
                    flex-col
                    gap-2

                    sm:flex-row
                    sm:justify-end
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleDiscardSuggestion
                    }
                    className="
                      rounded-xl
                      border
                      border-stone-200

                      bg-white

                      px-4
                      py-2.5

                      text-xs
                      font-black
                      text-zinc-700

                      transition-colors

                      hover:bg-stone-50

                      dark:border-zinc-700
                      dark:bg-zinc-900
                      dark:text-zinc-200
                      dark:hover:bg-zinc-800
                    "
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleApplySuggestion
                    }
                    className="
                      rounded-xl

                      bg-violet-600

                      px-4
                      py-2.5

                      text-xs
                      font-black
                      text-white

                      transition-colors

                      hover:bg-violet-700
                    "
                  >
                    Apply Suggestion
                  </button>
                </div>
              </div>
            )}

            {!aiSuggestion &&
              !aiError && (
                <p
                  className="
                    mt-3
                    text-[11px]
                    leading-5
                    text-zinc-400

                    dark:text-zinc-500
                  "
                >
                  Add a project description first.
                  AI will improve the wording
                  without silently overwriting your
                  content.
                </p>
              )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Project?"
        description={`"${
          project.name ||
          `Project ${index + 1}`
        }" will be removed from your resume. This action cannot be undone.`}
        confirmLabel="Delete Project"
        cancelLabel="Cancel"
        tone="danger"
        onCancel={() =>
          setShowDeleteDialog(false)
        }
        onConfirm={confirmRemove}
      />
    </article>
  );
};

/* ========================================
   Projects Form
======================================== */

const ProjectsForm = ({
  resume,
}) => {
  const addSectionItem = useResumeStore(
    (state) => state.addSectionItem
  );

  const projects = Array.isArray(
    resume.projects
  )
    ? resume.projects
    : [];

  const handleAddProject = () => {
    addSectionItem(
      resume.id,
      "projects",
      createEmptyProject()
    );
  };

  return (
    <div>
      {/* =====================================
          Header
      ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-5

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
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
            Practical Work
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
            Projects
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
            Showcase projects that demonstrate how you apply
            your skills to real problems.
          </p>
        </div>

        {projects.length > 0 && (
          <button
            type="button"
            onClick={handleAddProject}
            className="
              inline-flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-zinc-950

              px-4
              py-2.5

              text-sm
              font-black

              shadow-sm
              transition-all

              hover:-translate-y-0.5
              hover:shadow-md

              dark:bg-white

              sm:w-auto
            "
          >
            <Plus
              size={15}
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
              Add Project
            </span>
          </button>
        )}
      </div>

      {/* =====================================
          Guidance
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
            Choose projects that prove your skills
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
            For a one-page resume, two or three strong,
            relevant projects are usually more valuable than a
            long project list.
          </p>
        </div>
      </div>

      {/* =====================================
          Project Entries
      ===================================== */}

      {projects.length > 0 ? (
        <div className="mt-8 space-y-4">
          {projects.map(
            (
              project,
              index
            ) => (
              <ProjectEditor
                key={project.id}
                resumeId={resume.id}
                resume={resume}
                project={project}
                index={index}
              />
            )
          )}
        </div>
      ) : (
        <div
          className="
            mt-8

            rounded-2xl
            border
            border-dashed
            border-stone-300

            px-5
            py-10

            text-center

            dark:border-zinc-700
          "
        >
          <Code2
            size={24}
            aria-hidden="true"
            className="
              mx-auto
              text-zinc-300

              dark:text-zinc-600
            "
          />

          <h3
            className="
              mt-3
              text-sm
              font-black

              text-zinc-950

              dark:text-white
            "
          >
            No projects added
          </h3>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm

              text-xs
              leading-5

              text-zinc-500

              dark:text-zinc-400
            "
          >
            Add projects that demonstrate your technical
            abilities, problem solving, and practical
            experience.
          </p>

          <button
            type="button"
            onClick={handleAddProject}
            className="
              mt-5
              inline-flex
              items-center
              justify-center
              gap-2
              whitespace-nowrap

              rounded-xl
              border
              border-stone-200

              bg-white

              px-4
              py-2.5

              text-xs
              font-black

              text-zinc-800

              transition-colors

              hover:bg-stone-50

              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-200
              dark:hover:bg-zinc-800
            "
          >
            <Plus
              size={14}
              aria-hidden="true"
              className="shrink-0"
            />

            <span>Add Project</span>
          </button>
        </div>
      )}

      {/* =====================================
          GitHub / Project Link Guidance
      ===================================== */}

      <div
        className="
          mt-6
          flex
          items-start
          gap-3

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
        <div
          className="
            mt-0.5
            flex
            shrink-0
            items-center
            gap-1.5
          "
        >
          <FaGithub
            size={15}
            aria-hidden="true"
            className="
              text-zinc-600

              dark:text-zinc-300
            "
          />

          <ExternalLink
            size={14}
            aria-hidden="true"
            className="
              text-zinc-500

              dark:text-zinc-400
            "
          />
        </div>

        <p
          className="
            text-xs
            leading-5

            text-zinc-500

            dark:text-zinc-400
          "
        >
          GitHub and live project links are optional, but
          including working links can make technical projects
          easier for recruiters to verify.
        </p>
      </div>

      {/* =====================================
          Autosave
      ===================================== */}

      <div
        className="
          mt-4

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
          Projects are saved automatically as you edit them.
        </p>
      </div>
    </div>
  );
};

export default ProjectsForm;