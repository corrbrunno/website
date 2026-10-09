<script lang="ts">
	import HandIcon from '@lucide/svelte/icons/hand';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages';
	import { accessibility, setLibras } from '$lib/client/stores/accessibility.svelte';

	const { class: className }: { class?: string } = $props();
</script>

<Button
	class={className}
	variant={accessibility.libras ? 'default' : 'outline'}
	size="icon"
	aria-pressed={accessibility.libras}
	aria-label={m.a11y_libras()}
	onclick={() => setLibras(!accessibility.libras)}
>
	<HandIcon class="size-5" />
</Button>
