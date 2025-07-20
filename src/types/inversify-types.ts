export const TYPES = {
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),
  DatabaseService: Symbol.for('DatabaseService'),
  RedisService: Symbol.for('RedisService'),
  WorkerService: Symbol.for('WorkerService'),
  SocketIOWebSocketService: Symbol.for('SocketIOWebSocketService'),
} as const;

export type TYPES = typeof TYPES
