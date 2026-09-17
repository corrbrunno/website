import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';

// Regras usadas pela form action E pela API — se cada porta validasse sozinha, a mais frouxa viraria a regra real.

export const COMMENT_LIMITS = {
	authorMin: 2,
	authorMax: 40,
	bodyMin: 3,
	bodyMax: 1000
} as const;

export type CommentErrorCode =
	| 'author_short'
	| 'author_long'
	| 'body_short'
	| 'body_long'
	| 'rate_limited'
	| 'unavailable'
	| 'save_failed';

export interface CommentInput {
	author: string;
	body: string;
}

export type ValidationResult =
	| { ok: true; value: CommentInput }
	| { ok: false; code: 'author_short' | 'author_long' | 'body_short' | 'body_long' };

export function validateComment(author: unknown, body: unknown): ValidationResult {
	const cleanAuthor = String(author ?? '').trim();
	const cleanBody = String(body ?? '').trim();

	if (cleanAuthor.length < COMMENT_LIMITS.authorMin) return { ok: false, code: 'author_short' };
	if (cleanAuthor.length > COMMENT_LIMITS.authorMax) return { ok: false, code: 'author_long' };
	if (cleanBody.length < COMMENT_LIMITS.bodyMin) return { ok: false, code: 'body_short' };
	if (cleanBody.length > COMMENT_LIMITS.bodyMax) return { ok: false, code: 'body_long' };

	return { ok: true, value: { author: cleanAuthor, body: cleanBody } };
}

/** Só campo preenchido é sinal de bot: ausente pode ser cliente legítimo (curl, API). */
export function isHoneypotFilled(value: unknown): boolean {
	return typeof value === 'string' && value.trim().length > 0;
}

export const RATE_LIMIT_SECONDS = 30;

/** Sem `COMMENT_IP_SECRET` devolve null: o rate limit fica desligado em vez de bloquear. */
export function hashIp(ip: string | null | undefined): string | null {
	const secret = env.COMMENT_IP_SECRET;
	if (!ip || !secret) return null;
	return createHmac('sha256', secret).update(ip).digest('hex').slice(0, 32);
}
