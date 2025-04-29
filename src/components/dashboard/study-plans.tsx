import { useState, useEffect, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MoreVertical,
  Plus,
  BookOpen,
  Trash,
  Edit,
  Lock,
} from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// Componente pesado carregado de forma lazy
const ReactMarkdown = lazy(() => import("react-markdown"));

// CSS básico para KaTeX - mantendo simples para evitar conflitos
const katexStyles = `
  .katex {
    font-size: 1.1em;
    font-weight: normal;
  }
  
  .katex-display {
    display: block;
    margin: 1em 0;
    text-align: center;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .dark .katex, .dark .katex-display {
    color: #d4d4d8;
  }
`;

// Cache para o processamento do conteúdo
const contentCache = new Map<string, string>();

// Função para processar o texto antes da renderização, protegendo o LaTeX do Markdown
const processContent = (content: string): string => {
  if (!content) return '';
  
  // Verificar se já processamos este conteúdo exato
  if (contentCache.has(content)) {
    return contentCache.get(content) || '';
  }
  
  // Vamos usar uma abordagem diferente, mais direta, para garantir que as fórmulas sejam preservadas
  
  // Primeiro, vamos proteger temporariamente as fórmulas em bloco ($$...$$)
  const blockMarkers = [];
  let processedContent = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    blockMarkers.push(formula);
    return `%MATH_BLOCK_${blockMarkers.length - 1}%`;
  });
  
  // Proteger também o formato \[ ... \] para equações em bloco
  processedContent = processedContent.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => {
    blockMarkers.push(formula);
    return `%MATH_BLOCK_${blockMarkers.length - 1}%`;
  });
  
  // Depois, proteger as fórmulas inline ($...$)
  const inlineMarkers = [];
  processedContent = processedContent.replace(/\$([^\n$]*?)\$/g, (match, formula) => {
    inlineMarkers.push(formula);
    return `%MATH_INLINE_${inlineMarkers.length - 1}%`;
  });
  
  // Proteger também o formato \( ... \) para inline math
  processedContent = processedContent.replace(/\\\(([\s\S]*?)\\\)/g, (match, formula) => {
    inlineMarkers.push(formula);
    return `%MATH_INLINE_${inlineMarkers.length - 1}%`;
  });
  
  // Agora, restauramos as fórmulas na ordem inversa para evitar conflitos
  // Restaurar fórmulas inline
  for (let idx = 0; idx < inlineMarkers.length; idx++) {
    const regex = new RegExp(`%MATH_INLINE_${idx}%`, 'g');
    processedContent = processedContent.replace(regex, `$${inlineMarkers[idx]}$`);
  }
  
  // Restaurar fórmulas em bloco
  for (let idx = 0; idx < blockMarkers.length; idx++) {
    const regex = new RegExp(`%MATH_BLOCK_${idx}%`, 'g');
    processedContent = processedContent.replace(regex, `$$${blockMarkers[idx]}$$`);
  }
  
  // Substituir \text{} por \mathrm{} para melhor compatibilidade
  processedContent = processedContent.replace(/\\text\{([^}]+)\}/g, "\\mathrm{$1}");
  
  // Armazenar em cache para evitar reprocessamento
  contentCache.set(content, processedContent);
  
  return processedContent;
};

// Importar KaTeX CSS apenas quando necessário
const loadKatexCSS = () => {
  if (!document.getElementById("katex-css")) {
    import("katex/dist/katex.min.css").then(() => {
      const link = document.createElement("style");
      link.id = "katex-css";
      link.innerHTML = katexStyles;
      document.head.appendChild(link);
    });
  }
};

// Componente para renderizar Markdown e LaTeX
interface MathJaxMarkdownProps {
  content: string;
}

const MathJaxMarkdownFallback = () => (
  <div className="animate-pulse bg-gray-200 h-40 rounded w-full"></div>
);

