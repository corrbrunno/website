<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '$lib/components/ui/footer/footer.svelte';
	import { onNavigate } from '$app/navigation';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import NavSidebar from '$lib/components/ui/navbar/nav-sidebar.svelte';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children }: { children: Snippet<[]> } = $props();
</script>

<ModeWatcher />

<Sidebar.Provider open={false}> 
	<NavSidebar/>
	<main class="relative flex flex-col  min-h-screen w-full">
		<Navbar/>
		{@render children()}
		<Footer/>
	</main>
</Sidebar.Provider>


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

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
