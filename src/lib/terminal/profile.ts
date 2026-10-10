// Profile data, commands content, and the GitHub fetch.
// Ported from the design handoff `terminal-core.js` (data kept verbatim).

export interface SkillGroup {
  h: string;
  items: string[];
}
export interface Job {
  role: string;
  co: string;
  years: string;
  bullets: string[];
}
export interface ContactItem {
  label: string;
  value: string;
  href: string;
}

export const PROFILE = {
  name: "Nada Ibrahim",
  first: "nada",
  title: "Software Engineer",
  tags: ["Full-Stack", "Backend", "Data Engineer"],
  location: "New York City Metro · open to remote",
  github: "nxdx96",
  resumeUrl: "/resume.pdf",
  about: [
    "Experienced Software Engineer with 5+ years specializing in designing",
    "and scaling high-performance data infrastructure and distributed systems,",
    "with a proven track record of architecting enterprise-grade platforms.",
  ],
  skills: [
    { h: "Big Data & Infrastructure", items: ["Airflow DAGs, Snowflake, PostgreSQL, MongoDB", "High-volume Data Processing, Data Pipeline Optimization", "Vector Search & Indexing"] },
    { h: "Programming Languages", items: ["Python, Java, JavaScript, C#, .NET", "Flask, Node.js, RESTful API Development"] },
    { h: "Cloud & DevOps", items: ["AWS (CloudFormation, ECS, S3, Step Functions, Lambda, SNS/SQS)", "Docker, CI/CD Pipelines"] },
    { h: "Data Science & Analytics", items: ["Pandas, Matplotlib, Sci-Kit Learn", "ML Pipeline Development, RAG patterns, LLM Integration"] },
    { h: "Tools & Platforms", items: ["Git, GitHub Actions, Tableau, Jupyter Notebook", "JIRA, Postman, XML Processing"] },
  ] as SkillGroup[],
  experience: [
    { role: "Software Engineer III", co: "Komodo Health", years: "2022 – 2025", bullets: [
      "Architected AWS-based data infrastructure processing 350K+ documents quarterly with 99.5% uptime, cutting deployment times by 50%",
      "Built AI-powered data mapping platform handling 12M+ provider records in Snowflake with vector search, optimizing Airflow pipelines to reduce job failures by 70% and boost processing speeds by 40%",
      "Developed scalable Flask APIs and JavaScript dashboards serving thousands of daily requests, reducing manual intervention by 60% and achieving $2M+ quarterly operational savings" ] },
    { role: "Software Engineer", co: "Infosys / Comcast", years: "2021 – 2022", bullets: [
      "Engineered automation frameworks executing 80+ test cases weekly, maintaining 98%+ system reliability across distributed DEV environments",
      "Developed API validation scripts (CSV, XML, SIPp) integrated with CI workflows using Postman, GitHub, and JIRA to validate UDP response accuracy and accelerate releases",
      "Built microservices architecture from monolithic system, reducing deployment time by 60%" ] },
    { role: "Software Engineer", co: "HomeSlice", years: "2020 – 2021", bullets: [
      "Built full-stack data platform (Python, JavaScript, AWS, PostgreSQL) with 99%-accurate ML pipeline for real estate analytics, processing large-scale Zillow API and economic datasets",
      "Implemented scalable data storage and retrieval systems enabling seamless equity transactions via responsive web interfaces and real-time data processing" ] },
  ] as Job[],
  contact: [
    { label: "email", value: "nadaibrhm96@gmail.com", href: "mailto:nadaibrhm96@gmail.com" },
    { label: "linkedin", value: "linkedin.com/in/nadaibrahim96", href: "https://linkedin.com/in/nadaibrahim96" },
    { label: "github", value: "github.com/nxdx96", href: "https://github.com/nxdx96" },
    { label: "phone", value: "201-626-8719", href: "tel:2016268719" },
  ] as ContactItem[],
  featured: [
    { name: "Face Findr", desc: "Interactive beauty discovery app mapping makeup products to facial features" },
    { name: "Policy Scraper Dashboard", desc: "Automated policy data scraping with searchable Flask dashboard" },
    { name: "Prompt2JSON Extractor", desc: "LLM-powered structured data extractor with JSON validation" },
    { name: "Snowflake Fuzzy Matcher Lite", desc: "Healthcare provider matching using fuzzy algorithms" },
    { name: "Bootcamp Wrapped", desc: "Music analytics project emulating Spotify Wrapped" },
  ],
};

