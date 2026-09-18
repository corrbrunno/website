import type { PageLoad } from './$types';
import { getPostModuleBySlug } from '$lib/client/posts';

// A universal load is required: mdsvex returns a component, which cannot cross a server load.
export const load: PageLoad = async ({ params, data }) => {
	const post = await getPostModuleBySlug(params.slug);

	return {
		...data,
		content: post.default,
		metadata: post.metadata
	};
};
