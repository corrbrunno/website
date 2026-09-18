<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import * as m from '$lib/paraglide/messages';
	import type { TagSummary } from '$lib/types';

	const { tags, selected }: { tags: TagSummary[]; selected: string | null } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedLabel = $derived(tags.find((tag) => tag.slug === selected)?.name ?? null);

	function selectTag(slug: string | null) {
		open = false;
		void tick().then(() => {
			triggerRef.focus();
			void goto(slug ? `?tag=${encodeURIComponent(slug)}` : '?', {
				keepFocus: true,
				noScroll: true
			});
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				role="combobox"
				aria-label={m.blog_tags_label()}
				aria-expanded={open}
				class="w-[220px] justify-between"
			>
				<span class="truncate">{selectedLabel ?? m.blog_filter_all()}</span>
				<ChevronsUpDown class="ms-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>

	<Popover.Content class="w-[220px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={m.blog_tags_search()} />
			<Command.List>
				<Command.Empty>{m.blog_tags_empty()}</Command.Empty>
				<Command.Group>
					<Command.Item value="all" onSelect={() => selectTag(null)}>
						<Check class={cn('me-2 size-4', selected !== null && 'text-transparent')} />
						{m.blog_filter_all()}
					</Command.Item>

					{#each tags as tag (tag.slug)}
						<Command.Item value={tag.name} onSelect={() => selectTag(tag.slug)}>
							<Check class={cn('me-2 size-4', selected !== tag.slug && 'text-transparent')} />
							{tag.name}
							<span class="text-muted-foreground ms-auto text-xs tabular-nums">{tag.total}</span>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
