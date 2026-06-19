<script lang="ts">
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '../button';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import ThemeToggle from './navbar-theme-toggle.svelte';
  import { NAVEGATION_BUTTONS, SERVICE_PAGES } from './constants.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import LangChooser from './lang-chooser.svelte';
  import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';

  let servicesOpen = $state(false);
  let servicesTriggerRef = $state<HTMLButtonElement>(null!);
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
    scrollY > 30
      ? 'bg-background/70 backdrop-blur-md shadow-sm'
      : 'bg-transparent backdrop-blur-0'
  );
</script>

<svelte:window bind:scrollY />

<header
  style="view-transition-name: navbar"
  class="print:hidden fixed top-0 z-49 flex w-full justify-center transition-all duration-300 {headerClass}"
>
  <nav class="flex w-full justify-center">
    <section
      class="flex max-w-content-width h-14 md:h-16 w-full items-center px-4 md:px-6 relative overflow-hidden"
    >
      <section
        class="flex items-center gap-2 md:gap-3 overflow-hidden flex-1 text-sm">
        {#each NAVEGATION_BUTTONS as { url, slug }}
          <Button variant="ghost" href={localizeHref(url)}>{slug()}</Button>
        {/each}

        <Popover.Root bind:open={servicesOpen}>
          <Popover.Trigger bind:ref={servicesTriggerRef}>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={servicesOpen}
              aria-label={m.nav_service_section()}
            >
              {m.nav_service_section()}
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-fit p-0" align="start">
            <Command.Root>
              <Command.List>
                <Command.Group>
                  {#each SERVICE_PAGES as service}
                    <Command.Item
                      value={service.slug()}
                      onSelect={() => navigateTo(service.url)}
                    >
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
      </section>

      <section class="flex shrink-0 items-center gap-1 md:gap-2 relative z-10 pl-3">
        <div class="hidden sm:flex items-center gap-1 md:gap-2">
          <LangChooser />
          <ThemeToggle />
        </div>
        <Sidebar.Trigger class="sm:hidden size-9" />
      </section>
    </section>
  </nav>
</header>
