import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, MessageSquare, FileQuestion, BookOpen, Calendar, Star, Lightbulb, PocketKnife, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Componente AccordionTrigger personalizado para substituir o padrão e remover a seta duplicada
const CustomAccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ className, children, ...props }, ref) => (
  <AccordionTrigger
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 px-2 transition-all hover:bg-gray-50/80 rounded-md hover:no-underline [&[data-state=open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
  </AccordionTrigger>
));
CustomAccordionTrigger.displayName = "CustomAccordionTrigger";

export default function FAQ() {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/recursos" className="hover:bg-primary/5 transition-colors">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Central de Recursos
            </Link>
          </Button>
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Perguntas Frequentes</CardTitle>
        <CardDescription>
          Respostas para as dúvidas mais comuns sobre nossa plataforma de estudos
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="grid grid-cols-1 gap-3">
          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Gerador de Questões</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como posso gerar questões personalizadas?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Para gerar questões personalizadas, acesse a aba "Gerador de Questões" no Dashboard. 
                  Escolha o assunto, nível de dificuldade e descreva o tipo de questão que deseja gerar. 
                  Nossa IA criará questões específicas com base nas suas instruções.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Quais assuntos estão disponíveis para geração de questões?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Oferecemos uma ampla variedade de assuntos educacionais, incluindo matemática, física, química, 
                  biologia, história, geografia, literatura, língua portuguesa, entre outros. A plataforma é 
                  constantemente atualizada com novos assuntos e conteúdos.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Posso salvar as questões geradas para usar depois?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, após gerar as questões, você pode salvá-las com tags personalizadas para organização. 
                  Todas as questões salvas ficam disponíveis na aba "Questões Salvas", onde você pode acessá-las 
                  a qualquer momento, editá-las ou excluí-las conforme necessário.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Qual a diferença entre os modelos de IA disponíveis?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Oferecemos dois modelos de IA: o modelo padrão (GPT-4.1) disponível para todos os usuários, e 
                  o modelo avançado (o3) exclusivo para assinantes do plano Pro. O modelo avançado oferece 
                  maior precisão, contextualização aprimorada e capacidade de gerar questões mais complexas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Assistente de Respostas</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como funciona o Assistente de Respostas?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  O Assistente de Respostas utiliza inteligência artificial para ajudar na resolução de 
                  questões. Basta inserir a questão por texto ou imagem, e o assistente fornecerá uma resposta 
                  detalhada, incluindo o passo a passo da resolução e explicações sobre os conceitos envolvidos.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Posso enviar imagens de questões escritas à mão?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, o Assistente de Respostas permite o upload de imagens de questões, sejam digitadas ou 
                  manuscritas. Nossa IA é capaz de interpretar o conteúdo da imagem e fornecer respostas 
                  adequadas. Certifique-se apenas que a imagem esteja nítida e o texto legível.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">O que fazer se a resposta gerada estiver incorreta?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Se você considerar que uma resposta está incorreta ou incompleta, pode utilizar o recurso 
                  "Marcar como Incorreta" e fornecer seu feedback. A plataforma utilizará essas informações 
                  para regenerar uma resposta mais precisa e também para melhorar o sistema continuamente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">A plataforma suporta fórmulas matemáticas e científicas?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, nossa plataforma oferece suporte completo a fórmulas matemáticas e científicas através 
                  da notação LaTeX. Tanto as perguntas quanto as respostas podem conter equações complexas, 
                  que serão renderizadas corretamente e de forma visualmente agradável.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Questões Salvas</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como organizar minhas questões salvas?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Ao salvar questões, você pode adicionar tags personalizadas para facilitar a organização. 
                  Na aba "Questões Salvas", você pode filtrar por assunto, dificuldade ou tags específicas. 
                  Isso permite criar coleções temáticas de questões para revisão direcionada.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Posso compartilhar minhas questões salvas com outros usuários?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Atualmente, as questões salvas são pessoais e não podem ser compartilhadas diretamente com outros 
                  usuários através da plataforma. No entanto, você pode exportar as questões e compartilhá-las 
                  externamente. Estamos trabalhando em recursos de colaboração para futuras atualizações.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Existe um limite para o número de questões que posso salvar?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Os limites de armazenamento variam de acordo com seu plano. Usuários do plano gratuito 
                  têm um limite de questões salvas. Assinantes do plano Básico têm um limite maior, 
                  enquanto assinantes do plano Pro desfrutam de armazenamento ilimitado para suas 
                  questões e materiais de estudo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Planos de Estudo</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como criar um plano de estudos personalizado?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Na aba "Planos de Estudo", você pode criar planos personalizados inserindo o assunto 
                  e seus objetivos específicos. Nossa IA gerará um plano detalhado com cronograma, 
                  recursos recomendados e estratégias de estudo adaptadas ao seu perfil e objetivos.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Posso editar um plano de estudos após sua criação?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, todos os planos de estudo podem ser editados a qualquer momento. Você pode 
                  modificar conteúdos, ajustar cronogramas ou adicionar novas informações conforme 
                  suas necessidades evoluem. Basta selecionar o plano desejado e clicar na opção de edição.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Os planos de estudo se integram com outras funcionalidades da plataforma?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, nossos planos de estudo são totalmente integrados com as outras funcionalidades. 
                  Você pode vincular questões salvas aos seus planos, gerar novas questões relacionadas 
                  diretamente de um plano ou solicitar assistência para tópicos específicos mencionados 
                  no seu cronograma de estudos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Planos e Assinaturas</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Quais são os planos disponíveis e seus benefícios?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Oferecemos três planos: Gratuito, Básico e Pro. O plano Gratuito dá acesso limitado com 
                  créditos mensais. O plano Básico oferece acesso ilimitado às funcionalidades padrão. 
                  O plano Pro inclui acesso ao modelo de IA avançada, armazenamento ilimitado e recursos 
                  premium como prioridade no suporte.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como funcionam os créditos no plano gratuito?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Usuários do plano gratuito recebem uma quantidade limitada de créditos mensais. 
                  Cada geração de questão, assistência de resposta ou criação de plano de estudos 
                  consome um crédito. Os créditos são renovados automaticamente no início de cada mês, 
                  e você pode verificar seu saldo atual no Dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como gerenciar ou cancelar minha assinatura?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Para gerenciar sua assinatura, clique em "Gerenciar" ao lado do status da sua assinatura 
                  no Dashboard. Você será redirecionado para o portal de assinatura onde pode atualizar 
                  métodos de pagamento, mudar de plano ou cancelar. Cancelamentos são efetivos ao final do 
                  período atual já pago.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Vocês oferecem descontos para estudantes ou instituições educacionais?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, oferecemos descontos especiais para estudantes com e-mail institucional verificado, 
                  bem como planos corporativos para instituições educacionais. Entre em contato com nosso 
                  suporte para obter mais informações sobre programas educacionais e solicitar um orçamento 
                  personalizado.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dicas e Estratégias</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como aproveitar ao máximo a plataforma para preparação de concursos?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Para preparação de concursos, recomendamos criar um plano de estudos específico para o 
                  edital do concurso desejado. Use o gerador de questões para praticar com questões semelhantes 
                  às do certame, organizando-as por assuntos. Aproveite o assistente de respostas para esclarecer 
                  dúvidas em questões de provas anteriores.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Quais são as melhores práticas para estudar conteúdos complexos?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Para conteúdos complexos, utilize a técnica de estudo espaçado junto com nossa plataforma. 
                  Divida o tema em partes menores, use o assistente para entender conceitos fundamentais, 
                  gere questões progressivamente mais difíceis e revise regularmente utilizando as questões 
                  salvas. Crie um plano de estudos que intercale temas diferentes para evitar fadiga mental.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como integrar a plataforma com outras ferramentas de estudo?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Nossa plataforma foi desenhada para complementar outras ferramentas de estudo. Você pode 
                  exportar conteúdos para aplicativos de anotação como Notion ou Evernote, utilizar as 
                  questões geradas em conjunto com flashcards, e incluir links externos nos seus planos de 
                  estudo para materiais complementares como vídeos, artigos ou livros.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-6 rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="pb-2 mb-4 border-b border-primary/10">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <PocketKnife className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Suporte Técnico</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">Como posso obter ajuda se encontrar um problema técnico?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Em caso de problemas técnicos, você pode contatar nosso suporte através do e-mail 
                  suporte@educora.com.br ou utilizar o chat de suporte disponível no canto inferior direito 
                  da plataforma. Usuários dos planos Básico e Pro têm acesso prioritário ao suporte técnico.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">A plataforma funciona em todos os dispositivos e navegadores?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Sim, nossa plataforma é responsiva e funciona em computadores, tablets e smartphones. 
                  Recomendamos os navegadores Chrome, Firefox, Safari ou Edge em suas versões mais recentes 
                  para melhor experiência. Em dispositivos móveis, você pode adicionar a plataforma à tela 
                  inicial para uma experiência semelhante a um aplicativo.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100/50">
                <CustomAccordionTrigger>
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium text-gray-800">O que fazer se a geração de conteúdo estiver demorando muito?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
                  </div>
                </CustomAccordionTrigger>
                <AccordionContent className="pl-4 pr-2 text-gray-600">
                  Ocasionalmente, em horários de pico ou para solicitações complexas, a geração de conteúdo 
                  pode levar mais tempo. Recomendamos aguardar até 60 segundos. Se persistir, verifique sua 
                  conexão à internet e tente atualizar a página. Caso o problema continue, entre em contato 
                  com nosso suporte técnico.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-6 mt-8">
          <div className="bg-gradient-to-r from-gray-50 to-transparent p-5 rounded-lg">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Ainda com dúvidas?</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Se você não encontrou a resposta que procura, entre em contato com nosso suporte técnico 
              através do e-mail <span className="text-primary font-medium">suporte@educora.com.br</span> ou 
              pelo chat disponível no canto inferior direito da tela.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link to="/recursos/primeiros-passos" className="group">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Primeiros Passos
                    <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                  </span>
                </Link>
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link to="/recursos/dicas-avancadas" className="group">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Dicas Avançadas
                    <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sobrescrevendo o componente AccordionTrigger padrão para remover o underline e adicionar um ícone personalizado
// Este código substitui a implementação padrão do componente AccordionTrigger
AccordionTrigger.displayName = "AccordionTrigger"; 