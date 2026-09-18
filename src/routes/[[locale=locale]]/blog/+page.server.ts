import type { PageServerLoad } from './$types';
import {
	findPostSlugs,
	getPostStats,
	getTagsByPost,
	isDbConfigured,
	listTags
} from '$lib/server/db/queries';
import type { PostStats, TagSummary } from '$lib/types';

export interface BlogFilters {
	q: string | null;
	tags: string[];
}

// DB index for the listing; without a database the list falls back to the mdsvex files.
export const load: PageServerLoad = async ({ url }) => {
	const filters: BlogFilters = {
		q: url.searchParams.get('q')?.trim() || null,
		tags: url.searchParams
			.getAll('tag')
			.map((tag) => tag.trim())
			.filter(Boolean)
	};

	const empty = {
		stats: {} as Record<string, PostStats>,
		tagsByPost: {} as Record<string, string[]>,
		tagCloud: [] as TagSummary[],
		matchedSlugs: null as string[] | null,
		filters,
		dbReady: false
	};

	if (!isDbConfigured()) return empty;

	try {
		const [stats, tagsByPost, tagCloud, matchedSlugs] = await Promise.all([
			getPostStats(),
			getTagsByPost(),
			listTags(),
			findPostSlugs(filters)
		]);

		return { stats, tagsByPost, tagCloud, matchedSlugs, filters, dbReady: true };
	} catch (error) {
		console.error('[blog] listing load failed:', error);
		return empty;
	}
};
