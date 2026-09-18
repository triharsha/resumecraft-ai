import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  GraduationCap,
  Languages,
  Target,
  User,
  Wrench,
} from "lucide-react";

const BuilderSidebar = ({
  activeSection,
  onSectionChange,
}) => {
  const sections = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
    },
    {
      id: "summary",
      label: "Summary",
      icon: FileText,
    },
    {
      id: "experience",
      label: "Experience",
      icon: BriefcaseBusiness,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
    },
    {
      id: "skills",
      label: "Skills",
      icon: Wrench,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
    },
    {
      id: "languages",
      label: "Languages",
      icon: Languages,
    },
    {
      id: "job-target",
      label: "Job Target",
      icon: Target,
    },
    {
      id: "analysis",
      label: "Analysis",
      icon: BarChart3,
    },
  ];

  return (
    <aside
      aria-label="Resume builder sections"
      className="
        min-w-0
        max-w-full

        border-b
        border-stone-200
        dark:border-zinc-800

        bg-[#f8f7f4]
        dark:bg-[#111113]

        lg:border-b-0
        lg:border-r
      "
    >
      {/* Mobile / Tablet Horizontal Navigation */}

      <nav
        aria-label="Resume builder sections"
        className="
          builder-section-scroll

          flex
          w-full
          max-w-full
          min-w-0
          gap-2

          overflow-x-auto
          overflow-y-hidden

          px-4
          py-3

          overscroll-x-contain

          lg:hidden
        "
      >
        {sections.map(
          ({
            id,
            label,
            icon: Icon,
          }) => {
            const active =
              activeSection === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  onSectionChange(id)
                }
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-2

                  rounded-xl

                  px-3
                  py-2.5

                  text-sm
                  font-bold

                  transition-colors

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-violet-500
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#f8f7f4]

                  dark:focus-visible:ring-violet-400
                  dark:focus-visible:ring-offset-[#111113]

                  ${
                    active
                      ? `
                          bg-violet-600
                          text-white
                        `
                      : `
                          border
                          border-stone-200
                          dark:border-zinc-800

                          bg-white
                          dark:bg-zinc-900

                          text-zinc-600
                          dark:text-zinc-300
                        `
                  }
                `}
              >
                <Icon
                  size={16}
                  aria-hidden="true"
                  className="shrink-0"
                />

                <span className="whitespace-nowrap">
                  {label}
                </span>
              </button>
            );
          }
        )}
      </nav>

      {/* Desktop Vertical Navigation */}

      <nav
        aria-label="Resume builder sections"
        className="
          hidden

          lg:flex
          lg:flex-col
          lg:gap-2
          lg:px-4
          lg:py-5
        "
      >
        {sections.map(
          ({
            id,
            label,
            icon: Icon,
          }) => {
            const active =
              activeSection === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  onSectionChange(id)
                }
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3

                  rounded-xl

                  px-3
                  py-2.5

                  text-left
                  text-sm
                  font-bold

                  transition-colors

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-violet-500
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#f8f7f4]

                  dark:focus-visible:ring-violet-400
                  dark:focus-visible:ring-offset-[#111113]

                  ${
                    active
                      ? `
                          bg-violet-600
                          text-white
                        `
                      : `
                          text-zinc-600
                          dark:text-zinc-300

                          hover:bg-white
                          dark:hover:bg-zinc-900
                        `
                  }
                `}
              >
                <Icon
                  size={16}
                  aria-hidden="true"
                  className="shrink-0"
                />

                <span>
                  {label}
                </span>
              </button>
            );
          }
        )}
      </nav>
    </aside>
  );
};

export default BuilderSidebar;
