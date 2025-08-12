import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import config from '../../src/config';

const pool = new pg.Pool({
    connectionString: config.env.databaseUrl,
})

export const db = drizzle(pool);