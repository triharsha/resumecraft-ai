import {
  createElement,
} from "react";

import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import NovaTemplate from "./NovaTemplate";
import HorizonTemplate from "./HorizonTemplate";
import VertexTemplate from "./VertexTemplate";
import MetroTemplate from "./MetroTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import CorporateTemplate from "./CorporateTemplate";
import SterlingTemplate from "./SterlingTemplate";
import AuthorityTemplate from "./AuthorityTemplate";
import PureTemplate from "./PureTemplate";
import CleanTemplate from "./CleanTemplate";
import MonoTemplate from "./MonoTemplate";
import AirTemplate from "./AirTemplate";
import HeritageTemplate from "./HeritageTemplate";
import OxfordTemplate from "./OxfordTemplate";
import ChronicleTemplate from "./ChronicleTemplate";
import TimelessTemplate from "./TimelessTemplate";
import CanvasTemplate from "./CanvasTemplate";
import SpectrumTemplate from "./SpectrumTemplate";
import MuseTemplate from "./MuseTemplate";
import StudioTemplate from "./StudioTemplate";
import VividTemplate from "./VividTemplate";
import DeveloperTemplate from "./DeveloperTemplate";
import EngineerTemplate from "./EngineerTemplate";
import TerminalTemplate from "./TerminalTemplate";
import ArchitectTemplate from "./ArchitectTemplate";
import StackTemplate from "./StackTemplate";

/* ========================================
   Template Catalog
======================================== */

