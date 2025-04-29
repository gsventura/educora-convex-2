import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Upload, Image, FileText, Copy, Check, X, AlertTriangle } from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

// Função para processar o texto antes da renderização, protegendo o LaTeX do Markdown
const processContent = (content) => {
  if (!content) return '';
  
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
  inlineMarkers.forEach((formula, idx) => {
    const regex = new RegExp(`%MATH_INLINE_${idx}%`, 'g');
    processedContent = processedContent.replace(regex, `$${formula}$`);
  });
  
  // Restaurar fórmulas em bloco
  blockMarkers.forEach((formula, idx) => {
    const regex = new RegExp(`%MATH_BLOCK_${idx}%`, 'g');
    processedContent = processedContent.replace(regex, `$$${formula}$$`);
  });
  
  // Substituir \text{} por \mathrm{} para melhor compatibilidade
  processedContent = processedContent.replace(/\\text\{([^}]+)\}/g, "\\mathrm{$1}");
  
  return processedContent;
};

// Componente para renderizar Markdown e LaTeX
const MathJaxMarkdown = ({ content }) => {
  if (!content) return null;

  try {
    // Processamos o conteúdo para proteger o LaTeX
    const processedContent = processContent(content);
    
    return (
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
    );
  } catch (error) {
    console.error("Erro ao renderizar:", error);
    // Em caso de erro, mostrar o texto original
    return <div className="text-red-500 whitespace-pre-wrap">{content}</div>;
  }
};

