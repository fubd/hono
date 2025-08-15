export const TYPES = {
  DatabaseService: Symbol.for('DatabaseService'),
  RedisService: Symbol.for('RedisService'),
  WorkerService: Symbol.for('WorkerService'),
  FileUploadService: Symbol.for('FileUploadService'),
  SocketIOWebSocketService: Symbol.for('SocketIOWebSocketService'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),
} as const;

export type TYPES = typeof TYPES;
