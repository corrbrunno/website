<script lang="ts">
	import { page } from '$app/state';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '../button/button.svelte';

	import { SUPPORTED_LANGUAGES } from './constants';
	import { getSelectedLanguage } from './utils';

	const { class: className }: { class?: string } = $props();
	const selectedLanguage = getSelectedLanguage();
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button class={className} variant="outline" size="icon" {...props}>
				<img class="size-5" alt={`${selectedLanguage.lang} flag`} src={selectedLanguage.emoji} />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full">
		<Command.Root>
			<Command.List>
				{#each SUPPORTED_LANGUAGES as language}
					{@const isSelectedLanguage = language == selectedLanguage}
					<Command.Item value={language.lang()} class={isSelectedLanguage ? 'bg-muted' : ''}>
						<a
							class="flex gap-2 px-5"
							data-sveltekit-reload
							href={localizeHref(page.url.href, { locale: language.locale })}
						>
							<img class="size-5" src={language.emoji} alt={`${language.lang()} flag`} />
							<p class="text-muted-foreground">{language.lang()}</p>
						</a>
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>