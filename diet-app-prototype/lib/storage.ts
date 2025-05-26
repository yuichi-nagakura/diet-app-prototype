import { User, MealEntry, DailyProgress, Achievement, AIAdvice, Lesson } from './types';

const STORAGE_KEYS = {
  USER: 'diet_app_user',
  MEALS: 'diet_app_meals',
  PROGRESS: 'diet_app_progress',
  ACHIEVEMENTS: 'diet_app_achievements',
  AI_ADVICE: 'diet_app_ai_advice',
  LESSONS: 'diet_app_lessons',
  SETTINGS: 'diet_app_settings',
} as const;

export class LocalStorageManager {
  static getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }

  static setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  }

  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// User Management
export const userStorage = {
  getUser: (): User | null => {
    return LocalStorageManager.getItem<User>(STORAGE_KEYS.USER);
  },
  
  setUser: (user: User): void => {
    LocalStorageManager.setItem(STORAGE_KEYS.USER, user);
  },
  
  updateUser: (updates: Partial<User>): void => {
    const currentUser = userStorage.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
      userStorage.setUser(updatedUser);
    }
  },
  
  clearUser: (): void => {
    LocalStorageManager.removeItem(STORAGE_KEYS.USER);
  }
};

// Meal Management
export const mealStorage = {
  getMeals: (): MealEntry[] => {
    return LocalStorageManager.getItem<MealEntry[]>(STORAGE_KEYS.MEALS) || [];
  },
  
  getMealsByDate: (date: string): MealEntry[] => {
    const meals = mealStorage.getMeals();
    return meals.filter(meal => meal.date === date);
  },
  
  addMeal: (meal: MealEntry): void => {
    const meals = mealStorage.getMeals();
    meals.push(meal);
    LocalStorageManager.setItem(STORAGE_KEYS.MEALS, meals);
  },
  
  updateMeal: (mealId: string, updates: Partial<MealEntry>): void => {
    const meals = mealStorage.getMeals();
    const index = meals.findIndex(m => m.id === mealId);
    if (index !== -1) {
      meals[index] = { ...meals[index], ...updates };
      LocalStorageManager.setItem(STORAGE_KEYS.MEALS, meals);
    }
  },
  
  deleteMeal: (mealId: string): void => {
    const meals = mealStorage.getMeals();
    const filtered = meals.filter(m => m.id !== mealId);
    LocalStorageManager.setItem(STORAGE_KEYS.MEALS, filtered);
  }
};

// Progress Management
export const progressStorage = {
  getProgress: (): DailyProgress[] => {
    return LocalStorageManager.getItem<DailyProgress[]>(STORAGE_KEYS.PROGRESS) || [];
  },
  
  getProgressByDate: (date: string): DailyProgress | null => {
    const progressList = progressStorage.getProgress();
    return progressList.find(p => p.date === date) || null;
  },
  
  saveProgress: (progress: DailyProgress): void => {
    const progressList = progressStorage.getProgress();
    const index = progressList.findIndex(p => p.date === progress.date);
    
    if (index !== -1) {
      progressList[index] = progress;
    } else {
      progressList.push(progress);
    }
    
    LocalStorageManager.setItem(STORAGE_KEYS.PROGRESS, progressList);
  },
  
  getWeeklyProgress: (endDate: Date): DailyProgress[] => {
    const progressList = progressStorage.getProgress();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    
    return progressList.filter(p => {
      const date = new Date(p.date);
      return date >= startDate && date <= endDate;
    });
  }
};

// Achievement Management
export const achievementStorage = {
  getAchievements: (): Achievement[] => {
    return LocalStorageManager.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS) || [];
  },
  
  addAchievement: (achievement: Achievement): void => {
    const achievements = achievementStorage.getAchievements();
    achievements.push(achievement);
    LocalStorageManager.setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  
  updateAchievement: (achievementId: string, updates: Partial<Achievement>): void => {
    const achievements = achievementStorage.getAchievements();
    const index = achievements.findIndex(a => a.id === achievementId);
    if (index !== -1) {
      achievements[index] = { ...achievements[index], ...updates };
      LocalStorageManager.setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    }
  }
};

// AI Advice Management
export const aiAdviceStorage = {
  getAdvice: (): AIAdvice[] => {
    return LocalStorageManager.getItem<AIAdvice[]>(STORAGE_KEYS.AI_ADVICE) || [];
  },
  
  getAdviceByDate: (date: string): AIAdvice[] => {
    const advice = aiAdviceStorage.getAdvice();
    return advice.filter(a => a.date === date);
  },
  
  addAdvice: (advice: AIAdvice): void => {
    const adviceList = aiAdviceStorage.getAdvice();
    adviceList.push(advice);
    LocalStorageManager.setItem(STORAGE_KEYS.AI_ADVICE, adviceList);
  },
  
  getLatestAdvice: (limit: number = 5): AIAdvice[] => {
    const advice = aiAdviceStorage.getAdvice();
    return advice
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
};

// Lesson Management
export const lessonStorage = {
  getLessons: (): Lesson[] => {
    return LocalStorageManager.getItem<Lesson[]>(STORAGE_KEYS.LESSONS) || [];
  },
  
  markLessonComplete: (lessonId: string): void => {
    const lessons = lessonStorage.getLessons();
    const index = lessons.findIndex(l => l.id === lessonId);
    if (index !== -1) {
      lessons[index].completed = true;
      lessons[index].completedAt = new Date().toISOString();
      LocalStorageManager.setItem(STORAGE_KEYS.LESSONS, lessons);
    }
  },
  
  getNextLesson: (): Lesson | null => {
    const lessons = lessonStorage.getLessons();
    return lessons.find(l => !l.completed) || null;
  },
  
  initializeLessons: (lessons: Lesson[]): void => {
    LocalStorageManager.setItem(STORAGE_KEYS.LESSONS, lessons);
  }
};