import { IRequestResponseHandler } from "./http"

export type IUser = {
  user_id: number
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
  role_id: number
  created_at: Date
  updated_at: Date
}

export enum UserRoleId {
  Admin = 1,
  User = 2
}

export type IUserService = {
  getUserByUsername: (username: string) => Promise<IUser | null>
  getUserByEmail: (email: string) => Promise<IUser | null>
}

export type IUserController = {
  getSelf: IRequestResponseHandler
}