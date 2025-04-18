import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { initiateOAuthFlow } from "@/lib/auth";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await initiateOAuthFlow();
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md bg-white p-8 text-center">
        <CardContent className="p-0">
          <div className="mb-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 3.75H13.5C14.3284 3.75 15 4.42157 15 5.25V7.5C15 8.32843 14.3284 9 13.5 9H10.5C9.67157 9 9 8.32843 9 7.5V5.25C9 4.42157 9.67157 3.75 10.5 3.75Z"
                  className="fill-primary"
                />
                <path
                  d="M3.75 10.5H7.5C8.32843 10.5 9 11.1716 9 12V18.75C9 19.5784 8.32843 20.25 7.5 20.25H3.75C2.92157 20.25 2.25 19.5784 2.25 18.75V12C2.25 11.1716 2.92157 10.5 3.75 10.5Z"
                  className="fill-primary"
                />
                <path
                  d="M10.5 10.5H13.5C14.3284 10.5 15 11.1716 15 12V18.75C15 19.5784 14.3284 20.25 13.5 20.25H10.5C9.67157 20.25 9 19.5784 9 18.75V12C9 11.1716 9.67157 10.5 10.5 10.5Z"
                  className="fill-primary/70"
                />
                <path
                  d="M16.5 10.5H20.25C21.0784 10.5 21.75 11.1716 21.75 12V18.75C21.75 19.5784 21.0784 20.25 20.25 20.25H16.5C15.6716 20.25 15 19.5784 15 18.75V12C15 11.1716 15.6716 10.5 16.5 10.5Z"
                  className="fill-primary/40"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mt-4 text-gray-900">
              Stability One
            </h1>
            <p className="text-gray-600 mt-2">
              A fully backed stablecoin for the Capital One ecosystem.
            </p>
          </div>

          <div className="my-8">
            <Button
              onClick={handleLogin}
              className="w-full font-medium py-6 bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                      fill="currentColor"
                    />
                  </svg>
                  Log in with Capital One
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
      <footer className="fixed bottom-0 w-full text-center py-4 text-gray-500 text-sm">
        Stability One is not affiliated with Capital One.
      </footer>
    </div>
  );
}
