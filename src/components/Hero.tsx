import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import InteractiveTerminal from "./InteractiveTerminal";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-6 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Interactive Terminal */}
        <InteractiveTerminal />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <Button size="lg" className="group">
            <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            View GitHub
          </Button>
          <Button variant="outline" size="lg" className="group">
            <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Live Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;