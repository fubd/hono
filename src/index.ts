import fs from 'node:fs';
import {Server as HttpServer} from 'node:http';
import path, {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {serve} from '@hono/node-server';
import {serveStatic} from '@hono/node-server/serve-static';
import dotenv from 'dotenv';
import {Hono} from 'hono';
import {logger} from 'hono/logger';
import {Container} from 'inversify';
import {Redis} from 'ioredis';
import {Kysely, MysqlDialect, type RawBuilder, type Sql, sql} from 'kysely';
import {createPool} from 'mysql2';
import Tinypool from 'tinypool';
import {DatabaseService, type IDatabaseService} from './services/DatabaseService.js';
import {FileUploadService, type IFileUploadService} from './services/FileUploadService.js';
import {type IRedisService, RedisService} from './services/RedisService.js';
import {type ISocketIOWebSocketService, SocketIOWebSocketService} from './services/SocketIOWebSocketService.js';
import {type IWorkerService, WorkerService} from './services/WorkerService.js';
import {TYPES} from './types/inversify-types.js';
import {type IUserService, UserController, UserService} from './user/index.js';

// 加载 .env 文件
dotenv.config();

const app = new Hono();
app.use(logger());

const container = new Container();

container.bind<IDatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IRedisService>(TYPES.RedisService).to(RedisService).inSingletonScope();
container.bind<IWorkerService>(TYPES.WorkerService).to(WorkerService).inSingletonScope();
container
  .bind<ISocketIOWebSocketService>(TYPES.SocketIOWebSocketService)
  .to(SocketIOWebSocketService)
  .inSingletonScope();
container.bind<IFileUploadService>(TYPES.FileUploadService).to(FileUploadService).inSingletonScope();

container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();

const databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
await databaseService.initDatabase();

const socketService = container.get<ISocketIOWebSocketService>(TYPES.SocketIOWebSocketService);

const fileUploadService = container.get<FileUploadService>(TYPES.FileUploadService);
app.post('/api/upload', async (c) => {
  return await fileUploadService.handleUpload(c);
});

const userController = container.get<UserController>(TYPES.UserController);
app.get('/api/user/list', (c) => userController.getUsers(c));
app.get('/api/user', (c) => userController.getUser(c));
app.post('/api/user/add', (c) => userController.createUser(c));
app.post('/api/user/update', (c) => userController.updateUser(c));
app.post('/api/user/del', (c) => userController.deleteUser(c));

// 启动服务
const port = Number(process.env.NODE_PORT_CONTAINER) || 3000;
const server = serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
  },
);

socketService.attachToHttpServer(server);
