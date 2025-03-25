import { Suspense } from "react";
import { Route, Routes, useRoutes, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import DashboardPaid from "./pages/dashboard-paid";
import Form from "./pages/form";
import NaoAssinante from "./pages/nao-assinante";
import Success from "./pages/success";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import ColorDemoPage from "./pages/color-demo";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import AuthRoute from "./components/wrappers/AuthRoute";
import { useStoreUserEffect } from "./utils/useStoreUserEffect";
import { Toaster } from "@/components/ui/toaster";

// Importando as páginas de recursos
import RecursosHub from "./pages/recursos";
import PrimeirosPassos from "./pages/recursos/primeiros-passos";
import DicasAvancadas from "./pages/recursos/dicas-avancadas";
import FAQ from "./pages/recursos/faq";
import RecursosLayout from "./components/layouts/RecursosLayout";

function App() {
  // Store user in database when they log in
  useStoreUserEffect();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            } 
          />
          <Route
            path="/dashboard-paid"
            element={
              <ProtectedRoute>
                <DashboardPaid />
              </ProtectedRoute>
            }
          />
          <Route path="/form" element={<Form />} />
          <Route path="/success" element={<Success />} />
          <Route path="/nao-assinante" element={<NaoAssinante />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in/sso-callback" element={<Navigate to="/dashboard" replace />} />
          <Route path="/color-demo" element={<ColorDemoPage />} />
          
          {/* Rotas para a Central de Recursos */}
          <Route
            path="/recursos"
            element={
              <AuthRoute>
                <RecursosLayout />
              </AuthRoute>
            }
          >
            <Route index element={<RecursosHub />} />
            <Route path="primeiros-passos" element={<PrimeirosPassos />} />
            <Route path="dicas-avancadas" element={<DicasAvancadas />} />
            <Route path="faq" element={<FAQ />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
