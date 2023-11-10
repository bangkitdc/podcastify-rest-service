import { Router } from "express";
import { UserController } from "../controllers";
import { UserService } from "../services";
import { AuthMiddleware } from "../middlewares";
import { RequestHelper } from "../helpers";
import { ApiService } from "../types/http";

const userService = new UserService();
const userController = new UserController(userService);

const userRoute = Router();

userRoute
  .get(
    '/self', 
    AuthMiddleware.authenticateToken, 
    RequestHelper.exceptionGuard(userController.getSelf)
  )
  .get(
    '/creator',
    AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE),
    RequestHelper.exceptionGuard(userController.getAllCreators)
  );

export default userRoute;