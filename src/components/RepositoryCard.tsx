import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Circle } from "lucide-react";

interface Repository {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
  const handleClick = () => {
    window.open(`https://github.com/nxdx96/${repository.name}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="p-8 hover:bg-muted/30 transition-all duration-300 border border-border bg-card group cursor-pointer h-full flex flex-col hover:shadow-lg hover:shadow-primary/10"
      onClick={handleClick}
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
            {repository.name}
          </h3>
          <Badge variant="secondary" className="text-xs font-medium shrink-0">
            Public
          </Badge>
        </div>
        
        <p className="text-base text-muted-foreground leading-relaxed">
          {repository.description}
        </p>
      </div>
      
      <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/50 mt-6">
        <div className="flex items-center gap-2">
          <Circle 
            className="w-3 h-3 fill-current" 
            style={{ color: repository.languageColor }}
          />
          <span className="font-medium">{repository.language}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>{repository.stars}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4" />
          <span>{repository.forks}</span>
        </div>
        
        <span className="ml-auto">Updated {repository.updatedAt}</span>
      </div>
    </Card>
  );
};

export default RepositoryCard;