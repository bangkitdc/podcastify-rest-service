import { Response } from "express"
import { IRequestResponseHandler } from "./http"
import { IUserAuth } from "./user"

export type IAuthController = {
  login: IRequestResponseHandler
  register: IRequestResponseHandler
  refreshToken: IRequestResponseHandler
}

export type IAuthService = {
  login: (
    res: Response,
    username: string,
    password: string,
  ) => Promise<{
    user: IUserAuth
    token: string
  }>

  register: (
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string,
  ) => Promise<void>

  refreshToken: (
    res: Response,
    token: string | null
  ) => Promise<{
    token: string
  }>
}