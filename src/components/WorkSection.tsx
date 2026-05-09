import { useState, useEffect } from "react";
import RepositoryCard from "./RepositoryCard";

interface Repository {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

const GITHUB_USERNAME = "nxdx96";

// GitHub language colors - extended list
const languageColors: Record<string, string> = {
  "JavaScript": "#F7DF1E",
  "TypeScript": "#3178C6",
  "Python": "#3776AB",
  "Jupyter Notebook": "#DA5B0B",
  "Java": "#B07219",
  "C#": "#239120",
  "C++": "#F34B7D",
  "C": "#555555",
  "Go": "#00ADD8",
  "Rust": "#DEA584",
  "Ruby": "#701516",
  "PHP": "#4F5D95",
  "Swift": "#FA7343",
  "Kotlin": "#A97BFF",
  "HTML": "#E34C26",
  "CSS": "#1572B6",
  "SCSS": "#C6538C",
  "Shell": "#89E051",
  "Dockerfile": "#384D54",
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const WorkSection = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all public repos for the user, sorted by most recently updated
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`
        );

        // Handle rate limiting
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get("X-RateLimit-Remaining");
          if (rateLimitRemaining === "0") {
            setError("GitHub API rate limit reached. Please try again later.");
            return;
          }
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos: GitHubRepo[] = await response.json();

        // Filter out forks and archived repos, then map to our format
        const filteredRepos = repos
          .filter((repo) => !repo.fork && !repo.archived)
          .map((repo) => ({
            name: repo.name,
            description: repo.description || "No description available",
            language: repo.language || "Unknown",
            languageColor: languageColors[repo.language || ""] || "#666666",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: formatDate(repo.updated_at),
          }));

        setRepositories(filteredRepos);
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
        setError("Failed to load repositories. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <section className="py-16 px-6 scroll-mt-24" data-section="projects">
      <div className="max-w-6xl mx-auto">
        <div className="animate-slide-in">
          <div className="mb-16">
            <div className="text-sm font-medium text-muted-foreground mb-4 tracking-wider uppercase">
              / Featured Projects
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-6">
              Building scalable systems
              <br />
              and data infrastructure
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              A selection of projects showcasing expertise in distributed systems,
              infrastructure, and scalable architecture.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 auto-rows-fr">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && repositories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No repositories found.</p>
            </div>
          )}

          {/* Repository Grid */}
          {!isLoading && !error && repositories.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 auto-rows-fr">
              {repositories.map((repo, index) => (
                <div
                  key={repo.name}
                  className="animate-fade-in h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RepositoryCard repository={repo} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
