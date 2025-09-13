<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '$lib/components/ui/footer/Footer.svelte';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children, ...others }: { children: Snippet<[]>; others: any[] } = $props();
</script>

<ModeWatcher />
<main class="flex min-h-screen flex-col" {...others}>
	<Navbar></Navbar>
	{@render children()}
	<Footer></Footer>
</main>

<style lang="postcss">

	:global(::-webkit-scrollbar) {
		width: 10px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--color-background);
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--card);
		border-radius: 5px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--secondary);
	}

	::selection {
		color: var(--primary);
		background: var(--secondary);
	}
</style>
