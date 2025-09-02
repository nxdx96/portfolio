import { useEffect, useState, useRef } from "react";
import { X, Terminal, Mail, Linkedin, Github, Phone } from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isGifModal?: boolean;
  gifSrc?: string;
  fixedGifRatio?: boolean;
  isPdfModal?: boolean;
  pdfSrc?: string;
  isDocxModal?: boolean;
  docxSrc?: string;
  isPngModal?: boolean;
  pngSrc?: string;
  isContactModal?: boolean;
}

const TerminalModal = ({ isOpen, onClose, title, content, isGifModal, gifSrc, fixedGifRatio, isPdfModal, pdfSrc, isDocxModal, docxSrc, isPngModal, pngSrc, isContactModal }: TerminalModalProps) => {
  const { addTab, removeTab, updateTab } = useTabContext();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [docxLoadFailed, setDocxLoadFailed] = useState(false);
  const [pngLoadFailed, setPngLoadFailed] = useState(false);
  const [size, setSize] = useState(() => {
    // Get viewport dimensions for responsive sizing
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    if (fixedGifRatio && isGifModal) {
      // Responsive GIF modal sizing
      const width = Math.min(600, vw - 32); // 16px margin on each side
      const height = Math.min(500, vh - 64); // 32px margin top/bottom
      return { width, height };
    }
    if (isPdfModal || isDocxModal || isPngModal) {
      // Responsive document modal sizing
      const width = Math.min(900, vw - 32);
      const height = Math.min(700, vh - 64);
      return { width, height };
    }
    // Default responsive sizing
    const width = Math.min(896, vw - 32);
    const height = Math.min(504, vh - 64);
    return { width, height };
  });

  // Generate unique tab ID based on title
  const tabId = `tab-${title.toLowerCase().replace(/\s+/g, '-')}`;

  const handleMinimize = () => {
    setIsMinimized(true);
    // Add tab to global tab manager
    addTab({
      id: tabId,
      title,
      isMinimized: true,
      onRestore: handleRestore,
      onClose: handleClose
    });
  };

  const handleRestore = () => {
    setIsMinimized(false);
    // Update tab in global tab manager
    updateTab(tabId, { isMinimized: false });
  };

  const handleClose = () => {
    // Remove tab and close modal
    removeTab(tabId);
    onClose();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    // Reset position when toggling maximize
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    const rect = (e.target as HTMLElement).closest('.terminal-modal')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMinimized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMinimized || (isGifModal && fixedGifRatio)) return;
    setIsResizing(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (isResizing && !isMinimized) {
      const rect = document.querySelector('.terminal-modal')?.getBoundingClientRect();
      if (rect) {
        const newWidth = Math.max(400, e.clientX - rect.left);
        const newHeight = Math.max(300, e.clientY - rect.top);
        setSize({ width: newWidth, height: newHeight });
      }
    }
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing]);

  // Handle modal open/close state changes
  useEffect(() => {
    if (!isOpen) {
      // Modal is closed, remove tab and reset minimized state
      removeTab(tabId);
      setIsMinimized(false);
    }
  }, [isOpen, tabId, removeTab]);

  // Store the current removeTab and tabId in refs to avoid stale closures
  const removeTabRef = useRef(removeTab);
  const tabIdRef = useRef(tabId);
  
  // Update refs when values change
  useEffect(() => {
    removeTabRef.current = removeTab;
    tabIdRef.current = tabId;
  }, [removeTab, tabId]);

  // Handle window resize to keep modal responsive
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      setSize(prevSize => {
        let newWidth, newHeight;
        
        if (fixedGifRatio && isGifModal) {
          newWidth = Math.min(600, vw - 32);
          newHeight = Math.min(500, vh - 64);
        } else if (isPdfModal || isDocxModal || isPngModal) {
          newWidth = Math.min(900, vw - 32);
          newHeight = Math.min(700, vh - 64);
        } else {
          newWidth = Math.min(896, vw - 32);
          newHeight = Math.min(504, vh - 64);
        }
        
        return {
          width: Math.max(320, Math.min(newWidth, prevSize.width)),
          height: Math.max(240, Math.min(newHeight, prevSize.height))
        };
      });
      
      // Reset position if modal is outside viewport
      setPosition(prevPos => ({
        x: Math.max(-50, Math.min(prevPos.x, vw - 100)),
        y: Math.max(-50, Math.min(prevPos.y, vh - 100))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fixedGifRatio, isGifModal, isPdfModal, isDocxModal, isPngModal]);

  // Clean up tab when component unmounts
  useEffect(() => {
    return () => {
      // Use refs to avoid stale closures
      removeTabRef.current(tabIdRef.current);
    };
  }, []); // Empty dependency array - only runs on unmount
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
    <div className={`fixed inset-0 ${isMaximized ? '' : 'flex items-center justify-center p-2 sm:p-4'} ${isMinimized ? 'z-30 pointer-events-none' : 'z-50'}`}>
      {/* Backdrop */}
      {!isMinimized && !isMaximized && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={() => {
            if (!isDragging) {
              handleMinimize();
            }
          }}
        />
      )}
      
      {/* Terminal Modal */}
      <div 
        className={`terminal-modal relative my-auto bg-card border-2 border-primary/30 rounded-lg shadow-2xl overflow-hidden flex flex-col ${isMinimized ? 'transition-all duration-300 scale-0 opacity-0 translate-y-96 translate-x-96' : isDragging || isResizing ? '' : 'transition-all duration-300 scale-100 opacity-100 translate-x-0 translate-y-0'} ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
        style={{
          transform: !isMinimized ? `translate(${position.x}px, ${position.y}px)` : undefined,
          width: `${size.width}px`,
          height: `${size.height}px`
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 border-b border-border select-none">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleClose}
              className="terminal-control-btn w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              title="Close"
            />
            <button
              onClick={handleMinimize}
              className="terminal-control-btn w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
              title="Minimize"
            />
            <button
              className="terminal-control-btn w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-default"
              title="Maximize (disabled)"
            />
          </div>
          <div 
            className="text-xs sm:text-sm font-mono text-muted-foreground cursor-grab active:cursor-grabbing truncate flex-1 mx-2 text-center"
            onMouseDown={handleMouseDown}
          >
            <span className="hidden xs:inline">[user@nada ~]$ cat </span>{title}<span className="hidden xs:inline">.txt</span>
          </div>
          <div className="w-[60px] sm:w-[80px]"></div>
        </div>
        
        {/* Terminal Content */}
        <div className={`${(isGifModal && fixedGifRatio) || isPdfModal || isDocxModal || isPngModal ? 'p-2 sm:p-4' : 'p-3 sm:p-6'} bg-background/95 font-mono text-xs sm:text-sm leading-relaxed ${(isGifModal && fixedGifRatio) || isPdfModal || isDocxModal ? 'overflow-hidden' : 'overflow-auto'} flex-1 flex flex-col`}>
          <div className="text-primary mb-2">
            $ cat {title}{isGifModal ? '.gif' : isPdfModal ? '.pdf' : isDocxModal ? (docxLoadFailed ? '.pdf' : '.docx') : isPngModal ? (pngLoadFailed ? '.pdf' : '.png') : '.txt'}
          </div>
          {isGifModal && gifSrc ? (
            <div className="flex-1 flex items-center justify-center min-h-0">
              <img 
                src={gifSrc} 
                alt={title}
                className={`${fixedGifRatio ? 'max-w-full max-h-full object-contain' : 'w-full h-auto'}`}
              />
            </div>
          ) : isPdfModal && pdfSrc ? (
            <div className="flex-1 flex items-center justify-center">
              <iframe
                src={pdfSrc}
                className="w-full h-full border border-border rounded"
                title={title}
              />
            </div>
          ) : isDocxModal && docxSrc ? (
            <div className="flex-1 flex items-center justify-center">
              {docxLoadFailed ? (
                <iframe
                  src={pdfSrc || docxSrc.replace('.docx', '.pdf')}
                  className="w-full h-full border border-border rounded"
                  title={title}
                />
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + docxSrc)}`}
                  className="w-full h-full border border-border rounded"
                  title={title}
                  onError={() => setDocxLoadFailed(true)}
                  onLoad={(e) => {
                    // Check if iframe loaded properly by checking if it's accessible
                    try {
                      const iframe = e.target as HTMLIFrameElement;
                      // If we can't access contentWindow, it might be blocked by CORS
                      if (!iframe.contentWindow) {
                        setDocxLoadFailed(true);
                      }
                    } catch (error) {
                      // Fallback to PDF if there's any error
                      setTimeout(() => setDocxLoadFailed(true), 3000);
                    }
                  }}
                />
              )}
            </div>
          ) : isPngModal && pngSrc ? (
            <div className="flex-1 flex justify-center overflow-auto">
              {pngLoadFailed ? (
                <iframe
                  src={pdfSrc || pngSrc.replace('.png', '.pdf')}
                  className="w-full h-full border border-border rounded"
                  title={title}
                />
              ) : (
                <img
                  src={pngSrc}
                  alt={title}
                  className="max-w-full h-auto"
                  onError={() => setPngLoadFailed(true)}
                />
              )}
            </div>
          ) : isContactModal ? (
            <div className="text-foreground space-y-4">
              <div>Let's connect! </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <a href="mailto:nadaibrhm96@gmail.com" className="hover:text-primary hover:underline">
                    nadaibrhm96@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin size={16} className="text-primary flex-shrink-0" />
                  <a href="https://linkedin.com/in/nadaibrahim96" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                    linkedin.com/in/nadaibrahim96
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Github size={16} className="text-primary flex-shrink-0" />
                  <a href="https://github.com/nxdx96" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                    github.com/nxdx96
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <a href="tel:2016268719" className="hover:text-primary hover:underline">
                    201-626-8719
                  </a>
                </div>
              </div>
              
              <div>I'm currently based in the New York City Metropolitan Area and open to remote opportunities!</div>
              
              <div>Feel free to reach out through any of the channels above. I typically respond within 24 hours.</div>
              
              <div>Looking forward to connecting!</div>
            </div>
          ) : (
            <div className="text-foreground whitespace-pre-wrap">
              {content}
            </div>
          )}
          {isGifModal && fixedGifRatio ? (
            <div className="text-primary mt-2 text-center">
              this is my cat playground
            </div>
          ) : !(isPdfModal || isDocxModal || isPngModal) && (
            <div className="text-primary mt-4">
              $ <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
        
        {/* Resize Handle */}
        {!(isGifModal && fixedGifRatio) && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
            onMouseDown={handleResizeMouseDown}
            title="Resize window"
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50"></div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default TerminalModal;