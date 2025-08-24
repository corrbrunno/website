import type { PageLoad } from './$types';
import { getPostBySlug } from '$lib/client/posts';

export const load: PageLoad = async ({ params }) => {
 const post = await getPostBySlug(params.slug);
  return {
    content: post.default,
    metadata: post.metadata
  };
};