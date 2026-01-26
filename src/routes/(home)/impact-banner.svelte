<script>
	import Sparkle from '$lib/components/decorations/sparkle.svelte';
</script>

<section class="flex w-full flex-col items-center justify-center overflow-x-clip">
	<section
		id="impact"
		class="max-w-content-width relative flex flex-col items-center justify-between gap-2 p-4 before:hidden after:hidden md:flex-row md:before:block md:after:block"
	>
		<h1 class="relative flex-0 pb-2 text-left text-2xl font-bold select-none md:text-5xl">
			Soluções incontáveis, foco em <mark class="text-primary bg-transparent">resultados</mark>.
		</h1>
		<p class="w-full max-w-lg px-5 text-justify whitespace-pre-line">
			Sou Bruno e transformo desafios digitais em processos fluidos e inteligentes. Movido pela
			inovação constante, uso este espaço para criar, apresentar e ensinar. Explore meus projetos ou
			mergulhe no blog para entender os bastidores dessa jornada.
		</p>
		<h1
			style="anchor-name: --slogan;"
			class="relative items-center py-4 text-center text-xl font-bold select-none md:pt-0 md:text-right md:text-5xl"
		>
			<Sparkle
				class="md:invisible absolute top-1/2 left-0 aspect-square h-12 -translate-x-120/100 -translate-y-1/2 animate-[pulse_5s_ease-in-out_infinite]"
			/>
			<Sparkle
				class="md:invisible absolute top-1/2 right-0 aspect-square h-12 translate-x-110/100 -translate-y-80/100 animate-[pulse_5s_ease-in-out_infinite_1s]"
			/>
	
			<Sparkle
				class="md:invisible absolute top-1/2 right-0 aspect-square size-6 translate-x-100/100  translate-y-80/100 animate-[pulse_5s_ease-in-out_infinite_0.4s]"
			/>
			Rápido, prático & <mark class="text-primary bg-transparent">inteligente</mark>
		</h1>
	</section>
</section>

<style>
	
	@keyframes floating-animation {
		0%,
		100% {
			transform: translateY(0px) scale(1);
		}
		50% {
			transform: translateY(-8px) scale(1.02);
		}
	}

	#impact::after {
		content: '';
		z-index: -1;
		position: absolute;
		left: 0;
		width: 60vw;
		height: 60vh;
		border-radius: 50%;
		background-image: radial-gradient(
			color-mix(in oklab, var(--primary) 70%, transparent),
			transparent 60%
		);
		transform: translateX(-85%);
		animation: pulse 10s infinite;
	}

	#impact::before {
		content: '';
		z-index: -1;
		position: absolute;
		right: 0;
		width: 60vw;
		height: 60vh;
		border-radius: 50%;
		background-image: radial-gradient(
			color-mix(in oklab, var(--primary) 70%, transparent),
			transparent 60%
		);
		transform: translateX(85%);
		animation: pulse 10s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
		100% {
			opacity: 1;
		}
	}
</style>