const MathJaxMarkdown = React.memo(({ content }: MathJaxMarkdownProps) => {
  if (!content) return null;

  // Carregar CSS do KaTeX quando componente for renderizado
  React.useEffect(() => {
    loadKatexCSS();
  }, []);

  try {
    // Processamos o conteúdo para proteger o LaTeX
    const processedContent = processContent(content);
    
    return (
      <Suspense fallback={<MathJaxMarkdownFallback />}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            [rehypeKatex, {
              throwOnError: false,
              strict: "ignore",
              output: "html",
              displayMode: true,
              trust: true
            }],
            rehypeRaw
          ]}
          components={{
            // Corrigindo os erros de tipagem
            p: (props) => <p className="my-2 leading-7" {...props} />,
            code: ({className, children, ...props}) => {
              const isInline = !className || !className.includes('language-');
              return isInline ? 
                <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800" {...props}>{children}</code> : 
                <pre className="rounded bg-gray-100 p-4 overflow-x-auto dark:bg-gray-800">
                  <code className={className} {...props}>{children}</code>
                </pre>;
            }
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </Suspense>
    );
  } catch (error) {
    console.error("Erro ao renderizar:", error);
    // Em caso de erro, mostrar o texto original
    return <div className="text-red-500 whitespace-pre-wrap">{content}</div>;
  }
});

interface StudyPlan {
  id: string;
  title: string;
  content: string;
  truncatedContent?: string;
  createdAt: Date;
}

