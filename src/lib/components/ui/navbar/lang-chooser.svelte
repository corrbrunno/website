<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils';
	import Button from '../button/button.svelte';

	import { SUPPORTED_LANGUAGES } from './constants';
	import { getSelectedLanguage } from './utils.svelte';

	const { class: className }: { class?: string } = $props();
	const selectedLanguage = getSelectedLanguage();
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button class={className} variant="outline" size="icon">
			<img class="size-5" alt={`${selectedLanguage.lang} flag`} src={selectedLanguage.emoji} />
		</Button>
	</Popover.Trigger>
	<Popover.Content>
		<Command.Root>
			<Command.List>
				{#each SUPPORTED_LANGUAGES as language}
					{@const isSelectedLanguage = language == selectedLanguage}
					<Command.Item
						value={language.lang()}
						onclick={() => setLocale(language.locale)}
						class={cn('flex-1', isSelectedLanguage ? 'bg-muted' : '')}
					>
						<img class="size-5" src={language.emoji} alt={`${language.lang()} flag`} />
						<p class="text-muted-foreground">{language.lang()}</p>
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
