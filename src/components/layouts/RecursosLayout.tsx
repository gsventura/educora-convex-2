import { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../navbar";

interface RecursosLayoutProps {
  children?: ReactNode;
}

export default function RecursosLayout({ children }: RecursosLayoutProps) {
  const location = useLocation();
  const isMainResourcePage = location.pathname === "/recursos";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isMainResourcePage && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Central de Recursos</h1>
          </div>
        )}
        
        {children || <Outlet />}
      </main>
    </div>
  );
} 