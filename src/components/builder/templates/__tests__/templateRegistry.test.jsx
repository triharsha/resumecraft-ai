import {
  createRef,
} from "react";

import {
  render,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import ModernTemplate from "../ModernTemplate";

import {
  getAvailableTemplates,
  getFeaturedTemplates,
  getResumeTemplate,
  getTemplateOption,
  getTemplatesByCategory,
  ResumeTemplateRenderer,
  templateCategories,
  templateOptions,
  templateRegistry,
} from "../templateRegistry";

import {
  createResume,
} from "../../../../utils/resume";

/* ========================================
   Expected Final Template Architecture
======================================== */

const EXPECTED_TEMPLATES = {
  Modern: [
    "modern",
    "nova",
    "horizon",
    "vertex",
    "metro",
  ],

  Professional: [
    "professional",
    "executive",
    "corporate",
    "sterling",
    "authority",
  ],

  Minimal: [
    "minimal",
    "pure",
    "clean",
    "mono",
    "air",
  ],

  Classic: [
    "classic",
    "heritage",
    "oxford",
    "chronicle",
    "timeless",
  ],

  Creative: [
    "canvas",
    "spectrum",
    "muse",
    "studio",
    "vivid",
  ],

  Technical: [
    "developer",
    "engineer",
    "terminal",
    "architect",
    "stack",
  ],
};

const EXPECTED_TEMPLATE_IDS =
  Object.values(
    EXPECTED_TEMPLATES
  ).flat();

const REGISTERED_TEMPLATE_IDS =
  templateOptions.map(
    (template) =>
      template.id
  );

/* ========================================
   Test Resume
======================================== */

const createTestResume = () => {
  const resume =
    createResume({
      title:
        "Template Test Resume",
    });

  return {
    ...resume,

    personalInfo: {
      ...resume.personalInfo,

      firstName: "Alex",
      lastName: "Morgan",

      jobTitle:
        "Software Developer",

      email:
        "alex@example.com",

      phone:
        "9999999999",

      location:
        "Hyderabad",

      website:
        "alexmorgan.dev",

      linkedin:
        "linkedin.com/in/alexmorgan",

      github:
        "github.com/alexmorgan",
    },

    summary:
      "Software developer building modern and reliable applications.",

    experience: [
      {
        id: "experience-1",

        jobTitle:
          "Software Developer",

        company:
          "Example Technologies",

        employmentType:
          "full-time",

        location:
          "Hyderabad",

        startDate:
          "2024-01",

        endDate: "",

        current: true,

        description:
          "Built reliable web applications and collaborated on product development.",
      },
    ],

    education: [
      {
        id: "education-1",

        institution:
          "Example University",

        degree:
          "Bachelor of Technology",

        fieldOfStudy:
          "Computer Science",

        location:
          "Hyderabad",

        startDate:
          "2020-08",

        endDate:
          "2024-05",

        current: false,

        description:
          "Studied software engineering and computer science fundamentals.",
      },
    ],

    skills: [
      "Java",
      "React",
      "Spring Boot",
      "JavaScript",
      "MySQL",
      "Git",
    ],

    projects: [
      {
        id: "project-1",

        name:
          "Project Platform",

        description:
          "Built a full-featured application with reusable components and structured state management.",

        technologies: [
          "React",
          "JavaScript",
          "REST API",
        ],

        projectUrl:
          "example.com/project",

        githubUrl:
          "github.com/alexmorgan/project",
      },
    ],

    certifications: [
      {
        id: "certification-1",

        name:
          "Software Development",

        issuer:
          "Example Institute",

        issueDate:
          "2025-01",
      },
    ],

    languages: [
      {
        id: "language-1",

        name:
          "English",

        proficiency:
          "fluent",
      },
    ],
  };
};

/* ========================================
   Template Registry
======================================== */

describe(
  "templateRegistry",
  () => {
    it(
      "contains exactly the 30 final templates",
      () => {
        const registryIds =
          Object.keys(
            templateRegistry
          );

        expect(
          registryIds
        ).toHaveLength(30);

        expect(
          new Set(
            registryIds
          )
        ).toEqual(
          new Set(
            EXPECTED_TEMPLATE_IDS
          )
        );
      }
    );

    it(
      "is derived from templateOptions",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              templateRegistry[
                template.id
              ]
            ).toBe(
              template.component
            );
          }
        );
      }
    );

    it(
      "contains one registry entry for every template option",
      () => {
        expect(
          Object.keys(
            templateRegistry
          ).length
        ).toBe(
          templateOptions.length
        );
      }
    );

    it(
      "maps modern to ModernTemplate",
      () => {
        expect(
          templateRegistry.modern
        ).toBe(
          ModernTemplate
        );
      }
    );
  }
);

