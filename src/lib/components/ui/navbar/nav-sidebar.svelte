<script lang="ts">

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '../button';
	import { NAVEGATION_BUTTONS, SERVICE_PAGES } from './constants';
	import * as m from '$lib/paraglide/messages';
	import NavbarThemeToggle from './navbar-theme-toggle.svelte';
	import LangChooser from './lang-chooser.svelte';

</script>


<Sidebar.Root viewTransitionName="main-sidebar" variant="floating" side="right">
	<Sidebar.Content class="p-5">
		<Sidebar.Header>Bruno Corrêa</Sidebar.Header>
		<Sidebar.Group>
			<Sidebar.GroupLabel >{m.nav_general_section()}</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each NAVEGATION_BUTTONS as button (button.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class="flex justify-start
							">
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
			<Sidebar.GroupLabel >{m.nav_service_section()}</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each SERVICE_PAGES as button (button.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class="flex justify-start
							">
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
	<Sidebar.Footer class="p-5 flex flex-row">
		<NavbarThemeToggle/>
		<LangChooser></LangChooser>
	</Sidebar.Footer>
</Sidebar.Root>

