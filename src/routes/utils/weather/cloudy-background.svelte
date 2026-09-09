<script>
	import { Cloud } from '@lucide/svelte';
</script>

<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
	<div
		class="wc-cloud text-foreground/15"
		style="top: 6%; width: 320px; animation-duration: 95s; animation-delay: -30s"
	>
		<Cloud class="w-full" />
	</div>
	<div
		class="wc-cloud text-foreground/15"
		style="top: 20%; width: 180px; animation-duration: 65s; animation-delay: -50s"
	>
		<Cloud class="w-full" />
	</div>
	<div
		class="wc-cloud text-foreground/15"
		style="top: 42%; width: 260px; animation-duration: 115s; animation-delay: -8s"
	>
		<Cloud class="w-full" />
	</div>
	<div
		class="wc-cloud text-foreground/15"
		style="top: 66%; width: 210px; animation-duration: 80s; animation-delay: -70s"
	>
		<Cloud class="w-full" />
	</div>
	<div
		class="wc-cloud text-foreground/10"
		style="top: 84%; width: 340px; animation-duration: 130s; animation-delay: -95s"
	>
		<Cloud class="w-full" />
	</div>
</div>

<style>
	.wc-cloud {
		position: absolute;
		left: 0;
		animation: wc-drift linear infinite;
		will-change: transform;
	}

	.wc-cloud :global(svg) {
		width: 100%;
		height: auto;
		fill: currentColor;
		stroke: transparent;
	}

	@keyframes wc-drift {
		0% {
			transform: translateX(calc(-100% - 10vw));
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			transform: translateX(calc(100vw + 10vw));
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wc-cloud {
			animation: none;
			display: none;
		}
	}
</style>
