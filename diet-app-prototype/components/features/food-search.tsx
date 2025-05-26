'use client';

import React, { useState, useEffect } from 'react';
import { Search, Barcode, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FoodItem } from '@/lib/types';
import { mockFoodDatabase } from '@/lib/mock-api';
import { cn } from '@/lib/utils';

interface FoodSearchProps {
  onSelectFood: (food: FoodItem, quantity: number) => void;
}

export function FoodSearch({ onSelectFood }: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = mockFoodDatabase.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(food.serving.size.toString());
  };

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      onSelectFood(selectedFood, parseFloat(quantity));
      setSearchTerm('');
      setSelectedFood(null);
      setQuantity('');
      setSearchResults([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="食品名を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Camera className="w-4 h-4 mr-2" />
          写真で記録
        </Button>
        <Button variant="outline" className="flex-1">
          <Barcode className="w-4 h-4 mr-2" />
          バーコード
        </Button>
      </div>

      {searchResults.length > 0 && !selectedFood && (
        <Card>
          <CardContent className="p-2">
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{food.name}</p>
                      {food.brand && (
                        <p className="text-sm text-gray-500">{food.brand}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{food.nutrition.calories} kcal</p>
                      <p className="text-xs text-gray-500">
                        {food.serving.size}{food.serving.unit}あたり
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFood && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">{selectedFood.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">分量</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{selectedFood.serving.unit}</span>
                  <span className="text-sm text-gray-500">
                    （標準: {selectedFood.serving.size}{selectedFood.serving.unit}）
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">
                  カロリー: {Math.round((parseFloat(quantity || '0') / selectedFood.serving.size) * selectedFood.nutrition.calories)} kcal
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFood(null);
                    setQuantity('');
                  }}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button onClick={handleAddFood} className="flex-1">
                  追加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}