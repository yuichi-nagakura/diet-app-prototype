'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Flame, Target, Award, TrendingUp } from 'lucide-react';
import { achievementStorage, progressStorage, mealStorage } from '@/lib/storage';
import { Achievement } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    totalMeals: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalWeightLoss: 0
  });

  useEffect(() => {
    loadAchievements();
    calculateStats();
  }, []);

  const loadAchievements = () => {
    const allAchievements = achievementStorage.getAchievements();
    setAchievements(allAchievements);
  };

  const calculateStats = () => {
    const progress = progressStorage.getProgress();
    const meals = mealStorage.getMeals();
    
    // Calculate total days with records
    const uniqueDays = new Set(meals.map(m => m.date)).size;
    
    // Calculate current streak
    const today = new Date();
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = meals.filter(m => m.date === dateStr);
      if (dayMeals.length > 0) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    // Calculate weight loss (if weight data available)
    const weightData = progress.filter(p => p.weight).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let weightLoss = 0;
    if (weightData.length >= 2) {
      weightLoss = (weightData[0].weight || 0) - (weightData[weightData.length - 1].weight || 0);
    }
    
    setStats({
      totalDays: uniqueDays,
      totalMeals: meals.length,
      currentStreak,
      longestStreak: Math.max(currentStreak, 7), // Mock longest streak
      totalWeightLoss: weightLoss
    });
  };

  const allPossibleAchievements = [
    { 
      id: 'ach_001',
      type: 'streak' as const,
      name: '3日連続記録',
      description: '3日連続で食事を記録しました',
      icon: '🔥',
      progress: { current: Math.min(stats.currentStreak, 3), target: 3 }
    },
    {
      id: 'ach_002',
      type: 'streak' as const,
      name: '7日連続記録',
      description: '1週間連続で食事を記録しました',
      icon: '⭐',
      progress: { current: Math.min(stats.currentStreak, 7), target: 7 }
    },
    {
      id: 'ach_003',
      type: 'streak' as const,
      name: '30日連続記録',
      description: '1ヶ月連続で食事を記録しました',
      icon: '🏆',
      progress: { current: Math.min(stats.currentStreak, 30), target: 30 }
    },
    {
      id: 'ach_004',
      type: 'milestone' as const,
      name: '初めての記録',
      description: '最初の食事記録を完了',
      icon: '🎯',
      progress: { current: stats.totalMeals > 0 ? 1 : 0, target: 1 }
    },
    {
      id: 'ach_005',
      type: 'milestone' as const,
      name: '50食記録達成',
      description: '累計50食の記録を達成',
      icon: '🍽️',
      progress: { current: Math.min(stats.totalMeals, 50), target: 50 }
    },
    {
      id: 'ach_006',
      type: 'milestone' as const,
      name: '100食記録達成',
      description: '累計100食の記録を達成',
      icon: '🎉',
      progress: { current: Math.min(stats.totalMeals, 100), target: 100 }
    },
    {
      id: 'ach_007',
      type: 'badge' as const,
      name: '早起き記録者',
      description: '朝食を7日間記録',
      icon: '🌅',
      progress: { current: 3, target: 7 } // Mock data
    },
    {
      id: 'ach_008',
      type: 'badge' as const,
      name: '野菜マスター',
      description: '1日の野菜摂取目標を達成',
      icon: '🥗',
      progress: { current: 1, target: 1 }
    },
    {
      id: 'ach_009',
      type: 'badge' as const,
      name: 'タンパク質チャンピオン',
      description: 'タンパク質摂取目標を3日連続達成',
      icon: '💪',
      progress: { current: 1, target: 3 }
    },
    {
      id: 'ach_010',
      type: 'milestone' as const,
      name: '1kg減量達成',
      description: '目標に向けて1kg減量',
      icon: '⚖️',
      progress: { current: stats.totalWeightLoss >= 1 ? 1 : 0, target: 1 }
    }
  ];

  const getAchievementStatus = (achievement: any) => {
    const unlocked = achievements.find(a => a.name === achievement.name);
    return {
      unlocked: !!unlocked || (achievement.progress.current >= achievement.progress.target),
      unlockedAt: unlocked?.unlockedAt
    };
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="w-5 h-5" />;
      case 'milestone': return <Target className="w-5 h-5" />;
      case 'badge': return <Award className="w-5 h-5" />;
      case 'challenge': return <Trophy className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">達成記録</h1>
        <p className="text-gray-600">あなたの成果を確認しましょう</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.currentStreak}</p>
              <p className="text-sm text-gray-600">現在の連続記録</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.totalMeals}</p>
              <p className="text-sm text-gray-600">総記録数</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      {['streak', 'milestone', 'badge'].map((category) => {
        const categoryAchievements = allPossibleAchievements.filter(a => a.type === category);
        const categoryLabels = {
          streak: '継続記録',
          milestone: 'マイルストーン',
          badge: 'バッジ'
        };
        
        return (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-3">
              {getCategoryIcon(category)}
              <h2 className="text-lg font-semibold">{categoryLabels[category as keyof typeof categoryLabels]}</h2>
            </div>
            
            <div className="grid gap-3">
              {categoryAchievements.map((achievement) => {
                const status = getAchievementStatus(achievement);
                
                return (
                  <Card 
                    key={achievement.id} 
                    className={status.unlocked ? '' : 'opacity-60'}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className={`text-3xl ${status.unlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          
                          {achievement.progress && (
                            <div className="mt-2">
                              <Progress 
                                value={achievement.progress.current} 
                                max={achievement.progress.target}
                                color={status.unlocked ? 'green' : 'blue'}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {achievement.progress.current} / {achievement.progress.target}
                              </p>
                            </div>
                          )}
                          
                          {status.unlocked && status.unlockedAt && (
                            <p className="text-xs text-green-600 mt-2">
                              🎉 {formatDate(status.unlockedAt)} に達成
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Motivational Message */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <p className="text-blue-900 font-medium">素晴らしい進歩です！</p>
            <p className="text-blue-700 text-sm mt-1">
              継続は力なり。このまま頑張りましょう！
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}