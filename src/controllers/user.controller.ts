import { Request, Response } from "express";
import { IUserController, IUserService } from "../types/user";
import { ResponseHelper } from "../helpers";
import { HttpStatusCode } from "../types/http";

class UserController implements IUserController {
  constructor(private userService: IUserService) {
    this.getSelf = this.getSelf.bind(this);
    this.getCreatorsBySubscriberId = this.getCreatorsBySubscriberId.bind(this);
    this.getCreatorWithStatus = this.getCreatorWithStatus.bind(this);
  }

  async getSelf(req: Request, res: Response) {
    const data = await this.userService.getUserById(res.locals.user.user_id);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation successful',
      {
        user_id: data?.user_id,
        email: data?.email,
        username: data?.username,
        first_name: data?.first_name,
        last_name: data?.last_name,
        role_id: data?.role_id
      }
    );
  }

  async getCreatorsBySubscriberId(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await this.userService.getCreatorsBySubscriberId(res.locals.id, page, limit);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation successful',
      data
    );
  }

  async getCreatorWithStatus(req: Request, res: Response) {
    // creator_id from params
    // subscriber_id from bearer token
    const { creator_id } = req.params;

    const data = await this.userService.getCreatorWithStatus(parseInt(creator_id), res.locals.id);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation successful',
      data
    );
  }
}

export default UserController;