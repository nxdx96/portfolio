import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-40 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9] max-w-5xl">
            Welcome to my
            <br />
            Portfolio
          </h1>
          
          <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-4xl font-normal">
            I'm a software engineer with 5+ years of experience designing and scaling 
            high-performance data infrastructure and distributed systems, with a proven 
            ability to architect enterprise-grade platforms that are both reliable and scalable.
          </p>
          
          <div className="flex items-center gap-6">
            <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background text-lg px-8 py-4 h-auto">
              <Github className="w-5 h-5 mr-3" />
              View GitHub
            </Button>
            <Button variant="outline" size="lg" className="border-border hover:bg-muted text-lg px-8 py-4 h-auto">
              <ExternalLink className="w-5 h-5 mr-3" />
              Get Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;