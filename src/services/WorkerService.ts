import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {injectable} from 'inversify';
import Tinypool from 'tinypool';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createWorkerPool(): Tinypool {
  return new Tinypool({
    filename: path.resolve(__dirname, './worker.js'),
    minThreads: 1,
    maxThreads: 4,
  });
}

export interface IWorkerService {
  run<T, R>(task: T): Promise<R>;
}

@injectable()
export class WorkerService {
  private pool: Tinypool;

  constructor() {
    this.pool = createWorkerPool();
  }

  async run<T, R>(task: T): Promise<R> {
    return await this.pool.run(task);
  }
}
