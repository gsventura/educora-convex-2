import { action } from "./_generated/server";
import OpenAI from "openai";
import { v } from "convex/values";

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not defined!");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const generateQuestion = action({
  args: {
    prompt: v.string(),
    subject: v.string(),
    difficulty: v.string(),
    model: v.string(),
  },
  handler: async (_, args) => {
    try {
      const response = await openai.chat.completions.create({
        model: args.model,
        messages: [
          {
            role: "user",
            content:
              "Você é especialista em criar questões desafiadoras para vestibulares, com foco nas competências do ENEM: interpretação textual, análise crítica, interdisciplinaridade e aplicação de conhecimentos em contextos reais. Ao receber um tema/disciplina indicado entre chaves (ex: [Sociologia]), siga este formato rigorosamente: Contexto: Elabore um texto de apoio ou conjunto de elementos que incluam: Textos curtos de diferentes gêneros (artigos, poemas, trechos jornalísticos, diálogos literários) Textos com linguagem figurada, ironia, ambiguidade ou vocabulário técnico. Diretrizes: Evite citar autores ou obras específicas. EVITE usar conteúdos hipotéticos. Integre múltiplas perspectivas sobre o tema, mesmo em textos únicos. Enunciado: Formule uma pergunta que exija: Identificação de tese central e argumentos secundários; Análise de relações entre linguagem, contexto histórico e valores sociais; Comparação intertextual (quando houver múltiplos textos); Interpretação de elementos não verbais (se aplicável); Conexões entre diferentes áreas do conhecimento relacionadas ao tema. Alternativas: Correta: Exija compreensão global do contexto, reconhecimento de nuances e síntese de informações. Distratores: Baseie-se em: Erros de leitura superficial (ex: tomar metáforas ao pé da letra); Generalizações apressadas de dados parciais; Confusão entre causa e consequência em gráficos/textos; Interpretações literais de ironias ou figuras de linguagem. Indique a resposta correta ao final. Exemplo Prático ([História]): Charge de 1895 mostrando operários tecendo uma bandeira com fios marcados 'greve', enquanto figuras em trajes aristocráticos observam com lunetas de navios chamados 'Capital' e 'Estado'. Legenda: 'A nova tapeçaria nacional'. A charge expressa criticamente aspectos da realidade socioeconômica do Brasil no final do século XIX, destacando: a) A harmonia entre classes durante a industrialização; b) O papel do Estado como mediador de conflitos trabalhistas; c) A percepção das elites sobre as reivindicações operárias; d) A substituição do trabalho escravo pela mão de obra qualificada; e) A influência anarquista na organização sindical. Resposta: letra C. Diretrizes Essenciais: Priorize temas contemporâneos ou sua relação com processos históricos; Inclua pelo menos um elemento não verbal descrito textualmente em 30% das questões; Exija análise de valores implícitos (ideologia, preconceitos, visões de mundo); Garanta que 40% das questões tenham caráter interdisciplinar (ex: Ciências da Natureza + Sociologia); Nível de dificuldade equivalente às questões de maior peso do ENEM. Responda APENAS com a questão completa (Contexto, Enunciado, Alternativas, Resposta) em bloco único, sem formatação ou marcadores. Objetivo final: Simular a complexidade analítica e intertextual das melhores questões do ENEM.",
          },
          {
            role: "user",
            content: `Crie uma questão [${args.difficulty}] sobre essa disciplina: [${args.subject}] e com esse prompt: ${args.prompt}`,
          },
        ],
      });

      return response.choices[0]?.message?.content || "Erro ao gerar resposta.";
    } catch (error) {
      console.error("Erro ao chamar OpenAI:", error);
      throw new Error("Erro ao processar pedido ao OpenAI.");
    }
  },
});

