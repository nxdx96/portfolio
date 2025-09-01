import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium tracking-wider uppercase">
            [S] Portfolio
          </div>
          
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground tracking-wide">
              [H] HOME
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground tracking-wide">
              [A] ABOUT
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground tracking-wide">
              [W] WORK
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground tracking-wide">
              [R] RESUME
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;