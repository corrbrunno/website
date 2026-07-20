<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { featureItem } from './feature-grid.svelte';
	import FeatureGrid from './feature-grid.svelte';
	import PricingCard, { type pricingCardData } from './pricing-card.svelte';
	import Faq, { type faqData } from './faq.svelte';
	import { reveal } from '$lib/client/animations/reveal';
	const {
		heading,
		keyPointsTitle,
		keyPointsData,
		keyFeaturesData,
		pricingTitle,
		pricingSubtitle,
		pricingCardsData,
		faqContentData
	}: {
		heading: Snippet;
		keyPointsTitle: string;
		keyPointsData: featureItem[];
		keyFeaturesData: featureItem[];
		pricingTitle: Snippet;
		pricingSubtitle: string;
		pricingCardsData: pricingCardData[];
		faqContentData: faqData;
	} = $props();
</script>

<div class="my-10 grid w-full grid-cols-1 gap-y-20">
	<header use:reveal={{ direction: 'up', duration: 600 }} class="mx-4 text-balance">
		<h1 class="mx-auto max-w-full  md:p-20 py-20 text-3xl md:text-6xl text-left font-bold sm:text-center sm:text-3xl">
			{@render heading()}
		</h1>
	</header>

	<section use:reveal={{ direction: 'up', duration: 600, delay: 100 }}>
		<h3 class="pb-10 text-center text-lg font-bold">{keyPointsTitle}</h3>
		<FeatureGrid items={keyPointsData} />
	</section>

	<section use:reveal={{ direction: 'up', duration: 600, delay: 150 }} class="bg-primary/30 text-primary-foreground py-14">
		<h3 class="pb-5 text-center text-lg font-bold">Diferenciais</h3>
		<FeatureGrid items={keyFeaturesData}></FeatureGrid>
	</section>

	<section use:reveal={{ direction: 'up', duration: 600, delay: 200 }} class="mx-4 text-center">
		<div class="mb-10">
			<h1 class="text-3xl font-bold text-balance">
				{@render pricingTitle()}
			</h1>
			<p class="text-muted-foreground m-auto pt-2 text-pretty">
				{pricingSubtitle}
			</p>
		</div>
		<ul class="flex justify-start gap-4 overflow-x-scroll overflow-y-hidden pb-2 md:justify-center">
			{#each pricingCardsData as pricingCardData, i}
				<li use:reveal={{ direction: 'up', duration: 500, stagger: i * 100 }}>
					<PricingCard {...pricingCardData} />
				</li>
			{/each}
		</ul>
	</section>

	<section use:reveal={{ direction: 'up', duration: 600, delay: 250 }} class="max-w-content-width mx-auto w-full items-center px-4">
		<Faq content={faqContentData} />
	</section>
</div>
