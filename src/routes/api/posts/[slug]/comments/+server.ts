import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	addComment,
	deleteComment,
	isDbConfigured,
	isRateLimited,
	listComments
} from '$lib/server/db/queries';
import { hashVisitor, isHoneypotFilled, validateComment } from '$lib/server/comments';

export const GET: RequestHandler = async ({ params }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	try {
		const comments = await listComments(params.slug);
		return json({ count: comments.length, comments });
	} catch (error) {
		console.error('[api/comments] list failed:', error);
		return json({ error: 'database_unavailable' }, { status: 503 });
	}
};

/** POST — creates a comment. Body: { author, body, website? } */
export const POST: RequestHandler = async ({ params, request, getClientAddress }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	let payload: { author?: unknown; body?: unknown; website?: unknown };
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'invalid_json' }, { status: 400 });
	}

	if (isHoneypotFilled(payload.website))
		return json({ ok: true, discarded: true }, { status: 202 });

	const result = validateComment(payload.author, payload.body);
	if (!result.ok) return json({ error: result.code }, { status: 400 });

	try {
		const visitorHash = hashVisitor(getClientAddress());
		if (await isRateLimited(visitorHash)) return json({ error: 'rate_limited' }, { status: 429 });

		const comment = await addComment({
			postSlug: params.slug,
			author: result.value.author,
			body: result.value.body,
			visitorHash
		});

		return json(
			{
				...comment,
				postSlug: params.slug,
				author: result.value.author,
				body: result.value.body
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('[api/comments] insert failed:', error);
		return json({ error: 'save_failed' }, { status: 503 });
	}
};

/** DELETE — Body: { id, token } (the token from creation, or COMMENTS_ADMIN_TOKEN). */
export const DELETE: RequestHandler = async ({ params, request }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	let payload: { id?: unknown; token?: unknown };
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'invalid_json' }, { status: 400 });
	}

	const id = Number(payload.id);
	const token = String(payload.token ?? '');
	if (!Number.isInteger(id) || id <= 0) return json({ error: 'invalid_id' }, { status: 400 });

	try {
		const removed = await deleteComment({ id, postSlug: params.slug, token });
		if (!removed) return json({ error: 'not_allowed' }, { status: 403 });
		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('[api/comments] delete failed:', error);
		return json({ error: 'delete_failed' }, { status: 503 });
	}
};
