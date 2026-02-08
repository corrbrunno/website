<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { featureItem } from './feature-grid.svelte';
	import FeatureGrid from './feature-grid.svelte';
	import PricingCard, { type pricingCardData } from './pricing-card.svelte';
	import Faq, { type faqData } from './faq.svelte';
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
	<header class="mx-4 text-balance">
		<h1 class="mx-auto max-w-130 text-left sm:text-center text-3xl font-bold">
			{@render heading()}
		</h1>
	</header>

	<section>
		<h3 class="pb-10 text-center text-lg font-bold">{keyPointsTitle}</h3>
		<FeatureGrid items={keyPointsData} />
	</section>

	<section class="bg-primary/30 py-14">
		<h3 class="pb-5 text-center text-lg font-bold">Diferenciais</h3>
		<FeatureGrid items={keyFeaturesData}></FeatureGrid>
	</section>

	<section class="mx-4 text-center">
		<div class="mb-10">
			<h1 class="text-3xl text-balance font-bold">
				{@render pricingTitle()}
			</h1>
			<p class="text-muted-foreground text-pretty pt-2">
				{pricingSubtitle}
			</p>
		</div>
		<ul class="flex justify-start md:justify-center gap-4 pb-2 overflow-x-scroll">
			{#each pricingCardsData as pricingCardData}
				<li class="mt-auto"><PricingCard {...pricingCardData} /></li>
			{/each}
		</ul>
	</section>

	<section class="max-w-content-width mx-auto w-full items-center px-4">
		<Faq content={faqContentData} />
	</section>
</div>
