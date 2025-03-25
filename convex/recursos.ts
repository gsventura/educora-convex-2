import { query } from "./_generated/server";
import { v } from "convex/values";

// Definindo a estrutura de um recurso
export interface Recurso {
  _id: string;
  titulo: string;
  descricao: string;
  slug: string;
  conteudo?: string;
  categoria?: string;
  dataCriacao: number;
  dataAtualizacao: number;
}

// Query para listar todos os recursos disponíveis
export const listarRecursos = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Esta é uma implementação de exemplo. Em um ambiente real,
    // você buscaria estes dados da sua tabela no banco de dados Convex.
    
    // Simulando dados para uso imediato (em produção, busque do banco)
    return [
      {
        _id: "1",
        titulo: "Primeiros Passos",
        descricao: "Guia completo para começar a usar nossa plataforma",
        slug: "primeiros-passos",
        categoria: "iniciante",
        dataCriacao: Date.now(),
        dataAtualizacao: Date.now()
      },
      {
        _id: "2",
        titulo: "Dicas Avançadas",
        descricao: "Recursos avançados para usuários experientes",
        slug: "dicas-avancadas",
        categoria: "avancado",
        dataCriacao: Date.now(),
        dataAtualizacao: Date.now()
      },
      {
        _id: "3",
        titulo: "Perguntas Frequentes",
        descricao: "Respostas para as dúvidas mais comuns",
        slug: "faq",
        categoria: "suporte",
        dataCriacao: Date.now(),
        dataAtualizacao: Date.now()
      }
    ] as Recurso[];
  },
});

// Query para buscar um recurso específico pelo slug
export const obterRecursoPorSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // TODO: Em um ambiente real, busque o recurso pelo slug no banco de dados
    
    // Dados de exemplo para uso imediato
    const recursos = [
      {
        _id: "1",
        titulo: "Primeiros Passos",
        descricao: "Guia completo para começar a usar nossa plataforma",
        slug: "primeiros-passos",
        categoria: "iniciante",
        dataCriacao: Date.now(),
        dataAtualizacao: Date.now()
      },
      {
        _id: "2",
        titulo: "Dicas Avançadas",
        descricao: "Recursos avançados para usuários experientes",
        slug: "dicas-avancadas",
        categoria: "avancado",
        dataCriacao: Date.now(),
        dataAtualizacao: Date.now()
      },
      {
        _id: "3",
        titulo: "Perguntas Frequentes",
        descricao: "Respostas para as dúvidas mais comuns",
        slug: "faq",
        categoria: "suporte",
        dataCriacao: Date.now(),
        dataAtualizacao: Date.now()
      }
    ] as Recurso[];
    
    return recursos.find(recurso => recurso.slug === args.slug) || null;
  },
}); 