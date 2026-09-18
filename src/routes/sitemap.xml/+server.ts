import type { RequestHandler } from '@sveltejs/kit';
import { response } from 'super-sitemap/sveltekit';
import { listPostSlugs } from '$lib/server/db/queries';

export const GET: RequestHandler = async () => {
	const slugs = await listPostSlugs();

	return await response({
		origin: 'https://corrbrunno.dev.br',
		locales: { default: 'pt-br', alternates: ['en'] },
		excludeRoutePatterns: [/^\/blog\/random/],
		paramValues: {
			'/[[locale=locale]]/blog/[slug]': slugs
		},
		defaultChangefreq: 'weekly'
	});
};
