<script>
	import { Github, Linkedin, Instagram } from '@lucide/svelte';
	const links = [
		{ name: 'Github', alias: '@corrbrunno', link: 'https://github.com/corrbrunno', Icon: Github },
		{
			name: 'Linkedin',
			alias: '@corr-brunno',
			link: 'https://www.linkedin.com/in/corr-brunno/',
			Icon: Linkedin
		},
		{
			name: 'Instagram',
			alias: '@brunno.corr',
			link: 'https://www.instagram.com/brunno.corr/',
			Icon: Instagram
		}
	];
</script>

<footer
	style="view-transition-name: footer;"
	class="bg-card mt-auto flex w-full justify-center text-sm"
>
	<div
		class="max-w-content-width grid-flow flex w-full grid-cols-3 grid-rows-1 flex-col flex-wrap items-center justify-between gap-3 p-5 pr-10 pl-10 sm:flex-row"
	>
		<section>Bruno Corrêa</section>
		<section class="text-center">
			<p id="phrase">Made by me with 💜 - no AI</p>
		</section>
		<section class="relative">
			<h1 class="text-lg">I quite like programming!</h1>
			<br />
			{#each links as { name, alias, link, Icon }}
				<a class="flex w-full justify-between" href={link}>
					<div class="flex items-center gap-2">
						<Icon class="text-secondary hover:text-primary" />
						<p class="">{name}:</p>
					</div>
					<p class="text-muted hover:text-primary">{alias}</p>
				</a>
			{/each}
		</section>
	</div>
</footer>

<style lang="postcss">
	/* Insipired by: https://ysfkaya.com/shine-text-effect-in-css-and-tailwind-css */
	@keyframes shine {
		0% {
			background-position: 200% 0%;
		}

		100% {
			background-position: -200% 0%;
		}
	}

	#phrase {
		transition: font-size 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	#phrase:hover {
		color: transparent;
		background:
			radial-gradient(circle at center, rgba(255, 255, 255, 0.85), var(--primary)) -200% 50% / 200%
				100% no-repeat,
			var(--primary);
		background-clip: text;
		font-size: var(--text-2xl);
		font-weight: bold;
		animation: shine 3.5s cubic-bezier(0.895, 0.03, 0.685, 0.22) infinite;
	}
</style>
