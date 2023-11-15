import { Router } from 'express';

import { RequestHelper } from '../helpers';
import { loginSchema, registerSchema } from '../dto';
import { AuthService } from '../services';
import { AuthController } from '../controllers';
import { AuthMiddleware } from '../middlewares';

const authService = new AuthService();
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
  )

  .post(
    '/refresh_token',
    RequestHelper.exceptionGuard(authController.refreshToken)
  )
  
  .post(
    '/logout',
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(authController.logout)
  );

export default authRoute;
