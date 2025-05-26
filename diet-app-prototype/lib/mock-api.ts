import { FoodItem, NutritionInfo, AIAdvice, Lesson, Achievement } from './types';

// Mock Food Database
export const mockFoodDatabase: FoodItem[] = [
  // 和食
  {
    id: 'food_001',
    name: 'ご飯（白米）',
    serving: { size: 150, unit: 'g' },
    nutrition: {
      calories: 252,
      protein: 3.8,
      carbs: 55.7,
      fat: 0.5,
      fiber: 0.5,
      sugar: 0.2,
      sodium: 2,
      cholesterol: 0
    }
  },
  {
    id: 'food_002',
    name: '味噌汁（わかめ・豆腐）',
    serving: { size: 200, unit: 'ml' },
    nutrition: {
      calories: 41,
      protein: 3.2,
      carbs: 4.8,
      fat: 1.2,
      fiber: 1.1,
      sugar: 0.8,
      sodium: 820,
      cholesterol: 0
    }
  },
  {
    id: 'food_003',
    name: '鮭の塩焼き',
    serving: { size: 100, unit: 'g' },
    nutrition: {
      calories: 133,
      protein: 22.3,
      carbs: 0.1,
      fat: 4.1,
      fiber: 0,
      sugar: 0,
      sodium: 66,
      cholesterol: 59
    }
  },
  {
    id: 'food_004',
    name: '納豆',
    serving: { size: 45, unit: 'g' },
    nutrition: {
      calories: 90,
      protein: 7.4,
      carbs: 5.4,
      fat: 4.9,
      fiber: 3.0,
      sugar: 2.2,
      sodium: 2,
      cholesterol: 0
    }
  },
  // 洋食
  {
    id: 'food_005',
    name: 'グリーンサラダ',
    serving: { size: 150, unit: 'g' },
    nutrition: {
      calories: 25,
      protein: 1.5,
      carbs: 4.8,
      fat: 0.2,
      fiber: 2.1,
      sugar: 2.3,
      sodium: 15,
      cholesterol: 0
    }
  },
  {
    id: 'food_006',
    name: 'チキンサラダ',
    serving: { size: 200, unit: 'g' },
    nutrition: {
      calories: 165,
      protein: 25.3,
      carbs: 6.2,
      fat: 5.8,
      fiber: 2.5,
      sugar: 3.1,
      sodium: 320,
      cholesterol: 72
    }
  },
  // コンビニ商品
  {
    id: 'food_007',
    name: 'おにぎり（鮭）',
    brand: 'セブンイレブン',
    barcode: '4901234567890',
    serving: { size: 110, unit: 'g' },
    nutrition: {
      calories: 188,
      protein: 4.1,
      carbs: 39.8,
      fat: 1.5,
      fiber: 0.5,
      sugar: 0.3,
      sodium: 380,
      cholesterol: 8
    }
  },
  {
    id: 'food_008',
    name: 'サラダチキン（プレーン）',
    brand: 'セブンイレブン',
    barcode: '4901234567891',
    serving: { size: 115, unit: 'g' },
    nutrition: {
      calories: 113,
      protein: 24.1,
      carbs: 0.3,
      fat: 1.2,
      fiber: 0,
      sugar: 0.1,
      sodium: 346,
      cholesterol: 83
    }
  }
];

