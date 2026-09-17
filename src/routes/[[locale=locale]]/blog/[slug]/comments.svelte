<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages';
	import type { Comment } from '$lib/types';

	const { slug, comments, dbReady }: { slug: string; comments: Comment[]; dbReady: boolean } =
		$props();

	// Nome lembrado entre visitas + comprovante de posse dos comentários deste navegador.
	const authorKey = 'blog:comment-author';
	const tokensKey = 'blog:comment-tokens';

	let author = $state('');
	let body = $state('');
	let status = $state<'idle' | 'sending' | 'ok' | 'error'>('idle');
	let errorCode = $state<string | null>(null);
	let tokens = $state<Record<number, string>>({});
	let removed = $state<number[]>([]);

	const errors: Record<string, () => string> = {
		author_short: m.blog_comments_invalid_author_short,
		author_long: m.blog_comments_invalid_author_long,
		body_short: m.blog_comments_invalid_body_short,
		body_long: m.blog_comments_invalid_body_long,
		rate_limited: m.blog_comments_rate_limited,
		unavailable: m.blog_comments_unavailable,
		not_allowed: m.blog_comments_remove_failed,
		delete_failed: m.blog_comments_remove_failed,
		save_failed: m.blog_comments_failed
	};

	const visible = $derived(comments.filter((comment) => !removed.includes(comment.id)));
	const errorText = $derived(errorCode ? (errors[errorCode] ?? m.blog_comments_failed)() : null);

	function readLocal<T>(key: string, fallback: T): T {
		try {
			const raw = localStorage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : fallback;
		} catch (error) {
			console.warn('[blog] leitura do localStorage falhou:', error);
			return fallback;
		}
	}

	function writeLocal(key: string, value: unknown) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.warn('[blog] gravação no localStorage falhou:', error);
		}
	}

	onMount(() => {
		const stored = readLocal<string>(authorKey, '');
		if (stored) author = stored;
		tokens = readLocal<Record<number, string>>(tokensKey, {});
	});

	function dateLabel(iso: string): string {
		return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
			new Date(iso)
		);
	}

	const submitComment: SubmitFunction = () => {
		status = 'sending';
		errorCode = null;

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data && 'deleteToken' in result.data) {
				const { id, deleteToken } = result.data as { id: number; deleteToken: string };

				status = 'ok';
				author = String(author).trim();
				body = '';
				tokens = { ...tokens, [id]: deleteToken };
				writeLocal(tokensKey, tokens);
				writeLocal(authorKey, author);
			} else if (result.type === 'failure') {
				status = 'error';
				errorCode = result.data?.code ?? 'save_failed';
			} else {
				status = 'error';
				errorCode = 'save_failed';
			}

			await update({ reset: false });
		};
	};

	const removeComment =
		(id: number): SubmitFunction =>
		({ cancel }) => {
			if (!confirm(m.blog_comments_remove_confirm())) {
				cancel();
				return;
			}

			status = 'idle';
			errorCode = null;

			return async ({ result, update }) => {
				if (result.type === 'success' && result.data && 'removed' in result.data) {
					removed = [...removed, id];
					const next = { ...tokens };
					delete next[id];
					tokens = next;
					writeLocal(tokensKey, tokens);
				} else {
					status = 'error';
					errorCode =
						result.type === 'failure' ? (result.data?.code ?? 'delete_failed') : 'delete_failed';
				}

				await update();
			};
		};
</script>

<section class="max-w-block-width mt-10 mr-auto ml-auto w-full">
	<h2 class="mb-4 text-2xl font-semibold">
		{m.blog_comments_title()}
		{#if visible.length > 0}
			<span class="text-muted-foreground text-base font-normal">
				{m.blog_comments_count({ count: visible.length })}
			</span>
		{/if}
	</h2>

	{#if !dbReady}
		<p class="text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
			{m.blog_comments_unavailable()}
		</p>
	{:else}
		<ul class="mb-6 flex flex-col gap-3">
			{#each visible as comment (comment.id)}
				<li class="rounded-xl border p-4">
					<header class="mb-1 flex items-baseline justify-between gap-4">
						<span class="font-semibold">{comment.author}</span>
						<span class="text-muted-foreground text-xs tabular-nums">
							{dateLabel(comment.createdAt)}
						</span>
					</header>
					<p class="text-sm whitespace-pre-line">{comment.body}</p>

					{#if tokens[comment.id]}
						<form
							method="POST"
							action="?/delete"
							use:enhance={removeComment(comment.id)}
							class="mt-2"
						>
							<input type="hidden" name="id" value={comment.id} />
							<input type="hidden" name="token" value={tokens[comment.id]} />
							<Button type="submit" variant="ghost" size="sm" class="text-muted-foreground -ml-2">
								{m.blog_comments_remove()}
							</Button>
						</form>
					{/if}
				</li>
			{:else}
				<li class="text-muted-foreground text-sm">{m.blog_comments_empty()}</li>
			{/each}
		</ul>

		<form
			method="POST"
			action="?/comment"
			use:enhance={submitComment}
			class="flex flex-col gap-3 rounded-xl border p-4"
		>
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium">{m.blog_comments_name()}</span>
				<Input
					name="author"
					bind:value={author}
					maxlength={40}
					required
					placeholder={m.blog_comments_name_placeholder()}
					aria-invalid={errorCode === 'author_short' || errorCode === 'author_long'}
				/>
			</label>

			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium">{m.blog_comments_body()}</span>
				<textarea
					name="body"
					bind:value={body}
					required
					minlength={3}
					maxlength={1000}
					rows={4}
					placeholder={m.blog_comments_body_placeholder()}
					aria-invalid={errorCode === 'body_short' || errorCode === 'body_long'}
					class="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
				></textarea>
			</label>

			<div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
				<label>
					Site
					<input type="text" name="website" tabindex="-1" autocomplete="off" />
				</label>
			</div>

			<div class="flex items-center justify-between gap-4">
				<div class="text-sm" aria-live="polite">
					{#if status === 'sending'}
						<span class="text-muted-foreground">{m.blog_comments_sending()}</span>
					{:else if status === 'ok'}
						<span class="text-primary">{m.blog_comments_success()}</span>
					{:else if errorText}
						<span class="text-destructive">{errorText}</span>
					{/if}
				</div>

				<Button type="submit" disabled={status === 'sending'}>
					{m.blog_comments_submit()}
				</Button>
			</div>
		</form>
	{/if}
</section>
