import { IRequestResponseHandler } from "./http"

export type IEpisode = {
  episode_id: number
  title: string
  description: string
  creator_id: number     
  category_id: number
  duration: number     
  image_url?: string | null
  audio_url: string
  created_at: Date
  updated_at: Date
}

export type IEpisodePaginateData = {
  episode_id: number
  title: string
  description: string
  user: {
    first_name: string
    last_name: string
  }    
  category: {
    name: string
  }
  duration: number     
  image_url?: string | null
  audio_url: string
}

export type IEpisodePagination = {
  total: number
  current_page: number
  last_page: number
  data: IEpisodePaginateData[] | null
}

export type IEpisodeForm = {
  episode_id?: number
  title: string
  description: string
  creator_id: number
  category_id: number
  duration: number
  image_url?: string | null
  audio_url: string
}

export type IEpisodeComment = {
  comment_id: number
  episode_id: number
  user_id: number
  username: string
  comment_text: string
  created_at: Date
  updated_at: Date
}

export type IEpisodeController = {
  getAllEpisodes: IRequestResponseHandler
  getEpisodeById: IRequestResponseHandler
  getEpisodesByCreatorId: IRequestResponseHandler
  createEpisode: IRequestResponseHandler
  updateEpisode: IRequestResponseHandler
  deleteEpisode: IRequestResponseHandler

  likeEpisode: IRequestResponseHandler
  getEpisodeLikes: IRequestResponseHandler

  createEpisodeComment: IRequestResponseHandler
  getEpisodeComments: IRequestResponseHandler
}

export type IEpisodeService = {
  getAllEpisodes: () => Promise<IEpisode[]>
  getEpisodeById: (episode_id: number) => Promise<IEpisode>
  getEpisodesByCreatorId: (creator_id: number, page: number, limit: number) => Promise<IEpisodePagination | null> 
  createEpisode: (
    title: string, 
    description: string, 
    creator_id: number, 
    category_id: number,
    duration: number,
    image_url: string,
    audio_url: string,
  ) => Promise<IEpisode>

  updateEpisode: (arg0: IEpisodeForm) => Promise<IEpisode>
  deleteEpisode: (episode_id: number) => Promise<IEpisode>

  likeEpisode: (episode_id: number, user_id: number) => Promise<boolean>
  getEpisodeLikes: (episode_id: number) => Promise<number>

  createEpisodeComment: (episode_id: number, user_id: number, username: string, comment_text: string) => Promise<IEpisodeComment | null>
  getEpisodeComments: (episode_id: number) => Promise<IEpisodeComment[] | null>
}