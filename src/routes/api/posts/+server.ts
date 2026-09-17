import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPosts } from '$lib/client/posts';
import { getPostStats, getTagsByPost, isDbConfigured } from '$lib/server/db/queries';

/** GET /api/posts — metadados do mdsvex + contadores e tags do banco. */
export const GET: RequestHandler = async () => {
	const posts = await getPosts();

	if (!isDbConfigured()) {
		return json({ count: posts.length, database: 'not_configured', posts });
	}

	try {
		const [stats, tagsByPost] = await Promise.all([getPostStats(), getTagsByPost()]);

		return json({
			count: posts.length,
			database: 'ok',
			posts: posts.map((post) => ({
				...post,
				tags: tagsByPost[post.slug] ?? [],
				...(stats[post.slug] ?? { views: 0, comments: 0 })
			}))
		});
	} catch (error) {
		console.error('[api/posts] falha ao consultar o banco:', error);
		return json({ count: posts.length, database: 'unavailable', posts }, { status: 503 });
	}
};
