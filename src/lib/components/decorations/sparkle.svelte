<script lang="ts">
	import { cn } from "$lib/utils";


	const {
		class: className,
		color = 'var(--primary)',
		degreesRotation = 0,
	}: { class?: string; color?: string; degreesRotation?: Number } = $props();
</script>

<div id="target" class={cn(className)} style="--target-color: {color}; --target-rotation: {degreesRotation}deg;">
</div>

<style>
	#target {
        aspect-ratio: 1/1;
		background-color: var(--target-color);
		transform: rotate(var(--target-roation));

		-webkit-mask-image:
			linear-gradient(to right, transparent, black, transparent),
			linear-gradient(to bottom, transparent, black, transparent),
			radial-gradient(circle, black 10%, transparent 90%);

		mask-image:
			linear-gradient(to right, transparent, black, transparent),
			linear-gradient(to bottom, transparent, black, transparent),
			radial-gradient(circle, black 10%, transparent 90%);

		-webkit-mask-composite: source-over;
		mask-composite: intersect;
	}
</style>
