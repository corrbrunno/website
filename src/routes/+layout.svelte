<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
 	import { ModeWatcher } from "mode-watcher";

	let { children, ...others } : {children : Snippet<[]>, others : any[]}= $props();
</script>

<ModeWatcher />
<main class="flex flex-col min-h-screen" {...others}>
	<Navbar></Navbar>
	{@render children()}
	<span>test</span>
</main>