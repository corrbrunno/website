import type { PageLoad } from './$types';
import { getPostModuleBySlug } from '$lib/client/posts';

// Load universal obrigatório: o mdsvex devolve um componente, que não atravessa load de servidor.
export const load: PageLoad = async ({ params, data }) => {
	const post = await getPostModuleBySlug(params.slug);

	return {
		...data,
		content: post.default,
		metadata: post.metadata
	};
};
