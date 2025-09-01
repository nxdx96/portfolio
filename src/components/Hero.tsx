import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-6 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-card border border-border rounded-lg p-8 font-mono">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-dracula-red"></div>
            <div className="w-3 h-3 rounded-full bg-dracula-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-dracula-green"></div>
            <div className="ml-4 text-sm text-muted-foreground">
              user@arch: ~
            </div>
          </div>

          {/* Terminal Content */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-primary mr-2">[user@arch ~]$</span>
              <span className="text-foreground">whoami</span>
            </div>
            
            <div className="ml-6 text-foreground">
              Software Engineer
            </div>

            <div className="flex items-center mt-6">
              <span className="text-primary mr-2">[user@arch ~]$</span>
              <span className="text-foreground">cat about.txt</span>
            </div>
            
            <div className="ml-6 text-foreground leading-relaxed max-w-4xl">
              I'm a software engineer with 5+ years of experience designing and scaling<br />
              high-performance data infrastructure and distributed systems, with a proven<br />
              ability to architect enterprise-grade platforms that are both reliable and scalable.
            </div>

            <div className="flex items-center mt-6">
              <span className="text-primary mr-2">[user@arch ~]$</span>
              <span className="text-foreground">ls -la projects/</span>
            </div>

            <div className="ml-6 space-y-1 text-muted-foreground">
              <div>drwxr-xr-x distributed-cache-system/</div>
              <div>drwxr-xr-x microservices-orchestrator/</div>
              <div>drwxr-xr-x real-time-analytics-engine/</div>
              <div>drwxr-xr-x infrastructure-as-code/</div>
            </div>

            <div className="flex items-center mt-6">
              <span className="text-primary mr-2">[user@arch ~]$</span>
              <span className="text-foreground animate-typing overflow-hidden whitespace-nowrap border-r-2 border-primary animate-blink">
                ./connect_with_me.sh
              </span>
            </div>
            
            <div className="ml-6 flex items-center gap-4 mt-4">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono">
                <Github className="w-4 h-4 mr-2" />
                github
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:bg-muted font-mono">
                <ExternalLink className="w-4 h-4 mr-2" />
                resume.pdf
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;