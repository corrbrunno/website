<script lang="ts">
	import type { PostMetadata } from '$lib/types';
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as m from '$lib/paraglide/messages';

	const {
		post,
		abbreviate = true,
		class: className
	}: { post: PostMetadata; class?: string; abbreviate?: boolean } = $props();

	const viewTransitionName = $derived(post.slug.replaceAll(' ', ''));
</script>

<a href="/blog/{post.slug}" class={cn('min-w-full flex-1', className)}>
	<Card.Root
		id="test"
		style="view-transition-name: {viewTransitionName}-card;"
		class="z-1 min-w-full flex-1"
	>
		<Card.Header>
			<Card.Title>{post.title}</Card.Title>
			<Card.Description
				style="view-transition-name: {viewTransitionName}-description;"
				class={abbreviate ? 'overflow-hidden text-ellipsis whitespace-nowrap ' : ''}
				>{post.description}
			</Card.Description>

			{#if post.tags?.length}
				<div class="flex flex-wrap gap-1.5 pt-1">
					{#each post.tags as tag (tag)}
						<span class="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</Card.Header>

		<Card.Footer style="view-transition-name: {viewTransitionName}-footer;">
			<div class="text-muted-foreground flex items-center gap-3 text-sm">
				<p>{post.date}</p>
				{#if typeof post.views === 'number'}
					<span class="tabular-nums">{m.blog_views({ count: post.views })}</span>
				{/if}
				{#if typeof post.comments === 'number' && post.comments > 0}
					<span class="tabular-nums">{m.blog_comments_count({ count: post.comments })}</span>
				{/if}
			</div>
		</Card.Footer>
	</Card.Root>
</a>
