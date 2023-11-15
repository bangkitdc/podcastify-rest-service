import { NextFunction, Request, Response, Router } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { RequestHelper } from '../helpers';
import {
  getEpisodeByIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
  createEpisodeCommentSchema, 
  episodeLikeSchema, 
  getEpisodesByCreatorIdSchema
} from '../dto';
import { EpisodeService } from '../services';
import { EpisodeController } from '../controllers';
import { AuthMiddleware } from '../middlewares';

import { extensions} from '../types/files';
import { ApiService } from '../types/http';

const episodeService = new EpisodeService();
const episodeController = new EpisodeController(episodeService);

const episodeRoute = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/storage');
  },
  filename: (req, file, cb) => {
    const extension = extensions[file.mimetype]
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    extension ? cb(null, uniqueSuffix + '_' + file.originalname) : cb(null, '');
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  
  const allowedExtensions = ['.mp3', '.png', '.jpeg', '.jpg'];
  const extension = extensions[file.mimetype];  
  
  if ((allowedExtensions.includes(extension))) {
      cb(null, true);
  } else {
    cb(new Error('Invalid file type.'));
  }
};

const uploadFile = multer({storage: storage, fileFilter: fileFilter, limits: {fieldSize: 10 * 1024 * 1024}})

episodeRoute
  .get(
    '/episode',
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(episodeController.getAllEpisodes),
  )

  .get(
    '/episode/:episode_id',
    (req: Request, res: Response, next: NextFunction) => {
      const header = req.headers['x-api-key'];

      if (header == process.env.APP_API_KEY) { // From Monolith
        AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE)(req, res, next);
      } else { // From SPA
        AuthMiddleware.authenticateToken(req, res, next);
      }
    },
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeById),
  )

  .get(
    '/episode/creator/:creator_id',
    (req: Request, res: Response, next: NextFunction) => {
      const header = req.headers['x-api-key'];

      if (header == process.env.APP_API_KEY) { // From Monolith
        AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE)(req, res, next);
      } else { // From SPA
        AuthMiddleware.authenticateToken(req, res, next);
      }
    },
    RequestHelper.validate(getEpisodesByCreatorIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodesByCreatorId)
  )

  .post( 
    '/episode',
    AuthMiddleware.authenticateToken,
    RequestHelper.fileHandler(uploadFile),
    RequestHelper.validate(createEpisodeSchema),
    RequestHelper.exceptionGuard(episodeController.createEpisode)
  )

  // Ini harus duluan (prefix)
  .post(
    '/episode/like',
    AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE),
    RequestHelper.validate(episodeLikeSchema),
    RequestHelper.exceptionGuard(episodeController.likeEpisode)
  )

  .post(
    '/episode/comment',
    AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE),
    RequestHelper.validate(createEpisodeCommentSchema),
    RequestHelper.exceptionGuard(episodeController.createEpisodeComment)
  )

  .post(
    '/episode/:episode_id',
    AuthMiddleware.authenticateToken,
    RequestHelper.fileHandler(uploadFile),
    RequestHelper.validate(updateEpisodeSchema),
    RequestHelper.exceptionGuard(episodeController.updateEpisode),
  )

  .delete(
    '/episode/:episode_id',
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(episodeController.deleteEpisode)
  )

  .get(
    '/episode/downloadImage/:episode_id',
    (req: Request, res: Response, next: NextFunction) => {
      const header = req.headers['x-api-key'];

      if (header == process.env.APP_API_KEY) { // From Monolith
        AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE)(req, res, next);
      } else { // From SPA
        AuthMiddleware.authenticateToken(req, res, next);
      }
    },
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeImageFileById),
  )
  
  .get(
    '/episode/downloadAudio/:episode_id',
    (req: Request, res: Response, next: NextFunction) => {
      const header = req.headers['x-api-key'];

      if (header == process.env.APP_API_KEY) { // From Monolith
        AuthMiddleware.authenticateApiKey(ApiService.APP_SERVICE)(req, res, next);
      } else { // From SPA
        AuthMiddleware.authenticateToken(req, res, next);
      }
    },
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeAudioFileById),
  )
  ;

export default episodeRoute;