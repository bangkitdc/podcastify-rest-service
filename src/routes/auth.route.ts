import { Router } from 'express';

import { RequestHelper } from '../helpers';
import { loginSchema, registerSchema } from '../dto';
import { AuthService, UserService } from '../services';
import { AuthController } from '../controllers';

const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);

const authRoute = Router();

authRoute
  .post(
    '/login',
    RequestHelper.validate(loginSchema), 
    RequestHelper.exceptionGuard(authController.login)
  )
  .post(
    '/register',
    RequestHelper.validate(registerSchema),
    RequestHelper.exceptionGuard(authController.register),
  );

export default authRoute;
