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

const WorkSection = () => {
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      name: "face-findr",
      description: "Interactive beauty discovery app that maps makeup products to facial features using Flask, Postgres, p5.js, d3.js, and Plotly.",
      language: "JavaScript",
      languageColor: "#F7DF1E",
      stars: 0,
      forks: 0,
      updatedAt: "4 months ago"
    },
    {
      name: "policy-scraper-dashboard",
      description: "Automates scraping of public policy data using Selenium, normalizes to JSON, and serves results in a searchable Flask dashboard.",
      language: "Python",
      languageColor: "#3776AB",
      stars: 1,
      forks: 0,
      updatedAt: "4 months ago"
    },
    {
      name: "prompt2json-extractor",
      description: "LLM-powered structured data extractor: give it a prompt + raw text, get validated JSON back with local and cloud LLM support.",
      language: "Python",
      languageColor: "#3776AB",
      stars: 0,
      forks: 0,
      updatedAt: "4 months ago"
    },
    {
      name: "snowflake-fuzzy-matcher-lite",
      description: "Local demo of large-scale healthcare provider matching using RapidFuzz and SQLite for data engineering workflows.",
      language: "Python",
      languageColor: "#3776AB",
      stars: 0,
      forks: 0,
      updatedAt: "4 months ago"
    },
    {
      name: "bootcamp-wrapped",
      description: "A Jupyter Notebook–based project emulating Spotify's 'Wrapped,' aggregating top tracks across music platforms.",
      language: "Jupyter Notebook",
      languageColor: "#DA5B0B",
      stars: 0,
      forks: 0,
      updatedAt: "4 months ago"
    },
    {
      name: "solid-code-display",
      description: "Interactive terminal-style portfolio website built with React, TypeScript, and Tailwind CSS showcasing software engineering projects.",
      language: "TypeScript",
      languageColor: "#3178C6",
      stars: 0,
      forks: 0,
      updatedAt: "today"
    }
  ]);

  const repoNames = [
    "face-findr",
    "policy-scraper-dashboard", 
    "prompt2json-extractor",
    "snowflake-fuzzy-matcher-lite",
    "bootcamp-wrapped",
    "solid-code-display"
  ];

  const languageColors: { [key: string]: string } = {
    "JavaScript": "#F7DF1E",
    "Python": "#3776AB",
    "TypeScript": "#3178C6",
    "Jupyter Notebook": "#DA5B0B"
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return "1 month ago";
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const fetchedRepos = await Promise.all(
          repoNames.map(async (repoName) => {
            const response = await fetch(`https://api.github.com/repos/nxdx96/${repoName}`);
            if (!response.ok) return null;
            
            const repo = await response.json();
            return {
              name: repo.name,
              description: repo.description || repositories.find(r => r.name === repoName)?.description || "No description available",
              language: repo.language || "Unknown",
              languageColor: languageColors[repo.language] || "#666666",
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              updatedAt: formatDate(repo.updated_at)
            };
          })
        );

        const validRepos = fetchedRepos.filter(repo => repo !== null) as Repository[];
        if (validRepos.length > 0) {
          setRepositories(validRepos);
        }
      } catch (error) {
        console.log('Using fallback repository data');
      }
    };

    fetchRepositories();
  }, []);


  return (
    <section className="py-16 px-6" data-section="projects">
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
        </div>
      </div>
    </section>
  );
};

export default WorkSection;