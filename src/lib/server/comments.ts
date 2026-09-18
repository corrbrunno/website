import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';

// Validation used by both the form action and the API: a weaker rule on one door becomes the real rule.
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

// Only a filled field signals a bot: an absent one can be a legit client (curl, API).
export function isHoneypotFilled(value: unknown): boolean {
	return typeof value === 'string' && value.trim().length > 0;
}

export const RATE_LIMIT_SECONDS = 30;

// Pseudonymous visitor id for the rate limit and the view counter. Returns null
// without VISITOR_HASH_SECRET, which disables both instead of blocking anything.
export function hashVisitor(ip: string | null | undefined): string | null {
	const secret = env.VISITOR_HASH_SECRET;
	if (!ip || !secret) return null;
	return createHmac('sha256', secret).update(ip).digest('hex').slice(0, 32);
}
