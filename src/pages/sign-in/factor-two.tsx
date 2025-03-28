import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Navbar } from "../../components/navbar";

export default function FactorTwoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Segundo fator de autenticação
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Complete a segunda etapa de verificação para continuar
          </p>
          
          <div className="flex justify-center w-full">
            <ClerkSignIn 
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
                  card: "shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: 
                    "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 