import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-semibold tracking-tight mb-6 leading-tight">
            Software Engineer
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
            I'm a software engineer with 5+ years of experience designing and scaling 
            high-performance data infrastructure and distributed systems, with a proven 
            ability to architect enterprise-grade platforms that are both reliable and scalable.
          </p>
          
          <div className="flex items-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Github className="w-4 h-4 mr-2" />
              View GitHub
            </Button>
            <Button variant="outline" className="border-border hover:bg-accent">
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;