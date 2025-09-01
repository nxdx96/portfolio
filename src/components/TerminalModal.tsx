import { useEffect, useState } from "react";
import { X, Terminal } from "lucide-react";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const TerminalModal = ({ isOpen, onClose, title, content }: TerminalModalProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMinimizeTab, setShowMinimizeTab] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(true);
    // Show the minimized tab after animation
    setTimeout(() => setShowMinimizeTab(true), 300);
  };

  const handleRestore = () => {
    setShowMinimizeTab(false);
    setIsMinimized(false);
  };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen && !isMinimized) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isMinimized]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 ${isMinimized ? 'z-30 pointer-events-none' : 'z-50'}`}>
      {/* Backdrop */}
      {!isMinimized && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Terminal Modal */}
      <div className={`relative w-full max-w-4xl max-h-[70vh] bg-card border-2 border-primary/30 rounded-lg shadow-2xl overflow-hidden my-auto transition-all duration-300 ${isMinimized ? 'scale-0 opacity-0 translate-y-96 translate-x-96' : 'scale-100 opacity-100 translate-x-0 translate-y-0'}`}>
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="terminal-control-btn w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              title="Close"
            />
            <button
              onClick={handleMinimize}
              className="terminal-control-btn w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
              title="Minimize"
            />
            <button
              className="terminal-control-btn w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-default"
              title="Maximize"
            />
          </div>
          <div className="text-sm font-mono text-muted-foreground">
            [user@nada ~]$ cat {title}.txt
          </div>
          <div></div>
        </div>
        
        {/* Terminal Content */}
        <div className="p-6 bg-background/95 font-mono text-sm leading-relaxed overflow-y-auto max-h-[calc(70vh-120px)]">
          <div className="text-primary mb-2">
            $ cat {title}.txt
          </div>
          <div className="text-foreground whitespace-pre-wrap">
            {content}
          </div>
          <div className="text-primary mt-4">
            $ <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
      
      {/* Minimized Tab */}
      {showMinimizeTab && (
        <div className="fixed bottom-0 left-4 z-40 pointer-events-none">
          <button
            onClick={handleRestore}
            className="flex items-center gap-2 bg-card border-t border-l border-r border-primary/30 rounded-t-lg px-4 py-2 shadow-lg hover:bg-muted transition-colors pointer-events-auto"
            title="Restore terminal"
          >
            <Terminal size={16} className="text-primary" />
            <span className="text-sm font-mono text-foreground">{title}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TerminalModal;