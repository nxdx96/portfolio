import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { useState } from "react";
import InteractiveTerminal from "./InteractiveTerminal";

const ASCIICat = () => {
  const [currentCat, setCurrentCat] = useState(0);
  
  const catVariations = [
    {
      ascii: `                       /\\_/\\
                      ( -.- )
                       )   (
                      (  ω  )
                     ^^^   ^^^`,
      name: "Sleepy Cat",
      status: "💤 Taking a nap..."
    },
    {
      ascii: `                       /\\_/\\
                      ( ^.^ )
                       )   (
                      (  v  )
                     ^^^   ^^^`,
      name: "Happy Cat",
      status: "😸 Feeling great!"
    },
    {
      ascii: `                       /\\_/\\
                      ( o.o )
                       )   (
                      (  ∩  )
                     ^^^   ^^^`,
      name: "Curious Cat",
      status: "🤔 Wondering about code..."
    },
    {
      ascii: `                       /\\_/\\
                      ( ≧∇≦)
                       )   (
                      (  ω  )
                     ^^^   ^^^`,
      name: "Excited Cat",
      status: "🎉 Just deployed to prod!"
    },
    {
      ascii: `                       /\\_/\\
                      ( =.= )
                       )   (
                      (  ︶  )
                     ^^^   ^^^`,
      name: "Content Cat",
      status: "😌 All tests passing..."
    },
    {
      ascii: `                       /\\_/\\
                      ( ◕ ◕ )
                       )   (
                      (  ○  )
                     ^^^   ^^^`,
      name: "Alert Cat",
      status: "👀 Watching for bugs!"
    },
    {
      ascii: `                       /\\_/\\
                      ( ◔̯◔ )
                       )   (
                      (  ~  )
                     ^^^   ^^^`,
      name: "Skeptical Cat",
      status: "🤨 This code looks sus..."
    },
    {
      ascii: `                       /\\_/\\
                      ( -.-)
                       )   (
                      (  ᵕ  )
                     ^^^   ^^^`,
      name: "Zen Cat",
      status: "🧘 Meditating on algorithms..."
    }
  ];

  const handleCatClick = () => {
    setCurrentCat((prev) => (prev + 1) % catVariations.length);
  };

  const currentVariation = catVariations[currentCat];

  return (
    <div className="flex items-center justify-center h-full">
      <div 
        onClick={handleCatClick}
        className="cursor-pointer hover:scale-105 transition-transform duration-300 select-none"
        title="Click me for different cats!"
      >
        <pre className="text-primary font-mono text-sm leading-tight bg-transparent border-none">
{currentVariation.ascii}
        </pre>
        
        <div className="mt-4 text-center">
          <div className="inline-block border rounded-lg p-3 bg-card/50 backdrop-blur-sm">
            <div className="text-sm font-semibold text-foreground">{currentVariation.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{currentVariation.status}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Click me! ({currentCat + 1}/{catVariations.length})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="pt-24 pb-8 px-6 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Desktop: Two column layout, Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          {/* ASCII Cat - Left on desktop, top on mobile */}
          <div className="order-1 lg:order-1 flex items-center justify-center">
            <ASCIICat />
          </div>
          
          {/* Terminal - Right on desktop, bottom on mobile */}
          <div className="order-2 lg:order-2 flex flex-col">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;