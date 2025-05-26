import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[d.getDay()];
}

export function calculateBMI(weight: number, height: number): number {
  // height in cm, weight in kg
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

export function getNutritionPercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
}

export function getMealTypeLabel(mealType: string): string {
  const labels: { [key: string]: string } = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食',
    snack: '間食'
  };
  return labels[mealType] || mealType;
}

export function getActivityLevelLabel(level: string): string {
  const labels: { [key: string]: string } = {
    sedentary: '座り仕事中心',
    light: '軽い運動習慣',
    moderate: '適度な運動習慣',
    active: '活発な運動習慣',
    very_active: '非常に活発'
  };
  return labels[level] || level;
}

export function getDietGoalLabel(goal: string): string {
  const labels: { [key: string]: string } = {
    lose: '減量',
    maintain: '維持',
    gain: '増量'
  };
  return labels[goal] || goal;
}