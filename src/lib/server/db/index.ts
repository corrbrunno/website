import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let client: ReturnType<typeof postgres> | undefined;
let database: PostgresJsDatabase<typeof schema> | undefined;

export function isDbConfigured(): boolean {
	return Boolean(env.DATABASE_URL);
}

export function getDb(): PostgresJsDatabase<typeof schema> {
	if (!database) {
		if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
		// prepare: false (pooler do Neon) e max: 1 (serverless não segura socket).
		client = postgres(env.DATABASE_URL, { prepare: false, max: 1 });
		database = drizzle(client, { schema });
	}
	return database;
}
