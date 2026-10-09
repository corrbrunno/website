<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import Button from '../button/button.svelte';
	import ALargeSmallIcon from '@lucide/svelte/icons/a-large-small';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import * as m from '$lib/paraglide/messages';
	import {
		accessibility,
		FONT_SCALE_DEFAULT,
		FONT_SCALE_STEPS,
		setFontScale,
		stepFontScale
	} from '$lib/client/stores/accessibility.svelte';

	const { class: className }: { class?: string } = $props();

	let open = $state(false);

	const atMin = $derived(accessibility.fontScale <= FONT_SCALE_STEPS[0]);
	const atMax = $derived(accessibility.fontScale >= FONT_SCALE_STEPS[FONT_SCALE_STEPS.length - 1]);
	const isDefault = $derived(accessibility.fontScale === FONT_SCALE_DEFAULT);
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				class={className}
				variant="outline"
				size="icon"
				role="combobox"
				aria-expanded={open}
				aria-label={m.a11y_font_size()}
				{...props}
			>
				<ALargeSmallIcon class="size-5" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" align="end">
		<Command.Root>
			<Command.List>
				<Command.Group heading={m.a11y_font_size()}>
					<div class="flex items-center justify-between gap-2 px-2 py-1">
						<Button
							variant="outline"
							size="icon"
							class="size-8"
							disabled={atMin}
							onclick={() => stepFontScale(-1)}
							aria-label={m.a11y_font_decrease()}
						>
							<MinusIcon class="size-4" />
						</Button>
						<span class="text-sm font-medium tabular-nums" aria-live="polite">
							{accessibility.fontScale}%
						</span>
						<Button
							variant="outline"
							size="icon"
							class="size-8"
							disabled={atMax}
							onclick={() => stepFontScale(1)}
							aria-label={m.a11y_font_increase()}
						>
							<PlusIcon class="size-4" />
						</Button>
					</div>
					<Button
						variant="ghost"
						size="sm"
						class="w-full justify-start"
						disabled={isDefault}
						onclick={() => setFontScale(FONT_SCALE_DEFAULT)}
					>
						<RotateCcwIcon class="size-4" />
						{m.a11y_font_reset()}
					</Button>
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
