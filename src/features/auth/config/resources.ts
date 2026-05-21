import { Database, File, Mail, Settings2, User, Users2 } from 'lucide-react';

export const ROLES = {
  EDITAR_BASE_DADOS: 'EDITAR_BASE_DADOS',
  VISUALIZAR_RELATORIOS: 'VISUALIZAR_RELATORIOS',
  EDITAR_CAMPANHAS: 'EDITAR_CAMPANHAS',
  EDITAR_INTEGRACOES: 'EDITAR_INTEGRACOES',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Nomes de recurso válidos para resolvePath e toda a lógica de rotas.
 */
export type ResourceName = keyof typeof RESOURCE_CONFIG;

export interface ResourceEntry {
  /**Se aparece na navbar */
  show?:false;
  /**Path para requisições */
  path: string;
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
    path: 'usuarios',
    userRole: null,
    label: 'Usuários',
    icon: User,
    adminOnly: true,
  },
  campanhas: {
    path: 'campanhas',
    userRole: ROLES.EDITAR_CAMPANHAS,
    label: 'Campanhas',
    icon: Mail,
    adminOnly: false,
  },
  templates: {
    path: 'templates',
    userRole: ROLES.EDITAR_CAMPANHAS,
    label: 'Templates',
    icon: File,
    adminOnly: false,
  },
  bases: {
    path: 'bases-dados',
    userRole: ROLES.EDITAR_BASE_DADOS,
    label: 'Bases de Dados',
    icon: Database,
    adminOnly: false,
  },
  clientes: {
    show:false,
    path: 'clientes',
    userRole: ROLES.EDITAR_BASE_DADOS,
    label: 'Clientes',
    icon: Users2,
    adminOnly: false,
  },
  integracoes: {
    path: 'integracoes',
    userRole: ROLES.EDITAR_INTEGRACOES,
    label: 'Integrações',
    icon: Settings2,
    adminOnly: false,
  },
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
 * Útil quando uma role dá acesso a múltiplos recursos (ex: EDITAR_CAMPANHAS → campanhas e templates).
 */
export function getRecursosParaRole(role: Role): ResourceName[] {
  return Object.entries(RESOURCE_CONFIG)
    .filter(([_, config]) => config.userRole === role)
    .map(([name]) => name as ResourceName);
}
