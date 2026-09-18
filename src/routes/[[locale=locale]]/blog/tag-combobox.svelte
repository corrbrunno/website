<script lang="ts">
	import { goto } from '$app/navigation';
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import * as m from '$lib/paraglide/messages';
	import type { TagSummary } from '$lib/types';

	const {
		tags,
		selected,
		query
	}: { tags: TagSummary[]; selected: string[]; query: string | null } = $props();

	let open = $state(false);

	const label = $derived(
		selected.length === 0
			? m.blog_filter_all()
			: selected.length === 1
				? (tags.find((tag) => tag.slug === selected[0])?.name ?? m.blog_filter_all())
				: m.blog_tags_selected({ count: selected.length })
	);

	function navigate(next: string[]) {
		const params = new URLSearchParams();
		if (query) params.set('q', query);
		for (const tag of next) params.append('tag', tag);
		void goto(params.size ? `?${params.toString()}` : '?', { keepFocus: true, noScroll: true });
	}

	function toggle(slug: string) {
		navigate(
			selected.includes(slug) ? selected.filter((item) => item !== slug) : [...selected, slug]
		);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				role="combobox"
				aria-label={m.blog_tags_label()}
				aria-expanded={open}
				class="w-[220px] justify-between"
			>
				<span class="truncate">{label}</span>
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
					<Command.Item value="all" onSelect={() => navigate([])}>
						<Check class={cn('me-2 size-4', selected.length > 0 && 'text-transparent')} />
						{m.blog_filter_all()}
					</Command.Item>

					{#each tags as tag (tag.slug)}
						<Command.Item
							value={tag.name}
							aria-selected={selected.includes(tag.slug)}
							onSelect={() => toggle(tag.slug)}
						>
							<Check
								class={cn('me-2 size-4', !selected.includes(tag.slug) && 'text-transparent')}
							/>
							{tag.name}
							<span class="text-muted-foreground ms-auto text-xs tabular-nums">{tag.total}</span>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
