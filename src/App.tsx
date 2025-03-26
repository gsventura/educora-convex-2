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
import SignInSSOCallback from "./pages/sign-in/sso-callback";
import SignUpSSOCallback from "./pages/sign-up/sso-callback";
import FactorOnePage from "./pages/sign-in/factor-one";
import FactorTwoPage from "./pages/sign-in/factor-two";
import GTMPageTracking from "./components/wrappers/GTMPageTracking";

// Importando as páginas de recursos
import RecursosHub from "./pages/recursos";
import PrimeirosPassos from "./pages/recursos/primeiros-passos";
import DicasAvancadas from "./pages/recursos/dicas-avancadas";
import FAQ from "./pages/recursos/faq";
import RecursosLayout from "./components/layouts/RecursosLayout";

// Importando páginas legais
import PoliticaPrivacidade from "./pages/privacidade";
import TermosDeUso from "./pages/termos";

function App() {
  // Store user in database when they log in
  useStoreUserEffect();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <GTMPageTracking />
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
          <Route path="/sign-in/sso-callback" element={<SignInSSOCallback />} />
          <Route path="/sign-up/sso-callback" element={<SignUpSSOCallback />} />
          <Route path="/sign-in/factor-one" element={<FactorOnePage />} />
          <Route path="/sign-in/factor-two" element={<FactorTwoPage />} />
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
          
          {/* Rotas para páginas legais */}
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos" element={<TermosDeUso />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
