import { getPosts } from "$lib/client/posts";


export async function load() {
  return { posts: (await getPosts()).slice(-4) };
}