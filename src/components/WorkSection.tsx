import RepositoryCard from "./RepositoryCard";

const WorkSection = () => {
  const repositories = [
    {
      name: "distributed-cache-system",
      description: "High-performance distributed caching system built with Redis and Go, supporting horizontal scaling and fault tolerance.",
      language: "Go",
      languageColor: "#00ADD8",
      stars: 127,
      forks: 23,
      updatedAt: "2 days ago"
    },
    {
      name: "microservices-orchestrator",
      description: "Container orchestration platform for microservices with automated deployment, service discovery, and load balancing.",
      language: "TypeScript",
      languageColor: "#3178C6",
      stars: 89,
      forks: 15,
      updatedAt: "5 days ago"
    },
    {
      name: "real-time-analytics-engine",
      description: "Stream processing engine for real-time analytics with Apache Kafka and Apache Flink integration.",
      language: "Java",
      languageColor: "#ED8B00",
      stars: 156,
      forks: 34,
      updatedAt: "1 week ago"
    },
    {
      name: "infrastructure-as-code",
      description: "Terraform modules and Ansible playbooks for automated infrastructure provisioning on AWS and GCP.",
      language: "HCL",
      languageColor: "#844FBA",
      stars: 78,
      forks: 19,
      updatedAt: "3 days ago"
    },
    {
      name: "api-gateway-service",
      description: "Scalable API gateway with rate limiting, authentication, and request routing for enterprise microservices.",
      language: "Python",
      languageColor: "#3776AB",
      stars: 203,
      forks: 41,
      updatedAt: "4 days ago"
    },
    {
      name: "event-driven-architecture",
      description: "Event sourcing and CQRS implementation with Apache Kafka for building resilient distributed systems.",
      language: "Scala",
      languageColor: "#DC322F",
      stars: 142,
      forks: 28,
      updatedAt: "1 week ago"
    }
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="animate-slide-in">
          <div className="mb-16">
            <div className="text-sm font-medium text-muted-foreground mb-4 tracking-wider uppercase">
              / Featured Projects
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-6">
              Level up your workflow
              <br />
              with these repositories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              A selection of projects showcasing expertise in distributed systems, 
              infrastructure, and scalable architecture.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {repositories.map((repo, index) => (
              <div 
                key={repo.name} 
                className="animate-fade-in"
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