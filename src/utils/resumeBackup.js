import {
  normalizeResumes,
} from "./resume";

export const RESUME_BACKUP_VERSION =
  2;

/* ========================================
   Get Backup State
======================================== */

const getBackupState = (
  parsedValue
) => {
  if (
    !parsedValue ||
    typeof parsedValue !==
      "object" ||
    Array.isArray(
      parsedValue
    )
  ) {
    throw new Error(
      "This file is not a valid ResumeCraft backup."
    );
  }

  if (
    parsedValue.state &&
    typeof parsedValue.state ===
      "object" &&
    !Array.isArray(
      parsedValue.state
    )
  ) {
    return parsedValue.state;
  }

  return parsedValue;
};

/* ========================================
   Create Backup
======================================== */

export const createResumeBackup = ({
  resumes,
  activeResumeId,

  theme,
  reducedMotion,
  defaultTemplate,
  defaultAccentColor,
}) => ({
  version:
    RESUME_BACKUP_VERSION,

  exportedAt:
    new Date().toISOString(),

  state: {
    resumes:
      Array.isArray(resumes)
        ? resumes
        : [],

    activeResumeId:
      typeof activeResumeId ===
        "string"
        ? activeResumeId
        : null,

    preferences: {
      theme:
        typeof theme ===
        "string"
          ? theme
          : "system",

      reducedMotion:
        typeof reducedMotion ===
        "boolean"
          ? reducedMotion
          : false,

      defaultTemplate:
        typeof defaultTemplate ===
        "string"
          ? defaultTemplate
          : "modern",

      defaultAccentColor:
        typeof defaultAccentColor ===
        "string"
          ? defaultAccentColor
          : "#7c3aed",
    },
  },
});

/* ========================================
   Download Backup
======================================== */

export const downloadResumeBackup = ({
  resumes,
  activeResumeId,

  theme,
  reducedMotion,
  defaultTemplate,
  defaultAccentColor,
}) => {
  if (
    !Array.isArray(resumes) ||
    resumes.length === 0
  ) {
    throw new Error(
      "Create at least one resume before exporting a backup."
    );
  }

  const backup =
    createResumeBackup({
      resumes,
      activeResumeId,

      theme,
      reducedMotion,
      defaultTemplate,
      defaultAccentColor,
    });

  const blob =
    new Blob(
      [
        JSON.stringify(
          backup,
          null,
          2
        ),
      ],
      {
        type:
          "application/json",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      "a"
    );

  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  anchor.href = url;

  anchor.download =
    `resumecraft-backup-${date}.json`;

  document.body.appendChild(
    anchor
  );

  anchor.click();
  anchor.remove();

  window.setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    0
  );
};

/* ========================================
   Parse Backup
======================================== */

export const parseResumeBackup = (
  rawText
) => {
  let parsedValue;

  try {
    parsedValue =
      JSON.parse(
        rawText
      );
  } catch {
    throw new Error(
      "The selected file is not valid JSON."
    );
  }

  const backupState =
    getBackupState(
      parsedValue
    );

  if (
    !Array.isArray(
      backupState.resumes
    )
  ) {
    throw new Error(
      "This backup does not contain a ResumeCraft resumes array."
    );
  }

  const resumes =
    normalizeResumes(
      backupState.resumes
    );

  if (
    resumes.length === 0
  ) {
    throw new Error(
      "This backup does not contain any resumes to restore."
    );
  }

  const requestedActiveId =
    typeof backupState.activeResumeId ===
      "string"
      ? backupState.activeResumeId
      : null;

  const activeResumeExists =
    requestedActiveId
      ? resumes.some(
          (resume) =>
            resume.id ===
            requestedActiveId
        )
      : false;

  const preferences =
    backupState.preferences &&
    typeof backupState.preferences ===
      "object" &&
    !Array.isArray(
      backupState.preferences
    )
      ? backupState.preferences
      : null;

  return {
    resumes,

    activeResumeId:
      activeResumeExists
        ? requestedActiveId
        : resumes[0]?.id ??
          null,

    /*
     * Older Version 1 backups do
     * not contain preferences.
     *
     * Keeping this as null means
     * restoring an old backup will
     * restore resumes without
     * unexpectedly resetting the
     * user's current settings.
     */
    preferences:
      preferences
        ? {
            theme:
              typeof preferences.theme ===
              "string"
                ? preferences.theme
                : undefined,

            reducedMotion:
              typeof preferences.reducedMotion ===
              "boolean"
                ? preferences.reducedMotion
                : undefined,

            defaultTemplate:
              typeof preferences.defaultTemplate ===
              "string"
                ? preferences.defaultTemplate
                : undefined,

            defaultAccentColor:
              typeof preferences.defaultAccentColor ===
              "string"
                ? preferences.defaultAccentColor
                : undefined,
          }
        : null,
  };
};