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

export type IUserAuth = {
  user_id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role_id: number
}

export type IUserForm = {
  user_id?: number
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
}

export type IUserPagination = {
  total: number
  current_page: number
  last_page: number
  data: IUserToApp[] | null
}

export type IUserToApp = {
  user_id: number
  email: string
  username: string
  first_name: string
  last_name: string
  status: string
}

export enum UserRoleId {
  Admin = 1,
  User = 2
}

export type IUserService = {
  getUserById: (user_id: number) => Promise<IUser | null>
  getUserByUsername: (username: string) => Promise<IUser | null>
  getUserByEmail: (email: string) => Promise<IUser | null>
  getCreatorsBySubscriberId: (issuer_id: number, page: number, limit: number) => Promise<IUserPagination | null> 
  getCreatorWithStatus: (creator_id: number, subscriber_id: number) => Promise<IUserToApp | null>
}

export type IUserController = {
  getSelf: IRequestResponseHandler
  getCreatorsBySubscriberId: IRequestResponseHandler
  getCreatorWithStatus: IRequestResponseHandler
}