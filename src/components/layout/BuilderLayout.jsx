import {
  Outlet,
} from "react-router-dom";

const BuilderLayout = () => {
  return (
    <div
      className="
        min-h-screen
        w-full
        max-w-full

        overflow-x-clip

        bg-[#f8f7f4]
        dark:bg-[#111113]

        text-zinc-950
        dark:text-zinc-100
      "
    >
      <Outlet />
    </div>
  );
};

export default BuilderLayout;