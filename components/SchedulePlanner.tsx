
import React, { useState } from 'react';
import { Briefcase, Smile, Coffee, Moon, X, Zap, Leaf, Plus } from 'lucide-react';
import { ClayCard, ClayButton, ClayInput } from './UIComponents';
import { ScheduleItem, Translation, Mood } from '../types';

interface Props {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  mood: Mood | undefined;
  setMood: React.Dispatch<React.SetStateAction<Mood | undefined>>;
  t: Translation;
}

const SchedulePlanner: React.FC<Props> = ({ schedule, setSchedule, mood, setMood, t }) => {
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [type, setType] = useState<ScheduleItem['type']>('work');

  const handleAdd = () => {
    if (!newTask || !newTime) return;
    const item: ScheduleItem = {
      id: crypto.randomUUID(),
      time: newTime,
      task: newTask,
      type: type
    };
    // Sort by time
    setSchedule(prev => [...prev, item].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTask('');
    setNewTime('');
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'work': return <Briefcase size={16} className="text-blue-500" />;
      case 'fun': return <Smile size={16} className="text-yellow-500" />;
      case 'meal': return <Coffee size={16} className="text-orange-500" />;
      case 'rest': return <Moon size={16} className="text-purple-500" />;
      default: return <Briefcase size={16} />;
    }
  };

  const getTypeLabel = (key: string) => {
    switch(key) {
        case 'work': return t.work;
        case 'fun': return t.fun;
        case 'meal': return t.meal;
        case 'rest': return t.rest;
        default: return '';
    }
  };

  const moods: { key: Mood, icon: string, label: string }[] = [
    { key: 'happy', icon: '😄', label: t.moodHappy },
    { key: 'energetic', icon: '⚡', label: t.moodEnergetic },
    { key: 'neutral', icon: '😐', label: t.moodNeutral },
    { key: 'relax', icon: '🍃', label: t.moodRelax },
    { key: 'tired', icon: '😫', label: t.moodTired },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-pingu-black flex items-center gap-2">
          <span className="text-3xl">📅</span> {t.dailyPlan}
        </h2>
      </div>

      {/* Mood Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">{t.todayMood}</label>
        <div className="flex justify-between">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${mood === m.key ? 'bg-pingu-bg scale-110 shadow-inner ring-2 ring-pingu-orange ring-offset-1' : 'hover:bg-gray-50 opacity-70 hover:opacity-100'}`}
              title={m.label}
            >
              <span className="text-2xl filter drop-shadow-sm">{m.icon}</span>
              <span className="text-[10px] font-bold text-gray-500">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <ClayCard>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <ClayInput 
              type="time" 
              value={newTime} 
              onChange={e => setNewTime(e.target.value)}
              className="w-1/3 font-mono" 
            />
            <ClayInput 
              placeholder={t.placeholderTask} 
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2 justify-between items-center mt-2">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              {(['work', 'fun', 'meal', 'rest'] as const).map(currType => (
                <button
                  key={currType}
                  onClick={() => setType(currType)}
                  className={`p-2 rounded-lg transition-all relative group ${type === currType ? 'bg-white shadow-sm scale-105' : 'hover:bg-gray-200'}`}
                >
                  {getTypeIcon(currType)}
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {getTypeLabel(currType)}
                  </span>
                </button>
              ))}
            </div>
            <ClayButton onClick={handleAdd} variant="primary" className="px-6 py-2 text-sm h-10">
              <Plus size={18} />
            </ClayButton>
          </div>
        </div>
      </ClayCard>

      <div className="relative border-l-2 border-gray-200 ml-4 pl-8 pb-20 space-y-6">
        {schedule.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline dot */}
            <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors
              ${item.type === 'work' ? 'bg-blue-200' : 
                item.type === 'fun' ? 'bg-yellow-200' : 
                item.type === 'meal' ? 'bg-orange-200' : 'bg-purple-200'}`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            
            {/* Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex justify-between items-start group">
              <div className="flex-1">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md mb-2 inline-block font-mono">
                  {item.time}
                </span>
                <h3 className="font-bold text-pingu-black text-lg leading-tight">{item.task}</h3>
              </div>
              <button 
                onClick={() => setSchedule(s => s.filter(i => i.id !== item.id))}
                className="opacity-0 group-hover:opacity-100 transition-all text-gray-300 hover:text-red-400 hover:bg-red-50 p-2 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
        {schedule.length === 0 && (
           <div className="text-gray-400 italic text-sm pt-4 pl-2">
             {t.noTask}
           </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePlanner;
