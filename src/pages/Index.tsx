import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WorkSection from "@/components/WorkSection";

const Index = () => {
  useEffect(() => {
    // Always scroll to top when component mounts (page load/refresh/navigation)
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <WorkSection />
      </main>
    </div>
  );
};

export default Index;
