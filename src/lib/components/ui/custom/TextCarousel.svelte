<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	const {
		class: classNames,
		options,
		itemWidth = 100,
		itemsGap = 10,
		...other
	}: {
		class?: string;
		itemWidth?: number;
		itemsGap?: number;
		options: string[];
		other?: HTMLInputAttributes;
	} = $props();

	const itemTotalWidth = itemWidth + itemsGap;
	
	let innerWidth = $state(0);
	let itemsPerLoop = $derived(Math.ceil(innerWidth / itemTotalWidth));

	let repeatedTexts = $derived(
		Array.from({ length: itemsPerLoop }, (_, i) => options[i % options.length])
	);
</script>

<svelte:body bind:clientWidth={innerWidth} />

<section
	class={cn(classNames, 'carousel')}
	style:--gap={`${itemsGap}px`}
	style:--item-width={`${itemWidth}px`}
	{...other}
>
	<ul>
		{#each repeatedTexts as text}
			<li>{text}</li>
		{/each}
	</ul>
	<ul aria-hidden="true">
		{#each repeatedTexts as text}
			<li>{text}</li>
		{/each}
	</ul>
</section>

<style>
	.carousel {
		display: flex;
		gap: var(--gap);
		overflow: hidden;
		padding-block: 0.5rem;
		width: 100%;
		user-select: none;
	}

	.carousel ul {
		list-style: none;
		display: flex;
		flex-shrink: 0;
		gap: var(--gap);
		min-width: 100%;
		animation: scroll 20s linear infinite;
	}

	.carousel:hover ul {
		animation-play-state: paused;
	}

	.carousel li {
		flex: 0 0 var(--item-width);
		text-align: center;
		font-size: clamp(1rem, 2vw, 1.5rem);
		font-weight: 600;

		white-space: nowrap;
	}

	@keyframes scroll {
		to {
			transform: translateX(calc(-100% - var(--gap)));
		}
	}
</style>
