import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import fs from 'fs'
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Kysely, MysqlDialect, sql, type RawBuilder, type Sql } from 'kysely'
import { createPool } from 'mysql2'
import type { Database } from './Database.ts'
import { promisify } from 'util'
import Tinypool from 'tinypool'
import { logger } from 'hono/logger'
import { jsonMiddleware } from './jsonMiddleware.js'
import dotenv from 'dotenv'
import { Redis } from 'ioredis'

// 加载 .env 文件
dotenv.config()

// 获取当前目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 初始化线程池
const pool = new Tinypool({
  filename: path.resolve(__dirname, './worker.js'),
  minThreads: 1,
  maxThreads: 4,
})

// 初始化 MySQL 连接池
const mysqlPool = createPool({
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
      const val = field.string()
      return val === null ? null : val
    }
    return next()
  },
})

// 初始化 Redis 客户端
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT_CONTAINER),
})

// 初始化数据库（首次建表、插入等）
async function initDatabase() {
  try {
    const query = promisify(mysqlPool.query).bind(mysqlPool)
    const sqlScript = fs.readFileSync(path.resolve(__dirname, 'sql/db.sql'), 'utf-8')
    const statements = sqlScript.split(';').filter((stmt) => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await query({ sql: statement })
        console.log(`执行 SQL 成功: ${statement.trim().slice(0, 50)}...`)
      }
    }

    console.log('✅ 数据库初始化完成')
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error)
  }
}
await initDatabase()

// 配置 Kysely ORM
const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: mysqlPool,
  }),
})

const app = new Hono()
app.use(logger())
app.use(jsonMiddleware)

// 示例接口：获取 Redis 数据
// app.get('/api/redis', async (c) => {
//   await redis.set('hello', 'world', 'EX', 60)
//   const value = await redis.get('hello')
//   return c.json({ redisValue: value })
// })

// 示例接口：调用 Worker 线程
// app.get('/api/getUsers', async (c) => {
//   const sum = await pool.run(null)
//   return c.jsonFmt({
//     success: true,
//     data: { id: 1, name: 'test', password: 'test', sum },
//   })
// })

// 更新用户信息
app.post('/api/user/update', async (c) => {
  const id = c.req.query('id')
  const { name, password } = await c.req.json()

  const updates: any[] = []

  if (name) updates.push(sql`name = ${name}`)
  if (password) updates.push(sql`password = ${password}`)
  
  await sql`
    UPDATE user
    SET ${sql.join(updates, sql`, `)}
    WHERE id = ${id}
  `.execute(db)

  return c.json({ success: true, message: '用户更新成功' })
})

app.post('/api/user/add', async (c) => {
  const { name, password } = await c.req.json()

  await sql`
    INSERT INTO user (id, name, password)
    VALUES (UUID_SHORT(), ${name}, ${password})
  `.execute(db)

  return c.json({ success: true, message: '用户创建成功' })
})

app.get('/api/user', async (c) => {
  const result = await sql`SELECT * FROM user`.execute(db)
  return c.json({ success: true, data: result.rows })
})

// 删除用户（通过 query 参数获取 id）
app.post('/api/user/del', async (c) => {
  const id = c.req.query('id')

  await sql`DELETE FROM user WHERE id = ${id}`.execute(db)

  return c.json({ success: true, message: '用户删除成功' })
})

// 启动服务
const port = Number(process.env.NODE_PORT_CONTAINER) || 3000
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`)
  }
)
