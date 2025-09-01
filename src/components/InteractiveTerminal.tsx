import { useState, useEffect, useRef } from "react";

interface TerminalLine {
  id: string;
  type: "command" | "output" | "prompt";
  content: string;
  timestamp?: number;
}

const InteractiveTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: "1", type: "output", content: "Nada's Software Engineer Portfolio Terminal v1.0.0" },
    { id: "2", type: "output", content: "Type 'help' to see available commands." },
    { id: "3", type: "output", content: "" },
    { id: "4", type: "prompt", content: "[user@portfolio ~]$ " },
  ]);
  
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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

  const commands = {
    help: () => [
      "  help          - Show this help message",
      "  about         - About the developer",
      "  skills        - Technical skills",
      "  projects      - View projects",
      "  contact       - Contact information",
      "  clear         - Clear terminal",
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
      "  📧 Email: nadaibrhm96@gmail.com",
      "  💼 LinkedIn: https://www.linkedin.com/in/nadaibrahim96/",
      "  🐙 GitHub: https://github.com/nxdx96"
    ],
    experience: () => [
      "Professional Experience:",
      "",
      "Senior Software Engineer (2021-Present)",
      "  • Led development of distributed systems serving 1M+ users",
      "  • Improved system performance by 40% through optimization",
      "",
      "Software Engineer (2019-2021)", 
      "  • Built microservices architecture from monolithic system",
      "  • Reduced deployment time by 60% with CI/CD pipelines",
    ],
    whoami: () => ["developer"],
    pwd: () => ["/home/developer/portfolio"],
    ls: () => [
      "total 8",
      "drwxr-xr-x  2 developer developer 4096 Dec  1 10:30 projects/",
      "drwxr-xr-x  2 developer developer 4096 Dec  1 10:30 documents/",
      "-rw-r--r--  1 developer developer 1024 Dec  1 10:30 README.md",
      "-rw-r--r--  1 developer developer  512 Dec  1 10:30 about.txt",
    ],
    clear: () => [],
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
          "Software Engineer Portfolio",
          "========================",
          "",
          "Experienced developer specializing in:",
          "• Distributed systems and microservices",
          "• Cloud infrastructure and DevOps",
          "• High-performance backend systems",
          "• Real-time data processing",
        ],
        "readme.md": [
          "# Developer Portfolio",
          "",
          "Welcome to my interactive terminal portfolio!",
          "",
          "## Quick Start",
          "Type 'help' to see all available commands.",
          "",
          "## Features",
          "- Interactive command-line interface",
          "- Real-time typing animations",
          "- Complete project showcase",
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
        await typeText(line, line === "" ? 0 : 5);
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

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-6 font-mono text-sm cursor-text min-h-[500px] max-h-[600px] overflow-hidden flex flex-col"
      onClick={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-dracula-red"></div>
        <div className="w-3 h-3 rounded-full bg-dracula-yellow"></div>
        <div className="w-3 h-3 rounded-full bg-dracula-green"></div>
        <div className="ml-4 text-sm text-muted-foreground">
          user@portfolio: ~/terminal
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap">
            {line.type === "command" && (
              <span className="text-primary">{line.content}</span>
            )}
            {line.type === "output" && (
              <span className="text-foreground">{line.content}</span>
            )}
            {line.type === "prompt" && (
              <span className="text-primary">{line.content}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input Line */}
      {!isTyping && (
        <div className="flex items-center mt-2 pt-2 border-t border-border/50">
          <span className="text-primary mr-2">[user@portfolio ~]$</span>
          <div className="flex items-center flex-1">
            {currentInput === "" ? (
              <>
                <span className="text-primary animate-pulse">█</span>
                <span className="text-muted-foreground ml-1">Type a command...</span>
              </>
            ) : (
              <>
                <span className="text-foreground">{currentInput}</span>
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