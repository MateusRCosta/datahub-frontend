import {
  Database,
  DatabaseSearch,
  File,
  FileCog2,
  Mail,
  ServerCog,
  Settings2,
  User,
  Users2,
} from 'lucide-react';

export const ROLES = {
  GERENCIAR_BASE_DADOS: 'GERENCIAR_BASE_DADOS',
  GERENCIAR_VISUALIZACOES: 'GERENCIAR_VISUALIZACOES',
  GERENCIAR_CAMPANHAS: 'GERENCIAR_CAMPANHAS',
  GERENCIAR_INTEGRACOES: 'GERENCIAR_INTEGRACOES',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Nomes de recurso válidos para resolvePath e toda a lógica de rotas.
 */
export type ResourceName = keyof typeof RESOURCE_CONFIG;

export interface ResourceEntry {
  /**Se aparece na navbar */
  show?: false;
  /**Path para requisições */
  pathApi: string;
  /**Path para caminho interno */
  pathFront: string;
  /** Role de usuário comum (null = somente admin) */
  userRole: Role | null;
  /** Label para o sidebar */
  label: string;
  /** Ícone Lucide para o sidebar */
  icon: React.ComponentType<{ className?: string }>;
  /** true = aparece somente na seção 'Administração' do sidebar */
  adminOnly: boolean;
}

/**
 * Fonte de verdade única para mapeamento de recurso: roles, label e ícone.
 *
 */
export const RESOURCE_CONFIG = {
  usuarios: {
    pathApi: 'usuarios',
    pathFront: 'usuarios',
    userRole: null,
    label: 'Usuários',
    icon: User,
    adminOnly: true,
  },
  campanhas: {
    pathApi: 'campanhas',
    pathFront: 'campanhas',
    userRole: ROLES.GERENCIAR_CAMPANHAS,
    label: 'Campanhas',
    icon: Mail,
    adminOnly: false,
  },
  templates: {
    pathApi: 'templates',
    pathFront: 'templates',
    userRole: ROLES.GERENCIAR_CAMPANHAS,
    label: 'Templates',
    icon: File,
    adminOnly: false,
  },
  views: {
    pathApi: 'views',
    pathFront: 'visualizacoes',
    userRole: ROLES.GERENCIAR_VISUALIZACOES,
    label: 'Visualizações',
    icon: DatabaseSearch,
    adminOnly: false
  },
  basesDados: {
    pathApi: 'bases-dados',
    pathFront: 'bases-dados',
    userRole: ROLES.GERENCIAR_BASE_DADOS,
    label: 'Bases de Dados',
    icon: Database,
    adminOnly: false,
  },
  clientes: {
    show: false,
    pathApi: 'clientes',
    pathFront: 'clientes',
    userRole: ROLES.GERENCIAR_BASE_DADOS,
    label: 'Clientes',
    icon: Users2,
    adminOnly: false,
  },
  integracoes: {
    pathApi: 'integracoes',
    pathFront: 'integracoes',
    userRole: ROLES.GERENCIAR_INTEGRACOES,
    label: 'Integrações de coletas',
    icon: ServerCog,
    adminOnly: false,
  },
  integracoesCampanhas: {
    pathApi: 'integracoes-campanhas',
    pathFront: 'integracoes-campanhas',
    userRole: ROLES.GERENCIAR_INTEGRACOES,
    label: 'Integrações de campanhas',
    icon: FileCog2,
    adminOnly: false,
  }
} as const satisfies Record<string, ResourceEntry>;

/**
 * Retorna as roles necessárias para acessar um recurso (user OU admin).
 */
export function getRolesParaRecurso(resource: ResourceName): Role[] {
  const config = RESOURCE_CONFIG[resource];
  const roles: Role[] = [];
  if (config.userRole) roles.push(config.userRole);
  return roles;
}

/**
 * Retorna todos os recursos associados a uma role.
 * Útil quando uma role dá acesso a múltiplos recursos (ex: GERENCIAR_CAMPANHAS → campanhas e templates).
 */
export function getRecursosParaRole(role: Role): ResourceName[] {
  return Object.entries(RESOURCE_CONFIG)
    .filter(([_, config]) => config.userRole === role)
    .map(([name]) => name as ResourceName);
}
