import { Request, Response } from 'express';
import { ResponseHelper } from '../helpers';
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
    this.getEpisodeImageFileById = this.getEpisodeImageFileById.bind(this);
    this.getEpisodeAudioFileById = this.getEpisodeAudioFileById.bind(this);
    this.getEpisodesByCreatorId = this.getEpisodesByCreatorId.bind(this);
    this.createEpisode = this.createEpisode.bind(this);
    this.updateEpisode = this.updateEpisode.bind(this);
    this.deleteEpisode = this.deleteEpisode.bind(this);

    this.likeEpisode = this.likeEpisode.bind(this);
    this.createEpisodeComment = this.createEpisodeComment.bind(this);
  }

  async getAllEpisodes(req: Request, res: Response) {
    const data = await this.episodeService.getAllEpisodes(parseInt(res.locals.user.user_id));

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
      parseInt(res.locals.id)
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      episode,
    );
  }

  async getEpisodeImageFileById(req: Request, res: Response) {
    const { episode_id } = req.params;
    
    const episode = await this.episodeService.getEpisodeById(
      parseInt(episode_id),
    );
    
    // if(episode.image_url) {
    return ResponseHelper.responseFileSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      episode.image_url,
    );
    // }
  }

  async getEpisodeAudioFileById(req: Request, res: Response) {
    const { episode_id } = req.params;
    
    const episode = await this.episodeService.getEpisodeById(
      parseInt(episode_id),
    );
    
    return ResponseHelper.responseFileSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      episode.audio_url,
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

    const creator_id = parseInt(res.locals.user.user_id);

    let image_url = '';
    let audio_url = '';
    
    if (Array.isArray(req.files)) {
      const audioFile = req.files.find(file => file.fieldname === 'audio_file');
      const imageFile = req.files.find(file => file.fieldname === 'image_file');

      image_url = imageFile ? imageFile.filename : (episodeData.image_url ?? '')
      audio_url =  audioFile ? audioFile.filename : episodeData.audio_url
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
    const {
      episode_id
    } = req.body;

    const isLiked = await this.episodeService.likeEpisode(episode_id, parseInt(res.locals.id));

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      `Episode ${isLiked ? 'Liked': 'Unliked'} successfully`
    );
  }

  async createEpisodeComment (req: Request, res: Response) {
    const { episode_id, username, comment_text } = req.body;

    console.log(episode_id, comment_text);

    const comment = await this.episodeService.createEpisodeComment(episode_id, parseInt(res.locals.id), username, comment_text);

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Created,
      'Comment created successfully',
      comment,
    );
  }
}

export default EpisodeController;