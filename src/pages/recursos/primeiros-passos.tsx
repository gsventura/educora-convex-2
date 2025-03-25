import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ChevronLeft, FileQuestion, MessageSquare, BookOpen, Calendar, Star, Info } from "lucide-react";

export default function PrimeirosPassos() {
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
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Primeiros Passos</CardTitle>
        <CardDescription>
          Guia completo para começar a usar nossa plataforma de estudos Educora
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-8">
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Começando com a Educora</span>
          </h2>
          <p className="text-gray-700">
            Seja bem-vindo à Educora, sua plataforma de estudos potencializada por inteligência artificial. 
            Este guia irá ajudá-lo a configurar sua conta e a utilizar todos os recursos disponíveis para 
            maximizar seu aprendizado e desempenho nos estudos.
          </p>
          <div className="rounded-lg overflow-hidden border border-primary/10 bg-gray-50/50 p-4 shadow-sm">
            <p className="text-sm text-gray-600 italic">
              A Educora foi desenvolvida para tornar seus estudos mais eficientes e personalizados, 
              combinando tecnologia avançada de IA com métodos pedagógicos comprovados. Siga este guia 
              passo a passo para descobrir todo o potencial da plataforma.
            </p>
          </div>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">1. Configurando sua conta</span>
          </h2>
          <p className="text-gray-700">
            Após criar sua conta e fazer login, recomendamos que você complete seu perfil 
            com todas as informações necessárias. Isso ajudará a personalizar sua experiência 
            e garantir que você receba recomendações relevantes para seus objetivos de estudo.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4">Passos para configurar seu perfil:</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-700">
              <span className="font-medium">Acesse seu perfil:</span> Clique no ícone de perfil no canto superior direito da tela e selecione "Configurações de Perfil".
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Tela de acesso ao perfil</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Complete suas informações pessoais:</span> Preencha seus dados como nome completo, e-mail de contato e área de interesse principal.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Formulário de informações pessoais</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Configure suas preferências de estudo:</span> Selecione os temas de interesse, objetivos de aprendizagem (concursos, vestibulares, desenvolvimento pessoal) e nível de conhecimento.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Configuração de preferências de estudo</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Gerenciar notificações:</span> Escolha como e quando deseja receber notificações sobre novos conteúdos, lembretes de estudo e atualizações da plataforma.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Configurações de notificações</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">2. Usando o Gerador de Questões</span>
          </h2>
          <p className="text-gray-700">
            O Gerador de Questões é uma das ferramentas mais poderosas da plataforma, permitindo que você crie questões 
            personalizadas para praticar qualquer assunto. Nossos algoritmos de IA garantem questões relevantes e 
            contextualizadas para seu nível de conhecimento.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4">Como gerar questões personalizadas:</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-700">
              <span className="font-medium">Acesse o Gerador de Questões:</span> No Dashboard, clique na aba "Gerador de Questões" ou selecione a opção no menu lateral.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Localização do Gerador de Questões</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Selecione o assunto:</span> Escolha entre uma ampla variedade de temas como matemática, física, história, literatura, etc.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Seleção de assuntos</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Defina o nível de dificuldade:</span> Escolha entre iniciante, intermediário ou avançado conforme seu conhecimento atual.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Seleção de dificuldade</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Personalize sua solicitação:</span> Adicione requisitos específicos na caixa de prompt, como formato da questão (múltipla escolha, dissertativa), tópicos específicos ou estilo de prova (ENEM, concurso público, etc.).
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Campo de personalização</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Escolha o modelo de IA:</span> Selecione entre o modelo padrão ou o modelo avançado (disponível para assinantes Pro).
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Seleção de modelo de IA</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Gere as questões:</span> Clique em "Gerar" e aguarde enquanto nossa IA cria as questões personalizadas para você.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Botão de geração e tela de carregamento</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Salve suas questões:</span> Após a geração, você pode salvar as questões para usar depois, adicionando tags para facilitar a organização.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Opções de salvamento</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">3. Utilizando o Assistente de Respostas</span>
          </h2>
          <p className="text-gray-700">
            O Assistente de Respostas é sua ferramenta para obter ajuda na resolução de questões e compreensão de conceitos complexos. 
            Ele fornece explicações detalhadas e passo a passo para qualquer dúvida acadêmica.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4">Como usar o Assistente de Respostas:</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-700">
              <span className="font-medium">Acesse o Assistente:</span> No Dashboard, selecione a aba "Assistente de Respostas".
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Acesso ao Assistente de Respostas</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Escolha o método de entrada:</span> Você pode inserir sua questão por texto ou fazer upload de uma imagem (ideal para questões com gráficos, fórmulas ou manuscritas).
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Opções de entrada (texto ou imagem)</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Insira a questão:</span> Digite ou faça upload da questão que você precisa de ajuda para resolver.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Inserção da questão</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Obtenha a resposta:</span> Após enviar, o assistente analisará a questão e fornecerá uma resposta detalhada, incluindo o raciocínio e os passos para a resolução.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Exemplo de resposta detalhada</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Forneça feedback:</span> Se a resposta não estiver adequada, você pode marcar como incorreta e fornecer feedback para melhorar o sistema.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Opções de feedback</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Salve para referência futura:</span> Você pode salvar respostas úteis para consultar posteriormente durante seus estudos.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Opção de salvamento de respostas</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">4. Gerenciando suas Questões Salvas</span>
          </h2>
          <p className="text-gray-700">
            A seção de Questões Salvas permite que você organize e acesse facilmente todo o conteúdo que salvou 
            para estudo posterior. Esta é uma ferramenta essencial para revisões eficientes.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4">Como gerenciar suas questões salvas:</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-700">
              <span className="font-medium">Acesse Questões Salvas:</span> No Dashboard, clique na aba "Questões Salvas".
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Localização da seção Questões Salvas</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Visualize sua biblioteca:</span> Todas as questões que você salvou estarão organizadas por data, assunto e tags.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Biblioteca de questões salvas</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Filtre e busque:</span> Use as opções de filtro por assunto, dificuldade ou tags para encontrar rapidamente o que procura.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Filtros de busca</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Organize com tags:</span> Adicione ou modifique tags para categorizar suas questões de acordo com seus métodos de estudo.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Gerenciamento de tags</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Revise e estude:</span> Acesse qualquer questão para revisão, veja a resposta e explicação associada.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Visualização detalhada de uma questão</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Exporte suas questões:</span> Você pode exportar questões para formatos como PDF para estudo offline.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Opções de exportação</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">5. Criando Planos de Estudo</span>
          </h2>
          <p className="text-gray-700">
            Os Planos de Estudo ajudam você a organizar seu aprendizado com cronogramas estruturados 
            e conteúdos recomendados pela IA, adaptados aos seus objetivos e tempo disponível.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4">Como criar e gerenciar planos de estudo:</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-700">
              <span className="font-medium">Acesse Planos de Estudo:</span> No Dashboard, selecione a aba "Planos de Estudo".
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Acesso aos Planos de Estudo</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Crie um novo plano:</span> Clique em "Criar Novo Plano" e defina os objetivos principais deste plano (ex: "Preparação para o ENEM", "Concurso XYZ", etc.).
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Criação de um novo plano</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Defina as disciplinas/tópicos:</span> Selecione as áreas de conhecimento que deseja incluir no plano.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Seleção de disciplinas</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Configure o cronograma:</span> Defina a duração do plano e disponibilidade semanal para estudo.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Configuração de cronograma</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Visualize o plano gerado:</span> Nossa IA criará um plano detalhado com distribuição de conteúdos e atividades ao longo do período definido.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Visualização do plano gerado</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Personalize conforme necessário:</span> Ajuste o plano gerado, reordenando tópicos ou alterando a distribuição de tempo conforme suas necessidades.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Opções de personalização</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Integre recursos da plataforma:</span> Vincule questões salvas ou gere novas atividades diretamente a partir do plano de estudos.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Integração com outras funcionalidades</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium">Acompanhe seu progresso:</span> Marque atividades como concluídas e visualize estatísticas de seu avanço no plano.
              <div className="rounded-lg overflow-hidden border my-3">
                <p className="bg-gray-100 p-2 text-center text-sm text-gray-500">Imagem: Acompanhamento de progresso</p>
                {/* A imagem será adicionada posteriormente */}
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-4 mb-8 rounded-lg bg-gradient-to-r from-primary/5 to-transparent p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dicas para Aproveitar ao Máximo</span>
          </h2>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">✓</div>
              <p className="text-gray-700"><span className="font-medium">Use todos os dias:</span> Estudos mostram que a prática regular, mesmo que por períodos curtos, é mais eficaz que sessões longas e esporádicas.</p>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">✓</div>
              <p className="text-gray-700"><span className="font-medium">Combine diferentes recursos:</span> Alterne entre o Gerador de Questões e o Assistente de Respostas para um entendimento mais profundo dos conceitos.</p>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">✓</div>
              <p className="text-gray-700"><span className="font-medium">Personalize seus planos:</span> Ajuste os planos de estudo de acordo com seus pontos fortes e fracos para otimizar seu tempo.</p>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">✓</div>
              <p className="text-gray-700"><span className="font-medium">Utilize tags eficientes:</span> Desenvolva um sistema de tags consistente para facilitar a recuperação de conteúdos salvos.</p>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">✓</div>
              <p className="text-gray-700"><span className="font-medium">Dê feedback ao sistema:</span> Isso ajuda a IA a se adaptar às suas necessidades e melhorar as recomendações.</p>
            </li>
          </ul>
        </section>

        <div className="border-t border-primary/10 pt-6 mt-8">
          <div className="bg-gradient-to-r from-gray-50 to-transparent p-5 rounded-lg">
            <h3 className="font-medium flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Precisa de mais ajuda?</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Se você tiver dúvidas adicionais, entre em contato com nosso suporte
              através do e-mail <span className="text-primary font-medium">suporte@educora.com.br</span> ou 
              acesse nossa página de <Link to="/recursos/faq" className="text-primary underline">Perguntas Frequentes</Link>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link to="/recursos/faq">
                  Perguntas Frequentes
                </Link>
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link to="/recursos/dicas-avancadas">
                  Dicas Avançadas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 