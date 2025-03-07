import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { BookOpen } from "lucide-react";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-indigo-600">Educora</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/#features"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {isLoaded ? (
            <div className="flex items-center space-x-4">
              <Authenticated>
                <div className="flex items-center space-x-4">
                  {userData && (
                    <span className="text-gray-900 hidden md:inline">
                      {userData.name}
                    </span>
                  )}
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Authenticated>
              <Unauthenticated>
                <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                  <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
              </Unauthenticated>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
