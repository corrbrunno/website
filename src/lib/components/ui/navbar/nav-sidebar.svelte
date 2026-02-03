<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '../button';
	import { NAVEGATION_BUTTONS, SERVICE_PAGES } from './constants';
	import * as m from '$lib/paraglide/messages';
	import NavbarThemeToggle from './navbar-theme-toggle.svelte';
	import LangChooser from './lang-chooser.svelte';
	import { getSelectedLanguage } from './utils.svelte';

	import { mode as selectedMode } from 'mode-watcher';

	const selectedLanguage = getSelectedLanguage();
</script>

<Sidebar.Root viewTransitionName="main-sidebar" variant="floating" side="right">
	<Sidebar.Content class="p-4">
		<Sidebar.Header class="text-2xl font-bold"
			>{`${m.global_personal_first_name()} ${m.global_personal_second_name()}`}</Sidebar.Header
		>
		<Sidebar.Group>
			<Sidebar.GroupLabel>{m.nav_general_section()}</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each NAVEGATION_BUTTONS as button (button.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class="flex justify-start">
								{#snippet child({ props })}
									<Button variant="link" href={button.url} {...props}>
										<button.icon />
										<span>{button.slug}</span>
									</Button>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>{m.nav_service_section()}</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each SERVICE_PAGES as button (button.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								class="flex justify-start
							"
							>
								{#snippet child({ props })}
									<Button variant="link" href={button.url} {...props}>
										<button.icon />
										<span>{button.slug()}</span>
									</Button>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
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
