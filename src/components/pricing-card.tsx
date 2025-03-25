import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useAction } from "convex/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { Price, Product } from "@/types/plans";
import { CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Feature {
  included: boolean;
  text: string;
}

interface PricingCardProps {
  price: Price;
  product: Product;
  features?: Feature[];
  description?: string;
}

export function PricingCard({ price, product, features: customFeatures, description: customDescription }: PricingCardProps) {
  const { isLoaded } = useUser();
  const getProCheckoutUrl = useAction(api.subscriptions.createCheckoutSession);

  const handleCheckout = useCallback(async () => {
    try {
      const checkoutInfo = await getProCheckoutUrl({ priceId: price.id });
      if (checkoutInfo) window.location.href = checkoutInfo.url;
    } catch (error) {
      console.error("Failed to get checkout URL:", error);
    }
  }, [getProCheckoutUrl, price.id]);

  const isYearly = price.interval === 'year';
  const intervalText = price.interval === 'month' ? 'mês' : 'ano';
  
  // Verificar o tipo de plano com base no nome do produto ou ID
  const isPro = product.name?.toLowerCase().includes('pro') || product.id?.includes('pro');
  const planName = product.name || (isPro ? 'Educora Pro' : 'Educora Basic');
  
  // Se não foram fornecidos recursos personalizados, usar os padrões baseados no tipo de produto
  const defaultFeatures = [
    {
      included: true,
      text: isPro ? 'Acesso ilimitado à IA Avançada' : 'Acesso a IA Básica'
    },
    {
      included: true,
      text: isPro ? 'Suporte prioritário' : 'Suporte por email'
    },
    {
      included: isPro,
      text: isPro ? 'Crie planos de estudo com IA Avançada' : ''
    },
    {
      included: isPro,
      text: 'Acesso antecipado a novos recursos'
    }
  ];

  // Usar recursos personalizados ou os padrões
  const features = customFeatures || defaultFeatures;

  // Usar desconto apenas em planos anuais
  const showDiscount = isYearly;
  
  // Descrições específicas para cada plano
  const defaultDescription = isPro 
    ? 'Experiência completa para estudantes exigentes' 
    : 'Perfeito para começar a usar nossa plataforma';
    
  // Usar descrição personalizada ou a padrão
  const planDescription = customDescription || defaultDescription;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px]",
      isPro ? "border-2 border-indigo-600" : ""
    )}>
      {showDiscount && (
        <div 
          className="absolute right-0 top-0 h-24 w-24 overflow-hidden"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
          }}
        >
          <span 
            className="absolute top-0 right-0 transform rotate-45 translate-y-[40%] translate-x-[15%] block bg-green-500 text-white py-1 px-3 text-xs font-medium shadow-sm text-center w-full"
          >
            Economize 20%
          </span>
        </div>
      )}

      <CardHeader className={cn(
        "pb-0",
        isPro ? "bg-indigo-50/50" : ""
      )}>
        <CardTitle className="text-xl font-bold">{planName}</CardTitle>
        <CardDescription className="mt-2 text-sm">
          {planDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold tracking-tight text-indigo-700">
            R${(price.amount / 100).toFixed(2)}
          </span>
          <span className="text-lg text-gray-600 ml-1">/{intervalText}</span>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0">
                {feature.included ? (
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                ) : (
                  <X className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <p className="text-sm text-gray-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pb-6 pt-2">
        {isLoaded && (
          <Authenticated>
            <Button
              className={cn(
                "w-full text-white transition-colors",
                isPro ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 hover:bg-gray-700"
              )}
              onClick={handleCheckout}
              size="lg"
            >
              Assinar {planName}
            </Button>
          </Authenticated>
        )}
        <Unauthenticated>
          <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
            <Button 
              className={cn(
                "w-full text-white transition-colors",
                isPro ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 hover:bg-gray-700"
              )}
              size="lg"
            >
              Assinar {planName}
            </Button>
          </SignInButton>
        </Unauthenticated>
      </CardFooter>
    </Card>
  );
} 