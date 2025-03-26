import React, { createContext, useContext, ReactNode } from 'react';
import { pushEvent, trackEvent, pageView } from '@/lib/gtm';

// Interface para o contexto do GTM
interface GTMContextType {
  pushEvent: (event: Record<string, any>) => void;
  trackEvent: (
    eventName: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    additionalParams?: Record<string, any>
  ) => void;
  pageView: (url: string) => void;
}

// Criando o contexto com valores padrão
const GTMContext = createContext<GTMContextType>({
  pushEvent,
  trackEvent,
  pageView,
});

// Hook para usar o contexto
export const useGTM = () => useContext(GTMContext);

interface GTMProviderProps {
  children: ReactNode;
}

// Provider do contexto
export const GTMProvider: React.FC<GTMProviderProps> = ({ children }) => {
  // Os valores não mudam, pois estamos apenas abstraindo as funções do lib/gtm
  const contextValue: GTMContextType = {
    pushEvent,
    trackEvent,
    pageView,
  };

  return (
    <GTMContext.Provider value={contextValue}>
      {children}
    </GTMContext.Provider>
  );
};

export default GTMProvider; 