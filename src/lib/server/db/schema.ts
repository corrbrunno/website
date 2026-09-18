import {
	date,
	index,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

// Queryable index of the posts; the content itself stays in the .svx files (mdsvex).
export const posts = pgTable('posts', {
	slug: text('slug').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	publishedAt: date('published_at').notNull(),
	views: integer('views').notNull().default(0),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const tags = pgTable('tags', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull()
});

export const postTags = pgTable(
	'post_tags',
	{
		postSlug: text('post_slug')
			.notNull()
			.references(() => posts.slug, { onDelete: 'cascade' }),
		tagId: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.postSlug, table.tagId] })]
);

// One row per visitor per post: keeps `posts.views` from counting the same person twice.
export const postViews = pgTable(
	'post_views',
	{
		postSlug: text('post_slug')
			.notNull()
			.references(() => posts.slug, { onDelete: 'cascade' }),
		visitorHash: text('visitor_hash').notNull(),
		viewedAt: timestamp('viewed_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [primaryKey({ columns: [table.postSlug, table.visitorHash] })]
);

export const comments = pgTable(
	'comments',
	{
		id: serial('id').primaryKey(),
		postSlug: text('post_slug')
			.notNull()
			.references(() => posts.slug, { onDelete: 'cascade' }),
		author: text('author').notNull(),
		body: text('body').notNull(),
		status: text('status').notNull().default('approved'),
		// Proof of ownership, not authentication: the author keeps the token to delete their own comment.
		deleteToken: text('delete_token').notNull(),
		// HMAC of the visitor identity (never the raw IP), used for the rate limit.
		visitorHash: text('visitor_hash'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('comments_slug_created_idx').on(table.postSlug, table.createdAt),
		index('comments_visitor_idx').on(table.visitorHash, table.createdAt)
	]
);

export type PostRow = typeof posts.$inferSelect;
export type TagRow = typeof tags.$inferSelect;
export type CommentRow = typeof comments.$inferSelect;
