import type { PageLoad } from './$types';
import { getPostModuleBySlug } from '$lib/client/posts';

export const load: PageLoad = async ({ params }) => {
 const post = await getPostModuleBySlug(params.slug);
  return {
    content: post.default,
    metadata: post.metadata
  };
};