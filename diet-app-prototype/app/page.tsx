'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DailyLesson } from '@/components/features/daily-lesson';
import { AICoach } from '@/components/features/ai-coach';
import { NutritionChart } from '@/components/features/nutrition-chart';
import { Plus, TrendingUp, Flame, Target } from 'lucide-react';
import Link from 'next/link';
import { 
  userStorage, 
  mealStorage, 
  progressStorage, 
  aiAdviceStorage,
  lessonStorage,
  achievementStorage 
} from '@/lib/storage';
import { 
  User, 
  MealEntry, 
  DailyProgress, 
  AIAdvice, 
  Lesson,
  NutritionInfo 
} from '@/lib/types';
import { 
  calculateTotalNutrition, 
  calculateTargetNutrition, 
  generateAIAdvice,
  mockLessons 
} from '@/lib/mock-api';
import { formatDate, getToday, getMealTypeLabel, calculateBMI } from '@/lib/utils';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<MealEntry[]>([]);
  const [todaysProgress, setTodaysProgress] = useState<DailyProgress | null>(null);
  const [currentNutrition, setCurrentNutrition] = useState<NutritionInfo>({
    calories: 0, protein: 0, carbs: 0, fat: 0,
    fiber: 0, sugar: 0, sodium: 0, cholesterol: 0
  });
  const [targetNutrition, setTargetNutrition] = useState<NutritionInfo>({
    calories: 2000, protein: 60, carbs: 250, fat: 65,
    fiber: 25, sugar: 50, sodium: 2300, cholesterol: 300
  });
  const [aiAdvice, setAiAdvice] = useState<AIAdvice[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Initialize user if not exists
    let currentUser = userStorage.getUser();
    if (!currentUser) {
      const newUser: User = {
        id: 'user_001',
        name: 'ゲストユーザー',
        email: 'guest@example.com',
        profile: {
          age: 30,
          gender: 'female',
          height: 160,
          currentWeight: 60,
          targetWeight: 55,
          activityLevel: 'moderate',
          dietGoal: 'lose'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      userStorage.setUser(newUser);
      currentUser = newUser;
    }
    setUser(currentUser);

    // Calculate target nutrition based on user profile
    const targets = calculateTargetNutrition(currentUser.profile);
    setTargetNutrition(targets);

    // Initialize lessons if not exists
    let lessons = lessonStorage.getLessons();
    if (lessons.length === 0) {
      lessonStorage.initializeLessons(mockLessons);
      lessons = mockLessons;
    }

    // Load today's data
    loadTodaysData();
    
    // Get current lesson
    const nextLesson = lessonStorage.getNextLesson();
    setCurrentLesson(nextLesson);

    // Calculate streak
    calculateStreak();
  }, []);

  const loadTodaysData = () => {
    const today = getToday();
    const meals = mealStorage.getMealsByDate(today);
    setTodaysMeals(meals);

    // Calculate total nutrition for today
    const allFoods = meals.flatMap(meal => meal.foods);
    const totalNutrition = calculateTotalNutrition(allFoods);
    setCurrentNutrition(totalNutrition);

    // Load today's progress
    const progress = progressStorage.getProgressByDate(today);
    setTodaysProgress(progress);

    // Load latest AI advice
    const advice = aiAdviceStorage.getLatestAdvice(3);
    setAiAdvice(advice);

    // Generate new advice if meals exist but no recent advice
    if (meals.length > 0 && advice.length === 0) {
      const newAdvice = generateAIAdvice(meals, user?.profile);
      aiAdviceStorage.addAdvice(newAdvice);
      setAiAdvice([newAdvice]);
    }
  };

  const calculateStreak = () => {
    const progress = progressStorage.getProgress();
    const today = new Date();
    let currentStreak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = progress.find(p => p.date === dateStr);
      if (dayProgress && dayProgress.meals.length > 0) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const handleLessonComplete = (lessonId: string) => {
    lessonStorage.markLessonComplete(lessonId);
    const nextLesson = lessonStorage.getNextLesson();
    setCurrentLesson(nextLesson);
    
    // Add achievement for completing first lesson
    const achievements = achievementStorage.getAchievements();
    if (achievements.length === 0) {
      achievementStorage.addAchievement({
        id: `achievement_${Date.now()}`,
        type: 'badge',
        name: '学習開始',
        description: '最初のレッスンを完了しました',
        icon: '📚',
        unlockedAt: new Date().toISOString()
      });
    }
  };

  const caloriePercentage = Math.round((currentNutrition.calories / targetNutrition.calories) * 100);
  const currentBMI = user ? calculateBMI(user.profile.currentWeight, user.profile.height) : 0;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">こんにちは、{user?.name}さん</h1>
        <p className="text-gray-600">{formatDate(new Date())}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今日のカロリー</p>
                <p className="text-2xl font-bold">{currentNutrition.calories}</p>
                <p className="text-xs text-gray-500">/ {targetNutrition.calories} kcal</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(caloriePercentage / 100) * 176} 176`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {caloriePercentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">継続日数</p>
                <p className="text-2xl font-bold">{streak}日</p>
                <p className="text-xs text-gray-500">連続記録中</p>
              </div>
              <Flame className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>現在の状態</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">体重</span>
              <span className="font-medium">{user?.profile.currentWeight} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">目標体重</span>
              <span className="font-medium">{user?.profile.targetWeight} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">BMI</span>
              <span className="font-medium">{currentBMI}</span>
            </div>
            <Progress 
              value={user?.profile.targetWeight || 0} 
              max={user?.profile.currentWeight || 100}
              color="green"
            />
            <p className="text-xs text-gray-500 text-center">
              目標まであと {((user?.profile.currentWeight || 0) - (user?.profile.targetWeight || 0)).toFixed(1)} kg
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Lesson */}
      <DailyLesson lesson={currentLesson} onComplete={handleLessonComplete} />

      {/* Quick Add Meal */}
      <Link href="/food-record">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">食事を記録</p>
                  <p className="text-sm text-gray-600">写真・検索・バーコードで簡単記録</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Today's Meals */}
      {todaysMeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>今日の食事</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{getMealTypeLabel(meal.mealType)}</p>
                    <p className="text-sm text-gray-600">{meal.foods.length}品目</p>
                  </div>
                  <p className="font-medium">{meal.totalNutrition.calories} kcal</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Chart */}
      <NutritionChart current={currentNutrition} target={targetNutrition} />

      {/* AI Coach */}
      <AICoach advice={aiAdvice} />
    </div>
  );
}