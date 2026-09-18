import {
  Outlet,
} from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div
      className="
        relative

        flex
        min-h-screen
        w-full
        max-w-full
        flex-col

        overflow-x-clip

        bg-[#f8f7f4]
        dark:bg-[#111113]

        text-zinc-950
        dark:text-zinc-100
      "
    >
      {/* =====================================
          Decorative Background
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          fixed
          inset-0
          -z-10

          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32
            -top-32

            h-80
            w-80

            rounded-full

            bg-violet-200/30
            dark:bg-violet-900/10

            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-[-120px]
            top-[32%]

            h-80
            w-80

            rounded-full

            bg-stone-200/35
            dark:bg-zinc-900/10

            blur-3xl
          "
        />
      </div>

      <Navbar />

      <main
        className="
          min-w-0
          max-w-full
          flex-1
        "
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;