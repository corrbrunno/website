<script>
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { m } from '$lib/paraglide/messages';
	import { Printer } from '@lucide/svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger type="button" class={buttonVariants({ variant: 'secondary' })}>
		<p class="hidden md:block">{m.about_print_button()}</p>
		<Printer class="md:hidden" />
	</Dialog.Trigger>
	<Dialog.Content class="text-start">
		<Dialog.Header>
			<Dialog.Title>{m.about_print_button()}</Dialog.Title>
			<Dialog.Description>How do you want to print this page?</Dialog.Description>
		</Dialog.Header>
		<div>
			<Button variant="secondary">Print black and white</Button>
			<Button variant="outline">Print with colors</Button>
		</div>
        <Dialog.Footer class="justify-start text-start items-start">
            <p class="text-star justify-start text-sm text-muted-foreground">*Printing with colors might not look great in all browsers</p>
        </Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
