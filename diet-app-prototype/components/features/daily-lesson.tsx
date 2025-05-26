'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Book } from 'lucide-react';
import { Lesson } from '@/lib/types';

interface DailyLessonProps {
  lesson: Lesson | null;
  onComplete: (lessonId: string) => void;
}

export function DailyLesson({ lesson, onComplete }: DailyLessonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!lesson) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">すべてのレッスンを完了しました！</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      nutrition: '🥗',
      psychology: '🧠',
      exercise: '💪',
      lifestyle: '🌟'
    };
    return icons[category] || '📚';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      nutrition: '栄養',
      psychology: '心理学',
      exercise: '運動',
      lifestyle: 'ライフスタイル'
    };
    return labels[category] || category;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getCategoryIcon(lesson.category)}</div>
            <div>
              <CardTitle className="text-lg">今日のレッスン</CardTitle>
              <CardDescription>
                <span className="inline-flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.duration}分</span>
                  <span>・</span>
                  <span>{getCategoryLabel(lesson.category)}</span>
                </span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-3">{lesson.title}</h3>
        
        <div className={`text-sm text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
          {lesson.content}
        </div>
        
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            続きを読む
          </button>
        )}
        
        {isExpanded && (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => onComplete(lesson.id)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              完了
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}