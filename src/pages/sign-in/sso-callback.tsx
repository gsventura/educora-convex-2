import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function SSOCallbackPage() {
  return (
    <>
      <AuthenticateWithRedirectCallback 
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
      <Navigate to="/dashboard" />
    </>
  );
} 