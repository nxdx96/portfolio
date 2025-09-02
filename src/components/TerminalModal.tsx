import { useEffect, useState } from "react";
import { X, Terminal, Mail, Linkedin, Github, Phone } from "lucide-react";

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMinimizeTab, setShowMinimizeTab] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [docxLoadFailed, setDocxLoadFailed] = useState(false);
  const [pngLoadFailed, setPngLoadFailed] = useState(false);
  const [size, setSize] = useState(() => {
    if (fixedGifRatio && isGifModal) {
      // Set modal size to accommodate GIF + command + text
      return { width: 600, height: 500 };
    }
    if (isPdfModal || isDocxModal || isPngModal) {
      // Set modal size optimized for document viewing
      return { width: 900, height: 700 };
    }
    return { width: 896, height: 504 }; // Default max-w-4xl equivalent and 70vh at 720px height
  });

  const handleMinimize = () => {
    setIsMinimized(true);
    // Show the minimized tab after animation
    setTimeout(() => setShowMinimizeTab(true), 300);
  };

  const handleRestore = () => {
    setShowMinimizeTab(false);
    setIsMinimized(false);
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
    <div className={`fixed inset-0 ${isMaximized ? '' : 'flex items-center justify-center p-4'} ${isMinimized ? 'z-30 pointer-events-none' : 'z-50'}`}>
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
        <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border select-none">
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
              title="Maximize (disabled)"
            />
          </div>
          <div 
            className="text-sm font-mono text-muted-foreground cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            [user@nada ~]$ cat {title}.txt
          </div>
          <div></div>
        </div>
        
        {/* Terminal Content */}
        <div className={`${(isGifModal && fixedGifRatio) || isPdfModal || isDocxModal || isPngModal ? 'p-4' : 'p-6'} bg-background/95 font-mono text-sm leading-relaxed ${(isGifModal && fixedGifRatio) || isPdfModal || isDocxModal ? 'overflow-hidden' : 'overflow-auto'} flex-1 flex flex-col`}>
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