export function AnswerAssistant() {
  const [questionText, setQuestionText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [inputMethod, setInputMethod] = useState("text");
  const [aiModel, setAiModel] = useState("gpt-4.1");
  const [modelError, setModelError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showNewAnswerDialog, setShowNewAnswerDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [showIncorrectAnswerDialog, setShowIncorrectAnswerDialog] = useState(false);
  const [userFeedback, setUserFeedback] = useState("");
  const { toast } = useToast();

  const generateAnswerAction = useAction(api.openai.generateAnswer);
  const saveAnswerMutation = useMutation(api.answers.saveAnswer);

  // Get user's credit information
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);
  const generateAnswerMutation = useMutation(api.answers.generateAnswer);
  const getUserDashboardUrl = useAction(api.subscriptions.getUserDashboardUrl);
  const subscription = useQuery(api.subscriptions.getUserSubscription);

  // Limpar o campo de texto ao mudar o método de entrada
  useEffect(() => {
    if (inputMethod === "text") {
      setQuestionText("");
    }
  }, [inputMethod]);

  // Função para lidar com a mudança do modelo de IA
  const handleModelChange = (model) => {
    setAiModel(model);
    
    if (model === "o3" && userCreditInfo?.tier !== "pro" && userCreditInfo?.tier !== "basic") {
      if (userCreditInfo?.tier === "free" || !userCreditInfo?.tier) {
        setModelError(
          <div>
            O modelo IA Avançada está disponível apenas para assinantes dos planos Basic ou Pro. <a href="/nao-assinante" className="font-bold text-primary underline">Assine agora</a> e comece a usar a IA Avançada.
          </div>
        );
      }
      
      setTimeout(() => {
        setAiModel("gpt-4.1");
      }, 0);
    } else {
      setModelError(null);
    }
  };

  const handleTextSubmit = async () => {
    if (!questionText.trim()) return;

    // Check if user has credits or an active subscription
    if (
      !userCreditInfo?.hasActiveSubscription &&
      (userCreditInfo?.credits || 0) <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Sem créditos disponíveis",
        description: (
          <div>
            Você não tem créditos restantes. <a href="/nao-assinante" className="font-bold text-white underline">Atualize seu plano agora</a> para continuar.
          </div>
        ),
      });
      return;
    }

    // Esconde o formulário imediatamente após clicar
    setShowForm(false);
    setIsProcessing(true);
    setAnswer("");
    setProcessingStatus("Preparando sua questão...");

    try {
      // Atualiza status
      setProcessingStatus("Gerando resposta com IA...");
      
      // Instruções simples com foco em LaTeX correto, incluindo formatos alternativos
      const enhancedQuestionText = `${questionText}

Por favor, formate sua resposta usando Markdown e siga estas instruções precisas para expressões matemáticas:

1. Use LaTeX para todas as fórmulas matemáticas.
2. Para expressões inline simples, use SEMPRE um único cifrão: $x^2 + y^2$
   - NÃO use o formato \\( ... \\)
3. Para equações em bloco, use SEMPRE cifrão duplo: $$V = \\frac{4}{3}\\pi r^3$$
   - NÃO use o formato \\[ ... \\]
4. Para frações, use a sintaxe \\frac{numerador}{denominador}
5. Para texto dentro de fórmulas, use \\mathrm{} em vez de \\text{}
   Exemplo: $\\mathrm{cm}$ em vez de $\\text{cm}$
6. Exemplos de uso correto:
   - Uma fração em bloco: $$\\frac{1}{3}$$
   - Uma equação com fração: $$V = \\frac{1}{3}\\pi r^2 h$$
   - Fração com variáveis: $$P \\cdot \\frac{5}{3} = \\frac{2}{9} \\cdot 0{,}08 \\cdot 300$$
   - Raio com unidade: $R = 10 \\, \\mathrm{cm}$

7. IMPORTANTE: Sempre deixe um espaço após a fração e antes de qualquer outro símbolo
   - CORRETO: $$\\frac{1}{2} \\cdot x$$
   - EVITE: $$\\frac{1}{2}\\cdot x$$

8. Para garantir a compatibilidade, sempre use \\cdot para multiplicação em vez de \\times

Sua resposta deve ser clara e direta.`;
      
      // Chamar a API
      const aiResponse = await generateAnswerAction({
        questionText: enhancedQuestionText,
        model: aiModel,
      });

      // Atualiza status
      setProcessingStatus("Salvando resultado...");
      
      // Enviar para o backend
      const answerResponse = await generateAnswerMutation({
        questionText,
        imageUrl: "",
        aiResponse,
        model: aiModel,
      });

      // Mostrar resposta
      setAnswer(aiResponse);
      setIsProcessing(false);
      setProcessingStatus("");

      // Mostrar créditos restantes
      if (
        !userCreditInfo?.hasActiveSubscription &&
        answerResponse.remainingCredits
      ) {
        console.log(`Credits remaining: ${answerResponse.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error generating answer:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar resposta. Por favor, tente novamente.",
      });
      // Em caso de erro, mostrar o formulário novamente
      setShowForm(true);
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleImageSubmit = async () => {
    if (!uploadedImage) return;

    // Check if user has credits or an active subscription
    if (
      !userCreditInfo?.hasActiveSubscription &&
      (userCreditInfo?.credits || 0) <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Sem créditos disponíveis",
        description: (
          <div>
            Você não tem créditos restantes. <a href="/nao-assinante" className="font-bold text-white underline">Atualize seu plano agora</a> para continuar.
          </div>
        ),
      });
      return;
    }

    // Esconde o formulário imediatamente após clicar
    setShowForm(false);
    setIsProcessing(true);
    setAnswer("");
    setProcessingStatus("Preparando imagem para análise...");

    try {
      // Atualiza status
      setProcessingStatus("Analisando imagem com IA avançada...");
      
      // Texto padrão com instruções simples
      const defaultQuestion = "Analise esta imagem e explique detalhadamente o que vê";
      const enhancedQuestionText = `${questionText || defaultQuestion}

Por favor, formate sua resposta usando Markdown e siga estas instruções precisas para expressões matemáticas:

1. Use LaTeX para todas as fórmulas matemáticas.
2. Para expressões inline simples, use SEMPRE um único cifrão: $x^2 + y^2$
   - NÃO use o formato \\( ... \\)
3. Para equações em bloco, use SEMPRE cifrão duplo: $$V = \\frac{4}{3}\\pi r^3$$
   - NÃO use o formato \\[ ... \\]
4. Para frações, use a sintaxe \\frac{numerador}{denominador}
5. Para texto dentro de fórmulas, use \\mathrm{} em vez de \\text{}
   Exemplo: $\\mathrm{cm}$ em vez de $\\text{cm}$
6. Exemplos de uso correto:
   - Uma fração em bloco: $$\\frac{1}{3}$$
   - Uma equação com fração: $$V = \\frac{1}{3}\\pi r^2 h$$
   - Fração com variáveis: $$P \\cdot \\frac{5}{3} = \\frac{2}{9} \\cdot 0{,}08 \\cdot 300$$
   - Raio com unidade: $R = 10 \\, \\mathrm{cm}$

7. IMPORTANTE: Sempre deixe um espaço após a fração e antes de qualquer outro símbolo
   - CORRETO: $$\\frac{1}{2} \\cdot x$$
   - EVITE: $$\\frac{1}{2}\\cdot x$$

8. Para garantir a compatibilidade, sempre use \\cdot para multiplicação em vez de \\times

Sua resposta deve ser clara e direta.`;
      
      // Chamar a API
      const aiResponse = await generateAnswerAction({
        questionText: enhancedQuestionText,
        imageUrl: uploadedImage,
        model: aiModel,
      });
      
      // Atualizar status
      setProcessingStatus("Salvando resultado...");
      
      // Enviar para o backend
      const answerResponse = await generateAnswerMutation({
        questionText: questionText || "Análise de imagem",
        imageUrl: uploadedImage,
        aiResponse,
        model: aiModel,
      });

      // Mostrar resposta
      setAnswer(aiResponse);
      setIsProcessing(false);
      setProcessingStatus("");

      // Mostrar créditos restantes
      if (
        !userCreditInfo?.hasActiveSubscription &&
        answerResponse.remainingCredits
      ) {
        console.log(`Credits remaining: ${answerResponse.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao processar a imagem. Por favor, tente novamente.",
      });
      // Em caso de erro, mostrar o formulário novamente
      setShowForm(true);
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar o tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, envie uma imagem nos formatos: JPG, PNG, GIF ou WebP.",
      });
      return;
    }
    
    // Verificar o tamanho do arquivo (limite de 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB. Por favor, reduza o tamanho da imagem e tente novamente.",
      });
      return;
    }
    
    // Processar o upload
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erro de leitura",
        description: "Não foi possível ler o arquivo. Por favor, tente novamente com outra imagem.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (inputMethod === "text") {
      handleTextSubmit();
    } else {
      handleImageSubmit();
    }
  };

  const handleNewAnswer = () => {
    if (answer) {
      setShowNewAnswerDialog(true);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setUploadedImage(null);
    setAnswer("");
    setShowForm(true);
  };

  const handleSaveAnswer = () => {
    if (!answer) return;
    // Inicializar tags com o tipo de entrada
    const initialTag = inputMethod === "text" ? "texto" : "imagem";
    setSelectedTags([initialTag]);
    setShowSaveDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      // Salvar a resposta no banco de dados com as tags selecionadas
      await saveAnswerMutation({
        questionText,
        answer,
        tags: selectedTags,
      });

      // Fechar o diálogo
      setShowSaveDialog(false);
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Resposta salva",
        description: "Sua resposta foi salva com sucesso.",
      });
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao salvar resposta. Por favor, tente novamente.",
      });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(answer)
      .then(() => {
        setCopySuccess(true);
        toast({
          title: "Copiado!",
          description: "A resposta foi copiada para a área de transferência.",
        });
        
        // Reset copy success after 2 seconds
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((error) => {
        console.error("Erro ao copiar: ", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível copiar a resposta.",
        });
      });
  };

  // Função para adicionar tag personalizada
  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  // Função para remover tag
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Nova função específica para regenerar respostas com feedback do usuário
  const createEnhancedPromptWithFeedback = (originalQuestion, feedback = "") => {
    const basePrompt = `${originalQuestion}

Por favor, formate sua resposta usando Markdown e siga estas instruções precisas para expressões matemáticas:

1. Use LaTeX para todas as fórmulas matemáticas.
2. Para expressões inline simples, use SEMPRE um único cifrão: $x^2 + y^2$
   - NÃO use o formato \\( ... \\)
3. Para equações em bloco, use SEMPRE cifrão duplo: $$V = \\frac{4}{3}\\pi r^3$$
   - NÃO use o formato \\[ ... \\]
4. Para frações, use a sintaxe \\frac{numerador}{denominador}
5. Para texto dentro de fórmulas, use \\mathrm{} em vez de \\text{}
   Exemplo: $\\mathrm{cm}$ em vez de $\\text{cm}$
6. Exemplos de uso correto:
   - Uma fração em bloco: $$\\frac{1}{3}$$
   - Uma equação com fração: $$V = \\frac{1}{3}\\pi r^2 h$$
   - Fração com variáveis: $$P \\cdot \\frac{5}{3} = \\frac{2}{9} \\cdot 0{,}08 \\cdot 300$$
   - Raio com unidade: $R = 10 \\, \\mathrm{cm}$

7. IMPORTANTE: Sempre deixe um espaço após a fração e antes de qualquer outro símbolo
   - CORRETO: $$\\frac{1}{2} \\cdot x$$
   - EVITE: $$\\frac{1}{2}\\cdot x$$

8. Para garantir a compatibilidade, sempre use \\cdot para multiplicação em vez de \\times

IMPORTANTE: Esta é uma segunda tentativa. A resposta anterior foi marcada como incorreta ou incompleta pelo usuário.
Analise o problema novamente com uma abordagem diferente ou mais cuidadosa, verificando seus cálculos, raciocínio e metodologia.`;

    // Adicionar feedback do usuário se fornecido
    if (feedback && feedback.trim()) {
      return `${basePrompt}

Feedback específico do usuário sobre o erro na resposta anterior:
"${feedback.trim()}"

Leve em consideração este feedback ao formular sua nova resposta. Tente abordar diretamente os pontos mencionados pelo usuário.`;
    }

    return basePrompt;
  };

  const handleMarkAsIncorrect = () => {
    // Reset feedback when opening dialog
    setUserFeedback("");
    // Abrir o diálogo de confirmação
    setShowIncorrectAnswerDialog(true);
  };

  const handleRegenerateAnswer = async () => {
    // Fechar o diálogo
    setShowIncorrectAnswerDialog(false);
    
    // Reiniciar processamento
    setIsProcessing(true);
    setAnswer("");
    setProcessingStatus("Tentando gerar uma nova resposta...");

    try {
      // Reaproveitar o método de submissão correto baseado no tipo de entrada
      if (inputMethod === "text") {
        // Mostrar que estamos regenerando
        setProcessingStatus("Gerando nova resposta para o texto...");
        
        // Usar a nova função para criar o prompt melhorado
        const enhancedQuestionText = createEnhancedPromptWithFeedback(questionText, userFeedback);
        
        // Chamar a API
        const aiResponse = await generateAnswerAction({
          questionText: enhancedQuestionText,
          model: aiModel,
        });
        
        // Atualiza status
        setProcessingStatus("Salvando resultado...");
        
        // Enviar para o backend
        const answerResponse = await generateAnswerMutation({
          questionText,
          imageUrl: "",
          aiResponse,
          model: aiModel,
        });

        // Mostrar resposta
        setAnswer(aiResponse);
      } else {
        // Processar imagem
        setProcessingStatus("Analisando imagem novamente com IA avançada...");
        
        // Texto padrão com instruções simples
        const defaultQuestion = "Analise esta imagem e explique detalhadamente o que vê";
        
        // Usar a nova função para criar o prompt melhorado
        const enhancedQuestionText = createEnhancedPromptWithFeedback(
          questionText || defaultQuestion, 
          userFeedback
        );
        
        // Chamar a API
        const aiResponse = await generateAnswerAction({
          questionText: enhancedQuestionText,
          imageUrl: uploadedImage,
          model: aiModel,
        });
        
        // Atualizar status
        setProcessingStatus("Salvando resultado...");
        
        // Enviar para o backend
        const answerResponse = await generateAnswerMutation({
          questionText: questionText || "Análise de imagem",
          imageUrl: uploadedImage,
          aiResponse,
          model: aiModel,
        });

        // Mostrar resposta
        setAnswer(aiResponse);
      }
      
      // Finalizar processamento
      setIsProcessing(false);
      setProcessingStatus("");
      
      // Limpar feedback
      setUserFeedback("");
      
      // Notificar usuário
      toast({
        title: "Nova resposta gerada",
        description: "Esperamos que esta resposta esteja mais precisa. Verifique o resultado."
      });
    } catch (error) {
      console.error("Error regenerating answer:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar nova resposta. Por favor, tente novamente.",
      });
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: katexStyles }} />
      
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Gerar Correções</CardTitle>
            <CardDescription>
              Faça upload de texto ou imagens para receber explicações e correções geradas pela IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aiModel">Modelo de IA</Label>
              <Select 
                value={aiModel} 
                onValueChange={handleModelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo de IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4.1">IA Básica</SelectItem>
                  <SelectItem value="o3">
                    IA Avançada {userCreditInfo?.tier !== "pro" && userCreditInfo?.tier !== "basic" && "(Pro/Basic)"}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {modelError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{modelError}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <Tabs
              value={inputMethod}
              onValueChange={(value) => setInputMethod(value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Texto</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>Imagem</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 pt-4">
                <Textarea
                  placeholder="Digite sua questão ou problema aqui..."
                  rows={6}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="image" className="space-y-4 pt-4">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                  {uploadedImage ? (
                    <div className="space-y-4 w-full">
                      <img
                        src={uploadedImage}
                        alt="Uploaded question"
                        className="max-h-64 mx-auto object-contain rounded-lg"
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setUploadedImage(null)}
                      >
                        Remover Imagem
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Arraste e solte uma imagem, ou clique para navegar
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          asChild
                        >
                          <span>Upload de Imagem</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>
                
                {uploadedImage && (
                  <div className="space-y-2">
                    <Label htmlFor="image-question">Pergunta (opcional)</Label>
                    <Textarea
                      id="image-question"
                      placeholder="Descreva sua pergunta sobre a imagem ou deixe em branco para uma análise geral..."
                      rows={3}
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              onClick={handleSubmit}
              disabled={
                inputMethod === "text"
                  ? !questionText.trim()
                  : !uploadedImage || isProcessing
              }
              className="w-full sm:w-auto"
            >
              {isProcessing ? "Processando..." : "Gerar Resposta"}
            </Button>
            <p className="text-xs text-muted-foreground">
              IAs podem cometer erros. Sempre confirme o que a Educora gera. Em caso de problemas com erros, entre em contato conosco pelo{" "}
              <a 
                href="mailto:ola@educora.com.br" 
                className="text-primary hover:underline"
              >
                ola@educora.com.br
              </a>
            </p>
          </CardFooter>
        </Card>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center py-8 space-y-4">
          <LoadingSpinner />
          {processingStatus && (
            <p className="text-sm text-muted-foreground">{processingStatus}</p>
          )}
        </div>
      )}

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>Resposta & Explicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-200">
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <MathJaxMarkdown content={answer} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex w-full flex-wrap justify-between sm:w-auto sm:gap-2">
              <Button variant="outline" onClick={handleNewAnswer}>
                Gerar Nova Resposta
              </Button>
              <Button 
                variant="outline" 
                onClick={handleMarkAsIncorrect} 
                className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Resposta Incorreta</span>
              </Button>
              <Button onClick={handleSaveAnswer}>Salvar Resposta</Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopyToClipboard}
                      aria-label="Copiar resposta"
                      className="ml-2"
                    >
                      {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copySuccess ? "Copiado!" : "Copiar resposta"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground">
              IAs podem cometer erros. Sempre confirme o que a Educora gera. Em caso de problemas com erros, entre em contato conosco pelo{" "}
              <a 
                href="mailto:ola@educora.com.br" 
                className="text-primary hover:underline"
              >
                ola@educora.com.br
              </a>
            </p>
          </CardFooter>
        </Card>
      )}

      {/* Diálogo para Marcar Resposta como Incorreta */}
      <Dialog open={showIncorrectAnswerDialog} onOpenChange={setShowIncorrectAnswerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Resposta Incorreta</DialogTitle>
            <DialogDescription>
              Você está marcando esta resposta como incorreta. Isso nos ajuda a melhorar.
              Gostaríamos de gerar uma nova resposta para a mesma pergunta, que pode ter uma 
              abordagem melhor ou corrigir erros anteriores.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Alert className="bg-amber-50 dark:bg-amber-950">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Gerar uma nova resposta pode ajudar a chegar em um resultado mais preciso. 
                A IA pode usar uma abordagem diferente para resolver seu problema.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">
                Explique o que estava errado na resposta (opcional)
              </Label>
              <Textarea
                id="feedback"
                placeholder="Ex: O cálculo da derivada está errado, a fórmula usada não se aplica nesse contexto..."
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Seu feedback ajudará a IA a gerar uma resposta mais precisa.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIncorrectAnswerDialog(false)}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleRegenerateAnswer}>
              Marcar e Gerar Nova Resposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Salvar Resposta com Tags */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Resposta</DialogTitle>
            <DialogDescription>
              Adicione tags para organizar e encontrar esta resposta mais tarde.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 px-3 py-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Adicione uma tag personalizada"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <Button onClick={addCustomTag} type="button" variant="outline">
                Adicionar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSave}>Salvar Resposta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Answer Confirmation Dialog */}
      <Dialog open={showNewAnswerDialog} onOpenChange={setShowNewAnswerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Nova Resposta</DialogTitle>
            <DialogDescription>
              Deseja gerar outra resposta? A resposta atual será perdida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAnswerDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setShowNewAnswerDialog(false);
              resetForm();
            }}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
