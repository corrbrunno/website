<script lang="ts">
	import type { LocalizedString } from '@inlang/paraglide-js';
	import type { IconProps } from '@lucide/svelte';
	import type { Component } from 'svelte';

	export type featureItem = { header: () => LocalizedString; description: () => LocalizedString; icon?: Component<IconProps, {}, ''> };
	const { items }: { items: featureItem[] } = $props();
</script>

{#snippet featureBlock(item: featureItem)}
	<div class="flex gap-4">
		{#if item.icon}
			<item.icon class="my-auto aspect-square size-15 shrink-0" />
		{/if}
		<div>
			<h2 class="text-lg font-bold">{item.header()}</h2>
			<p class="text-justify">{item.description()}</p>
		</div>
	</div>
{/snippet}

<section class="max-w-content-width mx-auto grid w-full grid-cols-1 gap-10 px-4 md:grid-cols-2">
	{#each items as item}
		{@render featureBlock(item)}
	{/each}
</section>
