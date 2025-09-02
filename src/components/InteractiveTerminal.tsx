import { useState, useEffect, useRef } from "react";
import { Mail, Linkedin, Github, Phone } from "lucide-react";

interface TerminalLine {
  id: string;
  type: "command" | "output" | "prompt";
  content: string | JSX.Element;
  timestamp?: number;
}

const InteractiveTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: "1", type: "output", content: "Nada's Software Engineer Portfolio Terminal v1.0.0" },
    { id: "2", type: "output", content: "Type 'help' to see available commands. " },
    { id: "3", type: "output", content: "" },
    { id: "4", type: "prompt", content: "[user@portfolio ~]$ " },
  ]);
  
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [catVariation, setCatVariation] = useState(0);
  const [petVariation, setPetVariation] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-focus terminal on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const catVariations = [
    [
      "     /\\_/\\  ",
      "    ( o.o ) ",
      "     > ^ <  ",
      "    ♥ meow ♥",
      "      type 'pet' to interact"
    ],
    [
      "     /\\_/\\  ",
      "    ( -.- ) ",
      "     > - <  ",
      "     zzz... ",
      "      (sleeping kitty)"
    ],
    [
      "     /\\_/\\  ",
      "    ( >.< ) ",
      "     > w <  ",
      "     nyaa~ ",
      "      (excited cat!)"
    ]
  ];

  const petVariations = [
    [
      "     /\\_/\\  ",
      "    ( ^.^ ) ",
      "     )   (  ",
      "    (  -  ) ",
      "   ^^^   ^^^",
      "    purr... purr...",
      "   you pet the cat. it seems happy!\n\n",
      "   pet it again?"
    ],
    [
      "     /\\_/\\  ",
      "    ( ◕.◕ ) ",
      "     )   (  ",
      "    (  ∪  ) ",
      "   ^^^   ^^^",
      "    mrow mrow~",
      "   the cat nuzzles your hand affectionately!"
    ],
    [
      "     /\\_/\\  ",
      "    ( =.= ) ",
      "     )   (  ",
      "    (  ︶  ) ",
      "   ^^^   ^^^",
      "    *content purring*",
      "   maximum happiness achieved! =^.^=\n\n",
      "   now try 'cat about.txt' or 'cat readme.md'"
    ]
  ];

  const commands = {
    help: () => [
      "  help          - Show this help message",
      "  about         - About the developer",
      "  skills        - Technical skills",
      "  experience    - Work experience",
      "  projects      - View projects",
      "  contact       - Contact information",
      "  clear         - Clear terminal",
      "  cat           - try me!!! ",
    ],
    about: () => [
      "Experienced Software Engineer with 5+ years specializing in designing",
      "and scaling high-performance data infrastructure and distributed systems,",
      "with a proven track record of architecting enterprise-grade platforms",
    ],
    skills: () => [
      "Big Data & Infrastructure:",
      "  • Airflow DAGs, Snowflake, PostgreSQL, MongoDB",
      "  • High-volume Data Processing, Data Pipeline Optimization",
      "  • Vector Search & Indexing",

      "Programming Languages:",
      "  • Python, Java, JavaScript, C#, .NET",
      "  • Flask, Node.js, RESTful API Development",
    
      "Cloud & DevOps:",
      "  • AWS (CloudFormation, ECS, S3, Step Functions, Lambda, SNS/SQS)",
      "  • Docker, CI/CD Pipelines",

      "Data Science & Analytics:",
      "  • Pandas, Matplotlib, Sci-Kit Learn",
      "  • ML Pipeline Development, RAG patterns, LLM Integration",
 
      "Tools & Platforms:",
      "  • Git, GitHub Actions, Tableau, Jupyter Notebook",
      "  • JIRA, Postman, XML Processing",
    ],
    projects: () => [
      "Featured Projects:",
      "  1. Face Findr - Interactive beauty discovery app mapping makeup products to facial features",
      
      "  2. Policy Scraper Dashboard - Automated policy data scraping with searchable Flask dashboard",
   
      "  3. Prompt2JSON Extractor - LLM-powered structured data extractor with JSON validation",

      "  4. Snowflake Fuzzy Matcher Lite - Healthcare provider matching using fuzzy algorithms",

      "  5. Bootcamp Wrapped - Music analytics project emulating Spotify Wrapped",
     
    ],
    contact: () => [
      "Contact Information:",
      <div className="flex items-center gap-3 ml-2">
        <Mail size={16} className="text-primary flex-shrink-0" />
        <a href="mailto:nadaibrhm96@gmail.com" className="hover:text-primary hover:underline">
          nadaibrhm96@gmail.com
        </a>
      </div>,
      <div className="flex items-center gap-3 ml-2">
        <Linkedin size={16} className="text-primary flex-shrink-0" />
        <a href="https://linkedin.com/in/nadaibrahim96" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
          linkedin.com/in/nadaibrahim96
        </a>
      </div>,
      <div className="flex items-center gap-3 ml-2">
        <Github size={16} className="text-primary flex-shrink-0" />
        <a href="https://github.com/nxdx96" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
          github.com/nxdx96
        </a>
      </div>,
      <div className="flex items-center gap-3 ml-2">
        <Phone size={16} className="text-primary flex-shrink-0" />
        <a href="tel:2016268719" className="hover:text-primary hover:underline">
          201-626-8719
        </a>
      </div>
    ],
    experience: () => [
      "Professional Experience:",
      "Software Engineer III - Komodo Health (2022-2025)",
      "  • Architected AWS-based data infrastructure processing 350K+ documents quarterly with 99.5% uptime,",
      "    cutting deployment times by 50% and eliminating $5M+ in annual third-party costs",
      "  • Built AI-powered data mapping platform handling 12M+ provider records in Snowflake with vector search,",
      "    optimizing Airflow pipelines to reduce job failures by 70% and boost processing speeds by 40%",
      "  • Developed scalable Flask APIs and JavaScript dashboards serving thousands of daily requests,",
      "    reducing manual intervention by 60% and achieving $2M+ quarterly operational savings",
      "Software Engineer - Infosys/Comcast (2021-2022)", 
      "  • Engineered automation frameworks executing 80+ test cases weekly, maintaining 98%+",
      "    system reliability across distributed DEV environments",
      "  • Developed API validation scripts (CSV, XML, SIPp) integrated with CI workflows using",
      "    Postman, GitHub, and JIRA to validate UDP response accuracy and accelerate releases",
      "  • Built microservices architecture from monolithic system, reducing deployment time by 60%",
      "Software Engineer - HomeSlice (2020-2021)",
      "  • Built full-stack data platform (Python, JavaScript, AWS, PostgreSQL) with 99%-accurate",
      "    ML pipeline for real estate analytics, processing large-scale Zillow API and economic datasets",
      "  • Implemented scalable data storage and retrieval systems enabling seamless equity transactions",
      "    via responsive web interfaces and real-time data processing",
    ],
    clear: () => [],
    cat: () => {
      const variation = catVariations[catVariation];
      setCatVariation((prev) => (prev + 1) % catVariations.length);
      return variation;
    },
    pet: () => {
      const variation = petVariations[petVariation];
      setPetVariation((prev) => (prev + 1) % petVariations.length);
      return variation;
    }
  };

  const typeText = async (text: string, delay = 15) => {
    setIsTyping(true);
    
    // Add the line we'll be typing to
    const lineId = Date.now().toString();
    setLines(prev => [
      ...prev,
      { id: lineId, type: "output", content: "" }
    ]);
    
    const chars = text.split("");
    let typed = "";
    
    for (const char of chars) {
      typed += char;
      setLines(prev => prev.map(line => 
        line.id === lineId 
          ? { ...line, content: typed + "█" }
          : line
      ));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Remove cursor and finalize the line
    setLines(prev => prev.map(line => 
      line.id === lineId 
        ? { ...line, content: text }
        : line
    ));
    setIsTyping(false);
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    // First, add the command with prompt prefix 
    setLines(prev => {
      // Remove any prompts from the end and add the command
      const withoutPrompts = prev.filter(line => line.type !== "prompt");
      return [
        ...withoutPrompts,
        {
          id: `cmd_${Date.now()}`,
          type: "command", 
          content: `[user@portfolio ~]$ ${cmd}`
        }
      ];
    });

    if (trimmedCmd === "clear") {
      setTimeout(() => setLines([
        { id: "1", type: "output", content: "Software Engineer Portfolio Terminal v1.0.0" },
        { id: "2", type: "output", content: "Type 'help' to see available commands." },
        { id: "3", type: "output", content: "" },
        { id: Date.now().toString() + "_prompt", type: "prompt", content: "[user@portfolio ~]$ " }
      ]), 100);
      return; // No empty line needed for clear command
    }

    // Handle cat command with file parameter
    if (trimmedCmd.startsWith("cat ")) {
      const fileName = trimmedCmd.split(" ")[1];
      const fileContents: { [key: string]: string[] } = {
        "about.txt": [
          "Nada Ibrahim - Software Engineer Portfolio",
          "==========================================",
          "Experienced Software Engineer with 5+ years specializing in:",
          "• Designing and scaling high-performance data infrastructure",
          "• AWS-based distributed systems processing 350K+ documents quarterly",
          "• AI-powered data mapping platforms with vector search capabilities",
          "• Full-stack development (Python, JavaScript, Flask, React)",
          "• Machine learning pipelines and LLM integration",
          "• Real estate analytics and healthcare data systems",
        ],
        "readme.md": [
          "# Nada Ibrahim - Software Engineer",
          "Welcome to my interactive terminal portfolio!",
          "==========================================",
          "## About Me",
          "Senior Software Engineer specializing in data infrastructure, AI systems,",
          "and full-stack development. Most recently at Komodo Health building",
          "enterprise-grade platforms that process millions of records.",
          "==========================================",
          "## Featured Achievements",
          "• $15M+ in cost savings through infrastructure optimization",
          "• 99.5% uptime on critical data systems",
          "• AI platforms processing 12M+ healthcare records",
          "==========================================",
          "## Quick Start",
          "Type 'help' to see all available commands.",
          "Try 'experience', 'projects', or 'skills' to learn more!",
        ]
      };
      
      if (fileContents[fileName]) {
        for (const line of fileContents[fileName]) {
          await typeText(line, 5);
        }
      } else {
        await typeText(`cat: ${fileName}: No such file or directory`);
      }
      
      // Add empty line for spacing like real terminal
      await typeText("");
      
      // Add new prompt after command execution
      setLines(prev => [
        ...prev,
        { id: Date.now().toString() + "_prompt", type: "prompt", content: "[user@portfolio ~]$ " }
      ]);
      return;
    }

    // Handle echo command
    if (trimmedCmd.startsWith("echo ")) {
      const text = cmd.slice(5); // Remove "echo "
      await typeText(text, 5);
      
      // Add empty line for spacing like real terminal
      await typeText("");
      
      // Add new prompt after command execution
      setLines(prev => [
        ...prev,
        { id: Date.now().toString() + "_prompt", type: "prompt", content: "[user@portfolio ~]$ " }
      ]);
      return;
    }

    // Handle other commands
    const commandKey = trimmedCmd as keyof typeof commands;
    if (commands[commandKey]) {
      const output = commands[commandKey]();
      
      // Add header for help command
      if (trimmedCmd === "help") {
        await typeText("Available commands:", 5);
      }
      
      for (const line of output) {
        if (typeof line === 'string') {
          await typeText(line, line === "" ? 0 : 5);
        } else {
          // Handle JSX elements directly without typing animation
          const lineId = Date.now().toString() + Math.random();
          setLines(prev => [
            ...prev,
            { id: lineId, type: "output", content: line }
          ]);
          // Small delay to maintain terminal feel
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } else {
      await typeText(`bash: ${trimmedCmd}: command not found`);
    }

    // Add empty line for spacing like real terminal
    await typeText("");
    
    // Add new prompt after command execution
    setLines(prev => [
      ...prev,
      { id: Date.now().toString() + "_prompt", type: "prompt", content: "[user@portfolio ~]$ " }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentInput.trim() && !isTyping) {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  const handleTerminalClick = (e: React.MouseEvent) => {
    // Only focus if we're not selecting text and clicked on empty space
    const selection = window.getSelection();
    const target = e.target as HTMLElement;
    
    // Don't focus if there's a text selection or if clicking on a link
    if ((!selection || selection.toString().length === 0) && 
        !target.closest('a') && 
        inputRef.current) {
      // Small delay to allow text selection to complete
      setTimeout(() => {
        const currentSelection = window.getSelection();
        if (!currentSelection || currentSelection.toString().length === 0) {
          inputRef.current?.focus();
        }
      }, 10);
    }
  };

  // Helper function to render text with clickable URLs and emails
  const renderTextWithLinks = (content: string | JSX.Element) => {
    if (typeof content !== 'string') {
      return content; // Return JSX element as-is
    }
    
    const text = content;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    
    // First handle URLs, then emails
    let result = text.split(urlRegex);
    let finalParts: (string | JSX.Element)[] = [];
    
    result.forEach((part, index) => {
      if (part.match(urlRegex)) {
        finalParts.push(
          <a
            key={`url-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dracula-cyan underline hover:text-dracula-pink transition-colors cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      } else {
        // Check for emails in non-URL parts
        const emailParts = part.split(emailRegex);
        emailParts.forEach((emailPart, emailIndex) => {
          if (emailPart.match(emailRegex)) {
            finalParts.push(
              <a
                key={`email-${index}-${emailIndex}`}
                href={`mailto:${emailPart}`}
                className="text-dracula-cyan underline hover:text-dracula-pink transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {emailPart}
              </a>
            );
          } else if (emailPart) {
            finalParts.push(emailPart);
          }
        });
      }
    });
    
    return finalParts;
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6 font-mono text-xs sm:text-sm cursor-text min-h-[350px] sm:min-h-[450px] md:min-h-[500px] max-h-[500px] sm:max-h-[550px] md:max-h-[600px] overflow-hidden flex flex-col"
      onMouseUp={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-border">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-dracula-red"></div>
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-dracula-yellow"></div>
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-dracula-green"></div>
        <div className="ml-2 sm:ml-3 md:ml-4 text-xs sm:text-sm text-muted-foreground">
          <span className="hidden xs:inline">user@portfolio: ~/</span><span className="xs:hidden">~/</span>terminal
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto space-y-0.5 sm:space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent select-text"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap select-text text-xs sm:text-sm leading-relaxed">
            {line.type === "command" && (
              <span className="text-primary select-text">{renderTextWithLinks(line.content)}</span>
            )}
            {line.type === "output" && (
              <span className="text-foreground select-text">{renderTextWithLinks(line.content)}</span>
            )}
            {line.type === "prompt" && (
              <span className="text-primary select-text">{renderTextWithLinks(line.content)}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input Line */}
      {!isTyping && (
        <div className="flex items-center mt-2 pt-2 border-t border-border/50">
          <span className="text-primary mr-1 sm:mr-2 text-xs sm:text-sm">
            <span className="hidden xs:inline">[user@portfolio ~]$</span>
            <span className="xs:hidden">$</span>
          </span>
          <div className="flex items-center flex-1 min-w-0">
            {currentInput === "" ? (
              <>
                <span className="text-primary animate-pulse">█</span>
                <span className="text-muted-foreground ml-1 text-xs sm:text-sm truncate">
                  <span className="hidden sm:inline">Type a command...</span>
                  <span className="sm:hidden">Type cmd...</span>
                </span>
              </>
            ) : (
              <>
                <span className="text-foreground text-xs sm:text-sm break-all">{currentInput}</span>
                <span className="text-primary animate-pulse">█</span>
              </>
            )}
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 w-0 h-0 overflow-hidden"
              placeholder="Type a command..."
              disabled={isTyping}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTerminal;