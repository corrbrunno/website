#!/usr/bin/env node
// Mirrors the .svx frontmatter into the DB index; idempotent and non-fatal (warns and exits 0).
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import postgres from 'postgres';

// Node does not load .env on its own (drizzle-kit does). Without this, `npm run db:sync`
// runs without DATABASE_URL. On Vercel there is no .env — the platform provides the vars.
try {
	process.loadEnvFile('.env');
} catch {}

const postsDir = join(process.cwd(), 'src', 'posts');

function parseFrontmatter(raw) {
	const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!block) return {};

	const data = {};
	for (const line of block[1].split(/\r?\n/)) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim();
		let value = line.slice(separator + 1).trim();
		if (!key) continue;

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		if (value.startsWith('[') && value.endsWith(']')) {
			data[key] = value
				.slice(1, -1)
				.split(',')
				.map((item) => item.trim().replace(/^["']|["']$/g, ''))
				.filter(Boolean);
		} else {
			data[key] = value;
		}
	}
	return data;
}

function toIsoDate(value) {
	if (typeof value !== 'string') return null;
	const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (!match) return null;
	const [, day, month, year] = match;
	return `${year}-${month}-${day}`;
}

function slugify(value) {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeTags(value) {
	const list = Array.isArray(value)
		? value
		: typeof value === 'string' && value.trim()
			? value.split(',')
			: [];

	return list
		.map((tag) => String(tag).trim())
		.filter(Boolean)
		.map((name) => ({ name, slug: slugify(name) }))
		.filter((tag) => tag.slug.length > 0);
}

async function main() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		console.warn('[db:sync] DATABASE_URL missing — sync skipped.');
		return;
	}

	const entries = (await readdir(postsDir)).filter((name) => /\.(svx|md)$/i.test(name));
	if (entries.length === 0) {
		console.warn('[db:sync] no posts found in src/posts.');
		return;
	}

	const rows = [];
	for (const entry of entries) {
		const raw = await readFile(join(postsDir, entry), 'utf8');
		const data = parseFrontmatter(raw);
		const slug = entry.replace(/\.(svx|md)$/i, '');
		const publishedAt = toIsoDate(data.date);

		if (!publishedAt) {
			console.warn(
				`[db:sync] "${entry}": missing or invalid "date" (expected DD/MM/YYYY) — skipped.`
			);
			continue;
		}

		rows.push({
			slug,
			title: String(data.title ?? slug),
			description: data.description ? String(data.description) : null,
			publishedAt,
			tags: normalizeTags(data.tags)
		});
	}

	if (rows.length === 0) {
		console.warn('[db:sync] nothing valid to sync.');
		return;
	}

	const sql = postgres(connectionString, { prepare: false, max: 1 });
	try {
		for (const row of rows) {
			await sql`
				insert into posts (slug, title, description, published_at, updated_at)
				values (${row.slug}, ${row.title}, ${row.description}, ${row.publishedAt}, now())
				on conflict (slug) do update set
					title = excluded.title,
					description = excluded.description,
					published_at = excluded.published_at,
					updated_at = now()
			`;

			const tagIds = [];
			for (const tag of row.tags) {
				const [saved] = await sql`
					insert into tags (slug, name) values (${tag.slug}, ${tag.name})
					on conflict (slug) do update set name = excluded.name
					returning id
				`;
				tagIds.push(saved.id);
			}

			if (tagIds.length > 0) {
				for (const tagId of tagIds) {
					await sql`
						insert into post_tags (post_slug, tag_id) values (${row.slug}, ${tagId})
						on conflict do nothing
					`;
				}
				await sql`
					delete from post_tags
					where post_slug = ${row.slug} and tag_id <> all(${tagIds}::int[])
				`;
			} else {
				await sql`delete from post_tags where post_slug = ${row.slug}`;
			}
		}

		await sql`delete from tags where id not in (select tag_id from post_tags)`;

		console.log(
			`[db:sync] ${rows.length} post(s): ${rows
				.map(
					(row) =>
						`${row.slug}${row.tags.length ? ` [${row.tags.map((t) => t.slug).join(', ')}]` : ''}`
				)
				.join(' | ')}`
		);
	} finally {
		await sql.end({ timeout: 5 });
	}
}

main().catch((error) => {
	console.warn('[db:sync] failed (build continues):', error.message);
});
