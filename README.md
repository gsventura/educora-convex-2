# React SWC Starter

A modern, production-ready React starter template with built-in authentication, backend-as-a-service, and subscription payments.

## 🚀 Features

- ⚡️ **Vite + SWC** - Lightning fast builds with Vite and SWC
- 🔐 **Authentication** - Secure authentication with [Clerk](https://clerk.com)
- 🗄️ **Backend-as-a-Service** - Powered by [Convex](https://convex.dev)
- 💳 **Payments** - Subscription payments with [Stripe](https://stripe.com)
- 🎨 **Styling** - Beautiful UI components with [Radix UI](https://www.radix-ui.com)
- 📱 **Responsive** - Mobile-first design approach
- 🔍 **TypeScript** - Type safety and better developer experience
- 🔄 **Real-time** - Real-time updates with Convex subscriptions

## 📦 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Authentication**: Clerk
- **Backend**: Convex
- **Payments**: Stripe
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Type Safety**: TypeScript

## 🛠️ Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Clerk account for authentication
- A Convex account for backend services
- A Stripe account for payments

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd react-swc-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

   # Convex Backend
   VITE_CONVEX_URL=your_convex_url

   # Application URLs
   VITE_FRONTEND_URL=your_frontend_url

   # Polar.sh Payments (Server-side in Convex)
   POLAR_ACCESS_TOKEN=your_polar_access_token
   ```

   For Convex, create a `convex/.env` file:
   ```env
   # Polar.sh Configuration
   POLAR_ACCESS_TOKEN=your_polar_access_token
   FRONTEND_URL=your_frontend_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
react-swc-starter/
├── convex/              # Backend functions and schema
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main application component
├── .env                # Environment variables
└── package.json        # Project dependencies
```

## 🔒 Authentication

Authentication is handled by Clerk, providing:
- Email/password authentication
- Social login providers
- User management
- Session handling

## 💳 Payments

Subscription payments are processed through Polar.sh:
- Secure payment processing
- Subscription management
- Usage-based billing
- Customer portal

### Configuring Polar.sh

1. **Create a Polar.sh Account**
   - Sign up at [Polar.sh](https://polar.sh)
   - Create a new organization
   - Get your API access token from the settings

2. **Set Up Products**
   - Create your subscription products in the Polar.sh dashboard
   - Note down the product IDs for your plans
   - Configure pricing tiers (monthly/yearly)

3. **Configure Webhooks**
   - Set up webhooks in your Polar.sh dashboard
   - Add your Convex backend URL as the webhook endpoint
   - Ensure the following events are enabled:
     - subscription.created
     - subscription.activated
     - subscription.canceled
     - subscription.uncanceled
     - subscription.revoked

4. **Environment Variables**
   - Add your Polar.sh access token to both `.env` and `convex/.env`
   - Ensure your frontend URL is correctly set for success/cancel redirects

## 🗄️ Backend

Convex provides:
- Real-time data synchronization
- Automatic caching
- Type-safe database queries
- Serverless functions
- WebSocket connections

## 🔄 Subscription Flow

The application implements a complete subscription flow:

1. **User Authentication**
   - Users sign in using Clerk authentication
   - User data is stored in Convex

2. **Subscription Selection**
   - Users view available plans on the pricing page
   - Plans are fetched from Polar.sh
   - Monthly and yearly options are available

3. **Checkout Process**
   - Clicking a plan redirects to Polar.sh checkout
   - User completes payment on Polar.sh
   - Successful payment redirects to success page
   - Webhook updates subscription status in Convex

4. **Access Control**
   - Protected routes check subscription status
   - Non-subscribed users are redirected to pricing
   - Subscribed users can access premium features

5. **Subscription Management**
   - Users can manage their subscription via dashboard
   - Cancel/upgrade/downgrade through Polar.sh portal
   - Real-time status updates via webhooks

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Convex](https://convex.dev) for backend services
- [Polar.sh](https://polar.sh) for payment processing
- [Radix UI](https://www.radix-ui.com) for UI components

# Educora Convex

Plataforma de estudo usando IA.

## Sistema de Planos e Assinaturas

O sistema possui três tipos de planos:

1. **Free** - Plano gratuito padrão para novos usuários
   - Acesso limitado a recursos básicos
   - Número limitado de créditos para uso
   - Limite de 1 plano de estudo

2. **Basic** - Plano pago com recursos intermediários
   - Acesso ilimitado a recursos básicos
   - Acesso à IA básica
   - Limite de 3 planos de estudo

3. **Pro** - Plano premium com todos os recursos
   - Acesso ilimitado a todos os recursos
   - Acesso à IA avançada
   - Planos de estudo ilimitados

### Configuração dos Planos

Os planos são identificados por seus price IDs no Stripe. O mapeamento entre price IDs e tipos de plano está definido na constante `PRICE_ID_TO_PLAN_TYPE` no arquivo `convex/subscriptions.ts`.

Para adicionar ou modificar planos:

1. Crie os planos no painel do Stripe
2. Anote os price IDs gerados 
3. Atualize a constante `PRICE_ID_TO_PLAN_TYPE` com os novos IDs
4. Exemplo:
   ```javascript
   const PRICE_ID_TO_PLAN_TYPE = {
     "price_1OLxNxHj62qIVbCe2oLMJ2t5": "basic", // Basic Mensal
     "price_1OLxQ7Hj62qIVbCeKWgW5Vwp": "pro",   // Pro Mensal
   };
   ```

### Verificando Assinaturas de Usuários

Para verificar as permissões de um usuário baseado em seu plano, use a função `getUserPermissions`:

```javascript
const userPermissions = await ctx.runQuery(api.subscriptions.getUserPermissions);
if (userPermissions.tier === "pro") {
  // Permitir recursos premium
}
```

### Solução de Problemas

Se você encontrar problemas com a identificação do tipo de plano:

1. Verifique os logs para ver qual price ID está sendo usado
2. Confirme que o price ID está corretamente mapeado na constante `PRICE_ID_TO_PLAN_TYPE`
3. Se o price ID não for reconhecido, o sistema recorrerá ao valor da assinatura:
   - planos com valor ≥ R$ 19,99 são identificados como "pro"
   - planos com valor < R$ 19,99 são identificados como "basic"

#### Corrigindo assinaturas com planType incorreto

Se assinaturas estiverem sendo criadas com o tipo de plano incorreto:

1. Verifique a função `determinePlanType` em `convex/subscriptions.ts` para garantir que o mapeamento de preços esteja correto
2. Execute a função de manutenção para corrigir assinaturas existentes:
   ```bash
   npx convex run subscriptions:fixSubscriptionPlanTypes
   ```
3. Verifique os logs do Convex para depurar o processo de determinação do tipo de plano

Para facilitar a depuração, o sistema agora registra informações detalhadas nos logs sobre como o tipo de plano é determinado:
- Primeiro tenta usar o mapeamento direto do ID do preço (PRICE_ID_TO_PLAN_TYPE)
- Depois verifica se o nome do ID do preço contém "basic" ou "pro"
- Como último recurso, usa o valor da assinatura (≥ R$ 19,99 = "pro", caso contrário "basic")
