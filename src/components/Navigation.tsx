import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import TerminalModal from "./TerminalModal";

const Navigation = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isClickMeModalOpen, setIsClickMeModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleModalOpen = (modalSetter: (value: boolean) => void) => {
    modalSetter(true);
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const aboutContent = `I’m Nada Ibrahim, a software engineer passionate about building robust, scalable systems and streamlining complex workflows. I specialize in full-stack development, cloud infrastructure, automation, and AI-driven solutions. My experience spans AWS, Snowflake, Flask, Python, and advanced data tools, creating systems that handle hundreds of jobs and hundreds of thousands of documents every week.

I’ve worked on AI projects that leverage natural language processing and machine learning to solve real-world problems, from fuzzy matching and data reconciliation to building intelligent automation pipelines. I thrive in environments where I can take ownership of both architecture and execution—optimizing Step Function workflows, integrating AI into operations, or designing systems that turn complexity into efficiency.

Driven by curiosity and problem-solving, I’m always exploring ways to combine software, data, and AI to make large-scale operations smarter and more reliable.

When I'm not coding, you'll find me building keyboards, PCs, and playing video games.`;


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Terminal Prompt */}
          <div className="text-xs sm:text-sm font-mono font-medium">
            [user@nada ~]$
          </div>
          
          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
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
              onClick={() => handleModalOpen(setIsAboutModalOpen)}
            >
              ./about
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => handleModalOpen(setIsResumeModalOpen)}
            >
              ./resume
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => handleModalOpen(setIsContactModalOpen)}
            >
              ./contact
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => handleModalOpen(setIsClickMeModalOpen)}
            >
              ./click-me
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile/Tablet Navigation */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3" ref={mobileMenuRef}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={16} className="text-foreground" />
              ) : (
                <Menu size={16} className="text-foreground" />
              )}
            </Button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 mr-3 sm:mr-6 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                  onClick={handleHomeClick}
                >
                  ./home
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                  onClick={() => handleModalOpen(setIsAboutModalOpen)}
                >
                  ./about
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                  onClick={() => handleModalOpen(setIsResumeModalOpen)}
                >
                  ./resume
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                  onClick={() => handleModalOpen(setIsContactModalOpen)}
                >
                  ./contact
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-none"
                  onClick={() => handleModalOpen(setIsClickMeModalOpen)}
                >
                  ./click-me
                </Button>
              </div>
            )}
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