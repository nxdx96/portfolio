import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import InteractiveTerminal from "./InteractiveTerminal";

const Hero = () => {
  return (
    <section className="pt-24 pb-8 px-6 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Interactive Terminal */}
        <InteractiveTerminal />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <Button 
            size="lg" 
            className="group" 
            onClick={() => {
              const projectsSection = document.querySelector('[data-section="projects"]');
              if (!projectsSection) return;
              
              const targetPosition = projectsSection.offsetTop - 80;
              const startPosition = window.pageYOffset;
              const distance = targetPosition - startPosition;
              const duration = 800;
              const startTime = performance.now();

              function animation(currentTime: number) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Smooth cubic ease-out - very natural feeling
                const ease = 1 - Math.pow(1 - progress, 3);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                  requestAnimationFrame(animation);
                }
              }
              
              requestAnimationFrame(animation);
            }}
          >
            <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            View Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;