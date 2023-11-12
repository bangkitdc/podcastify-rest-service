import { Request, Response } from 'express';
import { HttpError, ResponseHelper } from '../helpers';
import {
  IEpisodeController,
  IEpisodeForm,
  IEpisodeService,
} from '../types/episode';
import { HttpStatusCode } from '../types/http';

class EpisodeController implements IEpisodeController {
  constructor(private episodeService: IEpisodeService) {
    this.getAllEpisodes = this.getAllEpisodes.bind(this);
    this.getEpisodeById = this.getEpisodeById.bind(this);
    this.getEpisodesByCreatorId = this.getEpisodesByCreatorId.bind(this);
    this.createEpisode = this.createEpisode.bind(this);
    this.updateEpisode = this.updateEpisode.bind(this);
    this.deleteEpisode = this.deleteEpisode.bind(this);

    this.likeEpisode = this.likeEpisode.bind(this);
  }

  async getAllEpisodes(req: Request, res: Response) {
    const data = await this.episodeService.getAllEpisodes();

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      data,
    );
  }

  async getEpisodeById(req: Request, res: Response) {
    const { episode_id } = req.params;
    const episode = await this.episodeService.getEpisodeById(
      parseInt(episode_id),
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      episode,
    );
  }

  async getEpisodesByCreatorId(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { creator_id } = req.params;
    const episodes = await this.episodeService.getEpisodesByCreatorId(parseInt(creator_id), page, limit);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      episodes
    );
  }

  async createEpisode(req: Request, res: Response) {
    const {
      title,
      description,
      category_id,
      duration,
    } = req.body;

    const creator_id = res.locals.user.user_id;

    let image_url = '';
    let audio_url = '';
    if (Array.isArray(req.files)) {
      const audioFile = req.files[0];
      const imageFile = req.files[1] ?? ''

      image_url = imageFile ? imageFile.filename : ''
      audio_url =  audioFile ? audioFile.filename : ''
    }

    const episode = await this.episodeService.createEpisode(
      title,
      description,
      creator_id,
      Number(category_id),
      Number(duration),
      image_url,
      audio_url,
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Created,
      'Episode created successfully',
      episode,
    );
  }

  async updateEpisode(req: Request, res: Response) {
    const { episode_id } = req.params;

    const episodeData: IEpisodeForm = req.body;

    const creator_id = res.locals.user.user_id;

    let image_url = '';
    let audio_url = '';
    
    if (Array.isArray(req.files)) {
      const audioFile = req.files[0];
      const imageFile = req.files[1] ?? ''

      image_url = imageFile ? imageFile.filename : ''
      audio_url =  audioFile ? audioFile.filename : ''
    }
    
    episodeData.image_url = image_url;
    episodeData.audio_url = audio_url;

    episodeData.episode_id = parseInt(episode_id);
    episodeData.creator_id = creator_id;

    const episode = await this.episodeService.updateEpisode(episodeData);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Episode updated successfully',
      episode,
    );
  }

  async deleteEpisode(req: Request, res: Response) {
    const { episode_id } = req.params;

    const episode = await this.episodeService.deleteEpisode(
      parseInt(episode_id),
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Episode deleted successfully',
      episode,
    );
  }

  async likeEpisode (req: Request, res: Response) {
    console.log("hehe");
    const {
      episode_id
    } = req.body;

    const id = parseInt(res.locals.id);
    throw new HttpError(HttpStatusCode.Conflict, "aaa", {id});

    const isLiked = await this.episodeService.likeEpisode(episode_id, parseInt(res.locals.id));

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      `Episode ${isLiked ? 'Liked': 'Unliked'} successfully`
    );
  }

  // async getLikesCount (req: Request, res: Response) {
  //   const {  }
  // }
}

export default EpisodeController;