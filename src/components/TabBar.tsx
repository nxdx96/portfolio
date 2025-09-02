import { Terminal, X } from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";

const TabBar = () => {
  const { tabs } = useTabContext();
  const minimizedTabs = tabs.filter(tab => tab.isMinimized);
  
  if (minimizedTabs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-end gap-1 px-4">
        
        {minimizedTabs.map((tab, index) => (
          <div
            key={tab.id}
            className="flex items-center bg-card border-t border-l border-r border-primary/30 rounded-t-lg shadow-lg pointer-events-auto max-w-xs"
            style={{ zIndex: 40 + index }}
          >
            <button
              onClick={tab.onRestore}
              className="flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors flex-1 min-w-0"
              title={`Restore ${tab.title}`}
            >
              <Terminal size={14} className="text-primary flex-shrink-0" />
              <span className="text-sm font-mono text-foreground truncate">
                {tab.title}
              </span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                tab.onClose();
              }}
              className="flex items-center justify-center w-6 h-6 mr-2 rounded hover:bg-red-500/20 transition-colors group"
              title={`Close ${tab.title}`}
            >
              <X size={12} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabBar;