import { z } from 'zod';

const getEpisodeByIdSchema = z.object({
  params: z.object({
    episode_id: z.string({
      required_error: "Params Episode Id is required"
    }),
  })
});

const createEpisodeSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required"
    }),
    description: z.string({
      required_error: "Description is required"
    }),
    creator_id: z.number({
      required_error: "Perusahaan Id is required"
    }),
    category_id: z.number({
      required_error: "Category Id is required"
    }),
    duration: z.number({
      required_error: "Duration is required",
    }),
    audio_url: z.string({
      required_error: "Audio is required",
    })
  })
});

export {
  getEpisodeByIdSchema,
  createEpisodeSchema,
}