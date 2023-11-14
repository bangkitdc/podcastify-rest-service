import { Request, Response } from 'express';
import { IAuthController, IAuthService } from '../types/auth';
import { HttpStatusCode } from '../types/http';
import { AuthHelper, ResponseHelper } from '../helpers';
import { client } from '../models';

class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const data = await this.authService.login(res, username, password);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Login successful',
      data
    );
  }

  async register(req: Request, res: Response) {
    const { email, username, first_name, last_name, password } = req.body;
    await this.authService.register(
      email,
      username,
      first_name,
      last_name,
      password,
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Created,
      'Register successful'
    );
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.jid;
    const data = await this.authService.refreshToken(res, refreshToken);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Token has been refreshed',
      data
    );
  }

  async logout(req: Request, res: Response) {
    // Delete key
    await client.del(`user:${res.locals.user.user_id}`);

    AuthHelper.sendRefreshToken(res, "");

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Logout successfully'
    );
  }
}

export default AuthController;
