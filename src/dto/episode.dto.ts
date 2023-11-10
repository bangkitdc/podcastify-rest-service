import { z } from 'zod';
import { zfd } from 'zod-form-data';

const getEpisodeByIdSchema = z.object({
  params: z.object({
    episode_id: z
      .string({
        required_error: 'Params Episode Id is required',
      })
      .min(1, {
        message: 'Params Episode Id is required',
      }),
  }),
});

const createEpisodeSchema = z.object({
  body: zfd.formData({
    title: zfd.text(
      z
        .string({
          required_error: 'Title is required',
        })
        .min(1, {
          message: 'Title is required',
        }),
    ),

    description: zfd.text(
      z
        .string({
          required_error: 'Description is required',
        })
        .min(1, {
          message: 'Description is required',
        }),
    ),

    category_id: z
      .string({
        required_error: 'Category Id is required',
      })
      .min(1, {
        message: 'Category Id is required',
      }),
  }),
});

const updateEpisodeSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(1, {
        message: 'Title is required',
      }),

    description: z
      .string({
        required_error: 'Description is required',
      })
      .min(1, {
        message: 'Description is required',
      }),

    category_id: z
      .string({
        required_error: 'Category Id is required',
      })
      .min(1, {
        message: 'Category Id is required',
      }),
  }),
});

export { getEpisodeByIdSchema, createEpisodeSchema, updateEpisodeSchema };
