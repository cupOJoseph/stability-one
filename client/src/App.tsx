import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

function Router() {
  const [location, setLocation] = useLocation();
  
  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        try {
          const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, state }),
            credentials: 'include'
          });
          
          if (response.ok) {
            // Remove query params from URL after processing
            window.history.replaceState({}, document.title, window.location.pathname);
            setLocation('/dashboard');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
      }
    };
    
    handleOAuthCallback();
  }, [location, setLocation]);
  
  // Check if the user is authenticated
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        {user ? <Dashboard /> : () => {
          setLocation('/');
          return null;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
