import type {Context} from 'hono';
import {inject, injectable} from 'inversify';
import type {IRedisService} from '../services/RedisService.js';
import type {ISocketIOWebSocketService} from '../services/SocketIOWebSocketService.js';
import type {IWorkerService} from '../services/WorkerService.js';
import {TYPES} from '../types/inversify-types.js';
import type {IUserService} from './types.js';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.RedisService) private redisService: IRedisService,
    @inject(TYPES.WorkerService) private workerService: IWorkerService,
    @inject(TYPES.SocketIOWebSocketService) private socketService: ISocketIOWebSocketService,
  ) {}

  async getUser(c: Context) {
    try {
      const id = c.req.query('id');
      if (!id) {
        return c.json({success: false, error: '缺少用户ID'});
      }
      const user = await this.userService.getUserById(id);
      if (!user) {
        return c.json({success: false, error: '用户不存在'});
      }
      return c.json({success: true, data: user});
    } catch (error) {
      return c.json({success: false});
    }
  }

  async getUsers(c: Context) {
    try {
      const users = await this.userService.getAllUsers();
      return c.json({success: true, data: users});
    } catch (error) {
      return c.json({success: false});
    }
  }

  async createUser(c: Context) {
    try {
      const {name, password} = await c.req.json();
      await this.userService.createUser({name, password});
      return c.json({success: true, message: '用户创建成功'});
    } catch (error) {
      return c.json({success: false});
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.query('id');
      const {name, password} = await c.req.json();

      if (!id) {
        return c.json({success: false, error: '缺少用户ID'});
      }

      await this.userService.updateUser(id, {name, password});
      return c.json({success: true, message: '用户更新成功'});
    } catch (error) {
      return c.json({success: false});
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.query('id');

      if (!id) {
        return c.json({success: false, error: '缺少用户ID'}, 400);
      }

      await this.userService.deleteUser(id);

      // 测试广播
      this.socketService.broadcast('testEvent', {message: 'Hello WebSocket'});
      return c.json({success: true, message: '用户删除成功'});
    } catch (error) {
      return c.json({success: false});
    }
  }

  async testRedis(c: Context) {
    try {
      await this.redisService.set('hello', 'world', 60);
      const value = await this.redisService.get('hello');
      return c.json({redisValue: value});
    } catch (error) {
      return c.json({success: false});
    }
  }

  async testWorker(c: Context) {
    try {
      const result = await this.workerService.run(null);
      return c.json({
        success: true,
        data: {id: 1, name: 'test', password: 'test', sum: result},
      });
    } catch (error) {
      return c.json({success: false});
    }
  }
}
