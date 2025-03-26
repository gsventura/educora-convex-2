// Tipo para o objeto dataLayer
type DataLayerObject = Record<string, any>;

// Declaração do dataLayer para o TypeScript
declare global {
  interface Window {
    dataLayer: DataLayerObject[];
  }
}

// Inicialização do dataLayer se ainda não existir
export const initDataLayer = (): void => {
  window.dataLayer = window.dataLayer || [];
};

// Função para enviar eventos para o dataLayer
export const pushEvent = (event: DataLayerObject): void => {
  if (typeof window === 'undefined') return;
  
  // Garantir que o dataLayer está inicializado
  initDataLayer();
  
  // Enviar o evento para o dataLayer
  window.dataLayer.push(event);
};

// Função para enviar eventos de página
export const pageView = (url: string): void => {
  pushEvent({
    event: 'pageview',
    page: url,
  });
};

// Função para enviar eventos de conversão/ação
export const trackEvent = (
  eventName: string,
  category: string,
  action: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, any>
): void => {
  pushEvent({
    event: eventName,
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value,
    ...additionalParams,
  });
};

// Inicializar o dataLayer na importação do módulo
initDataLayer(); 