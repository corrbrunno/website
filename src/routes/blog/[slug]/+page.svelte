<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	export let data;
	const Post = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title} | BCBlog</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>

<Card.Root class="max-w-block-width mt-20 mr-auto ml-auto w-full p-5">
	<Card.Header>
		<Card.Title class="p-2 text-center">
			{data.metadata.title}
		</Card.Title>

		<Card.Description>
			{data.metadata.description}
		</Card.Description>
	</Card.Header>
	<Card.Footer>
		<p>Escrito em: {data.metadata.date}</p>
	</Card.Footer>
</Card.Root>

<Card.Root class="max-w-block-width mt-10 mr-auto ml-auto w-full p-5">
	<Card.Content>
		<article
			class="prose prose-purple dark:prose-invert lg:prose-lg text-foreground max-w-none justify-center"
		>
			<Post />
		</article>
	</Card.Content>
</Card.Root>