export const templateOptions = [
  {
    id: "modern",

    name: "Modern",

    category: "Modern",

    description:
      "Clean typography with subtle accents and a polished contemporary structure.",

    tags: [
      "ATS Friendly",
      "Clean",
      "One Page",
    ],

    featured: true,

    available: true,

    component: ModernTemplate,
  },

  {
  id: "nova",
  name: "Nova",
  category: "Modern",
  description:
    "Asymmetric editorial resume with a structured sidebar, timeline experience, and contemporary information hierarchy.",
  tags: [
    "Modern",
    "Two Column",
    "Editorial",
    "ATS Friendly",
  ],
  featured: true,
  available: true,
  component: NovaTemplate,
},

{
  id: "horizon",
  name: "Horizon",
  category: "Modern",
  description:
    "Wide contemporary resume with a strong horizontal hierarchy, career timeline, structured grids, and compact professional details.",
  tags: [
    "Modern",
    "Wide Layout",
    "Structured",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: HorizonTemplate,
},

{
  id: "vertex",
  name: "Vertex",
  category: "Modern",
  description:
    "Geometric modern resume with a split identity header, numbered sections, strong typography, and structured professional content.",
  tags: [
    "Modern",
    "Geometric",
    "Structured",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: VertexTemplate,
},

{
  id: "metro",
  name: "Metro",
  category: "Modern",
  description:
    "Modular modern resume with a bold identity block, professional snapshot, compact contact ribbon, and structured content grid.",
  tags: [
    "Modern",
    "Modular",
    "Grid Layout",
    "Structured",
  ],
  featured: false,
  available: true,
  component: MetroTemplate,
},


  {
    id: "classic",

    name: "Classic",

    category: "Classic",

    description:
      "Traditional resume styling with centered typography and refined editorial details.",

    tags: [
      "Traditional",
      "Elegant",
      "One Page",
    ],

    featured: false,

    available: true,

    component: ClassicTemplate,
  },

  {
  id: "heritage",
  name: "Heritage",
  category: "Classic",
  description:
    "Refined traditional resume with elegant serif typography, centered identity, ornamental dividers, and a distinguished professional presentation.",
  tags: [
    "Classic",
    "Traditional",
    "Elegant",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: HeritageTemplate,
},
{
  id: "oxford",
  name: "Oxford",
  category: "Classic",
  description:
    "Academic-inspired classic CV with scholarly typography, structured date rails, formal section hierarchy, and refined professional presentation.",
  tags: [
    "Classic",
    "Academic",
    "Scholarly",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: OxfordTemplate,
},

{
  id: "chronicle",
  name: "Chronicle",
  category: "Classic",
  description:
    "Editorial classic resume with a distinctive masthead, chronological career storytelling, bookish typography, and structured professional records.",
  tags: [
    "Classic",
    "Editorial",
    "Chronological",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: ChronicleTemplate,
},
{
  id: "timeless",
  name: "Timeless",
  category: "Classic",
  description:
    "Refined classic resume blending elegant serif typography with modern readability, balanced whitespace, and restrained professional styling.",
  tags: [
    "Classic",
    "Refined",
    "Elegant",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: TimelessTemplate,
},
{
  id: "canvas",
  name: "Canvas",
  category: "Creative",
  description:
    "Bold asymmetric creative resume with numbered sections, portfolio-style project blocks, expressive accents, and a distinctive visual hierarchy.",
  tags: [
    "Creative",
    "Portfolio",
    "Asymmetric",
    "Bold",
  ],
  featured: true,
  available: true,
  component: CanvasTemplate,
},
{
  id: "spectrum",
  name: "Spectrum",
  category: "Creative",
  description:
    "Expressive creative resume with a layered dark header, geometric accent composition, competency matrix, and showcase-focused professional layout.",
  tags: [
    "Creative",
    "Expressive",
    "Geometric",
    "Portfolio",
  ],
  featured: false,
  available: true,
  component: SpectrumTemplate,
},
{
  id: "muse",
  name: "Muse",
  category: "Creative",
  description:
    "Elegant editorial resume with expressive serif typography, graceful asymmetry, portfolio-style selected work, and refined artistic details.",
  tags: [
    "Creative",
    "Editorial",
    "Elegant",
    "Portfolio",
  ],
  featured: false,
  available: true,
  component: MuseTemplate,
},
{
  id: "studio",
  name: "Studio",
  category: "Creative",
  description:
    "Design-studio inspired resume with modular grid composition, project-first storytelling, bold typography, and structured creative details.",
  tags: [
    "Creative",
    "Studio",
    "Portfolio",
    "Modular",
  ],
  featured: false,
  available: true,
  component: StudioTemplate,
},
{
  id: "vivid",
  name: "Vivid",
  category: "Creative",
  description:
    "High-energy creative resume with bold typography, dynamic accent bands, expressive content blocks, and a contemporary portfolio-inspired layout.",
  tags: [
    "Creative",
    "Bold",
    "Contemporary",
    "Expressive",
  ],
  featured: false,
  available: true,
  component: VividTemplate,
},
{
  id: "developer",
  name: "Developer",
  category: "Technical",
  description:
    "Developer-focused resume with code-inspired metadata, repository-style projects, technical skill hierarchy, and recruiter-friendly professional structure.",
  tags: [
    "Technical",
    "Developer",
    "Software",
    "Projects",
  ],
  featured: true,
  available: true,
  component: DeveloperTemplate,
},
{
  id: "engineer",
  name: "Engineer",
  category: "Technical",
  description:
    "Engineering-focused resume with specification-style records, structured technical competencies, systems project emphasis, and precise professional hierarchy.",
  tags: [
    "Technical",
    "Engineering",
    "Systems",
    "Structured",
  ],
  featured: false,
  available: true,
  component: EngineerTemplate,
},
{
  id: "terminal",
  name: "Terminal",
  category: "Technical",
  description:
    "Command-line inspired technical resume with a dark terminal interface, prompt-driven sections, developer-focused records, and distinctive monospace presentation.",
  tags: [
    "Technical",
    "Terminal",
    "Developer",
    "CLI",
  ],
  featured: false,
  available: true,
  component: TerminalTemplate,
},
{
  id: "architect",
  name: "Architect",
  category: "Technical",
  description:
    "System architecture-inspired resume with blueprint-style hierarchy, capability mapping, structured architecture records, and systems-focused project presentation.",
  tags: [
    "Technical",
    "Architecture",
    "Systems",
    "Blueprint",
  ],
  featured: false,
  available: true,
  component: ArchitectTemplate,
},

{
  id: "stack",
  name: "Stack",
  category: "Technical",
  description:
    "Layered technology-focused resume with a prominent skills stack, professional experience layers, systems-oriented projects, and structured career foundations.",
  tags: [
    "Technical",
    "Technology",
    "Stack",
    "Layered",
  ],
  featured: false,
  available: true,
  component: StackTemplate,
},
  {
    id: "minimal",

    name: "Minimal",

    category: "Minimal",

    description:
      "Simple, spacious presentation that keeps the focus entirely on your experience and skills.",

    tags: [
      "Minimal",
      "Readable",
      "ATS Friendly",
    ],

    featured: false,

    available: true,

    component: MinimalTemplate,
  },

  {
  id: "pure",
  name: "Pure",
  category: "Minimal",
  description:
    "Typography-first minimal resume with generous whitespace, subtle accents, clean experience flow, and highly readable content.",
  tags: [
    "Minimal",
    "Clean",
    "Typography",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: PureTemplate,
},

{
  id: "clean",
  name: "Clean",
  category: "Minimal",
  description:
    "Precision-focused minimal resume with thin rules, aligned metadata rails, compact content structure, and balanced professional spacing.",
  tags: [
    "Minimal",
    "Clean",
    "Structured",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: CleanTemplate,
},

{
  id: "mono",
  name: "Mono",
  category: "Minimal",
  description:
    "Monospace-inspired minimal resume with precise alignment, technical labels, compact metadata, and disciplined information hierarchy.",
  tags: [
    "Minimal",
    "Monospace",
    "Precise",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: MonoTemplate,
},

{
  id: "air",
  name: "Air",
  category: "Minimal",
  description:
    "Ultra-light minimal resume with generous breathing room, delicate typography, subtle dividers, and an elegant professional flow.",
  tags: [
    "Minimal",
    "Spacious",
    "Elegant",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: AirTemplate,
},

  {
    id: "professional",

    name: "Professional",

    category:
      "Professional",

    description:
      "Structured two-column corporate layout with a focused information sidebar.",

    tags: [
      "Corporate",
      "Two Column",
      "Structured",
    ],

    featured: true,

    available: true,

    component:
      ProfessionalTemplate,
  },

  {
  id: "executive",
  name: "Executive",
  category: "Professional",
  description:
    "Leadership-focused professional resume with refined typography, executive profile emphasis, and a polished corporate structure.",
  tags: [
    "Professional",
    "Executive",
    "Leadership",
    "ATS Friendly",
  ],
  featured: true,
  available: true,
  component: ExecutiveTemplate,
},
{
  id: "corporate",
  name: "Corporate",
  category: "Professional",
  description:
    "Formal business resume with a structured career timeline, competency matrix, compact contact band, and polished corporate hierarchy.",
  tags: [
    "Professional",
    "Corporate",
    "Structured",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: CorporateTemplate,
},
{
  id: "sterling",
  name: "Sterling",
  category: "Professional",
  description:
    "Premium professional resume with refined typography, understated dividers, elegant career presentation, and polished executive detail.",
  tags: [
    "Professional",
    "Premium",
    "Elegant",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: SterlingTemplate,
},

{
  id: "authority",
  name: "Authority",
  category: "Professional",
  description:
    "Bold leadership resume with a commanding executive header, structured career records, capability matrix, and high-impact professional hierarchy.",
  tags: [
    "Professional",
    "Leadership",
    "Bold",
    "ATS Friendly",
  ],
  featured: false,
  available: true,
  component: AuthorityTemplate,
}
];

/* ========================================
   Template Registry
======================================== */

export const templateRegistry =
  Object.fromEntries(
    templateOptions.map(
      (template) => [
        template.id,
        template.component,
      ]
    )
  );

/* ========================================
   Template Categories
======================================== */

export const templateCategories = [
  "Modern",
  "Professional",
  "Minimal",
  "Classic",
  "Creative",
  "Technical",
];

/* ========================================
   Template Metadata Lookup
======================================== */

export const getTemplateOption = (
  templateId
) => {
  return (
    templateOptions.find(
      (template) =>
        template.id ===
        templateId
    ) ||
    templateOptions[0]
  );
};

/* ========================================
   Template Component Lookup
======================================== */

export const getResumeTemplate = (
  templateId
) => {
  return getTemplateOption(
    templateId
  ).component;
};

/* ========================================
   Templates By Category
======================================== */

export const getTemplatesByCategory = (
  category
) => {
  if (
    !category ||
    category === "All"
  ) {
    return templateOptions;
  }

  return templateOptions.filter(
    (template) =>
      template.category ===
      category
  );
};

/* ========================================
   Available Templates
======================================== */

export const getAvailableTemplates =
  () => {
    return templateOptions.filter(
      (template) =>
        template.available
    );
  };

/* ========================================
   Featured Templates
======================================== */

export const getFeaturedTemplates =
  () => {
    return templateOptions.filter(
      (template) =>
        template.featured &&
        template.available
    );
  };

/* ========================================
   Stable Template Renderer
======================================== */

export const ResumeTemplateRenderer = ({
  templateId = "modern",
  resume,
  contentRef,
}) => {
  const TemplateComponent =
    getResumeTemplate(templateId);

  return createElement(
    TemplateComponent,
    {
      resume,
      contentRef,
    }
  );
};