import { useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthRouteProps {
  children: ReactNode;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const { user, isLoaded } = useUser();

  // Aguardando carregamento do Clerk
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Usuário autenticado, renderizar o conteúdo
  return <>{children}</>;
} 