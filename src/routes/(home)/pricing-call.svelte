<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages';

	const BASE_TOP_VALUE = 10;
	const TOP_MARGIN = 20;
	const BASE_CARD_TITLE_HEIGHT = 14;

	const cardMarkers: Record<number, HTMLElement | null> = {};
	const cardElements: Record<number, HTMLElement | null> = {};

	const pricingOptions = [
		{
			id: 1,
			title: m.home_pricing_card_automation_title,
			phrase: m.home_pricing_card_automation_phrase,
			description: m.home_pricing_card_automation_description,
			href: '/pricing/automations'
		},
		{
			id: 2,
			title: m.home_pricing_card_classes_title,
			phrase: m.home_pricing_card_classes_phrase,
			description: m.home_pricing_card_classes_description,
			href: 'pricing/classes'
		},
		{
			id: 3,
			title: m.home_pricing_card_websites_title,
			phrase: m.home_pricing_card_websites_phrase,
			description: m.home_pricing_card_websites_description,
			href: 'pricing/websites'
		}
	];

	function scrollToOriginalPosition(cardIdx: number) {
		const markerElm = cardMarkers[cardIdx]!;
		const cardElm = cardElements[cardIdx]!;

		const y =
			markerElm.getBoundingClientRect().top -
			cardElm.getBoundingClientRect().height / 2 +
			window.scrollY;

		window.scrollTo({
			top: y,
			behavior: 'smooth'
		});
	}
</script>

{#snippet pricingCall(
	cardOrder: number,
	title: string,
	phrase: string,
	description: string,
	href: string
)}
	{@const topDistance = String(BASE_TOP_VALUE + TOP_MARGIN + BASE_CARD_TITLE_HEIGHT * cardOrder)}

	<div bind:this={cardMarkers[cardOrder]}></div>
	<div
		bind:this={cardElements[cardOrder]}
		style="top: calc(var(--spacing) * {topDistance});"
		class="sticky h-fit max-w-xs md:static"
	>
		<Card.Root onclick={() => scrollToOriginalPosition(cardOrder)}>
			<Card.Title class="text-center text-xl font-bold">{title}</Card.Title>
			<Card.Content class="text-justify">
				<p class="p-3 text-pretty italic">{phrase}</p>
				{description}
			</Card.Content>
			<Card.Footer>
				<Button {href} class="w-full">Saiba mais</Button>
			</Card.Footer>
		</Card.Root>
	</div>
{/snippet}

<section class="relative flex flex-col items-center bg-transparent p-4">
	<h1
		style="top: calc(var(--spacing) * {BASE_TOP_VALUE});"
		class="sticky bottom-7 z-1 text-3xl font-bold md:static"
	>
		{m.home_pricing_section_title()}
	</h1>

	<section class="relative z-3 mt-7 flex flex-col gap-7 md:flex-row">
		{#each pricingOptions as option, i}
			{@render pricingCall(
				i + 1,
				option.title(),
				option.phrase(),
				option.description(),
				option.href
			)}
		{/each}
	</section>
	<div
		class="to-background absolute bottom-0 z-2 h-100 w-full bg-gradient-to-b from-transparent/100 to-20%"
	></div>
</section>
