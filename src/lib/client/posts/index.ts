import type { PostMetadata, PostModule } from "$lib/types";
import { error } from "@sveltejs/kit";

export async function getPosts() {
  const modules = import.meta.glob<PostModule>('/src/posts/*.{md,svx}');

  const posts = await Promise.all<PostMetadata>(
    Object.entries(modules).map(async ([path, resolver]) => {
      const { metadata }  = await resolver();
      return {
        ...metadata,
        slug: path.split('/').pop()?.replace(/\.(md|svx)$/, '')
      };
    })
  );

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts };
}

export async function getPostBySlug(slug: string) : Promise<PostModule>{
  const modules = import.meta.glob<PostModule>('/src/posts/*.{md,svx}');

  const match = Object.entries(modules).find(([path]) =>
    path.endsWith(`${slug}.md`) || path.endsWith(`${slug}.svx`)
  );

  if (!match) {
    return error(404,'Not found');
  }

  const resolver = match[1];
  const post = await resolver();

  return post;
};