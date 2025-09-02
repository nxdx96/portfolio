import { Terminal, X } from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";

const TabBar = () => {
  const { tabs } = useTabContext();
  const minimizedTabs = tabs.filter(tab => tab.isMinimized);
  
  if (minimizedTabs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-end gap-0.5 sm:gap-1 px-2 sm:px-4 overflow-x-auto scrollbar-hide">
        {minimizedTabs.map((tab, index) => (
          <div
            key={tab.id}
            className="flex items-center bg-card border-t border-l border-r border-primary/30 rounded-t-lg shadow-lg pointer-events-auto flex-shrink-0 min-w-0 max-w-[120px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-xs"
            style={{ zIndex: 40 + index }}
          >
            <button
              onClick={tab.onRestore}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-muted transition-colors flex-1 min-w-0"
              title={`Restore ${tab.title}`}
            >
              <Terminal size={12} className="text-primary flex-shrink-0 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-mono text-foreground truncate">
                {tab.title}
              </span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                tab.onClose();
              }}
              className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2 rounded hover:bg-red-500/20 transition-colors group"
              title={`Close ${tab.title}`}
            >
              <X size={10} className="text-muted-foreground group-hover:text-red-500 transition-colors sm:w-3 sm:h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabBar;