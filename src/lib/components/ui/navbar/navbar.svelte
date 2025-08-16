<script>
	import { Button } from '../button';
	import ModeToggle from './ModeToggle.svelte';

	const navButtons = [
		{ slug: 'Home', path: '/' },
		{ slug: 'Sobre', path: '/#sobre' }
	];
</script>


<header class="fixed flex z-1 w-full justify-center">
	<nav class="flex w-full content-center justify-between bg-transparent p-2 pr-10 pl-10">
		<section>
			{#each navButtons as button}
				<Button variant="ghost" href={button.path}>{button.slug}</Button>
			{/each}
		</section>
		<section>
			<ModeToggle></ModeToggle>
		</section>
	</nav>
</header>
