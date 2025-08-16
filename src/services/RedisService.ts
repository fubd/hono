import {injectable} from 'inversify';
import {Redis} from 'ioredis';

export function createRedisClient(): Redis {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT_CONTAINER),
  });
}

export interface IRedisService {
  getClient(): Redis;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
}

@injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = createRedisClient();
  }

  getClient(): Redis {
    return this.redis;
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }
}
