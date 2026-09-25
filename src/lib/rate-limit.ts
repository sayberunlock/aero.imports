import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * Rate limiting para rotas sensíveis (login admin, checkout, contato).
 * Em produção com múltiplas instâncias, trocar por RateLimiterRedis
 * apontando para o Redis do VPS (ver .env.example REDIS_URL).
 */
const limiters = {
  login: new RateLimiterMemory({ points: 5, duration: 60 * 15 }), // 5 tentativas / 15min
  contact: new RateLimiterMemory({ points: 5, duration: 60 * 10 }),
  checkout: new RateLimiterMemory({ points: 10, duration: 60 }),
  api: new RateLimiterMemory({ points: 60, duration: 60 }),
};

export async function rateLimit(
  kind: keyof typeof limiters,
  key: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    await limiters[kind].consume(key);
    return { allowed: true };
  } catch (err: any) {
    return { allowed: false, retryAfterSeconds: Math.ceil((err?.msBeforeNext ?? 1000) / 1000) };
  }
}
