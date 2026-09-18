import AIWorkspace from "../components/home/AIWorkspace";
import HeroSection from "../components/home/HeroSection";
import QuickStart from "../components/home/QuickStart";
import RecentResumes from "../components/home/RecentResumes";
import WorkspaceOverview from "../components/home/WorkspaceOverview";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <WorkspaceOverview />
      <RecentResumes />
      <AIWorkspace />
      <QuickStart />
    </div>
  );
};

export default Home;