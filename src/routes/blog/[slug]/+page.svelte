<script lang="ts">
	export let data;
	const Post = data.content;

</script>

<svelte:head>
  <title>{data.metadata.title} | BCBlog</title>
  <meta name="description" content={data.metadata.description} />
</svelte:head>

<section id="sobre" class="bg-card w-full max-w-block-width relative ml-auto  mr-auto p-10 flex-1 shadow-card shadow-md">
	<h1 class=" text-5xl font-bold mb-4">{data.metadata.title}</h1>
    <span>{"Última edição em: " + data.metadata.date}</span>
	<article class=" prose prose-purple dark:prose-invert lg:prose-lg text-foreground max-w-none justify-center">
    <div class="w-full h-1 bg-foreground mb-4 mt-4"></div>
		<Post/>
	</article>
</section>
 