import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TerminalModal from "./TerminalModal";

const Navigation = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isClickMeModalOpen, setIsClickMeModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
    // Scroll to top immediately after navigation
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const aboutContent = `I’m Nada Ibrahim, a software engineer passionate about building robust, scalable systems and streamlining complex workflows. I specialize in full-stack development, cloud infrastructure, automation, and AI-driven solutions. My experience spans AWS, Snowflake, Flask, Python, and advanced data tools, creating systems that handle hundreds of jobs and hundreds of thousands of documents every week.

I’ve worked on AI projects that leverage natural language processing and machine learning to solve real-world problems, from fuzzy matching and data reconciliation to building intelligent automation pipelines. I thrive in environments where I can take ownership of both architecture and execution—optimizing Step Function workflows, integrating AI into operations, or designing systems that turn complexity into efficiency.

Driven by curiosity and problem-solving, I’m always exploring ways to combine software, data, and AI to make large-scale operations smarter and more reliable.

When I'm not coding, you'll find me building keyboards, PCs, and playing video games.`;


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-mono font-medium">
            [user@nada ~]$
          </div>
          
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={handleHomeClick}
            >
              ./home
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setIsAboutModalOpen(true)}
            >
              ./about
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setIsResumeModalOpen(true)}
            >
              ./resume
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setIsContactModalOpen(true)}
            >
              ./contact
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setIsClickMeModalOpen(true)}
            >
              ./click-me
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <TerminalModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        title="about"
        content={aboutContent}
      />
      
      <TerminalModal
        isOpen={isClickMeModalOpen}
        onClose={() => setIsClickMeModalOpen(false)}
        title="cats"
        content=""
        isGifModal={true}
        gifSrc="/family.gif"
        fixedGifRatio={true}
      />
      
      <TerminalModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        title="resume"
        content=""
        isPdfModal={true}
        pdfSrc="/Nada_Ibrahim_Resume.pdf"
      />
      
      <TerminalModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="contact"
        content=""
        isContactModal={true}
      />
    </nav>
  );
};

export default Navigation;