import { Router } from 'express';

import { RequestHelper } from '../helpers';
import { getEpisodeByIdSchema, createEpisodeSchema, updateEpisodeSchema } from '../dto';
import { EpisodeService } from '../services';
import { EpisodeController } from '../controllers';
import { AuthMiddleware } from '../middlewares';
import { getEpisodesByCreatorIdSchema } from '../dto/episode.dto';

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
  .get(
    '/episode/creator/:creator_id',
    RequestHelper.validate(getEpisodesByCreatorIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodesByCreatorId)
  )
  .post(
    '/episode',
    AuthMiddleware.authenticateToken,
    RequestHelper.validate(createEpisodeSchema),
    RequestHelper.exceptionGuard(episodeController.createEpisode)
  )
  .post(
    '/episode/:episode_id',
    AuthMiddleware.authenticateToken,
    RequestHelper.validate(updateEpisodeSchema),
    RequestHelper.exceptionGuard(episodeController.updateEpisode)
  )
  .delete(
    '/episode/:episode_id', 
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(episodeController.deleteEpisode)
  )

export default episodeRoute;