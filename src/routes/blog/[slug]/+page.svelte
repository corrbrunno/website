<script lang="ts">
	import Widget from '$lib/components/posts/widget.svelte';
	import * as Card from '$lib/components/ui/card';
	export let data;
	const Post = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title} | BCBlog</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>
<section class="max-w-content-width mr-auto ml-auto w-full pt-20">
	<Widget abbreviate={false} post={data.metadata} />
</section>

<Card.Root class="max-w-block-width mt-10 mr-auto mb-10 ml-auto w-full p-5">
	<Card.Content>
		<article
			class="prose prose-purple dark:prose-invert lg:prose-lg text-foreground max-w-none justify-center"
		>
			<Post />
		</article>
	</Card.Content>
</Card.Root>