export function StudyPlans() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [planTitle, setPlanTitle] = useState("");
  const [savedPlans, setSavedPlans] = useState<StudyPlan[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<StudyPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [visiblePlans, setVisiblePlans] = useState(6); // Mostrar apenas 6 planos inicialmente

  const generateStudyPlanAction = useAction(api.openai.generateStudyPlan);
  const saveStudyPlanMutation = useMutation(api.studyPlans.saveStudyPlan);

  // Get user's credit information
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);
  const generateStudyPlanMutation = useMutation(
    api.studyPlans.generateStudyPlan,
  );
  const getDashboardUrl = useAction(api.subscriptions.getUserDashboardUrl);
  const subscription = useQuery(api.subscriptions.getUserSubscription);
  
  // Carregar planos de estudo do usuário
  const userStudyPlans = useQuery(api.studyPlans.getUserStudyPlans);
  const deleteStudyPlanMutation = useMutation(api.studyPlans.deleteStudyPlan);
  const updateStudyPlanMutation = useMutation(api.studyPlans.updateStudyPlan);

  const isPro = userCreditInfo?.tier === "pro";
  
  // Otimização: evitar manipulação de dados a cada renderização
  const formattedPlans = React.useMemo(() => {
    if (!userStudyPlans) return [];
    return userStudyPlans.map((plan) => {
      // Pré-processar o conteúdo truncado para melhorar performance
      const truncatedContent = plan.content.substring(0, 300) + (plan.content.length > 300 ? "..." : "");
      return {
        id: plan._id,
        title: plan.title,
        content: plan.content,
        truncatedContent,
        createdAt: new Date(plan.createdAt),
      };
    });
  }, [userStudyPlans]);

  // Substituir o useEffect pelo useMemo para evitar re-renderização
  React.useEffect(() => {
    if (formattedPlans.length > 0) {
      setSavedPlans(formattedPlans);
    }
  }, [formattedPlans]);

  // Carregar KaTeX CSS apenas quando necessário e uma única vez no carregamento
  React.useEffect(() => {
    loadKatexCSS();
  }, []);

  const handleManageSubscription = async () => {
    try {
      // Redirecionar para página de não assinante se usuário estiver no plano gratuito
      if (userCreditInfo?.tier === "free") {
        window.location.href = "/nao-assinante";
        return;
      }
      
      // Se não for free e tiver customerId, direcionamos para o Stripe
      if (subscription?.customerId) {
        const result = await getDashboardUrl({
          customerId: subscription.customerId
        });
        if (result?.url) {
          window.location.href = result.url;
        }
      } else {
        console.error("Erro: customerId não encontrado para o usuário basic");
      }
    } catch (error) {
      console.error("Erro ao obter URL do dashboard:", error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Check if user has credits or an active subscription
    if (
      !userCreditInfo?.hasActiveSubscription &&
      (userCreditInfo?.credits || 0) <= 0
    ) {
      // Diferencia redirecionamento conforme o tier do usuário
      if (userCreditInfo?.tier === "basic") {
        // Usuários Basic vão para o Stripe
        handleManageSubscription();
      } else {
        // Usuários Free vão para /nao-assinante
        window.location.href = "/nao-assinante";
      }
      return;
    }

    // Fechar o diálogo
    setShowNewPlanDialog(false);
    
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      // Call the OpenAI action to generate a study plan
      const aiResponse = await generateStudyPlanAction({
        prompt,
        model: "o3-2025-04-16",
      });

      // Agora enviamos o aiResponse para o backend
      const planResponse = await generateStudyPlanMutation({
        prompt,
        aiResponse,
        model: "o3-2025-04-16",
      });

      setGeneratedPlan(aiResponse);

      // Show remaining credits if user is on free plan
      if (
        !userCreditInfo?.hasActiveSubscription &&
        planResponse.remainingCredits
      ) {
        console.log(`Credits remaining: ${planResponse.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
      alert("Falha ao gerar plano de estudo. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan || !planTitle.trim()) return;

    try {
      // Save the study plan to the database
      const planId = await saveStudyPlanMutation({
        title: planTitle,
        content: generatedPlan,
        prompt: prompt,
        model: "o3-2025-04-16",
      });

      // Close dialog and reset form
      setShowSaveDialog(false);
      setGeneratedPlan(null);
      setPrompt("");
      setPlanTitle("");
      
      // Planos serão atualizados automaticamente pelo useQuery
    } catch (error) {
      console.error("Error saving study plan:", error);
      alert("Falha ao salvar plano de estudo. Por favor, tente novamente.");
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      // Delete from database
      await deleteStudyPlanMutation({
        planId: id as any,
      });
      
      // O plano será removido automaticamente pela atualização do useQuery
    } catch (error) {
      console.error("Error deleting study plan:", error);
      alert("Falha ao excluir plano de estudo. Por favor, tente novamente.");
    }
  };

  const handleEditPlan = (plan: StudyPlan) => {
    setEditingPlan(plan);
    setEditTitle(plan.title);
    setEditContent(plan.content);
  };

  const handleSaveEdit = async () => {
    if (!editingPlan) return;
    
    try {
      await updateStudyPlanMutation({
        planId: editingPlan.id as any,
        title: editTitle,
        content: editContent,
      });
      
      // Reset editing state
      setEditingPlan(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error("Error updating study plan:", error);
      alert("Falha ao atualizar plano de estudo. Por favor, tente novamente.");
    }
  };

  // Se o usuário não for Pro, exibe tela específica baseada no tier
  if (!isPro) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Planos de Estudo</h2>
        </div>
        
        <div className="text-center py-12 bg-white rounded-xl shadow-sm p-10">
          <Lock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-3">
            Recurso exclusivo para assinantes Pro
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Os planos de estudo personalizados criados por nossa IA Avançada estão disponíveis apenas para assinantes do plano Pro. 
            Atualize agora para acessar este e outros recursos exclusivos.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6"
            onClick={() => {
              // Usuários Basic vão para o Stripe, usuários Free vão para /nao-assinante
              if (userCreditInfo?.tier === "basic") {
                handleManageSubscription();
              } else {
                window.location.href = "/nao-assinante";
              }
            }}
          >
            Faça upgrade para o plano Pro
          </Button>
        </div>
      </div>
    );
  }

  // Otimização: Componente de cartão do plano com memoização para evitar renderização desnecessária
  const PlanCard = React.memo(({ plan }: { plan: StudyPlan }) => (
    <Card key={plan.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEditPlan(plan)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeletePlan(plan.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{plan.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>4 semanas</span>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            IA Avançada
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-40 overflow-hidden relative">
          <div className="whitespace-pre-line text-sm text-gray-700">
            <MathJaxMarkdown content={plan.truncatedContent || ''} />
          </div>
          {plan.content.length > 300 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => setViewingPlan(plan)}
        >
          <BookOpen className="h-4 w-4" />
          <span>Ver Plano Completo</span>
        </Button>
      </CardFooter>
    </Card>
  ));

  // Carregar mais planos
  const loadMorePlans = React.useCallback(() => {
    setVisiblePlans(prev => prev + 6);
  }, []);

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: katexStyles }} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planos de Estudo</h2>
        <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Novo Plano</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Plano de Estudo</DialogTitle>
              <DialogDescription>
                Converse com nossa IA Avançada para criar um plano de estudos personalizado e tecnicamente detalhado. 
                Os planos são gerados usando nossa IA Avançada e suportam formatação Markdown e expressões matemáticas em LaTeX.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Descreva com detalhes: 
1. Objetivo específico de aprendizado (ex: 'Me preparar para prova de Cálculo III sobre integrais múltiplas e teorema de Stokes')
2. Seu nível atual de conhecimento no assunto
3. Tempo disponível por dia/semana
4. Recursos que você já possui (livros, cursos)
5. Dificuldades específicas que você enfrenta
6. Prazo/data de conclusão desejada"
                rows={8}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">Dicas para prompts mais eficazes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Seja específico sobre o assunto e subtópicos</li>
                  <li>Mencione seu nível (iniciante, intermediário, avançado)</li>
                  <li>Indique objetivos concretos (passar em exame, aprender habilidade)</li>
                  <li>Informe restrições de tempo ou prazos importantes</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? "Gerando..." : "Gerar Plano"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isGenerating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {generatedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Plano de Estudos Gerado</CardTitle>
            <CardDescription>
              Criado com IA Avançada baseado em seus objetivos e requisitos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <MathJaxMarkdown content={generatedPlan} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
              Descartar
            </Button>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button>Salvar Plano</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Salvar Plano de Estudos</DialogTitle>
                  <DialogDescription>
                    Dê um nome ao seu plano de estudos gerado por IA Avançada para salvá-lo para referência futura.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Título do Plano de Estudos"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSavePlan} disabled={!planTitle.trim()}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}

      {savedPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPlans.slice(0, visiblePlans).map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
          {savedPlans.length > visiblePlans && (
            <div className="col-span-full">
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={loadMorePlans}
              >
                Carregar mais planos
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal para visualizar o plano completo - Otimizado com Lazy Loading */}
      {viewingPlan && (
        <Dialog open={!!viewingPlan} onOpenChange={(open) => !open && setViewingPlan(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewingPlan.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Criado em {viewingPlan.createdAt.toLocaleDateString()}</span>
              </DialogDescription>
            </DialogHeader>
            <Suspense fallback={<MathJaxMarkdownFallback />}>
              <div className="max-h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  <MathJaxMarkdown content={viewingPlan.content} />
                </div>
              </div>
            </Suspense>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingPlan(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para editar plano */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Editar Plano de Estudos</DialogTitle>
              <DialogDescription>
                Modifique seu plano de estudos conforme necessário.
                O editor suporta formatação Markdown e expressões matemáticas em LaTeX.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Título do Plano de Estudos"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Editar</TabsTrigger>
                  <TabsTrigger value="preview">Visualizar</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-2">
                  <Textarea
                    placeholder="Conteúdo do Plano de Estudos"
                    rows={12}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="font-mono"
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-2">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border h-[300px] overflow-y-auto">
                    <div className="prose prose-gray max-w-none dark:prose-invert">
                      <MathJaxMarkdown content={editContent} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={!editTitle.trim()}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {savedPlans.length === 0 && !generatedPlan && !isGenerating && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Nenhum plano de estudos ainda
          </h3>
          <p className="text-gray-600 mb-4">
            Crie seu primeiro plano de estudos personalizado com IA Avançada para começar
          </p>
          <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
            <DialogTrigger asChild>
              <Button>Criar Plano de Estudos</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Plano de Estudo</DialogTitle>
                <DialogDescription>
                  Converse com nossa IA Avançada para criar um plano de estudos personalizado e tecnicamente detalhado.
                  Os planos são gerados com o modelo de IA Avançada e suportam formatação Markdown e expressões matemáticas em LaTeX.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Descreva com detalhes: 
1. Objetivo específico de aprendizado (ex: 'Me preparar para prova de Cálculo III sobre integrais múltiplas e teorema de Stokes')
2. Seu nível atual de conhecimento no assunto
3. Tempo disponível por dia/semana
4. Recursos que você já possui (livros, cursos)
5. Dificuldades específicas que você enfrenta
6. Prazo/data de conclusão desejada"
                  rows={8}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="text-sm text-gray-500">
                  <p className="font-medium mb-1">Dicas para prompts mais eficazes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Seja específico sobre o assunto e subtópicos</li>
                    <li>Mencione seu nível (iniciante, intermediário, avançado)</li>
                    <li>Indique objetivos concretos (passar em exame, aprender habilidade)</li>
                    <li>Informe restrições de tempo ou prazos importantes</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                >
                  {isGenerating ? "Gerando..." : "Gerar Plano"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
