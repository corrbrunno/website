<script lang="ts">
	import Widget from '$lib/components/posts/post-widget.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ChevronRight, ChevronLeft } from '@lucide/svelte';
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Seo from '$lib/components/meta/seo.svelte';

	function descriptionFromContent(content: string, max = 155): string {
		const clean = content
			.replace(/!\[.*?\]\(.*?\)/g, '')
			.replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
			.replace(/#{1,6}\s/g, '')
			.trim();
		return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
	}

	const { data }: { data: PageData } = $props();
	const PostComponent = $derived(data.content);
</script>

<Seo
	title={m.seo_blog_post_title({ title: data.metadata.title })}
	description={m.seo_blog_post_desc({ description: data.metadata.description ? data.metadata.description : "" })}
	type="article"
	publishedTime={data.metadata.date}
/>

<div class="mr-4 ml-4">
	<section class="max-w-content-width mr-auto ml-auto w-full pt-15">
		<Widget abbreviate={false} post={data.metadata} />
	</section>

	<ul
		style="view-transition-name: blog-post-controls;"
		class="max-w-content-width m-auto mt-4 mb-4 flex w-full justify-between"
	>
		<li>
			<Button variant="secondary" href="/blog">
				<ChevronLeft />
				Posts
			</Button>
		</li>
		<li>
			<Button variant="secondary" href={`/blog/random?exclude=${data.metadata.slug}`}>
				Random
				<ChevronRight />
			</Button>
		</li>
	</ul>

	<Card.Root
		style="view-transition-name: blog-post-content;"
		class="max-w-block-width mt-10 mr-auto mb-10 ml-auto w-full p-5"
	>
		<Card.Content>
			<article
				class="prose prose-purple dark:prose-invert lg:prose-lg text-foreground max-w-none justify-center"
			>
				<PostComponent />
			</article>
		</Card.Content>
	</Card.Root>
</div>
