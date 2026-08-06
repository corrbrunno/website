import type { RequestHandler } from '@sveltejs/kit';
import { response } from 'super-sitemap/sveltekit';
import { getPosts } from '$lib/client/posts';

export const GET: RequestHandler = async () => {
	const posts = await getPosts();
	return await response({
		origin: 'https://corrbrunno.dev.br',
		locales: { default: 'pt-br', alternates: ['en'] },
		excludeRoutePatterns: [/^\/blog\/random/],
		paramValues: {
			'/[[locale]]/blog/[slug]': posts.map((p) => p.slug)
		},
		defaultChangefreq: 'weekly'
	});
};