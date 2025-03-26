# Implementação do Google Tag Manager

Este documento descreve como o Google Tag Manager (GTM) foi implementado no projeto Educora.

## Visão Geral

A implementação do GTM no Educora permite rastrear eventos e conversões importantes no aplicativo, como visualizações de página, envios de formulários e interações com componentes específicos.

## Estrutura da Implementação

1. **Scripts GTM no HTML**
   - Script principal no `<head>` do arquivo `index.html`
   - Script de fallback no `<body>` do arquivo `index.html`

2. **Biblioteca GTM**
   - Arquivo `src/lib/gtm.ts` com funções utilitárias para interagir com o GTM
   - Inclui funções para:
     - Inicializar o dataLayer
     - Enviar eventos para o dataLayer
     - Rastrear visualizações de página
     - Rastrear eventos específicos

3. **Contexto React**
   - Contexto GTM em `src/context/GTMContext.tsx`
   - Hook `useGTM()` para acessar as funções GTM de qualquer componente

4. **Rastreamento de Páginas**
   - Componente `GTMPageTracking` em `src/components/wrappers/GTMPageTracking.tsx`
   - Rastreia automaticamente mudanças de rota com React Router

## Como Usar

### Rastreamento de Visualizações de Página

O rastreamento de visualizações de página é automático graças ao componente `GTMPageTracking`, que é incluído no componente principal `App.tsx`.

### Rastreamento de Eventos

Para rastrear eventos em um componente:

```tsx
import { useGTM } from "@/context/GTMContext";

function MeuComponente() {
  const { trackEvent } = useGTM();
  
  const handleButtonClick = () => {
    // Lógica do botão...
    
    // Rastrear o evento
    trackEvent(
      'nome_do_evento',
      'categoria',
      'ação',
      'rótulo_opcional',
      valor_opcional
    );
  };
  
  return (
    <button onClick={handleButtonClick}>
      Clique Aqui
    </button>
  );
}
```

### Enviando Dados Diretamente para o dataLayer

Para enviar dados personalizados diretamente para o dataLayer:

```tsx
import { useGTM } from "@/context/GTMContext";

function MeuComponente() {
  const { pushEvent } = useGTM();
  
  const enviarDadosPersonalizados = () => {
    pushEvent({
      event: 'evento_personalizado',
      dados_adicionais: 'valor',
      outroDado: 123
    });
  };
  
  // Resto do componente...
}
```

## Eventos Padrão Implementados

- **Visualizações de Página**: `pageview`
- **Envio de Formulários**:
  - `form_submission_attempt`: Quando o usuário tenta enviar um formulário
  - `form_submission_success`: Quando o envio é bem-sucedido
  - `form_submission_error`: Quando ocorre um erro no envio
- **Interações com Formulários**:
  - `form_field_focus`: Quando um campo do formulário recebe foco
  - `form_button_click`: Quando o botão de envio é clicado

## ID do Contêiner GTM

O ID do contêiner GTM está configurado como `GTM-XXXXXX` no arquivo `index.html`. Este valor deve ser substituído pelo ID real do contêiner.

## Considerações Importantes

1. **Privacidade e LGPD**: Certifique-se de obter o consentimento do usuário antes de ativar o rastreamento completo, conforme exigido pela Lei Geral de Proteção de Dados (LGPD).

2. **Ambiente de Desenvolvimento**: O rastreamento está ativo em todos os ambientes. Em uma implementação mais robusta, considere desativar ou usar um contêiner GTM separado para ambientes de desenvolvimento.

3. **Depuração**: Para verificar se os eventos estão sendo enviados corretamente, use a extensão Google Tag Assistant ou o modo de visualização do Google Tag Manager. 