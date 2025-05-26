'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Target, Activity, Calendar, LogOut, ChevronRight } from 'lucide-react';
import { userStorage, LocalStorageManager } from '@/lib/storage';
import { User } from '@/lib/types';
import { getActivityLevelLabel, getDietGoalLabel, calculateBMI } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    age: 0,
    gender: 'female' as 'male' | 'female' | 'other',
    height: 0,
    currentWeight: 0,
    targetWeight: 0,
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    dietGoal: 'lose' as 'lose' | 'maintain' | 'gain'
  });

  useEffect(() => {
    const currentUser = userStorage.getUser();
    if (currentUser) {
      setUser(currentUser);
      setEditForm({
        name: currentUser.name,
        age: currentUser.profile.age,
        gender: currentUser.profile.gender,
        height: currentUser.profile.height,
        currentWeight: currentUser.profile.currentWeight,
        targetWeight: currentUser.profile.targetWeight,
        activityLevel: currentUser.profile.activityLevel,
        dietGoal: currentUser.profile.dietGoal
      });
    }
  }, []);

  const handleSave = () => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      name: editForm.name,
      profile: {
        ...user.profile,
        age: editForm.age,
        gender: editForm.gender,
        height: editForm.height,
        currentWeight: editForm.currentWeight,
        targetWeight: editForm.targetWeight,
        activityLevel: editForm.activityLevel,
        dietGoal: editForm.dietGoal
      },
      updatedAt: new Date().toISOString()
    };
    
    userStorage.setUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？すべてのデータは端末に保存されています。')) {
      LocalStorageManager.clear();
      router.push('/');
    }
  };

  if (!user) return null;

  const currentBMI = calculateBMI(user.profile.currentWeight, user.profile.height);
  const targetBMI = calculateBMI(user.profile.targetWeight, user.profile.height);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">プロフィール</h1>
        <p className="text-gray-600">あなたの情報を管理</p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? '保存' : '編集'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">名前</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">年齢</label>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">性別</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">身長 (cm)</label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">年齢</span>
                  <span className="font-medium">{user.profile.age}歳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">性別</span>
                  <span className="font-medium">
                    {user.profile.gender === 'male' ? '男性' : 
                     user.profile.gender === 'female' ? '女性' : 'その他'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">身長</span>
                  <span className="font-medium">{user.profile.height} cm</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weight & Goals */}
      <Card>
        <CardHeader>
          <CardTitle>体重と目標</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">現在の体重 (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.currentWeight}
                      onChange={(e) => setEditForm({ ...editForm, currentWeight: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">目標体重 (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.targetWeight}
                      onChange={(e) => setEditForm({ ...editForm, targetWeight: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ダイエット目標</label>
                  <select
                    value={editForm.dietGoal}
                    onChange={(e) => setEditForm({ ...editForm, dietGoal: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lose">減量</option>
                    <option value="maintain">維持</option>
                    <option value="gain">増量</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">現在の体重</span>
                  <span className="font-medium">{user.profile.currentWeight} kg (BMI: {currentBMI})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">目標体重</span>
                  <span className="font-medium">{user.profile.targetWeight} kg (BMI: {targetBMI})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">目標</span>
                  <span className="font-medium">{getDietGoalLabel(user.profile.dietGoal)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Level */}
      <Card>
        <CardHeader>
          <CardTitle>活動レベル</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium mb-1">活動レベル</label>
              <select
                value={editForm.activityLevel}
                onChange={(e) => setEditForm({ ...editForm, activityLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sedentary">座り仕事中心</option>
                <option value="light">軽い運動習慣</option>
                <option value="moderate">適度な運動習慣</option>
                <option value="active">活発な運動習慣</option>
                <option value="very_active">非常に活発</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{getActivityLevelLabel(user.profile.activityLevel)}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>アカウント情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">登録日</span>
              </div>
              <span className="font-medium">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full text-red-600 border-red-300 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-2" />
        ログアウト
      </Button>

      {/* Cancel Edit Button */}
      {isEditing && (
        <Button
          variant="ghost"
          onClick={() => {
            setIsEditing(false);
            setEditForm({
              name: user.name,
              age: user.profile.age,
              gender: user.profile.gender,
              height: user.profile.height,
              currentWeight: user.profile.currentWeight,
              targetWeight: user.profile.targetWeight,
              activityLevel: user.profile.activityLevel,
              dietGoal: user.profile.dietGoal
            });
          }}
          className="w-full"
        >
          キャンセル
        </Button>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}