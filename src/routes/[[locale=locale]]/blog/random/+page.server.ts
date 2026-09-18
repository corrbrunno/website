import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/client/posts';
import { localizeHref } from '$lib/paraglide/runtime';
import { getRandomPostSlug, isDbConfigured } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';

// Draws from the DB index; the mdsvex files are the fallback when the DB is unavailable.
export const load: PageServerLoad = async ({ url }) => {
	const exclude = url.searchParams.get('exclude') || null;
	let slug: string | null = null;

	if (isDbConfigured()) {
		try {
			slug = await getRandomPostSlug(exclude);
		} catch (error) {
			console.error('[blog] random post failed:', error);
		}
	}

	if (!slug) {
		const candidates = (await getPosts()).filter((post) => post.slug !== exclude);
		slug = candidates[Math.floor(Math.random() * candidates.length)]?.slug ?? null;
	}

	// Nothing left to draw (single post excluded) lands on the listing instead of looping.
	return redirect(303, localizeHref(slug ? `/blog/${slug}` : '/blog'));
};
