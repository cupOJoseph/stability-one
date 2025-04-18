import { SpendingCategory } from '@/types';
import { DataCard } from '@/components/ui/data-card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface SpendingCategoriesProps {
  categories: SpendingCategory[];
  className?: string;
}

export default function SpendingCategories({ categories, className = '' }: SpendingCategoriesProps) {
  const [timeFrame, setTimeFrame] = useState('this-month');

  // This would ideally be fetched based on the selected timeframe
  // For now, we'll just use the provided categories
  
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'Housing': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      'Food & Dining': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
          <path d="M3 7V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2" />
          <path d="M10 15v6" />
          <path d="M14 15v6" />
          <path d="M20 15H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1Z" />
          <path d="M4 8h16" />
        </svg>
      ),
      'Transportation': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
          <circle cx="6.5" cy="16.5" r="2.5" />
          <circle cx="16.5" cy="16.5" r="2.5" />
        </svg>
      ),
      'Shopping': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      'Other': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      )
    };

    return iconMap[category] || iconMap['Other'];
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Housing': 'bg-blue-50 text-blue-600',
      'Food & Dining': 'bg-emerald-50 text-emerald-600',
      'Transportation': 'bg-amber-50 text-amber-600',
      'Shopping': 'bg-rose-50 text-rose-600',
      'Other': 'bg-gray-100 text-gray-600'
    };

    return colorMap[category] || colorMap['Other'];
  };

  const getProgressColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Housing': 'bg-blue-600',
      'Food & Dining': 'bg-emerald-600',
      'Transportation': 'bg-amber-600',
      'Shopping': 'bg-rose-600',
      'Other': 'bg-gray-600'
    };

    return colorMap[category] || colorMap['Other'];
  };

  return (
    <DataCard className={className}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Spending by Category</h3>
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px] bg-gray-100 border-0">
            <SelectValue placeholder="This Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div className="flex items-center" key={index}>
            <div className={`w-10 h-10 rounded-full ${getCategoryColor(category.category).split(' ')[0]} flex items-center justify-center mr-4`}>
              {getCategoryIcon(category.category)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-900">{category.category}</span>
                <span className="font-medium text-gray-900">{formatCurrency(category.amount)}</span>
              </div>
              <Progress 
                value={category.percentage} 
                className={getProgressColor(category.category)}
              />
            </div>
            <span className="ml-4 text-gray-600 text-sm">{category.percentage}%</span>
          </div>
        ))}
      </div>
    </DataCard>
  );
}
