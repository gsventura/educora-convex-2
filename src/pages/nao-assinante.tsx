import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Product } from "@/types/plans";

export default function NaoAssinante() {
    const getProducts = useAction(api.subscriptions.getProducts);
    const [products, setProducts] = useState(null)

    useEffect(() => {
        const result = async () => {
            const products = await getProducts();
            
            // Log dos dados recebidos para debug
            console.log("Dados recebidos do Stripe:", JSON.stringify(products, null, 2));
            
            // Filtra planos com preço 0,00
            const filteredProducts = products?.data.filter(plan => plan.amount > 0);
            setProducts(filteredProducts);
            return products;
        }
        result();
    }, []);


    if (!products) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
            </div>
        );
    }
    
    // Log dos produtos filtrados para debug
    console.log("Produtos filtrados:", JSON.stringify(products, null, 2));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Faça o upgrade da sua conta
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Acesse todos os recursos assinando um de nossos planos
                    </p>
                </div>

                <div className="mt-12 flex justify-center">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-7xl">
                        {products?.map((plan) => {
                            // Verificar se product é uma string ou um objeto
                            let productObj: Product;
                            if (typeof plan.product === 'string') {
                                // Se for string, criar um objeto com valores padrão
                                const intervalText = plan.interval === 'month' ? 'mês' : 'ano';
                                productObj = {
                                    id: plan.product,
                                    name: plan.interval === 'month' ? 'Plano Mensal' : 'Plano Anual',
                                    description: `${plan.currency.toUpperCase()} ${(plan.amount / 100).toFixed(2)}/${intervalText}`
                                };
                            } else {
                                // Se for objeto, usar diretamente
                                const intervalText = plan.interval === 'month' ? 'mês' : 'ano';
                                productObj = {
                                    id: plan.product.id,
                                    name: plan.product.name,
                                    description: `${plan.currency.toUpperCase()} ${(plan.amount / 100).toFixed(2)}/${intervalText}`
                                };
                            }
                            
                            // Verificar se é plano Pro baseado no nome
                            const isPro = productObj.name?.toLowerCase().includes('pro');
                            
                            // Definir recursos específicos para cada tipo de plano
                            const planFeatures = isPro ? [
                                { included: true, text: 'Respostas e Questões ilimitadas' },
                                { included: true, text: 'Acesso ilimitado à IA Avançada' },
                                { included: true, text: 'Geração ilimitada de planos de estudo' },
                                { included: true, text: 'Suporte prioritário' }
                            ] : [
                                { included: true, text: 'Respostas e Questões ilimitadas' },
                                { included: true, text: 'Acesso apenas à IA Básica' },
                                { included: false, text: 'Geração de planos de estudo' },
                                { included: false, text: 'Suporte via Email' }
                            ];
                            
                            // Descrições personalizadas
                            const planDescription = isPro
                                ? 'Para quem deseja aproveitar ao máximo a plataforma'
                                : 'Uma ótima maneira de começar a jornada';
                            
                            return (
                                <PricingCard
                                    key={plan.id}
                                    price={{
                                        id: plan.id,
                                        amount: plan.amount,
                                        interval: plan.interval,
                                        currency: plan.currency
                                    }}
                                    product={productObj}
                                    features={planFeatures}
                                    description={planDescription}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
} 