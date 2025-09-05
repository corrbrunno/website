<script lang="ts">
	import Widget from '$lib/components/posts/widget.svelte';

  export let data;
</script>

<section class="flex flex-col items-center content-center max-w-content-width w-full p-5 mt-20 mr-auto ml-auto">
  <div class="flex bg-card justify-between w-full p-4 rounded-2xl mb-10 items-baseline">
    <h1 class="text-3xl font-bold text-center ">Blog</h1>
    <span>Posts interessantes e aleatórios</span>
  </div>
  
  <ul class="grid grid-cols-1 md:grid-cols-2 w-full flex-wrap gap-3">
    {#each data.posts as post}
    <li class="flex  w-full
    hover:scale-102 line-clamp-2  transition ">
      <Widget class=" " {post}></Widget>
    </li>
    {/each}
  </ul>
</section>