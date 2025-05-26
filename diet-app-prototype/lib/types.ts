export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietGoal: 'lose' | 'maintain' | 'gain';
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  serving: {
    size: number;
    unit: string;
  };
  nutrition: NutritionInfo;
  imageUrl?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  sugar: number; // g
  sodium: number; // mg
  cholesterol: number; // mg
  vitamins?: {
    [key: string]: number;
  };
  minerals?: {
    [key: string]: number;
  };
}

export interface MealEntry {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodEntry[];
  totalNutrition: NutritionInfo;
  createdAt: string;
  imageUrl?: string;
}

export interface FoodEntry {
  foodItem: FoodItem;
  quantity: number;
  unit: string;
}

export interface DailyProgress {
  date: string;
  userId: string;
  weight?: number;
  meals: MealEntry[];
  totalNutrition: NutritionInfo;
  targetNutrition: NutritionInfo;
  steps?: number;
  waterIntake?: number; // ml
  sleep?: {
    duration: number; // minutes
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  mood?: 'stressed' | 'sad' | 'neutral' | 'happy' | 'energetic';
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  type: 'streak' | 'milestone' | 'challenge' | 'badge';
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress?: {
    current: number;
    target: number;
  };
}

export interface AIAdvice {
  id: string;
  date: string;
  type: 'meal' | 'exercise' | 'lifestyle' | 'motivation';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  actionItems?: string[];
  relatedMealId?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number; // minutes
  category: 'nutrition' | 'psychology' | 'exercise' | 'lifestyle';
  completed: boolean;
  completedAt?: string;
  order: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  progress: {
    current: number;
    target: number;
  };
  reward: string;
  status: 'upcoming' | 'active' | 'completed';
}