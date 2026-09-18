<script lang="ts">
	import Seo, { type BlogJsonLd } from '$lib/components/heads/seo.svelte';
	import { getSelectedLanguage } from '$lib/components/ui/navbar/utils';
	import Widget from '$lib/components/posts/post-widget.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import TagCombobox from './tag-combobox.svelte';
	import * as m from '$lib/paraglide/messages';
	import { reveal } from '$lib/client/animations/reveal';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<Seo
	title={m.seo_blog_title()}
	description={m.seo_blog_desc()}
	type="website"
	children={{
		'@context': 'https://schema.org',
		'@type': 'Blog',
		inLanguage: getSelectedLanguage().locale,
		name: m.seo_sitename(),
		url: 'https://corrbrunno.dev.br/blog',
		blogPost: data.posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: `https://corrbrunno.dev.br/blog/${encodeURIComponent(post.slug)}`,
			datePublished: post.date.split('/').reverse().join('-')
		}))
	}}
/>

<section
	class="max-w-content-width mt-10 mr-auto ml-auto flex w-full flex-col content-center items-center p-5"
>
	<Card.Root class="mb-10 w-full">
		<Card.Header class="flex justify-between">
			<Card.Title class="text-3xl">Blog</Card.Title>

			<Card.Description class="text-right text-lg text-balance">
				{m.blog_description()}
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<div class="mb-8 flex w-full flex-wrap items-center gap-2">
		<form method="GET" class="max-w-content-width flex w-full flex-wrap items-center gap-2">
			<Input
				name="q"
				value={data.filters.q ?? ''}
				placeholder={m.blog_search_placeholder()}
				aria-label={m.blog_search_placeholder()}
				class="max-w-full flex-1"
			/>
			{#each data.filters.tags as tag (tag)}
				<input type="hidden" name="tag" value={tag} />
			{/each}
			<div class="flex w-full flex-wrap justify-between gap-2 sm:w-fit sm:justify-normal">
				<div class="flex gap-2">
					<Button type="submit" variant="secondary">{m.blog_search_action()}</Button>
					{#if data.filters.q || data.filters.tags.length > 0}
						<Button variant="outline" href="/blog">{m.blog_filter_clear()}</Button>
					{/if}
				</div>
				{#if data.tagCloud.length > 0}
					<TagCombobox tags={data.tagCloud} selected={data.filters.tags} query={data.filters.q} />
				{/if}
			</div>
		</form>
	</div>

	<ul class="grid w-full grid-cols-1 flex-wrap gap-3 md:grid-cols-2">
		{#each data.posts as post, i (post.slug)}
			<li
				class="line-clamp-2 flex w-full transition hover:scale-102"
				use:reveal={{ direction: 'up', duration: 500, stagger: i * 80 }}
			>
				<Widget class="w-10" {post}></Widget>
			</li>
		{:else}
			<li
				class="text-muted-foreground col-span-full w-full rounded-xl border border-dashed p-6 text-center"
			>
				{m.blog_no_results()}
			</li>
		{/each}
	</ul>
</section>
