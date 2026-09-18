import { randomUUID } from 'node:crypto';
import { and, asc, count, desc, eq, ne, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getDb, isDbConfigured } from './index';
import { comments, postTags, posts, tags } from './schema';
import type {
	Comment,
	PostContent,
	PostRecord,
	PostStats,
	PostSummary,
	TagSummary
} from '$lib/types';
import { RATE_LIMIT_SECONDS } from '$lib/server/comments';

export { isDbConfigured };

// A view counts once per visitor per window, not on every reload.
const VIEW_WINDOW_DAYS = 1;

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

// Single-table selection: correlated subqueries here lose the table prefix and silently
// compare against the wrong column, so counters and tags are fetched by their own queries.
const postListSelection = {
	slug: posts.slug,
	title: posts.title,
	description: sql<string>`coalesce(${posts.description}, '')`,
	publishedAt: posts.publishedAt,
	views: posts.views
};

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
		.select({ postSlug: postTags.postSlug, name: tags.name })
		.from(postTags)
		.innerJoin(tags, eq(tags.id, postTags.tagId))
		.orderBy(asc(tags.name));

	const map: Record<string, string[]> = {};
	for (const row of rows) map[row.postSlug] = [...(map[row.postSlug] ?? []), row.name];
	return map;
}

// The UI renders DD/MM/YYYY; the column stores ISO.
function toPostSummary(row: {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	views: number;
}): PostSummary {
	const [year, month, day] = row.publishedAt.split('-');
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		date: `${day}/${month}/${year}`,
		views: row.views
	};
}

/** Listing from the database; without filters it returns every post, newest first. */
export async function listPosts(
	filter: { q?: string | null; tags?: string[] } = {}
): Promise<PostSummary[]> {
	const db = getDb();
	const term = filter.q?.trim() ?? '';
	const selected = (filter.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
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

	if (selected.length > 0) {
		// Any of the selected tags matches (union, not intersection).
		const slugs = sql.join(
			selected.map((slug) => sql`${slug}`),
			sql`, `
		);
		conditions.push(
			sql`exists (
				select 1 from ${postTags}
				inner join ${tags} on ${tags.id} = ${postTags.tagId}
				where ${postTags.postSlug} = ${posts.slug} and ${tags.slug} in (${slugs})
			)`
		);
	}

	const rows = await db
		.select(postListSelection)
		.from(posts)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(desc(posts.publishedAt));

	return rows.map(toPostSummary);
}

export async function listLatestPosts(limit: number): Promise<PostSummary[]> {
	const db = getDb();
	const rows = await db
		.select(postListSelection)
		.from(posts)
		.orderBy(desc(posts.publishedAt))
		.limit(limit);

	return rows.map(toPostSummary);
}

export async function listPostSlugs(): Promise<string[]> {
	const db = getDb();
	const rows = await db.select({ slug: posts.slug }).from(posts).orderBy(desc(posts.publishedAt));

	return rows.map((row) => row.slug);
}

/** null means the slug is not in the database. */
export async function getPost(slug: string): Promise<PostContent | null> {
	const db = getDb();
	const [row] = await db
		.select({ ...postListSelection, bodyHtml: posts.bodyHtml })
		.from(posts)
		.where(eq(posts.slug, slug))
		.limit(1);

	return row ? { ...toPostSummary(row), bodyHtml: row.bodyHtml } : null;
}

/** Random post from the index, never the slug passed in exclude (the post the reader is on). */
export async function getRandomPostSlug(exclude?: string | null): Promise<string | null> {
	const db = getDb();
	const [row] = await db
		.select({ slug: posts.slug })
		.from(posts)
		.where(exclude ? ne(posts.slug, exclude) : undefined)
		.orderBy(sql`random()`)
		.limit(1);

	return row?.slug ?? null;
}

/** null means the slug is not synced yet (the UI hides the counter). */
export async function getPostViews(slug: string): Promise<number | null> {
	const db = getDb();
	const [row] = await db
		.select({ views: posts.views })
		.from(posts)
		.where(eq(posts.slug, slug))
		.limit(1);
	return row?.views ?? null;
}

/**
 * Counts a view and returns the new total, once per visitor per VIEW_WINDOW_DAYS.
 * An unclaimed insert means the visitor is still inside the window.
 */
export async function registerView(
	slug: string,
	visitorHash: string | null
): Promise<number | null> {
	const db = getDb();

	const [post] = await db
		.select({ views: posts.views })
		.from(posts)
		.where(eq(posts.slug, slug))
		.limit(1);
	if (!post) return null;

	if (visitorHash) {
		const claimed = await db.execute(sql`
			insert into post_views (post_slug, visitor_hash, viewed_at)
			values (${slug}, ${visitorHash}, now())
			on conflict (post_slug, visitor_hash)
			do update set viewed_at = now()
			where post_views.viewed_at < now() - interval '1 day' * ${VIEW_WINDOW_DAYS}
			returning viewed_at
		`);
		if (claimed.length === 0) return post.views;
	}

	const [updated] = await db
		.update(posts)
		.set({ views: sql`${posts.views} + 1` })
		.where(eq(posts.slug, slug))
		.returning({ views: posts.views });

	return updated?.views ?? post.views;
}

export async function listComments(slug: string): Promise<Comment[]> {
	const db = getDb();
	// Never selects delete_token: leaking it in a public read would let anyone delete anything.
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

/** A missing hash returns false: absent configuration disables the limit instead of blocking. */
export async function isRateLimited(visitorHash: string | null): Promise<boolean> {
	if (!visitorHash) return false;

	const db = getDb();
	const [row] = await db
		.select({ id: comments.id })
		.from(comments)
		.where(
			and(
				eq(comments.visitorHash, visitorHash),
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
	visitorHash: string | null;
}): Promise<{ id: number; deleteToken: string }> {
	const db = getDb();
	const [row] = await db
		.insert(comments)
		.values({
			postSlug: input.postSlug,
			author: input.author,
			body: input.body,
			visitorHash: input.visitorHash,
			deleteToken: randomUUID()
		})
		.returning({ id: comments.id, deleteToken: comments.deleteToken });

	return { id: row.id, deleteToken: row.deleteToken };
}

/** Accepts the author's token or the COMMENTS_ADMIN_TOKEN. */
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
