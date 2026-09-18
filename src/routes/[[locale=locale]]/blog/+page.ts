import type { PageLoad } from './$types';
import { getPosts } from '$lib/client/posts';

// Content and metadata come from mdsvex; counters, tags and search come from the DB index.
export const load: PageLoad = async ({ data }) => {
	const posts = await getPosts();

	const enriched = posts.map((post) => ({
		...post,
		...(data.stats?.[post.slug] ?? {}),
		tags: data.tagsByPost?.[post.slug] ?? []
	}));

	const filtered = data.matchedSlugs
		? enriched.filter((post) => data.matchedSlugs?.includes(post.slug))
		: enriched;

	const hasFilter = Boolean(data.filters?.q || data.filters?.tag);

	return {
		posts: filtered,
		tagCloud: data.tagCloud ?? [],
		filters: data.filters ?? { q: null, tag: null },
		searchUnavailable: hasFilter && !data.dbReady
	};
};
