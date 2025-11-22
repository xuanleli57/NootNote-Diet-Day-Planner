
import React from 'react';
import { Move, X } from 'lucide-react';
import { FoodItem, ScheduleItem, UserProfile, Translation } from '../types';

interface StickyNoteProps {
  dateStr: string;
  quote: string;
  user: UserProfile;
  foods: FoodItem[];
  schedule: ScheduleItem[];
  t: Translation;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  isDraggable?: boolean;
  dragHandleProps?: any; // For passing down onMouseDown
  mood?: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({
  dateStr,
  quote,
  user,
  foods,
  schedule,
  t,
  onClose,
  className = '',
  style,
  isDraggable = false,
  dragHandleProps,
  mood
}) => {
  const totalCalories = foods.reduce((a, b) => a + b.calories, 0);

  const getMoodEmoji = (m?: string) => {
    switch(m) {
      case 'happy': return '😄';
      case 'neutral': return '😐';
      case 'tired': return '😫';
      case 'energetic': return '⚡';
      case 'relax': return '🍃';
      default: return '';
    }
  };

  return (
    <div 
      className={`w-[280px] shadow-2xl transition-transform ${className}`}
      style={style}
      {...dragHandleProps}
    >
      <div className={`bg-[#fff7cd] p-6 text-gray-800 font-mono text-sm relative border-b-4 border-[#e6deac] ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        {/* Sticky Tape Look */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 backdrop-blur-sm rotate-1 z-10"></div>

        {/* Header Icons */}
        <div className="absolute top-2 right-2 flex gap-2 text-gray-400 z-10">
           {isDraggable && <Move size={14} />}
           {onClose && (
             <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="hover:text-red-500">
               <X size={16} />
             </button>
           )}
        </div>

        {/* Date & Quote */}
        <div className="text-center border-b-2 border-gray-800/10 pb-2 mb-4 pt-2">
          <h2 className="font-bold text-xl uppercase tracking-tighter leading-tight mb-1">{dateStr}</h2>
          {mood && <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>}
          <p className="text-[10px] text-gray-500 italic px-2 leading-relaxed">"{quote}"</p>
        </div>

        {/* Content Scrollable Area */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
          {/* User Info */}
          <div className="flex items-center gap-2 justify-center border-b border-gray-800/5 pb-2">
            {user.avatar ? (
              <img src={user.avatar} className="w-6 h-6 rounded-full object-cover border border-gray-300" alt="avatar" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">?</div>
            )}
            <span className="font-bold text-xs tracking-wide">{user.name}</span>
          </div>

          {/* Diet Section */}
          <div>
            <h3 className="font-bold uppercase text-xs text-gray-400 mb-1 flex items-center gap-1">
              <span>🍲</span> {t.fuel}
            </h3>
            {foods.length === 0 ? <p className="text-xs italic text-gray-400 ml-4">{t.noFood}</p> : (
              <ul className="space-y-1 ml-1">
                {foods.map(f => (
                  <li key={f.id} className="flex justify-between text-xs border-b border-dotted border-gray-300 pb-1 last:border-0">
                    <span className="truncate max-w-[140px]">{f.name} <span className="text-gray-400 text-[10px]">({f.weight}g)</span></span>
                    <span className="font-bold text-gray-600">{f.calories}</span>
                  </li>
                ))}
                <li className="border-t-2 border-gray-800/10 pt-1 flex justify-between font-black mt-1 text-xs">
                  <span>{t.total}</span>
                  <span>{totalCalories} kcal</span>
                </li>
              </ul>
            )}
          </div>

          {/* Schedule Section */}
          <div>
            <h3 className="font-bold uppercase text-xs text-gray-400 mb-1 flex items-center gap-1">
              <span>📅</span> {t.plan}
            </h3>
              {schedule.length === 0 ? <p className="text-xs italic text-gray-400 ml-4">{t.noTask}</p> : (
              <ul className="space-y-2 ml-1">
                {schedule.map(s => (
                  <li key={s.id} className="flex gap-2 text-xs items-start">
                    <span className="font-bold bg-gray-800 text-[#fff7cd] px-1.5 rounded text-[10px] min-w-[40px] text-center">{s.time}</span>
                    <span className="leading-tight">{s.task}</span>
                  </li>
                ))}
              </ul>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="text-[9px] text-gray-400 tracking-widest uppercase opacity-50">{t.generatedBy}</span>
        </div>
      </div>
    </div>
  );
};

export default StickyNote;