/* ========================================
   Template Categories
======================================== */

describe(
  "templateCategories",
  () => {
    it(
      "contains the six permanent template categories",
      () => {
        expect(
          templateCategories
        ).toEqual([
          "Modern",
          "Professional",
          "Minimal",
          "Classic",
          "Creative",
          "Technical",
        ]);
      }
    );

    it(
      "contains exactly six categories",
      () => {
        expect(
          templateCategories
        ).toHaveLength(6);
      }
    );

    it(
      "contains unique category names",
      () => {
        expect(
          new Set(
            templateCategories
          ).size
        ).toBe(
          templateCategories.length
        );
      }
    );

    it(
      "uses only registered categories for templates",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              templateCategories
            ).toContain(
              template.category
            );
          }
        );
      }
    );

    it(
      "contains exactly five templates in every category",
      () => {
        templateCategories.forEach(
          (category) => {
            expect(
              getTemplatesByCategory(
                category
              )
            ).toHaveLength(5);
          }
        );
      }
    );
  }
);

/* ========================================
   Template Metadata
======================================== */

describe(
  "templateOptions",
  () => {
    it(
      "contains exactly 30 template options",
      () => {
        expect(
          templateOptions
        ).toHaveLength(30);
      }
    );

    it(
      "contains all expected template ids",
      () => {
        expect(
          new Set(
            REGISTERED_TEMPLATE_IDS
          )
        ).toEqual(
          new Set(
            EXPECTED_TEMPLATE_IDS
          )
        );
      }
    );

    it(
      "contains unique template ids",
      () => {
        const ids =
          templateOptions.map(
            (template) =>
              template.id
          );

        expect(
          new Set(ids).size
        ).toBe(
          ids.length
        );
      }
    );

    it(
      "contains unique template names",
      () => {
        const names =
          templateOptions.map(
            (template) =>
              template.name
          );

        expect(
          new Set(names).size
        ).toBe(
          names.length
        );
      }
    );

    it(
      "matches the registered template ids",
      () => {
        const optionIds =
          templateOptions
            .map(
              (template) =>
                template.id
            )
            .sort();

        const registryIds =
          Object.keys(
            templateRegistry
          ).sort();

        expect(
          optionIds
        ).toEqual(
          registryIds
        );
      }
    );

    it(
      "marks every final template as available",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              template.available
            ).toBe(true);
          }
        );
      }
    );

    it(
      "provides complete metadata for every template",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              typeof template.id
            ).toBe(
              "string"
            );

            expect(
              template.id.trim()
            ).not.toBe("");

            expect(
              typeof template.name
            ).toBe(
              "string"
            );

            expect(
              template.name.trim()
            ).not.toBe("");

            expect(
              typeof template.category
            ).toBe(
              "string"
            );

            expect(
              template.category.trim()
            ).not.toBe("");

            expect(
              templateCategories
            ).toContain(
              template.category
            );

            expect(
              typeof template.description
            ).toBe(
              "string"
            );

            expect(
              template.description.trim()
            ).not.toBe("");

            expect(
              Array.isArray(
                template.tags
              )
            ).toBe(true);

            expect(
              template.tags.length
            ).toBeGreaterThan(
              0
            );

            expect(
              typeof template.featured
            ).toBe(
              "boolean"
            );

            expect(
              typeof template.available
            ).toBe(
              "boolean"
            );

            expect(
              typeof template.component
            ).toBe(
              "function"
            );
          }
        );
      }
    );

    it(
      "contains no empty template tags",
      () => {
        templateOptions.forEach(
          (template) => {
            template.tags.forEach(
              (tag) => {
                expect(
                  typeof tag
                ).toBe(
                  "string"
                );

                expect(
                  tag.trim()
                ).not.toBe("");
              }
            );
          }
        );
      }
    );

    it(
      "contains no duplicate tags within a template",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              new Set(
                template.tags
              ).size
            ).toBe(
              template.tags.length
            );
          }
        );
      }
    );

    it.each(
      Object.entries(
        EXPECTED_TEMPLATES
      )
    )(
      "%s contains the expected five templates",
      (
        category,
        expectedIds
      ) => {
        const categoryIds =
          getTemplatesByCategory(
            category
          ).map(
            (template) =>
              template.id
          );

        expect(
          categoryIds
        ).toEqual(
          expectedIds
        );
      }
    );
  }
);

