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
	tag: string | null;
}

/** Índice do banco para a listagem. Sem banco, a lista vem dos arquivos do mdsvex. */
export const load: PageServerLoad = async ({ url }) => {
	const filters: BlogFilters = {
		q: url.searchParams.get('q')?.trim() || null,
		tag: url.searchParams.get('tag')?.trim() || null
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
		console.error('[blog] banco indisponível na listagem:', error);
		return empty;
	}
};
