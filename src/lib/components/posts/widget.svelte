<script lang="ts">
	import type { PostMetadata } from "$lib/types";
	import { cn } from '$lib/utils';

    const {post, class:className} : {post : PostMetadata, class? : string} = $props();
</script>


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