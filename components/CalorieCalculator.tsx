
import React, { useState } from 'react';
import { Plus, Sparkles, Trash2, Utensils, Edit2, Check } from 'lucide-react';
import { ClayCard, ClayButton, ClayInput } from './UIComponents';
import { FoodItem, Translation } from '../types';
import { analyzeFoodInput } from '../services/geminiService';

interface Props {
  foods: FoodItem[];
  setFoods: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  t: Translation;
}

const CalorieCalculator: React.FC<Props> = ({ foods, setFoods, t }) => {
  const [foodName, setFoodName] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<number>(0);

  const handleAdd = async () => {
    if (!foodName.trim()) return;
    
    setIsLoading(true);
    // Construct query with explicit weight if provided
    const query = foodWeight.trim() 
      ? `${foodWeight}g ${foodName}` 
      : foodName;

    const newFoods = await analyzeFoodInput(query);
    setFoods(prev => [...prev, ...newFoods]);
    
    setFoodName('');
    setFoodWeight('');
    setIsLoading(false);
  };

  const handleRemove = (id: string) => {
    setFoods(prev => prev.filter(f => f.id !== id));
  };

  const startEdit = (food: FoodItem) => {
    setEditingId(food.id);
    setEditWeight(food.weight);
  };

  const saveEdit = (id: string, calPer100g: number) => {
    setFoods(prev => prev.map(f => {
      if (f.id === id) {
        const newCalories = Math.round((editWeight / 100) * calPer100g);
        return { ...f, weight: editWeight, calories: newCalories };
      }
      return f;
    }));
    setEditingId(null);
  };

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-pingu-black flex items-center gap-2">
          <span className="text-3xl">🍲</span> {t.dietTracker}
        </h2>
        <div className="bg-pingu-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t.total}</span>
          <span className="ml-2 text-xl font-black text-pingu-orange">{totalCalories} kcal</span>
        </div>
      </div>

      <ClayCard className="relative overflow-hidden">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
             <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 ml-2 mb-1 block">{t.foodName}</label>
                <ClayInput 
                  placeholder={t.placeholderFood} 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  disabled={isLoading}
                />
             </div>
             <div className="w-24">
                <label className="text-xs font-bold text-gray-400 ml-2 mb-1 block">{t.weightAmt}</label>
                <div className="relative">
                  <ClayInput 
                    type="number"
                    placeholder="0" 
                    value={foodWeight}
                    onChange={(e) => setFoodWeight(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    disabled={isLoading}
                    className="pr-6"
                  />
                  <span className="absolute right-3 top-3.5 text-gray-400 text-sm font-bold">g</span>
                </div>
             </div>
          </div>
          <ClayButton onClick={handleAdd} variant="secondary" className="w-full flex items-center justify-center gap-2">
             {isLoading ? (
               <>
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 {t.loading}
               </>
             ) : (
               <>
                 <Plus size={20} /> {t.add}
               </>
             )}
          </ClayButton>
        </div>
        <p className="text-xs text-gray-400 mt-3 ml-1 flex items-center gap-1 justify-center opacity-60">
          <Sparkles size={12} /> {t.analyze}
        </p>
      </ClayCard>

      <div className="space-y-3 pb-20">
        {foods.length === 0 ? (
          <div className="text-center py-12 opacity-40">
            <Utensils size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="font-bold text-gray-400">{t.noFood}</p>
          </div>
        ) : (
          foods.map((food, idx) => (
            <div 
              key={food.id} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all transform hover:-translate-x-1 duration-200"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-2xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">{food.icon || '🍽️'}</span>
                <div className="flex-1">
                  <p className="font-bold text-pingu-black">{food.name}</p>
                  {editingId === food.id ? (
                    <div className="flex items-center gap-2 mt-1 animate-in fade-in">
                      <input 
                        type="number" 
                        value={editWeight}
                        onChange={(e) => setEditWeight(Number(e.target.value))}
                        className="w-16 bg-gray-100 rounded px-2 py-1 text-xs font-bold text-pingu-black border border-pingu-orange outline-none"
                        autoFocus
                      />
                      <span className="text-xs text-gray-400">g</span>
                      <button onClick={() => saveEdit(food.id, food.calPer100g)} className="bg-green-100 text-green-600 rounded-md p-1.5 hover:bg-green-200 transition-colors shadow-sm">
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => startEdit(food)}>
                      <p className="text-xs text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-md group-hover:bg-gray-200 transition-colors">
                        {food.weight}g
                      </p>
                      {food.protein && <span className="text-[10px] text-orange-400 font-bold border border-orange-100 px-1 rounded">{food.protein} P</span>}
                      <Edit2 size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-gray-600 min-w-[60px] text-right">{food.calories}</span>
                <button 
                  onClick={() => handleRemove(food.id)}
                  className="text-gray-300 hover:text-pingu-red hover:bg-red-50 rounded-full transition-all p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;
