import { Router } from "express";
import { UserController } from "../controllers";
import { UserService } from "../services";
import { AuthMiddleware } from "../middlewares";
import { RequestHelper } from "../helpers";
import { ApiService } from "../types/http";
import { getCreatorWithStatusSchema, getCreatorsBySubscriberIdSchema } from "../dto/user.dto";

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
    RequestHelper.validate(getCreatorsBySubscriberIdSchema),
    RequestHelper.exceptionGuard(userController.getCreatorsBySubscriberId)
  )
  .get(
    '/creator/:creator_id',
    AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE),
    RequestHelper.validate(getCreatorWithStatusSchema),
    RequestHelper.exceptionGuard(userController.getCreatorWithStatus)
  );

export default userRoute;