import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAvailableTemplates,
  ResumeTemplateRenderer,
  templateCategories,
} from "../components/builder/templates/templateRegistry";

import ResumeCustomizationWrapper from "../components/builder/templates/ResumeCustomizationWrapper";

import useResumeStore from "../stores/resumeStore";

import templatePreviewResume from "../data/templatePreviewResume";

/* ========================================
   Categories
======================================== */

const categories = [
  "All",
  ...templateCategories,
];

/* ========================================
   Templates Page
======================================== */

const Templates = () => {
  const navigate =
    useNavigate();

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    creatingTemplateId,
    setCreatingTemplateId,
  ] = useState(null);

  const addResume =
    useResumeStore(
      (state) =>
        state.addResume
    );

  /* ========================================
     Filter Templates
  ======================================== */

  const filteredTemplates =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return getAvailableTemplates().filter(
        (template) => {
          const categoryMatches =
            activeCategory ===
              "All" ||
            template.category ===
              activeCategory;

          const searchText = [
            template.name,
            template.description,
            template.category,
            ...(template.tags || []),
          ]
            .join(" ")
            .toLowerCase();

          const searchMatches =
            !query ||
            searchText.includes(
              query
            );

          return (
            template.available &&
            categoryMatches &&
            searchMatches
          );
        }
      );
    }, [
      searchQuery,
      activeCategory,
    ]);

  /* ========================================
     Use Template
  ======================================== */

  const handleUseTemplate = (
    template
  ) => {
    if (
      creatingTemplateId
    ) {
      return;
    }

    setCreatingTemplateId(
      template.id
    );

    const resume =
      addResume({
        templateId:
          template.id,

        title: `${template.name} Resume`,
      });

    navigate(
      `/builder/${resume.id}`
    );
  };

  return (
    <div
      className="
        min-h-screen

        bg-[#f8f7f4]

        text-zinc-950

        dark:bg-[#111113]
        dark:text-zinc-100
      "
    >
      {/* Hero */}

      <section
        className="
          border-b
          border-stone-200

          dark:border-zinc-800
        "
      >
        <div
          className="
            container-shell

            py-12

            sm:py-16

            lg:py-20
          "
        >
          <div
            className="
              mx-auto
              max-w-3xl

              text-center
            "
          >
            <div
              className="
                mx-auto

                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-violet-200

                bg-violet-50

                px-3
                py-1.5

                text-xs
                font-black
                uppercase
                tracking-[0.12em]

                text-violet-700

                dark:border-violet-900
                dark:bg-violet-950/30
                dark:text-violet-300
              "
            >
              <Sparkles
                size={13}
                aria-hidden="true"
              />

              Resume Templates
            </div>

            <h1
              className="
                mt-6

                text-4xl
                font-black
                tracking-[-0.055em]

                text-zinc-950

                dark:text-white

                sm:text-5xl

                lg:text-6xl
              "
            >
              Find a template that
              fits your story.
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl

                text-sm
                leading-7

                text-zinc-500

                dark:text-zinc-400

                sm:text-base
              "
            >
              Start with a professionally
              designed one-page resume
              and customize the content,
              typography and appearance
              inside ResumeCraft.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}

      <section
        className="
          container-shell

          py-10

          sm:py-12
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.13em]

                text-violet-600

                dark:text-violet-400
              "
            >
              Template Library
            </p>

            <h2
              className="
                mt-2

                text-2xl
                font-black
                tracking-[-0.035em]

                sm:text-3xl
              "
            >
              Choose your starting
              point
            </h2>

            <p
              className="
                mt-2

                text-sm

                text-zinc-500

                dark:text-zinc-400
              "
            >
              {
                getAvailableTemplates().length
              }{" "}
              templates available
            </p>
          </div>

          <div
            className="
              relative

              w-full

              lg:max-w-sm
            "
          >
            <Search
              size={17}
              aria-hidden="true"
              className="
                absolute
                left-4
                top-1/2

                -translate-y-1/2

                text-zinc-400
              "
            />

            <input
              type="search"
              value={
                searchQuery
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search templates..."
              className="
                w-full

                rounded-2xl

                border
                border-stone-200

                bg-white

                py-3
                pl-11
                pr-4

                text-sm
                font-semibold

                text-zinc-900

                outline-none

                transition

                placeholder:text-zinc-400

                focus:border-violet-400
                focus:ring-4
                focus:ring-violet-100

                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-white
                dark:focus:border-violet-600
                dark:focus:ring-violet-950/40
              "
            />
          </div>
        </div>

        {/* Categories */}

        <div
          className="
            mt-7

            flex
            gap-2

            overflow-x-auto

            pb-2

            [scrollbar-width:none]

            [&::-webkit-scrollbar]:hidden
          "
        >
          {categories.map(
            (category) => {
              const active =
                activeCategory ===
                category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`
                    shrink-0

                    rounded-full

                    border

                    px-4
                    py-2

                    text-sm
                    font-black

                    transition

                    ${
                      active
                        ? `
                          border-zinc-950
                          bg-zinc-950
                          text-white

                          dark:border-white
                          dark:bg-white
                          dark:text-zinc-950
                        `
                        : `
                          border-stone-200
                          bg-white
                          text-zinc-600

                          hover:border-zinc-300
                          hover:text-zinc-950

                          dark:border-zinc-800
                          dark:bg-zinc-900
                          dark:text-zinc-400
                          dark:hover:border-zinc-700
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  {category}
                </button>
              );
            }
          )}
        </div>

        {/* Grid */}

        {filteredTemplates.length >
        0 ? (
          <div
            className="
              mt-8

              grid
              gap-6

              md:grid-cols-2

              xl:grid-cols-3
            "
          >
            {filteredTemplates.map(
              (template) => (
                <TemplateCard
                  key={
                    template.id
                  }
                  template={
                    template
                  }
                  creating={
                    creatingTemplateId ===
                    template.id
                  }
                  onUseTemplate={
                    handleUseTemplate
                  }
                />
              )
            )}
          </div>
        ) : (
          <div
            className="
              mt-8

              rounded-3xl

              border
              border-dashed
              border-stone-300

              bg-white

              px-6
              py-16

              text-center

              dark:border-zinc-800
              dark:bg-zinc-900
            "
          >
            <div
              className="
                mx-auto

                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-2xl

                bg-stone-100

                text-zinc-500

                dark:bg-zinc-800
                dark:text-zinc-400
              "
            >
              <Search
                size={20}
                aria-hidden="true"
              />
            </div>

            <h3
              className="
                mt-4

                text-lg
                font-black
              "
            >
              No templates found
            </h3>

            <p
              className="
                mt-2

                text-sm

                text-zinc-500

                dark:text-zinc-400
              "
            >
              Try another search or
              template category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

/* ========================================
   Template Card
======================================== */

const TemplateCard = ({
  template,
  creating,
  onUseTemplate,
}) => {
  const previewResume = {
    ...templatePreviewResume,

    templateId:
      template.id,
  };

  return (
    <article
      className="
        group

        flex
        h-full
        flex-col

        overflow-hidden

        rounded-3xl

        border
        border-stone-200

        bg-white

        shadow-sm

        transition-[transform,border-color,box-shadow]
        duration-300
        ease-in-out

        hover:-translate-y-0.5
        hover:border-violet-300
        hover:shadow-lg

        focus-within:ring-2
        focus-within:ring-violet-500/30

        dark:border-zinc-800
        dark:bg-zinc-900
        dark:hover:border-violet-800
      "
    >
      {/* Preview */}

      <div
        className="
          relative

          overflow-hidden

          border-b
          border-stone-200

          bg-[#ebe8e1]

          px-6
          pt-7

          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >
        {template.featured && (
          <div
            className="
              absolute
              left-4
              top-4
              z-10

              inline-flex
              items-center
              gap-1.5

              rounded-full

              bg-zinc-950

              px-2.5
              py-1.5

              text-[9px]
              font-black
              uppercase
              tracking-[0.08em]

              text-white

              shadow-sm

              dark:bg-white
              dark:text-zinc-950
            "
          >
            <Sparkles
              size={10}
              aria-hidden="true"
            />

            Featured
          </div>
        )}

        <div
          className="
            mx-auto

            aspect-[1/1.414]
            w-full
            max-w-[300px]

            origin-top

            overflow-hidden

            rounded-t-md

            bg-white

            shadow-xl
          "
        >
          <ResumeCustomizationWrapper
            resume={
              previewResume
            }
          >
            <ResumeTemplateRenderer
              templateId={
                template.id
              }
              resume={
                previewResume
              }
            />
          </ResumeCustomizationWrapper>
        </div>
      </div>

      {/* Details */}

      <div
        className="
          flex
          flex-1
          flex-col

          p-5
          sm:p-6
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.1em]

                text-violet-600

                dark:text-violet-400
              "
            >
              {
                template.category
              }
            </p>

            <h3
              className="
                mt-2

                text-xl
                font-black
                tracking-[-0.03em]

                text-zinc-950

                dark:text-white
              "
            >
              {template.name}
            </h3>
          </div>

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-xl

              bg-stone-100

              text-zinc-500

              dark:bg-zinc-800
              dark:text-zinc-400
            "
          >
            <FileText
              size={16}
              aria-hidden="true"
            />
          </div>
        </div>

        <p
          className="
            mt-3

            min-h-[48px]

            text-sm
            leading-6

            text-zinc-500

            dark:text-zinc-400
          "
        >
          {template.description}
        </p>

        {/* Tags */}

        <div
          className="
            mt-4

            flex
            flex-wrap
            gap-2
          "
        >
          {template.tags.map(
            (tag) => (
              <span
                key={tag}
                className="
                  inline-flex
                  items-center
                  gap-1

                  rounded-full

                  bg-stone-100

                  px-2.5
                  py-1

                  text-[10px]
                  font-bold

                  text-zinc-600

                  dark:bg-zinc-800
                  dark:text-zinc-300
                "
              >
                <Check
                  size={10}
                  aria-hidden="true"
                />

                {tag}
              </span>
            )
          )}
        </div>

        {/* Action */}

        <div className="mt-auto pt-6">
          <button
            type="button"
            disabled={creating}
            onClick={() =>
              onUseTemplate(
                template
              )
            }
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-zinc-950

              px-4
              py-3

              text-sm
              font-black

              text-white

              transition-colors
              duration-200

              hover:bg-violet-600

              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:bg-white
              dark:text-zinc-950
              dark:hover:bg-violet-400
            "
          >
            {creating
              ? "Creating..."
              : "Use Template"}

            {!creating && (
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
              />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default Templates;