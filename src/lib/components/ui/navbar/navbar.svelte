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

  function closeAndFocusTrigger() {
    servicesOpen = false;
    tick().then(() => servicesTriggerRef?.focus());
  }

  function navigateTo(path: string) {
    closeAndFocusTrigger();
    goto(localizeHref(path));
  }
</script>

<header
  style="view-transition-name: navbar"
  class="print:hidden fixed top-0 z-49 flex w-full justify-center"
>
  <nav class="w-full">
    <section
      class="flex w-full content-center p-2 pr-10 pl-10 relative overflow-hidden"
    >
      <section
        class="flex items-center gap-1 overflow-hidden flex-1">
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

      <section class="shrink-0 relative z-10  backdrop-blur-sm pl-3">
        <div class="hidden sm:flex gap-2">
          <LangChooser />
          <ThemeToggle />
        </div>
        <Sidebar.Trigger class="sm:hidden" />
      </section>
    </section>
  </nav>
</header>