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

export type IEpisodeController = {
  getAllEpisodes: IRequestResponseHandler
  getEpisodeById: IRequestResponseHandler
  createEpisode: IRequestResponseHandler
}

export type IEpisodeService = {
  getAllEpisodes: () => Promise<IEpisode[]>
  getEpisodeById: (episode_id: number) => Promise<IEpisode>
  createEpisode: (
    title: string, 
    description: string, 
    creator_id: number, 
    category_id: number,
    duration: number,
    image_url: string,
    audio_url: string
  ) => Promise<IEpisode>

  // TODO: Irsyad
  // updateEpisode: (arg0: IEpisodeForm) => Promise<IEpisode>
  // deleteEpisode: (episode_id: number) => Promise<IEpisode>
}