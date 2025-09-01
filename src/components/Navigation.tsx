import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-mono font-medium">
            [user@nada ~]$
          </div>
          
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="text-sm font-mono text-muted-foreground hover:text-primary">
              ./home
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-mono text-muted-foreground hover:text-primary">
              ./about
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-mono text-muted-foreground hover:text-primary">
              ./work
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-mono text-muted-foreground hover:text-primary">
              ./resume
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;