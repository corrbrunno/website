import { defineConfig } from 'drizzle-kit';

// Migrações preferem o endpoint direto: db:push/db:migrate não combinam com o pooler.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url },
	verbose: true,
	strict: true
});
