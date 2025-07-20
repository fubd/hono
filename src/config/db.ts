import { createPool, type Pool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';
import {Redis} from 'ioredis';
import Tinypool from 'tinypool';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Database } from '../models/DataBase.js';

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
    dialect: new MysqlDialect({ pool }),
  });
}

export function createRedisClient(): Redis {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT_CONTAINER),
  });
}

export function createWorkerPool(): Tinypool {
  return new Tinypool({
    filename: path.resolve(__dirname, './worker.js'),
    minThreads: 1,
    maxThreads: 4,
  });
}
