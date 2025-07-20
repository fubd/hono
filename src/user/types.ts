import type { UserModel } from "../models/user.js"

export * from "../models/user.js"

export interface UserDRO extends UserModel {}

export interface CreateUserDTO {
  name: string
  password: string
}

export interface UpdateUserDTO {
  name?: string
  password?: string
}

export interface IUserService {
  getUserById(id: string): Promise<UserDRO | null>
  getAllUsers(): Promise<UserDRO[]>
  createUser(data: CreateUserDTO): Promise<string>
  updateUser(id: string, data: UpdateUserDTO): Promise<string>
  deleteUser(id: string): Promise<void>
}
