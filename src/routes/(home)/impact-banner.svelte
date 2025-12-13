<section class="flex w-full overflow-x-clip flex-col items-center justify-center">
	<section
		id="impact"
		class="max-w-content-width relative flex flex-col items-center justify-between gap-2 p-4 before:hidden after:hidden md:flex-row md:before:block md:after:block"
	>
		<h1 class="select-none flex-0 relative pb-2 text-left text-2xl font-bold md:text-5xl">
			Soluções incontáveis, foco em <mark class="text-primary bg-transparent">resultados</mark>.
		</h1>
		<p class="w-full max-w-lg px-5 text-justify whitespace-pre-line">
			Sou Bruno e transformo desafios digitais em processos fluidos e inteligentes.
			 Movido pela inovação constante, uso este espaço para criar, apresentar e ensinar. Explore meus projetos ou mergulhe no blog para entender os bastidores dessa jornada.
		</p>
		<h1
			style="anchor-name: --slogan;"
			class="select-none flex-0 relative w-fit items-center py-4 text-center text-xl font-bold md:pt-0 md:text-right md:text-5xl"
		>
			Rápido, prático & <mark class="text-primary bg-transparent">inteligente</mark>
		</h1>
	</section>
</section>

<style>
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
			color-mix(in oklab, var(--primary) 70%, transparent ),
			transparent 60%
		);
		transform: translateX(85%);
        animation: pulse 10s infinite;
	}

    @keyframes pulse{
        0%{
            opacity: 1;
        }
        50%{
            opacity: 0.3;
        }
        100%{
            opacity: 1;
        }
    }
</style>
