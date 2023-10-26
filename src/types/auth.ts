import { IRequestResponseHandler } from "./http"

export type IAuthController = {
  login: IRequestResponseHandler
  register: IRequestResponseHandler
}

export type IAuthService = {
  login: (
    username: string,
    password: string,
  ) => Promise<{
    user: {
      username: string
      name: string
    }
    token: string
  }>

  register: (
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string,
  ) => Promise<{
    user: {
      username: string
      name: string
    }
  }>
}