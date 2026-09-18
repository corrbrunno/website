<script lang="ts">
	import Widget from '$lib/components/posts/post-widget.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ChevronRight, ChevronLeft } from '@lucide/svelte';
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Seo, { type BlogPostingJsonLd } from '$lib/components/heads/seo.svelte';
	import { getSelectedLanguage } from '$lib/components/ui/navbar/utils';
	import { reveal } from '$lib/client/animations/reveal';
	import { onMount } from 'svelte';
	import Comments from './comments.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	function descriptionFromContent(content: string, max = 155): string {
		const clean = content
			.replace(/!\[.*?\]\(.*?\)/g, '')
			.replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
			.replace(/#{1,6}\s/g, '')
			.trim();
		return clean.length > max ? clean.slice(0, max).trimEnd() + 'â€¦' : clean;
	}

	const { data }: { data: PageData } = $props();
	const PostComponent = $derived(data.content);

	// The load never writes; the view is counted in /views (loads re-run on prefetch/invalidate).
	let sessionViews = $state<number | null>(null);
	const views = $derived(sessionViews ?? data.views);

	onMount(async () => {
		try {
			const response = await fetch(`/api/posts/${encodeURIComponent(data.metadata.slug)}/views`, {
				method: 'POST'
			});
			if (!response.ok) return;
			const payload = (await response.json()) as { views?: number };
			if (typeof payload.views === 'number') sessionViews = payload.views;
		} catch (error) {
			console.warn('[blog] não foi possível contar a visita:', error);
		}
	});
</script>

<Seo
	title={m.seo_blog_post_title({ title: data.metadata.title })}
	description={m.seo_blog_post_desc({
		description: data.metadata.description ? data.metadata.description : ''
	})}
	type="article"
	publishedTime={data.metadata.date}
	children={{
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		inLanguage: getSelectedLanguage().locale,
		headline: data.metadata.title,
		description: data.metadata.description ? data.metadata.description : '',
		datePublished: data.metadata.date.split('/').reverse().join('-'),
		author: { '@type': 'Person', name: m.about_name(), url: 'https://corrbrunno.dev.br/about' }
	}}
/>

<div class="mr-4 ml-4">
	<div
		use:reveal={{ direction: 'up', duration: 500 }}
		class="max-w-content-width mr-auto ml-auto w-full pt-15"
	>
		<Widget abbreviate={false} post={data.metadata} />

		{#if views !== null}
			<p class="text-muted-foreground mt-2 text-sm tabular-nums">
				{m.blog_views({ count: views })}
			</p>
		{/if}

		{#if data.tags?.length}
			<ul class="mt-3 flex flex-wrap gap-2">
				{#each data.tags as tag (tag.slug)}
					<li>
						<Button variant="secondary" size="sm" href={localizeHref(`/blog?tag=${tag.slug}`)}>
							{tag.name}
						</Button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

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

	<div use:reveal={{ direction: 'up', duration: 600, delay: 100 }}>
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

	<Comments slug={data.metadata.slug} comments={data.comments} dbReady={data.dbReady} />
</div>
