import { injectable } from 'inversify';
import Tinypool from 'tinypool';
import { createWorkerPool } from '../config/db.js';

export interface IWorkerService {
  run<T, R>(task: T): Promise<R>;
}

@injectable()
export class WorkerService implements IWorkerService {
  private pool: Tinypool;

  constructor() {
    this.pool = createWorkerPool();
  }

  async run<T, R>(task: T): Promise<R> {
    return await this.pool.run(task);
  }
}
