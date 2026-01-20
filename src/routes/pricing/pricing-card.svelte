<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { IconProps } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type featureItem = { feature: string; icon?: Component<IconProps, {}, ''> };
	type cardProps = {
		title: string;
		paymentFrequency?: string;
		actionButton: { name: string; link: string };
		price: number;
		featureItems: featureItem[];
	};

	const { price, paymentFrequency, title, featureItems, actionButton }: cardProps = $props();
</script>

<Card.Root class="h-fit">
	<Card.Header class="flex flex-col items-center">
		<h2>{title}</h2>
		<Separator />
		<div>
			<h3 class="text-primary text-4xl font-bold">R$ {price}</h3>
			<p class="-mt-2 text-right text-sm">/{paymentFrequency}</p>
		</div>
	</Card.Header>
	<Card.Content>
		<ul class="flex flex-col gap-2">
			{#each featureItems as item}
				<li class="flex gap-2 text-left">
					<item.icon />
					<p>{item.feature}</p>
				</li>
			{/each}
		</ul>
	</Card.Content>
	<Card.Footer>
		<Button href={actionButton.link} class="w-full">{actionButton.name}</Button>
	</Card.Footer>
</Card.Root>
