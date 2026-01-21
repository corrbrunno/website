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

<div class="w-full my-10 grid grid-cols-1 gap-y-20">
	<header class="mx-4">
    <h1 class="mx-auto max-w-130 text-center text-3xl font-bold">
		{@render heading()}
	</h1>
    </header>

	<section>
		<p class="pb-10 text-center text-lg font-bold">{keyPointsTitle}</p>
		<FeatureGrid items={keyPointsData} />
	</section>

	<div class="bg-primary/30 py-10">
		<p class="pb-5 text-center text-lg font-bold">Diferenciais</p>
		<FeatureGrid items={keyFeaturesData}></FeatureGrid>
	</div>

	<div class="text-center mx-4">
		<div class="mb-10">
			<h1 class="text-3xl font-bold">
				{@render pricingTitle()}
			</h1>
			<p class="text-muted-foreground pt-2">
				{pricingSubtitle}
			</p>
		</div>
		<ul class="flex items-center justify-start gap-4 overflow-x-scroll pb-2 md:justify-center">
			{#each pricingCardsData as pricingCardData}
				<li><PricingCard {...pricingCardData} /></li>
			{/each}
		</ul>
	</div>

	<div class="max-w-content-width mx-auto w-full items-center px-4">
		<Faq content={faqContentData} />
	</div>
</div>
