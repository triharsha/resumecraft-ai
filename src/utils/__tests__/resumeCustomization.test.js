import {
  describe,
  expect,
  it,
} from "vitest";

import {
  defaultResumeCustomization,
  getResumeCustomization,
  getFontScale,
  getSpacingScale,
  scaledFontSize,
  scaledSpacing,
} from "../../components/builder/templates/templateCustomization";

/* ========================================
   Default Customization
======================================== */

describe("defaultResumeCustomization", () => {
  it("provides the expected defaults", () => {
    expect(
      defaultResumeCustomization
    ).toEqual({
      fontFamily: "Inter",
      fontSize: "medium",
      accentColor: "#7c3aed",
      spacing: "normal",
    });
  });
});

/* ========================================
   Customization Resolver
======================================== */

describe("getResumeCustomization", () => {
  it("returns defaults when customization is missing", () => {
    const result =
      getResumeCustomization({});

    expect(result).toEqual(
      defaultResumeCustomization
    );
  });

  it("merges partial customization with defaults", () => {
    const result =
      getResumeCustomization({
        customization: {
          fontSize: "large",
        },
      });

    expect(result).toEqual({
      fontFamily: "Inter",
      fontSize: "large",
      accentColor: "#7c3aed",
      spacing: "normal",
    });
  });

  it("allows all customization values to be overridden", () => {
    const result =
      getResumeCustomization({
        customization: {
          fontFamily: "Georgia",
          fontSize: "small",
          accentColor: "#2563eb",
          spacing: "compact",
        },
      });

    expect(result).toEqual({
      fontFamily: "Georgia",
      fontSize: "small",
      accentColor: "#2563eb",
      spacing: "compact",
    });
  });

  it("does not mutate the default customization object", () => {
    const before = {
      ...defaultResumeCustomization,
    };

    getResumeCustomization({
      customization: {
        fontFamily: "Georgia",
        accentColor: "#000000",
      },
    });

    expect(
      defaultResumeCustomization
    ).toEqual(before);
  });

  it("returns a new customization object", () => {
    const result =
      getResumeCustomization({});

    expect(result).not.toBe(
      defaultResumeCustomization
    );
  });
});

/* ========================================
   Font Scale
======================================== */

describe("getFontScale", () => {
  it("returns the small font scale", () => {
    expect(
      getFontScale("small")
    ).toBe(0.92);
  });

  it("returns the medium font scale", () => {
    expect(
      getFontScale("medium")
    ).toBe(1);
  });

  it("returns the large font scale", () => {
    expect(
      getFontScale("large")
    ).toBe(1.08);
  });

  it("falls back to normal scale for an unknown font size", () => {
    expect(
      getFontScale("unknown")
    ).toBe(1);
  });

  it("falls back safely when font size is missing", () => {
    expect(
      getFontScale()
    ).toBe(1);
  });
});

/* ========================================
   Spacing Scale
======================================== */

describe("getSpacingScale", () => {
  it("returns the compact spacing scale", () => {
    expect(
      getSpacingScale("compact")
    ).toBe(0.88);
  });

  it("returns the normal spacing scale", () => {
    expect(
      getSpacingScale("normal")
    ).toBe(1);
  });

  it("returns the relaxed spacing scale", () => {
    expect(
      getSpacingScale("relaxed")
    ).toBe(1.12);
  });

  it("falls back to normal scale for an unknown spacing value", () => {
    expect(
      getSpacingScale("unknown")
    ).toBe(1);
  });

  it("falls back safely when spacing is missing", () => {
    expect(
      getSpacingScale()
    ).toBe(1);
  });
});

/* ========================================
   Dynamic Measurements
======================================== */

describe("scaledFontSize", () => {
  it("scales a font measurement", () => {
    expect(
      scaledFontSize(
        16,
        1.08
      )
    ).toBe("17.28px");
  });

  it("keeps the original measurement at scale 1", () => {
    expect(
      scaledFontSize(
        14,
        1
      )
    ).toBe("14px");
  });

  it("supports compact scaling", () => {
    expect(
      scaledFontSize(
        20,
        0.92
      )
    ).toBe(
      "18.400000000000002px"
    );
  });
});

describe("scaledSpacing", () => {
  it("scales spacing measurements", () => {
    expect(
      scaledSpacing(
        20,
        0.88
      )
    ).toBe("17.6px");
  });

  it("keeps spacing unchanged at scale 1", () => {
    expect(
      scaledSpacing(
        24,
        1
      )
    ).toBe("24px");
  });

  it("supports relaxed spacing", () => {
    expect(
      scaledSpacing(
        25,
        1.12
      )
    ).toBe(
      "28.000000000000004px"
    );
  });
});