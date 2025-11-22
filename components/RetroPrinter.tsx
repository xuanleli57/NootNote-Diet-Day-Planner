
import React, { useState, useRef, useEffect } from 'react';
import { Printer as PrinterIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { FoodItem, ScheduleItem, Translation, UserProfile, Mood } from '../types';
import { generateMotivationalQuote } from '../services/geminiService';
import StickyNote from './StickyNote';

interface Props {
  foods: FoodItem[];
  schedule: ScheduleItem[];
  onSave: (quote: string) => void;
  t: Translation;
  language: 'en' | 'zh';
  user: UserProfile;
  mood?: Mood;
}

const RetroPrinter: React.FC<Props> = ({ foods, schedule, onSave, t, language, user, mood }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const [quote, setQuote] = useState("Noot Noot!");
  
  // Draggable State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const dateStr = new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const handlePrint = async () => {
    setIsPrinting(true);
    // Reset position when printing new
    setPosition({ x: 0, y: 0 }); 
    
    const newQuote = await generateMotivationalQuote(language);
    setQuote(newQuote);
    
    // Simulate printing time
    setTimeout(() => {
      setIsPrinting(false);
      setHasPrinted(true);
      onSave(newQuote);
      
      // Auto scroll to the note
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 2000);
  };

  // Mouse Down for Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current) {
      // Get initial mouse position relative to the element
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsDragging(true);
    }
  };

  // Global Mouse Move/Up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
         // We are using fixed positioning for the dragged element
         // But to make it feel "in the app", we should probably keep it absolute? 
         // However, simple Fixed drag is easiest to implement without boundaries issues in this small window.
         // Let's stick to translate transform for better performance.
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    // Native drag implementation often fights with React state for smooth simple moves.
    // Let's use simple DOM manipulation for the drag visual if we want it "sticky".
    // But for this scope, simple state update is fine.
    
    if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  // Specialized Drag handler for the relative container
  const handleDragMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      // For simplicity in this constrained view, let's just allow translation via transform
      const parent = containerRef.current?.getBoundingClientRect();
      if (!parent) return;

      const newX = e.clientX - parent.left - offsetRef.current.x;
      const newY = e.clientY - parent.top - offsetRef.current.y;
      
      setPosition({ x: newX, y: newY });
  };


  return (
    <div 
        className="flex flex-col items-center pt-4 pb-32 animate-in fade-in duration-700 min-h-full relative" 
        ref={containerRef}
        onMouseMove={handleDragMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
    >
      
      {/* Printer Body - Cute Version */}
      <div className="relative w-full max-w-[320px] z-20 mb-8">
        {/* Paper Feed */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gray-200 rounded-t-xl border-2 border-gray-300 z-0"></div>
        
        {/* Main Chassis */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-clay relative z-10 border-4 border-white">
          {/* Screen Area */}
          <div className="bg-gray-800 rounded-2xl p-4 mb-6 shadow-inner border-b-4 border-gray-700 flex items-center justify-center h-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              {isPrinting ? (
                  <div className="text-pingu-orange font-mono animate-pulse text-sm">PRINTING...</div>
              ) : (
                  <div className="flex gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
              )}
          </div>

          {/* Slot */}
          <div className="bg-gray-200 h-3 rounded-full w-3/4 mx-auto mb-6 shadow-inner relative">
             {isPrinting && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[20px] bg-[#fff7cd] animate-print-paper z-[-1]"></div>
             )}
          </div>

          {/* Big Button */}
          <div className="flex justify-center">
             <button 
                onClick={handlePrint} 
                disabled={isPrinting}
                className={`w-20 h-20 rounded-full shadow-lg border-4 border-white flex items-center justify-center transition-all active:scale-90
                  ${hasPrinted ? 'bg-green-400 hover:bg-green-500' : 'bg-pingu-orange hover:bg-orange-500'}
                  ${isPrinting ? 'cursor-wait opacity-80' : ''}
                `}
             >
                 {isPrinting ? <RefreshCw className="animate-spin text-white" /> : <PrinterIcon className="text-white w-8 h-8" />}
             </button>
          </div>
        </div>
        
        {/* Legs */}
        <div className="flex justify-between px-8 -mt-4 relative z-0">
            <div className="w-4 h-8 bg-gray-300 rounded-b-lg"></div>
            <div className="w-4 h-8 bg-gray-300 rounded-b-lg"></div>
        </div>
      </div>

      {/* The Printed Note - Appears Below */}
      {hasPrinted && (
        <div 
            className="relative z-30 animate-in slide-in-from-top-10 fade-in duration-1000"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
        >
           <div ref={dragRef} onMouseDown={handleMouseDown}>
              <StickyNote 
                  dateStr={dateStr}
                  quote={quote}
                  user={user}
                  foods={foods}
                  schedule={schedule}
                  t={t}
                  mood={mood?.toString()}
                  isDraggable={true}
                  className="hover:scale-[1.02] hover:shadow-xl"
              />
           </div>
           
           <div className="text-center mt-4">
               <p className="text-xs text-gray-400 bg-white/50 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                   {t.dragHint}
               </p>
           </div>
        </div>
      )}

      {hasPrinted && (
        <div className="mt-8 mb-8 flex flex-col gap-2 items-center animate-in fade-in delay-500">
             <p className="text-sm font-bold text-pingu-black">{t.saveToFolder}</p>
             <button 
                onClick={() => { setHasPrinted(false); setIsPrinting(false); }}
                className="text-pingu-orange text-sm font-bold hover:underline"
             >
                 {t.printAnother}
             </button>
        </div>
      )}
    </div>
  );
};

export default RetroPrinter;
