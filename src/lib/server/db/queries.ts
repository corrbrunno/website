import { randomUUID } from 'node:crypto';
import { and, asc, count, desc, eq, ilike, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getDb, isDbConfigured } from './index';
import { comments, postTags, posts, tags } from './schema';
import type { Comment, PostStats, TagSummary } from '$lib/types';
import { RATE_LIMIT_SECONDS } from '$lib/server/comments';

export { isDbConfigured };

export async function getPostStats(): Promise<Record<string, PostStats>> {
	const db = getDb();

	const [viewRows, commentRows] = await Promise.all([
		db.select({ slug: posts.slug, views: posts.views }).from(posts),
		db
			.select({ slug: comments.postSlug, total: count() })
			.from(comments)
			.where(eq(comments.status, 'approved'))
			.groupBy(comments.postSlug)
	]);

	const stats: Record<string, PostStats> = {};
	for (const row of viewRows) stats[row.slug] = { views: row.views, comments: 0 };
	for (const row of commentRows) {
		stats[row.slug] = { views: stats[row.slug]?.views ?? 0, comments: Number(row.total) };
	}
	return stats;
}

export async function getTagsByPost(): Promise<Record<string, string[]>> {
	const db = getDb();
	const rows = await db
		.select({ postSlug: postTags.postSlug, name: tags.name, slug: tags.slug })
		.from(postTags)
		.innerJoin(tags, eq(tags.id, postTags.tagId))
		.orderBy(asc(tags.name));

	const map: Record<string, string[]> = {};
	for (const row of rows) map[row.postSlug] = [...(map[row.postSlug] ?? []), row.name];
	return map;
}

export async function listTags(): Promise<TagSummary[]> {
	const db = getDb();
	const rows = await db
		.select({ slug: tags.slug, name: tags.name, total: count(postTags.postSlug) })
		.from(tags)
		.leftJoin(postTags, eq(postTags.tagId, tags.id))
		.groupBy(tags.id, tags.slug, tags.name)
		.orderBy(desc(count(postTags.postSlug)), asc(tags.name));

	return rows.map((row) => ({ slug: row.slug, name: row.name, total: Number(row.total) }));
}

export async function listTagsForPost(slug: string): Promise<TagSummary[]> {
	const db = getDb();
	const rows = await db
		.select({ slug: tags.slug, name: tags.name })
		.from(postTags)
		.innerJoin(tags, eq(tags.id, postTags.tagId))
		.where(eq(postTags.postSlug, slug))
		.orderBy(asc(tags.name));

	return rows.map((row) => ({ slug: row.slug, name: row.name, total: 0 }));
}

/** Sem filtro devolve null: a listagem completa vem dos arquivos do mdsvex. */
export async function findPostSlugs(filter: {
	q?: string | null;
	tag?: string | null;
}): Promise<string[] | null> {
	const term = filter.q?.trim() ?? '';
	const tag = filter.tag?.trim() ?? '';
	if (!term && !tag) return null;

	const db = getDb();
	const conditions = [];

	if (term) {
		const like = `%${term}%`;
		conditions.push(
			sql`(
				${posts.title} ilike ${like}
				or coalesce(${posts.description}, '') ilike ${like}
				or exists (
					select 1 from ${postTags}
					inner join ${tags} on ${tags.id} = ${postTags.tagId}
					where ${postTags.postSlug} = ${posts.slug} and ${tags.name} ilike ${like}
				)
			)`
		);
	}

	if (tag) {
		conditions.push(
			sql`exists (
				select 1 from ${postTags}
				inner join ${tags} on ${tags.id} = ${postTags.tagId}
				where ${postTags.postSlug} = ${posts.slug} and ${tags.slug} = ${tag}
			)`
		);
	}

	const rows = await db
		.select({ slug: posts.slug })
		.from(posts)
		.where(and(...conditions));

	return rows.map((row) => row.slug);
}

/** null = slug ainda não sincronizado (a UI esconde o contador). */
export async function getPostViews(slug: string): Promise<number | null> {
	const db = getDb();
	const [row] = await db
		.select({ views: posts.views })
		.from(posts)
		.where(eq(posts.slug, slug))
		.limit(1);
	return row?.views ?? null;
}

/** Não cria linha: post não sincronizado não ganha view. */
export async function registerView(slug: string): Promise<number | null> {
	const db = getDb();
	const rows = await db
		.update(posts)
		.set({ views: sql`${posts.views} + 1` })
		.where(eq(posts.slug, slug))
		.returning({ views: posts.views });
	return rows[0]?.views ?? null;
}

export async function listComments(slug: string): Promise<Comment[]> {
	const db = getDb();
	// Nunca expõe delete_token: vazado na leitura pública, qualquer um apagaria tudo.
	const rows = await db
		.select({
			id: comments.id,
			author: comments.author,
			body: comments.body,
			createdAt: comments.createdAt
		})
		.from(comments)
		.where(and(eq(comments.postSlug, slug), eq(comments.status, 'approved')))
		.orderBy(asc(comments.createdAt));

	return rows.map((row) => ({
		id: row.id,
		author: row.author,
		body: row.body,
		createdAt: row.createdAt.toISOString()
	}));
}

/** Sem hash sempre false: configuração ausente não bloqueia comentário. */
export async function isRateLimited(ipHash: string | null): Promise<boolean> {
	if (!ipHash) return false;

	const db = getDb();
	const [row] = await db
		.select({ id: comments.id })
		.from(comments)
		.where(
			and(
				eq(comments.ipHash, ipHash),
				sql`${comments.createdAt} > now() - interval '1 second' * ${RATE_LIMIT_SECONDS}`
			)
		)
		.limit(1);

	return Boolean(row);
}

export async function addComment(input: {
	postSlug: string;
	author: string;
	body: string;
	ipHash: string | null;
}): Promise<{ id: number; deleteToken: string }> {
	const db = getDb();
	const [row] = await db
		.insert(comments)
		.values({
			postSlug: input.postSlug,
			author: input.author,
			body: input.body,
			ipHash: input.ipHash,
			deleteToken: randomUUID()
		})
		.returning({ id: comments.id, deleteToken: comments.deleteToken });

	return { id: row.id, deleteToken: row.deleteToken };
}

/** Aceita o token do autor ou o COMMENTS_ADMIN_TOKEN. */
export async function deleteComment(input: {
	id: number;
	postSlug: string;
	token: string;
}): Promise<boolean> {
	const db = getDb();
	const admin = env.COMMENTS_ADMIN_TOKEN;
	const isAdmin = Boolean(admin) && input.token === admin;

	const rows = await db
		.delete(comments)
		.where(
			isAdmin
				? eq(comments.id, input.id)
				: and(
						eq(comments.id, input.id),
						eq(comments.postSlug, input.postSlug),
						eq(comments.deleteToken, input.token)
					)
		)
		.returning({ id: comments.id });

	return rows.length > 0;
}
