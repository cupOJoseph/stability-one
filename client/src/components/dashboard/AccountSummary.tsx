import { formatCurrency } from '@/lib/utils';
import { DataCard } from '@/components/ui/data-card';
import { Progress } from '@/components/ui/progress';

interface AccountSummaryProps {
  accounts: {
    totalBalance: number;
    growthPercentage: number;
    checking: any[];
    savings: any[];
  };
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  // Find primary checking and savings accounts to display
  const primaryChecking = accounts.checking[0] || null;
  const primarySavings = accounts.savings[0] || null;
  
  // Calculate progress for monthly goal (hardcoded goal for now)
  const monthlyGoal = 25000;
  const progressPercentage = Math.min(Math.round((accounts.totalBalance / monthlyGoal) * 100), 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Balance Card */}
      <DataCard>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-600 text-sm">Total Balance</p>
            <h2 className="text-2xl font-semibold mt-1 text-gray-900">
              {formatCurrency(accounts.totalBalance)}
            </h2>
          </div>
          <span className="text-emerald-600 bg-emerald-50 rounded-full px-2 py-1 text-xs font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="m18 15-6-6-6 6"/>
            </svg>
            {accounts.growthPercentage}%
          </span>
        </div>
        <Progress value={progressPercentage} />
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>Monthly Goal</span>
            <span>{formatCurrency(monthlyGoal)}</span>
          </div>
        </div>
      </DataCard>

      {/* Checking Account Card */}
      {primaryChecking && (
        <DataCard>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm">Checking Account</p>
              <h2 className="text-2xl font-semibold mt-1 text-gray-900">
                {formatCurrency(primaryChecking.balance)}
              </h2>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
          </div>
          <div className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Account</span>
              <span className="font-medium text-gray-900">{primaryChecking.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available</span>
              <span className="font-medium text-gray-900">{formatCurrency(primaryChecking.available)}</span>
            </div>
          </div>
        </DataCard>
      )}

      {/* Savings Account Card */}
      {primarySavings && (
        <DataCard>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm">Savings Account</p>
              <h2 className="text-2xl font-semibold mt-1 text-gray-900">
                {formatCurrency(primarySavings.balance)}
              </h2>
            </div>
            <div className="p-3 rounded-full bg-emerald-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M2 20h.01" />
                <path d="M7 20v-4" />
                <path d="M12 20v-8" />
                <path d="M17 20V8" />
                <path d="M22 4v16" />
              </svg>
            </div>
          </div>
          <div className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Account</span>
              <span className="font-medium text-gray-900">{primarySavings.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Interest Rate</span>
              <span className="font-medium text-gray-900">{primarySavings.interestRate}%</span>
            </div>
          </div>
        </DataCard>
      )}
    </div>
  );
}
