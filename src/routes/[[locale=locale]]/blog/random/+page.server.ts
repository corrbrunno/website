import type { PageServerLoad } from './$types';
import { localizeHref } from '$lib/paraglide/runtime';
import { getRandomPostSlug, isDbConfigured } from '$lib/server/db/queries';
import { error, redirect } from '@sveltejs/kit';

// The draw comes from the database; ?exclude keeps the reader off the post they are on.
export const load: PageServerLoad = async ({ url }) => {
	const exclude = url.searchParams.get('exclude') || null;

	if (!isDbConfigured()) throw error(503, 'Banco de dados indisponível');

	let slug: string | null = null;
	try {
		slug = await getRandomPostSlug(exclude);
	} catch (cause) {
		console.error('[blog] random post failed:', cause);
		throw error(503, 'Banco de dados indisponível');
	}

	// No posts to draw from lands on the listing instead of looping back here.
	return redirect(303, localizeHref(slug ? `/blog/${slug}` : '/blog'));
};
