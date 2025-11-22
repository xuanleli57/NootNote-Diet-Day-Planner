
import React, { useState } from 'react';
import { FolderOpen, Calendar, Eye, Trash2, CheckSquare, XSquare, Check, AlertTriangle } from 'lucide-react';
import { DailyLog, Translation, UserProfile } from '../types';
import StickyNote from './StickyNote';

interface Props {
  history: DailyLog[];
  setHistory: React.Dispatch<React.SetStateAction<DailyLog[]>>;
  t: Translation;
  user: UserProfile;
  language: 'en' | 'zh';
  onClearData: () => void;
}

const HistoryFolder: React.FC<Props> = ({ history, setHistory, t, user, language, onClearData }) => {
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleCardClick = (log: DailyLog) => {
    if (isSelectionMode) {
       // In selection mode, clicking the card toggles selection
       const next = new Set(selectedIds);
       if (next.has(log.id)) next.delete(log.id);
       else next.add(log.id);
       setSelectedIds(next);
       // Reset confirm state if selection changes
       setIsConfirmingDelete(false);
    } else {
       // Normal mode, open details
       setSelectedLog(log);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    
    const updated = history.filter(h => !selectedIds.has(h.id));
    setHistory(updated);
    localStorage.setItem('nootnote-history', JSON.stringify(updated));
    
    // Clear workspace as requested
    onClearData();
    
    // Reset selection
    setSelectedIds(new Set());
    setIsSelectionMode(false);
    setIsConfirmingDelete(false);
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedIds(new Set());
      setIsConfirmingDelete(false);
    } else {
      setIsSelectionMode(true);
    }
  };

  const formatDate = (iso: string) => {
      return new Date(iso).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
  };
  
  const getFullDate = (iso: string) => {
      return new Date(iso).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="relative min-h-full">
      {/* Inner content wrapper for animation to avoid stacking context issues on root */}
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-pingu-black flex items-center gap-2">
            <span className="text-3xl">📂</span> {t.archives}
          </h2>
          {history.length > 0 && (
            <button 
              onClick={toggleSelectionMode}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                isSelectionMode 
                  ? 'bg-pingu-orange text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {isSelectionMode ? <XSquare size={14} /> : <CheckSquare size={14} />}
              {isSelectionMode ? t.cancel : t.select}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <FolderOpen size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold">{t.noFood}</p>
            <p className="text-xs text-gray-400">{t.print}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 pb-24">
            {history.slice().reverse().map((log, idx) => {
              const isSelected = selectedIds.has(log.id);
              return (
              <div 
                key={log.id} 
                onClick={() => handleCardClick(log)}
                className={`
                  bg-[#fff7cd] p-3 rounded-sm shadow-sm transition-all transform relative group border-t-[12px] border-white/10 cursor-pointer
                  ${isSelectionMode ? (isSelected ? 'ring-4 ring-pingu-orange scale-95' : 'opacity-80 hover:opacity-100') : 'hover:-translate-y-2 hover:scale-105 hover:z-50 hover:shadow-2xl'}
                `}
                style={{ transform: !isSelectionMode ? `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})` : 'none' }}
              >
                {/* Tape (Only visible if not selected to reduce noise) */}
                {!isSelected && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-6 bg-gray-400/20 backdrop-blur-sm rotate-1 shadow-sm pointer-events-none"></div>
                )}
                
                {/* Selection Checkbox Overlay */}
                {isSelectionMode && (
                  <div className="absolute -top-3 -right-3 z-20">
                      <div className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-colors ${isSelected ? 'bg-pingu-orange' : 'bg-gray-200'}`}>
                          {isSelected && <Check size={14} className="text-white" />}
                      </div>
                  </div>
                )}

                <div className="flex justify-between items-start mb-2 relative">
                  <div className="flex items-center gap-1 opacity-70">
                      <Calendar size={12} />
                      <span className="text-xs font-bold">{formatDate(log.date)}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-2 pointer-events-none">
                  <div className="bg-white/60 p-1.5 rounded text-center">
                    <span className="block text-[10px] text-gray-500 uppercase">{t.total}</span>
                    <span className="font-black text-sm text-gray-700">{log.totalCalories}</span>
                  </div>
                  <div className="bg-white/60 p-1.5 rounded text-center flex justify-center gap-2">
                    <span className="text-lg leading-none">
                        {log.mood === 'happy' ? '😄' : log.mood === 'tired' ? '😫' : log.mood === 'energetic' ? '⚡' : '😐'}
                    </span>
                  </div>
                </div>
                
                {!isSelectionMode && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Eye size={14} className="text-gray-400" />
                  </div>
                )}
                
                <div className="text-[10px] text-center text-gray-400 mt-2 border-t border-gray-300/50 pt-1 pointer-events-none">
                    {isSelectionMode ? (isSelected ? 'Selected' : 'Tap to select') : t.clickToView}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Floating Action Button for Delete */}
      {isSelectionMode && selectedIds.size > 0 && (
         <div className="fixed bottom-28 right-6 z-[100] animate-in slide-in-from-bottom-4">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
                  <button 
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-bold text-xs hover:bg-gray-200"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    onClick={handleBatchDelete}
                    className="px-4 py-2 bg-pingu-red text-white rounded-full font-bold text-xs hover:bg-red-600 shadow-md flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    {t.delete}
                  </button>
              </div>
            ) : (
              <button 
                 onClick={() => setIsConfirmingDelete(true)}
                 className="w-14 h-14 bg-pingu-red text-white rounded-full shadow-xl border-4 border-white flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all group"
              >
                 <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                 <div className="absolute -top-2 -right-2 bg-pingu-black text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                    {selectedIds.size}
                 </div>
              </button>
            )}
         </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
             <div className="animate-in zoom-in-90 duration-200 max-w-full max-h-full overflow-y-auto">
                 <StickyNote 
                    dateStr={getFullDate(selectedLog.date)}
                    quote={selectedLog.quote || "No quote"}
                    user={user}
                    foods={selectedLog.foods}
                    schedule={selectedLog.schedule}
                    t={t}
                    mood={selectedLog.mood?.toString()}
                    onClose={() => setSelectedLog(null)}
                    className="scale-110 origin-center"
                 />
             </div>
             {/* Click outside to close */}
             <div className="absolute inset-0 -z-10" onClick={() => setSelectedLog(null)}></div>
        </div>
      )}
    </div>
  );
};

export default HistoryFolder;
