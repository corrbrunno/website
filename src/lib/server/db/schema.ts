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

/** Índice consultável dos posts — o conteúdo continua sendo o `.svx` (mdsvex). */
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
		// Posse, não autenticação: o autor guarda o token e remove o próprio comentário sem login.
		deleteToken: text('delete_token').notNull(),
		// HMAC do IP (nunca o IP cru) — só para limitar frequência.
		ipHash: text('ip_hash'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('comments_slug_created_idx').on(table.postSlug, table.createdAt),
		index('comments_ip_idx').on(table.ipHash, table.createdAt)
	]
);

export type PostRow = typeof posts.$inferSelect;
export type TagRow = typeof tags.$inferSelect;
export type CommentRow = typeof comments.$inferSelect;
