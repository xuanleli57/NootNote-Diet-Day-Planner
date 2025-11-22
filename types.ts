
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  weight: number; // in grams
  calPer100g: number;
  protein?: string;
  icon?: string; // Emoji or simple icon identifier
}

export interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  type: 'work' | 'fun' | 'meal' | 'rest';
}

export type Mood = 'happy' | 'neutral' | 'tired' | 'energetic' | 'relax';

export interface DailyLog {
  id: string;
  date: string;
  totalCalories: number;
  foods: FoodItem[];
  schedule: ScheduleItem[];
  mood?: Mood;
  quote?: string;
}

export type TabView = 'calculator' | 'schedule' | 'printer' | 'history';

export type Theme = 'classic' | 'ocean' | 'sakura' | 'forest' | 'lavender' | 'coffee';
export type Language = 'en' | 'zh';

export interface UserProfile {
  name: string;
  avatar: string | null; // Base64 string
}

export interface Translation {
  dietTracker: string;
  dailyPlan: string;
  archives: string;
  print: string;
  settings: string;
  total: string;
  add: string;
  analyze: string;
  noFood: string;
  noTask: string;
  placeholderFood: string;
  placeholderWeight: string;
  placeholderTask: string;
  saveToFolder: string;
  printAnother: string;
  fuel: string;
  plan: string;
  generatedBy: string;
  settingsTitle: string;
  username: string;
  avatar: string;
  theme: string;
  language: string;
  save: string;
  dragHint: string;
  files: string;
  loading: string;
  // New
  foodName: string;
  weightAmt: string;
  delete: string;
  confirmDelete: string;
  viewDetails: string;
  mood: string;
  moodHappy: string;
  moodNeutral: string;
  moodTired: string;
  moodEnergetic: string;
  moodRelax: string;
  work: string;
  fun: string;
  meal: string;
  rest: string;
  todayMood: string;
  clickToView: string;
  // Selection Mode
  select: string;
  cancel: string;
  deleteSelected: string;
  itemsSelected: string;
}
