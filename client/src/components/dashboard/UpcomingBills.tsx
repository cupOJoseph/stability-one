import { Bill } from '@/types';
import { DataCard } from '@/components/ui/data-card';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UpcomingBillsProps {
  bills: Bill[];
}

export default function UpcomingBills({ bills }: UpcomingBillsProps) {
  const getBillIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'Housing': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      'Utilities': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" />
        </svg>
      ),
      'Internet': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
          <path d="M6 12a6 6 0 0 1 12 0" />
          <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10" />
          <path d="M10 12a2 2 0 0 1 4 0" />
        </svg>
      ),
      'Phone': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    };

    return iconMap[category] || (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    );
  };

  const getBillColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Housing': 'bg-blue-50',
      'Utilities': 'bg-amber-50',
      'Internet': 'bg-emerald-50',
      'Phone': 'bg-rose-50'
    };

    return colorMap[category] || 'bg-gray-100';
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <DataCard>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Upcoming Bills</h3>
        <Button variant="link" className="text-blue-600 p-0 h-auto">View All</Button>
      </div>
      
      <div className="space-y-4">
        {bills.map((bill, index) => (
          <div 
            key={index} 
            className="p-3 rounded-lg border border-gray-200 flex items-center hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full ${getBillColor(bill.category)} flex items-center justify-center mr-3`}>
              {getBillIcon(bill.category)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{bill.name}</div>
              <div className="text-sm text-gray-600">
                Due in {bill.daysRemaining} day{bill.daysRemaining !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{formatCurrency(bill.amount)}</div>
              <div className="text-xs text-gray-600">{formatDueDate(bill.dueDate)}</div>
            </div>
          </div>
        ))}

        {bills.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No upcoming bills found
          </div>
        )}
      </div>
    </DataCard>
  );
}
