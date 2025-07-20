import { serve } from '@hono/node-server'
import { Server as HttpServer } from 'http'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import fs from 'fs'
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Kysely, MysqlDialect, sql, type RawBuilder, type Sql } from 'kysely'
import { createPool } from 'mysql2'
import { promisify } from 'util'
import Tinypool from 'tinypool'
import { logger } from 'hono/logger'
import dotenv from 'dotenv'
import { Redis } from 'ioredis'
import { Container } from 'inversify'
import { type IDatabaseService, DatabaseService } from './services/DatabaseService.js'
import { type IRedisService, RedisService } from './services/RedisService.js'
import { type IWorkerService, WorkerService } from './services/WorkerService.js'
import { TYPES } from './types/inversify-types.js'
import { UserController, UserService, type IUserService } from './user/index.js'
import { SocketIOWebSocketService, type ISocketIOWebSocketService } from './services/SocketIOWebSocketService.js'

// 加载 .env 文件
dotenv.config()

const app = new Hono()
app.use(logger())

const container = new Container();

container.bind<IDatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IRedisService>(TYPES.RedisService).to(RedisService).inSingletonScope();
container.bind<IWorkerService>(TYPES.WorkerService).to(WorkerService).inSingletonScope();
container.bind<ISocketIOWebSocketService>(TYPES.SocketIOWebSocketService).to(SocketIOWebSocketService).inSingletonScope();

container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();

const databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
await databaseService.initDatabase();

const socketService = container.get<ISocketIOWebSocketService>(
  TYPES.SocketIOWebSocketService
)
const userController = container.get<UserController>(TYPES.UserController);

app.get('/api/user/list', (c) => userController.getUsers(c));
app.get('/api/user', (c) => userController.getUser(c));
app.post('/api/user/add', (c) => userController.createUser(c));
app.post('/api/user/update', (c) => userController.updateUser(c));
app.post('/api/user/del', (c) => userController.deleteUser(c));

// 启动服务
const port = Number(process.env.NODE_PORT_CONTAINER) || 3000
const server = serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`)
  }
)

socketService.attachToHttpServer(server)