/* ========================================
   Template Metadata Lookup
======================================== */

describe(
  "getTemplateOption",
  () => {
    it.each(
      EXPECTED_TEMPLATE_IDS
    )(
      "returns metadata for %s",
      (templateId) => {
        expect(
          getTemplateOption(
            templateId
          ).id
        ).toBe(
          templateId
        );
      }
    );

    it(
      "falls back to modern metadata for an invalid template",
      () => {
        expect(
          getTemplateOption(
            "invalid-template"
          ).id
        ).toBe(
          "modern"
        );
      }
    );

    it(
      "falls back to modern metadata when id is missing",
      () => {
        expect(
          getTemplateOption().id
        ).toBe(
          "modern"
        );
      }
    );

    it(
      "returns the same object stored in templateOptions",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              getTemplateOption(
                template.id
              )
            ).toBe(
              template
            );
          }
        );
      }
    );
  }
);

/* ========================================
   Template Component Lookup
======================================== */

describe(
  "getResumeTemplate",
  () => {
    it.each(
      EXPECTED_TEMPLATE_IDS
    )(
      "returns the registered component for %s",
      (templateId) => {
        expect(
          getResumeTemplate(
            templateId
          )
        ).toBe(
          templateRegistry[
            templateId
          ]
        );
      }
    );

    it(
      "returns the component stored on every template metadata object",
      () => {
        templateOptions.forEach(
          (template) => {
            expect(
              getResumeTemplate(
                template.id
              )
            ).toBe(
              template.component
            );
          }
        );
      }
    );

    it(
      "falls back to modern for an invalid template id",
      () => {
        expect(
          getResumeTemplate(
            "invalid-template"
          )
        ).toBe(
          ModernTemplate
        );
      }
    );

    it(
      "falls back to modern when template id is missing",
      () => {
        expect(
          getResumeTemplate()
        ).toBe(
          ModernTemplate
        );
      }
    );
  }
);

/* ========================================
   Templates By Category
======================================== */

describe(
  "getTemplatesByCategory",
  () => {
    it(
      "returns all templates for All",
      () => {
        expect(
          getTemplatesByCategory(
            "All"
          )
        ).toEqual(
          templateOptions
        );
      }
    );

    it(
      "returns all templates when category is omitted",
      () => {
        expect(
          getTemplatesByCategory()
        ).toEqual(
          templateOptions
        );
      }
    );

    it.each(
      Object.entries(
        EXPECTED_TEMPLATES
      )
    )(
      "returns the five %s templates",
      (
        category,
        expectedIds
      ) => {
        const templates =
          getTemplatesByCategory(
            category
          );

        expect(
          templates
        ).toHaveLength(
          5
        );

        expect(
          templates.map(
            (template) =>
              template.id
          )
        ).toEqual(
          expectedIds
        );

        templates.forEach(
          (template) => {
            expect(
              template.category
            ).toBe(
              category
            );
          }
        );
      }
    );

    it(
      "returns an empty array for an unknown category",
      () => {
        expect(
          getTemplatesByCategory(
            "Unknown"
          )
        ).toEqual([]);
      }
    );
  }
);