export const generateAnswer = action({
  args: {
    questionText: v.string(),
    model: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (_, args) => {
    try {
      // Cria a mensagem de sistema baseada no tipo de entrada
      const systemMessage = {
        role: "system",
        content:
          "Você é um tutor educacional especializado em fornecer explicações detalhadas e didáticas para questões acadêmicas. Sua função é analisar a pergunta ou imagem do estudante e fornecer uma resposta completa, estruturada e educativa." +
          (args.imageUrl 
            ? " Quando analisar imagens, preste atenção especial a: fórmulas matemáticas, diagramas científicos, gráficos estatísticos, texto manuscrito, questões de múltipla escolha, equações e expressões algébricas, problemas geométricos, tabelas de dados, mapas conceituais, e qualquer outro elemento visual educacional. Se identificar uma questão com múltipla escolha, indique claramente qual seria a resposta correta e explique o raciocínio por trás disso." 
            : ""),
      };

      // Prepara as mensagens do usuário
      let userMessages;

      // Se tiver uma imagem, usa o formato de mensagem com imagem
      if (args.imageUrl) {
        let promptText = args.questionText;
        
        // Se não houver texto específico do usuário, usamos um prompt mais detalhado
        if (!args.questionText || args.questionText === "Analise esta imagem e explique detalhadamente o que vê") {
          promptText = "Analise esta imagem cuidadosamente e forneça uma explicação educacional detalhada. " +
            "Se for uma questão, resolva-a passo a passo. " +
            "Se for uma fórmula ou equação, explique seu significado e aplicação. " +
            "Se for um gráfico ou diagrama, interprete os dados ou conceitos apresentados. " +
            "Se for um texto manuscrito, transcreva-o e responda à questão, se houver alguma.";
        }
        
        userMessages = [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${promptText}\n\nForneça uma resposta estruturada com os seguintes elementos:\n1. Explicação dos conceitos fundamentais envolvidos\n2. Passos para resolver o problema (se aplicável)\n3. Análise da resposta correta\n4. Dicas para questões similares no futuro`,
              },
              {
                type: "image_url",
                image_url: {
                  url: args.imageUrl,
                },
              },
            ],
          },
        ];
      } else {
        // Se não tiver imagem, usa o formato de mensagem somente texto
        userMessages = [
          {
            role: "user",
            content: `Por favor, explique detalhadamente a seguinte questão: ${args.questionText}\n\nForneça uma resposta estruturada com os seguintes elementos:\n1. Explicação dos conceitos fundamentais envolvidos\n2. Passos para resolver o problema (se aplicável)\n3. Análise da resposta correta\n4. Dicas para questões similares no futuro`,
          },
        ];
      }

      // Monta a mensagem completa
      const messages = [systemMessage, ...userMessages];

      // Chama a API da OpenAI
      const response = await openai.chat.completions.create({
        model: args.model,
        messages: messages,
      });

      return response.choices[0]?.message?.content || "Erro ao gerar resposta.";
    } catch (error) {
      console.error("Erro ao chamar OpenAI:", error);
      throw new Error("Erro ao processar pedido ao OpenAI.");
    }
  },
});

export const generateStudyPlan = action({
  args: {
    prompt: v.string(),
    model: v.string(),
  },
  handler: async (_, args) => {
    try {
      const response = await openai.chat.completions.create({
        model: args.model,
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em pedagogia, metodologias de aprendizado e planejamento de estudos de ensino médio, com profundo conhecimento em técnicas avançadas de metacognição, metodologias ativas e aprendizado baseado em evidências. Sua especialidade é criar planos de estudo altamente personalizados e tecnicamente rigorosos para estudantes em diferentes níveis e áreas do conhecimento."
          },
          {
            role: "user",
            content: `Elabore um plano de estudos detalhado para: ${args.prompt}

Siga estas diretrizes:

1. ANÁLISE INICIAL (2 parágrafos)
   - Identifique os conceitos-chave e habilidades específicas que precisam ser desenvolvidas na área de estudo solicitada
   - Analise possíveis lacunas de conhecimento e pré-requisitos necessários
   - Determine marcos de progresso claros e mensuráveis

2. ESTRUTURA DO PLANO (cronograma de 4 semanas)
   - Divida o período em quatro semanas progressivas e bem definidas
   - Para cada semana, crie um cronograma diário específico (segunda a domingo)
   - Cada dia deve ter entre 3-5 blocos de estudo com duração, tópicos específicos e objetivos de aprendizagem claros
   - Alterne entre conteúdos complexos/técnicos e tópicos mais acessíveis

3. ESTRATÉGIAS ESPECÍFICAS DE APRENDIZADO (1-2 parágrafos por técnica)
   - Inclua no mínimo 5 técnicas de estudo específicas para a área solicitada, como:
     • Métodos de recuperação ativa (flashcards específicos, testes práticos)
     • Técnicas de elaboração (mapas mentais, resumos estruturados)
     • Estratégias de prática deliberada (exercícios de dificuldade progressiva)
     • Abordagens de aprendizado por projetos
     • Metodologias de revisão espaçada com calendário específico

4. RECURSOS TÉCNICOS (liste pelo menos 10)
   - Recomende recursos específicos e atuais para cada tópico
   - Inclua uma combinação de:
     • Livros sobre o tema
     • Vídeo-aulas técnicas 
     • Ferramentas de software/aplicativos especializados para a área

5. SISTEMA DE AVALIAÇÃO DE PROGRESSO (detalhado e específico)
   - Crie marcos de verificação de progresso semanais
   - Desenvolva métodos de autoavaliação específicos para a área
   - Inclua critérios claros para medir o domínio dos tópicos

6. ADAPTAÇÕES PARA DIFERENTES ESTILOS DE APRENDIZAGEM
   - Ofereça variações das técnicas principais para acomodar preferências de aprendizado visual, auditivo e cinestésico
   - Sugira ajustes para diferentes níveis de experiência prévia

7. PLANO DE CONTINGÊNCIA E FLEXIBILIDADE
   - Ofereça estratégias para lidar com tópicos desafiadores
   - Inclua um "plano B" para semanas com menos tempo disponível
   
8. CONSIDERAÇÕES FINAIS
   - Ofereça recomendações para a continuidade do estudo após as 4 semanas
   - Sugira formas de aplicação prática dos conhecimentos adquiridos

Importante:
- Use linguagem técnica apropriada para a área de estudo
- Seja extremamente específico nos tópicos, evitando generalidades
- Inclua detalhes técnicos relevantes que demonstrem conhecimento especializado
- Faça referências a conceitos, teorias e metodologias específicas da área
- Personalize completamente o plano com base no objetivo, nível e contexto descrito
- O plano deve ser desafiador, porém realista e aplicável

Apresente o plano em formato estruturado, com títulos e subtítulos claros, utilizando uma formatação que facilite a compreensão e implementação.`,
          },
        ],
      });

      return (
        response.choices[0]?.message?.content ||
        "Erro ao gerar plano de estudos."
      );
    } catch (error) {
      console.error("Erro ao chamar OpenAI:", error);
      throw new Error("Erro ao processar pedido ao OpenAI.");
    }
  },
});
