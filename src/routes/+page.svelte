<script lang="ts">
	let scrollY = $state(0);
    let innerHeight = $state(0);
	let hasScrolled = $derived(scrollY <= (innerHeight / 4));
</script>

<svelte:window bind:innerHeight bind:scrollY/>


<section
	class="flex min-h-screen min-w-0 w-full flex-wrap content-center items-center justify-center md:flex-nowrap"
>
	<img class="max-h-[400px] lg:max-h-[800px] min-w-none md:max-w-none" src="/bruno.svg" alt="test" />
	<h1 class="text-5xl font-black text-white  lg:text-8xl">Bruno Corrêa</h1>
</section>

<div
	class:opacity-0={!hasScrolled}
	class="fixed bottom-1  left-1/2 -translate-x-1/2 transform animate-bounce rounded-xl border-2 border-white bg-white px-4 py-2 text-xl text-black shadow-md transition-opacity duration-500"
>
	<h1>Mais abaixo ↓</h1>
</div>

