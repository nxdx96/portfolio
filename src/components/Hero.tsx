import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { useState } from "react";
import InteractiveTerminal from "./InteractiveTerminal";

const ASCIICat = () => {
  const [cats, setCats] = useState<{id: number, x: number, y: number, catIndex: number}[]>([]);
  const [nextId, setNextId] = useState(0);
  
  const catVariations = [
    {
      ascii: `     /\\_/\\
    ( -.- )
     )   (
    (  ω  )
   ^^^   ^^^`,
      name: "Sleepy Cat",
      status: "💤 Taking a nap..."
    },
    {
      ascii: `     /\\_/\\
    ( ^.^ )
     )   (
    (  v  )
   ^^^   ^^^`,
      name: "Happy Cat",
      status: "😸 Feeling great!"
    },
    {
      ascii: `     /\\_/\\
    ( o.o )
     )   (
    (  ∩  )
   ^^^   ^^^`,
      name: "Curious Cat",
      status: "🤔 Wondering about code..."
    },
    {
      ascii: `     /\\_/\\
    ( ≧∇≦)
     )   (
    (  ω  )
   ^^^   ^^^`,
      name: "Excited Cat",
      status: "🎉 Just deployed!"
    },
    {
      ascii: `     /\\_/\\
    ( =.= )
     )   (
    (  ︶  )
   ^^^   ^^^`,
      name: "Content Cat",
      status: "😌 All tests passing..."
    },
    {
      ascii: `     /\\_/\\
    ( ◕ ◕ )
     )   (
    (  ○  )
   ^^^   ^^^`,
      name: "Alert Cat",
      status: "👀 Watching for bugs!"
    },
    {
      ascii: `     /\\_/\\
    ( ◔̯◔ )
     )   (
    (  ~  )
   ^^^   ^^^`,
      name: "Skeptical Cat",
      status: "🤨 Code looks sus..."
    },
    {
      ascii: `     /\\_/\\
    ( -.-)
     )   (
    (  ᵕ  )
   ^^^   ^^^`,
      name: "Zen Cat",
      status: "🧘 Meditating..."
    }
  ];

  const handleAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const randomCatIndex = Math.floor(Math.random() * catVariations.length);
    
    const newCat = {
      id: nextId,
      x: Math.max(5, Math.min(95, x)), // Use actual click position, keep within bounds
      y: Math.max(5, Math.min(95, y)),
      catIndex: randomCatIndex
    };
    
    setCats(prev => [...prev, newCat]);
    setNextId(prev => prev + 1);
  };

  const clearCats = () => {
    setCats([]);
  };

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Clickable area - expanded */}
      <div 
        onClick={handleAreaClick}
        className="absolute inset-0 cursor-crosshair bg-transparent z-0"
        title="Click anywhere to add cats!"
      />
      
      {/* Instructions */}
      <div className="absolute top-0 left-4 right-4 text-center z-10 pointer-events-none">
        <div className="inline-block bg-transparent rounded-lg p-3 pointer-events-auto">
          <div className="text-primary pixelated-text">
            cat playground
          </div>
          <div className="text-xs text-muted-foreground/80 mt-1">
            Click anywhere to spawn cats! ({cats.length} cats)
          </div>
        </div>
      </div>

      {/* Clear button - positioned separately */}
      {cats.length > 0 && (
        <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              clearCats();
            }}
            className="text-xs text-red-500 hover:text-red-400 underline pointer-events-auto bg-transparent px-2 py-1"
          >
            Clear all cats
          </button>
        </div>
      )}

      {/* Render cats */}
      {cats.map(cat => (
        <div
          key={cat.id}
          className="absolute z-20 animate-bounce"
          style={{
            left: `${cat.x}%`,
            top: `${cat.y}%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        >
          <pre 
            className="text-primary font-mono text-xs leading-tight bg-transparent border-none select-none hover:scale-110 transition-transform cursor-pointer"
            title={catVariations[cat.catIndex].name}
          >
            {catVariations[cat.catIndex].ascii}
          </pre>
        </div>
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="pt-24 pb-8 px-4 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Desktop: Two column layout, Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center min-h-[600px]">
          {/* ASCII Cat Playground - Left on desktop, top on mobile */}
          <div className="order-1 lg:order-1 lg:col-span-2 flex items-center justify-center">
            <ASCIICat />
          </div>
          
          {/* Terminal - Right on desktop, bottom on mobile */}
          <div className="order-2 lg:order-2 lg:col-span-3 flex flex-col">
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