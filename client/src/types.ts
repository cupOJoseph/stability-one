export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Account {
  id: string;
  type: 'checking' | 'savings' | 'credit';
  name: string;
  balance: number;
  available: number;
  accountNumber: string;
  interestRate?: number;
  growthPercentage?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant: string;
  accountId: string;
  accountName: string;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  icon: string;
  color: string;
  category: string;
  isPaid: boolean;
}

export interface DashboardData {
  user: UserProfile;
  accounts: {
    totalBalance: number;
    growthPercentage: number;
    checking: Account[];
    savings: Account[];
    credit: Account[];
  };
  transactions: Transaction[];
  spendingCategories: SpendingCategory[];
  upcomingBills: Bill[];
}
