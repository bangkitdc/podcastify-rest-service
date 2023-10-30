import { Router } from 'express';

import { RequestHelper } from '../helpers';
import { getEpisodeByIdSchema, createEpisodeSchema, updateEpisodeSchema } from '../dto';
import { EpisodeService } from '../services';
import { EpisodeController } from '../controllers';
import { AuthMiddleware } from '../middlewares';

const episodeService = new EpisodeService();
const episodeController = new EpisodeController(episodeService);

const episodeRoute = Router();

episodeRoute
  .get(
    '/episode',
    RequestHelper.exceptionGuard(episodeController.getAllEpisodes)
  )
  .get(
    '/episode/:episode_id',
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeById)
  )
  .post(
    '/episode',
    AuthMiddleware.authenticateToken,
    RequestHelper.validate(createEpisodeSchema),
    RequestHelper.exceptionGuard(episodeController.createEpisode)
  )
  .put(
    '/episode/:episode_id',
    // AuthMiddleware.authenticateToken,
    RequestHelper.validate(updateEpisodeSchema),
    RequestHelper.exceptionGuard(episodeController.updateEpisode)
  )
  .delete(
    '/episode/:episode_id', 
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(episodeController.deleteEpisode)
  )
  // .post(
  //   '/login',
  //   RequestHelper.validate(loginSchema), 
  //   RequestHelper.exceptionGuard(episodeController.login)
  // )
  // .post(
  //   '/register',
  //   RequestHelper.validate(registerSchema),
  //   RequestHelper.exceptionGuard(episodeController.register),
  // );

export default episodeRoute;