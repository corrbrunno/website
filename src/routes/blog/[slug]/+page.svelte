<script lang="ts">
	import Widget from '$lib/components/posts/widget.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ChevronRight, ChevronLeft } from '@lucide/svelte';
	import type { PageData } from './$types';
	const { data }: { data: PageData } = $props();
	const PostComponent = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title} | BCB</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>
<div class="mr-4 ml-4 ">
	<section class="max-w-content-width mr-auto ml-auto w-full pt-15">
		<Widget abbreviate={false} post={data.metadata} />
	</section>

	<ul class="flex w-full max-w-content-width justify-between mt-4 mb-4 m-auto">
			<li>
				<Button href="/blog">
					<ChevronLeft/>
					Posts
				</Button>
			</li>
			<li>
				<Button href={`/blog/random?exclude=${data.metadata.slug}`}>
					Random
					<ChevronRight/>
				</Button>
			</li>
	</ul>

	<Card.Root class="max-w-block-width mt-10 mr-auto mb-10 ml-auto w-full p-5">
		<Card.Content>
			<article
				class="prose prose-purple dark:prose-invert lg:prose-lg text-foreground max-w-none justify-center"
			>
				<PostComponent />
			</article>
		</Card.Content>
	</Card.Root>
</div>
