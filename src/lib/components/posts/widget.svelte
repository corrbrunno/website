<script lang="ts">
	import type { PostMetadata } from "$lib/types";
	import { cn } from '$lib/utils';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Root } from "../ui/button";


    const {post, class:className} : {post : PostMetadata, class? : string} = $props();
</script>

<a href='./blog/{post.slug}' class="min-w-full flex-1">
<Card.Root class="min-w-full flex-1">
  <Card.Header >
    <Card.Title>{post.title}</Card.Title>
    <Card.Description class="whitespace-nowrap overflow-hidden text-ellipsis ">{post.description}</Card.Description>
  </Card.Header>

  <Card.Footer>
    <p>{post.date}</p>
  </Card.Footer>
</Card.Root>

</a>
<!-- <Card.Root>
<div class={cn("flex flex-col justify-evenly rounded-xl bg-card p-5", className)} >
<a href='./blog/{post.slug}'>
    <h1 class="text-4xl font-bold ">
       {post.title} 
    </h1>
    <date class="block mb-2">{post.date}</date>
    <p class="block break-words  whitespace-wrap truncate">
        {post.description}
    </p>
    </a>
</div>
</Card.Root> -->