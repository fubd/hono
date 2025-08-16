import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {injectable} from 'inversify';
import {Kysely, MysqlDialect} from 'kysely';
import {createPool, type Pool} from 'mysql2';
import type {Database} from '../models/DataBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createMysqlPool(): Pool {
  return createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT_CONTAINER),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    supportBigNumbers: true,
    bigNumberStrings: true,
    typeCast: (field, next) => {
      if (field.type === 'LONGLONG') {
        const val = field.string();
        return val === null ? null : val;
      }
      return next();
    },
  });
}

export function createKyselyDb(pool: Pool): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new MysqlDialect({pool}),
  });
}

export interface IDatabaseService {
  getDb(): Kysely<Database>;
  initDatabase(): Promise<void>;
}

@injectable()
export class DatabaseService {
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
      const sqlScript = await fs.readFile(path.resolve(__dirname, '../sql/init.sql'), 'utf-8');
      const statements = sqlScript.split(';').filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await query({sql: statement});
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
