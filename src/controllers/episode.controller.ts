import { Request, Response } from "express";
import { ResponseHelper } from "../helpers";
import { IEpisodeController, IEpisodeService } from "../types/episode";
import { HttpStatusCode } from "../types/http";

class EpisodeController implements IEpisodeController {
  constructor(private episodeService: IEpisodeService) {
    this.getAllEpisodes = this.getAllEpisodes.bind(this);
    this.getEpisodeById = this.getEpisodeById.bind(this);
    this.createEpisode = this.createEpisode.bind(this);
  }

  async getAllEpisodes(req: Request, res: Response) {
    const data = await this.episodeService.getAllEpisodes();

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      data
    );
  }

  async getEpisodeById(req: Request, res: Response) {
    const { episode_id } = req.params;
    const episode = await this.episodeService.getEpisodeById(parseInt(episode_id));

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      episode
    );
  }

  async createEpisode(req: Request, res: Response) {
    const { 
      title, 
      description, 
      creator_id, 
      category_id,
      duration,
      image_url,
      audio_url 
    } = req.body;

    const episode = await this.episodeService.createEpisode(
      title, 
      description, 
      creator_id, 
      category_id,
      duration,
      image_url,
      audio_url 
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Created,
      'Episode created successfully',
      episode
    );
  }
}

export default EpisodeController;