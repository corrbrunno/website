<script lang="ts">
	import type { PostMetadata } from '$lib/types';
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';

	const {
		post,
		abbreviate = true,
		class: className
	}: { post: PostMetadata; class?: string; abbreviate?: boolean } = $props();
</script>

<a
	href="/blog/{post.slug}"
	style="view-transition-name: {post.slug.replaceAll(' ', '')};"
	class={cn('min-w-full flex-1', className)}
>
	<Card.Root class="min-w-full flex-1">
		<Card.Header>
			<Card.Title>{post.title}</Card.Title>
			<Card.Description class={abbreviate ? 'overflow-hidden text-ellipsis whitespace-nowrap ' : ''}
				>{post.description}</Card.Description
			>
		</Card.Header>

		<Card.Footer>
			<p>{post.date}</p>
		</Card.Footer>
	</Card.Root>
</a>
