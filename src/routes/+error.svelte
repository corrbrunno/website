<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Info } from '@lucide/svelte';

	const isServerError = page.status >= 500;
</script>

<section class="flex h-full w-full flex-col content-center items-center  justify-center p-3">
	<div class="mb-1 text-center">
		<h1 class="text-3xl"><strong>{page.status}</strong>: {page.error?.message}</h1>
	</div>
	<p class="text-sm mb-4">Não foi possível carregar esta págia.</p>
	<div class="flex flex-row justify-center items-center content-center flex-0">
		
		<Info class="min-w-4 max-w-4 mr-2 mb-auto -translate-y-1" />
		<p >
			{#if isServerError}
				Sinto muito, houve algum erro no servidor.
			{:else}
				O link não existe ou contem um erro de digitação.
			{/if}
			<Button
				href={`https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status/${page.status}`}
				variant="link"
				class="inline p-0"
			>
				Saiba mais clicando aqui.
			</Button>
		</p>
</div>

	<Button variant="secondary" href="/" class="mt-5">Voltar ao início</Button>
</section>
