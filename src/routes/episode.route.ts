import { Request, Router } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { RequestHelper } from '../helpers';
import {
  getEpisodeByIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
} from '../dto';
import { EpisodeService } from '../services';
import { EpisodeController } from '../controllers';
import { AuthMiddleware } from '../middlewares';
import { getEpisodesByCreatorIdSchema } from '../dto/episode.dto';

import { extensions} from '../types/files';

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
    RequestHelper.exceptionGuard(episodeController.getAllEpisodes),
  )
  .get(
    '/episode/:episode_id',
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeById),
  )
  .get(
    '/episode/downloadImage/:episode_id',
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeImageFileById),
  )
  .get(
    '/episode/downloadAudio/:episode_id',
    RequestHelper.validate(getEpisodeByIdSchema),
    RequestHelper.exceptionGuard(episodeController.getEpisodeAudioFileById),
  )
  .get(
    '/episode/creator/:creator_id',
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
  );

export default episodeRoute;