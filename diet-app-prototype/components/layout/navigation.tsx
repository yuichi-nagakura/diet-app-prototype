'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, TrendingUp, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'ホーム' },
  { href: '/food-record', icon: Camera, label: '食事記録' },
  { href: '/progress', icon: TrendingUp, label: '進捗' },
  { href: '/achievements', icon: Trophy, label: '達成' },
  { href: '/profile', icon: User, label: 'プロフィール' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}