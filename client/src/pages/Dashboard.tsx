import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNavbar from '@/components/dashboard/MobileNavbar';
import AccountSummary from '@/components/dashboard/AccountSummary';
import SpendingCategories from '@/components/dashboard/SpendingCategories';
import UpcomingBills from '@/components/dashboard/UpcomingBills';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { DashboardData } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Dashboard() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // Fetch all dashboard data
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg font-medium">Loading your financial data...</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar user={data.user} className="hidden lg:block" />

      {/* Mobile View */}
      {isMobile && (
        <>
          <MobileNavbar
            user={data.user}
            openMenu={() => setOpenMobileMenu(true)}
            isMenuOpen={openMobileMenu}
            closeMenu={() => setOpenMobileMenu(false)}
          />
        </>
      )}

      {/* Main Content */}
      <main className={`p-4 md:p-8 ${isMobile ? 'pb-20' : 'lg:ml-64'}`}>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600">Welcome back, {data.user.firstName}!</p>
          </div>
          
          <div className="flex space-x-3">
            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </button>
            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Account Summary Section */}
        <AccountSummary accounts={data.accounts} />

        {/* Spending Analysis & Upcoming Bills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SpendingCategories 
            categories={data.spendingCategories} 
            className="lg:col-span-2"
          />
          <UpcomingBills bills={data.upcomingBills} />
        </div>

        {/* Recent Transactions Section */}
        <RecentTransactions transactions={data.transactions} />
      </main>
    </div>
  );
}
