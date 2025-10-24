import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/client/posts';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const posts = await getPosts();
  const excludeSlug = url.searchParams.get("exclude");

  const randomIndex = Math.floor(Math.random() * posts.length);

  const selected = posts[randomIndex].slug == excludeSlug
    ? posts[(randomIndex + 1) % posts.length]
    : posts[randomIndex];

  return redirect(303, `/blog/${selected.slug}`);
};