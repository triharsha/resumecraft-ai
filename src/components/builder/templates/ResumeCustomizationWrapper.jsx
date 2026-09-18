const defaultCustomization = {
  fontFamily: "Inter",
  fontSize: "medium",
  accentColor: "#7c3aed",
  spacing: "normal",
};

/* ========================================
   Font Families
======================================== */

const fontFamilyMap = {
  Inter:
    "Inter, ui-sans-serif, system-ui, sans-serif",

  Arial:
    "Arial, Helvetica, sans-serif",

  Georgia:
    "Georgia, 'Times New Roman', serif",

  "Times New Roman":
    "'Times New Roman', Times, serif",
};

/* ========================================
   Font Size Scale
======================================== */

const fontSizeScaleMap = {
  small: 0.92,
  medium: 1,
  large: 1.08,
};

/* ========================================
   Spacing Scale
======================================== */

const spacingScaleMap = {
  compact: 0.88,
  normal: 1,
  relaxed: 1.12,
};

/* ========================================
   Wrapper
======================================== */

const ResumeCustomizationWrapper = ({
  resume,
  children,
}) => {
  const customization = {
    ...defaultCustomization,
    ...(resume.customization ||
      {}),
  };

  const fontFamily =
    fontFamilyMap[
      customization.fontFamily
    ] ||
    fontFamilyMap.Inter;

  const fontScale =
    fontSizeScaleMap[
      customization.fontSize
    ] || 1;

  const spacingScale =
    spacingScaleMap[
      customization.spacing
    ] || 1;

  const accentColor =
    customization.accentColor ||
    defaultCustomization.accentColor;

  return (
    <div
      className="
        resume-customization-root
        absolute
        inset-0
      "
      style={{
        "--resume-font-family":
          fontFamily,

        "--resume-font-scale":
          fontScale,

        "--resume-spacing-scale":
          spacingScale,

        "--resume-accent":
          accentColor,

        fontFamily,
      }}
    >
      {children}
    </div>
  );
};

export default ResumeCustomizationWrapper;