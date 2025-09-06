<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
 	import { ModeWatcher } from "mode-watcher";
	import Footer from '$lib/components/ui/footer/Footer.svelte';

	let { children, ...others } : {children : Snippet<[]>, others : any[]}= $props();
</script>

<ModeWatcher />
<main class="flex flex-col min-h-screen" {...others}>
	<Navbar></Navbar>
	{@render children()}
	<Footer></Footer>
</main>