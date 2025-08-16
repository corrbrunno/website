<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Navbar></Navbar>
<main
	class="max-w-content-width  bg-background m-auto flex min-h-screen min-w-0 flex-col flex-wrap p-5"
>

	{@render children()}
</main>