export const HELP = [
  "  help          - Show this help message",
  "  about         - About the developer",
  "  skills        - Technical skills",
  "  experience    - Work experience",
  "  projects      - View projects (live from GitHub)",
  "  resume        - Open resume",
  "  contact       - Contact information",
  "  open <n>      - Open project n on GitHub",
  "  clear         - Clear terminal",
  "  cat           - try me!!!",
];

export const CATS = [
  ["     /\\_/\\  ", "    ( o.o ) ", "     > ^ <  ", "    ♥ meow ♥", "      type 'pet' to interact"],
  ["     /\\_/\\  ", "    ( -.- ) ", "     > - <  ", "     zzz... ", "      (sleeping kitty)"],
  ["     /\\_/\\  ", "    ( >.< ) ", "     > w <  ", "     nyaa~ ", "      (excited cat!)"],
];
export const PETS = [
  ["     /\\_/\\  ", "    ( ^.^ ) ", "     )   (  ", "    (  -  ) ", "   ^^^   ^^^", "    purr... purr...", "   you pet the cat. it seems happy!", "   pet it again?"],
  ["     /\\_/\\  ", "    ( ◕.◕ ) ", "     )   (  ", "    (  ∪  ) ", "   ^^^   ^^^", "    mrow mrow~", "   the cat nuzzles your hand affectionately!"],
  ["     /\\_/\\  ", "    ( =.= ) ", "     )   (  ", "    (  ︶  ) ", "   ^^^   ^^^", "    *content purring*", "   maximum happiness achieved! =^.^=", "   now try 'cat about.txt' or 'cat readme.md'"],
];
export const FILES: Record<string, string[]> = {
  "about.txt": ["Nada Ibrahim - Software Engineer Portfolio", "==========================================", ...PROFILE.about.map(l => "• " + l)],
  "readme.md": ["# Nada Ibrahim - Software Engineer", "Welcome to my interactive terminal portfolio!", "## Quick Start", "Type 'help' to see all available commands.", "Try 'experience', 'projects', or 'skills' to learn more!"],
};

const LANG_COLORS: Record<string, string> = { JavaScript: "#F7DF1E", TypeScript: "#3178C6", Python: "#3776AB", "Jupyter Notebook": "#DA5B0B", Java: "#B07219", "C#": "#239120", HTML: "#E34C26", CSS: "#1572B6", Shell: "#89E051", Go: "#00ADD8", Rust: "#DEA584" };

export interface Repo {
  idx: number;
  name: string;
  desc: string;
  lang: string;
  langColor: string;
  stars: number;
  forks: number;
  updated: string;
  url: string;
  live?: boolean;
  homepage?: string | null;
  offline?: boolean;
}

function ago(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  if (days < 1) return "today";
  if (days < 30) return days + "d ago";
  if (days < 365) return Math.floor(days / 30) + "mo ago";
  return Math.floor(days / 365) + "y ago";
}

let repoPromise: Promise<Repo[]> | null = null;
export function fetchRepos(): Promise<Repo[]> {
  if (repoPromise) return repoPromise;
  repoPromise = fetch(`https://api.github.com/users/${PROFILE.github}/repos?type=owner&sort=updated&per_page=100`)
    .then(r => { if (!r.ok) throw new Error("GitHub API " + r.status); return r.json(); })
    .then((list): Repo[] => list.filter((r) => !r.fork && !r.archived).map((r, i: number) => ({
      idx: i + 1, name: r.name, desc: r.description || "No description", lang: r.language || "—",
      langColor: LANG_COLORS[r.language] || "#888", stars: r.stargazers_count, forks: r.forks_count,
      updated: ago(r.updated_at), url: r.html_url, live: !!r.homepage, homepage: r.homepage,
    })))
    .catch((err) => { repoPromise = null; throw err; });
  return repoPromise;
}

export const FALLBACK: Repo[] = PROFILE.featured.map((p, i) => ({
  idx: i + 1, name: p.name, desc: p.desc, lang: "Python", langColor: LANG_COLORS.Python,
  stars: 0, forks: 0, updated: "", url: `https://github.com/${PROFILE.github}`, offline: true,
}));
