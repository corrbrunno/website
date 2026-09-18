import { error, fail, isHttpError } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	addComment,
	deleteComment,
	getPost,
	isDbConfigured,
	isRateLimited,
	listComments,
	listTagsForPost
} from '$lib/server/db/queries';
import { hashVisitor, isHoneypotFilled, validateComment } from '$lib/server/comments';

// Post metadata, body HTML, counters and tags all come from the database.
export const load: PageServerLoad = async ({ params }) => {
	if (!isDbConfigured()) throw error(503, 'Banco de dados indisponível');

	try {
		const [post, comments, tags] = await Promise.all([
			getPost(params.slug),
			listComments(params.slug),
			listTagsForPost(params.slug)
		]);

		if (!post) throw error(404, 'Post não encontrado');

		return {
			metadata: {
				slug: post.slug,
				title: post.title,
				description: post.description,
				date: post.date
			},
			bodyHtml: post.bodyHtml ?? '',
			views: post.views,
			tags,
			comments,
			dbReady: true
		};
	} catch (cause) {
		if (isHttpError(cause)) throw cause;
		console.error('[blog] post load failed:', cause);
		throw error(503, 'Banco de dados indisponível');
	}
};

export const actions: Actions = {
	comment: async ({ request, params, getClientAddress }) => {
		if (!isDbConfigured()) return fail(503, { code: 'unavailable' });

		const form = await request.formData();

		if (isHoneypotFilled(form.get('website'))) return { ok: true, discarded: true };

		const result = validateComment(form.get('author'), form.get('body'));
		if (!result.ok) return fail(400, { code: result.code });

		try {
			const visitorHash = hashVisitor(getClientAddress());
			if (await isRateLimited(visitorHash)) return fail(429, { code: 'rate_limited' });

			const { id, deleteToken } = await addComment({
				postSlug: params.slug,
				author: result.value.author,
				body: result.value.body,
				visitorHash
			});

			return { ok: true, id, deleteToken };
		} catch (cause) {
			console.error('[blog] comment insert failed:', cause);
			return fail(500, { code: 'save_failed' });
		}
	},

	delete: async ({ request, params }) => {
		if (!isDbConfigured()) return fail(503, { code: 'unavailable' });

		const form = await request.formData();
		const id = Number(form.get('id'));
		const token = String(form.get('token') ?? '');

		if (!Number.isInteger(id) || id <= 0) return fail(400, { code: 'invalid_id' });

		try {
			const removed = await deleteComment({ id, postSlug: params.slug, token });
			if (!removed) return fail(403, { code: 'not_allowed' });
			return { ok: true, removed: id };
		} catch (cause) {
			console.error('[blog] comment delete failed:', cause);
			return fail(500, { code: 'delete_failed' });
		}
	}
};
