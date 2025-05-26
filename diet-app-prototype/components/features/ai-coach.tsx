'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { AIAdvice } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AICoachProps {
  advice: AIAdvice[];
}

export function AICoach({ advice }: AICoachProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      meal: '食事',
      exercise: '運動',
      lifestyle: 'ライフスタイル',
      motivation: 'モチベーション'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h3 className="font-semibold">AI栄養士 未来さん</h3>
          <p className="text-sm text-gray-600">あなたの健康をサポートします</p>
        </div>
      </div>

      {advice.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              食事を記録すると、パーソナライズされたアドバイスが表示されます。
            </p>
          </CardContent>
        </Card>
      ) : (
        advice.map((item) => (
          <Card key={item.id} className={cn(
            "border-l-4",
            item.priority === 'high' ? 'border-l-red-500' :
            item.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getPriorityIcon(item.priority)}
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">{item.content}</p>
              {item.actionItems && item.actionItems.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-600">アクション：</p>
                  <ul className="text-sm space-y-1">
                    {item.actionItems.map((action, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}