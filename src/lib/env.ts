import { z } from 'zod';

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.BACKEND_URL ??
  'http://localhost:8000';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  BACKEND_URL: z.url(),
});

const _env = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL: backendUrl,
});

if (!_env.success) {
  console.error('Variáveis de ambiente inválidas:');
  console.error(
    _env.error.issues.map(
      (issue) =>
        `${issue.path} - ${issue.input} - ${issue.code} - ${issue.message}`,
    ),
  );
  throw new Error('Erro ao validar variáveis de ambiente');
}

export const env = _env.data;
