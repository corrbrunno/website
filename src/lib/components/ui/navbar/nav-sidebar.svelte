<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as m from '$lib/paraglide/messages';
	import type { Locale } from '$lib/paraglide/runtime';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { LocalizedString } from '@inlang/paraglide-js';
	import { Book, Bot, HouseIcon, MonitorCloud, NotebookPen, SquareUserRound } from '@lucide/svelte';
	import { mode as selectedMode } from 'mode-watcher';
	import { Button } from '../button';
	import LangChooser from './lang-chooser.svelte';
	import NavbarThemeToggle from './navbar-theme-toggle.svelte';
	import { getSelectedLanguage } from './utils.svelte';
	import { NAVEGATION_BUTTONS, SERVICE_PAGES } from './constants';


	const groups = [
		{ title: m.nav_general_section, buttons: NAVEGATION_BUTTONS },
		{ title: m.nav_service_section, buttons: SERVICE_PAGES }
	];

	const selectedLanguage = getSelectedLanguage();
</script>

<Sidebar.Root viewTransitionName="main-sidebar" variant="floating" side="right">
	<Sidebar.Content class="p-4">
		<Sidebar.Header class="text-2xl font-bold"
			>{`${m.global_personal_first_name()} ${m.global_personal_second_name()}`}</Sidebar.Header
		>
		{#each groups as { title, buttons }}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{title()}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each buttons as button (button.slug)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton class="flex justify-start">
									{#snippet child({ props })}
										{@const route = localizeHref(button.url)}
										{@const onPage =
											page.url.pathname.replaceAll('/', '') == route.replaceAll('/', '')}

										<Button variant="link" href={route} {...props}>
											<button.icon class={onPage ? 'text-primary' : 'text-foreground'} />
											<span class={onPage ? 'text-primary' : 'text-muted-foreground'}
												>{button.slug()}</span
											>
										</Button>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
		
	</Sidebar.Content>
	<Sidebar.Footer class="p-5">
		<Sidebar.Group class="flex gap-2">
			<Sidebar.GroupLabel>{m.nav_config()}</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="flex flex-row justify-between gap-5 text-center">
					<Sidebar.MenuItem class="flex gap-2">
						<NavbarThemeToggle />
						<p class="text-primary">
							{#if selectedMode.current == 'light'}
								{m.nav_light_mode_bright()}
							{:else}
								{m.nav_light_mode_dark()}
							{/if}
						</p>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem class="flex gap-2">
						<LangChooser></LangChooser>
						<p class="text-primary">{selectedLanguage.lang()}</p>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Footer>
</Sidebar.Root>