// Mock AI Advice Generator
export const generateAIAdvice = (mealData: any, userProfile: any): AIAdvice => {
  const adviceTemplates = [
    {
      type: 'meal' as const,
      title: 'タンパク質を増やしましょう',
      content: '今日のお食事はタンパク質が少し不足しています。次の食事では鶏胸肉、豆腐、卵などを取り入れてみましょう。',
      priority: 'medium' as const,
      actionItems: ['夕食に鶏胸肉100gを追加', '間食にゆで卵1個を食べる']
    },
    {
      type: 'meal' as const,
      title: '野菜をもっと摂りましょう',
      content: '野菜の摂取量が目標の半分以下です。食物繊維とビタミンを補給するため、サラダや温野菜を追加しましょう。',
      priority: 'high' as const,
      actionItems: ['昼食にサラダを追加', '夕食に温野菜を100g以上']
    },
    {
      type: 'lifestyle' as const,
      title: '水分補給を忘れずに',
      content: '適切な水分補給は代謝を促進し、満腹感も得られます。1日2リットルを目標に、こまめに水を飲みましょう。',
      priority: 'medium' as const,
      actionItems: ['食事の30分前にコップ1杯の水', '1時間ごとに水分補給']
    },
    {
      type: 'motivation' as const,
      title: '素晴らしい継続です！',
      content: '3日連続で食事記録を続けていますね。この調子で続けることが、健康的な習慣作りの第一歩です。',
      priority: 'low' as const
    }
  ];

  const randomAdvice = adviceTemplates[Math.floor(Math.random() * adviceTemplates.length)];
  
  return {
    id: `advice_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...randomAdvice
  };
};

// Mock Lessons
export const mockLessons: Lesson[] = [
  {
    id: 'lesson_001',
    title: '食事と心理の関係を理解する',
    content: '私たちが食べる理由は、単に空腹を満たすためだけではありません。ストレス、退屈、喜び、悲しみなど、様々な感情が食欲に影響を与えます。まずは自分がどんな時に食べたくなるのか、観察してみましょう。',
    duration: 5,
    category: 'psychology',
    completed: false,
    order: 1
  },
  {
    id: 'lesson_002',
    title: 'バランスの良い食事とは',
    content: 'バランスの良い食事は、炭水化物、タンパク質、脂質を適切な割合で摂ることです。目安は炭水化物50-60%、タンパク質15-20%、脂質20-30%です。極端な制限は長続きしません。',
    duration: 5,
    category: 'nutrition',
    completed: false,
    order: 2
  },
  {
    id: 'lesson_003',
    title: '適切な目標設定の方法',
    content: '体重を1ヶ月で10kg減らすような極端な目標は、リバウンドの原因になります。健康的な減量ペースは1ヶ月1-2kgです。小さな成功体験を積み重ねることが、長期的な成功につながります。',
    duration: 5,
    category: 'psychology',
    completed: false,
    order: 3
  },
  {
    id: 'lesson_004',
    title: '運動と食事の相乗効果',
    content: '運動は単にカロリーを消費するだけでなく、基礎代謝を上げ、ストレスを軽減し、睡眠の質を向上させます。週3回、30分程度の運動から始めてみましょう。',
    duration: 5,
    category: 'exercise',
    completed: false,
    order: 4
  },
  {
    id: 'lesson_005',
    title: '睡眠とダイエットの関係',
    content: '睡眠不足は食欲を増進させるホルモンを分泌させます。7-8時間の質の良い睡眠は、ダイエット成功の重要な要素です。寝る前のスマホは控えめにしましょう。',
    duration: 5,
    category: 'lifestyle',
    completed: false,
    order: 5
  }
];

// Mock Achievement Templates
export const achievementTemplates: Partial<Achievement>[] = [
  {
    type: 'streak',
    name: '3日連続記録',
    description: '3日連続で食事を記録しました',
    icon: '🔥'
  },
  {
    type: 'streak',
    name: '7日連続記録',
    description: '1週間連続で食事を記録しました',
    icon: '⭐'
  },
  {
    type: 'milestone',
    name: '初めての1kg減',
    description: '目標に向けて1kg減量達成',
    icon: '🎯'
  },
  {
    type: 'badge',
    name: '野菜マスター',
    description: '1日の野菜摂取目標を達成',
    icon: '🥗'
  },
  {
    type: 'badge',
    name: 'タンパク質チャンピオン',
    description: 'タンパク質摂取目標を3日連続達成',
    icon: '💪'
  }
];

// Nutrition Calculator
export const calculateTotalNutrition = (foods: { foodItem: FoodItem; quantity: number }[]): NutritionInfo => {
  const total: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0
  };

  foods.forEach(({ foodItem, quantity }) => {
    const ratio = quantity / foodItem.serving.size;
    total.calories += foodItem.nutrition.calories * ratio;
    total.protein += foodItem.nutrition.protein * ratio;
    total.carbs += foodItem.nutrition.carbs * ratio;
    total.fat += foodItem.nutrition.fat * ratio;
    total.fiber += foodItem.nutrition.fiber * ratio;
    total.sugar += foodItem.nutrition.sugar * ratio;
    total.sodium += foodItem.nutrition.sodium * ratio;
    total.cholesterol += foodItem.nutrition.cholesterol * ratio;
  });

  // Round to 1 decimal place
  Object.keys(total).forEach(key => {
    total[key as keyof NutritionInfo] = Math.round(total[key as keyof NutritionInfo] * 10) / 10;
  });

  return total;
};

// Target Nutrition Calculator
export const calculateTargetNutrition = (profile: any): NutritionInfo => {
  // Simple BMR calculation
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 88.362 + (13.397 * profile.currentWeight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    bmr = 447.593 + (9.247 * profile.currentWeight) + (3.098 * profile.height) - (4.330 * profile.age);
  }

  // Activity factor
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const tdee = bmr * activityFactors[profile.activityLevel];
  
  // Adjust for goal
  let targetCalories = tdee;
  if (profile.dietGoal === 'lose') {
    targetCalories = tdee - 500; // 500 calorie deficit for ~0.5kg/week loss
  } else if (profile.dietGoal === 'gain') {
    targetCalories = tdee + 300;
  }

  // Macro distribution
  const proteinCalories = targetCalories * 0.25;
  const carbCalories = targetCalories * 0.45;
  const fatCalories = targetCalories * 0.30;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(proteinCalories / 4), // 4 cal/g
    carbs: Math.round(carbCalories / 4), // 4 cal/g
    fat: Math.round(fatCalories / 9), // 9 cal/g
    fiber: 25, // general recommendation
    sugar: 50, // limit added sugars
    sodium: 2300, // general recommendation
    cholesterol: 300 // general recommendation
  };
};