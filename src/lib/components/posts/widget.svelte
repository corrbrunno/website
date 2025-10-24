<script lang="ts">
	import type { PostMetadata } from '$lib/types';
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';

	const {
		post,
		abbreviate = true,
		class: className
	}: { post: PostMetadata; class?: string; abbreviate?: boolean } = $props();

	const viewTransitionName = post.slug.replaceAll(' ', '');
</script>

<a href="/blog/{post.slug}" class={cn('min-w-full flex-1 z-1', className)}>
	<Card.Root
		id="test"
		style="view-transition-name: {viewTransitionName}-card;"
		class="min-w-full flex-1 z-1"
	>
		<Card.Header>
			<Card.Title>{post.title}</Card.Title>
			<Card.Description
				style="view-transition-name: {viewTransitionName}-description;"
				class={abbreviate ? 'overflow-hidden text-ellipsis whitespace-nowrap ' : ''}
				>{post.description}
			</Card.Description>
		</Card.Header>

		<Card.Footer style="view-transition-name: {viewTransitionName}-footer;">
			<p>{post.date}</p>
		</Card.Footer>
	</Card.Root>
</a>
