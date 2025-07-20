import { injectable, inject } from 'inversify';
import type { CreateUserDTO, IUserService, UpdateUserDTO, UserDRO, UserModel } from './types.js';
import { TYPES } from '../types/inversify-types.js';
import { sql } from 'kysely';
import type { IDatabaseService } from '../services/DatabaseService.js';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.DatabaseService) private databaseService: IDatabaseService
  ) {}

  async getUserById(id: string): Promise<UserModel | null> {
    const db = this.databaseService.getDb();
    const result = await sql<UserModel>`
      SELECT * from user where id = ${id}
    `.execute(db)
    return result.rows[0] || null;
  }

  async getAllUsers(): Promise<UserModel[]> {
    const db = this.databaseService.getDb();
    const result = await sql<UserModel>`
      SELECT * FROM user
    `.execute(db);
    return result.rows
  }

  async createUser({name, password}: CreateUserDTO): Promise<string> {
    const db = this.databaseService.getDb();
    const result = await sql<{ uuid: string }>
      `SELECT UUID_SHORT() as uuid
    `.execute(db);
    const insertId = result.rows[0].uuid;

    await sql`
      INSERT INTO user (id, name, password)
      VALUES (${insertId}, ${name}, ${password})
    `.execute(db);

    return insertId;
  }

  async updateUser(id: string, {name, password}: UpdateUserDTO): Promise<string> {
    const db = this.databaseService.getDb();
    const updates: any[] = [];
    if (name) updates.push(sql`name = ${name}`);
    if (password) updates.push(sql`password = ${password}`);
    if (updates.length > 0) {
      await sql`
        UPDATE user
        SET ${sql.join(updates, sql`, `)}
        WHERE id = ${id}
      `.execute(db);
    }
    return id;
  }

  async deleteUser(id: string): Promise<void> {
    const db = this.databaseService.getDb();
    await sql`
      DELETE FROM user WHERE id = ${id}
    `.execute(db);
  }
}
