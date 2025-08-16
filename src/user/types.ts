import type {UserModel} from '../models/user.js';

export * from '../models/user.js';

export interface UserDRO {
  success: boolean;
  data?: UserModel;
  msg?: string;
}

export interface UserListDRO {
  success: boolean;
  data?: UserModel[];
  msg?: string;
}

export interface CreateUserDTO {
  name: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  password?: string;
}

export interface IUserService {
  getUserById(id: string): Promise<UserModel | null>;
  getAllUsers(): Promise<UserModel[]>;
  createUser(data: CreateUserDTO): Promise<string>;
  updateUser(id: string, data: UpdateUserDTO): Promise<string>;
  deleteUser(id: string): Promise<void>;
}
