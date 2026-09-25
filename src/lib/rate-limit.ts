import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

/**
 * Rate limiting para rotas sensíveis (login admin, checkout, contato).
 *
 * Quando REDIS_URL está configurada (ver .env.example), usamos um limitador
 * compartilhado via Redis — necessário porque a Vercel roda cada requisição
 * numa instância que pode ser reiniciada a qualquer momento, então um
 * limitador só em memória (RateLimiterMemory) não protege de verdade em
 * produção: cada instância "esquece" as tentativas anteriores.
 *
 * Sem REDIS_URL (ex.: rodando localmente sem Redis configurado), caímos de
 * volta pro limitador em memória, só pra não travar o desenvolvimento.
 */
const redisUrl = process.env.REDIS_URL;

const redisClient = redisUrl
  ? new Redis(redisUrl, {
      // Não trava a requisição esperando reconexão: se o Redis estiver
      // fora do ar, falha rápido e deixamos o rateLimit() abaixo decidir
      // o que fazer (ver bloco catch).
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    })
  : null;

redisClient?.on("error", (err) => {
  console.error("[rate-limit] Erro de conexão com o Redis:", err);
});

type LimiterKind = "login" | "contact" | "checkout" | "api" | "emailCode" | "codeVerify";

const limiterOptions: Record<LimiterKind, { points: number; duration: number }> = {
  login: { points: 5, duration: 60 * 15 }, // 5 tentativas / 15min
  contact: { points: 5, duration: 60 * 10 },
  checkout: { points: 10, duration: 60 },
  api: { points: 60, duration: 60 },
  // Envio de código por e-mail (cadastro, reenvio, esqueci minha senha):
  // limita por e-mail para não permitir spam de mensagens a um destinatário.
  emailCode: { points: 3, duration: 60 * 10 }, // 3 envios / 10min
  // Verificação de código digitado: limita tentativas por e-mail, além do
  // contador de tentativas por código já guardado no banco.
  codeVerify: { points: 10, duration: 60 * 10 },
};

function buildLimiters(): Record<LimiterKind, RateLimiterRedis | RateLimiterMemory> {
  const entries = (Object.keys(limiterOptions) as LimiterKind[]).map((kind) => {
    const opts = limiterOptions[kind];
    const limiter = redisClient
      ? new RateLimiterRedis({ storeClient: redisClient, keyPrefix: `rl:${kind}`, ...opts })
      : new RateLimiterMemory(opts);
    return [kind, limiter] as const;
  });
  return Object.fromEntries(entries) as Record<LimiterKind, RateLimiterRedis | RateLimiterMemory>;
}

const limiters = buildLimiters();

export async function rateLimit(
  kind: LimiterKind,
  key: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    await limiters[kind].consume(key);
    return { allowed: true };
  } catch (err: any) {
    // rate-limiter-flexible rejeita de duas formas diferentes:
    // - limite realmente excedido: rejeita com um objeto RateLimiterRes
    //   (tem msBeforeNext, não é uma instância de Error);
    // - problema de conexão com o Redis: rejeita com uma instância de Error.
    // Se o Redis cair, preferimos deixar passar (fail-open) a bloquear todo
    // mundo por causa de uma instabilidade de infraestrutura.
    if (err instanceof Error) {
      console.error(`[rate-limit] Falha ao consultar o limitador "${kind}":`, err);
      return { allowed: true };
    }
    return { allowed: false, retryAfterSeconds: Math.ceil((err?.msBeforeNext ?? 1000) / 1000) };
  }
}
