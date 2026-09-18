import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostStats, getTagsByPost, isDbConfigured, listPosts } from '$lib/server/db/queries';

export const GET: RequestHandler = async () => {
	if (!isDbConfigured()) {
		return json({ count: 0, database: 'not_configured', posts: [] }, { status: 503 });
	}

	try {
		const [posts, stats, tagsByPost] = await Promise.all([
			listPosts(),
			getPostStats(),
			getTagsByPost()
		]);

		return json({
			count: posts.length,
			database: 'ok',
			posts: posts.map((post) => ({
				...post,
				...(stats[post.slug] ?? { views: post.views, comments: 0 }),
				tags: tagsByPost[post.slug] ?? []
			}))
		});
	} catch (cause) {
		console.error('[api/posts] query failed:', cause);
		return json({ count: 0, database: 'unavailable', posts: [] }, { status: 503 });
	}
};
