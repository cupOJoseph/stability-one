import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface MobileNavbarProps {
  user: UserProfile;
  openMenu: () => void;
  closeMenu: () => void;
  isMenuOpen: boolean;
}

export default function MobileNavbar({ user, openMenu, closeMenu, isMenuOpen }: MobileNavbarProps) {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', active: true, path: '/dashboard' },
    { label: 'Accounts', icon: 'credit-card', active: false, path: '/accounts' },
    { label: 'Transactions', icon: 'repeat', active: false, path: '/transactions' },
    { label: 'Budget', icon: 'bar-chart', active: false, path: '/budget' },
    { label: 'Goals', icon: 'target', active: false, path: '/goals' },
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      'dashboard': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      'credit-card': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
      'repeat': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      ),
      'bar-chart': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="20" y2="10" />
          <line x1="18" x2="18" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
      ),
      'target': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      'bell': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
      'user': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      'menu': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      ),
      'x': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )
    };

    return icons[iconName] || null;
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <Button variant="ghost" size="icon" className="p-2" onClick={openMenu}>
          {getIcon('menu')}
        </Button>
        <div className="text-xl font-semibold text-gray-900">FinDash</div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="p-2">
            {getIcon('bell')}
          </Button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            {getIcon('user')}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="bg-white h-full w-64 shadow-lg p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 3.75H13.5C14.3284 3.75 15 4.42157 15 5.25V7.5C15 8.32843 14.3284 9 13.5 9H10.5C9.67157 9 9 8.32843 9 7.5V5.25C9 4.42157 9.67157 3.75 10.5 3.75Z"
                      fill="currentColor"
                    />
                    <path
                      d="M3.75 10.5H7.5C8.32843 10.5 9 11.1716 9 12V18.75C9 19.5784 8.32843 20.25 7.5 20.25H3.75C2.92157 20.25 2.25 19.5784 2.25 18.75V12C2.25 11.1716 2.92157 10.5 3.75 10.5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10.5 10.5H13.5C14.3284 10.5 15 11.1716 15 12V18.75C15 19.5784 14.3284 20.25 13.5 20.25H10.5C9.67157 20.25 9 19.5784 9 18.75V12C9 11.1716 9.67157 10.5 10.5 10.5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16.5 10.5H20.25C21.0784 10.5 21.75 11.1716 21.75 12V18.75C21.75 19.5784 21.0784 20.25 20.25 20.25H16.5C15.6716 20.25 15 19.5784 15 18.75V12C15 11.1716 15.6716 10.5 16.5 10.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">FinDash</h1>
              </div>
              <Button variant="ghost" size="icon" className="p-1" onClick={closeMenu}>
                {getIcon('x')}
              </Button>
            </div>
            
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start ${item.active ? 
                    'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : 
                    'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => {
                    setLocation(item.path);
                    closeMenu();
                  }}
                >
                  {getIcon(item.icon)}
                  <span className="ml-3">{item.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex items-center p-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {getIcon('user')}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-600">{user.email}</div>
                </div>
              </div>
              <Button 
                variant="outline"
                className="mt-4 w-full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around">
        {navItems.slice(0, 4).map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`flex flex-col items-center p-2 ${
              item.active ? 'text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setLocation(item.path)}
          >
            {getIcon(item.icon)}
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </>
  );
}
