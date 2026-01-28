<script lang="ts">
	import type { PageData } from './$types';
	import TextCarousel from '$lib/components/ui/carrousel/text-carousel.svelte';
	import PricingCall from './pricing-call.svelte';
	import LatestBlogPosts from './latest-blog-posts.svelte';
	import ImpactBanner from './impact-banner.svelte';
	import * as m from '$lib/paraglide/messages';
	const { data }: { data: PageData } = $props();
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let hasScrolled = $derived(scrollY <= innerHeight / 5);
</script>

<svelte:window bind:innerHeight bind:scrollY />

<section
	class="from-background select-none to-secondary relative flex h-dvh content-center items-center justify-center bg-gradient-to-t pb-10"
>
	<div class="bg-grid-pattern absolute inset-0 size-full opacity-20"></div>
	<section
		class="max-w-9xl flex max-h-full flex-col flex-nowrap content-center items-center justify-center overflow-hidden bg-clip-text p-10 text-center text-clip text-transparent lg:flex-row lg:p-0"
	>
		<img class=" max-h-full min-h-0 min-w-0 flex-shrink" src="/bruno.svg" alt="test" />
		<h1
			class=" from-primary to-secondary/40 flex-shrink bg-gradient-to-b from-10% to-85% bg-clip-text text-8xl font-black text-transparent"
		>
			Bruno Corrêa
		</h1>
	</section>
</section>
<div
	class:opacity-0={!hasScrolled}
	class="bg-card fixed bottom-1 left-1/2 z-1 -translate-x-1/2 transform animate-bounce rounded-xl border-2 px-4 py-2 text-xl shadow-md transition-opacity duration-500"
>
	<aside>{m.home_scroll_hint()}</aside>
</div>
<section class="select-none bg-transparent backdrop-blur-3xl flex w-full justify-center p-2">
	<div class="max-w-content-width w-full text-center text-xl">
		<p>{m.home_future_slogan()}</p>
	</div>
</section>

<TextCarousel
	class="max-w-content-width m-auto mt-2"
	options={['Java', 'Javascript', 'C#', 'Python', 'Rust']}
/>

<ImpactBanner />

<PricingCall />

<LatestBlogPosts posts={data.posts} />
<style>
	.bg-grid-pattern {
		--line-color: color-mix(in lch, var(--foreground) 13%, transparent);
		background-image:
			linear-gradient(90deg, var(--line-color) 1px, #0000 1px), linear-gradient(var(--line-color) 1px, #0000 1px);
		background-size: 40px 40px;
	}
</style>
