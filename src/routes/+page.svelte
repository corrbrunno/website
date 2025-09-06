<script lang="ts">
	import type { PageData } from './$types';
	import TextCarousel from '$lib/components/ui/carrousel/TextCarousel.svelte';
	import * as Card from '$lib/components/ui/card';
	const { data }: { data: PageData } = $props();
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let hasScrolled = $derived(scrollY <= innerHeight / 5);
</script>

<svelte:window bind:innerHeight bind:scrollY />

<section
	class="from-secondary to-background flex h-screen content-center items-center justify-center bg-gradient-to-t pr-5 pl-5"
>
	<section
		class="max-w-9xl flex max-h-full flex-col flex-nowrap content-center items-center justify-center overflow-hidden bg-clip-text p-10 text-center text-clip text-transparent lg:flex-row lg:p-0"
	>
		<img class="max-h-full min-h-0 min-w-0 flex-shrink" src="/bruno.svg" alt="test" />
		<h1
			class=" from-primary to-secondary/40 flex-shrink bg-gradient-to-b from-10% to-85% bg-clip-text text-8xl font-black text-transparent"
		>
			Bruno Corrêa
		</h1>
	</section>
</section>
<div class="bg-secondary h-10 w-full"></div>
<div
	class:opacity-0={!hasScrolled}
	class="bg-card fixed bottom-1 left-1/2 z-1 -translate-x-1/2 transform animate-bounce rounded-xl border-2 px-4 py-2 text-xl shadow-md transition-opacity duration-500"
>
	<h1>Mais abaixo ↓</h1>
</div>
<section class="bg-card flex w-full justify-center border-b p-2">
	<div class="max-w-content-width w-full text-center text-xl">
		<p>Os destaques do futuro são os melhores do agora</p>
	</div>
</section>

<section id="about">
	<TextCarousel class="mt-3 mb-3" options={['Java', 'Javascript', 'C#', 'Python', 'Rust']} />
</section>

{#snippet section(title: string, content: string)}
	<Card.Root class=" max-w-content-width m-auto mb-10 ">
		<Card.Header>
			<h1 class=" text-muted text-center text-xl">
				{title}
			</h1>
		</Card.Header>
		<Card.Content class="text-justify">
			{@html content.replaceAll(/\n/g, '<br/>')}
		</Card.Content>
	</Card.Root>
{/snippet}

{@render section(
	'Sobre',
	`Programador com sólida experiência, iniciado de forma autodidata e com histórico no desenvolvimento de projetos próprios, do conceito à entrega. Ao longo da trajetória, expandi competências por meio de colaboração com outros profissionais, aprimorando minha capacidade técnica e adaptabilidade.

Atualmente, curso Engenharia de Software com foco em aprofundar fundamentos avançados de programação, arquitetura de sistemas e boas práticas de engenharia, aliando sólida base teórica a experiência prática. Domino múltiplas linguagens (incluindo C++, Python, Go e JavaScript) e possuo forte domínio de algoritmos, estruturas de dados, computação distribuída e design de sistemas.

Capaz de transformar requisitos complexos em soluções eficientes e escaláveis, aplicando princípios de engenharia de software de ponta, práticas de code review, continuous integration e test-driven development. Experiência em otimização de desempenho, segurança de aplicações e integração com serviços em nuvem (Google Cloud, AWS, Azure). Comprometido com aprendizado contínuo, inovação e excelência técnica, acompanhando as inovações do setor para entregar soluções robustas e alinhadas às demandas modernas.
`
)}
