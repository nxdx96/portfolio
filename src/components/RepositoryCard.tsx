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
  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 border-border bg-card group cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {repository.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            Public
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {repository.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Circle 
              className="w-3 h-3 fill-current" 
              style={{ color: repository.languageColor }}
            />
            <span>{repository.language}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{repository.stars}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            <span>{repository.forks}</span>
          </div>
          
          <span>Updated {repository.updatedAt}</span>
        </div>
      </div>
    </Card>
  );
};

export default RepositoryCard;