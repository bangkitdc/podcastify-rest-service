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

  async getEpisodesByCreatorId(creator_id: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const totalData = await this.episodeModel.count({
      where: {
        creator_id: creator_id
      },
    });
    
    const episodes = await this.episodeModel.findMany({
      where: {
        creator_id: creator_id
      },
      orderBy: {
        episode_id: 'desc'
      },
      select: {
        episode_id: true,
        title: true,
        description: true,
        user: {
          select: {
            first_name: true,
            last_name: true
          }
        },
        duration: true,
        image_url: true,
        audio_url: true,
        category: { 
          select: {
            name: true
          },
        },
      },
      take: limit,
      skip: offset
    });

    const totalPage = Math.ceil(totalData / limit);

    if (totalPage === 0) {
      return {
        total: totalData,
        current_page: 0,
        last_page: totalPage,
        data: episodes,
      }
    }

    if (page > totalPage) {
      throw new HttpError(HttpStatusCode.NotFound, "Requested page not found")
    }

    return {
      total: totalData,
      current_page: page,
      last_page: totalPage,
      data: episodes,
    };
  }

  async createEpisode(
    title: string, 
    description: string, 
    creator_id: number, 
    category_id: number,
    duration: number,
    image_url: string,
    audio_url: string 
  ) {
    const isCreatorExists = await this.userService.getUserById(creator_id);
    const isCategoryExists = await this.categoryService.getCategoryById(category_id);

    const errors: Record<string, string[]> = {};

    if (!isCreatorExists) {
      errors.creator_id = ["Creator Id is not exists"];
    }

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

    return await this.episodeModel.update({
      where: {
        episode_id: episodeData.episode_id
      },
      data: {
        title: episodeData.title,
        description: episodeData.description,
        creator_id: episodeData.creator_id,
        category_id: episodeData.category_id,
        duration: episodeData.duration,
        image_url: episodeData.image_url,
        audio_url: episodeData.audio_url
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