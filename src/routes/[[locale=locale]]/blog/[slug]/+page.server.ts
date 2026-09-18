import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	addComment,
	deleteComment,
	getPostViews,
	isDbConfigured,
	isRateLimited,
	listComments,
	listTagsForPost
} from '$lib/server/db/queries';
import { hashVisitor, isHoneypotFilled, validateComment } from '$lib/server/comments';
import type { Comment, TagSummary } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isDbConfigured()) {
		return { comments: [] as Comment[], views: null, tags: [] as TagSummary[], dbReady: false };
	}

	try {
		const [comments, views, tags] = await Promise.all([
			listComments(params.slug),
			getPostViews(params.slug),
			listTagsForPost(params.slug)
		]);
		return { comments, views, tags, dbReady: true };
	} catch (error) {
		console.error('[blog] post load failed:', error);
		return { comments: [] as Comment[], views: null, tags: [] as TagSummary[], dbReady: false };
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
		} catch (error) {
			console.error('[blog] comment insert failed:', error);
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
		} catch (error) {
			console.error('[blog] comment delete failed:', error);
			return fail(500, { code: 'delete_failed' });
		}
	}
};
