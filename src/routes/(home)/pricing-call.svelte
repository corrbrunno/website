<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	const BASE_TOP_VALUE = 10;
	const TOP_MARGIN = 20;
	const BASE_CARD_TITLE_HEIGHT = 14;

	const cardMarkers: Record<number, HTMLElement | null> = {};
	const cardElements: Record<number, HTMLElement | null> = {};

	const pricingOptions = [
		{
			title: 'Automação',
			phrase: 'Deixe o trabalho repetitivo para as máquinas.',
			description:
				'Dês de sua empresa, até sua rotina pessoal, é possível agilizar inumeras tarefas. Foque no que realmente importa, enquanto tudo está no piloto-automático!',
			href: '/pricing/automations'
		},
		{
			title: 'Conhecimento',
			phrase: 'Ganhe autonomia de criar exatamente o que precisa.',
			description:
				'Aulas de programação em divérsas modalidades, do básico ao avançado, entenda cada etapa do processo, para desenvolver projetos de exelência.',
			href: '/pricing/classes'
		},
		{
			title: 'Website | Sistemas',
			phrase: 'Sua vitrine digital, feita sob medida.',
			description:
				'Crie uma presença online profissional e otimizada. Websites, e-commerces e sistemas internos com design exclusivo e funcionalidades pensadas para o crescimento e a gestão eficiente do seu negócio.',
			href: '/pricing/websites'
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
				<p class="p-3 italic">{phrase}</p>
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
		O que vamos construir juntos?
	</h1>

	<section class="relative z-3 mt-7 flex flex-col gap-7 md:flex-row">
		{#each pricingOptions as option, i}
			{@render pricingCall(
				i + 1, 
				option.title,
				option.phrase,
				option.description,
				option.href
			)}
		{/each}
	</section>
	<div
		class="to-background absolute bottom-0 z-2 h-100 w-full bg-gradient-to-b from-transparent/100 to-20%"
	></div>
</section>
