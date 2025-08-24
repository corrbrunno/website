import { getPosts } from "$lib/client/posts";

export async function load() {
  return await getPosts();
}