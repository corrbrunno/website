import type { PageServerLoad } from './$types';
import { isDbConfigured, listLatestPosts } from '$lib/server/db/queries';

// Newest posts for the home section. The home page survives without the database.
export const load: PageServerLoad = async () => {
	if (!isDbConfigured()) return { posts: [] };

	try {
		return { posts: await listLatestPosts(4) };
	} catch (cause) {
		console.error('[home] latest posts load failed:', cause);
		return { posts: [] };
	}
};
