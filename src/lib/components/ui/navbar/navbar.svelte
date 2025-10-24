<script lang="ts">
	import { Button } from '../button';
	import ThemeToggle from './navbar-theme-toggle.svelte';
	import { NAVEGATION_BUTTONS } from './constants.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

</script>



<header style="view-transition-name: navbar" class="print:hidden fixed top-0 z-1 flex w-full justify-center">
	<nav class="w-full">
		<section class="flex w-full content-center  justify-between p-2 pr-10 pl-10">
			<section class="flex *:first:block *:hidden sm:*:block" >
				{#each NAVEGATION_BUTTONS as { url, slug }}
					<Button variant="ghost" href={url}>{slug}</Button>
				{/each}
			</section>
			<section>
				<ThemeToggle></ThemeToggle>
				<Sidebar.Trigger class="sm:hidden"/>
			</section>
		</section>
	</nav>
</header>
