'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FoodSearch } from '@/components/features/food-search';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  userStorage, 
  mealStorage, 
  aiAdviceStorage,
  progressStorage 
} from '@/lib/storage';
import { FoodItem, FoodEntry, MealEntry, NutritionInfo } from '@/lib/types';
import { calculateTotalNutrition, generateAIAdvice } from '@/lib/mock-api';
import { getToday, getMealTypeLabel, generateId } from '@/lib/utils';

export default function FoodRecordPage() {
  const router = useRouter();
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<FoodEntry[]>([]);
  const [totalNutrition, setTotalNutrition] = useState<NutritionInfo>({
    calories: 0, protein: 0, carbs: 0, fat: 0,
    fiber: 0, sugar: 0, sodium: 0, cholesterol: 0
  });

  useEffect(() => {
    // Set meal type based on current time
    const hour = new Date().getHours();
    if (hour < 10) {
      setMealType('breakfast');
    } else if (hour < 14) {
      setMealType('lunch');
    } else if (hour < 20) {
      setMealType('dinner');
    } else {
      setMealType('snack');
    }
  }, []);

  useEffect(() => {
    // Recalculate total nutrition when foods change
    const total = calculateTotalNutrition(selectedFoods);
    setTotalNutrition(total);
  }, [selectedFoods]);

  const handleSelectFood = (food: FoodItem, quantity: number) => {
    setSelectedFoods([...selectedFoods, {
      foodItem: food,
      quantity,
      unit: food.serving.unit
    }]);
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleSaveMeal = async () => {
    if (selectedFoods.length === 0) return;

    const user = userStorage.getUser();
    if (!user) return;

    const meal: MealEntry = {
      id: generateId(),
      userId: user.id,
      date: getToday(),
      mealType,
      foods: selectedFoods,
      totalNutrition,
      createdAt: new Date().toISOString()
    };

    // Save meal
    mealStorage.addMeal(meal);

    // Generate AI advice
    const advice = generateAIAdvice([meal], user.profile);
    aiAdviceStorage.addAdvice(advice);

    // Update daily progress
    const today = getToday();
    const todaysMeals = mealStorage.getMealsByDate(today);
    const allFoods = todaysMeals.flatMap(m => m.foods);
    const dailyTotal = calculateTotalNutrition(allFoods);

    progressStorage.saveProgress({
      date: today,
      userId: user.id,
      meals: todaysMeals,
      totalNutrition: dailyTotal,
      targetNutrition: totalNutrition, // This should be calculated based on user profile
      achievements: []
    });

    // Navigate back to home
    router.push('/');
  };

  const mealTypes = [
    { value: 'breakfast' as const, label: '朝食', icon: '🌅' },
    { value: 'lunch' as const, label: '昼食', icon: '☀️' },
    { value: 'dinner' as const, label: '夕食', icon: '🌙' },
    { value: 'snack' as const, label: '間食', icon: '🍿' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 pt-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">食事を記録</h1>
      </div>

      {/* Meal Type Selection */}
      <div>
        <h2 className="text-sm font-medium mb-3">食事タイプ</h2>
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setMealType(type.value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                mealType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Food Search */}
      <FoodSearch onSelectFood={handleSelectFood} />

      {/* Selected Foods */}
      {selectedFoods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>選択した食品</CardTitle>
            <CardDescription>
              合計: {totalNutrition.calories} kcal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedFoods.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{entry.foodItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {entry.quantity}{entry.unit} • {
                        Math.round((entry.quantity / entry.foodItem.serving.size) * entry.foodItem.nutrition.calories)
                      } kcal
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFood(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    削除
                  </Button>
                </div>
              ))}
            </div>

            {/* Nutrition Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-3">栄養素内訳</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">タンパク質</span>
                  <span className="font-medium">{totalNutrition.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">炭水化物</span>
                  <span className="font-medium">{totalNutrition.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">脂質</span>
                  <span className="font-medium">{totalNutrition.fat}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">食物繊維</span>
                  <span className="font-medium">{totalNutrition.fiber}g</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSaveMeal} 
              className="w-full mt-6"
              size="lg"
            >
              <Check className="w-4 h-4 mr-2" />
              記録を保存
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}