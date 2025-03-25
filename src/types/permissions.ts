// Definição de tipos para o sistema de permissões por plano

// Tipos de planos disponíveis no sistema
export type PlanTier = 'free' | 'basic' | 'pro';

// Interface que define todas as permissões disponíveis
export interface PlanPermissions {
  // Qual plano o usuário possui
  tier: PlanTier;
  
  // Limites de recursos
  maxStudyPlans: number;
  maxSavedItems: number;
  maxQuestions: number;
  
  // Recursos premium
  accessToAIModel: 'basic' | 'advanced';
  hasUnlimitedCredits: boolean;
  hasAdvancedAI: boolean;
  canExportPDF: boolean;
  
  // Você pode adicionar mais permissões conforme necessário
}

// Permissões padrão para o plano gratuito
export const FREE_PERMISSIONS: PlanPermissions = {
  tier: "free",
  maxStudyPlans: 1,
  maxSavedItems: 5,
  accessToAIModel: "basic",
  hasUnlimitedCredits: false,
  maxQuestions: 5,
  hasAdvancedAI: false,
  canExportPDF: false,
};

// Permissões para o plano básico
export const BASIC_PERMISSIONS: PlanPermissions = {
  tier: "basic",
  maxStudyPlans: 3,
  maxSavedItems: 50,
  accessToAIModel: "basic",
  hasUnlimitedCredits: true,
  maxQuestions: 50,
  hasAdvancedAI: false,
  canExportPDF: true,
};

// Permissões para o plano pro
export const PRO_PERMISSIONS: PlanPermissions = {
  tier: "pro",
  maxStudyPlans: Infinity,
  maxSavedItems: Infinity,
  accessToAIModel: "advanced",
  hasUnlimitedCredits: true,
  maxQuestions: Infinity,
  hasAdvancedAI: true,
  canExportPDF: true,
};

// Função utilitária para obter as permissões por tipo de plano
export function getPermissionsForTier(tier: PlanTier): PlanPermissions {
  switch (tier) {
    case "basic":
      return BASIC_PERMISSIONS;
    case "pro":
      return PRO_PERMISSIONS;
    default:
      return FREE_PERMISSIONS;
  }
} 