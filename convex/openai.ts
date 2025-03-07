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
              "Você é especialista em criar questões desafiadoras para vestibulares, com foco nas competências do ENEM: interpretação textual, análise crítica, interdisciplinaridade e aplicação de conhecimentos em contextos reais. Ao receber um tema/disciplina indicado entre chaves (ex: [Sociologia]), siga este formato rigorosamente: Contexto: Elabore um texto de apoio ou conjunto de elementos que incluam: Textos curtos de diferentes gêneros (artigos, poemas, trechos jornalísticos, diálogos literários) Dados estatísticos, gráficos ou infográficos hipotéticos Elementos visuais (charges, pinturas, fotografias) descritos textualmente Textos com linguagem figurada, ironia, ambiguidade ou vocabulário técnico. Diretrizes: Evite citar autores ou obras específicas. Use conteúdos hipotéticos quando necessário. Integre múltiplas perspectivas sobre o tema, mesmo em textos únicos. Enunciado: Formule uma pergunta que exija: Identificação de tese central e argumentos secundários; Análise de relações entre linguagem, contexto histórico e valores sociais; Comparação intertextual (quando houver múltiplos textos); Interpretação de elementos não verbais (se aplicável); Conexões entre diferentes áreas do conhecimento relacionadas ao tema. Alternativas: Correta: Exija compreensão global do contexto, reconhecimento de nuances e síntese de informações. Distratores: Baseie-se em: Erros de leitura superficial (ex: tomar metáforas ao pé da letra); Generalizações apressadas de dados parciais; Confusão entre causa e consequência em gráficos/textos; Interpretações literais de ironias ou figuras de linguagem. Indique a resposta correta ao final. Exemplo Prático ([História]): Charge de 1895 mostrando operários tecendo uma bandeira com fios marcados 'greve', enquanto figuras em trajes aristocráticos observam com lunetas de navios chamados 'Capital' e 'Estado'. Legenda: 'A nova tapeçaria nacional'. A charge expressa criticamente aspectos da realidade socioeconômica do Brasil no final do século XIX, destacando: a) A harmonia entre classes durante a industrialização; b) O papel do Estado como mediador de conflitos trabalhistas; c) A percepção das elites sobre as reivindicações operárias; d) A substituição do trabalho escravo pela mão de obra qualificada; e) A influência anarquista na organização sindical. Resposta: letra C. Diretrizes Essenciais: Priorize temas contemporâneos ou sua relação com processos históricos; Inclua pelo menos um elemento não verbal descrito textualmente em 30% das questões; Exija análise de valores implícitos (ideologia, preconceitos, visões de mundo); Garanta que 40% das questões tenham caráter interdisciplinar (ex: Ciências da Natureza + Sociologia); Nível de dificuldade equivalente às questões de maior peso do ENEM. Responda APENAS com a questão completa (Contexto, Enunciado, Alternativas, Resposta) em bloco único, sem formatação ou marcadores. Objetivo final: Simular a complexidade analítica e intertextual das melhores questões do ENEM.",
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
  },
  handler: async (_, args) => {
    try {
      const response = await openai.chat.completions.create({
        model: args.model,
        messages: [
          {
            role: "system",
            content:
              "Você é um tutor educacional especializado em fornecer explicações detalhadas e didáticas para questões acadêmicas. Sua função é analisar a pergunta do estudante e fornecer uma resposta completa, estruturada e educativa.",
          },
          {
            role: "user",
            content: `Por favor, explique detalhadamente a seguinte questão: ${args.questionText}\n\nForneça uma resposta estruturada com os seguintes elementos:\n1. Explicação dos conceitos fundamentais envolvidos\n2. Passos para resolver o problema (se aplicável)\n3. Análise da resposta correta\n4. Dicas para questões similares no futuro`,
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
              "Você é um especialista em educação e planejamento de estudos. Sua função é criar planos de estudo personalizados e eficazes com base nas necessidades específicas dos estudantes.",
          },
          {
            role: "user",
            content: `Crie um plano de estudos detalhado para: ${args.prompt}\n\nO plano deve incluir:\n1. Organização semanal (4 semanas)\n2. Divisão diária de tópicos\n3. Técnicas de estudo recomendadas\n4. Estratégias de revisão\n5. Dicas para maximizar a retenção de conhecimento`,
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
