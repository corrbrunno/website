<script lang="ts">
		import type { PageData } from './$types';
	import TextCarousel from '$lib/components/ui/carrousel/text-carousel.svelte';
	import PricingCall from './pricing-call.svelte';
	import LatestBlogPosts from './latest-blog-posts.svelte';
	import ImpactBanner from './impact-banner.svelte';
	import * as m from '$lib/paraglide/messages';
	import Bruno from './bruno.svelte';
	import Seo from '$lib/components/heads/seo.svelte';
	import { onMount } from 'svelte';
	import { reveal, seq } from '$lib/client/animations/reveal';

	const { data }: { data: PageData } = $props();
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let hasScrolled = $derived(scrollY <= innerHeight / 5);
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
	const [sloganReveal, carouselReveal, impactReveal, pricingReveal, blogReveal] = seq(5, {
		direction: 'up',
		duration: 700,
		gap: 100,
	});

</script>

<Seo title={m.seo_home_title()} description={m.seo_home_desc()} />

<svelte:window bind:innerHeight bind:scrollY />
<section
	class="from-background to-secondary relative flex h-dvh content-center items-center justify-center bg-gradient-to-t pb-10 select-none"
>
	<div class="bg-grid-pattern absolute inset-0 size-full opacity-20"></div>
	<section
		class="w-full flex h-full flex-col flex-nowrap items-center justify-center overflow-hidden bg-clip-text p-10 text-center text-clip text-transparent md:flex-row md:p-0"
	>
		<div class="md:max-h-fit h-full max-w-fit w-full hero-svg" class:hero-animate={ready}>
			<Bruno />
		</div>
		<h1
			class="flex-none from-primary to-secondary/40 md:w-50/100 bg-gradient-to-b from-10% to-85% bg-clip-text text-8xl font-black text-transparent hero-title" class:hero-animate={ready}
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
<section
	use:reveal={sloganReveal}
	class="flex w-full justify-center bg-transparent p-2 backdrop-blur-3xl select-none"
>
	<div class="max-w-content-width w-full text-center text-xl text-balance">
		<p>{m.home_future_slogan()}</p>
	</div>
</section>
<div class="flex flex-col gap-15">
	<div use:reveal={carouselReveal}>
		<TextCarousel
			class="max-w-content-width m-auto mt-2"
			options={['Java', 'Javascript', 'C#', 'Python', 'Rust']}
		/>
	</div>

	<div use:reveal={impactReveal}>
		<ImpactBanner />
	</div>

	<div use:reveal={pricingReveal}>
		<PricingCall />
	</div>

	<div use:reveal={blogReveal}>
		<LatestBlogPosts posts={data.posts} />
	</div>
</div>

<style>
	.bg-grid-pattern {
		--line-color: color-mix(in lch, var(--foreground) 13%, transparent);
		background-image:
			linear-gradient(90deg, var(--line-color) 1px, #0000 1px),
			linear-gradient(var(--line-color) 1px, #0000 1px);
		background-size: 40px 40px;
	}

	@keyframes scale-up {
		from {
			transform: scale(0.96);
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(12px);
		}
	}

	.hero-svg {
		animation: scale-up 1000ms cubic-bezier(0.4, 0, 0.2, 1) both;
		animation-play-state: paused;
	}

	.hero-title {
		animation: slide-up 1000ms cubic-bezier(0.4, 0, 0.2, 1) both;
		animation-play-state: paused;
	}

	.hero-svg.hero-animate,
	.hero-title.hero-animate {
		animation-play-state: running;
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-svg,
		.hero-title {
			animation: none !important;
		}
	}
</style>
