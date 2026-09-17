import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostViews, isDbConfigured, registerView } from '$lib/server/db/queries';

/** GET — leitura do contador. */
export const GET: RequestHandler = async ({ params }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	try {
		const views = await getPostViews(params.slug);
		if (views === null) return json({ error: 'post_not_synced' }, { status: 404 });
		return json({ slug: params.slug, views });
	} catch (error) {
		console.error('[api/views] falha ao ler:', error);
		return json({ error: 'database_unavailable' }, { status: 503 });
	}
};

/** POST — incrementa o contador (uma chamada por visita do cliente). */
export const POST: RequestHandler = async ({ params }) => {
	if (!isDbConfigured()) return json({ error: 'database_not_configured' }, { status: 503 });

	try {
		const views = await registerView(params.slug);
		if (views === null) return json({ error: 'post_not_synced' }, { status: 404 });
		return json({ slug: params.slug, views });
	} catch (error) {
		console.error('[api/views] falha ao incrementar:', error);
		return json({ error: 'database_unavailable' }, { status: 503 });
	}
};
