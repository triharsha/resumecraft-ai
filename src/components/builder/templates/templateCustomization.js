export const defaultResumeCustomization = {
  fontFamily: "Inter",
  fontSize: "medium",
  accentColor: "#7c3aed",
  spacing: "normal",
};

/* ========================================
   Customization Resolver
======================================== */

export const getResumeCustomization = (
  resume
) => {
  return {
    ...defaultResumeCustomization,
    ...(resume.customization || {}),
  };
};

/* ========================================
   Font Scale
======================================== */

export const getFontScale = (
  fontSize
) => {
  const map = {
    small: 0.92,
    medium: 1,
    large: 1.08,
  };

  return map[fontSize] || 1;
};

/* ========================================
   Spacing Scale
======================================== */

export const getSpacingScale = (
  spacing
) => {
  const map = {
    compact: 0.88,
    normal: 1,
    relaxed: 1.12,
  };

  return map[spacing] || 1;
};

/* ========================================
   Dynamic Measurements
======================================== */

export const scaledFontSize = (
  baseSize,
  scale
) => {
  return `${baseSize * scale}px`;
};

export const scaledSpacing = (
  baseSize,
  scale
) => {
  return `${baseSize * scale}px`;
};