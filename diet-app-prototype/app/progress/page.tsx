'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react';
import { progressStorage, userStorage } from '@/lib/storage';
import { DailyProgress, User } from '@/lib/types';
import { formatDate, getDayOfWeek, calculateBMI } from '@/lib/utils';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function ProgressPage() {
  const [user, setUser] = useState<User | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [weightChange, setWeightChange] = useState(0);
  const [calorieAverage, setCalorieAverage] = useState(0);

  useEffect(() => {
    const currentUser = userStorage.getUser();
    setUser(currentUser);
    loadProgressData();
  }, [timeRange]);

  const loadProgressData = () => {
    const progress = progressStorage.getProgress();
    const today = new Date();
    
    if (timeRange === 'week') {
      // Get last 7 days
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayProgress = progress.find(p => p.date === dateStr);
        
        data.push({
          date: format(date, 'M/d'),
          day: format(date, 'E', { locale: ja }),
          calories: dayProgress?.totalNutrition.calories || 0,
          protein: dayProgress?.totalNutrition.protein || 0,
          carbs: dayProgress?.totalNutrition.carbs || 0,
          fat: dayProgress?.totalNutrition.fat || 0,
          weight: dayProgress?.weight || null
        });
      }
      setWeeklyData(data);
      
      // Calculate nutrition averages for the week
      const nutritionSummary = data.reduce((acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      setNutritionData([
        { name: 'カロリー', value: Math.round(nutritionSummary.calories / 7), unit: 'kcal' },
        { name: 'タンパク質', value: Math.round(nutritionSummary.protein / 7), unit: 'g' },
        { name: '炭水化物', value: Math.round(nutritionSummary.carbs / 7), unit: 'g' },
        { name: '脂質', value: Math.round(nutritionSummary.fat / 7), unit: 'g' }
      ]);
      
      setCalorieAverage(Math.round(nutritionSummary.calories / 7));
    } else {
      // Get last 30 days
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayProgress = progress.find(p => p.date === dateStr);
        
        if (i % 3 === 0) { // Show every 3rd day for clarity
          data.push({
            date: format(date, 'M/d'),
            calories: dayProgress?.totalNutrition.calories || 0,
            weight: dayProgress?.weight || null
          });
        }
      }
      setMonthlyData(data);
    }
    
    // Get weight data
    const weightProgress = progress
      .filter(p => p.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10)
      .map(p => ({
        date: format(new Date(p.date), 'M/d'),
        weight: p.weight
      }));
    setWeightData(weightProgress);
    
    // Calculate weight change
    if (weightProgress.length >= 2) {
      const firstWeight = weightProgress[0].weight || 0;
      const lastWeight = weightProgress[weightProgress.length - 1].weight || 0;
      setWeightChange(lastWeight - firstWeight);
    }
  };

  const handleRecordWeight = () => {
    const weight = prompt('今日の体重を入力してください (kg)');
    if (weight && !isNaN(parseFloat(weight))) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayProgress = progressStorage.getProgressByDate(today) || {
        date: today,
        userId: user?.id || '',
        meals: [],
        totalNutrition: {
          calories: 0, protein: 0, carbs: 0, fat: 0,
          fiber: 0, sugar: 0, sodium: 0, cholesterol: 0
        },
        targetNutrition: {
          calories: 2000, protein: 60, carbs: 250, fat: 65,
          fiber: 25, sugar: 50, sodium: 2300, cholesterol: 300
        },
        achievements: []
      };
      
      progressStorage.saveProgress({
        ...todayProgress,
        weight: parseFloat(weight)
      });
      
      loadProgressData();
    }
  };

  const currentWeight = user?.profile.currentWeight || 0;
  const targetWeight = user?.profile.targetWeight || 0;
  const progressPercentage = Math.round(((currentWeight - targetWeight) / (60 - targetWeight)) * 100);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">進捗管理</h1>
        <p className="text-gray-600">あなたの成長を可視化</p>
      </div>

      {/* Weight Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>体重の変化</CardTitle>
          <CardDescription>目標達成まで</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">現在の体重</p>
                <p className="text-2xl font-bold">{currentWeight} kg</p>
              </div>
              <div className="text-center">
                {weightChange !== 0 && (
                  <div className={`flex items-center space-x-1 ${weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weightChange < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    <span className="font-medium">{Math.abs(weightChange).toFixed(1)} kg</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">目標体重</p>
                <p className="text-2xl font-bold">{targetWeight} kg</p>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            
            <Button onClick={handleRecordWeight} variant="outline" className="w-full">
              今日の体重を記録
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        <Button
          variant={timeRange === 'week' ? 'default' : 'outline'}
          onClick={() => setTimeRange('week')}
          className="flex-1"
        >
          週間
        </Button>
        <Button
          variant={timeRange === 'month' ? 'default' : 'outline'}
          onClick={() => setTimeRange('month')}
          className="flex-1"
        >
          月間
        </Button>
      </div>

      {/* Calorie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>カロリー推移</CardTitle>
          <CardDescription>
            {timeRange === 'week' ? '過去7日間' : '過去30日間'}の摂取カロリー
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeRange === 'week' ? weeklyData : monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {timeRange === 'week' && (
            <p className="text-sm text-gray-600 mt-2">
              平均摂取カロリー: {calorieAverage} kcal/日
            </p>
          )}
        </CardContent>
      </Card>

      {/* Weight Chart */}
      {weightData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>体重推移</CardTitle>
            <CardDescription>記録された体重の変化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Summary */}
      {timeRange === 'week' && (
        <Card>
          <CardHeader>
            <CardTitle>栄養バランス</CardTitle>
            <CardDescription>1日あたりの平均摂取量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nutritionData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="text-sm">{item.name}</span>
                  <span className="font-medium">
                    {item.value} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* BMI Status */}
      <Card>
        <CardHeader>
          <CardTitle>BMI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-4xl font-bold">{calculateBMI(currentWeight, user?.profile.height || 160)}</p>
            <p className="text-sm text-gray-600 mt-2">
              {calculateBMI(currentWeight, user?.profile.height || 160) < 18.5 ? '低体重' :
               calculateBMI(currentWeight, user?.profile.height || 160) < 25 ? '標準体重' :
               calculateBMI(currentWeight, user?.profile.height || 160) < 30 ? '肥満（1度）' : '肥満（2度以上）'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}