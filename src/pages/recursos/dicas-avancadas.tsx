import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ChevronLeft, Lightbulb, GraduationCap, ListChecks, Sparkles, BrainCircuit } from "lucide-react";

export default function DicasAvancadas() {
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
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dicas Avançadas</CardTitle>
        <CardDescription>
          Recursos e técnicas avançadas para maximizar sua experiência na Educora
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-8">
        <section className="space-y-5 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Criando Prompts Eficientes para Questões de Vestibular</span>
          </h2>
          <p className="text-gray-700">
            Dominar a arte de criar prompts é essencial para obter questões de alta qualidade do nosso gerador de IA. 
            Um prompt bem estruturado pode transformar completamente os resultados, gerando questões que realmente 
            desafiam seu conhecimento e se assemelham às encontradas em vestibulares reais.
          </p>
          
          <div className="rounded-lg overflow-hidden border border-primary/10 bg-gray-50/50 p-4 shadow-sm">
            <p className="text-sm text-gray-600 italic">
              As técnicas apresentadas a seguir são baseadas em pesquisas sobre prompting eficiente e podem 
              ser aplicadas não apenas para gerar questões, mas também para outras interações com nossa IA.
            </p>
          </div>
        </section>

        <section className="space-y-4 mb-8 rounded-lg bg-gradient-to-r from-primary/5 to-transparent p-6">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Passo a Passo para Criar Prompts Estruturados</span>
          </h3>
          
          <ol className="list-decimal pl-6 space-y-6">
            <li className="text-gray-700">
              <span className="font-medium text-gray-900">Defina o objetivo com precisão</span>
              <p className="mt-1">Comece especificando exatamente o que você deseja: uma questão de vestibular sobre qual assunto, para qual exame (ENEM, FUVEST, etc.) e com qual nível de dificuldade.</p>
              
              <div className="mt-3 bg-white border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700">Exemplo:</p>
                <p className="text-sm text-gray-600 italic mt-1">
                  "Crie uma questão de vestibular no estilo ENEM sobre o Segundo Reinado no Brasil, com foco nas transformações econômicas do período. Nível de dificuldade: intermediário."
                </p>
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium text-gray-900">Especifique o formato da questão</span>
              <p className="mt-1">Indique se você deseja uma questão de múltipla escolha (e quantas alternativas), dissertativa, ou com texto de apoio específico.</p>
              
              <div className="mt-3 bg-white border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700">Exemplo:</p>
                <p className="text-sm text-gray-600 italic mt-1">
                  "Formato: questão de múltipla escolha com 5 alternativas (A a E), contendo um texto de apoio histórico ou trecho de documento da época, seguido pelo enunciado e alternativas."
                </p>
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium text-gray-900">Solicite estrutura de pensamento (Chain of Thought)</span>
              <p className="mt-1">Peça que a IA demonstre seu processo de raciocínio enquanto cria a questão, o que resulta em questões mais lógicas e bem estruturadas.</p>
              
              <div className="mt-3 bg-white border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700">Exemplo:</p>
                <p className="text-sm text-gray-600 italic mt-1">
                  "Ao criar esta questão, siga estas etapas e explique seu pensamento em cada uma: 
                  1) Escolha um aspecto específico do tema (ex: café, escravidão, industrialização); 
                  2) Identifique um conceito-chave que será avaliado; 
                  3) Crie um texto de apoio relevante; 
                  4) Formule o enunciado que conecte o texto ao conceito; 
                  5) Elabore a resposta correta; 
                  6) Crie alternativas incorretas que sejam plausíveis mas com erros conceituais identificáveis."
                </p>
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium text-gray-900">Defina habilidades e competências a serem avaliadas</span>
              <p className="mt-1">Especifique quais competências cognitivas a questão deve testar, alinhadas com a matriz de referência do vestibular em questão.</p>
              
              <div className="mt-3 bg-white border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700">Exemplo:</p>
                <p className="text-sm text-gray-600 italic mt-1">
                  "Esta questão deve avaliar as seguintes habilidades: interpretação de texto histórico, compreensão de processos históricos, capacidade de relacionar causas e consequências, e análise crítica de transformações sociais."
                </p>
              </div>
            </li>
            
            <li className="text-gray-700">
              <span className="font-medium text-gray-900">Solicite explicação da resposta correta</span>
              <p className="mt-1">Peça que a IA forneça uma explicação detalhada da resposta correta, o que permite verificar a qualidade da questão e usar como material de estudo.</p>
              
              <div className="mt-3 bg-white border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700">Exemplo:</p>
                <p className="text-sm text-gray-600 italic mt-1">
                  "Após apresentar a questão completa, forneça uma explicação detalhada da alternativa correta, incluindo os conceitos históricos envolvidos e por que as outras alternativas estão incorretas."
                </p>
              </div>
            </li>
          </ol>
          
          <div className="rounded-lg overflow-hidden border border-primary/10 bg-gray-50/50 p-4 shadow-sm mt-4">
            <p className="text-sm text-gray-600 font-medium">💡 Dica:</p>
            <p className="text-sm text-gray-600 mt-1">
              Quanto mais específico for seu prompt, melhores serão os resultados. Evite instruções vagas como "crie uma boa questão de história" e prefira detalhar exatamente o que você espera.
            </p>
          </div>
        </section>
        
        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>Utilizando Questões Existentes como Modelo</span>
          </h3>
          
          <p className="text-gray-700">
            Uma técnica poderosa é fornecer uma questão existente como modelo para a IA, solicitando variações 
            ou questões relacionadas. Isso garante consistência no estilo e formato, além de permitir que você 
            explore diferentes ângulos de um mesmo tema.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-md p-4 my-4">
            <h4 className="font-medium text-gray-800 mb-2">Exemplo de Prompt com Questão Modelo:</h4>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              <p className="font-medium">Questão modelo:</p>
              <p className="mt-2 italic">
                "TEXTO: 'A cafeicultura transformou profundamente a economia e sociedade brasileiras na segunda metade do século XIX, consolidando um novo eixo econômico no Sudeste e alterando relações de trabalho.'
                <br/><br/>
                Com base no texto e em seus conhecimentos, é correto afirmar que o desenvolvimento da cafeicultura no Brasil durante o Segundo Reinado:
                <br/><br/>
                a) Fortaleceu o modelo escravista, impedindo debates sobre a abolição.<br/>
                b) Promoveu a industrialização imediata das regiões produtoras de café.<br/>
                c) Contribuiu para a transição do trabalho escravo para o trabalho livre assalariado.<br/>
                d) Manteve o eixo econômico concentrado no Nordeste açucareiro.<br/>
                e) Eliminou a influência inglesa na economia brasileira.
                <br/><br/>
                Resposta correta: C"
              </p>
              
              <p className="font-medium mt-4">Instrução para a IA:</p>
              <p className="mt-2 italic">
                "Com base na questão modelo acima, crie uma nova questão sobre o mesmo período histórico (Segundo Reinado), mas focando em outro aspecto: as transformações políticas, especialmente o parlamentarismo às avessas. Mantenha o mesmo formato (texto introdutório + 5 alternativas) e nível de complexidade. O texto de apoio deve ser diferente, mas relacionado ao novo tema. Explique a resposta correta ao final."
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-gray-800 mt-5">Variações desta abordagem:</h4>
          <ul className="list-disc pl-6 space-y-3 mt-2">
            <li className="text-gray-700">
              <span className="font-medium">Mesmo texto, nova perspectiva:</span> Solicite que a IA crie uma questão diferente usando o mesmo texto de apoio, explorando outro aspecto do tema.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Aumento progressivo de dificuldade:</span> Forneça uma questão básica e peça versões progressivamente mais difíceis sobre o mesmo tema.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Adaptação de formato:</span> Ofereça uma questão de múltipla escolha e solicite uma versão dissertativa que explore o mesmo conceito.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Interdisciplinaridade:</span> Partindo de uma questão de história, peça uma nova questão que relacione o tema com geografia, sociologia ou literatura.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <span>Template Completo para Geração de Questões de Vestibular</span>
          </h3>
          
          <p className="text-gray-700">
            Aqui está um template completo que você pode copiar, adaptar e usar diretamente no nosso gerador de questões:
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`# SOLICITAÇÃO DE QUESTÃO DE VESTIBULAR

## ESPECIFICAÇÕES BÁSICAS
- TEMA: [Insira aqui o tema específico]
- DISCIPLINA: [Disciplina principal]
- SUBTÓPICOS RELEVANTES: [Liste 2-3 subtópicos importantes]
- ESTILO DE VESTIBULAR: [ENEM, FUVEST, UNICAMP, etc.]
- NÍVEL DE DIFICULDADE: [Básico/Intermediário/Avançado]

## FORMATO DA QUESTÃO
- TIPO: [Múltipla escolha (com quantas alternativas) / Dissertativa / V ou F]
- TEXTO DE APOIO: [Sim/Não] [Se sim, especifique: trecho literário, dado estatístico, imagem, etc.]
- INTERDISCIPLINARIDADE: [Sim/Não] [Se sim, com qual(is) disciplina(s)]

## HABILIDADES A SEREM AVALIADAS
- [Liste 2-4 habilidades específicas que a questão deve exigir do estudante]

## PROCESSO DE CRIAÇÃO (CHAIN OF THOUGHT)
Por favor, siga e explique estas etapas ao criar a questão:
1. Defina o conceito central que será avaliado
2. Crie ou selecione um texto de apoio apropriado
3. Formule o enunciado da questão
4. Desenvolva as alternativas (se múltipla escolha):
   - Alternativa correta com justificativa
   - Demais alternativas com explicação de por que estão incorretas
5. Revise a questão para garantir clareza e precisão conceitual

## EXTRAS SOLICITADOS
- Explicação detalhada da resposta correta
- Conceitos relacionados para estudo adicional
- Dificuldades comuns associadas a este tipo de questão`}
            </pre>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-primary/10 bg-gray-50/50 p-4 shadow-sm mt-4">
            <p className="text-sm text-gray-600 font-medium">💡 Dica de uso:</p>
            <p className="text-sm text-gray-600 mt-1">
              Copie este template, preencha os campos entre colchetes com suas especificações 
              e cole no campo de prompt do Gerador de Questões. Você pode remover as seções que não 
              são relevantes para sua necessidade específica.
            </p>
          </div>
        </section>

        <section className="space-y-4 mb-8 rounded-lg bg-gradient-to-r from-primary/5 to-transparent p-6">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Técnicas Avançadas de Prompting</span>
          </h3>
          
          <p className="text-gray-700">
            Para usuários que desejam resultados ainda mais refinados, estas técnicas avançadas podem 
            elevar significativamente a qualidade das questões geradas:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800">Role Prompting</h4>
              <p className="text-sm text-gray-700 mt-2">
                Peça que a IA assuma o papel de um professor experiente ou elaborador de questões de vestibular.
              </p>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 italic">
                "Atue como um elaborador experiente de questões do ENEM com 15 anos de experiência, especializado em questões de Matemática que avaliam interpretação gráfica..."
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800">Few-Shot Learning</h4>
              <p className="text-sm text-gray-700 mt-2">
                Forneça 2-3 exemplos de questões de alta qualidade antes de pedir uma nova.
              </p>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 italic">
                "Aqui estão três exemplos de questões excelentes sobre Literatura Modernista: [EXEMPLO 1] [EXEMPLO 2] [EXEMPLO 3]. Agora, crie uma questão no mesmo estilo, mas sobre o autor Guimarães Rosa..."
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800">Refinamento Iterativo</h4>
              <p className="text-sm text-gray-700 mt-2">
                Use o feedback de uma primeira geração para refinar progressivamente a questão.
              </p>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 italic">
                "A questão gerada está boa, mas preciso que as alternativas incorretas sejam mais plausíveis. Além disso, o texto de apoio pode incluir um dado estatístico para aumentar a complexidade..."
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-800">Controvertido Intencional</h4>
              <p className="text-sm text-gray-700 mt-2">
                Solicite alternativas que explorem equívocos comuns entre estudantes.
              </p>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 italic">
                "Crie alternativas incorretas que representem erros conceituais frequentemente cometidos por estudantes ao analisar as funções orgânicas, especialmente confusões entre álcoois e fenóis..."
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Criando Sequências de Estudo Eficientes</span>
          </h3>
          
          <p className="text-gray-700">
            Além de questões isoladas, você pode usar prompts estratégicos para criar sequências de questões que formam uma jornada de aprendizado completa:
          </p>
          
          <ol className="list-decimal pl-6 space-y-3 mt-2">
            <li className="text-gray-700">
              <span className="font-medium">Sequência de complexidade crescente:</span> Solicite uma série de 5 questões sobre o mesmo tema, começando com questões básicas e terminando com questões avançadas.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Exploração de diferentes ângulos:</span> Peça questões que abordem o mesmo tema a partir de diferentes perspectivas ou contextos históricos.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Conexão conceitual:</span> Solicite questões que conectem conceitos relacionados, criando uma rede de entendimento sobre um tópico amplo.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Foco em erros comuns:</span> Peça questões específicas que abordem equívocos frequentes relacionados ao tema estudado.
            </li>
          </ol>
          
          <div className="bg-white border border-gray-200 rounded-md p-4 my-4">
            <h4 className="font-medium text-gray-800 mb-2">Exemplo de prompt para sequência de estudo:</h4>
            <p className="text-sm text-gray-700 italic">
              "Crie uma sequência de 4 questões sobre Termodinâmica para preparação para o vestibular, organizadas da seguinte forma:
              <br/><br/>
              1. Uma questão básica sobre a Primeira Lei da Termodinâmica (nível fácil)
              <br/>
              2. Uma questão sobre aplicações da Primeira Lei em processos físicos (nível intermediário)
              <br/>
              3. Uma questão sobre a Segunda Lei e Entropia (nível intermediário-avançado)
              <br/>
              4. Uma questão integrando os conceitos das questões anteriores em um problema complexo (nível avançado)
              <br/><br/>
              Para cada questão, inclua: texto de apoio relevante, enunciado claro, alternativas (se múltipla escolha) ou espaço para resposta (se dissertativa), e explicação detalhada da solução. Ao final, forneça sugestões de conexões conceituais entre as questões."
            </p>
          </div>
        </section>

        <div className="border-t border-primary/10 pt-6 mt-8">
          <div className="bg-gradient-to-r from-gray-50 to-transparent p-5 rounded-lg">
            <h3 className="font-medium flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Recursos relacionados</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link to="/recursos/primeiros-passos">
                  Primeiros Passos
                </Link>
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link to="/recursos/faq">
                  Perguntas Frequentes
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Ainda com dúvidas sobre como criar prompts eficientes? Entre em contato com nosso suporte ou 
              acesse nossos tutoriais em vídeo na <span className="text-primary font-medium">Área de Treinamento</span>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 