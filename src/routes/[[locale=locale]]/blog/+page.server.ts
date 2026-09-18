import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getPostStats,
	getTagsByPost,
	isDbConfigured,
	listPosts,
	listTags
} from '$lib/server/db/queries';

export interface BlogFilters {
	q: string | null;
	tags: string[];
}

// The database is the only source: listing, tags and counters all come from it.
export const load: PageServerLoad = async ({ url }) => {
	const filters: BlogFilters = {
		q: url.searchParams.get('q')?.trim() || null,
		tags: url.searchParams
			.getAll('tag')
			.map((tag) => tag.trim())
			.filter(Boolean)
	};

	if (!isDbConfigured()) throw error(503, 'Banco de dados indisponível');

	try {
		const [rows, stats, tagsByPost, tagCloud] = await Promise.all([
			listPosts(filters),
			getPostStats(),
			getTagsByPost(),
			listTags()
		]);

		const posts = rows.map((post) => ({
			...post,
			...(stats[post.slug] ?? { views: post.views, comments: 0 }),
			tags: tagsByPost[post.slug] ?? []
		}));

		return { posts, tagCloud, filters };
	} catch (cause) {
		console.error('[blog] listing load failed:', cause);
		throw error(503, 'Banco de dados indisponível');
	}
};