/* ========================================
   Available Templates
======================================== */

describe(
  "getAvailableTemplates",
  () => {
    it(
      "returns all 30 final templates",
      () => {
        expect(
          getAvailableTemplates()
        ).toHaveLength(
          30
        );
      }
    );

    it(
      "returns only templates marked as available",
      () => {
        getAvailableTemplates().forEach(
          (template) => {
            expect(
              template.available
            ).toBe(
              true
            );
          }
        );
      }
    );

    it(
      "returns the same final template ids as templateOptions",
      () => {
        expect(
          getAvailableTemplates().map(
            (template) =>
              template.id
          )
        ).toEqual(
          REGISTERED_TEMPLATE_IDS
        );
      }
    );
  }
);

/* ========================================
   Featured Templates
======================================== */

describe(
  "getFeaturedTemplates",
  () => {
    it(
      "matches the available templates marked as featured",
      () => {
        const expectedFeatured =
          templateOptions.filter(
            (template) =>
              template.featured &&
              template.available
          );

        expect(
          getFeaturedTemplates()
        ).toEqual(
          expectedFeatured
        );
      }
    );

    it(
      "returns only available featured templates",
      () => {
        getFeaturedTemplates().forEach(
          (template) => {
            expect(
              template.featured
            ).toBe(
              true
            );

            expect(
              template.available
            ).toBe(
              true
            );
          }
        );
      }
    );

    it(
      "contains no duplicate featured templates",
      () => {
        const featuredIds =
          getFeaturedTemplates().map(
            (template) =>
              template.id
          );

        expect(
          new Set(
            featuredIds
          ).size
        ).toBe(
          featuredIds.length
        );
      }
    );
  }
);

/* ========================================
   Renderer
======================================== */

describe(
  "ResumeTemplateRenderer",
  () => {
    it.each(
      EXPECTED_TEMPLATE_IDS
    )(
      "renders the %s template without crashing",
      (templateId) => {
        const resume =
          createTestResume();

        const {
          container,
          unmount,
        } = render(
          <ResumeTemplateRenderer
            templateId={
              templateId
            }
            resume={
              resume
            }
          />
        );

        expect(
          container.firstChild
        ).toBeTruthy();

        unmount();
      }
    );

    it(
      "renders every available registry template without crashing",
      () => {
        const resume =
          createTestResume();

        getAvailableTemplates().forEach(
          (template) => {
            const {
              container,
              unmount,
            } = render(
              <ResumeTemplateRenderer
                templateId={
                  template.id
                }
                resume={
                  resume
                }
              />
            );

            expect(
              container.firstChild
            ).toBeTruthy();

            unmount();
          }
        );
      }
    );

    it(
      "falls back safely when template id is invalid",
      () => {
        const resume =
          createTestResume();

        const {
          container,
        } = render(
          <ResumeTemplateRenderer
            templateId="invalid-template"
            resume={
              resume
            }
          />
        );

        expect(
          container.firstChild
        ).toBeTruthy();
      }
    );

    it(
      "uses modern when template id is omitted",
      () => {
        const resume =
          createTestResume();

        const {
          container,
        } = render(
          <ResumeTemplateRenderer
            resume={
              resume
            }
          />
        );

        expect(
          container.firstChild
        ).toBeTruthy();
      }
    );

    it.each(
      EXPECTED_TEMPLATE_IDS
    )(
      "forwards contentRef through the %s template",
      (templateId) => {
        const resume =
          createTestResume();

        const contentRef =
          createRef();

        const {
          unmount,
        } = render(
          <ResumeTemplateRenderer
            templateId={
              templateId
            }
            resume={
              resume
            }
            contentRef={
              contentRef
            }
          />
        );

        expect(
          contentRef.current
        ).not.toBeNull();

        unmount();
      }
    );
  }
);