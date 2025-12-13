<script lang="ts">
	import Widget from '$lib/components/posts/post-widget.svelte';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<section
	class="max-w-content-width mt-10 mr-auto ml-auto flex w-full flex-col content-center items-center p-5"
>
	<Card.Root
		class="mb-10 w-full flex-row justify-between pr-5 pl-5"
	>
		<Card.Header class="p-0">
			<h1>Blog</h1>
		</Card.Header>
		<Card.Description>
			<p>Random and interesting posts</p>
		</Card.Description>
	</Card.Root>

	<ul class="grid w-full grid-cols-1 flex-wrap gap-3 md:grid-cols-2">
		{#each data.posts as post}
			<li
				class="line-clamp-2 flex
    w-full transition hover:scale-102"
			>
				<Widget class="w-10" {post}></Widget>
			</li>
		{/each}
	</ul>
</section>
