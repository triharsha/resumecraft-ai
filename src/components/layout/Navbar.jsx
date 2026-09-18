import {
  FileText,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

const Navbar = () => {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const menuButtonRef =
    useRef(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /* ========================================
     Escape Key Handling
  ======================================== */

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key !== "Escape"
      ) {
        return;
      }

      setIsMenuOpen(false);

      menuButtonRef.current?.focus();
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isMenuOpen]);

  /* ========================================
     Desktop Navigation Style
  ======================================== */

  const linkClass = ({
    isActive,
  }) => `
    relative

    rounded-xl

    px-3.5
    py-2

    text-sm
    font-semibold

    transition-all
    duration-200

    ${
      isActive
        ? `
            bg-violet-100
            text-violet-800

            shadow-sm
            shadow-violet-500/10

            dark:bg-violet-900/30
            dark:text-violet-200

            after:absolute
            after:-bottom-1
            after:left-1/2

            after:h-0.5
            after:w-5

            after:-translate-x-1/2

            after:rounded-full

            after:bg-violet-600
            dark:after:bg-violet-400
          `
        : `
            text-zinc-600
            dark:text-zinc-300

            hover:bg-white
            hover:text-zinc-950

            dark:hover:bg-zinc-900
            dark:hover:text-white
          `
    }
  `;

  return (
    <header
      className="
        sticky
        top-0
        z-50

        w-full
        max-w-full

        border-b
        border-stone-200
        dark:border-zinc-800

        bg-[#f8f7f4]/95
        dark:bg-[#111113]/95

        backdrop-blur-xl
      "
    >
      <div
        className="
          container-shell

          flex
          h-16
          min-w-0
          items-center
          justify-between
          gap-3
        "
      >
        {/* =====================================
            Brand
        ===================================== */}

        <NavLink
          to="/"
          onClick={
            closeMenu
          }
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-2.5

            rounded-xl

            transition-opacity
            duration-200

            hover:opacity-75

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-violet-500
            focus-visible:ring-offset-2

            sm:gap-3

            lg:flex-none
          "
        >
          <div
            className="
              relative

              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-xl

              bg-violet-600

              text-white

              shadow-sm
              shadow-violet-500/20

              sm:h-10
              sm:w-10
              sm:rounded-2xl
            "
          >
            <FileText
              size={17}
              aria-hidden="true"
            />

            <span
              className="
                absolute
                -right-1
                -top-1

                flex
                h-4
                w-4
                items-center
                justify-center

                rounded-full

                border-2
                border-[#f8f7f4]
                dark:border-[#111113]

                bg-white
                dark:bg-zinc-900

                text-violet-600
                dark:text-violet-300
              "
            >
              <Sparkles
                size={9}
                aria-hidden="true"
              />
            </span>
          </div>

          <div
            className="
              min-w-0
            "
          >
            <p
              className="
                truncate

                text-sm
                font-black
                tracking-[-0.03em]

                text-zinc-950
                dark:text-white

                sm:text-[17px]
              "
            >
              ResumeCraft AI
            </p>

            <p
              className="
                hidden

                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]

                text-zinc-400
                dark:text-zinc-500

                sm:block
              "
            >
              Build • Analyze • Tailor
            </p>
          </div>
        </NavLink>

        {/* =====================================
            Desktop Navigation
        ===================================== */}

        <nav
          aria-label="Primary navigation"
          className="
            hidden
            items-center
            gap-2

            lg:flex
          "
        >
          <NavLink
            to="/"
            end
            className={
              linkClass
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/resumes"
            className={
              linkClass
            }
          >
            My Resumes
          </NavLink>

          <NavLink
            to="/templates"
            className={
              linkClass
            }
          >
            Templates
          </NavLink>

          <NavLink
            to="/settings"
            className={
              linkClass
            }
          >
            Settings
          </NavLink>
        </nav>

        {/* =====================================
            Desktop CTA
        ===================================== */}

        <NavLink
          to="/builder/new"
          className="
            hidden
            shrink-0
            items-center
            gap-2

            rounded-xl

            bg-zinc-950
            dark:bg-white

            px-4
            py-2.5

            text-sm
            font-bold

            shadow-sm

            transition-all

            hover:-translate-y-0.5
            hover:bg-zinc-800
            hover:shadow-md

            dark:hover:bg-zinc-100

            lg:inline-flex
          "
        >
          <Sparkles
            size={15}
            aria-hidden="true"
            className="
              text-violet-300
              dark:text-violet-600
            "
          />

          <span
            className="
              text-white
              dark:text-zinc-950
            "
          >
            Create Resume
          </span>
        </NavLink>

        {/* =====================================
            Mobile / Tablet Menu Button
        ===================================== */}

        <button
          ref={
            menuButtonRef
          }
          type="button"
          onClick={() =>
            setIsMenuOpen(
              (current) =>
                !current
            )
          }
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            isMenuOpen
          }
          aria-controls="primary-navigation-menu"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center

            rounded-xl

            border
            border-stone-200
            dark:border-zinc-800

            bg-white
            dark:bg-zinc-900

            text-zinc-700
            dark:text-zinc-200

            transition-colors

            hover:bg-stone-100
            dark:hover:bg-zinc-800

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-violet-500
            focus-visible:ring-offset-2

            lg:hidden
          "
        >
          {isMenuOpen ? (
            <X
              size={18}
              aria-hidden="true"
            />
          ) : (
            <Menu
              size={18}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* =====================================
          Mobile / Tablet Navigation
      ===================================== */}

      {isMenuOpen && (
        <div
          id="primary-navigation-menu"
          className="
            w-full
            max-w-full

            border-t
            border-stone-200
            dark:border-zinc-800

            bg-[#f8f7f4]
            dark:bg-[#111113]

            lg:hidden
          "
        >
          <nav
            aria-label="Mobile navigation"
            className="
              container-shell

              flex
              min-w-0
              flex-col
              gap-1

              py-4
            "
          >
            {[
              {
                to: "/",
                label:
                  "Home",
                end: true,
              },
              {
                to: "/resumes",
                label:
                  "My Resumes",
              },
              {
                to: "/templates",
                label:
                  "Templates",
              },
              {
                to: "/settings",
                label:
                  "Settings",
              },
            ].map(
              ({
                to,
                label,
                end,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={
                    closeMenu
                  }
                  className={({
                    isActive,
                  }) => `
                    block
                    w-full
                    min-w-0

                    rounded-xl

                    px-4
                    py-3

                    text-sm
                    font-semibold

                    transition-colors

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-violet-500
                    focus-visible:ring-offset-2

                    ${
                      isActive
                        ? `
                            bg-violet-50
                            text-violet-700

                            dark:bg-violet-950/30
                            dark:text-violet-300
                          `
                        : `
                            text-zinc-700
                            dark:text-zinc-200

                            hover:bg-white
                            dark:hover:bg-zinc-900
                          `
                    }
                  `}
                >
                  {label}
                </NavLink>
              )
            )}

            {/* =================================
                Mobile / Tablet Create Resume
            ================================= */}

            <NavLink
              to="/builder/new"
              onClick={
                closeMenu
              }
              className="
                mt-3

                inline-flex
                w-full
                min-w-0
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-zinc-950
                dark:bg-white

                px-4
                py-3

                text-sm
                font-bold

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-violet-500
                focus-visible:ring-offset-2
              "
            >
              <Sparkles
                size={15}
                aria-hidden="true"
                className="
                  shrink-0

                  text-violet-300
                  dark:text-violet-600
                "
              />

              <span
                className="
                  truncate

                  text-white
                  dark:text-zinc-950
                "
              >
                Create Resume
              </span>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;