<script lang="ts">
	import type { PostMetadata } from "$lib/types";
	import Widget from '$lib/components/posts/post-widget.svelte';
	import * as m from '$lib/paraglide/messages';

    const {posts} : {posts : PostMetadata[]}= $props()
</script>

<section class="mt-10 bg-accent mb-10 flex w-full flex-col items-center p-10">
	<div class="mb-5 flex flex-col items-center justify-center">
		<h1 class=" text- text-2xl font-bold">{m.home_blog_title()}</h1>
		<p class="text-muted-foreground">{m.home_blog_subtitle()}</p>
	</div>
	<ul class="max-w-content-width grid w-full grid-cols-1 flex-wrap gap-3 md:grid-cols-2">
		{#each posts as post}
			<li
				class="line-clamp-2 flex
    w-full transition hover:scale-102"
			>
				<Widget class="w-10" {post}></Widget>
			</li>
		{/each}
	</ul>
</section>
