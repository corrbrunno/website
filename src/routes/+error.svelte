<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Info } from '@lucide/svelte';

	const isServerError = page.status >= 500;
</script>

<section class="flex h-full w-full flex-col content-center items-center text-center justify-center p-3">
	<div class="mb-1 text-center">
		<h1 class="text-3xl"><strong>{page.status}</strong>: {page.error?.message}</h1>
	</div>
	<p class="text-sm mb-1">Não foi possível carregar esta págia.</p>
	<div class="flex flex-col items-center justify-center text-center md:flex-row">
		<Info class="mt-3 size-4 shrink-0 md:m-0 md:mr-2" />

		<p class="text-sm">
			{#if isServerError}
				Sinto muito, houve algum erro no servidor.
			{:else}
				O link não existe ou contem um erro de digitação.
			{/if}
			<Button
				href={`https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status/${page.status}`}
				variant="link"
				class="inline-flex h-auto p-0 align-baseline"
			>
				Saiba mais clicando aqui.
			</Button>
		</p>
	</div>
	<Button variant="secondary" href="/" class="mt-4">Voltar ao início</Button>
</section>
