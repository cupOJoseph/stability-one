import { useState } from 'react';
import { Transaction } from '@/types';
import { DataCard } from '@/components/ui/data-card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  
  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryColorMap: Record<string, string> = {
      'Food & Dining': 'bg-emerald-50 text-emerald-600',
      'Transportation': 'bg-amber-50 text-amber-600',
      'Shopping': 'bg-rose-50 text-rose-600',
      'Income': 'bg-blue-50 text-blue-600'
    };

    return categoryColorMap[category] || 'bg-gray-100 text-gray-600';
  };

  const getMerchantIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'Food & Dining': (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
          <path d="M3 7V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2" />
          <path d="M10 15v6" />
          <path d="M14 15v6" />
          <path d="M20 15H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1Z" />
        </svg>
      ),
      'Transportation': (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
      'Shopping': (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      'Income': (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
          <line x1="18" y1="9" x2="12" y2="15" />
          <line x1="12" y1="9" x2="18" y2="15" />
        </svg>
      )
    };

    return iconMap[category] || (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    );
  };

  return (
    <DataCard>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center text-sm bg-gray-100 border-0 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="21" x2="14" y1="4" y2="4" />
              <line x1="10" x2="3" y1="4" y2="4" />
              <line x1="21" x2="12" y1="12" y2="12" />
              <line x1="8" x2="3" y1="12" y2="12" />
              <line x1="21" x2="16" y1="20" y2="20" />
              <line x1="12" x2="3" y1="20" y2="20" />
              <line x1="14" x2="14" y1="2" y2="6" />
              <line x1="8" x2="8" y1="10" y2="14" />
              <line x1="16" x2="16" y1="18" y2="22" />
            </svg>
            Filter
          </Button>
          <Button className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 font-medium text-gray-600">Merchant</th>
              <th className="text-left py-3 font-medium text-gray-600">Date</th>
              <th className="text-left py-3 font-medium text-gray-600">Category</th>
              <th className="text-left py-3 font-medium text-gray-600">Account</th>
              <th className="text-right py-3 font-medium text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      {getMerchantIcon(transaction.category)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.merchant}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-600">{formatDate(transaction.date)}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadge(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="py-4 text-gray-600">{transaction.accountName}</td>
                <td className={`py-4 text-right font-medium ${transaction.amount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                </td>
              </tr>
            ))}

            {currentTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {transactions.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min(transactions.length, transactionsPerPage)} of {transactions.length} transactions
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-600 bg-gray-100 border-0 hover:bg-gray-200"
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? '' : 'text-gray-600 bg-gray-100 border-0 hover:bg-gray-200'}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-gray-600 bg-gray-100 border-0 hover:bg-gray-200"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </DataCard>
  );
}
