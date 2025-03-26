import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageView } from '@/lib/gtm';

/**
 * Componente para rastrear mudanças de página com o Google Tag Manager
 * Este componente deve ser inserido no App.tsx
 */
export const GTMPageTracking: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Envia um evento de pageview para o GTM sempre que a rota mudar
    const currentPath = location.pathname + location.search;
    pageView(currentPath);
  }, [location]);

  // Este componente não renderiza nada visualmente
  return null;
};

export default GTMPageTracking; 