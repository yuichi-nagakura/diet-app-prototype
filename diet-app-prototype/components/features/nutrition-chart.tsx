'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { NutritionInfo } from '@/lib/types';
import { getNutritionPercentage } from '@/lib/utils';

interface NutritionChartProps {
  current: NutritionInfo;
  target: NutritionInfo;
  showDetails?: boolean;
}

export function NutritionChart({ current, target, showDetails = true }: NutritionChartProps) {
  const nutritionItems = [
    { key: 'calories', label: 'カロリー', unit: 'kcal', color: 'blue' as const },
    { key: 'protein', label: 'タンパク質', unit: 'g', color: 'green' as const },
    { key: 'carbs', label: '炭水化物', unit: 'g', color: 'yellow' as const },
    { key: 'fat', label: '脂質', unit: 'g', color: 'red' as const },
  ];

  const detailItems = [
    { key: 'fiber', label: '食物繊維', unit: 'g' },
    { key: 'sugar', label: '糖質', unit: 'g' },
    { key: 'sodium', label: 'ナトリウム', unit: 'mg' },
    { key: 'cholesterol', label: 'コレステロール', unit: 'mg' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>栄養バランス</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nutritionItems.map((item) => {
            const currentValue = current[item.key as keyof NutritionInfo];
            const targetValue = target[item.key as keyof NutritionInfo];
            const percentage = getNutritionPercentage(currentValue, targetValue);
            
            return (
              <div key={item.key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-gray-600">
                    {currentValue} / {targetValue} {item.unit}
                  </span>
                </div>
                <Progress 
                  value={currentValue} 
                  max={targetValue} 
                  color={item.color}
                  showLabel
                />
              </div>
            );
          })}
          
          {showDetails && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-3">詳細</h4>
              <div className="grid grid-cols-2 gap-3">
                {detailItems.map((item) => {
                  const currentValue = current[item.key as keyof NutritionInfo];
                  const targetValue = target[item.key as keyof NutritionInfo];
                  
                  return (
                    <div key={item.key} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span className="text-xs font-medium">
                        {currentValue} / {targetValue} {item.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}