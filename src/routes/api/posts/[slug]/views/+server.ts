import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostViews, isDbConfigured, registerView } from '$lib/server/db/queries';
import { hashVisitor } from '$lib/server/comments';

export const GET: RequestHandler = async ({ params }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	try {
		const views = await getPostViews(params.slug);
		if (views === null) return json({ error: 'post_not_synced' }, { status: 404 });
		return json({ slug: params.slug, views });
	} catch (error) {
		console.error('[api/views] read failed:', error);
		return json({ error: 'database_unavailable' }, { status: 503 });
	}
};

/** POST — counts one view per visitor (see registerView for the dedupe window). */
export const POST: RequestHandler = async ({ params, getClientAddress }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	try {
		const views = await registerView(params.slug, hashVisitor(getClientAddress()));
		if (views === null) return json({ error: 'post_not_synced' }, { status: 404 });
		return json({ slug: params.slug, views });
	} catch (error) {
		console.error('[api/views] increment failed:', error);
		return json({ error: 'database_unavailable' }, { status: 503 });
	}
};
