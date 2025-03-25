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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function QuestionGenerator() {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [aiModel, setAiModel] = useState<string>("gpt-4o");
  const [modelError, setModelError] = useState<React.ReactNode | null>(null);
  const [showForm, setShowForm] = useState(true);
  const { toast } = useToast();

  // Connect to Convex actions and mutations
  const generateQuestionAction = useAction(api.openai.generateQuestion);
  const saveQuestionMutation = useMutation(api.questions.saveQuestion);
  const generateQuestionsMutation = useMutation(
    api.questions.generateQuestions,
  );

  // Get subjects from Convex
  const subjects = useQuery(api.subjects.getAllSubjects);

  // Seed subjects if needed
  const seedSubjectsMutation = useMutation(api.subjects.seedSubjects);

  useEffect(() => {
    // Seed subjects when component mounts if they don't exist
    seedSubjectsMutation();
  }, [seedSubjectsMutation]);

  // Get user's credit information
  const userCreditInfo = useQuery(api.users.getUserCreditInfo);
  const getUserDashboardUrl = useAction(api.subscriptions.getUserDashboardUrl);
  const subscription = useQuery(api.subscriptions.getUserSubscription);

  // Verificar se o usuário pode usar o modelo selecionado com base no plano
  useEffect(() => {
    // Verificamos apenas na inicialização do componente
    if (aiModel === "o3-mini" && userCreditInfo?.tier !== "pro") {
      setAiModel("gpt-4o");
    }
  }, [userCreditInfo?.tier]);

  // Função para lidar com a mudança do modelo de IA
  const handleModelChange = (model: string) => {
    // Primeiro definimos o modelo solicitado para permitir a verificação no useEffect
    setAiModel(model);
    
    // Se o usuário não for Pro e tentar selecionar o modelo avançado,
    // vamos definir explicitamente a mensagem de erro aqui também
    if (model === "o3-mini" && userCreditInfo?.tier !== "pro") {
      if (userCreditInfo?.tier === "free" || !userCreditInfo?.tier) {
        setModelError(
          <div>
            O modelo IA Avançada está disponível apenas para assinantes do plano Pro. <a href="/nao-assinante" className="font-bold text-primary underline">Assine agora</a> e comece a usar a IA Avançada.
          </div>
        );
      } else if (userCreditInfo?.tier === "basic") {
        setModelError(
          <div>
            O modelo IA Avançada está disponível apenas para assinantes do plano Pro. <a 
              href="#" 
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const result = await getUserDashboardUrl({
                    customerId: subscription?.customerId || ""
                  });
                  if (result?.url) {
                    window.location.href = result.url;
                  }
                } catch (error) {
                  console.error("Error getting dashboard URL:", error);
                }
              }}
              className="font-bold text-primary underline"
            >
              Atualize seu plano
            </a> para continuar.
          </div>
        );
      }
      
      // Após exibir o erro, voltamos ao modelo básico
      setTimeout(() => {
        setAiModel("gpt-4o");
      }, 0);
    } else {
      setModelError(null);
    }
  };

  const handleGenerate = async () => {
    if (!subject || !prompt) return;

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
    setIsGenerating(true);
    setGeneratedContent("");

    try {
      // Call the OpenAI action to generate a question
      const result = await generateQuestionAction({
        subject,
        difficulty,
        prompt,
        model: aiModel, // Usando o modelo selecionado
      });

      // Set the generated content
      setGeneratedContent(result);

      // Find the subject ID based on the selected subject name
      const selectedSubject = subjects?.find(subj => subj.name === subject);
      const subjectId = selectedSubject?._id;

      // Also save to the database automatically
      const response = await generateQuestionsMutation({
        subject,
        difficulty,
        prompt,
        numQuestions: 1,
        aiResponse: result,
        subjectId, // Passando o ID do subject selecionado
        model: aiModel, // Passando o modelo selecionado pelo usuário
      });

      // Show remaining credits if user is on free plan
      if (!userCreditInfo?.hasActiveSubscription && response.remainingCredits) {
        console.log(`Credits remaining: ${response.remainingCredits}`);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar questões. Por favor, tente novamente.",
      });
      // Em caso de erro, mostra o formulário novamente
      setShowForm(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!generatedContent) return;
    setShowSaveDialog(true);
    // Initialize tags with subject only (removed difficulty)
    setSelectedTags([subject]);
  };

  const handleConfirmSave = async () => {
    try {
      // Save the question to the database with selected tags
      await saveQuestionMutation({
        question: generatedContent,
        subject,
        tags: selectedTags,
      });

      // Close dialog without showing alert
      setShowSaveDialog(false);
      
      // Show success toast
      toast({
        title: "Questão salva",
        description: "Sua questão foi salva com sucesso.",
      });
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao salvar questão. Por favor, tente novamente.",
      });
    }
  };

  const handleNewQuestion = () => {
    if (generatedContent) {
      setShowNewQuestionDialog(true);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setSubject("");
    setDifficulty("medium");
    setPrompt("");
    setGeneratedContent("");
    setShowForm(true);
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Gerar Questões</CardTitle>
            <CardDescription>
              Crie questões personalizadas para os seus estudos, provas, simulados e mais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Disciplina</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem key={subject._id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Nível de Dificuldade</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiModel">Modelo de IA</Label>
              <Select value={aiModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo de IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">IA Básica</SelectItem>
                  <SelectItem value="o3-mini">IA Avançada {userCreditInfo?.tier !== "pro" && "(Pro)"}</SelectItem>
                </SelectContent>
              </Select>

              {modelError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{modelError}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Descreva a questão</Label>
              <Textarea
                id="prompt"
                placeholder="Descreva o assunto ou conceitos que você quer questões sobre"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              onClick={handleGenerate}
              disabled={!subject || !prompt || isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? "Gerando..." : "Gerar Questão"}
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

      {isGenerating && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Questão Gerada</CardTitle>
            <CardDescription>Disciplina: {subject}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-white">
              <div className="whitespace-pre-line">{generatedContent}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleNewQuestion}>
              Gerar Nova Questão
            </Button>
            <Button onClick={handleSaveQuestion}>Salvar Questão</Button>
          </CardFooter>
        </Card>
      )}

      {/* Save Question Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Questão</DialogTitle>
            <DialogDescription>
              Adicione tags para organizar e encontrar esta questão mais tarde.
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
            <Button onClick={handleConfirmSave}>Salvar Questão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Question Confirmation Dialog */}
      <Dialog open={showNewQuestionDialog} onOpenChange={setShowNewQuestionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Nova Questão</DialogTitle>
            <DialogDescription>
              Deseja gerar outra questão? A questão atual será perdida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewQuestionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setShowNewQuestionDialog(false);
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
