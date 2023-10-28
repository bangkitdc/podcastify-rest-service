import { Request, Response } from "express";
import { IUserController, IUserService } from "../types/user";
import { ResponseHelper } from "../helpers";
import { HttpStatusCode } from "../types/http";

class UserController implements IUserController {
  constructor(private userService: IUserService) {
    this.getSelf = this.getSelf.bind(this);
  }

  async getSelf(req: Request, res: Response) {
    const data = await this.userService.getUserByUsername(res.locals.user.username);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation successful',
      {
        email: data?.email,
        username: data?.username,
        first_name: data?.first_name,
        last_name: data?.last_name,
        role_id: data?.role_id
      }
    );
  }
}

export default UserController;