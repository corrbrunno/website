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

<h1 class="mx-auto max-w-130 pt-10 text-center text-3xl font-bold">
	{@render heading()}
</h1>

<div class="px-5 pt-10">
	<p class="p-5 text-center text-lg font-bold">{keyPointsTitle}</p>
	<FeatureGrid items={keyPointsData} />
</div>

<div class="bg-primary/30 mt-10 p-7 px-5">
	<p class="pb-5 text-center text-lg font-bold">Diferenciais</p>
	<FeatureGrid items={keyFeaturesData}></FeatureGrid>
</div>

<div class="px-4 text-center">
	<div class="mb-10">
		<h1 class="pt-10 text-3xl font-bold">
			{@render pricingTitle()}
		</h1>
		<p class="text-muted-foreground pt-2">
			{pricingSubtitle}
		</p>
	</div>
	<section class="flex items-center justify-start gap-4 overflow-x-scroll pb-2 md:justify-center">
		{#each pricingCardsData as pricingCardData}
			<PricingCard {...pricingCardData} />
		{/each}
	</section>
</div>

<div class="max-w-content-width mx-auto my-10 w-full items-center px-4">
	<Faq
		content={faqContentData}
	></Faq>
</div>
