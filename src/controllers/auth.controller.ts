import { Request, Response } from 'express';
import { IAuthController, IAuthService } from '../types/auth';
import { HttpStatusCode } from '../types/http';
import { ResponseHelper } from '../helpers';

class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const data = await this.authService.login(username, password);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Login successful',
      data
    );
  }

  async register(req: Request, res: Response) {
    const { email, username, first_name, last_name, password } = req.body;
    const user = await this.authService.register(
      email,
      username,
      first_name,
      last_name,
      password,
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Created,
      'Register successful',
      user
    );
  }
}

export default AuthController;
