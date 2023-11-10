import { HttpError } from "../helpers";
import prisma from "../models";
import { IEpisodeService } from "../types/episode";
import { HttpStatusCode } from "../types/http";
import { IUserService } from "../types/user";
import { UserService, CategoryService } from ".";
import { ICategoryService } from "../types/category";
import { IEpisodeForm } from "../types/episode";

class EpisodeService implements IEpisodeService {
  private episodeModel = prisma.episode;
  private userService: IUserService;
  private categoryService: ICategoryService;

  constructor() {
    this.userService = new UserService();
    this.categoryService = new CategoryService();
  }

  async getAllEpisodes() {
    const episodeList = await this.episodeModel.findMany({
      orderBy: [
        {
          episode_id: 'asc'
        }
      ]
    });

    return episodeList;
  }

  async getEpisodeById(episode_id: number) {
    return await this.episodeModel.findFirstOrThrow({
      where: {
        episode_id: episode_id
      }
    })
  }

  async createEpisode(
    title: string, 
    description: string, 
    creator_id: number, 
    category_id: number,
    duration: number,
    image_url: string = "",
    audio_url: string ,
  ) {    
    
    const isCategoryExists = await this.categoryService.getCategoryById(category_id);

    const errors: Record<string, string[]> = {};


    if (!isCategoryExists) {
      errors.category_id = ["Category Id is not exists"];
    }

    if (Object.keys(errors).length > 0) {
      throw new HttpError(
        HttpStatusCode.NotFound, 
        'Operation failed, please check your request again', 
        errors
      );
    }

    return await this.episodeModel.create({
      data: {
        title: title,
        description: description,
        creator_id: creator_id,
        category_id: category_id,
        duration: duration,
        image_url: image_url,
        audio_url: audio_url
      }
    });
  }

  async updateEpisode(
    episodeData: IEpisodeForm
  ) {
    const isEpisodeTitleExist = await this.episodeModel.findMany({
      where: {
        title: episodeData.title
      }
    })

    const errors: Record<string, string[]> = {};

    if(isEpisodeTitleExist.length > 1) {
      errors.title = ["Title already exists"]
    }

    if (Object.keys(errors).length > 0) {
      throw new HttpError(
        HttpStatusCode.NotFound, 
        'Operation failed, please check your request again', 
        errors
      );
    }

    if(episodeData.image_url && episodeData.audio_url){
      return await this.episodeModel.update({
        where: {
          episode_id: episodeData.episode_id
        },
        data: {
          title: episodeData.title,
          description: episodeData.description,
          creator_id: episodeData.creator_id,
          category_id: Number(episodeData.category_id),
          duration: Number(episodeData.duration),
          image_url: episodeData.image_url,
          audio_url: episodeData.audio_url
        }
      })
    }

    if(episodeData.image_url){
      return await this.episodeModel.update({
        where: {
          episode_id: episodeData.episode_id
        },
        data: {
          title: episodeData.title,
          description: episodeData.description,
          creator_id: episodeData.creator_id,
          category_id: Number(episodeData.category_id),
          image_url: episodeData.image_url,
        }
      })
    }

    if(episodeData.audio_url){
      return await this.episodeModel.update({
        where: {
          episode_id: episodeData.episode_id
        },
        data: {
          title: episodeData.title,
          description: episodeData.description,
          creator_id: episodeData.creator_id,
          category_id: Number(episodeData.category_id),
          duration: Number(episodeData.duration),
          audio_url: episodeData.audio_url
        }
      })
    }

    return await this.episodeModel.update({
      where: {
        episode_id: episodeData.episode_id
      },
      data: {
        title: episodeData.title,
        description: episodeData.description,
        creator_id: episodeData.creator_id,
        category_id: Number(episodeData.category_id),
      }
    })
  }

  async deleteEpisode(episode_id : number) {
    const isEpisodeExist = await this.episodeModel.findFirst({
      where: {
        episode_id: episode_id
      }
    })

    const errors: Record<string, string[]> = {};

    if(!isEpisodeExist){
      errors.episode_id = ["Episode does not exist"]
    }

    if (Object.keys(errors).length > 0) {
      throw new HttpError(
        HttpStatusCode.NotFound, 
        'Operation failed, please check your request again', 
        errors
      );
    }

    return await this.episodeModel.delete({
      where: {
        episode_id: episode_id
      }
    })
  }
}

export default EpisodeService;