import { Pool, QueryResult } from "pg";

export interface PostgresConfig {
  connectionString: string;
}

export class PostgresClient {
  pool: Pool;

  constructor(config: PostgresConfig) {
    this.pool = new Pool({ connectionString: config.connectionString });
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      console.info("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.info("Disconnected from the database");
    } catch (error) {
      console.error("Error disconnecting from the database:", error);
      throw error;
    }
  }

  async query(sql: string, value?: any[]): Promise<QueryResult> {
    return await this.pool.query(sql, value);
  }

  async begin(): Promise<QueryResult> {
    return await this.query("BEGIN");
  }

  async commit(): Promise<QueryResult> {
    return await this.query("COMMIT");
  }

  async rollback(): Promise<QueryResult> {
    return await this.query("ROLLBACK");
  }
}
