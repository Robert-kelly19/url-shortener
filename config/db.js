import pg from "pg";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT} = process.env;

if (!DB_HOST || !DB_PASSWORD || !DB_NAME || !DB_USER || !DB_PORT ) {
  logger.error(
    "Database environment variables are missing! Check your .env file."
  );
  process.exit(1);
}

const pool = new Pool({
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  connectionTimeoutMillis: 2000,
});

logger.info(`Database is configured for: ${DB_NAME}`);

pool.on("connect", (client) => {
  logger.info(`Client connected from Pool (Total count: ${pool.totalCount}`);
});

pool.on("error", (err, client) => {
  logger.error("Unexpected error on idle client in pool", err);
  process.exit(-1);
})

const initializeDbSchema = async () => {
    const client = await pool.connect()
    try {
        logger.info('initializing database schema...')
        await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto")

        // Drop existing tables
        logger.info('dropping existing tables...')
        await client.query(`DROP TABLE IF EXISTS click_events CASCADE;`)
        await client.query(`DROP TABLE IF EXISTS url CASCADE;`)
        await client.query(`DROP TABLE IF EXISTS users CASCADE;`)
        logger.info('tables dropped')

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
            `)
            logger.info('user table created')

            await client.query(`
                CREATE TABLE IF NOT EXISTS url (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                short_code TEXT NOT NULL,
                long_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP,
                clicks INT DEFAULT 0,
                unique_visitors INT DEFAULT 0,
                UNIQUE(owner_id, short_code)
                );
                `)

            await client.query(`
                CREATE TABLE IF NOT EXISTS click_events (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                url_id UUID NOT NULL REFERENCES url(id) ON DELETE CASCADE,
                ip_address VARCHAR(45),
                user_agent TEXT,
                visited_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(url_id, ip_address, user_agent)
                );
                `)

                logger.info("created url table")
                logger.info("created click_events table")

            await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
            await client.query('CREATE INDEX IF NOT EXISTS idx_url_user_id ON url(owner_id)');
            await client.query('CREATE INDEX IF NOT EXISTS idx_click_events_url_id ON click_events(url_id)');

            logger.info('Indexes have been ensured')
    } catch (error) {
        logger.error(`Error while initializing the schema`, error)
    process.exit(1)
  } finally {
    client.release()
    }
}


const connectToDb = async () => {
    try {
      const client = await pool.connect()
      logger.info(`Database connection pool established successfully`)
      client.release()
    } catch (error) {
      logger.error('Unable to establish database connection pool', error)
      console.error(error)
      process.exit(1)
    }
  }
  
  const  query = async (text, params) => {
    const start = Date.now()
    try {
      const response = await pool.query(text, params)
      const duration = Date.now() - start;
      logger.info(`Executed query: { text: ${text.substring(0, 100)}..., params: ${JSON.stringify(params)}, duration: ${duration}ms, rows: ${response.rowCount}}`);
      return response
    } catch (error) {
      logger.error(`Error executing query: { text: ${text.substring(0, 100)}..., params: ${JSON.stringify(params)}, error: ${error.message}}`);
      console.error(error)
      throw error
    }
  }
  
  export { pool, connectToDb, query, initializeDbSchema }
    