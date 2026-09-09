<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '../button';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ThemeToggle from './navbar-theme-toggle.svelte';
	import { NAVEGATION_BUTTONS, SERVICE_PAGES, UTILS_PAGES } from './constants.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import LangChooser from './lang-chooser.svelte';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';

	let servicesOpen = $state(false);
	let servicesTriggerRef = $state<HTMLButtonElement>(null!);
	let utilsOpen = $state(false);
	let utilsTriggerRef = $state<HTMLButtonElement>(null!);
	let scrollY = $state(0);

	function closeAndFocusTrigger() {
		servicesOpen = false;
		tick().then(() => servicesTriggerRef?.focus());
	}

	function navigateTo(path: string) {
		closeAndFocusTrigger();
		goto(localizeHref(path));
	}

	const headerClass = $derived(
		scrollY > 30 ? 'bg-background/70 backdrop-blur-md shadow-sm' : 'bg-transparent backdrop-blur-0'
	);
</script>

<svelte:window bind:scrollY />

<header
	style="view-transition-name: navbar"
	class="fixed top-0 z-49 flex w-full justify-center transition-all duration-300 print:hidden {headerClass}"
>
	<nav class="flex w-full justify-center">
		<section
			class="max-w-content-width relative flex h-14 w-full items-center overflow-hidden px-4 md:h-16 md:px-6"
		>
			<section class="flex flex-1 items-center gap-2 overflow-hidden text-sm md:gap-3">
				{#each NAVEGATION_BUTTONS as { url, slug }}
					<Button variant="ghost" href={localizeHref(url)}>{slug()}</Button>
				{/each}

				<Popover.Root bind:open={servicesOpen}>
					<Popover.Trigger bind:ref={servicesTriggerRef}>
						{#snippet child({ props })}
							<Button
								variant="ghost"
								role="combobox"
								aria-expanded={servicesOpen}
								aria-label={m.nav_service_section()}
								{...props}
							>
								{m.nav_service_section()}
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-fit p-0" align="start">
						<Command.Root>
							<Command.List>
								<Command.Group>
									{#each SERVICE_PAGES as service}
										<Command.Item value={service.slug()} onSelect={() => navigateTo(service.url)}>
											<div class="flex flex-col">
												<span>{service.slug()}</span>
											</div>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
				<Popover.Root bind:open={utilsOpen}>
					<Popover.Trigger bind:ref={utilsTriggerRef}>
						{#snippet child({ props })}
							<Button
								variant="ghost"
								role="combobox"
								aria-expanded={utilsOpen}
								aria-label={m.nav_utils()}
								{...props}
							>
								{m.nav_utils()}
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-fit p-0" align="start">
						<Command.Root>
							<Command.List>
								<Command.Group>
									{#each UTILS_PAGES as util}
										<Command.Item
											value={util.slug()}
											onSelect={() => {
												utilsOpen = false;
												goto(util.url); // rotas /utils/* não são localizadas
											}}
										>
											<div class="flex flex-col">
												<span>{util.slug()}</span>
											</div>
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</section>

			<section class="relative z-10 flex shrink-0 items-center gap-1 pl-3 md:gap-2">
				<div class="hidden items-center gap-1 sm:flex md:gap-2">
					<LangChooser />
					<ThemeToggle />
				</div>
				<Sidebar.Trigger class="size-9 sm:hidden" />
			</section>
		</section>
	</nav>
</header>
