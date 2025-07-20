import { injectable } from 'inversify';
import { Kysely } from 'kysely';
import { createMysqlPool, createKyselyDb } from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import type { Pool } from 'mysql2';
import type { Database } from '../models/DataBase.js';

export interface IDatabaseService {
  getDb(): Kysely<Database>;
  initDatabase(): Promise<void>;
}

@injectable()
export class DatabaseService implements IDatabaseService {
  private db: Kysely<Database>;
  private pool: Pool;

  constructor() {
    this.pool = createMysqlPool();
    this.db = createKyselyDb(this.pool);
  }

  getDb(): Kysely<Database> {
    return this.db;
  }

  async initDatabase(): Promise<void> {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const query = promisify(this.pool.query).bind(this.pool);
      const sqlScript = await fs.readFile(
        path.resolve(__dirname, '../sql/init.sql'), 
        'utf-8'
      );
      const statements = sqlScript.split(';').filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await query({ sql: statement });
          console.log(`执行 SQL 成功: ${statement.trim().slice(0, 50)}...`);
        }
      }

      console.log('✅ 数据库初始化完成');
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error);
      throw error;
    }
  }
}
