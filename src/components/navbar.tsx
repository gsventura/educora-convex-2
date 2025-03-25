import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center px-4 py-2">
      <nav className={`max-w-6xl w-full rounded-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-sm shadow-sm" 
          : "bg-white"
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/logo-text-dark.png" 
                alt="Educora Logo" 
                className="h-8"
              />
            </Link>

            {/* Menu hamburger para mobile */}
            <button 
              className="md:hidden flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Menu para desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/recursos"
                className="text-gray-600 hover:text-tertiary font-medium transition-colors relative group"
              >
                Recursos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tertiary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/recursos/faq"
                className="text-gray-600 hover:text-tertiary font-medium transition-colors relative group"
              >
                Central de Ajuda
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tertiary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-tertiary font-medium transition-colors relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-tertiary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {isLoaded ? (
              <div className="hidden md:flex items-center space-x-4">
                <Authenticated>
                  <div className="flex items-center space-x-4">
                    {userData && (
                      <span className="text-gray-900 hidden md:inline font-medium">
                        {userData.name}
                      </span>
                    )}
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </Authenticated>
                <Unauthenticated>
                  <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                    <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-md">
                      Entrar
                    </button>
                  </SignInButton>
                </Unauthenticated>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          {menuOpen && (
            <div className="md:hidden bg-white rounded-b-lg shadow-lg absolute left-0 right-0 top-full p-4 transition-all">
              <div className="flex flex-col space-y-4 pb-4">
                <Link
                  to="/recursos"
                  className="text-gray-600 hover:text-tertiary font-medium py-2 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Recursos
                </Link>
                <Link
                  to="/recursos/faq"
                  className="text-gray-600 hover:text-tertiary font-medium py-2 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Central de Ajuda
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-tertiary font-medium py-2 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {isLoaded ? (
                  <div className="pt-2">
                    <Authenticated>
                      <div className="flex items-center justify-between">
                        {userData && (
                          <span className="text-gray-900 font-medium">
                            {userData.name}
                          </span>
                        )}
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </Authenticated>
                    <Unauthenticated>
                      <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                        <button className="w-full px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-md">
                          Entrar
                        </button>
                      </SignInButton>
                    </Unauthenticated>
                  </div>
                ) : (
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
