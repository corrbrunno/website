<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import Button from '../button/button.svelte';

	import { SUPPORTED_LANGUAGES } from './constants';

	let selectedLanguage = $derived(
		SUPPORTED_LANGUAGES.filter((lang) => lang.locale == getLocale())[0]
	);
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="outline" size="icon">
			<img class="size-5" alt={`${selectedLanguage.lang} flag`} src={selectedLanguage.emoji} />
		</Button>
	</Popover.Trigger>
	<Popover.Content>
		<Command.Root>
			<Command.List>
				{#each SUPPORTED_LANGUAGES as language}
					<Command.Item value={language.lang()} onclick={() => setLocale(language.locale)} class="flex-1">
						<img class="size-5" src={language.emoji} alt={`${language.lang()} flag`} />
						{language.lang()}
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
